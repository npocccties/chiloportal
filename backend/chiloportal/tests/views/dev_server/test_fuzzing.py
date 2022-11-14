from django.test import tag
import threading
from .base_api_tests import *

class FuzzingTests(BaseApiTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        threads = []
        thread = threading.Thread(target=self.request_consumer)
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_consumer_framework_list
        )
        thread.start()
        threads.append(thread)
        thread = threading.Thread(target=self.request_consumer_list)
        thread.start()
        threads.append(thread)
        thread = threading.Thread(
            target=self.request_framework_stage_list
        )
        thread.start()
        threads.append(thread)
        for thread in threads:
            thread.join()
