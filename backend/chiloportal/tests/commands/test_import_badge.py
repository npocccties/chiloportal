from ctypes import alignment
from io import StringIO
from django.test import TestCase
from django.core import management
from django.db.models import Q
from ...management.commands import import_badge
from ...enums import *
from ...exceptions import *
from ...models import *
from unittest import mock
import base64
import os
import re
import requests
import shutil

FIXTURE_DIR = os.path.join(os.path.dirname(__file__), "fixtures", "import_badge")
# 1x1 の PNG 画像
PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
)


def make_response(url, content, content_type):
    response = requests.Response()
    response.status_code = 200
    response.url = url
    response.encoding = "utf-8"
    response.headers["Content-Type"] = content_type
    response._content = content
    return response


class ImportBadgeCommandTests(TestCase):
    wisdom_badge_url = "https://moodle.example.org/badges/badge_json.php?id=41"
    knowledge_badge_url = "https://moodle.example.org/badges/badge_json.php?id=36"
    not_exist_badge_url = "https://moodle.example.org/badges/badge_json.php?id=9999"
    ng_url = "https://nonexistent.example.invalid/badges/badge_json.php?id=41"
    not_json_url = "https://moodle.example.org/course/view.php?id=52"
    image_url = "https://moodle.example.org/pluginfile.php/1/badges/badgeimage/41/f1"
    image_dir = "/tmp/hoge/"
    downloaded_file = os.path.join(
        image_dir, "moodle.example.org.pluginfile.php.1.badges.badgeimage.41.f1.png"
    )
    issuer_url = "https://moodle.example.org/badges/issuer_json.php?id=41"

    def setUp(self):
        self.portal_category = PortalCategory.objects.create(name="hoge", sort_key=1)
        # 外部の Moodle へアクセスせず、fixtures の応答を返す
        self.unexpected_urls = []
        patcher = mock.patch.object(
            import_badge.requests, "get", side_effect=self.fake_requests_get
        )
        patcher.start()
        self.addCleanup(patcher.stop)

    def tearDown(self):
        self.assertEqual(self.unexpected_urls, [], "想定外の URL にアクセスしました")

    def fake_requests_get(self, url):
        if url == self.ng_url:
            raise requests.exceptions.ConnectionError(
                f"Name or service not known: {url}"
            )
        match = re.fullmatch(
            r"https://moodle\.example\.org/badges/badge_json\.php\?id=(\d+)",
            url,
        )
        if match:
            path = os.path.join(FIXTURE_DIR, f"badge_json_{match.group(1)}.json")
            if os.path.exists(path):
                with open(path, "rb") as f:
                    return make_response(url, f.read(), "application/json")
        if url == self.not_json_url:
            return make_response(
                url,
                "<html><body>course</body></html>".encode(),
                "text/html; charset=utf-8",
            )
        if re.fullmatch(
            r"https://moodle\.example\.org/pluginfile\.php/\d+/badges/badgeimage/\d+/f1",
            url,
        ):
            return make_response(url, PNG_BYTES, "image/png")
        self.unexpected_urls.append(url)
        raise requests.exceptions.ConnectionError(f"unexpected url: {url}")

    def map_issuer(self, issuer_name, issuer_url, **issuer_fields):
        """組み合わせを、指定した内容のバッジ発行機関に対応づけておく（管理画面での対応づけにあたる）。"""
        issuer = Issuer.objects.create(**issuer_fields)
        IssuerMapping.objects.create(issuer_name=issuer_name, issuer_url=issuer_url, issuer=issuer)
        return issuer

    def map_test_university(self):
        # fixtures のバッジの issuer.name と issuer.url
        return self.map_issuer(
            "テスト大学", "https://moodle.example.org/",
            name="テスト大学", url="https://moodle.example.org/", email="",
        )

    def test_run_ok(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command(
            "import_badge",
            url=self.wisdom_badge_url,
            pcid=self.portal_category.id,
            stdout=stdout,
            stderr=stderr,
        )
        self.assertTrue("OK\n" in stdout.getvalue())
        self.assertNotEqual(stderr.getvalue(), "NG\n")

    def test_run_ng(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command(
            "import_badge",
            url=self.wisdom_badge_url,
            pcid=0,
            stdout=stdout,
            stderr=stderr,
        )
        self.assertFalse("OK\n" in stdout.getvalue())
        self.assertEqual(stderr.getvalue(), "NG\n")

    def test_find_portal_category_ok(self):
        cmd = import_badge.Command()
        portal_category = cmd.find_portal_category(self.portal_category.id)
        self.assertEqual(portal_category.id, self.portal_category.id)

    def test_find_portal_category_ng(self):
        cmd = import_badge.Command()
        portal_category = cmd.find_portal_category(0)
        self.assertEqual(portal_category, None)

    def test_do_import_ok(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.wisdom_badge_url)
        cmd.do_import(json, self.portal_category.id)
        self.assertEqual(WisdomBadges.objects.all().count(), 1)

    def test_do_import_notfound_portal_category(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.wisdom_badge_url)
        with self.assertRaises(AppException) as e:
            cmd.do_import(json, 0)
        self.assertEqual(
            e.exception.args[0], "ポータル独自カテゴリに存在しないIDが指定されましたので処理継続できません。pcid: 0"
        )

    def test_do_import_invalid_badge(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        json = {}
        with self.assertRaises(AppException) as e:
            cmd.do_import(json, self.portal_category.id)
        self.assertEqual(e.exception.args[0], "バッジ種別が判断できないので処理を中断します。")

    def test_do_import_knowledge_badge(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.knowledge_badge_url)
        with self.assertRaises(AppException) as e:
            cmd.do_import(json, self.portal_category.id)
        self.assertEqual(e.exception.args[0], "スタンプのため処理継続できません。バッジを指定してください。")

    def test_judge_wisdom_badge_version_wisdom(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=[], version="1.0-wisdom")
        self.assertEqual(badge_class, BadgeType.WISDOM)

    def test_judge_wisdom_badge_version_knowledge(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=[], version="1.0-knowledge")
        self.assertEqual(badge_class, BadgeType.KNOWLEDGE)

    def test_judge_wisdom_badge_version_none(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=[], version=None)
        self.assertEqual(badge_class, BadgeType.NONE)

    def test_judge_wisdom_badge_version_empty(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=[], version="")
        self.assertEqual(badge_class, BadgeType.NONE)

    def test_judge_wisdom_badge_exist_alignments(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.ALIGNMENTS.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=[], version="")
        self.assertEqual(badge_class, BadgeType.WISDOM)

    def test_judge_wisdom_badge_not_exist_alignments(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.ALIGNMENTS.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments=None, version="")
        self.assertEqual(badge_class, BadgeType.KNOWLEDGE)

    def test_request_get_json_normal_url(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.wisdom_badge_url)
        expect = "https://w3id.org/openbadges/v2"
        self.assertEqual(json.get("@context"), expect)

    def test_request_get_json_not_exist_badge_url(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            cmd.request_get_json(self.not_exist_badge_url)
        self.assertEqual(
            e.exception.args[0],
            "APIのレスポンスにエラーが含まれるため処理を中断します。エラー内容: ID {$a} のバッジは存在しません。",
        )

    def test_request_get_json_not_json_url(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            cmd.request_get_json(self.not_json_url)
        self.assertEqual(e.exception.args[0], "JSONが取得できませんでした。")

    def make_default_json(self):
        return {
            "name": "name1",
            "description": "description2",
            "image": {"id": "id3", "author": "author4"},
            "criteria": {"id": "id5", "narrative": "narrative6"},
            "issuer": {
                "name": "name7",
                "url": "url8",
                "email": "email9",
                "@context": "@context10",
                "id": "id11",
                "type": "type12",
            },
            "@context": "@context13",
            "id": "id14",
            "type": "type15",
            "@language": "@language16",
            "alignments": [{"targetName": "targetName17", "targetUrl": "targetUrl18"}],
        }

    def test_get_badge_data_ok(self):
        cmd = import_badge.Command()
        json = self.make_default_json()
        (
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        ) = cmd.get_badge_data(json)
        self.assert_default_json(
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        )

    def assert_default_json(
        self,
        id,
        name,
        description,
        criteria_narrative,
        image_id,
        image_author,
        version,
        issuer_name,
        issuer_url,
        issuer_email,
    ):
        self.assertEqual(id, "id14")
        self.assertEqual(name, "name1")
        self.assertEqual(description, "description2")
        self.assertEqual(criteria_narrative, "narrative6")
        self.assertEqual(image_id, "id3")
        self.assertEqual(image_author, "author4")
        self.assertEqual(version, "@context13")
        self.assertEqual(issuer_name, "name7")
        self.assertEqual(issuer_url, "url8")
        self.assertEqual(issuer_email, "email9")

    def test_get_badge_data_empty(self):
        cmd = import_badge.Command()
        json = {}
        (
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        ) = cmd.get_badge_data(json)
        self.assertEqual(id, None)
        self.assertEqual(name, None)
        self.assertEqual(description, None)
        self.assertEqual(criteria_narrative, None)
        self.assertEqual(image_id, None)
        self.assertEqual(image_author, None)
        self.assertEqual(version, None)
        self.assertEqual(issuer_name, None)
        self.assertEqual(issuer_url, None)
        self.assertEqual(issuer_email, None)

    def test_download_file_ok(self):
        cmd = import_badge.Command()
        if os.path.exists(self.image_dir):
            shutil.rmtree(self.image_dir)
        result = cmd.download_file(self.image_url, self.image_dir)
        self.assertEqual(result, self.downloaded_file)
        result = cmd.download_file(self.image_url, self.image_dir)
        self.assertEqual(result, self.downloaded_file)

    def test_download_file_not_exist_url(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            result = cmd.download_file(self.ng_url, self.image_dir)
        self.assertEqual(e.exception.args[0], "image.idのURLの画像取得時にエラーが発生しました。")

    def test_download_file_not_image(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            result = cmd.download_file(self.wisdom_badge_url, self.image_dir)
        self.assertEqual(e.exception.args[0], "image.idのURLのContent-Typeがimageではありません。")

    def test_update_wisdom_badge_isert(self):
        self.map_test_university()
        cmd = import_badge.Command()
        self.assertEqual(WisdomBadges.objects.all().count(), 0)
        json = cmd.request_get_json(self.wisdom_badge_url)
        cmd.update_wisdom_badge(json, self.portal_category)
        self.assertEqual(WisdomBadges.objects.all().count(), 1)
        self.assert_wisdom_badge()

    def assert_wisdom_badge(self):
        wisdom_badge = WisdomBadges.objects.all().first()
        self.assertEqual(
            wisdom_badge.badge_class_id,
            "https://moodle.example.org/badges/badge_json.php?id=41",
        )
        self.assertEqual(wisdom_badge.name, 'バッジ "テスト用能力バッジ"')
        self.assertEqual(
            wisdom_badge.description,
            "テスト用の能力バッジです。「全角括弧」や、読点を含む説明文。",
        )
        self.assertEqual(
            wisdom_badge.image_id,
            "moodle.example.org.pluginfile.php.1.badges.badgeimage.41.f1.png",
        )
        self.assertEqual(
            wisdom_badge.image_author,
            "https://moodle.example.org/badges/image_author_json.php?id=41",
        )
        self.assertEqual(wisdom_badge.version, "https://w3id.org/openbadges/v2")
        self.assertEqual(wisdom_badge.alignments_targetname, "テスト用コース")
        self.assertEqual(
            wisdom_badge.alignments_targeturl,
            "https://moodle.example.org/course/view.php?id=52",
        )
        self.assert_issuer(wisdom_badge)
        self.assert_knowledge_badge(wisdom_badge)

    def assert_issuer(self, wisdom_badge):
        issuer = wisdom_badge.issuer
        self.assertEqual(issuer.name, "テスト大学")
        self.assertEqual(issuer.url, "https://moodle.example.org/")
        self.assertEqual(issuer.email, "")

    def assert_knowledge_badge(self, wisdom_badge):
        knowledge_badge_set = KnowledgeBadges.objects.filter(wisdom_badges=wisdom_badge)
        self.assertEqual(knowledge_badge_set.count(), 4)
        knowledge_badge1 = knowledge_badge_set.get(
            badge_class_id="https://moodle.example.org/badges/badge_json.php?id=36"
        )
        self.assertEqual(
            knowledge_badge1.badge_class_id,
            "https://moodle.example.org/badges/badge_json.php?id=36",
        )
        self.assertEqual(knowledge_badge1.name, 'スタンプ "テスト用スタンプ1"')
        self.assertEqual(knowledge_badge1.description, "テスト用スタンプ1の説明です。")
        self.assertEqual(
            knowledge_badge1.criteria_narrative,
            '次の必要条件を完了した場合、ユーザにこのバッジが授与されます:\n* 「 すべて 」の次の活動が完了しました:\n"ビデオ - 1.はじめに"\n"ビデオ - 2.テスト用の動画2"\n"ビデオ - 3.テスト用の動画3"\n"ビデオ - 4.まとめ"\n"レッスン - 5.振り返り"\n\n',
        )
        self.assertEqual(
            knowledge_badge1.image_id,
            "moodle.example.org.pluginfile.php.2395.badges.badgeimage.36.f1.png",
        )
        self.assertEqual(
            knowledge_badge1.image_author,
            "https://moodle.example.org/badges/image_author_json.php?id=36",
        )
        self.assertEqual(knowledge_badge1.version, "https://w3id.org/openbadges/v2")
        criteria_set = Criteria.objects.filter(knowledge_badges=knowledge_badge1)
        self.assertEqual(criteria_set.count(), 5)
        criteria1 = criteria_set.get(Q(type="ビデオ") & Q(name="1.はじめに"))
        self.assertEqual(criteria1.type, "ビデオ")
        self.assertEqual(criteria1.name, "1.はじめに")
        criteria5 = criteria_set.get(Q(type="レッスン") & Q(name="5.振り返り"))
        self.assertEqual(criteria5.type, "レッスン")
        self.assertEqual(criteria5.name, "5.振り返り")
        knowledge_badge4 = knowledge_badge_set.get(
            badge_class_id="https://moodle.example.org/badges/badge_json.php?id=39"
        )
        self.assertEqual(
            knowledge_badge4.badge_class_id,
            "https://moodle.example.org/badges/badge_json.php?id=39",
        )
        self.assertEqual(knowledge_badge4.name, 'スタンプ "テスト用スタンプ4「全角括弧」－全角記号ー"')
        self.assertEqual(knowledge_badge4.description, "テスト用スタンプ4の説明です。")
        self.assertEqual(
            knowledge_badge4.criteria_narrative,
            '次の必要条件を完了した場合、ユーザにこのバッジが授与されます:\n* 「 すべて 」の次の活動が完了しました:\n"ビデオ - 1.はじめに"\n"ビデオ - 2.テスト用の動画、その2は？"\n"ビデオ - 3.テスト用の動画、その3は？"\n"ビデオ - 4.テスト用の動画、その4は？"\n"レッスン - 5.振り返り"\n\n',
        )
        self.assertEqual(
            knowledge_badge4.image_id,
            "moodle.example.org.pluginfile.php.2395.badges.badgeimage.39.f1.png",
        )
        self.assertEqual(
            knowledge_badge4.image_author,
            "https://moodle.example.org/badges/image_author_json.php?id=39",
        )
        self.assertEqual(knowledge_badge4.version, "https://w3id.org/openbadges/v2")
        criteria_set = Criteria.objects.filter(knowledge_badges=knowledge_badge4)
        self.assertEqual(criteria_set.count(), 5)
        criteria2 = criteria_set.get(Q(type="ビデオ") & Q(name="2.テスト用の動画、その2は？"))
        self.assertEqual(criteria2.type, "ビデオ")
        self.assertEqual(criteria2.name, "2.テスト用の動画、その2は？")
        criteria4 = criteria_set.get(Q(type="ビデオ") & Q(name="4.テスト用の動画、その4は？"))
        self.assertEqual(criteria4.type, "ビデオ")
        self.assertEqual(criteria4.name, "4.テスト用の動画、その4は？")

    def test_update_wisdom_badge_update(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.wisdom_badge_url)
        self.assertEqual(WisdomBadges.objects.all().count(), 0)
        cmd.update_wisdom_badge(json, self.portal_category)
        self.assertEqual(WisdomBadges.objects.all().count(), 1)
        wisdom_badge_id_1st = WisdomBadges.objects.all().first().id
        cmd.update_wisdom_badge(json, self.portal_category)
        self.assertEqual(WisdomBadges.objects.all().count(), 1)
        wisdom_badge_id_2nd = WisdomBadges.objects.all().first().id
        self.assertEqual(wisdom_badge_id_1st, wisdom_badge_id_2nd)

    def test_find_issuer_mapping_insert(self):
        # 初めての組み合わせは、対応づけていない状態で登録する。バッジ発行機関は作らない
        cmd = import_badge.Command()
        mapping = cmd.find_issuer_mapping("hoge", "https://www.hoge.example.org/")
        self.assertIsNone(mapping.issuer)
        self.assertEqual(IssuerMapping.objects.count(), 1)
        self.assertEqual(Issuer.objects.count(), 0)
        # 同じ組み合わせなら、同じものを返す
        self.assertEqual(cmd.find_issuer_mapping("hoge", "https://www.hoge.example.org/"), mapping)
        self.assertEqual(IssuerMapping.objects.count(), 1)

    def test_find_issuer_mapping_does_not_overwrite_issuer(self):
        # #7 取り込んでも、ポータルで登録したバッジ発行機関の名前・URL・連絡先を上書きしない
        issuer = self.map_issuer(
            "hoge", "https://www.hoge.example.org/",
            name="ほげ大学", url="https://www.hoge.example.org/portal", email="contact@hoge.example.org",
        )
        cmd = import_badge.Command()
        self.assertEqual(cmd.find_issuer_mapping("hoge", "https://www.hoge.example.org/").issuer, issuer)
        # 同じ名前で URL が違う組み合わせは、別の組み合わせとして対応づけ待ちになる
        other = cmd.find_issuer_mapping("hoge", "https://www.fugafuga.example.org/")
        self.assertIsNone(other.issuer)
        issuer.refresh_from_db()
        self.assertEqual(issuer.name, "ほげ大学")
        self.assertEqual(issuer.url, "https://www.hoge.example.org/portal")
        self.assertEqual(issuer.email, "contact@hoge.example.org")
        self.assertEqual(Issuer.objects.count(), 1)

    def import_wisdom_badge(self):
        cmd = import_badge.Command(stdout=StringIO())
        cmd.update_wisdom_badge(cmd.request_get_json(self.wisdom_badge_url), self.portal_category)
        return WisdomBadges.objects.get(badge_class_id=self.wisdom_badge_url), cmd.stdout.getvalue()

    def test_import_new_badge_is_hidden(self):
        issuer = self.map_test_university()
        badge, _ = self.import_wisdom_badge()
        self.assertEqual(badge.status, WisdomBadges.Status.HIDDEN)
        self.assertEqual(badge.issuer, issuer)
        self.assertEqual(badge.issuer_name, "テスト大学")
        self.assertEqual(badge.issuer_url, "https://moodle.example.org/")
        self.assertEqual(badge.portal_category, self.portal_category)
        for knowledge_badge in KnowledgeBadges.objects.filter(wisdom_badges=badge):
            self.assertEqual(knowledge_badge.issuer, issuer)
            self.assertEqual(knowledge_badge.issuer_name, "テスト大学")

    def test_import_unmapped_combination(self):
        badge, stdout = self.import_wisdom_badge()
        self.assertIsNone(badge.issuer)
        self.assertEqual(badge.status, WisdomBadges.Status.HIDDEN)
        self.assertEqual(Issuer.objects.count(), 0)
        mapping = IssuerMapping.objects.get()
        self.assertEqual((mapping.issuer_name, mapping.issuer_url, mapping.issuer), ("テスト大学", "https://moodle.example.org/", None))
        self.assertIn("まだバッジ発行機関に対応づけられていません", stdout)

    def test_import_without_issuer_uses_blank_combination(self):
        # issuer.name・issuer.url がないバッジは、"" の組み合わせとして扱う（NULL にしない）
        cmd = import_badge.Command(stdout=StringIO())
        json = cmd.request_get_json(self.wisdom_badge_url)
        json["issuer"] = {}
        cmd.update_wisdom_badge(json, self.portal_category)
        badge = WisdomBadges.objects.get(badge_class_id=self.wisdom_badge_url)
        self.assertEqual((badge.issuer_name, badge.issuer_url), ("", ""))
        self.assertTrue(IssuerMapping.objects.filter(issuer_name="", issuer_url="").exists())

    def test_reimport_keeps_portal_settings(self):
        self.map_test_university()
        badge, _ = self.import_wisdom_badge()
        other_category = PortalCategory.objects.create(name="管理画面で選んだカテゴリ")
        badge.status = WisdomBadges.Status.PUBLISHED
        badge.portal_category = other_category
        badge.name = "古い名前"
        badge.save()
        badge, _ = self.import_wisdom_badge()
        # Moodle から来る項目は更新し、公開状態とカテゴリはポータルで設定したものを残す
        self.assertEqual(badge.name, 'バッジ "テスト用能力バッジ"')
        self.assertEqual(badge.status, WisdomBadges.Status.PUBLISHED)
        self.assertEqual(badge.portal_category, other_category)

    def test_reimport_unmapped_keeps_issuer_and_status(self):
        # 既存のバッジで組み合わせが対応づけられていなければ、今の担当機関と公開状態のまま
        issuer = self.map_test_university()
        badge, _ = self.import_wisdom_badge()
        badge.status = WisdomBadges.Status.PUBLISHED
        badge.save()
        IssuerMapping.objects.update(issuer=None)
        badge, _ = self.import_wisdom_badge()
        self.assertEqual(badge.issuer, issuer)
        self.assertEqual(badge.status, WisdomBadges.Status.PUBLISHED)

    def test_reimport_mapped_to_other_issuer_hides(self):
        self.map_test_university()
        badge, _ = self.import_wisdom_badge()
        badge.status = WisdomBadges.Status.PUBLISHED
        badge.save()
        other = Issuer.objects.create(name="別の大学")
        IssuerMapping.objects.update(issuer=other)
        badge, _ = self.import_wisdom_badge()
        # 担当機関が変わったら、新しい担当機関が公開するまで非表示
        self.assertEqual(badge.issuer, other)
        self.assertEqual(badge.status, WisdomBadges.Status.HIDDEN)

    def test_create_knowledge_badges(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(
            portal_category=self.portal_category,
            badge_class_id="bid",
            name="n",
            issuer=issuer,
        )
        alignments = [
            {
                "targetName": "テスト用コース",
                "targetUrl": "https://moodle.example.org/course/view.php?id=52",
            },
            {
                "targetName": 'スタンプ "テスト用スタンプ1"',
                "targetUrl": "https://moodle.example.org/badges/badge_json.php?id=36",
            },
            {
                "targetName": 'スタンプ "テスト用スタンプ2"',
                "targetUrl": "https://moodle.example.org/badges/badge_json.php?id=37",
            },
            {
                "targetName": 'スタンプ "テスト用スタンプ3「全角括弧」－全角記号ー"',
                "targetUrl": "https://moodle.example.org/badges/badge_json.php?id=38",
            },
            {
                "targetName": 'スタンプ "テスト用スタンプ4「全角括弧」－全角記号ー"',
                "targetUrl": "https://moodle.example.org/badges/badge_json.php?id=39",
            },
        ]
        cmd.create_knowledge_badges(alignments, wisdom_badge)
        self.assert_knowledge_badge(wisdom_badge)

    def test_create_criterias(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(
            portal_category=self.portal_category,
            badge_class_id="bid",
            name="n",
            issuer=issuer,
        )
        knowledge_badge = KnowledgeBadges.objects.create(
            wisdom_badges=wisdom_badge, badge_class_id="bid2", name="n2", issuer=issuer
        )
        criteria_list = [
            ["hoge", "ほげほげ"],
            ["fuga", "ふがふが"],
            ["bad"],
        ]
        cmd.create_criterias(knowledge_badge, criteria_list, 1)

    def test_create_knowledge_badge(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(
            portal_category=self.portal_category,
            badge_class_id="bid",
            name="n",
            issuer=issuer,
        )
        json = self.make_default_json()
        self.map_issuer("name7", "url8", name="name7", url="url8", email="email9")
        knowledge_badge, criteria_list = cmd.create_knowledge_badge(
            json, wisdom_badge, "tmp/hoge.png"
        )
        self.assertEqual(knowledge_badge.badge_class_id, "id14")
        self.assertEqual(knowledge_badge.name, "name1")
        self.assertEqual(knowledge_badge.description, "description2")
        self.assertEqual(knowledge_badge.criteria_narrative, "narrative6")
        self.assertEqual(knowledge_badge.image_id, "hoge.png")
        self.assertEqual(knowledge_badge.image_author, "author4")
        self.assertEqual(knowledge_badge.version, "@context13")
        issuer = knowledge_badge.issuer
        self.assertEqual(issuer.name, "name7")
        self.assertEqual(issuer.url, "url8")
        self.assertEqual(issuer.email, "email9")
        self.assertEqual(len(criteria_list), 0)

    def test_parse_narrative_ok_fullcharctor(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative(
            "☆☆☆たいぷ☆☆☆ - △△△なまえ△△△\n☆☆☆たいぷ２☆☆☆ - △△△なまえ２△△△\nhoge"
        )
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], "☆☆☆たいぷ☆☆☆")
        self.assertEqual(criteria1[1], "△△△なまえ△△△")
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], "☆☆☆たいぷ２☆☆☆")
        self.assertEqual(criteria2[1], "△△△なまえ２△△△")

    def test_parse_narrative_ok_halfcharctor(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative("aaaa - bbbbb\n11111 - 222222")
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], "aaaa")
        self.assertEqual(criteria1[1], "bbbbb")
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], "11111")
        self.assertEqual(criteria2[1], "222222")

    def test_parse_narrative_ok_hypens(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative(
            "aaaa - bbbbb - ccccc\n11111 - 222222 - 333333 - 444"
        )
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], "aaaa")
        self.assertEqual(criteria1[1], "bbbbb - ccccc")
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], "11111")
        self.assertEqual(criteria2[1], "222222 - 333333 - 444")

    def test_parse_narrative_ng_hypens(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative("hoge - \nfuga -")
        self.assertEqual(len(criteria_list), 0)

    def test_create_criteria(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(
            portal_category=self.portal_category,
            badge_class_id="bid",
            name="n",
            issuer=issuer,
        )
        knowledge_badge = KnowledgeBadges.objects.create(
            wisdom_badges=wisdom_badge, badge_class_id="bid2", name="n2", issuer=issuer
        )
        cmd.create_criteria("たいぷ", "なまえ", knowledge_badge, sort_key=5)
        self.assertEqual(Criteria.objects.all().count(), 1)
        criteria = Criteria.objects.all().first()
        self.assertEqual(criteria.type, "たいぷ")
        self.assertEqual(criteria.name, "なまえ")
        self.assertEqual(criteria.sort_key, 5)
