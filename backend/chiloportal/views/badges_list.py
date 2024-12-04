from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils
from django.db.models import Q


class BadgesList(BaseAPIView):
    swagger_query_params = [
        SwaggerQueryParam("issuer_id", False),
        SwaggerQueryParam("portal_category_id", False),
        SwaggerQueryParam("page_number", False),
    ]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        issuer_id = self.request.GET.get("issuer_id")
        portal_category_id = self.request.GET.get("portal_category_id")
        page_number = self.request.GET.get("page_number")

        if issuer_id != None and utils.is_int(issuer_id) == False:
            self.logger.error(f"Invalid issuer_id: {issuer_id}")
            raise ParseError("Invalid parameters supplied")
        if portal_category_id != None and utils.is_int(portal_category_id) == False:
            self.logger.error(f"Invalid portal_category_id: {portal_category_id}")
            raise ParseError("Invalid parameters supplied")
        if page_number != None and utils.is_int(page_number) == False:
            self.logger.error(f"Invalid page_number: {page_number}")
            raise ParseError("Invalid parameters supplied")

        filter_args =Q()
        
        if issuer_id is not None:
            filter_args &= Q(issuer_id=issuer_id)
        if portal_category_id is not None:
            filter_args &= Q(portal_category_id=portal_category_id)
        
        queryset = (
            WisdomBadges.objects.filter(filter_args)
            .order_by("pk")
            .distinct()
            .select_related("issuer", "portal_category")
            .prefetch_related("knowledge_badges_wisdom_badges")
        )

        if queryset.exists() == False:
            self.logger.error(f"Not found wisdom_badges: issuer_id: {issuer_id} portal_category_id: {portal_category_id}")
            raise ParseError("Invalid parameters supplied")
            
        output_portal_category = portal_category_id == None
        if page_number != None:
            page = self.get_page(queryset, page_number)
            return Response(to_pager_wisdom_badges(page, output_portal_category))
        else:
            return Response(to_pager_wisdom_badges_all(queryset, output_portal_category))
