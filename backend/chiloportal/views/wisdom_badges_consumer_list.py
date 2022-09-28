from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils

class WisdomBadgesConsumerList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam('badges_id', True)]
    filter_backends = (SwaggerQueryParamFilter,)
    def _get(self, request):
        id = self.request.GET.get('badges_id')
        if id == None or utils.is_int(id) == False:
            raise ParseError('Invalid ID supplied')
        queryset = Consumer.objects.filter(framework_consumer__goal_framework__categorised_badges_goal__wisdom_badges_id = id).order_by('pk').distinct()
        if queryset.exists() == False:
            raise NotFound('Consumer not found')
        return Response(to_consumers(queryset))
