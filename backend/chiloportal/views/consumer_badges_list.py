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
from .. import utils

class ConsumerBadgesList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("framework_id", True), SwaggerQueryParam("stage_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)
    header_param = openapi.Parameter('Authorization', openapi.IN_HEADER, description="成長段階のパスワード", type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[header_param])
    def get(self, request):
        return self.get_proc(request)

    def _get(self, request):
        framework_id = request.GET.get("framework_id")
        stage_id = request.GET.get("stage_id")
        if (framework_id == None or utils.is_int(framework_id) == False or
            stage_id == None or utils.is_int(stage_id) == False):
            raise ParseError("Invalid parameters supplied")
        filter_args = Q()
        filter_args |= Q(categorised_badges_wisdom_badges__goal__stage__password="")
        filter_args |= Q(
            categorised_badges_wisdom_badges__goal__stage__password__isnull=True
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
                raise ValidationError('Invalid parameters supplied')
            filter_args |= Q(
                categorised_badges_wisdom_badges__goal__stage__password=hashedPassword
            )

        categorised_badges_prefetch = Prefetch(
            "categorised_badges_wisdom_badges",
            queryset=CategorisedBadges.objects.select_related(
                "goal__framework",
                "goal__framework__consumer",
                "goal__field",
                "goal__stage",
            ),
        )
        queryset = (
            WisdomBadges.objects.all()
            .filter(
                filter_args,
                categorised_badges_wisdom_badges__goal__framework__id=framework_id,
                categorised_badges_wisdom_badges__goal__stage__id=stage_id,
            )
            .prefetch_related(
                "knowledge_badges_wisdom_badges",
                categorised_badges_prefetch,
            )
            .values(
                "id",
                "name",
                "badge_class_id",
                "description",
                "categorised_badges_wisdom_badges__goal__framework__id",
                "categorised_badges_wisdom_badges__goal__framework__name",
                "categorised_badges_wisdom_badges__goal__framework__sort_key",
                "categorised_badges_wisdom_badges__goal__stage__id",
                "categorised_badges_wisdom_badges__goal__stage__name",
                "categorised_badges_wisdom_badges__goal__stage__sort_key",
                "categorised_badges_wisdom_badges__goal__framework__consumer__id",
                "categorised_badges_wisdom_badges__goal__framework__consumer__name",
                "categorised_badges_wisdom_badges__goal__field__field1_name",
            )
            .order_by(
                "categorised_badges_wisdom_badges__goal__framework__consumer__name",
                "categorised_badges_wisdom_badges__goal__framework__sort_key",
                "categorised_badges_wisdom_badges__goal__stage__sort_key",
                "categorised_badges_wisdom_badges__goal__field__field1_name",
                "name",
            )
            .annotate(knowledge_badges_count=Count("knowledge_badges_wisdom_badges"))
        )
        if queryset.exists() == False:
            return Response([])
        return Response(to_consumer_badges_list(queryset))
