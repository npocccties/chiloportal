from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *
import os


class PortalCategoryListTests(BaseAPIViewTests):
    def test_portal_category_list_200_not_sorted(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories(response.data)

    def test_portal_category_list_200_sorted(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        portal_categories = self.create_sort_test_data()
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories_sort(response.data, portal_categories)

    def test_portal_category_list_200_not_found_env(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        portal_categories = self.create_sort_test_data(is_reverse=True)
        portal_category_sort_order = os.environ.get("PORTAL_CATEGORY_SORT_ORDER")
        os.environ["PORTAL_CATEGORY_SORT_ORDER"] = ""
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories_sort(response.data, portal_categories)
        os.environ["PORTAL_CATEGORY_SORT_ORDER"] = portal_category_sort_order

    def test_portal_category_list_200_mix(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.create_test_relation_data()
        portal_categories = self.create_sort_test_data()
        response = self.request_normal(factory, view, self.portal_category_list_url)
        self.assert_portal_categories_sort(response.data, portal_categories)

    def test_portal_category_list_200_zero(self):
        factory = APIRequestFactory()
        view = PortalCategoryList.as_view()
        self.request_normal_zero_array(factory, view, self.portal_category_list_url, {})

    def create_sort_test_data(self, is_reverse=False):
        sort_orders = os.environ.get("PORTAL_CATEGORY_SORT_ORDER").split(",")
        if is_reverse:
            sort_orders = [sort_order for sort_order in reversed(sort_orders)]
        portal_categories = []
        for sort_order in sort_orders:
            for i in range(10):
                pc = PortalCategory.objects.create(
                    name=sort_order,
                    description=f"{sort_order}のせつめいです",
                    image_url_path=f"hogep-img-url{i}",
                    sort_key=i,
                )
                portal_categories.append(pc)
        return portal_categories
