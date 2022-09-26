import coreapi
from rest_framework.filters import BaseFilterBackend

class SwaggerQueryParam():
    def __init__(self, name, required):
        self.name = name
        self.required = required

class SwaggerQueryParamFilter(BaseFilterBackend):
    """
    create query string parameter for swagger
    """
    def get_schema_fields(self, view):
        fields = []
        for param in view.swagger_query_params:
            field = coreapi.Field(name=param.name, required=param.required, location="query",)
            fields.append(field)
        return fields