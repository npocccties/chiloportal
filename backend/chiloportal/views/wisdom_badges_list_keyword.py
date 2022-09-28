from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils
import re
from django.db.models import Q

class WisdomBadgesListKeyword(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam('keyword', True),SwaggerQueryParam('page_number', False)]
    filter_backends = (SwaggerQueryParamFilter,)
    def _get(self, request):
        keyword = request.GET.get('keyword')
        if not keyword:
            self.logger.error('Not exist keyword')
            raise ParseError('Invalid parameters supplied')
        page_number = self.request.GET.get('page_number')
        if page_number != None and utils.is_int(page_number) == False:
            self.logger.error(f'Invalid page_number: {page_number}')
            raise ParseError('Invalid parameters supplied')
        # 半角スペースと全角スペースを区切り文字指定
        keys = re.split('[ 　]', keyword)
        filter_args = Q()
        for key in keys:
            filter_args |= Q(name__icontains = key)
            filter_args |= Q(description__icontains = key)
            filter_args |= Q(alignments_targetname__icontains = key)
            filter_args |= Q(tags__icontains = key)
            filter_args |= Q(knowledge_badges_wisdom_badges__name__icontains = key)
            filter_args |= Q(knowledge_badges_wisdom_badges__description__icontains = key)
            filter_args |= Q(knowledge_badges_wisdom_badges__tags__icontains = key)
            filter_args |= Q(knowledge_badges_wisdom_badges__criteria_narrative__icontains = key)
            filter_args |= Q(knowledge_badges_wisdom_badges__criteria_knowledge_badges__name__icontains = key)
        queryset = WisdomBadges.objects.filter(filter_args).order_by('pk').distinct().prefetch_related(
            'knowledge_badges_wisdom_badges', 
        ).select_related(
            'issuer'
        )
        if queryset.exists() == False:
            raise NotFound('Badges not found')
        if page_number != None:
            page = self.get_page(queryset, page_number)
            return Response(to_pager_wisdom_badges(page))
        else:
            return Response(to_pager_wisdom_badges_all(queryset))
