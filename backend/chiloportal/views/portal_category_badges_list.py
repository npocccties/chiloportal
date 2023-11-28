from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils
from django.db.models import Q


class PortalCategoryBadgesList(BaseAPIView):
    swagger_query_params = [
        SwaggerQueryParam("portal_category_id", False),
        SwaggerQueryParam("page_number", False),
    ]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = self.request.GET.get("portal_category_id")
        if id != None and utils.is_int(id) == False:
            self.logger.error(f"Invalid portal_category_id: {id}")
            raise ParseError("Invalid parameters supplied")
        page_number = self.request.GET.get("page_number")
        if page_number != None and utils.is_int(page_number) == False:
            self.logger.error(f"Invalid page_number: {page_number}")
            raise ParseError("Invalid parameters supplied")
        filter_args = Q()
        if id:
            filter_args |= Q(portal_category_id=id)
        queryset = (
            WisdomBadges.objects.filter(filter_args)
            .order_by("pk")
            .distinct()
            .select_related("issuer", "portal_category")
            .prefetch_related("knowledge_badges_wisdom_badges")
        )
        if queryset.exists() == False:
            self.logger.error(f"Not found wisdom_badges: portal_category_id: {id}")
            raise ParseError("Invalid parameters supplied")
        if page_number != None:
            page = self.get_page(queryset, page_number)
            return Response(to_pager_wisdom_badges(page))
        else:
            return Response(to_pager_wisdom_badges_all(queryset))
