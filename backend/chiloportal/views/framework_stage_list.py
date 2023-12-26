from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..models import *
from ..swagger import *
from ..responses import *
from .base_api_view import *
from .. import utils
from django.db.models import Q


class FrameworkStageList(BaseAPIView):
    swagger_query_params = [SwaggerQueryParam("framework_id", True)]
    filter_backends = (SwaggerQueryParamFilter,)

    def _get(self, request):
        id = request.GET.get("framework_id")
        if id == None or utils.is_int(id) == False:
            raise ParseError("Invalid ID supplied")
        # パスワードが設定されているデータは、e-ポートフォリオでしか使用しないのでポータルサイトでは取得しない
        queryset = (
            Stage.objects.filter(Q(goal_stage__framework_id=id), Q(password__isnull=True) | Q(password=""))
            .order_by("sort_key")
            .distinct()
        )
        if queryset.exists() == False:
            self.logger.error(f"Not found stage. framework_id: {id}")
            raise ParseError("Invalid ID supplied")
        return Response(to_stages(queryset))
