from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from django.db.models import Prefetch
from django.db.models import Count
from distutils.util import strtobool
from django.db.models import Q
import bcrypt
import os
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import ValidationError

class ConsumerGoalList(BaseAPIView):
    header_param = openapi.Parameter('Authorization', openapi.IN_HEADER, description="成長段階のパスワード", type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[header_param])
    def get(self, request):
        return self.get_proc(request)

    def _get(self, request):
        filter_args = Q()
        filter_args |= Q(stage__password="")
        filter_args |= Q(
            stage__password__isnull=True
        )

        password = self.request.headers.get("Authorization")
        # パスワードチェック
        if password:
            str = os.getenv("BCRYPT_SALT", "")
            salt = bytes(str.encode())
            hashedPassword = bcrypt.hashpw(password.encode(), salt).decode('utf-8')
            result = Stage.objects.filter(password=hashedPassword)
            count = result.count()
            if count == 0:
                raise ValidationError('Invalid password supplied')
            filter_args |= Q(
                stage__password=hashedPassword
            )

        queryset = (
            Goal.objects.all()
            .filter(
                filter_args,
            )
            .select_related(
                "framework__consumer",
                "framework",
                "stage",
                "field",
            )
            .values(
                "framework__consumer__id",
                "framework__consumer__name",
                "framework__id",
                "framework__name",
                "framework__sort_key",
                "stage__id",
                "stage__name",
                "stage__sort_key",
                "field__field1_name",
            )
            .order_by(
                "framework__consumer__name",
                "framework__sort_key",
                "stage__sort_key",
                "field__sort_key",
            )
            .annotate(stage_count=Count("stage"))
        )
        if queryset.exists() == False:
            return Response([])
        return Response(to_consumer_goal_list(queryset))
