from rest_framework.test import APIRequestFactory

from chiloportal.views.badges_list import BadgesList
from .base_api_view_tests import BaseAPIViewTests
from ....views import *

class BadgesListTest(BaseAPIViewTests):
    def test_badges_list_200_issuer_id(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_list_url,
            {"issuer_id": self.iss1.id },
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 3)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])

    def test_badges_list_200_portal_category_id(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_list_url,
            {"portal_category_id": self.pc1.id },
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 4)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])
        
    def test_badges_list_200_issuer_id_and_poortal_category_id(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_list_url,
            {"issuer_id": self.iss2.id ,"portal_category_id": self.pc1.id },
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb4, [])
        
    def test_badges_list_200_no_param(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_list_url,
            { },
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 16)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb3, [])

    def test_badges_list_200_page_number(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.badges_list_url,
            { "page_number": 1 },
        )
        self.assert_page(response.data, total_count=16, start=1, end=16)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])
        data = array[4]
        self.assert_wisdom_badge(data, self.wb5, [self.kb5.id, self.kb6.id])

    def test_badges_list_400_no_data_issuer_id(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": 999 },
            message="parameters"
        )

    def test_badges_list_400_no_data_portal_category_id(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "portal_category_id": 999 },
            message="parameters"
        )
        
    def test_badges_list_400_no_data_page_number(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "page_number": 999 },
            message="parameters"
        )
    
    def test_badges_list_400_(self):
        factory = APIRequestFactory()
        view = BadgesList.as_view()
        self.create_test_relation_data()
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "portal_category_id": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "page_number": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.iss1, "portal_category_id": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.invalid_param_alpha, "portal_category_id": self.pc1.id },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.invalid_param_alpha, "portal_category_id": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.iss1, "portal_category_id": self.pc1, "page_number": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.invalid_param_alpha, "portal_category_id": self.pc1, "page_number": self.invalid_param_alpha },
            message="parameters"
        )
        self.request_invalid_value(
            factory,
            view,
            self.badges_list_url,
            { "issuer_id": self.iss1, "portal_category_id": self.invalid_param_alpha, "page_number": self.invalid_param_alpha },
            message="parameters"
        )