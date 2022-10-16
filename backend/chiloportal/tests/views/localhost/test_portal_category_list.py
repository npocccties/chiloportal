from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class PortalCategoryListTests(BaseAPIViewTests):
    def test_portal_category_list_200(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories(response.data)

    def test_portal_category_list_200_2(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.create_test_portal_category_data(self.test_data_count)
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories(response.data)

    def test_portal_category_list_404(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.request_not_found(factory, view, self.portal_category_list_url, {}, "Data")
