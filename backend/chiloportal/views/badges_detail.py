from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils

class BadgesDetail(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam('badges_id', True), SwaggerQueryParam('badges_type', True)]
    filter_backends = (SwaggerQueryParamFilter,)
    def _get(self, request):
        id_str = self.request.GET.get('badges_id')
        type = self.request.GET.get('badges_type')
        if id_str == None:
            self.logger.error('Not exist badges_id')
            raise ParseError('Invalid parameters supplied')
        id_array = id_str.split(',')
        for id in id_array:
            if utils.is_int(id) == False:
                self.logger.error('Invalid badges_id')
                raise ParseError('Invalid parameters supplied')
        result = []
        if type == 'wisdom':
            queryset = WisdomBadges.objects.filter(pk__in = id_array).order_by('pk').distinct().prefetch_related(
                'knowledge_badges_wisdom_badges__criteria_knowledge_badges'
            ).select_related(
                'issuer'
            )
            if queryset.exists() == False:
                raise NotFound('Badges not found')
            for wisdom_badge in queryset:
                result.append(to_wisdom_badge(wisdom_badge))
        elif type == 'knowledge':
            queryset = KnowledgeBadges.objects.filter(pk__in = id_array).order_by('pk').distinct().prefetch_related(
                'criteria_knowledge_badges'
            ).select_related(
                'issuer'
            )
            if queryset.exists() == False:
                raise NotFound('Badges not found')
            for knowledge_badge in queryset:
                result.append(to_knowledge_badge(knowledge_badge))
        else:
            self.logger.error(f'Unknown badges_type: {type}')
            raise ParseError('Invalid parameters supplied')
        return Response(result)
