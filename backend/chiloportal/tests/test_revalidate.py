import json
from unittest import mock

from django.db import transaction
from django.test import TestCase

from .. import revalidate
from ..models import Issuer, PortalCategory, WisdomBadges

ENV = {"REVALIDATE_URL": "http://frontend.example.org/api/revalidate", "REVALIDATE_SECRET": "test-secret"}


def create_badge(issuer, **kwargs):
    return WisdomBadges.objects.create(
        name="バッジ",
        badge_class_id="https://lms.example.org/badges/1",
        issuer=issuer,
        alignments_targetname="コース",
        alignments_targeturl="https://lms.example.org/course",
        **kwargs,
    )


class RevalidateRequestTest(TestCase):
    """保存が確定したら、変わった機関をまとめて1回だけ送る。"""

    def setUp(self):
        self.univ_a = Issuer.objects.create(name="A大学")
        self.univ_b = Issuer.objects.create(name="B大学")
        patcher = mock.patch.object(revalidate, "send")
        self.send = patcher.start()
        self.addCleanup(patcher.stop)
        # 別スレッドではなく、その場で送ったことにする
        thread = mock.patch.object(
            revalidate.threading, "Thread", side_effect=lambda target, args, daemon: mock.Mock(start=lambda: target(*args))
        )
        thread.start()
        self.addCleanup(thread.stop)

    def prepare_badge(self, issuer):
        # 準備のデータでは予約しない（テストのトランザクションは確定しないので、予約が残ってしまう）
        with mock.patch.dict("os.environ", {"REVALIDATE_URL": ""}):
            return create_badge(issuer)

    def sent(self):
        return [set(call.args[0]) for call in self.send.call_args_list]

    @mock.patch.dict("os.environ", ENV)
    def test_badge_save(self):
        badge = self.prepare_badge(self.univ_a)
        with self.captureOnCommitCallbacks(execute=True):
            badge.status = WisdomBadges.Status.HIDDEN
            WisdomBadges.objects.get(pk=badge.pk).save()
        self.assertEqual(self.sent(), [{self.univ_a.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_badge_moved_to_other_issuer(self):
        badge = WisdomBadges.objects.get(pk=self.prepare_badge(self.univ_a).pk)
        with self.captureOnCommitCallbacks(execute=True):
            badge.issuer = self.univ_b
            badge.save()
        # 前と今の担当機関の両方
        self.assertEqual(self.sent(), [{self.univ_a.id, self.univ_b.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_many_saves_are_sent_once(self):
        badges = [self.prepare_badge(self.univ_a) for _ in range(3)]
        with self.captureOnCommitCallbacks(execute=True):
            with transaction.atomic():
                for badge in badges:
                    WisdomBadges.objects.get(pk=badge.pk).save()
                create_badge(self.univ_b)
        self.assertEqual(self.sent(), [{self.univ_a.id, self.univ_b.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_category_change_revalidates_all_issuers(self):
        with self.captureOnCommitCallbacks(execute=True):
            PortalCategory.objects.create(name="カテゴリ")
        self.assertEqual(self.sent(), [{self.univ_a.id, self.univ_b.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_issuer_change(self):
        with self.captureOnCommitCallbacks(execute=True):
            self.univ_a.name = "A大学（新しい名前）"
            self.univ_a.save()
        self.assertEqual(self.sent(), [{self.univ_a.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_badge_delete(self):
        badge = self.prepare_badge(self.univ_a)
        with self.captureOnCommitCallbacks(execute=True):
            badge.delete()
        self.assertEqual(self.sent(), [{self.univ_a.id}])

    @mock.patch.dict("os.environ", ENV)
    def test_not_sent_when_rolled_back(self):
        with self.captureOnCommitCallbacks(execute=True):
            try:
                with transaction.atomic():
                    create_badge(self.univ_a)
                    raise RuntimeError
            except RuntimeError:
                pass
        self.assertEqual(self.sent(), [])

    @mock.patch.dict("os.environ", {"REVALIDATE_URL": "", "REVALIDATE_SECRET": ""})
    def test_disabled_without_settings(self):
        with self.captureOnCommitCallbacks(execute=True):
            create_badge(self.univ_a)
        self.assertEqual(self.sent(), [])


class RevalidateSendTest(TestCase):
    """フロントエンドへの送信。失敗しても例外を出さない（保存は止めない）。"""

    @mock.patch.dict("os.environ", ENV)
    def test_request(self):
        response = mock.MagicMock()
        response.__enter__.return_value.read.return_value = b'{"revalidated": ["/issuers/1"], "failed": []}'
        with mock.patch.object(revalidate.urllib.request, "urlopen", return_value=response) as urlopen:
            revalidate.send({2, 1})
        request = urlopen.call_args.args[0]
        self.assertEqual(request.full_url, ENV["REVALIDATE_URL"])
        self.assertEqual(request.get_method(), "POST")
        self.assertEqual(request.get_header("Authorization"), "Bearer test-secret")
        self.assertEqual(json.loads(request.data), {"issuer_ids": [1, 2]})

    @mock.patch.dict("os.environ", ENV)
    def test_error_is_logged(self):
        with mock.patch.object(revalidate.urllib.request, "urlopen", side_effect=OSError("connection refused")):
            with self.assertLogs(revalidate.logger, "ERROR"):
                revalidate.send({1})
