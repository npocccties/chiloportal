from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError
from ..models import *
from .. import utils
from ..swagger import *
from ..responses import *
from .base_api_view import *


class IssuerList(BaseAPIView):
    def _get(self, request):
        queryset = Issuer.objects.all().order_by("pk")
        if queryset.exists() == False:
            return Response([])
        return Response(to_issuers(queryset))
