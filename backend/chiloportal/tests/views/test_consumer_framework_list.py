from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *


class ConsumerFrameworkListTests(BaseAPIViewTests):
    def test_consumer_framework_list_200(self):
        factory = APIRequestFactory()
        view = ConsumerFrameworkList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.consumer_framework_list_url,
            {"consumer_id": self.cons2.id},
        )
        self.assert_frameworks(response.data, [self.frm2, self.frm3])

    def test_consumer_framework_list_200_first_and_last(self):
        factory = APIRequestFactory()
        view = ConsumerFrameworkList.as_view()
        consumers, frameworks = self.create_test_framework_data(self.test_data_count)
        first = consumers[0]
        response = self.request_normal(
            factory, view, self.consumer_framework_list_url, {"consumer_id": first.id}
        )
        self.assert_frameworks(response.data, [frameworks[0]])
        last = consumers[-1]
        response = self.request_normal(
            factory, view, self.consumer_framework_list_url, {"consumer_id": last.id}
        )
        self.assert_frameworks(response.data, [frameworks[-1]])

    def test_consumer_framework_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = ConsumerFrameworkList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.consumer_framework_list_url,
            {"consumer_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.consumer_framework_list_url,
            {"consumer_id": self.invalid_param_fullchar},
        )

    def test_consumer_framework_list_400_no_param(self):
        factory = APIRequestFactory()
        view = ConsumerFrameworkList.as_view()
        self.request_no_param(factory, view, self.consumer_framework_list_url)

    def test_consumer_framework_list_404(self):
        factory = APIRequestFactory()
        view = ConsumerFrameworkList.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.consumer_framework_list_url,
            {"consumer_id": self.not_found_id},
            "Framework",
        )
