from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from django.db.models import Count

class PortalCategoryList(BaseAPIView):
    def _get(self, request):
        queryset = PortalCategory.objects.all().order_by('pk').annotate(Count('wisdom_badges_portal_category'))
        if queryset.exists() == False:
            raise NotFound('Data not found')
        result = []
        for pc in queryset:
            result.append(to_portal_category(pc))
        return Response(result)
