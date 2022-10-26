from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ....views import *


class FrameworkFieldListTests(BaseAPIViewTests):
    def test_framework_field_list_200(self):
        factory = APIRequestFactory()
        view = FrameworkFieldList.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory, view, self.framework_field_list_url, {"framework_id": self.frm1.id}
        )
        data = response.data
        array = data.get("field1")
        self.assertEqual(len(array), 5)
        field1 = array[0]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field1)
        self.assert_field(field1, fields2[0], fields3[1], self.field2)
        field1 = array[1]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field3)
        fields3 = fields2[1].get("field3")
        self.assert_field(field1, fields2[1], fields3[0], self.field4)
        field1 = array[2]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field5)
        self.assert_field(field1, fields2[0], fields3[1], self.field6)
        field1 = array[3]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field7)
        field1 = array[4]
        fields2 = field1.get("field2")
        fields3 = fields2[0].get("field3")
        self.assert_field(field1, fields2[0], fields3[0], self.field8)

    def test_framework_field_list_400_invalid_value(self):
        factory = APIRequestFactory()
        view = FrameworkFieldList.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.framework_field_list_url,
            {"framework_id": self.invalid_param_alpha},
        )
        self.request_invalid_value(
            factory,
            view,
            self.framework_field_list_url,
            {"framework_id": self.invalid_param_fullchar},
        )

    def test_framework_field_list_400_no_param(self):
        factory = APIRequestFactory()
        view = FrameworkFieldList.as_view()
        self.request_no_param(factory, view, self.framework_field_list_url)

    def test_framework_field_list_200_zero(self):
        factory = APIRequestFactory()
        view = FrameworkFieldList.as_view()
        self.create_test_relation_data()
        self.request_normal_zero_array(
            factory,
            view,
            self.framework_field_list_url,
            {"framework_id": self.not_found_id},
        )
