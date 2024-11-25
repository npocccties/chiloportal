from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class StageFieldListTests(BaseAPIViewTests):
    def test_stage_field_list_200(self):
        factory = APIRequestFactory()
        view = StageFieldList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory, view, self.stage_field_list_url, {"stage_id": self.stg1.id}
        )
        data = response.data
        array = data.get("field1")
        self.assertEqual(len(array), 5)
        field1 = array[0]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field1, [self.wb1.id])
        self.assert_field(field1, fields2[0], fields3[1], self.field2, [self.wb1.id])
        field1 = array[1]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field3, [self.wb2.id])
        fields3 = fields2[1].get("field3")
        self.assert_field(field1, fields2[1], fields3[0], self.field4, [self.wb2.id])
        field1 = array[2]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field5, [self.wb3.id])
        self.assert_field(field1, fields2[0], fields3[1], self.field6, [self.wb3.id])
        field1 = array[3]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field7, [self.wb4.id])
        field1 = array[4]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field8, [self.wb5.id])

    def test_stage_field_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = StageFieldList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.stage_field_list_url,
            {"stage_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.stage_field_list_url,
            {"stage_id": self.invalid_param_fullchar},
        )

    def test_stage_field_list_400_no_param(self):
        factory = APIRequestFactory()
        view = StageFieldList.as_view()
        self.request_no_param(factory, view, self.stage_field_list_url)

    def test_stage_field_list_200_not_found(self):
        factory = APIRequestFactory()
        view = StageFieldList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.stage_field_list_url,
            {"stage_id": self.not_found_id}
        )
        array = response.data
        self.assertEqual(len(array), 0)
