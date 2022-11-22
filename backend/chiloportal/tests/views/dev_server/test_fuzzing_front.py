from django.test import tag
import threading
from .base_api_tests import *


class FuzzingFrontendTests(BaseApiTests):
    @tag("fuzzing")
    def test_large_http_requests_200(self):
        self.request_frontend_framework_stages(total_count=3600, interval_secconds=1)
