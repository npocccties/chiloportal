from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class WisdomBadgesListTests(BaseAPIViewTests):
    def test_wisdom_badges_list_200(self):
        factory = APIRequestFactory()
        view = WisdomBadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": self.field9.id, "stage_id": self.stg3.id},
        )
        array = response.data
        self.assertEqual(len(array), 3)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb11, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb12, [])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb13, [self.kb7.id])

    def test_wisdom_badges_list_200_first_and_last(self):
        factory = APIRequestFactory()
        view = WisdomBadgesList.as_view()
        (
            consumers,
            frameworks,
            fields,
            stages,
            goals,
            categorised_badges,
            portal_categories,
            issuers,
            wisdom_badgees,
            knowledge_badges,
            criterias,
        ) = self.create_test_categorised_badges_data(self.test_data_count)
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": fields[0].id, "stage_id": stages[0].id},
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, wisdom_badgees[0], [knowledge_badges[0].id])
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": fields[-1].id, "stage_id": stages[-1].id},
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, wisdom_badgees[-1], [knowledge_badges[-1].id])

    def test_wisdom_badges_list_400(self):
        factory = APIRequestFactory()
        view = WisdomBadgesList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": self.invalid_param_alpha, "stage_id": 0},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": self.invalid_param_fullchar, "stage_id": 0},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": 0, "stage_id": self.invalid_param_alpha},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": 0, "stage_id": self.invalid_param_fullchar},
            "parameters",
        )
        self.request_invalid_value(
            factory, view, self.wisdom_badges_list_url, {"field_id": 0}, "parameters"
        )
        self.request_invalid_value(
            factory, view, self.wisdom_badges_list_url, {"stage_id": 0}, "parameters"
        )
        self.request_no_param(
            factory, view, self.wisdom_badges_list_url, {}, "parameters"
        )

    def test_wisdom_badges_list_200_zero(self):
        factory = APIRequestFactory()
        view = WisdomBadgesList.as_view()
        self.create_test_relation_data()
        self.request_normal_zero_array(
            factory,
            view,
            self.wisdom_badges_list_url,
            {"field_id": self.not_found_id, "stage_id": self.not_found_id}
        )
