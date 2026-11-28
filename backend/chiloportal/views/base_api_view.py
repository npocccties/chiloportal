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
from ipware import get_client_ip
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.db.models import F
from .. import utils

# ポータルの表示用に、公開中のバッジだけに絞る指定。指定がなければ、今までどおり全件を返す（ポートフォリオなど）。
PUBLISHED_ONLY_PARAM = SwaggerQueryParam("published_only", False, schema="boolean")
# バッジ一覧の並び順。newest（公開した日の新しい順）/ oldest（古い順）/ default（表示の設定の初期値）。
# 指定がなければ、今までどおり登録順（ID の順）で返す。
SORT_PARAM = SwaggerQueryParam("sort", False, schema="string")


def order_badges(queryset, sort):
    if sort == PortalSettings.Sort.NEWEST:
        # 公開日の分からない既存のバッジは後ろに、登録の新しい順で並べる
        return queryset.order_by(F("published_at").desc(nulls_last=True), "-pk")
    if sort == PortalSettings.Sort.OLDEST:
        return queryset.order_by(F("published_at").asc(nulls_first=True), "pk")
    return queryset.order_by("pk")


def with_sort(result, sort):
    """並び順を指定されたときは、使った並び順を応答に入れる（ポータルの並び順の選択に使う）。"""
    if sort is not None:
        result["sort"] = sort
    return result


class BaseAPIView(APIView):
    per_page = int(os.getenv("PER_PAGE", "30"))
    logger = logging.getLogger(__name__)

    def get(self, request):
        return self.get_proc(request)

    def get_proc(self, request):
        class_name = type(self).__name__
        method_name = sys._getframe().f_code.co_name
        self.logger.debug(f"------- {class_name}.{method_name} start -------")
        client_addr, is_routable = get_client_ip(request, request_header_order=['X_FORWARDED_FOR', 'REMOTE_ADDR'])
        self.logger.info(
            f"Request path: {urllib.parse.unquote(request._request.get_full_path())} client_addr: {client_addr} is_routable: {is_routable}"
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

    def get_sort(self, request):
        """並び順の指定。指定がなければ None（登録順）。"""
        value = request.GET.get("sort")
        if value is None:
            return None
        if value == "default":
            return PortalSettings.load().default_sort
        if value in PortalSettings.Sort.values:
            return value
        self.logger.error(f"Invalid sort: {value}")
        raise ParseError("Invalid parameters supplied")

    def get_published_only(self, request):
        value = request.GET.get("published_only")
        if value is None:
            return False
        try:
            return utils.str_to_bool(value)
        except ValueError:
            self.logger.error(f"Invalid published_only: {value}")
            raise ParseError("Invalid parameters supplied")

    def get_page(self, queryset, page_num):
        paginator = Paginator(queryset, self.per_page)
        try:
            return paginator.page(page_num)
        except EmptyPage as e:
            self.logger.error(f"Detected EmptyPage ... {str(e)}")
            raise ParseError("Invalid parameters supplied")
