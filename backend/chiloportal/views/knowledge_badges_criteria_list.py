from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils


class KnowledgeBadgesCriteriaList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("badges_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = self.request.GET.get("badges_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        queryset = Criteria.objects.filter(knowledge_badges=id).order_by("sort_key")
        if queryset.exists() == False:
            return Response([])
        return Response(to_criterias(queryset))
