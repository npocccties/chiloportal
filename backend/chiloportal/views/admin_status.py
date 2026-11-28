from rest_framework.response import Response
from rest_framework.views import APIView

from ..auth import find_admin_user, get_shibboleth_attributes


class AdminStatus(APIView):
    """ログイン中の人（session_cookie）が、管理画面を使えるかを返す。ポータルの「管理」メニューの表示に使う。"""

    swagger_schema = None
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        attributes = get_shibboleth_attributes(request)
        user = find_admin_user(attributes["eppn"]) if attributes else None
        response = Response({"is_admin": user is not None})
        # 人によって答えが変わるので、途中でキャッシュさせない
        response["Cache-Control"] = "private, no-store"
        return response
