from django.test import TestCase
import requests
from urllib.parse import urljoin
from rest_framework import status
import time
import csv


class BaseApiTests(TestCase):
    # 下記ドメインは実在するものに変更してからテストしてください
    base_url = "https://test-portal.oku.cccties.org/"
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

    def read_proxies(self):
        filename = "proxies.csv"
        proxies = []
        with open(filename, encoding="utf8", newline="") as f:
            csvreader = csv.reader(f)
            for rows in csvreader:
                http_row = rows[0]
                if http_row[0] == "#":
                    continue
                address = {http_row: rows[1]}
                proxies.append(address)
        return proxies

    def request_frontend_framework_stages(self, total_count, interval_secconds):
        for i in range(total_count):
            response = requests.get(self.frontend_framework_stages_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            time.sleep(interval_secconds)

    def request_frontend_framework_stages_proxy(self, proxy):
        self.status_results_ok = list()
        self.status_results_ng = list()
        try:
            response = requests.get(self.frontend_framework_stages_url, proxies=proxy)
            print(f"OK: {proxy}")
            self.status_results_ok.append({"OK": proxy})
        except requests.exceptions.RequestException as e:
            print(e)
            print(f"NG: {proxy}")
            self.status_results_ng.append({"NG": proxy})
