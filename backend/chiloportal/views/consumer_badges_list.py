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

class ConsumerBadgesList(BaseAPIView):
    swagger_query_params = [
        SwaggerQueryParam("password", False, schema=coreschema.String()),
    ]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        password = self.request.GET.get("password")
        categorised_badges_prefetch = Prefetch(
            "categorised_badges_wisdom_badges",
            queryset=CategorisedBadges.objects.select_related(
                "goal__framework",
                "goal__framework__consumer",
                "goal__field",
                "goal__stage",
            ),
        )
        filter_args = Q()
        filter_args |= Q(categorised_badges_wisdom_badges__goal__stage__password="")
        filter_args |= Q(categorised_badges_wisdom_badges__goal__stage__password__isnull=True)
        hashedPassword = os.getenv("BCRYPT_HASH", "")
        self.logger.debug(f"BCRYPT_HASH: {hashedPassword}")
        if password and bcrypt.checkpw(password.encode(), hashedPassword.encode()):
            filter_args |= Q(categorised_badges_wisdom_badges__goal__stage__password=hashedPassword)
        queryset = (
            WisdomBadges.objects.all().filter(
                filter_args
            ).prefetch_related(
                "knowledge_badges_wisdom_badges",
                categorised_badges_prefetch,
            ).values(
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
                "categorised_badges_wisdom_badges__goal__stage__password",
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
        return Response(to_consumer_framework_badges_list(queryset))
