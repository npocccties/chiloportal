from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from django.db.models import Prefetch
from django.db.models import Count


class ConsumerFrameworkBadgesList(BaseAPIView):
    def _get(self, request):
        categorised_badges_prefetch = Prefetch(
            "categorised_badges_wisdom_badges",
            queryset=CategorisedBadges.objects.select_related(
                "goal__framework",
                "goal__framework__consumer",
                "goal__field",
            ),
        )
        queryset = (
            WisdomBadges.objects.all()
            .prefetch_related(
                "knowledge_badges_wisdom_badges", categorised_badges_prefetch,
            ).values(
                "name",
                "badge_class_id",
                "description",
                "categorised_badges_wisdom_badges__goal__framework__name",
                "categorised_badges_wisdom_badges__goal__framework__invisible",
                "categorised_badges_wisdom_badges__goal__framework__consumer__name",
                "categorised_badges_wisdom_badges__goal__field__field1_name",
                "knowledge_badges_wisdom_badges"
            ).annotate(knowledge_badges_count=Count("knowledge_badges_wisdom_badges"))
        )
        if queryset.exists() == False:
            return Response([])
        return Response(to_consumer_framework_badges_list(queryset))
