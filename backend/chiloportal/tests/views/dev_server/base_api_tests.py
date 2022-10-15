from django.test import TestCase
import requests
from urllib.parse import urljoin
from rest_framework import status


class BaseApiTests(TestCase):
    base_url = "http://dev-portal.oku.cccties.org/api/v1/"
    consumer_detail_url = urljoin(base_url, "consumer/")
    consumer_list_url = urljoin(base_url, "consumer/list/")
    framework_field_list_url = urljoin(base_url, "framework/field/list/")
    stage_field_list_url = urljoin(base_url, "stage/field/list/")
    portal_category_list_url = urljoin(base_url, "portalCategory/list/")
    portal_category_badge_list_url = urljoin(base_url, "portalCategory/badges/list/")
    framework_url = urljoin(base_url, "framework/")
    framework_stage_list_url = urljoin(base_url, "framework/stage/list/")
    badges_url = urljoin(base_url, "badges/")
    wisdom_badges_list_url = urljoin(base_url, "wisdomBadges/list/")
    wisdom_badges_list_keyword_url = urljoin(base_url, "wisdomBadges/list/keyword/")
    wisdom_badges_consumer_list_url = urljoin(base_url, "wisdomBadges/consumer/list/")
    knowledge_badges_criteria_list_url = urljoin(
        base_url, "knowledgeBadges/criteria/list/"
    )
    consumer_framework_list_url = urljoin(base_url, "consumer/framework/list/")
    test_data_count = 300

    def request_consumer(self):
        for i in range(self.test_data_count):
            response = requests.get(self.consumer_detail_url, {"consumer_id": i + 1})
            data = response.json()
            if response.status_code == status.HTTP_200_OK:
                self.assertEqual(data.get("consumer_id"), i + 1)

    def request_consumer_framework_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.consumer_framework_list_url, {"consumer_id": i + 1})
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)

    def request_consumer_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.wisdom_badges_consumer_list_url)
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), self.test_data_count)

    def request_framework_field_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.framework_field_list_url, {"framework_id": i + 1})
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)

    def request_framework_stage_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.framework_stage_list_url, {"framework_id": i + 1})
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)

    def request_wisdom_badges_list(self):
        for i in range(self.test_data_count):
            response = requests.get(self.wisdom_badges_list_url, {"field_id": i + 1, "stage_id": i + 1})
            if response.status_code == status.HTTP_200_OK:
                array = response.json()
                self.assertEqual(len(array), 1)
