from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class PortalCategoryBadgeListTests(BaseAPIViewTests):
    def test_portal_category_badge_list_200(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.pc2.id, "page_number": 1},
        )
        self.assert_page(response.data, total_count=1, start=1, end=1)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb5, [self.kb5.id, self.kb6.id])

    def test_portal_category_badge_list_200_no_page_number(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.pc1.id},
        )
        self.assert_page(response.data, total_count=4, start=1, end=4)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb3, [])
        data = array[3]
        self.assert_wisdom_badge(data, self.wb4, [])

    def test_portal_category_badge_list_200_pages(self):
        factory = APIRequestFactory()
        prev = PortalCategoryBadgesList.per_page
        PortalCategoryBadgesList.per_page = 2
        view = PortalCategoryBadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.pc3.id, "page_number": 2},
        )
        self.assert_page(response.data, total_count=5, start=3, end=4)
        array = response.data.get("badges")
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb8, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb9, [])
        PortalCategoryBadgesList.per_page = prev

    def test_portal_category_badge_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.invalid_param_alpha, "page_number": 1},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.invalid_param_fullchar, "page_number": 1},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": 1, "page_number": "fugafuga"},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"page_number": "fugafuga"},
            "parameters",
        )

    def test_portal_category_badge_list_400_no_param(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.request_no_param(
            factory, view, self.portal_category_badge_list_url, {}, "parameters"
        )

    def test_portal_category_badge_list_200_zero(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.not_found_id, "page_number": 1},
        )
        self.assert_page(response.data, total_count=0, start=0, end=0)
        array = response.data.get("badges")
        self.assertEqual(len(array), 0)

    def test_portal_category_badge_list_400_invalid_page_number(self):
        factory = APIRequestFactory()
        view = PortalCategoryBadgesList.as_view()
        self.create_test_relation_data()
        self.request_invalid_value(
            factory,
            view,
            self.portal_category_badge_list_url,
            {"portal_category_id": self.pc2.id, "page_number": 0},
            "parameters",
        )
