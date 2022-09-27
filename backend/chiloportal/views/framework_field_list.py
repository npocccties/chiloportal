from rest_framework.response import Response
from rest_framework.exceptions import NotFound,ParseError
from ..models import *
from .. import utils
from ..swagger import *
from ..responses import *
from .base_api_view import *

class FrameworkFieldList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam('framework_id', True)]
    filter_backends = (SwaggerQueryParamFilter,)
    def _get(self, request):
        id = self.request.GET.get('framework_id')
        if id == None or utils.is_int(id) == False:
            raise ParseError('Invalid ID supplied')
        queryset = Field.objects.filter(goal_field__framework_id = id)
        if queryset.exists() == False:
            raise NotFound('Field not found')
        return Response(to_fields(queryset))
