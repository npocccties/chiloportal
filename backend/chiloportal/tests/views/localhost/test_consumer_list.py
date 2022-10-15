from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class ConsumerListTests(BaseAPIViewTests):
    def test_consumer_list_200(self):
        factory = APIRequestFactory()
        view = ConsumerList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(factory, view, self.consumer_list_url)
        self.assert_consumers(
            response.data, [cons for cons in Consumer.objects.all().order_by("pk")]
        )

    def test_consumer_list_200_many(self):
        factory = APIRequestFactory()
        view = ConsumerList.as_view()
        consumers = self.create_test_consumer_data(self.test_data_count)
        response = self.request_normal(factory, view, self.consumer_list_url)
        self.assert_consumers(response.data, consumers)

    def test_consumer_list_404(self):
        factory = APIRequestFactory()
        view = ConsumerList.as_view()
        self.request_not_found(factory, view, self.consumer_list_url, {}, "Data")
