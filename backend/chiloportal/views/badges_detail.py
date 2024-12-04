from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.db.models import Prefetch
from ..models import *
from ..swagger import *
from ..responses import *
from ..enums import *
from .base_api_view import *
from .. import utils


class BadgesDetail(BaseAPIView):
    swagger_query_params = [
        SwaggerQueryParam("badges_ids", True, schema=coreschema.String()),
        SwaggerQueryParam("badges_type", True, schema=coreschema.String()),
    ]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id_str = self.request.GET.get("badges_ids")
        type = self.request.GET.get("badges_type")
        if id_str == None:
            self.logger.error("Not exist badges_ids")
            raise ParseError("Invalid parameters supplied")
        id_array = id_str.split(",")
        for id in id_array:
            if utils.is_int(id) == False:
                self.logger.error(f"Invalid badges_ids: {id}")
                raise ParseError("Invalid parameters supplied")
        result = []
        if type == BadgeType.WISDOM.name.lower():
            queryset = (
                WisdomBadges.objects.filter(pk__in=id_array)
                .order_by("pk")
                .distinct()
                .prefetch_related(
                    "knowledge_badges_wisdom_badges__criteria_knowledge_badges"
                )
                .select_related("issuer", "portal_category")
            )
            if queryset.exists() == False:
                self.logger.error(f"Not found wisdom_badges. badges_ids: {id_str}")
                raise ParseError("Invalid parameters supplied")
            result = to_wisdom_badges(
                queryset, output_portal_category=True, output_alignments=True
            )
        elif type == BadgeType.KNOWLEDGE.name.lower():
            criteria_queryset = Criteria.objects.order_by('sort_key')
            queryset = (
                KnowledgeBadges.objects.filter(pk__in=id_array)
                .order_by("pk")
                .distinct()
                .prefetch_related(Prefetch("criteria_knowledge_badges", queryset=criteria_queryset))
                .select_related("issuer")
            )
            if queryset.exists() == False:
                self.logger.error(f"Not found knowledge_badges. badges_ids: {id_str}")
                raise ParseError("Invalid parameters supplied")
            result = to_knowledge_badges(queryset)
        else:
            self.logger.error(f"Unknown badges_type: {type}")
            raise ParseError("Invalid parameters supplied")
        return Response(result)
