#
# 管理画面のサイト。ログイン・ログアウトを学認にする。
#
from django.conf import settings
from django.contrib import admin, auth
from django.http import HttpResponseNotAllowed
from django.shortcuts import redirect
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme

from .auth import get_shibboleth_attributes


class ChiloportalAdminSite(admin.AdminSite):
    site_header = "CHiLO-Portal 管理画面"
    site_title = "CHiLO-Portal 管理画面"
    index_title = "管理メニュー"

    def login(self, request, extra_context=None):
        # ログインは ShibbolethSessionMiddleware が行う。ここでは、ログインできなかった理由に応じて案内する
        if request.user.is_active and request.user.is_staff:
            next_url = request.GET.get("next", "")
            if not url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                next_url = reverse("admin:index", current_app=self.name)
            return redirect(next_url)
        attributes = getattr(request, "shibboleth", None) or get_shibboleth_attributes(request)
        if attributes is None:
            # 学認にログインしていない
            if settings.SHIBBOLETH_SP_LOGIN_URL:
                return redirect(settings.SHIBBOLETH_SP_LOGIN_URL)
            return self.message(request, "学認のログインの設定（SHIBBOLETH_SP_LOGIN_URL）がありません。", status=503)
        # 学認にはログインしているが、管理ユーザーとして登録されていない（または停止されている）
        return TemplateResponse(
            request,
            "admin/chiloportal/not_registered.html",
            {**self.each_context(request), "title": "管理ユーザーとして登録されていません", "eppn": attributes["eppn"]},
            status=403,
        )

    def logout(self, request, extra_context=None):
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])
        auth.logout(request)
        # 学認からもログアウトする（session_cookie が残っていると、次のアクセスでまたログインするため）
        if settings.SHIBBOLETH_SP_LOGOUT_URL:
            return redirect(settings.SHIBBOLETH_SP_LOGOUT_URL)
        return self.message(request, "ログアウトしました。")

    def message(self, request, text, status=200):
        return TemplateResponse(
            request,
            "admin/chiloportal/message.html",
            {**self.each_context(request), "title": text},
            status=status,
        )
