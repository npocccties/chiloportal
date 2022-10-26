from django.test import TestCase
from rest_framework import status
from ....models import *
from ....views import *
from ....enums import *
from urllib.parse import urljoin


class BaseAPIViewTests(TestCase):
    base_url = "http://localhost:8000"
    consumer_detail_url = urljoin(base_url, "consumer/")
    consumer_list_url = urljoin(base_url, "consumer/list/")
    framework_field_list_url = urljoin(base_url, "framework/field/list/")
    stage_field_list_url = urljoin(base_url, "stage/field/list/")
    portal_category_list_url = urljoin(base_url, "portalCategory/list/")
    portal_category_badge_list_url = urljoin(base_url, "portalCategory/badges/list/")
    framework_url = urljoin(base_url, "framework/")
    framework_stage_list_url = urljoin(base_url, "framework/stage/list/")
    badges_url = urljoin(base_url, "badges/")
    wisdom_badges_list_url = urljoin(base_url, "wisdomBadges/list/")
    wisdom_badges_list_keyword_url = urljoin(base_url, "wisdomBadges/list/keyword/")
    wisdom_badges_consumer_list_url = urljoin(base_url, "wisdomBadges/consumer/list/")
    knowledge_badges_criteria_list_url = urljoin(
        base_url, "knowledgeBadges/criteria/list/"
    )
    consumer_framework_list_url = urljoin(base_url, "consumer/framework/list/")
    not_found_id = 99999
    invalid_param_alpha = "hogehoge"
    invalid_param_fullchar = "ほげほげ"
    test_data_count = 100

    def request_normal(self, factory, view, url, params={}):
        request = factory.get(url, params)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response

    def request_normal_zero_array(self, factory, view, url, params={}):
        response = self.request_normal(factory, view, url, params)
        array = response.data
        self.assertEqual(len(array), 0)

    def request_normal_empty(self, factory, view, url, params={}):
        response = self.request_normal(factory, view, url, params)
        data = response.data
        self.assertEqual(data, {})

    def request_invalid_value(self, factory, view, url, params, message="ID"):
        request = factory.get(url, params)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("detail"), f"Invalid {message} supplied")

    def request_no_param(self, factory, view, url, params={}, message="ID"):
        request = factory.get(url, params)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("detail"), f"Invalid {message} supplied")

    def request_not_found(self, factory, view, url, params={}, messeage=""):
        request = factory.get(url, params)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data.get("detail"), f"{messeage} not found")

    def request_page_is_empty(self, factory, view, url, params={}):
        request = factory.get(url, params)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data.get("detail"), "Page is empty")

    def create_test_relation_data(self):
        self.field1 = Field.objects.create(
            field1_name="ほげふぃーるど1",
            field2_name="ほげふぃーるど2",
            field3_name="ほげほげA",
            sort_key=1,
        )
        self.field2 = Field.objects.create(
            field1_name="ほげふぃーるど1",
            field2_name="ほげふぃーるど2",
            field3_name="ほげほげB",
            sort_key=2,
        )
        self.field3 = Field.objects.create(
            field1_name="ほげふぃーるど2",
            field2_name="ほげふぃーるど1",
            field3_name="ほげほげC",
            sort_key=3,
        )
        self.field4 = Field.objects.create(
            field1_name="ほげふぃーるど2",
            field2_name="ほげふぃーるど2",
            field3_name="ほげほげD",
            sort_key=4,
        )
        self.field5 = Field.objects.create(
            field1_name="ほげふぃーるど3",
            field2_name="ほげふぃーるど1",
            field3_name="ほげほげE",
            sort_key=5,
        )
        self.field6 = Field.objects.create(
            field1_name="ほげふぃーるど3",
            field2_name="ほげふぃーるど1",
            field3_name="ほげほげF",
            sort_key=6,
        )
        self.field7 = Field.objects.create(
            field1_name="ほげふぃーるど4",
            field2_name="ほげふぃーるど3",
            field3_name="ほげほげG",
            sort_key=7,
        )
        self.field8 = Field.objects.create(
            field1_name="ほげふぃーるど5",
            field2_name="ほげふぃーるど3",
            field3_name="ほげほげH",
            sort_key=8,
        )
        self.field9 = Field.objects.create(
            field1_name="ほげふぃーるど6",
            field2_name="ほげふぃーるど4",
            field3_name="ほげほげI",
            sort_key=9,
        )
        self.field10 = Field.objects.create(
            field1_name="ほげふぃーるど7",
            field2_name="ほげふぃーるど5",
            field3_name="ほげほげJ",
            sort_key=9,
        )
        self.cons1 = Consumer.objects.create(
            name="hoge", url="hogehoge.com", email="hoge@hogehoge.com"
        )
        self.cons2 = Consumer.objects.create(
            name="fuga", url="fugafuga.com", email="fuga@fugafuga.com"
        )
        self.cons3 = Consumer.objects.create(
            name="fuga2", url="fugafuga.com", email="fuga2@fugafuga.com"
        )
        self.cons4 = Consumer.objects.create(
            name="hoge4", url="hogehoge.com", email="hoge4@hogehoge.com"
        )
        self.frm1 = Framework.objects.create(
            consumer=self.cons1,
            name="ほげふれーむわーく1",
            description="これはほげふれーむわーく1です",
            supplementary="さぷりめんたり1",
            sort_key=1,
            url="url1",
        )
        self.frm2 = Framework.objects.create(
            consumer=self.cons2,
            name="ほげふれーむわーく2",
            description="これはほげふれーむわーく2です",
            supplementary="さぷりめんたり2",
            sort_key=2,
            url="url2",
        )
        self.frm3 = Framework.objects.create(
            consumer=self.cons2,
            name="ほげふれーむわーく3",
            description="これはほげふれーむわーく3です",
            supplementary="さぷりめんたり3",
            sort_key=3,
            url="url3",
        )
        self.frm4 = Framework.objects.create(
            consumer=self.cons3,
            name="ほげふれーむわーく4",
            description="これはほげふれーむわーく4です",
            supplementary="さぷりめんたり4",
            sort_key=4,
            url="url4",
        )
        self.frm5 = Framework.objects.create(
            consumer=self.cons4,
            name="ほげふれーむわーく5",
            description="これはほげふれーむわーく5です",
            supplementary="さぷりめんたり5",
            sort_key=5,
            url="url5",
        )
        self.frm6 = Framework.objects.create(
            consumer=self.cons4,
            name="ほげふれーむわーく6",
            description="これはほげふれーむわーく6です",
            supplementary="さぷりめんたり6",
            sort_key=6,
            url="url6",
        )
        self.stg1 = Stage.objects.create(
            name="ほげすてーじ1", sub_name="さぶねーむ1", description="これはほげすてーじ1です。", sort_key=1
        )
        self.stg2 = Stage.objects.create(
            name="ほげすてーじ2", sub_name="さぶねーむ2", description="これはほげすてーじ2です。", sort_key=2
        )
        self.stg3 = Stage.objects.create(
            name="ほげすてーじ3", sub_name="さぶねーむ3", description="これはほげすてーじ3です。", sort_key=3
        )
        self.stg4 = Stage.objects.create(
            name="ほげすてーじ4", sub_name="さぶねーむ4", description="これはほげすてーじ4です。", sort_key=4
        )
        self.stg5 = Stage.objects.create(
            name="ほげすてーじ5", sub_name="さぶねーむ5", description="これはほげすてーじ5です。", sort_key=5
        )
        self.stg6 = Stage.objects.create(
            name="ほげすてーじ6", sub_name="さぶねーむ6", description="これはほげすてーじ6です。", sort_key=6
        )
        self.goal1 = Goal.objects.create(
            framework=self.frm1,
            field=self.field1,
            stage=self.stg1,
            description="ほげごーる1のせつめいです",
        )
        self.goal2 = Goal.objects.create(
            framework=self.frm1,
            field=self.field2,
            stage=self.stg1,
            description="ほげごーる2のせつめいです",
        )
        self.goal3 = Goal.objects.create(
            framework=self.frm1,
            field=self.field3,
            stage=self.stg1,
            description="ほげごーる3のせつめいです",
        )
        self.goal4 = Goal.objects.create(
            framework=self.frm1,
            field=self.field4,
            stage=self.stg1,
            description="ほげごーる4のせつめいです",
        )
        self.goal5 = Goal.objects.create(
            framework=self.frm1,
            field=self.field5,
            stage=self.stg1,
            description="ほげごーる5のせつめいです",
        )
        self.goal6 = Goal.objects.create(
            framework=self.frm1,
            field=self.field6,
            stage=self.stg1,
            description="ほげごーる6のせつめいです",
        )
        self.goal7 = Goal.objects.create(
            framework=self.frm1,
            field=self.field7,
            stage=self.stg1,
            description="ほげごーる7のせつめいです",
        )
        self.goal8 = Goal.objects.create(
            framework=self.frm1,
            field=self.field8,
            stage=self.stg1,
            description="ほげごーる8のせつめいです",
        )
        self.goal9 = Goal.objects.create(
            framework=self.frm2,
            field=self.field1,
            stage=self.stg2,
            description="ほげごーる9のせつめいです",
        )
        self.goal10 = Goal.objects.create(
            framework=self.frm3,
            field=self.field2,
            stage=self.stg2,
            description="ほげごーる10のせつめいです",
        )
        self.goal11 = Goal.objects.create(
            framework=self.frm4,
            field=self.field2,
            stage=self.stg2,
            description="ほげごーる11のせつめいです",
        )
        self.goal12 = Goal.objects.create(
            framework=self.frm5,
            field=self.field9,
            stage=self.stg3,
            description="ほげごーる12のせつめいです",
        )
        self.goal13 = Goal.objects.create(
            framework=self.frm6,
            field=self.field10,
            stage=self.stg4,
            description="ほげごーる13のせつめいです",
        )
        self.goal14 = Goal.objects.create(
            framework=self.frm6,
            field=self.field10,
            stage=self.stg5,
            description="ほげごーる14のせつめいです",
        )
        self.goal15 = Goal.objects.create(
            framework=self.frm6,
            field=self.field10,
            stage=self.stg6,
            description="ほげごーる15のせつめいです",
        )
        self.pc1 = PortalCategory.objects.create(
            name="ほげぽーたる1",
            description="ほげぽーたる1のせつめいです",
            image_url_path="hogep-img-url1",
            sort_key=1,
        )
        self.pc2 = PortalCategory.objects.create(
            name="ほげぽーたる2",
            description="ほげぽーたる2のせつめいです",
            image_url_path="hogep-img-url2",
            sort_key=2,
        )
        self.pc3 = PortalCategory.objects.create(
            name="ほげぽーたる3",
            description="ほげぽーたる3のせつめいです",
            image_url_path="hogep-img-url3",
            sort_key=3,
        )
        self.pc4 = PortalCategory.objects.create(
            name="ほげぽーたる4",
            description="ほげぽーたる4のせつめいです",
            image_url_path="hogep-img-url4",
            sort_key=4,
        )
        self.pc5 = PortalCategory.objects.create(
            name="ほげぽーたる5",
            description="ほげぽーたる5のせつめいです",
            image_url_path="hogep-img-url5",
            sort_key=5,
        )
        self.iss = Issuer.objects.create(
            name="ほげほげだいがく", url="hogehoge.ac.jp", email="hogehoge@ac.jp"
        )
        self.wb1 = WisdomBadges.objects.create(
            portal_category=self.pc1,
            issuer=self.iss,
            name="hogebadge1-ねーむ+ほげばっじ1",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=999",
            description="hoge1",
            image_id="hogehoge.ac.jp/image/36/fuga1",
            alignments_targetname="あらいめんつ1",
            alignments_targeturl="あらいめんつURL1",
            tags="wbtags1",
        )
        self.wb2 = WisdomBadges.objects.create(
            portal_category=self.pc1,
            issuer=self.iss,
            name="hogebadge2-ねーむ+ほげばっじ2",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=998",
            description="hoge2",
            image_id="hogehoge.ac.jp/image/36/fuga2",
            alignments_targetname="あらいめんつ2",
            alignments_targeturl="あらいめんつURL2",
            tags="wbtags2",
        )
        self.wb3 = WisdomBadges.objects.create(
            portal_category=self.pc1,
            issuer=self.iss,
            name="hogebadge3-ねーむ+ほげばっじ3",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=997",
            description="hoge3",
            image_id="hogehoge.ac.jp/image/36/fuga3",
            alignments_targetname="あらいめんつ3",
            alignments_targeturl="あらいめんつURL3",
            tags="wbtags3",
        )
        self.wb4 = WisdomBadges.objects.create(
            portal_category=self.pc1,
            issuer=self.iss,
            name="hogebadge4-ねーむ+ほげばっじ4",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=996",
            description="hoge4",
            image_id="hogehoge.ac.jp/image/36/fuga4",
            alignments_targetname="あらいめんつ4",
            alignments_targeturl="あらいめんつURL4",
            tags="wbtags4",
        )
        self.wb5 = WisdomBadges.objects.create(
            portal_category=self.pc2,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ5",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=995",
            description="hoge5",
            image_id="hogehoge.ac.jp/image/36/fuga5",
            alignments_targetname="あらいめんつ5",
            alignments_targeturl="あらいめんつURL5",
            tags="wbtags5",
        )
        self.wb6 = WisdomBadges.objects.create(
            portal_category=self.pc3,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ6",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=994",
            description="hoge6",
            image_id="hogehoge.ac.jp/image/36/fuga6",
            alignments_targetname="あらいめんつ6",
            alignments_targeturl="あらいめんつURL6",
            tags="wbtags6",
        )
        self.wb7 = WisdomBadges.objects.create(
            portal_category=self.pc3,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ7",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=993",
            description="hoge7",
            image_id="hogehoge.ac.jp/image/36/fuga7",
            alignments_targetname="あらいめんつ7",
            alignments_targeturl="あらいめんつURL7",
            tags="wbtags7",
        )
        self.wb8 = WisdomBadges.objects.create(
            portal_category=self.pc3,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ8",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=992",
            description="hoge8",
            image_id="hogehoge.ac.jp/image/36/fuga8",
            alignments_targetname="あらいめんつ8",
            alignments_targeturl="あらいめんつURL8",
            tags="wbtags8",
        )
        self.wb9 = WisdomBadges.objects.create(
            portal_category=self.pc3,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ9",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=991",
            description="hoge9",
            image_id="hogehoge.ac.jp/image/36/fuga9",
            alignments_targetname="あらいめんつ9",
            alignments_targeturl="あらいめんつURL9",
            tags="wbtags9",
        )
        self.wb10 = WisdomBadges.objects.create(
            portal_category=self.pc3,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_10",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=990",
            description="hoge_10",
            image_id="hogehoge.ac.jp/image/36/fuga10",
            alignments_targetname="あらいめんつ_10",
            alignments_targeturl="あらいめんつURL10",
            tags="tags10",
        )
        self.wb11 = WisdomBadges.objects.create(
            portal_category=self.pc4,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_11",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=989",
            description="hoge_11",
            image_id="hogehoge.ac.jp/image/36/fuga11",
            alignments_targetname="あらいめんつ_11",
            alignments_targeturl="あらいめんつURL11",
            tags="tags11",
        )
        self.wb12 = WisdomBadges.objects.create(
            portal_category=self.pc4,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_12",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=988",
            description="hoge_12",
            image_id="hogehoge.ac.jp/image/36/fuga12",
            alignments_targetname="あらいめんつ_12",
            alignments_targeturl="あらいめんつURL12",
            tags="tags12",
        )
        self.wb13 = WisdomBadges.objects.create(
            portal_category=self.pc4,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_13",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=987",
            description="hoge_13",
            image_id="hogehoge.ac.jp/image/36/fuga13",
            alignments_targetname="あらいめんつ_13",
            alignments_targeturl="あらいめんつURL13",
            tags="tags13",
        )
        self.wb14 = WisdomBadges.objects.create(
            portal_category=self.pc5,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_14",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=986",
            description="hoge_14",
            image_id="hogehoge.ac.jp/image/36/fuga14",
            alignments_targetname="あらいめんつ_14",
            alignments_targeturl="あらいめんつURL14",
            tags="tags14",
        )
        self.wb15 = WisdomBadges.objects.create(
            portal_category=self.pc5,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_15",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=985",
            description="hoge_15",
            image_id="hogehoge.ac.jp/image/36/fuga15",
            alignments_targetname="あらいめんつ_15",
            alignments_targeturl="あらいめんつURL15",
            tags="tags15",
        )
        self.wb16 = WisdomBadges.objects.create(
            portal_category=self.pc5,
            issuer=self.iss,
            name="hogebadge5-ねーむ+ほげばっじ_16",
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=984",
            description="hoge_16",
            image_id="hogehoge.ac.jp/image/36/fuga16",
            alignments_targetname="あらいめんつ_16",
            alignments_targeturl="あらいめんつURL16",
            tags="tags16",
        )
        self.cb1 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb1, goal=self.goal1, description="ほげかてごらいずど1"
        )
        self.cb2 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb1, goal=self.goal2, description="ほげかてごらいずど2"
        )
        self.cb3 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb2, goal=self.goal3, description="ほげかてごらいずど3"
        )
        self.cb4 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb2, goal=self.goal4, description="ほげかてごらいずど4"
        )
        self.cb5 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb3, goal=self.goal5, description="ほげかてごらいずど5"
        )
        self.cb6 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb3, goal=self.goal6, description="ほげかてごらいずど6"
        )
        self.cb7 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb4, goal=self.goal7, description="ほげかてごらいずど7"
        )
        self.cb8 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb5, goal=self.goal8, description="ほげかてごらいずど8"
        )
        self.cb9 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb5, goal=self.goal9, description="ほげかてごらいずど9"
        )
        self.cb10 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb5, goal=self.goal10, description="ほげかてごらいずど10"
        )
        self.cb11 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb5, goal=self.goal11, description="ほげかてごらいずど11"
        )
        self.cb12 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb11, goal=self.goal12, description="ほげかてごらいずど12"
        )
        self.cb13 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb12, goal=self.goal12, description="ほげかてごらいずど13"
        )
        self.cb14 = CategorisedBadges.objects.create(
            wisdom_badges=self.wb13, goal=self.goal12, description="ほげかてごらいずど14"
        )
        self.kb1 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb1,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=800",
            name="fugabadge1",
            description="ふがふが１!ふがふが-ふがふが",
            image_id="hogehoge.ac.jp/image/36/fuga1",
            criteria_narrative="くらいてりあならてぃぶ1",
            tags="kbtags1",
        )
        self.kb2 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb1,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=801",
            name="fugabadge2",
            description="ふがふが+ふがふが2@ふがふが",
            image_id="hogehoge.ac.jp/image/36/fuga2",
            criteria_narrative="くらいてりあならてぃぶ2",
            tags="kbtags2",
        )
        self.kb3 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb2,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=802",
            name="fugabadge3",
            description="ふがふが-ふがふが=ふがふが3",
            image_id="hogehoge.ac.jp/image/36/fuga3",
            criteria_narrative="くらいてりあならてぃぶ3",
            tags="kbtags3",
        )
        self.kb4 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb2,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=803",
            name="fugabadge4",
            description="ふがふがふがふがふがふが4",
            image_id="hogehoge.ac.jp/image/36/fuga4",
            criteria_narrative="くらいてりあならてぃぶ4",
            tags="kbtags4",
        )
        self.kb5 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb5,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=804",
            name="fugabadge5",
            description="ふがふがふがふがふがふが5",
            image_id="hogehoge.ac.jp/image/36/fuga5",
            criteria_narrative="くらいてりあならてぃぶ5",
            tags="kbtags5",
        )
        self.kb6 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb5,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=805",
            name="fugabadge6",
            description="ふがふがふがふがふがふが6",
            image_id="hogehoge.ac.jp/image/36/fuga6",
            criteria_narrative="くらいてりあならてぃぶ6",
            tags="kbtags6",
        )
        self.kb7 = KnowledgeBadges.objects.create(
            wisdom_badges=self.wb13,
            badge_class_id="hogehoge.ac.jp/hoge.php?badge_id=806",
            name="fugabadge7",
            description="ふがふがふがふがふがふが7",
            image_id="hogehoge.ac.jp/image/36/fuga7",
            criteria_narrative="くらいてりあならてぃぶ7",
            tags="kbtags7",
        )
        self.ct1 = Criteria.objects.create(
            knowledge_badges=self.kb1, type="ほげ", name="ほげコースA", sort_key=1
        )
        self.ct2 = Criteria.objects.create(
            knowledge_badges=self.kb1, type="ほげ", name="ほげコースB", sort_key=2
        )
        self.ct3 = Criteria.objects.create(
            knowledge_badges=self.kb2, type="ほげ", name="ほげコースC", sort_key=3
        )
        self.ct4 = Criteria.objects.create(
            knowledge_badges=self.kb3, type="ほげ", name="ほげコースD", sort_key=4
        )

    def assert_consumers(self, array, expect_array):
        self.assertEqual(len(array), len(expect_array))
        i = 0
        for consumer in expect_array:
            data = array[i]
            self.assert_consumer(data, consumer)
            i += 1

    def assert_consumer(self, data, consumer):
        self.assertEqual(data["consumer_id"], consumer.id)
        self.assertEqual(data["name"], consumer.name)
        self.assertEqual(data["url"], consumer.url)
        self.assertEqual(data["email"], consumer.email)

    def assert_field(
        self, field1, field2, field3, expect_field, expect_wisdom_badge_id_list=None
    ):
        self.assertEqual(field1.get("field1_name"), expect_field.field1_name)
        self.assertEqual(field2.get("field2_name"), expect_field.field2_name)
        self.assertEqual(field3.get("field_id"), expect_field.id)
        self.assertEqual(field3.get("field3_name"), expect_field.field3_name)
        if expect_wisdom_badge_id_list != None:
            wisdom_badge_id_list = field3.get("wisdom_badges")
            self.assertEqual(
                set(wisdom_badge_id_list), set(expect_wisdom_badge_id_list)
            )

    def assert_portal_categories(self, array):
        queryset = (
            PortalCategory.objects.all()
            .order_by("pk")
            .annotate(Count("wisdom_badges_portal_category"))
        )
        self.assertEqual(len(array), queryset.count())
        i = 0
        for category in queryset:
            data = array[i]
            self.assert_portal_category(
                data, category, category.wisdom_badges_portal_category__count
            )
            i += 1

    def assert_portal_category(self, data, portal_category, badges_count):
        self.assertEqual(data["portal_category_id"], portal_category.id)
        self.assertEqual(data["name"], portal_category.name)
        self.assertEqual(data["description"], portal_category.description)
        self.assertEqual(data["image_url_path"], portal_category.image_url_path)
        self.assertEqual(data["badges_count"], badges_count)

    def assert_stages(self, array, expect_array):
        self.assertEqual(len(array), len(expect_array))
        i = 0
        for stage in expect_array:
            data = array[i]
            self.assert_stage(data, stage)
            i += 1

    def assert_stage(self, data, stage):
        self.assertEqual(data["stage_id"], stage.id)
        self.assertEqual(data["name"], stage.name)
        self.assertEqual(data["description"], stage.description)

    def assert_page(self, data, total_count, start, end):
        self.assertEqual(data.get("total_count"), total_count)
        self.assertEqual(data.get("start"), start)
        self.assertEqual(data.get("end"), end)

    def assert_wisdom_badge(self, data, wisdom_badge, knowledge_badges):
        self.assertEqual(data["badges_id"], wisdom_badge.id)
        self.assertEqual(data["type"], BadgeType.WISDOM.name.lower())
        self.assertEqual(data["name"], wisdom_badge.name)
        self.assertEqual(data["description"], wisdom_badge.description)
        self.assertEqual(data["image"], wisdom_badge.image_id)
        self.assertEqual(data["image_author"], wisdom_badge.image_author)
        self.assertEqual(data["tags"], wisdom_badge.tags)
        issuer = wisdom_badge.issuer
        self.assertEqual(data["issuer_name"], issuer.name if issuer else None)
        self.assertEqual(data["issuer_url"], issuer.url if issuer else None)
        self.assertEqual(data["issuer_email"], issuer.email if issuer else None)
        portal_category = wisdom_badge.portal_category
        if data.get("portal_category_id"):
            self.assertEqual(
                data["portal_category_id"],
                portal_category.id if portal_category else None,
            )
        if data.get("portal_category_name"):
            self.assertEqual(
                data["portal_category_name"],
                portal_category.name if portal_category else None,
            )
        if data.get("portal_category_description"):
            self.assertEqual(
                data["portal_category_description"],
                portal_category.description if portal_category else None,
            )
        if data.get("portal_category_image_url_path"):
            self.assertEqual(
                data["portal_category_image_url_path"],
                portal_category.image_url_path if portal_category else None,
            )
        if data.get("alignments_targetname"):
            self.assertEqual(
                data["alignments_targetname"],
                wisdom_badge.alignments_targetname,
            )
        if data.get("alignments_targeturl"):
            self.assertEqual(
                data["alignments_targeturl"],
                wisdom_badge.alignments_targeturl,
            )
        self.assertEqual(data["digital_badge_class_id"], wisdom_badge.badge_class_id)
        detail = data.get("detail")
        knowledge_badge_id_list = detail.get("knowledge_badges_list")
        self.assertEqual(set(knowledge_badge_id_list), set(knowledge_badges))

    def assert_knowledge_badge(self, data, knowledge_badge, criteria_list):
        self.assertEqual(data["badges_id"], knowledge_badge.id)
        self.assertEqual(data["type"], BadgeType.KNOWLEDGE.name.lower())
        self.assertEqual(data["name"], knowledge_badge.name)
        self.assertEqual(data["description"], knowledge_badge.description)
        self.assertEqual(data["image"], knowledge_badge.image_id)
        self.assertEqual(data["image_author"], knowledge_badge.image_author)
        self.assertEqual(data["tags"], knowledge_badge.tags)
        issuer = knowledge_badge.issuer
        self.assertEqual(data["issuer_name"], issuer.name if issuer else None)
        self.assertEqual(data["issuer_url"], issuer.url if issuer else None)
        self.assertEqual(data["issuer_email"], issuer.email if issuer else None)
        self.assertEqual(data["digital_badge_class_id"], knowledge_badge.badge_class_id)
        list = data.get("detail")
        self.assertEqual(len(list), len(criteria_list))
        for criteria in list:
            for expect_criteria in criteria_list:
                self.assertEqual(criteria["criteria_id"], expect_criteria.id)
                self.assertEqual(criteria["type"], expect_criteria.type)
                self.assertEqual(criteria["name"], expect_criteria.name)

    def assert_criteria(self, data, criteria):
        self.assertEqual(data["criteria_id"], criteria.id)
        self.assertEqual(data["name"], criteria.name)
        self.assertEqual(data["type"], criteria.type)

    def assert_frameworks(self, array, expect_array):
        self.assertEqual(len(array), len(expect_array))
        i = 0
        for framework in expect_array:
            data = array[i]
            self.assert_framework(data, framework)
            i += 1

    def assert_framework(self, data, framework):
        self.assertEqual(data["framework_id"], framework.id)
        self.assertEqual(data["name"], framework.name)
        self.assertEqual(data["description"], framework.description)
        self.assertEqual(data["url"], framework.url)

    def assert_swagger_param(self, field, param):
        self.assertEqual(field.name, param.name)
        self.assertEqual(field.required, param.required)
        self.assertEqual(field.schema, param.schema)

    def create_test_consumer_data(self, data_count):
        consumers = []
        for i in range(data_count):
            cons = Consumer.objects.create(
                name=f"hoge{i + 1}",
                url=f"hogehoge{i + 1}.com",
                email=f"hoge{i + 1}@hogehoge.com",
            )
            consumers.append(cons)
        return consumers

    def create_test_stage_data(self, data_count):
        stages = []
        for i in range(data_count):
            stage = Stage.objects.create(
                name=f"ほげすてーじ{i + 1}",
                sub_name=f"さぶねーむ{i + 1}",
                description=f"これはほげすてーじです. {i + 1}",
                sort_key=i,
            )
            stages.append(stage)
        return stages

    def create_test_framework_data(self, data_count):
        consumers = self.create_test_consumer_data(data_count)
        frameworks = []
        for i in range(data_count):
            cons = consumers[i]
            frm = Framework.objects.create(
                consumer=cons,
                name=f"ほげふれーむわーく{i + 1}",
                description=f"これはほげふれーむわーくです. {i + 1}",
                supplementary=f"さぷりめんたり{i + 1}",
                sort_key=i,
                url=f"url{i + 1}",
            )
            consumers.append(cons)
            frameworks.append(frm)
        return consumers, frameworks

    def create_test_field_data(self, data_count):
        fields = []
        for i in range(data_count):
            field = Field.objects.create(
                field1_name=f"ほげふぃーるどA_{i + 1}",
                field2_name=f"ほげふぃーるどB_{i + 1}",
                field3_name=f"ほげふぃーるどC_{i + 1}",
                sort_key=i,
            )
            fields.append(field)
        return fields

    def create_test_goal_data(self, data_count):
        consumers, frameworks = self.create_test_framework_data(data_count)
        fields = self.create_test_field_data(data_count)
        stages = self.create_test_stage_data(data_count)
        goals = []
        for i in range(data_count):
            goal = Goal.objects.create(
                framework=frameworks[i],
                field=fields[i],
                stage=stages[i],
                description=f"ほげごーるのせつめいです. {i + 1}",
            )
            goals.append(goal)
        return consumers, frameworks, fields, stages, goals

    def create_test_portal_category_data(self, data_count):
        portal_categories = []
        for i in range(data_count):
            pc = PortalCategory.objects.create(
                name=f"ほげぽーたる{i + 1}",
                description=f"ほげぽーたるのせつめいです. {i + 1}",
                image_url_path=f"hogep-img-url{i + 1}",
                sort_key=i,
            )
            portal_categories.append(pc)
        return portal_categories

    def create_test_issuer_data(self, data_count):
        issuers = []
        for i in range(data_count):
            issuer = Issuer.objects.create(
                name=f"ほげほげだいがく{i + 1}",
                url=f"hogehoge.ac.jp/{i + 1}",
                email=f"hogehoge{i + 1}@ac.jp",
            )
            issuers.append(issuer)
        return issuers

    def create_test_wisdom_badges_data(self, data_count):
        portal_categories = self.create_test_portal_category_data(data_count)
        issuers = self.create_test_issuer_data(data_count)
        wisdom_badgees = []
        for i in range(data_count):
            wb = WisdomBadges.objects.create(
                portal_category=portal_categories[i],
                issuer=issuers[i],
                name=f"hogebadge-ねーむ+ほげばっじ{i + 1}",
                badge_class_id=f"hogehoge.ac.jp/hoge.php?badge_id={i + 1}",
                description=f"hoge{i + 1}",
                image_id=f"hogehoge.ac.jp/image/36/fuga{i + 1}",
                alignments_targetname=f"あらいめんつ{i + 1}",
                alignments_targeturl=f"あらいめんつURL{i + 1}",
                tags=f"wbtags{i + 1}",
            )
            wisdom_badgees.append(wb)
        return portal_categories, issuers, wisdom_badgees

    def create_test_knowledge_badges_data(self, data_count):
        (
            portal_categories,
            issuers,
            wisdom_badgees,
        ) = self.create_test_wisdom_badges_data(data_count)
        knowledge_badges = []
        for i in range(data_count):
            kb = KnowledgeBadges.objects.create(
                wisdom_badges=wisdom_badgees[i],
                badge_class_id=f"hogehoge.ac.jp/hoge.php?badge_id={i + 1}",
                name=f"fugabadge{i + 1}",
                description=f"ふがふが!ふがふが-ふがふが {i + 1}",
                image_id=f"hogehoge.ac.jp/image/36/fuga{i + 1}",
                criteria_narrative=f"くらいてりあならてぃぶ{i + 1}",
                tags=f"kbtags{i + 1}",
            )
            knowledge_badges.append(kb)
        return portal_categories, issuers, wisdom_badgees, knowledge_badges

    def create_test_criteria_data(self, data_count):
        (
            portal_categories,
            issuers,
            wisdom_badgees,
            knowledge_badges,
        ) = self.create_test_knowledge_badges_data(data_count)
        criterias = []
        for i in range(data_count):
            cri = Criteria.objects.create(
                knowledge_badges=knowledge_badges[i],
                type=f"ほげ{i + 1}",
                name=f"ほげコース{i + 1}",
                sort_key=i,
            )
            criterias.append(cri)
        return portal_categories, issuers, wisdom_badgees, knowledge_badges, criterias

    def create_test_categorised_badges_data(self, data_count):
        consumers, frameworks, fields, stages, goals = self.create_test_goal_data(
            data_count
        )
        (
            portal_categories,
            issuers,
            wisdom_badgees,
            knowledge_badges,
            criterias,
        ) = self.create_test_criteria_data(data_count)
        categorised_badges = []
        for i in range(data_count):
            cb = CategorisedBadges.objects.create(
                wisdom_badges=wisdom_badgees[i],
                goal=goals[i],
                description=f"ほげかてごらいずど{i + 1}",
            )
            categorised_badges.append(cb)
        return (
            consumers,
            frameworks,
            fields,
            stages,
            goals,
            categorised_badges,
            portal_categories,
            issuers,
            wisdom_badgees,
            knowledge_badges,
            criterias,
        )
