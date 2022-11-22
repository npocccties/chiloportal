from django.test import TestCase
import requests
from urllib.parse import urljoin
from rest_framework import status
import time


class BaseApiTests(TestCase):
    # 下記ドメインは実在するものに変更してからテストしてください
    base_url = "https://portal.example.org/"
    frontend_url = base_url
    frontend_framework_stages_url = urljoin(
        frontend_url, "consumers/1/frameworks/1/stages/1"
    )
    backend_url = urljoin(base_url, "/api/v1/")
    consumer_detail_url = urljoin(backend_url, "consumer/")
    consumer_list_url = urljoin(backend_url, "consumer/list/")
    stage_field_list_url = urljoin(backend_url, "stage/field/list/")
    portal_category_list_url = urljoin(backend_url, "portalCategory/list/")
    portal_category_badge_list_url = urljoin(backend_url, "portalCategory/badges/list/")
    framework_url = urljoin(backend_url, "framework/")
    framework_stage_list_url = urljoin(backend_url, "framework/stage/list/")
    badges_url = urljoin(backend_url, "badges/")
    wisdom_badges_list_keyword_url = urljoin(backend_url, "wisdomBadges/list/keyword/")
    wisdom_badges_consumer_list_url = urljoin(
        backend_url, "wisdomBadges/consumer/list/"
    )
    consumer_framework_list_url = urljoin(backend_url, "consumer/framework/list/")
    test_data_count = 300

    def request_frontend_framework_stages(self, total_count, interval_secconds):
        for i in range(total_count):
            response = requests.get(self.frontend_framework_stages_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            time.sleep(interval_secconds)

    def request_consumer(self):
        for i in range(self.test_data_count):
            response = requests.get(self.consumer_detail_url, {"consumer_id": i + 1})
            data = response.json()
            if response.status_code == status.HTTP_200_OK:
                self.assertEqual(data.get("consumer_id"), i + 1)

    def request_consumer_framework_list(self):
        for i in range(self.test_data_count):
            response = requests.get(
                self.consumer_framework_list_url, {"consumer_id": i + 1}
            )
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)

    def request_consumer_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.wisdom_badges_consumer_list_url)
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), self.test_data_count)

    def request_framework_stage_list(self):
        for i in range(self.test_data_count):
            response = requests.get(
                self.framework_stage_list_url, {"framework_id": i + 1}
            )
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)
