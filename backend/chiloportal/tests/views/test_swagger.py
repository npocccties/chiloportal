from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *
from ...swagger import *


class SwaggerTests(BaseAPIViewTests):
    def test_run_ok(self):
        view = BadgesDetail()
        filter = SwaggerQueryParamFilter()
        fields = filter.get_schema_fields(view)
        self.assert_swagger_param(fields[0], view.swagger_query_params[0])
        self.assert_swagger_param(fields[1], view.swagger_query_params[1])
        
