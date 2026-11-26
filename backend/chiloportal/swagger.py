from rest_framework.filters import BaseFilterBackend


class SwaggerQueryParam:
    def __init__(self, name, required, schema="integer"):
        self.name = name
        self.required = required
        # OpenAPI の型（"integer" / "string" など）
        self.schema = schema


class SwaggerQueryParamFilter(BaseFilterBackend):
    """
    create query string parameter for swagger
    """

    def get_schema_operation_parameters(self, view):
        # DRF 3.17 で coreapi が削除されたので、OpenAPI 形式で返す（drf-yasg の DrfAPICompatInspector が読む）
        return [
            {
                "name": param.name,
                "required": param.required,
                "in": "query",
                "schema": {"type": param.schema},
            }
            for param in view.swagger_query_params
        ]
