"""テスト用の学認の session_cookie（RS256 の JWT）を作る。"""
import base64

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.test import override_settings

_PRIVATE_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
# 署名の検証に失敗させるための、別の鍵
OTHER_PRIVATE_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)

PUBLIC_KEY_BASE64 = base64.b64encode(
    _PRIVATE_KEY.public_key().public_bytes(
        serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo
    )
).decode()

SP_LOGIN_URL = "https://sp.example.org/login"
SP_LOGOUT_URL = "https://sp.example.org/logout"

shibboleth_settings = override_settings(
    JWT_VERIFICATION_KEY_BASE64=PUBLIC_KEY_BASE64,
    SHIBBOLETH_SP_LOGIN_URL=SP_LOGIN_URL,
    SHIBBOLETH_SP_LOGOUT_URL=SP_LOGOUT_URL,
)


def make_token(eppn, display_name="テスト 太郎", key=None, **claims):
    payload = {"eppn": eppn, "displayName": display_name, **claims}
    return jwt.encode(payload, key or _PRIVATE_KEY, algorithm="RS256")


class ShibbolethLoginMixin:
    def login(self, user, **kwargs):
        """学認でログインした状態にする（session_cookie を付ける）。"""
        eppn = user if isinstance(user, str) else user.get_username()
        self.client.cookies["session_cookie"] = make_token(eppn, **kwargs)

    def logout_shibboleth(self):
        self.client.cookies.pop("session_cookie", None)
