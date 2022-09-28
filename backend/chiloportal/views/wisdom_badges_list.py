from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils

class WisdomBadgesList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam('field_id', True), SwaggerQueryParam('stage_id', True)]
    filter_backends = (SwaggerQueryParamFilter,)
    def _get(self, request):
        field_id = self.request.GET.get('field_id')
        stage_id = self.request.GET.get('stage_id')
        if field_id == None or utils.is_int(field_id) == False or stage_id == None or utils.is_int(stage_id) == False:
            raise ParseError('Invalid parameters supplied')
        queryset = WisdomBadges.objects.filter(
            categorised_badges_wisdom_badges__goal__field_id = field_id,
            categorised_badges_wisdom_badges__goal__stage_id = stage_id
        ).order_by('pk').distinct().prefetch_related(
            'knowledge_badges_wisdom_badges'
        ).select_related(
            'issuer',
            'portal_category'
        )
        if queryset.exists() == False:
            raise NotFound('Badges not found')
        return Response(to_wisdom_badges(queryset))
