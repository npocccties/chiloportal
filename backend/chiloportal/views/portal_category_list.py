from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from django.db.models import Count, Q


class PortalCategoryList(BaseAPIView):
    swagger_query_params = [PUBLISHED_ONLY_PARAM]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        # published_only のときは、バッジの数を公開中のものだけで数える
        count_filter = None
        if self.get_published_only(request):
            count_filter = Q(wisdom_badges_portal_category__status=WisdomBadges.Status.PUBLISHED)
        queryset = (
            PortalCategory.objects.all()
            .order_by("sort_key")
            .annotate(
                wisdom_badges_portal_category__count=Count(
                    "wisdom_badges_portal_category", filter=count_filter
                )
            )
        )
        if queryset.exists() == False:
            return Response([])
        return Response(to_portal_categories(queryset))
