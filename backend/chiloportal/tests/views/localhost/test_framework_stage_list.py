from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class FrameworkStageTests(BaseAPIViewTests):
    def test_framework_stage_list_200(self):
        factory = APIRequestFactory()
        view = FrameworkStageList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory, view, self.framework_stage_list_url, {"framework_id": self.frm1.id}
        )
        self.assert_stages(response.data, [self.stg1])
        response = self.request_normal(
            factory, view, self.framework_stage_list_url, {"framework_id": self.frm6.id}
        )
        self.assert_stages(response.data, [self.stg4, self.stg5, self.stg6])

    def test_framework_stage_list_200_first_and_last(self):
        factory = APIRequestFactory()
        view = FrameworkStageList.as_view()
        consumers, frameworks, fields, stages, goals = self.create_test_goal_data(
            self.test_data_count
        )
        first = frameworks[0]
        response = self.request_normal(
            factory, view, self.framework_stage_list_url, {"framework_id": first.id}
        )
        self.assert_stages(response.data, [stages[0]])
        last = frameworks[-1]
        response = self.request_normal(
            factory, view, self.framework_stage_list_url, {"framework_id": last.id}
        )
        self.assert_stages(response.data, [stages[-1]])

    def test_framework_stage_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = FrameworkStageList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.framework_stage_list_url,
            {"framework_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.framework_stage_list_url,
            {"framework_id": self.invalid_param_fullchar},
        )

    def test_framework_stage_list_400_no_param(self):
        factory = APIRequestFactory()
        view = FrameworkStageList.as_view()
        self.request_no_param(factory, view, self.framework_stage_list_url)

    def test_framework_stage_list_404(self):
        factory = APIRequestFactory()
        view = FrameworkStageList.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.framework_stage_list_url,
            {"framework_id": self.not_found_id},
            "Stage",
        )
