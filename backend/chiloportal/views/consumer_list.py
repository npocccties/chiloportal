from rest_framework.response import Response
from rest_framework.exceptions import NotFound,ParseError
from ..models import *
from .. import utils
from ..swagger import *
from ..responses import *
from .base_api_view import *

class ConsumerList(BaseAPIView):
    def _get(self, request):
        queryset = Consumer.objects.all().order_by('pk')
        if queryset.exists() == False:
            raise NotFound('Data not found')
        return Response(to_consumers(queryset))
