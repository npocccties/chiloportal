import shutil
import tempfile
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from ..images import validate_badge_image
from ..models import Issuer, Label, PortalCategory, PortalSettings, WisdomBadges
from .shibboleth import ShibbolethLoginMixin, shibboleth_settings

Status = WisdomBadges.Status
PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
SVG = b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#123"/></svg>'


def svg_file(content, name="badge.svg"):
    return SimpleUploadedFile(name, content, content_type="image/svg+xml")


class BadgeImageValidationTest(TestCase):
    def assert_rejected(self, file):
        with self.assertRaises(ValidationError):
            validate_badge_image(file)

    def test_accepts_svg_and_png(self):
        validate_badge_image(svg_file(SVG))
        validate_badge_image(SimpleUploadedFile("badge.png", PNG, content_type="image/png"))

    def test_accepts_internal_reference_and_embedded_png(self):
        validate_badge_image(
            svg_file(
                b'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                b'<defs><linearGradient id="g"/></defs><rect fill="url(#g)" width="1" height="1"/>'
                b'<use xlink:href="#g"/><image href="data:image/png;base64,AAAA"/></svg>'
            )
        )

    def test_rejects_script(self):
        self.assert_rejected(svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'))

    def test_rejects_event_attribute(self):
        self.assert_rejected(svg_file(b'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'))

    def test_rejects_javascript_link(self):
        self.assert_rejected(
            svg_file(
                b'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                b'<a xlink:href="javascript:alert(1)"><text>x</text></a></svg>'
            )
        )

    def test_rejects_external_image(self):
        self.assert_rejected(
            svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.example.org/x.png"/></svg>')
        )

    def test_rejects_embedded_svg(self):
        self.assert_rejected(
            svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/svg+xml;base64,AAAA"/></svg>')
        )

    def test_rejects_foreign_object(self):
        self.assert_rejected(
            svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div>x</div></foreignObject></svg>')
        )

    def test_rejects_external_style(self):
        self.assert_rejected(
            svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><style>@import url(https://evil.example.org/x.css);</style></svg>')
        )
        self.assert_rejected(
            svg_file(b'<svg xmlns="http://www.w3.org/2000/svg"><rect style="fill:url(https://evil.example.org/x)"/></svg>')
        )

    def test_rejects_entities(self):
        self.assert_rejected(
            svg_file(b'<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY a "aaaa">]><svg xmlns="http://www.w3.org/2000/svg">&a;</svg>')
        )

    def test_rejects_not_svg(self):
        self.assert_rejected(svg_file(b"<html><body>x</body></html>"))
        self.assert_rejected(svg_file(b"not xml"))

    def test_rejects_fake_png_and_other_types(self):
        self.assert_rejected(SimpleUploadedFile("badge.png", SVG, content_type="image/png"))
        self.assert_rejected(SimpleUploadedFile("badge.jpg", PNG, content_type="image/jpeg"))

    def test_rejects_large_file(self):
        self.assert_rejected(SimpleUploadedFile("badge.png", PNG + b"\x00" * (2 * 1024 * 1024), content_type="image/png"))


class BadgeDisplayTestBase(TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        media = override_settings(MEDIA_ROOT=self.media_root)
        media.enable()
        self.addCleanup(media.disable)
        self.addCleanup(shutil.rmtree, self.media_root, ignore_errors=True)
        self.category = PortalCategory.objects.create(name="カテゴリ")
        self.univ = Issuer.objects.create(name="A大学")
        self.limited = Label.objects.create(name="受講者限定", color=Label.Color.ORANGE)
        self.beginner = Label.objects.create(name="初心者向け", color=Label.Color.BLUE)

    def create_badge(self, name, published_days_ago=None, **kwargs):
        badge = WisdomBadges.objects.create(
            name=name,
            badge_class_id=f"https://lms.example.org/badges/{name}",
            issuer=self.univ,
            portal_category=self.category,
            alignments_targetname="コース",
            alignments_targeturl="https://lms.example.org/course",
            status=Status.PUBLISHED,
            **kwargs,
        )
        # 公開した日時を、テストに合わせて置き換える（None なら公開日の分からない既存のバッジ）
        published_at = None if published_days_ago is None else timezone.now() - timedelta(days=published_days_ago)
        WisdomBadges.objects.filter(pk=badge.pk).update(published_at=published_at)
        return WisdomBadges.objects.get(pk=badge.pk)

    def badges(self, params=None):
        response = self.client.get("/api/v1/badges/list/", {"published_only": "true", **(params or {})})
        self.assertEqual(response.status_code, 200)
        return response.json()


class BadgeDisplayApiTest(BadgeDisplayTestBase):
    def test_new_labels_and_display_image(self):
        recent = self.create_badge("recent", published_days_ago=10)
        recent.labels.set([self.beginner, self.limited])
        recent.display_image = svg_file(SVG)
        recent.save()
        self.create_badge("old", published_days_ago=200)
        self.create_badge("dismissed", published_days_ago=10, new_dismissed=True)
        self.create_badge("existing")  # 公開日の分からない既存のバッジ
        badges = {badge["name"]: badge for badge in self.badges()["badges"]}
        self.assertEqual({name: badge["is_new"] for name, badge in badges.items()},
                         {"recent": True, "old": False, "dismissed": False, "existing": False})
        # ラベルは表示順に並ぶ
        self.assertEqual(
            badges["recent"]["labels"],
            [{"name": "受講者限定", "color": "orange"}, {"name": "初心者向け", "color": "blue"}],
        )
        self.assertRegex(badges["recent"]["display_image"], r"^/media/badges/[0-9a-f]{32}\.svg$")
        self.assertIsNone(badges["old"]["display_image"])
        self.assertEqual(badges["old"]["labels"], [])

    def test_new_badge_days_setting(self):
        self.create_badge("badge", published_days_ago=10)
        settings = PortalSettings.load()
        settings.new_badge_days = 5
        settings.save()
        self.assertFalse(self.badges()["badges"][0]["is_new"])

    def test_detail_has_new_fields(self):
        badge = self.create_badge("badge", published_days_ago=1)
        badge.labels.set([self.limited])
        response = self.client.get(
            "/api/v1/badges/", {"badges_ids": str(badge.pk), "badges_type": "wisdom", "published_only": "true"}
        )
        data = response.json()[0]
        self.assertTrue(data["is_new"])
        self.assertEqual(data["labels"], [{"name": "受講者限定", "color": "orange"}])


class BadgeSortTest(BadgeDisplayTestBase):
    def setUp(self):
        super().setUp()
        # 登録順：existing1, newer, existing2, older
        self.existing1 = self.create_badge("existing1")
        self.newer = self.create_badge("newer", published_days_ago=1)
        self.existing2 = self.create_badge("existing2")
        self.older = self.create_badge("older", published_days_ago=30)

    def names(self, data):
        return [badge["name"] for badge in data["badges"]]

    def test_without_sort_keeps_registration_order(self):
        data = self.badges()
        self.assertEqual(self.names(data), ["existing1", "newer", "existing2", "older"])
        self.assertNotIn("sort", data)

    def test_newest(self):
        data = self.badges({"sort": "newest"})
        # 公開日の分からない既存のバッジは後ろに、登録の新しい順
        self.assertEqual(self.names(data), ["newer", "older", "existing2", "existing1"])
        self.assertEqual(data["sort"], "newest")

    def test_oldest(self):
        data = self.badges({"sort": "oldest"})
        self.assertEqual(self.names(data), ["existing1", "existing2", "older", "newer"])

    def test_default_uses_setting(self):
        # 初期値は古い順（今までの並びに近い）
        self.assertEqual(self.badges({"sort": "default"})["sort"], "oldest")
        settings = PortalSettings.load()
        settings.default_sort = PortalSettings.Sort.NEWEST
        settings.save()
        data = self.badges({"sort": "default"})
        self.assertEqual(data["sort"], "newest")
        self.assertEqual(self.names(data)[0], "newer")

    def test_invalid_sort(self):
        response = self.client.get("/api/v1/badges/list/", {"sort": "random"})
        self.assertEqual(response.status_code, 400)

    def test_keyword_and_category_lists(self):
        data = self.client.get(
            "/api/v1/wisdomBadges/list/keyword/", {"keyword": "e", "sort": "newest", "published_only": "true"}
        ).json()
        self.assertEqual(self.names(data)[0], "newer")
        data = self.client.get(
            "/api/v1/portalCategory/badges/list/",
            {"portal_category_id": self.category.pk, "sort": "newest", "published_only": "true"},
        ).json()
        self.assertEqual(self.names(data)[0], "newer")

    def test_empty_result_has_sort(self):
        data = self.client.get(
            "/api/v1/badges/list/", {"issuer_id": 99999, "sort": "newest", "published_only": "true"}
        ).json()
        self.assertEqual(data["badges"], [])
        self.assertEqual(data["sort"], "newest")


@shibboleth_settings
class BadgeDisplayAdminTest(ShibbolethLoginMixin, BadgeDisplayTestBase):
    def setUp(self):
        super().setUp()
        User = get_user_model()
        self.overall = User.objects.create(username="overall@example.org", is_staff=True, is_superuser=True)
        self.issuer_admin = User.objects.create(username="a@example.org", is_staff=True)
        self.univ.admins.add(self.issuer_admin)
        self.badge = self.create_badge("badge", published_days_ago=1)

    def change(self, data):
        prefix = "knowledge_badges_wisdom_badges"
        return self.client.post(
            reverse("admin:chiloportal_wisdombadges_change", args=[self.badge.pk]),
            {
                "status": Status.PUBLISHED,
                "portal_category": self.category.pk,
                f"{prefix}-TOTAL_FORMS": "0",
                f"{prefix}-INITIAL_FORMS": "0",
                f"{prefix}-MIN_NUM_FORMS": "0",
                f"{prefix}-MAX_NUM_FORMS": "1000",
                **data,
            },
        )

    def test_issuer_admin_sets_labels_image_and_new(self):
        self.login(self.issuer_admin)
        response = self.change(
            {"labels": [self.limited.pk], "new_dismissed": "on", "display_image": svg_file(SVG)}
        )
        self.assertEqual(response.status_code, 302)
        badge = WisdomBadges.objects.get(pk=self.badge.pk)
        self.assertEqual(list(badge.labels.all()), [self.limited])
        self.assertTrue(badge.new_dismissed)
        self.assertTrue(badge.display_image.name.startswith("badges/"))

    def test_script_svg_is_rejected_in_admin(self):
        self.login(self.issuer_admin)
        response = self.change(
            {"display_image": svg_file(b'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>')}
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "SVG に使えない属性")
        self.assertFalse(WisdomBadges.objects.get(pk=self.badge.pk).display_image)

    def test_issuer_admin_cannot_manage_labels_or_settings(self):
        self.login(self.issuer_admin)
        self.assertEqual(self.client.get(reverse("admin:chiloportal_label_changelist")).status_code, 403)
        self.assertEqual(self.client.get(reverse("admin:chiloportal_portalsettings_changelist")).status_code, 403)

    def test_settings_page_opens_the_only_record(self):
        self.login(self.overall)
        response = self.client.get(reverse("admin:chiloportal_portalsettings_changelist"))
        self.assertRedirects(
            response, reverse("admin:chiloportal_portalsettings_change", args=[1]), fetch_redirect_response=False
        )
        response = self.client.post(
            reverse("admin:chiloportal_portalsettings_change", args=[1]),
            {"new_badge_days": "90", "default_sort": "newest"},
        )
        self.assertEqual(response.status_code, 302)
        settings = PortalSettings.load()
        self.assertEqual((settings.new_badge_days, settings.default_sort), (90, "newest"))
        self.assertEqual(PortalSettings.objects.count(), 1)

    def test_label_sort_key_is_assigned(self):
        self.assertEqual([self.limited.sort_key, self.beginner.sort_key], [1, 2])
