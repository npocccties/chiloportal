from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError
from ..models import *
from .. import utils
from ..swagger import *
from ..responses import *
from .base_api_view import *


class ConsumerDetail(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("consumer_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = request.GET.get("consumer_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        queryset = Consumer.objects.filter(pk=id)
        if queryset.exists() == False:
            self.logger.error(f"Not found consumer. consumer_id: {id}")
            raise ParseError("Invalid ID supplied")
        return Response(to_consumer(queryset.first()))
