from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *
import requests
from urllib.parse import urljoin
from django.test import tag


class FuzzingTests(BaseAPIViewTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        base_url = "http://dev-portal.oku.cccties.org/api/v1/"
        url = urljoin(base_url, "consumer/")
        # self.test_data_count = 1
        for i in range(self.test_data_count):
            response = requests.get(url, {"consumer_id": i + 1})
            data = response.json()
            self.assertEqual(data.get("consumer_id"), i + 1)
        url = urljoin(base_url, "consumer/framework/list")
        for i in range(self.test_data_count):
            response = requests.get(url, {"consumer_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)
        url = urljoin(base_url, "consumer/list/")
        for i in range(self.test_data_count):
            response = requests.get(url)
            array = response.json()
            self.assertEqual(len(array), self.test_data_count)
        url = urljoin(base_url, "framework/field/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"framework_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)
        url = urljoin(base_url, "framework/field/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"framework_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)
        url = urljoin(base_url, "wisdomBadges/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"field_id": i + 1, "stage_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)
