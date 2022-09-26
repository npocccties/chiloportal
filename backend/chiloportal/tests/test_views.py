from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework import status
from .. import models
from .. import views

class BadgesListViewTests(TestCase):
    base_url = "http://localhost:8000"
    
    # @classmethod
    # def setUp(self):
    #     views.BadgesList.permission_classes = []

    def test_get_api(self):
        factory = APIRequestFactory()
        # view = views.BadgesList.as_view()
        # models.Badges.objects.create(badge_class_id="bc1", name="b1", type="t1")
        # models.Badges.objects.create(badge_class_id="bc2", name="b2", type="t2")
        # url = self.base_url + "/badges/list"
        # request = factory.get(url)
        # response = view(request)
        # assert response.status_code == status.HTTP_200_OK
        # assert len(response.data) == 2
        # assert response.data[0]["name"] == "b1"
        # assert response.data[1]["name"] == "b2"


