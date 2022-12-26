from rest_framework.compat import coreapi, coreschema
from rest_framework.filters import BaseFilterBackend


class SwaggerQueryParam:
    def __init__(self, name, required, schema=coreschema.Integer()):
        self.name = name
        self.required = required
        self.schema = schema


class SwaggerQueryParamFilter(BaseFilterBackend):
    """
    create query string parameter for swagger
    """

    def get_schema_fields(self, view):
        fields = []
        for param in view.swagger_query_params:
            field = coreapi.Field(
                name=param.name,
                required=param.required,
                location="query",
                schema=param.schema,
            )
            fields.append(field)
        return fields
