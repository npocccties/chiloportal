from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils


class FrameworkDetail(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("framework_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = request.GET.get("framework_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        queryset = Framework.objects.filter(pk=id)
        if queryset.exists() == False:
            return Response({})
        return Response(to_framework(queryset.first()))
