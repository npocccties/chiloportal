from ctypes import alignment
from io import StringIO
from django.test import TestCase
from django.core import management
from django.db.models import Q
from ...management.commands import import_badge
from ...enums import *
from ...exceptions import *
from ...models import *
import os
import shutil

class ImportBadgeCommandTests(TestCase):
    wisdom_badge_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=41'
    knowledge_badge_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=36'
    not_exist_badge_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=9999'
    ng_url = 'https://fugafuga.opedu.lib.osaka-kyoiku.hogehoge.ac.jp/badges/badge_json.php?id=41'
    not_json_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/course/view.php?id=52'
    image_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/pluginfile.php/1/badges/badgeimage/41/f1'
    image_dir = '/tmp/hoge/'
    downloaded_file = os.path.join(image_dir, 'pluginfile.php.1.badges.badgeimage.41.f1.png')
    issuer_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/issuer_json.php?id=41'

    @classmethod
    def setUp(self):
        self.portal_category = PortalCategory.objects.create(name='hoge', sort_key=1)

    def test_run_ok(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command('import_badge', url=self.wisdom_badge_url, pcid=self.portal_category.id, stdout=stdout, stderr=stderr)
        self.assertEqual(stdout.getvalue(), 'OK\n')
        self.assertNotEqual(stderr.getvalue(), 'NG\n')

    def test_run_ng(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command('import_badge', url=self.wisdom_badge_url, pcid=0, stdout=stdout, stderr=stderr)
        self.assertNotEqual(stdout.getvalue(), 'OK\n')
        self.assertEqual(stderr.getvalue(), 'NG\n')

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
        self.assertEqual(e.exception.args[0], 'ポータル独自カテゴリに存在しないIDが指定されましたので処理継続できません。pcid: 0')

    def test_do_import_invalid_badge(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        json = {}
        with self.assertRaises(AppException) as e:
            cmd.do_import(json, self.portal_category.id)
        self.assertEqual(e.exception.args[0], 'バッジ種別が判断できないので処理を中断します。')

    def test_do_import_knowledge_badge(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.knowledge_badge_url)
        with self.assertRaises(AppException) as e:
            cmd.do_import(json, self.portal_category.id)
        self.assertEqual(e.exception.args[0], '知識バッジのため処理継続できません。能力バッジを指定してください。')

    def test_judge_wisdom_badge_version_wisdom(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = [], version = '1.0-wisdom')
        self.assertEqual(badge_class, BadgeType.WISDOM)

    def test_judge_wisdom_badge_version_knowledge(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = [], version = '1.0-knowledge')
        self.assertEqual(badge_class, BadgeType.KNOWLEDGE)

    def test_judge_wisdom_badge_version_none(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = [], version = None)
        self.assertEqual(badge_class, BadgeType.NONE)

    def test_judge_wisdom_badge_version_empty(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.VERSION.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = [], version = '')
        self.assertEqual(badge_class, BadgeType.NONE)

    def test_judge_wisdom_badge_exist_alignments(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.ALIGNMENTS.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = [], version='')
        self.assertEqual(badge_class, BadgeType.WISDOM)

    def test_judge_wisdom_badge_not_exist_alignments(self):
        cmd = import_badge.Command()
        cmd.judge_badge = JudgeBadge.ALIGNMENTS.name.lower()
        badge_class = cmd.judge_wisdom_badge(alignments = None, version='')
        self.assertEqual(badge_class, BadgeType.KNOWLEDGE)

    def test_request_get_json_normal_url(self):
        cmd = import_badge.Command()
        json = cmd.request_get_json(self.wisdom_badge_url)
        expect = 'https://w3id.org/openbadges/v2'
        self.assertEqual(json.get('@context'), expect)

    def test_request_get_json_not_exist_badge_url(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            cmd.request_get_json(self.not_exist_badge_url)
        self.assertEqual(e.exception.args[0], 'APIのレスポンスにエラーが含まれるため処理を中断します。エラー内容: ID {$a} のバッジは存在しません。')

    def test_request_get_json_not_json_url(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            cmd.request_get_json(self.not_json_url)
        self.assertEqual(e.exception.args[0], 'JSONが取得できませんでした。')

    def make_default_json(self):
        return {
            "name": "name1",
            "description": "description2",
            "image": {
                "id": "id3",
                "author": "author4"
            },
            "criteria": {
                "id": "id5",
                "narrative": "narrative6"
            },
            "issuer": {
                "name": "name7",
                "url": "url8",
                "email": "email9",
                "@context": "@context10",
                "id": "id11",
                "type": "type12"
            },
            "@context": "@context13",
            "id": "id14",
            "type": "type15",
            "@language": "@language16",
            "alignments": [
                {
                    "targetName": "targetName17",
                    "targetUrl": "targetUrl18"
                }
            ]
        }

    def test_get_badge_data_ok(self):
        cmd = import_badge.Command()
        json = self.make_default_json()
        id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email = cmd.get_badge_data(json)
        self.assert_default_json(id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email)

    def assert_default_json(self, id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email):
        self.assertEqual(id, 'id14')
        self.assertEqual(name, 'name1')
        self.assertEqual(description, 'description2')
        self.assertEqual(criteria_narrative, 'narrative6')
        self.assertEqual(image_id, 'id3')
        self.assertEqual(image_author, 'author4')
        self.assertEqual(version, '@context13')
        self.assertEqual(issuer_name, 'name7')
        self.assertEqual(issuer_url, 'url8')
        self.assertEqual(issuer_email, 'email9')

    def test_get_badge_data_empty(self):
        cmd = import_badge.Command()
        json = {}
        id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email = cmd.get_badge_data(json)
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
        self.assertEqual(e.exception.args[0], 'image.idのURLの画像取得時にエラーが発生しました。')

    def test_download_file_not_image(self):
        cmd = import_badge.Command()
        with self.assertRaises(AppException) as e:
            result = cmd.download_file(self.wisdom_badge_url, self.image_dir)
        self.assertEqual(e.exception.args[0], 'image.idのURLのContent-Typeがimageではありません。')

    def test_update_wisdom_badge_isert(self):
        cmd = import_badge.Command()
        self.assertEqual(WisdomBadges.objects.all().count(), 0)
        json = cmd.request_get_json(self.wisdom_badge_url)
        cmd.update_wisdom_badge(json, self.portal_category)
        self.assertEqual(WisdomBadges.objects.all().count(), 1)
        self.assert_wisdom_badge()

    def assert_wisdom_badge(self):
        wisdom_badge = WisdomBadges.objects.all().first()
        self.assertEqual(wisdom_badge.badge_class_id, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=41')
        self.assertEqual(wisdom_badge.name, '能力バッジ \"子どもの変化と教職について省察する\"')
        self.assertEqual(wisdom_badge.description, '各種答申に示された教育改革の方向性、2017年改訂学習指導要領の実現を支える実践的知見、「日本型学校教育」の海外展開について知ることで、教育現場の内部から教育活動を改善し教師が学び続けることの重要性を認識する。')
        self.assertEqual(wisdom_badge.image_id, 'pluginfile.php.1.badges.badgeimage.41.f1.png')
        self.assertEqual(wisdom_badge.image_author, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/image_author_json.php?id=41')
        self.assertEqual(wisdom_badge.version, 'https://w3id.org/openbadges/v2')
        self.assertEqual(wisdom_badge.alignments_targetname, '子どもの変化と教職について省察する')
        self.assertEqual(wisdom_badge.alignments_targeturl, 'https://opedu.lib.osaka-kyoiku.ac.jp/course/view.php?id=52')
        self.assert_issuer(wisdom_badge)
        self.assert_knowledge_badge(wisdom_badge)

    def assert_issuer(self, wisdom_badge):
        issuer = wisdom_badge.issuer
        self.assertEqual(issuer.name, '大阪教育大学')
        self.assertEqual(issuer.url, 'https://opedu.lib.osaka-kyoiku.ac.jp/')
        self.assertEqual(issuer.email, '')

    def assert_knowledge_badge(self, wisdom_badge):
        knowledge_badge_set = KnowledgeBadges.objects.filter(wisdom_badges = wisdom_badge)
        self.assertEqual(knowledge_badge_set.count(), 4)
        knowledge_badge1 = knowledge_badge_set.get(badge_class_id = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=36')
        self.assertEqual(knowledge_badge1.badge_class_id, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=36')
        self.assertEqual(knowledge_badge1.name, '知識バッジ \"日本の教育政策動向\"')
        self.assertEqual(knowledge_badge1.description, '令和の日本型教育の方向性を知り、教員の働き方を省察できるようなる。')
        self.assertEqual(knowledge_badge1.criteria_narrative, '次の必要条件を完了した場合、ユーザにこのバッジが授与されます:\n* 「 すべて 」の次の活動が完了しました:\n\"ビデオ - 1.はじめに\"\n\"ビデオ - 2.日本の教育課題を知る\"\n\"ビデオ - 3.教師の働き方を省察する\"\n\"ビデオ - 4.まとめ\"\n\"レッスン - 5.振り返り\"\n\n')
        self.assertEqual(knowledge_badge1.image_id, 'pluginfile.php.2395.badges.badgeimage.36.f1.png')
        self.assertEqual(knowledge_badge1.image_author, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/image_author_json.php?id=36')
        self.assertEqual(knowledge_badge1.version, 'https://w3id.org/openbadges/v2')
        criteria_set = Criteria.objects.filter(knowledge_badges = knowledge_badge1)
        self.assertEqual(criteria_set.count(), 5)
        criteria1 = criteria_set.get(Q(type='ビデオ') & Q(name='1.はじめに'))
        self.assertEqual(criteria1.type, 'ビデオ')
        self.assertEqual(criteria1.name, '1.はじめに')
        criteria5 = criteria_set.get(Q(type='レッスン') & Q(name='5.振り返り'))
        self.assertEqual(criteria5.type, 'レッスン')
        self.assertEqual(criteria5.name, '5.振り返り')
        knowledge_badge4 = knowledge_badge_set.get(badge_class_id = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=39')
        self.assertEqual(knowledge_badge4.badge_class_id, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=39')
        self.assertEqual(knowledge_badge4.name, '知識バッジ \"世界の教育改革の中の「日本型学校教育」－授業研究の可能性ー\"')
        self.assertEqual(knowledge_badge4.description, '授業研究の可能性を理解する。')
        self.assertEqual(knowledge_badge4.criteria_narrative, '次の必要条件を完了した場合、ユーザにこのバッジが授与されます:\n* 「 すべて 」の次の活動が完了しました:\n\"ビデオ - 1.はじめに\"\n\"ビデオ - 2.誰がどのような文脈で、諸外国における授業研究を推進してきたのか？\"\n\"ビデオ - 3.なぜ日本型学校教育の重要な内容として、授業研究が注目されたのか？\"\n\"ビデオ - 4.学び続ける教師を支える、よりよい授業研究のあり方は？\"\n\"レッスン - 5.振り返り\"\n\n')
        self.assertEqual(knowledge_badge4.image_id, 'pluginfile.php.2395.badges.badgeimage.39.f1.png')
        self.assertEqual(knowledge_badge4.image_author, 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/image_author_json.php?id=39')
        self.assertEqual(knowledge_badge4.version, 'https://w3id.org/openbadges/v2')
        criteria_set = Criteria.objects.filter(knowledge_badges = knowledge_badge4)
        self.assertEqual(criteria_set.count(), 5)
        criteria2 = criteria_set.get(Q(type='ビデオ') & Q(name='2.誰がどのような文脈で、諸外国における授業研究を推進してきたのか？'))
        self.assertEqual(criteria2.type, 'ビデオ')
        self.assertEqual(criteria2.name, '2.誰がどのような文脈で、諸外国における授業研究を推進してきたのか？')
        criteria4 = criteria_set.get(Q(type='ビデオ') & Q(name='4.学び続ける教師を支える、よりよい授業研究のあり方は？'))
        self.assertEqual(criteria4.type, 'ビデオ')
        self.assertEqual(criteria4.name, '4.学び続ける教師を支える、よりよい授業研究のあり方は？')

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

    def test_update_issuer_insert(self):
        cmd = import_badge.Command()
        cmd.update_issuer(issuer_name='hoge', issuer_url='www.hoge.com', issuer_email='hoge@hoge.com')
        self.assertEqual(Issuer.objects.all().count(), 1)

    def test_update_issuer_update(self):
        cmd = import_badge.Command()
        cmd.update_issuer(issuer_name='hoge', issuer_url='www.hoge.com', issuer_email='hoge@hoge.com')
        self.assertEqual(Issuer.objects.all().count(), 1)
        issur = Issuer.objects.all().first()
        self.assertEqual(issur.name, 'hoge')
        self.assertEqual(issur.url, 'www.hoge.com')
        self.assertEqual(issur.email, 'hoge@hoge.com')
        cmd.update_issuer(issuer_name='hoge', issuer_url='www.fugafuga.com', issuer_email='hoge@fugafuga.com')
        self.assertEqual(Issuer.objects.all().count(), 1)
        issur = Issuer.objects.all().first()
        self.assertEqual(issur.name, 'hoge')
        self.assertEqual(issur.url, 'www.fugafuga.com')
        self.assertEqual(issur.email, 'hoge@fugafuga.com')

    def test_create_knowledge_badges(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(portal_category=self.portal_category, badge_class_id='bid', name='n', issuer=issuer)
        alignments = [
            {
                "targetName": "子どもの変化と教職について省察する",
                "targetUrl": "https://opedu.lib.osaka-kyoiku.ac.jp/course/view.php?id=52"
            },
            {
                "targetName": "知識バッジ \"日本の教育政策動向\"",
                "targetUrl": "https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=36"
            },
            {
                "targetName": "知識バッジ \"教育実践の課題\"",
                "targetUrl": "https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=37"
            },
            {
                "targetName": "知識バッジ \"世界の教育改革の中の「日本型学校教育」－特別活動の可能性ー\"",
                "targetUrl": "https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=38"
            },
            {
                "targetName": "知識バッジ \"世界の教育改革の中の「日本型学校教育」－授業研究の可能性ー\"",
                "targetUrl": "https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=39"
            }
        ]
        cmd.create_knowledge_badges(alignments, wisdom_badge)
        self.assert_knowledge_badge(wisdom_badge)

    def test_create_criterias(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(portal_category=self.portal_category, badge_class_id='bid', name='n', issuer=issuer)
        knowledge_badge = KnowledgeBadges.objects.create(wisdom_badges=wisdom_badge, badge_class_id='bid2', name='n2', issuer=issuer)
        criteria_list = [
            ['hoge','ほげほげ'],
            ['fuga','ふがふが'],
            ['bad'],
        ]
        cmd.create_criterias(knowledge_badge, criteria_list, 1)

    def test_create_knowledge_badge(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(portal_category=self.portal_category, badge_class_id='bid', name='n', issuer=issuer)
        json = self.make_default_json()
        knowledge_badge, criteria_list = cmd.create_knowledge_badge(json, wisdom_badge, 'tmp/hoge.png')
        self.assertEqual(knowledge_badge.badge_class_id, 'id14')
        self.assertEqual(knowledge_badge.name, 'name1')
        self.assertEqual(knowledge_badge.description, 'description2')
        self.assertEqual(knowledge_badge.criteria_narrative, 'narrative6')
        self.assertEqual(knowledge_badge.image_id, 'hoge.png')
        self.assertEqual(knowledge_badge.image_author, 'author4')
        self.assertEqual(knowledge_badge.version, '@context13')
        issuer = knowledge_badge.issuer
        self.assertEqual(issuer.name, 'name7')
        self.assertEqual(issuer.url, 'url8')
        self.assertEqual(issuer.email, 'email9')
        self.assertEqual(len(criteria_list), 0)

    def test_parse_narrative_ok_fullcharctor(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative('☆☆☆たいぷ☆☆☆ - △△△なまえ△△△\n☆☆☆たいぷ２☆☆☆ - △△△なまえ２△△△\nhoge')
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], '☆☆☆たいぷ☆☆☆')
        self.assertEqual(criteria1[1], '△△△なまえ△△△')
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], '☆☆☆たいぷ２☆☆☆')
        self.assertEqual(criteria2[1], '△△△なまえ２△△△')

    def test_parse_narrative_ok_halfcharctor(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative('aaaa - bbbbb\n11111 - 222222')
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], 'aaaa')
        self.assertEqual(criteria1[1], 'bbbbb')
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], '11111')
        self.assertEqual(criteria2[1], '222222')

    def test_parse_narrative_ok_hypens(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative('aaaa - bbbbb - ccccc\n11111 - 222222 - 333333 - 444')
        self.assertEqual(len(criteria_list), 2)
        criteria1 = criteria_list[0]
        self.assertEqual(criteria1[0], 'aaaa')
        self.assertEqual(criteria1[1], 'bbbbb - ccccc')
        criteria2 = criteria_list[1]
        self.assertEqual(criteria2[0], '11111')
        self.assertEqual(criteria2[1], '222222 - 333333 - 444')

    def test_parse_narrative_ng_hypens(self):
        cmd = import_badge.Command()
        criteria_list = cmd.parse_narrative('hoge - \nfuga -')
        self.assertEqual(len(criteria_list), 0)

    def test_create_criteria(self):
        cmd = import_badge.Command()
        issuer = Issuer.objects.create()
        wisdom_badge = WisdomBadges.objects.create(portal_category=self.portal_category, badge_class_id='bid', name='n', issuer=issuer)
        knowledge_badge = KnowledgeBadges.objects.create(wisdom_badges=wisdom_badge, badge_class_id='bid2', name='n2', issuer=issuer)
        cmd.create_criteria('たいぷ', 'なまえ', knowledge_badge, sort_key=5)
        self.assertEqual(Criteria.objects.all().count(), 1)
        criteria = Criteria.objects.all().first()
        self.assertEqual(criteria.type, 'たいぷ')
        self.assertEqual(criteria.name, 'なまえ')
        self.assertEqual(criteria.sort_key, 5)

