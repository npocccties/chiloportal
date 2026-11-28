import datetime
from io import StringIO

from django.contrib.auth import get_user_model
from django.core import management
from django.core.management.base import CommandError
from django.test import TestCase, override_settings
from django.urls import reverse

from ...models import Issuer
from ..shibboleth import (
    OTHER_PRIVATE_KEY,
    SP_LOGIN_URL,
    SP_LOGOUT_URL,
    ShibbolethLoginMixin,
    make_token,
    shibboleth_settings,
)

User = get_user_model()
INDEX = reverse("admin:index")
LOGIN = reverse("admin:login")
LOGOUT = reverse("admin:logout")


@shibboleth_settings
class ShibbolethLoginTest(ShibbolethLoginMixin, TestCase):
    def setUp(self):
        self.admin = User.objects.create(username="admin@example.ac.jp", is_staff=True, is_superuser=True)
        self.admin.set_unusable_password()
        self.admin.save()

    def logged_in_user(self):
        return self.client.get(INDEX).wsgi_request.user

    def test_not_logged_in_goes_to_sp_login(self):
        response = self.client.get(INDEX)
        self.assertRedirects(response, f"{LOGIN}?next={INDEX}", fetch_redirect_response=False)
        response = self.client.get(response["Location"])
        self.assertRedirects(response, SP_LOGIN_URL, fetch_redirect_response=False)

    def test_registered_user_logs_in(self):
        self.login(self.admin, display_name="管理 花子")
        response = self.client.get(INDEX)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.wsgi_request.user, self.admin)
        self.admin.refresh_from_db()
        # 表示名は学認の displayName に合わせる
        self.assertEqual(self.admin.first_name, "管理 花子")

    def test_login_page_redirects_logged_in_user(self):
        self.login(self.admin)
        response = self.client.get(LOGIN, {"next": "/admin/chiloportal/"})
        self.assertRedirects(response, "/admin/chiloportal/", fetch_redirect_response=False)
        # 外のサイトには戻さない
        response = self.client.get(LOGIN, {"next": "https://evil.example.org/"})
        self.assertRedirects(response, INDEX, fetch_redirect_response=False)

    def test_unregistered_user_sees_eppn(self):
        self.login("newcomer@example.ac.jp")
        response = self.client.get(LOGIN)
        self.assertEqual(response.status_code, 403)
        self.assertContains(response, "newcomer@example.ac.jp", status_code=403)
        self.assertContains(response, "管理ユーザーとして登録されていません", status_code=403)
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_inactive_user_cannot_log_in(self):
        self.admin.is_active = False
        self.admin.save()
        self.login(self.admin)
        self.assertFalse(self.logged_in_user().is_authenticated)
        self.assertEqual(self.client.get(LOGIN).status_code, 403)

    def test_non_staff_user_cannot_log_in(self):
        User.objects.create(username="portal@example.ac.jp")
        self.login("portal@example.ac.jp")
        self.assertFalse(self.logged_in_user().is_authenticated)

    def test_invalid_signature_is_ignored(self):
        self.client.cookies["session_cookie"] = make_token(self.admin.username, key=OTHER_PRIVATE_KEY)
        self.assertFalse(self.logged_in_user().is_authenticated)
        self.assertRedirects(self.client.get(LOGIN), SP_LOGIN_URL, fetch_redirect_response=False)

    def test_expired_token_is_ignored(self):
        expired = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=1)
        self.client.cookies["session_cookie"] = make_token(self.admin.username, exp=expired)
        self.assertFalse(self.logged_in_user().is_authenticated)

    def test_broken_token_is_ignored(self):
        self.client.cookies["session_cookie"] = "not-a-jwt"
        self.assertFalse(self.logged_in_user().is_authenticated)

    def test_shibboleth_logout_logs_out_admin(self):
        self.login(self.admin)
        self.assertTrue(self.logged_in_user().is_authenticated)
        # 学認からログアウトして cookie がなくなったら、管理画面からもログアウトする
        self.logout_shibboleth()
        self.assertFalse(self.logged_in_user().is_authenticated)

    def test_other_person_replaces_session(self):
        other = User.objects.create(username="other@example.ac.jp", is_staff=True)
        self.login(self.admin)
        self.assertEqual(self.logged_in_user(), self.admin)
        self.login(other)
        self.assertEqual(self.logged_in_user(), other)

    def test_password_login_is_not_available(self):
        user = User.objects.create(username="password-user", is_staff=True, is_superuser=True)
        user.set_password("password-for-test")
        user.save()
        response = self.client.post(LOGIN, {"username": "password-user", "password": "password-for-test"})
        self.assertFalse(response.wsgi_request.user.is_authenticated)
        self.assertRedirects(response, SP_LOGIN_URL, fetch_redirect_response=False)

    def test_logout_goes_to_sp_logout(self):
        self.login(self.admin)
        self.client.get(INDEX)
        response = self.client.post(LOGOUT)
        self.assertRedirects(response, SP_LOGOUT_URL, fetch_redirect_response=False)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_logout_requires_post(self):
        self.login(self.admin)
        self.assertEqual(self.client.get(LOGOUT).status_code, 405)

    @override_settings(SHIBBOLETH_SP_LOGIN_URL="")
    def test_login_url_not_configured(self):
        self.assertEqual(self.client.get(LOGIN).status_code, 503)

    @override_settings(DEBUG=True)
    def test_debug_value_is_used_only_in_debug(self):
        with self.settings(JWT_DEBUG_VALUE=make_token(self.admin.username)):
            self.assertTrue(self.logged_in_user().is_authenticated)

    def test_debug_value_is_ignored_without_debug(self):
        with self.settings(JWT_DEBUG_VALUE=make_token(self.admin.username)):
            self.assertFalse(self.logged_in_user().is_authenticated)


