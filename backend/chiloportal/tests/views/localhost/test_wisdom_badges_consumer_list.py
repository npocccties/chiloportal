from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class WisdomBadgesConsumerListTests(BaseAPIViewTests):
    def test_wisdom_badges_consumer_list_200(self):
        factory = APIRequestFactory()
        view = WisdomBadgesConsumerList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_consumer_list_url,
            {"badges_id": self.wb5.id},
        )
        array = response.data
        self.assert_consumers(array, [self.cons1, self.cons2, self.cons3])

    def test_wisdom_badges_consumer_list_200_first_and_last(self):
        factory = APIRequestFactory()
        view = WisdomBadgesConsumerList.as_view()
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
        first = wisdom_badgees[0]
        response = self.request_normal(
            factory, view, self.wisdom_badges_consumer_list_url, {"badges_id": first.id}
        )
        array = response.data
        self.assert_consumers(array, [consumers[0]])
        last = wisdom_badgees[-1]
        response = self.request_normal(
            factory, view, self.wisdom_badges_consumer_list_url, {"badges_id": last.id}
        )
        array = response.data
        self.assert_consumers(array, [consumers[-1]])

    def test_wisdom_badges_consumer_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = WisdomBadgesConsumerList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_consumer_list_url,
            {"badges_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_consumer_list_url,
            {"badges_id": self.invalid_param_fullchar},
        )

    def test_wisdom_badges_consumer_list_400_no_param(self):
        factory = APIRequestFactory()
        view = WisdomBadgesConsumerList.as_view()
        self.request_no_param(factory, view, self.wisdom_badges_consumer_list_url)

    def test_wisdom_badges_consumer_list_200_not_found(self):
        factory = APIRequestFactory()
        view = WisdomBadgesConsumerList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_consumer_list_url,
            {"badges_id": self.not_found_id}
        )
        array = response.data
        self.assertEqual(len(array), 0)
