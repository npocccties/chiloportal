from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils


class ConsumerFrameworkList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("consumer_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = request.GET.get("consumer_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        queryset = Framework.objects.filter(consumer_id=id).order_by("sort_key")
        if queryset.exists() == False:
            self.logger.warning(f"Not found framework. consumer_id: {id}")
            return Response([])
        return Response(to_frameworks(queryset))
