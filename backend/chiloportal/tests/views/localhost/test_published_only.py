from rest_framework import status
from rest_framework.test import APIRequestFactory

from chiloportal.views.badges_list import BadgesList
from .base_api_view_tests import BaseAPIViewTests
from ....models import *
from ....views import *


class PublishedOnlyTest(BaseAPIViewTests):
    """published_only=true（ポータルの表示用）を指定したときに、ポータル非表示のバッジを除くことを確かめる。"""

    def setUp(self):
        self.factory = APIRequestFactory()
        self.create_test_relation_data()
        # 取り込んだバッジは「ポータル非表示」で登録される。wb1 だけを公開にする
        self.wb1.status = WisdomBadges.Status.PUBLISHED
        self.wb1.save()

    def get(self, view, url, params):
        return view.as_view()(self.factory.get(url, params))

    def badge_ids(self, response):
        return {badge["badges_id"] for badge in response.data["badges"]}

    def test_badges_list(self):
        response = self.get(
            BadgesList, self.badges_list_url, {"issuer_id": self.iss1.id, "published_only": "true"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.badge_ids(response), {self.wb1.id})
        self.assert_page(response.data, 1, 1, 1)
        self.assertEqual(response.data["badges"][0]["status"], "published")

    def test_badges_list_without_param_returns_hidden(self):
        response = self.get(BadgesList, self.badges_list_url, {"issuer_id": self.iss1.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = set(WisdomBadges.objects.filter(issuer=self.iss1).values_list("id", flat=True))
        self.assertEqual(self.badge_ids(response), expected)
        self.assertGreater(len(expected), 1)
        statuses = {badge["status"] for badge in response.data["badges"]}
        self.assertEqual(statuses, {"published", "hidden"})

    def test_badges_list_false_returns_hidden(self):
        response = self.get(
            BadgesList, self.badges_list_url, {"issuer_id": self.iss1.id, "published_only": "false"}
        )
        expected = set(WisdomBadges.objects.filter(issuer=self.iss1).values_list("id", flat=True))
        self.assertEqual(self.badge_ids(response), expected)

    def test_badges_list_empty(self):
        # 該当がなければ、エラーではなく 0 件を返す
        response = self.get(
            BadgesList, self.badges_list_url, {"issuer_id": self.iss2.id, "published_only": "true"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["badges"], [])
        self.assert_page(response.data, 0, 0, 0)

    def test_badges_list_auto_hidden(self):
        self.wb1.status = WisdomBadges.Status.AUTO_HIDDEN
        self.wb1.save()
        response = self.get(
            BadgesList, self.badges_list_url, {"issuer_id": self.iss1.id, "published_only": "true"}
        )
        self.assertEqual(response.data["badges"], [])

    def test_invalid_value(self):
        self.request_invalid_value(
            self.factory,
            BadgesList.as_view(),
            self.badges_list_url,
            {"published_only": self.invalid_param_alpha},
            message="parameters",
        )

    def test_portal_category_badges_list(self):
        response = self.get(
            PortalCategoryBadgesList,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.wb1.portal_category_id, "published_only": "true"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.badge_ids(response), {self.wb1.id})

    def test_portal_category_list_counts(self):
        response = self.get(PortalCategoryList, self.portal_category_list_url, {"published_only": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        counts = {pc["portal_category_id"]: pc["badges_count"] for pc in response.data}
        self.assertEqual(counts.pop(self.wb1.portal_category_id), 1)
        self.assertEqual(set(counts.values()), {0})
        # 指定がなければ、今までどおり非表示も含めて数える
        response = self.get(PortalCategoryList, self.portal_category_list_url, {})
        counts = {pc["portal_category_id"]: pc["badges_count"] for pc in response.data}
        self.assertEqual(
            counts[self.wb1.portal_category_id],
            WisdomBadges.objects.filter(portal_category_id=self.wb1.portal_category_id).count(),
        )

    def test_keyword(self):
        response = self.get(
            WisdomBadgesListKeyword,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb1.name, "published_only": "true"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.badge_ids(response), {self.wb1.id})
        hidden = WisdomBadges.objects.exclude(pk=self.wb1.pk).first()
        response = self.get(
            WisdomBadgesListKeyword,
            self.wisdom_badges_list_keyword_url,
            {"keyword": hidden.name, "published_only": "true"},
        )
        self.assertNotIn(hidden.id, self.badge_ids(response))

    def test_badges_detail_wisdom(self):
        params = {"badges_ids": str(self.wb1.id), "badges_type": "wisdom", "published_only": "true"}
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([badge["badges_id"] for badge in response.data], [self.wb1.id])

    def test_badges_detail_wisdom_hidden_is_404(self):
        params = {"badges_ids": str(self.wb2.id), "badges_type": "wisdom", "published_only": "true"}
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # 指定がなければ、ポートフォリオなどのために非表示のバッジも返す
        params.pop("published_only")
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["status"], "hidden")

    def test_badges_detail_wisdom_mixed(self):
        params = {
            "badges_ids": f"{self.wb1.id},{self.wb2.id}",
            "badges_type": "wisdom",
            "published_only": "true",
        }
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual([badge["badges_id"] for badge in response.data], [self.wb1.id])

    def test_badges_detail_knowledge(self):
        published = KnowledgeBadges.objects.filter(wisdom_badges=self.wb1).first()
        hidden = KnowledgeBadges.objects.exclude(wisdom_badges=self.wb1).first()
        params = {"badges_ids": str(published.id), "badges_type": "knowledge", "published_only": "true"}
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        params["badges_ids"] = str(hidden.id)
        response = self.get(BadgesDetail, self.badges_url, params)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def field_badge_ids(self, data):
        return {
            badge_id
            for field1 in data["field1"]
            for field2 in field1["field2"]
            for field3 in field2["field3"]
            for badge_id in field3["wisdom_badges"]
        }

    def test_stage_field_list(self):
        stage_id = CategorisedBadges.objects.filter(wisdom_badges=self.wb1).first().goal.stage_id
        params = {"stage_id": stage_id, "published_only": "true"}
        response = self.get(StageFieldList, self.stage_field_list_url, params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.field_badge_ids(response.data), {self.wb1.id})
        # 指定がなければ、非表示も含める
        response = self.get(StageFieldList, self.stage_field_list_url, {"stage_id": stage_id})
        expected = set(
            CategorisedBadges.objects.filter(goal__stage_id=stage_id).values_list("wisdom_badges_id", flat=True)
        )
        self.assertEqual(self.field_badge_ids(response.data), expected)

    def test_stage_field_list_empty(self):
        self.wb1.status = WisdomBadges.Status.HIDDEN
        self.wb1.save()
        stage_id = CategorisedBadges.objects.first().goal.stage_id
        response = self.get(
            StageFieldList, self.stage_field_list_url, {"stage_id": stage_id, "published_only": "true"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"field1": []})
