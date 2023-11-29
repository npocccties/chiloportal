from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class IssuerListTests(BaseAPIViewTests):
    def test_issuer_list_200(self):
        factory = APIRequestFactory()
        view = IssuerList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(factory, view, self.issuer_list_url)
        self.assert_issuers(
            response.data, [iss for iss in Issuer.objects.all().order_by("pk")]
        )

    def test_issuer_list_200_many(self):
        factory = APIRequestFactory()
        view = IssuerList.as_view()
        issuers = self.create_test_issuer_data(self.test_data_count)
        response = self.request_normal(factory, view, self.issuer_list_url)
        self.assert_issuers(response.data, issuers)

    def test_issuer_list_200_zero(self):
        factory = APIRequestFactory()
        view = IssuerList.as_view()
        self.request_normal_zero_array(factory, view, self.issuer_list_url, {})
