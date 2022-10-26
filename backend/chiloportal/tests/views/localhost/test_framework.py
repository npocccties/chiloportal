from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class FrameworkTests(BaseAPIViewTests):
    def test_framework_200(self):
        factory = APIRequestFactory()
        view = FrameworkDetail.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory, view, self.framework_url, {"framework_id": self.frm1.id}
        )
        data = response.data
        self.assert_framework(response.data, self.frm1)
        response = self.request_normal(
            factory, view, self.framework_url, {"framework_id": self.frm2.id}
        )
        data = response.data
        self.assert_framework(data, self.frm2)

    def test_framework_200_first_and_last(self):
        factory = APIRequestFactory()
        view = FrameworkDetail.as_view()
        consumers, frameworks = self.create_test_framework_data(self.test_data_count)
        first = frameworks[0]
        response = self.request_normal(
            factory, view, self.framework_url, {"framework_id": first.id}
        )
        data = response.data
        self.assert_framework(data, first)
        last = frameworks[-1]
        response = self.request_normal(
            factory, view, self.framework_url, {"framework_id": last.id}
        )
        data = response.data
        self.assert_framework(data, last)

    def test_framework_400_invalid_value(self):
        factory = APIRequestFactory()
        view = FrameworkDetail.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.framework_url,
            {"framework_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.framework_url,
            {"framework_id": self.invalid_param_fullchar},
        )

    def test_framework_400_no_param(self):
        factory = APIRequestFactory()
        view = FrameworkDetail.as_view()
        self.request_no_param(factory, view, self.framework_url)

    def test_framework_200_empty(self):
        factory = APIRequestFactory()
        view = FrameworkDetail.as_view()
        self.create_test_relation_data()
        self.request_normal_empty(
            factory,
            view,
            self.framework_url,
            {"framework_id": self.not_found_id}
        )
