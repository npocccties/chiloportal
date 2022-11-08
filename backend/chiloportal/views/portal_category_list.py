from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from django.db.models import Count
import os


class PortalCategoryList(BaseAPIView):
    def _get(self, request):
        queryset = (
            PortalCategory.objects.all()
            .order_by("pk")
            .annotate(Count("wisdom_badges_portal_category"))
        )
        if queryset.exists() == False:
            return Response([])
        portal_categories = to_portal_categories(queryset)
        portal_category_sort_order = os.environ.get("PORTAL_CATEGORY_SORT_ORDER")
        if not portal_category_sort_order:
            self.logger.warn("PORTAL_CATEGORY_SORT_ORDER is undefined.")
            return Response(portal_categories)
        else:
            sorted_array = []
            sort_orders = portal_category_sort_order.split(",")
            for sort_order in sort_orders:
                for portal_category in portal_categories:
                    if sort_order == portal_category.get("name"):
                        sorted_array.append(portal_category)
            if len(sorted_array) == 0:
                self.logger.warn(
                    f"Could not sort. portal_categories.len: {len(portal_categories)} PORTAL_CATEGORY_SORT_ORDER: {portal_category_sort_order}"
                )
                return Response(portal_categories)
            return Response(sorted_array)
