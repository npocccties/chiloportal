from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *
import requests
from urllib.parse import urljoin
from django.test import tag
import threading


class FuzzingTests(BaseAPIViewTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        base_url = "http://dev-portal.oku.cccties.org/api/v1/"
        threads = []
        thread = threading.Thread(target=self.request_consumer, args=(base_url,))
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_consumer_framework_list, args=(base_url,)
        )
        thread.start()
        threads.append(thread)
        thread = threading.Thread(target=self.request_consumer_list, args=(base_url,))
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_framework_field_list, args=(base_url,)
        )
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_framework_stage_list, args=(base_url,)
        )
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_wisdom_badges_list, args=(base_url,)
        )
        thread.start()
        threads.append(thread)
        for thread in threads:
            thread.join()

    def request_consumer(self, base_url):
        url = urljoin(base_url, "consumer/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"consumer_id": i + 1})
            data = response.json()
            self.assertEqual(data.get("consumer_id"), i + 1)

    def request_consumer_framework_list(self, base_url):
        url = urljoin(base_url, "consumer/framework/list")
        for i in range(self.test_data_count):
            response = requests.get(url, {"consumer_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)

    def request_consumer_list(self, base_url):
        url = urljoin(base_url, "consumer/list/")
        for i in range(self.test_data_count):
            response = requests.get(url)
            array = response.json()
            self.assertEqual(len(array), self.test_data_count)

    def request_framework_field_list(self, base_url):
        url = urljoin(base_url, "framework/field/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"framework_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)

    def request_framework_stage_list(self, base_url):
        url = urljoin(base_url, "framework/stage/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"framework_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)

    def request_wisdom_badges_list(self, base_url):
        url = urljoin(base_url, "wisdomBadges/list/")
        for i in range(self.test_data_count):
            response = requests.get(url, {"field_id": i + 1, "stage_id": i + 1})
            array = response.json()
            self.assertEqual(len(array), 1)
