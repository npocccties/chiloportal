from rest_framework.views import APIView
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound,ParseError,MethodNotAllowed
from django.db.models import Q
from django.conf import settings
from django.db.models import Count
from .models import *
from . import utils
from .swagger import *
from .responses import *


def get_permission_classes():
    if settings.DEBUG:
        return [HasAPIKey | IsAuthenticated]
    else:
        return [HasAPIKey]


