from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from .views import *

app_name = "chiloportal"

schema_view = get_schema_view(
    openapi.Info(
        title="Chiloportal backend API",
        default_version="v1",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("consumer/", ConsumerDetail.as_view(), name="consumer-detail"),
    path("consumer/list/", ConsumerList.as_view(), name="consumer-list"),
    path(
        "framework/field/list/",
        FrameworkFieldList.as_view(),
        name="framework-field-list",
    ),
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
    path("wisdomBadges/list/", WisdomBadgesList.as_view(), name="wisdomBadges-list"),
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
        "knowledgeBadges/criteria/list/",
        KnowledgeBadgesCriteriaList.as_view(),
        name="knowledgeBadges-criteria-list",
    ),
    path(
        "consumer/framework/list/",
        ConsumerFrameworkList.as_view(),
        name="consumer-framework-list",
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
