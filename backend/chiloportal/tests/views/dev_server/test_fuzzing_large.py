from django.test import tag
import threading
from .base_api_tests import *


class FuzzingTests(BaseApiTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        threads = []
        for i in range(len(self.proxies)):
            thread = threading.Thread(
                target=self.request_frontend_framework_stages_proxy,
                args=(self.proxies[i],),
            )
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
