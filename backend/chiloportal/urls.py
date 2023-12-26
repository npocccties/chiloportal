from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from chiloportal.views.consumer_badges_list import ConsumerBadgesList
from chiloportal.views.consumer_goal_list import ConsumerGoalList
from .views import *
from drf_yasg.generators import OpenAPISchemaGenerator

app_name = "chiloportal"


class BothHttpAndHttpsSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request, public):
        schema = super().get_schema(request, public)
        host = request.META.get("HTTP_HOST")
        if "localhost" in host:
            schema.schemes = ["http"]
        else:
            schema.schemes = ["https"]
        return schema
 

schema_view = get_schema_view(
    openapi.Info(
        title="Chiloportal backend API",
        default_version="v1",
    ),
    public=True,
    generator_class=BothHttpAndHttpsSchemaGenerator,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("consumer/", ConsumerDetail.as_view(), name="consumer-detail"),
    path("consumer/list/", ConsumerList.as_view(), name="consumer-list"),
    path("stage/field/list/", StageFieldList.as_view(), name="stage-field-list"),
    path(
        "portalCategory/list/", PortalCategoryList.as_view(), name="portalCategory-list"
    ),
    path(
        "portalCategory/badges/list/",
        PortalCategoryBadgesList.as_view(),
        name="portalCategory-badges-list",
    ),
    path("framework/", FrameworkDetail.as_view(), name="framework-detal"),
    path(
        "framework/stage/list/",
        FrameworkStageList.as_view(),
        name="framework-stage-list",
    ),
    path("badges/", BadgesDetail.as_view(), name="badges-detail"),
    path(
        "wisdomBadges/list/keyword/",
        WisdomBadgesListKeyword.as_view(),
        name="wisdomBadges-list-keyword",
    ),
    path(
        "wisdomBadges/consumer/list/",
        WisdomBadgesConsumerList.as_view(),
        name="wisdomBadges-consumer-list",
    ),
    path(
        "consumer/framework/list/",
        ConsumerFrameworkList.as_view(),
        name="consumer-framework-list",
    ),
    path(
        "consumer/goal/list/",
        ConsumerGoalList.as_view(),
        name="consumer-goal-list",
    ),
    path(
        "consumer/badges/list/",
        ConsumerBadgesList.as_view(),
        name="consumer-badges-list",
    ),
]

urlpatterns.append(
    re_path(
        "^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    )
)
urlpatterns.append(
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    )
)
urlpatterns.append(
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc")
)
