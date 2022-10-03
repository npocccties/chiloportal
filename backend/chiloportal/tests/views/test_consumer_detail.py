from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *

class ConsumerDetailTests(BaseAPIViewTests):
    def test_consumer_detail_200(self):
        factory = APIRequestFactory()
        view = ConsumerDetail.as_view()
        self.create_test_data()
        response = self.request_normal(factory, view, self.consumer_detail_url, {'consumer_id': self.cons1.id})
        data = response.data
        self.assert_consumer(data, self.cons1)
        response = self.request_normal(factory, view, self.consumer_detail_url, {'consumer_id': self.cons3.id})
        data = response.data
        self.assert_consumer(data, self.cons3)

    def test_consumer_detail_400_invalid_value(self):
        factory = APIRequestFactory()
        view = ConsumerDetail.as_view()
        self.request_invalid_value(factory, view, self.consumer_detail_url, {'consumer_id': self.invalid_param_alpha})
        self.request_invalid_value(factory, view, self.consumer_detail_url, {'consumer_id': self.invalid_param_fullchar})

    def test_consumer_detail_400_no_param(self):
        factory = APIRequestFactory()
        view = ConsumerDetail.as_view()
        self.request_no_param(factory, view, self.consumer_detail_url)

    def test_consumer_detail_404(self):
        factory = APIRequestFactory()
        view = ConsumerDetail.as_view()
        self.create_test_data()
        self.request_not_found(factory, view, self.consumer_detail_url, {'consumer_id': self.not_found_id}, 'Consumer')
