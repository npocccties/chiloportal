from django.test import tag
import threading
from .base_api_tests import *


class FuzzingTests(BaseApiTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        proxies = self.read_proxies()
        threads = []
        for i in range(len(proxies)):
            thread = threading.Thread(
                target=self.request_frontend_framework_stages_proxy,
                args=(proxies[i], 1),
            )
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        print(f"number of OK: {len(self.status_results_ok)}")
        print(f"number of NG: {len(self.status_results_ng)}")
        for ng in self.status_results_ng:
            print(ng)