@shibboleth_settings
class AdminStatusTest(ShibbolethLoginMixin, TestCase):
    url = "/api/v1/admin/status/"

    def test_admin(self):
        User.objects.create(username="admin@example.ac.jp", is_staff=True)
        self.login("admin@example.ac.jp")
        response = self.client.get(self.url)
        self.assertEqual(response.json(), {"is_admin": True})
        self.assertIn("no-store", response["Cache-Control"])

    def test_not_admin(self):
        self.login("someone@example.ac.jp")
        self.assertEqual(self.client.get(self.url).json(), {"is_admin": False})

    def test_not_logged_in(self):
        self.assertEqual(self.client.get(self.url).json(), {"is_admin": False})


@shibboleth_settings
class AdminUserAdminTest(ShibbolethLoginMixin, TestCase):
    def setUp(self):
        self.overall = User.objects.create(username="overall@example.ac.jp", is_staff=True, is_superuser=True)
        self.univ = Issuer.objects.create(name="A大学")
        self.login(self.overall)

    def test_register_issuer_admin(self):
        response = self.client.post(
            reverse("admin:auth_user_add"),
            {"username": "a@example.ac.jp", "first_name": "", "is_active": "on", "issuers": [self.univ.pk]},
        )
        self.assertEqual(response.status_code, 302)
        user = User.objects.get(username="a@example.ac.jp")
        self.assertTrue(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.has_usable_password())
        self.assertEqual(list(user.assigned_issuers.all()), [self.univ])

    def test_list_shows_only_admin_users(self):
        User.objects.create(username="not-admin@example.ac.jp")
        response = self.client.get(reverse("admin:auth_user_changelist"))
        names = {user.username for user in response.context["cl"].result_list}
        self.assertEqual(names, {"overall@example.ac.jp"})

    def test_issuer_admin_cannot_manage_users(self):
        issuer_admin = User.objects.create(username="a@example.ac.jp", is_staff=True)
        self.login(issuer_admin)
        self.assertEqual(self.client.get(reverse("admin:auth_user_changelist")).status_code, 403)


class CreateAdminCommandTest(TestCase):
    def call(self, *args):
        stdout = StringIO()
        management.call_command("createadmin", *args, stdout=stdout)
        return stdout.getvalue()

    def test_create_superuser(self):
        output = self.call("first@example.ac.jp", "--superuser")
        user = User.objects.get(username="first@example.ac.jp")
        self.assertTrue(user.is_staff and user.is_superuser and user.is_active)
        self.assertFalse(user.has_usable_password())
        self.assertIn("全体管理者", output)

    def test_existing_user_becomes_admin_without_password(self):
        user = User.objects.create(username="exists@example.ac.jp", is_active=False)
        user.set_password("old-password-for-test")
        user.save()
        self.call("exists@example.ac.jp")
        user.refresh_from_db()
        self.assertTrue(user.is_staff and user.is_active)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.has_usable_password())

    def test_invalid_eppn(self):
        with self.assertRaises(CommandError):
            self.call("bad eppn")
