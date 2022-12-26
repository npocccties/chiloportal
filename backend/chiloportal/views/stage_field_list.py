from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError
from ..models import *
from .. import utils
from ..swagger import *
from ..responses import *
from .base_api_view import *


class StageFieldList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("stage_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = self.request.GET.get("stage_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        queryset = (
            CategorisedBadges.objects.filter(goal__stage_id=id)
            .select_related("goal__field", "wisdom_badges")
            .order_by("pk")
            .distinct()
        )
        if queryset.exists() == False:
            self.logger.error(f"Not found categorised_badges. stage_id: {id}")
            raise ParseError("Invalid ID supplied")
        return Response(to_fields_detail(queryset))
