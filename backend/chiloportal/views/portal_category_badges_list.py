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
        PUBLISHED_ONLY_PARAM,
        SORT_PARAM,
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
        published_only = self.get_published_only(request)
        filter_args = Q()
        if id:
            filter_args |= Q(portal_category_id=id)
        if published_only:
            filter_args &= Q(status=WisdomBadges.Status.PUBLISHED)
        sort = self.get_sort(request)
        queryset = order_badges(
            WisdomBadges.objects.filter(filter_args)
            .distinct()
            .select_related("issuer", "portal_category")
            .prefetch_related("knowledge_badges_wisdom_badges", "labels"),
            sort,
        )
        if queryset.exists() == False:
            if published_only:
                return Response(with_sort(to_pager_wisdom_badges_empty(), sort))
            self.logger.error(f"Not found wisdom_badges: portal_category_id: {id}")
            raise ParseError("Invalid parameters supplied")
        output_portal_category = id == None
        if page_number != None:
            page = self.get_page(queryset, page_number)
            result = to_pager_wisdom_badges(page, output_portal_category)
        else:
            result = to_pager_wisdom_badges_all(queryset, output_portal_category)
        return Response(with_sort(result, sort))
