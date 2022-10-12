from rest_framework.test import APIRequestFactory
from .base_api_view_tests import BaseAPIViewTests
from ...views import *


class WisdomBadgesListKeywordTests(BaseAPIViewTests):
    def test_wisdom_badges_list_keyword_200_name_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb3.name, "page_number": 1},
        )
        self.assert_page(response.data, total_count=1, start=1, end=1)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])

    def test_wisdom_badges_list_keyword_200_name_2_halfspace(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": f"{self.wb3.name} {self.wb4.name}", "page_number": 1},
        )
        array = response.data.get("badges")
        data = array[0]
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb4, [])

    def test_wisdom_badges_list_keyword_200_name_2_fullspace(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": f"{self.wb3.name}　{self.wb4.name}", "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 2)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb4, [])

    def test_wisdom_badges_list_keyword_200_name_3_fullspace_halfspace(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {
                "keyword": f"{self.wb3.name}　{self.wb4.name} {self.wb5.name}",
                "page_number": 1,
            },
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 3)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb4, [])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb5, [self.kb5.id, self.kb6.id])

    def test_wisdom_badges_list_keyword_200_name_1_startswith(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb1.name[:10], "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])

    def test_wisdom_badges_list_keyword_200_name_1_part(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb1.name[1:10], "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])

    def test_wisdom_badges_list_keyword_200_name_1_endswith(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb1.name[10:], "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])

    def test_wisdom_badges_list_keyword_200_description_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb3.description, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])

    def test_wisdom_badges_list_keyword_200_alignments_targetname_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb3.alignments_targetname, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb3, [])

    def test_wisdom_badges_list_keyword_200_knowledge_name_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.kb3.name, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])

    def test_wisdom_badges_list_keyword_200_knowledge_description_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.kb3.description, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])

    def test_wisdom_badges_list_keyword_200_knowledge_criteria_narrative_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.kb3.criteria_narrative, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])

    def test_wisdom_badges_list_keyword_200_criteria_name_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.ct3.name, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])

    def test_wisdom_badges_list_keyword_200_wisdom_badge_tags_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb8.tags, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb8, [])

    def test_wisdom_badges_list_keyword_200_knowledge_badge_tags_1(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": self.wb2.tags, "page_number": 1},
        )
        array = response.data.get("badges")
        self.assertEqual(len(array), 1)
        data = array[0]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])

    def test_wisdom_badges_list_keyword_200_no_page_number(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory, view, self.wisdom_badges_list_keyword_url, {"keyword": "hoge"}
        )
        self.assert_page(response.data, total_count=16, start=1, end=16)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb1, [self.kb1.id, self.kb2.id])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb2, [self.kb3.id, self.kb4.id])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb3, [])
        data = array[3]
        self.assert_wisdom_badge(data, self.wb4, [])
        data = array[4]
        self.assert_wisdom_badge(data, self.wb5, [self.kb5.id, self.kb6.id])
        data = array[5]
        self.assert_wisdom_badge(data, self.wb6, [])
        data = array[6]
        self.assert_wisdom_badge(data, self.wb7, [])
        data = array[7]
        self.assert_wisdom_badge(data, self.wb8, [])
        data = array[8]
        self.assert_wisdom_badge(data, self.wb9, [])
        data = array[9]
        self.assert_wisdom_badge(data, self.wb10, [])

    def test_wisdom_badges_list_keyword_200_pages(self):
        factory = APIRequestFactory()
        prev = WisdomBadgesListKeyword.per_page
        WisdomBadgesListKeyword.per_page = 3
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        response = self.request_normal(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "hoge", "page_number": 3},
        )
        self.assert_page(response.data, total_count=16, start=7, end=9)
        array = response.data.get("badges")
        data = array[0]
        self.assert_wisdom_badge(data, self.wb7, [])
        data = array[1]
        self.assert_wisdom_badge(data, self.wb8, [])
        data = array[2]
        self.assert_wisdom_badge(data, self.wb9, [])
        WisdomBadgesListKeyword.per_page = prev

    def test_wisdom_badges_list_keyword_400_empty(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "", "page_number": 1},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "hoge", "page_number": self.invalid_param_alpha},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "hoge", "page_number": self.invalid_param_fullchar},
            "parameters",
        )
        self.request_invalid_value(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"page_number": 1},
            "parameters",
        )

    def test_wisdom_badges_list_keyword_400_not_exist_param(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.request_invalid_value(
            factory, view, self.wisdom_badges_list_keyword_url, {}, "parameters"
        )

    def test_wisdom_badges_list_keyword_404(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        self.request_not_found(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "穂毛帆毛", "page_number": 1},
            "Badges",
        )

    def test_wisdom_badges_list_keyword_404_page_is_empty(self):
        factory = APIRequestFactory()
        view = WisdomBadgesListKeyword.as_view()
        self.create_test_relation_data()
        self.request_page_is_empty(
            factory,
            view,
            self.wisdom_badges_list_keyword_url,
            {"keyword": "ほげ", "page_number": 0},
        )
