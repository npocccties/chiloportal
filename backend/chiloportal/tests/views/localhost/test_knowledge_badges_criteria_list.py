from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class KnowledgeBadgesCriteriaListTests(BaseAPIViewTests):
    def test_knowledge_badges_criteria_list_200(self):
        factory = APIRequestFactory()
        view = KnowledgeBadgesCriteriaList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": self.kb1.id},
        )
        array = response.data
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assert_criteria(data, self.ct1)
        data = array[1]
        self.assert_criteria(data, self.ct2)

    def test_knowledge_badges_criteria_list_200_first_and_last(self):
        factory = APIRequestFactory()
        view = KnowledgeBadgesCriteriaList.as_view()
        (
            portal_categories,
            issuers,
            wisdom_badgees,
            knowledge_badges,
            criterias,
        ) = self.create_test_criteria_data(self.test_data_count)
        first = knowledge_badges[0]
        response = self.request_normal(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": first.id},
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_criteria(data, criterias[0])
        last = knowledge_badges[-1]
        response = self.request_normal(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": last.id},
        )
        array = response.data
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_criteria(data, criterias[-1])

    def test_knowledge_badges_criteria_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = KnowledgeBadgesCriteriaList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": self.invalid_param_fullchar},
        )

    def test_knowledge_badges_criteria_list_400_no_param(self):
        factory = APIRequestFactory()
        view = KnowledgeBadgesCriteriaList.as_view()
        self.request_no_param(factory, view, self.knowledge_badges_criteria_list_url)

    def test_knowledge_badges_criteria_list_404(self):
        factory = APIRequestFactory()
        view = KnowledgeBadgesCriteriaList.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.knowledge_badges_criteria_list_url,
            {"badges_id": self.not_found_id},
            "Criteria",
        )
