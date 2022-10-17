from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, ParseError
from ..models import *
from ..swagger import *
from ..responses import *
import logging
from django.core.paginator import Paginator, EmptyPage
import sys
import urllib.parse
import os
from django.db import connection, reset_queries


class BaseAPIView(APIView):
    per_page = int(os.getenv("PER_PAGE", "30"))
    logger = logging.getLogger(__name__)
    schemes = ["https"]

    def get(self, request):
        class_name = type(self).__name__
        method_name = sys._getframe().f_code.co_name
        self.logger.debug(f"------- {class_name}.{method_name} start -------")
        self.logger.info(
            f"Request path: {urllib.parse.unquote(request._request.get_full_path())}"
        )
        try:
            reset_queries()
            response = self._get(request)
        except (ParseError, NotFound) as e:
            self.logger.error(f"status code: {e.status_code} ... {str(e)}")
            raise
        finally:
            self.logger.debug(f"query count: {len(connection.queries)}")
            self.logger.debug(f"------- {class_name}.{method_name} end -------")
        return response

    def _get(self, request):
        pass

    def get_page(self, queryset, page_num):
        paginator = Paginator(queryset, self.per_page)
        try:
            return paginator.page(page_num)
        except EmptyPage:
            raise NotFound("Page is empty")
