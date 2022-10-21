from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class BadgesTests(BaseAPIViewTests):
    def test_badges_200_type_wisdom(self):
        #test
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_url,
            {"badges_ids": self.wb2.id, "badges_type": BadgeType.WISDOM.name.lower()},
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])

    def test_badges_200_type_wisdoms(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": f"{self.wb2.id},{self.wb3.id}",
                "badges_type": BadgeType.WISDOM.name.lower(),
            },
        )
        array = response.data
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assertEqual(data["badges_id"], self.wb2.id)
        data = array[1]
        self.assertEqual(data["badges_id"], self.wb3.id)

    def test_badges_200_type_knowledge(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": self.kb2.id,
                "badges_type": BadgeType.KNOWLEDGE.name.lower(),
            },
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_knowledge_badge(data, self.kb2, [self.ct3])

    def test_badges_200_type_knowledges(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": f"{self.kb2.id},{self.kb3.id}",
                "badges_type": BadgeType.KNOWLEDGE.name.lower(),
            },
        )
        array = response.data
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assert_knowledge_badge(data, self.kb2, [self.ct3])
        data = array[1]
        self.assert_knowledge_badge(data, self.kb3, [self.ct4])

    def test_badges_400_invalid_badge_id(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": self.invalid_param_alpha,
                "badges_type": BadgeType.KNOWLEDGE.name.lower(),
            },
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": self.invalid_param_fullchar,
                "badges_type": BadgeType.KNOWLEDGE.name.lower(),
            },
            "parameters",
        )

    def test_badges_400_invalid_badge_type(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.badges_url,
            {"badges_ids": 1, "badges_type": "knowledge2"},
            "parameters",
        )

    def test_badges_400_invalid_all(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.badges_url,
            {"badges_ids": self.invalid_param_alpha, "badges_type": "knowledge2"},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_url,
            {"badges_ids": self.invalid_param_fullchar, "badges_type": "knowledge2"},
            "parameters",
        )

    def test_badges_400_no_badge_id(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.request_no_param(
            factory,
            view,
            self.badges_url,
            {"badges_type": BadgeType.KNOWLEDGE.name.lower()},
            "parameters",
        )

    def test_badges_400_no_badge_type(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.request_no_param(
            factory, view, self.badges_url, {"badges_ids": 1}, "parameters"
        )

    def test_badges_404_wisdom(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": self.not_found_id,
                "badges_type": BadgeType.WISDOM.name.lower(),
            },
            "Badges",
        )

    def test_badges_404_knowledge(self):
        factory = APIRequestFactory()
        view = BadgesDetail.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.badges_url,
            {
                "badges_ids": self.not_found_id,
                "badges_type": BadgeType.KNOWLEDGE.name.lower(),
            },
            "Badges",
        )
