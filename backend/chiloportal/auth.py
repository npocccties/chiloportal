#
# 管理画面のログイン（学認）
#
# ポータルと同じく、学認の SP が発行する session_cookie（RS256 の JWT。eppn と displayName を含む）を使う。
# ・管理画面へのアクセスのたびに cookie を検証し、管理ユーザーとして登録された eppn なら管理画面にログインさせる。
# ・cookie がなくなった（学認からログアウトした）、または別の人の cookie になったら、管理画面からもログアウトさせる。
# ・ID・パスワードでのログインは用意しない。
#
import base64
import logging

import jwt
from django.conf import settings
from django.contrib import auth
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

logger = logging.getLogger(__name__)

COOKIE_NAME = "session_cookie"
ADMIN_PATH_PREFIX = "/admin/"


def get_shibboleth_attributes(request):
    """session_cookie を検証し、{"eppn": ..., "displayName": ...} を返す。なければ・検証できなければ None。"""
    token = request.COOKIES.get(COOKIE_NAME)
    if not token and settings.DEBUG:
        token = settings.JWT_DEBUG_VALUE
    if not token:
        return None
    if not settings.JWT_VERIFICATION_KEY_BASE64:
        logger.error("JWT_VERIFICATION_KEY_BASE64 is not set. Cannot verify session_cookie.")
        return None
    try:
        key = base64.b64decode(settings.JWT_VERIFICATION_KEY_BASE64)
        claims = jwt.decode(token, key, algorithms=["RS256"])
    except (jwt.InvalidTokenError, ValueError) as e:
        logger.warning(f"Invalid session_cookie: {e}")
        return None
    eppn = claims.get("eppn")
    if not isinstance(eppn, str) or not eppn:
        logger.warning("session_cookie has no eppn")
        return None
    display_name = claims.get("displayName")
    return {"eppn": eppn, "displayName": display_name if isinstance(display_name, str) else ""}


def find_admin_user(eppn):
    """管理ユーザーとして登録され、停止されていないユーザーを返す。"""
    if not eppn:
        return None
    return get_user_model().objects.filter(username=eppn, is_active=True, is_staff=True).first()


class ShibbolethBackend(BaseBackend):
    """eppn で管理ユーザーを探す認証バックエンド。パスワードは使わない。"""

    def authenticate(self, request, eppn=None, **kwargs):
        return find_admin_user(eppn)

    def get_user(self, user_id):
        return get_user_model().objects.filter(pk=user_id, is_active=True, is_staff=True).first()


class ShibbolethSessionMiddleware:
    """管理画面へのアクセスのたびに、学認のログインと管理画面のログインを合わせる。"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith(ADMIN_PATH_PREFIX):
            self.sync(request)
        return self.get_response(request)

    def sync(self, request):
        attributes = get_shibboleth_attributes(request)
        request.shibboleth = attributes
        eppn = attributes["eppn"] if attributes else None
        if request.user.is_authenticated and request.user.get_username() != eppn:
            # 学認からログアウトした、または別の人がログインした
            auth.logout(request)
        if request.user.is_authenticated or eppn is None:
            return
        user = auth.authenticate(request, eppn=eppn)
        if user is None:
            return
        auth.login(request, user)
        # 表示名は学認の displayName に合わせる
        display_name = attributes["displayName"][:150]
        if display_name and user.first_name != display_name:
            user.first_name = display_name
            user.save(update_fields=["first_name"])
        logger.info(f"Admin login: {eppn}")
