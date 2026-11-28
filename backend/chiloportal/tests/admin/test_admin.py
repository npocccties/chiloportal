from django.contrib.admin.models import LogEntry
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib import admin as django_admin
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse

from ...models import IssuerMapping, Issuer, KnowledgeBadges, PortalCategory, WisdomBadges
from ..shibboleth import ShibbolethLoginMixin, shibboleth_settings

Status = WisdomBadges.Status


def create_badge(name, issuer, issuer_name, issuer_url, category=None, status=Status.HIDDEN):
    badge = WisdomBadges.objects.create(
        name=name,
        badge_class_id=f"https://lms.example.org/badges/{name}",
        issuer=issuer,
        issuer_name=issuer_name,
        issuer_url=issuer_url,
        portal_category=category,
        alignments_targetname="コース",
        alignments_targeturl="https://lms.example.org/course",
        status=status,
    )
    KnowledgeBadges.objects.create(
        wisdom_badges=badge,
        name=f"{name} のスタンプ",
        badge_class_id=f"https://lms.example.org/badges/{name}-k",
        issuer=issuer,
        issuer_name=issuer_name,
        issuer_url=issuer_url,
    )
    return badge


@shibboleth_settings
class AdminTestBase(ShibbolethLoginMixin, TestCase):
    def setUp(self):
        User = get_user_model()
        self.overall = User.objects.create(username="overall@example.org", is_staff=True, is_superuser=True)
        self.admin_a = User.objects.create(username="a@example.org", is_staff=True)
        self.admin_b = User.objects.create(username="b@example.org", is_staff=True)
        self.category = PortalCategory.objects.create(name="カテゴリ")
        self.univ_a = Issuer.objects.create(name="A大学", url="https://a.example.org")
        self.univ_b = Issuer.objects.create(name="B大学", url="https://b.example.org")
        self.univ_a.admins.add(self.admin_a)
        self.univ_b.admins.add(self.admin_b)
        # A大学は2つの Moodle から発行している
        self.map_a1 = IssuerMapping.objects.create(
            issuer_name="A大学", issuer_url="https://lms1.a.example.org", issuer=self.univ_a
        )
        self.map_a2 = IssuerMapping.objects.create(
            issuer_name="A大学 教職", issuer_url="https://lms2.a.example.org", issuer=self.univ_a
        )
        self.map_b = IssuerMapping.objects.create(
            issuer_name="B大学", issuer_url="https://lms.b.example.org", issuer=self.univ_b
        )
        self.badge_a1 = create_badge("a1", self.univ_a, "A大学", "https://lms1.a.example.org", self.category)
        self.badge_a2 = create_badge(
            "a2", self.univ_a, "A大学 教職", "https://lms2.a.example.org", self.category, Status.PUBLISHED
        )
        self.badge_a3 = create_badge("a3", self.univ_a, "A大学", "https://lms1.a.example.org")
        self.badge_b1 = create_badge("b1", self.univ_b, "B大学", "https://lms.b.example.org", self.category)


class WisdomBadgesModelTest(AdminTestBase):
    def test_published_at_is_set_when_published(self):
        self.assertIsNone(self.badge_a1.published_at)
        self.badge_a1.status = Status.PUBLISHED
        self.badge_a1.save()
        self.assertIsNotNone(self.badge_a1.published_at)
        first = self.badge_a1.published_at
        # 非表示に戻して公開し直しても、最初に公開した日時のまま
        self.badge_a1.status = Status.HIDDEN
        self.badge_a1.save()
        self.badge_a1.status = Status.PUBLISHED
        self.badge_a1.save()
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).published_at, first)

    def test_existing_published_badge_keeps_empty_published_at(self):
        # 移行で公開にした既存のバッジは、保存し直しても公開日が空のまま（NEW を付けない）
        WisdomBadges.objects.filter(pk=self.badge_a2.pk).update(published_at=None)
        badge = WisdomBadges.objects.get(pk=self.badge_a2.pk)
        badge.portal_category = PortalCategory.objects.create(name="別のカテゴリ")
        badge.save()
        self.assertIsNone(WisdomBadges.objects.get(pk=badge.pk).published_at)

    def test_cannot_publish_auto_hidden(self):
        WisdomBadges.objects.filter(pk=self.badge_a1.pk).update(status=Status.AUTO_HIDDEN)
        badge = WisdomBadges.objects.get(pk=self.badge_a1.pk)
        badge.status = Status.PUBLISHED
        with self.assertRaises(ValidationError):
            badge.full_clean()

    def test_cannot_publish_without_category(self):
        self.badge_a3.status = Status.PUBLISHED
        with self.assertRaises(ValidationError):
            self.badge_a3.full_clean()


class RoleScopeTest(AdminTestBase):
    changelist = reverse("admin:chiloportal_wisdombadges_changelist")

    def change_url(self, badge):
        return reverse("admin:chiloportal_wisdombadges_change", args=[badge.pk])

    def listed_names(self, response):
        return {badge.name for badge in response.context["cl"].result_list}

    def test_overall_admin_sees_all(self):
        self.login(self.overall)
        response = self.client.get(self.changelist)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.listed_names(response), {"a1", "a2", "a3", "b1"})

    def test_issuer_admin_sees_only_assigned(self):
        self.login(self.admin_a)
        response = self.client.get(self.changelist)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.listed_names(response), {"a1", "a2", "a3"})
        self.assertEqual(self.client.get(self.change_url(self.badge_a1)).status_code, 200)
        # 担当外のバッジは開けない（存在しないものと同じ扱いで、一覧に戻される）
        response = self.client.get(self.change_url(self.badge_b1))
        self.assertNotEqual(response.status_code, 200)

    def test_issuer_admin_with_two_issuers(self):
        self.univ_b.admins.add(self.admin_a)
        self.login(self.admin_a)
        response = self.client.get(self.changelist)
        self.assertEqual(self.listed_names(response), {"a1", "a2", "a3", "b1"})

    def test_issuer_admin_cannot_open_overall_pages(self):
        self.login(self.admin_a)
        for name in ["issuer", "issuermapping", "portalcategory", "consumer", "goal"]:
            response = self.client.get(reverse(f"admin:chiloportal_{name}_changelist"))
            self.assertEqual(response.status_code, 403, name)

    def test_issuer_admin_sees_only_assigned_knowledge_badges(self):
        self.login(self.admin_a)
        response = self.client.get(reverse("admin:chiloportal_knowledgebadges_changelist"))
        names = {badge.name for badge in response.context["cl"].result_list}
        self.assertEqual(names, {"a1 のスタンプ", "a2 のスタンプ", "a3 のスタンプ"})

    def test_issuer_admin_can_publish_assigned(self):
        self.login(self.admin_a)
        response = self.client.post(
            self.change_url(self.badge_a1),
            {"status": Status.PUBLISHED, "portal_category": self.category.pk, **self.inline_management()},
        )
        self.assertEqual(response.status_code, 302)
        badge = WisdomBadges.objects.get(pk=self.badge_a1.pk)
        self.assertEqual(badge.status, Status.PUBLISHED)
        self.assertIsNotNone(badge.published_at)

    def test_cannot_publish_without_category_in_form(self):
        self.login(self.admin_a)
        response = self.client.post(
            self.change_url(self.badge_a3),
            {"status": Status.PUBLISHED, "portal_category": "", **self.inline_management()},
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "カテゴリを設定しないと公開できません。")
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a3.pk).status, Status.HIDDEN)

    def test_moodle_fields_are_read_only(self):
        self.login(self.admin_a)
        self.client.post(
            self.change_url(self.badge_a1),
            {
                "status": Status.HIDDEN,
                "portal_category": self.category.pk,
                "name": "書き換えた名前",
                **self.inline_management(),
            },
        )
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).name, "a1")

    def test_publish_action(self):
        self.login(self.admin_a)
        response = self.client.post(
            self.changelist,
            {
                "action": "publish",
                "_selected_action": [self.badge_a1.pk, self.badge_a3.pk, self.badge_b1.pk],
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).status, Status.PUBLISHED)
        # カテゴリのない a3 は公開しない
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a3.pk).status, Status.HIDDEN)
        self.assertContains(response, "a3")
        # 担当外の b1 は、選んでも変わらない
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_b1.pk).status, Status.HIDDEN)
        self.assertTrue(LogEntry.objects.filter(object_id=str(self.badge_a1.pk), user=self.admin_a).exists())

    def test_auto_hidden_cannot_be_published(self):
        # Moodle で無効・削除されたバッジは、全体管理者でも手では公開できない
        WisdomBadges.objects.filter(pk=self.badge_a1.pk).update(status=Status.AUTO_HIDDEN)
        self.login(self.overall)
        response = self.client.post(
            self.changelist, {"action": "publish", "_selected_action": [self.badge_a1.pk]}, follow=True
        )
        self.assertContains(response, "Moodle で無効・削除されているので")
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).status, Status.AUTO_HIDDEN)
        # 変更の画面からも変えられない（項目が無効になっていて、送っても無視される）
        response = self.client.post(
            self.change_url(self.badge_a1),
            {"status": Status.PUBLISHED, "portal_category": self.category.pk, **self.inline_management()},
        )
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).status, Status.AUTO_HIDDEN)

    def test_hide_action(self):
        self.login(self.admin_a)
        self.client.post(self.changelist, {"action": "hide", "_selected_action": [self.badge_a2.pk]})
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a2.pk).status, Status.HIDDEN)

    def test_badges_cannot_be_deleted(self):
        self.login(self.overall)
        response = self.client.get(reverse("admin:chiloportal_wisdombadges_delete", args=[self.badge_a1.pk]))
        self.assertEqual(response.status_code, 403)

    def inline_management(self):
        prefix = "knowledge_badges_wisdom_badges"
        return {
            f"{prefix}-TOTAL_FORMS": "0",
            f"{prefix}-INITIAL_FORMS": "0",
            f"{prefix}-MIN_NUM_FORMS": "0",
            f"{prefix}-MAX_NUM_FORMS": "1000",
        }


class IssuerMappingAdminTest(AdminTestBase):
    def change_url(self, mapping):
        return reverse("admin:chiloportal_issuermapping_change", args=[mapping.pk])

    def test_change_requires_confirmation(self):
        self.login(self.overall)
        url = self.change_url(self.map_a2)
        response = self.client.post(url, {"issuer": self.univ_b.pk})
        self.assertEqual(response.status_code, 200)
        # 保存する前に、管理できるようになる機関管理者を表示する
        self.assertContains(response, "b@example.org")
        self.assertEqual(IssuerMapping.objects.get(pk=self.map_a2.pk).issuer, self.univ_a)
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a2.pk).issuer, self.univ_a)

        # 確認の画面で表示した内容（署名付き）を付けて、もう一度保存する
        confirmation = response.context["adminform"].form["confirmation"].value()
        response = self.client.post(url, {"issuer": self.univ_b.pk, "confirmation": confirmation})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(IssuerMapping.objects.get(pk=self.map_a2.pk).issuer, self.univ_b)
        badge = WisdomBadges.objects.get(pk=self.badge_a2.pk)
        self.assertEqual(badge.issuer, self.univ_b)
        # 付け替えたバッジは非表示に戻し、新しい担当機関の公開待ちにする
        self.assertEqual(badge.status, Status.HIDDEN)
        self.assertEqual(KnowledgeBadges.objects.get(wisdom_badges=badge).issuer, self.univ_b)
        # 他の組み合わせのバッジは変わらない
        self.assertEqual(WisdomBadges.objects.get(pk=self.badge_a1.pk).issuer, self.univ_a)
        # 履歴に残る
        entry = LogEntry.objects.filter(object_id=str(self.map_a2.pk)).latest("action_time")
        self.assertIn("B大学", entry.get_change_message())

    def test_confirmation_cannot_be_skipped(self):
        self.login(self.overall)
        url = self.change_url(self.map_a2)
        # 確認の画面を見ずに、それらしい値を付けても保存しない
        response = self.client.post(url, {"issuer": self.univ_b.pk, "confirmation": "on"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(IssuerMapping.objects.get(pk=self.map_a2.pk).issuer, self.univ_a)

    def test_confirmation_is_asked_again_when_admins_change(self):
        self.login(self.overall)
        url = self.change_url(self.map_a2)
        response = self.client.post(url, {"issuer": self.univ_b.pk})
        confirmation = response.context["adminform"].form["confirmation"].value()
        # 確認したあとに、管理できるようになる機関管理者が増えた
        newcomer = get_user_model().objects.create(username="c@example.org", is_staff=True)
        self.univ_b.admins.add(newcomer)
        response = self.client.post(url, {"issuer": self.univ_b.pk, "confirmation": confirmation})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "c@example.org")
        self.assertEqual(IssuerMapping.objects.get(pk=self.map_a2.pk).issuer, self.univ_a)

    def test_unmapped_combination(self):
        unmapped = IssuerMapping.objects.create(issuer_name="C大学", issuer_url="https://lms.c.example.org")
        create_badge("c1", None, "C大学", "https://lms.c.example.org", self.category)
        self.login(self.overall)
        response = self.client.get(
            reverse("admin:chiloportal_issuermapping_changelist"), {"mapped": "no"}
        )
        self.assertEqual(list(response.context["cl"].result_list), [unmapped])
        # 担当機関のないバッジは、機関管理者には見えない
        self.login(self.admin_a)
        response = self.client.get(reverse("admin:chiloportal_wisdombadges_changelist"))
        self.assertNotIn("c1", {badge.name for badge in response.context["cl"].result_list})

    def test_blank_combination_matches_null_values(self):
        # 空の組み合わせは、古いデータで NULL のバッジにも当てる
        mapping = IssuerMapping.objects.create(issuer_name="", issuer_url="")
        badge = create_badge("blank", None, None, None, self.category)
        self.login(self.overall)
        url = self.change_url(mapping)
        response = self.client.post(url, {"issuer": self.univ_b.pk})
        self.assertContains(response, "バッジ 1 件")
        confirmation = response.context["adminform"].form["confirmation"].value()
        self.client.post(url, {"issuer": self.univ_b.pk, "confirmation": confirmation})
        self.assertEqual(WisdomBadges.objects.get(pk=badge.pk).issuer, self.univ_b)

    def test_mapping_with_badges_cannot_be_deleted(self):
        self.login(self.overall)
        response = self.client.get(reverse("admin:chiloportal_issuermapping_delete", args=[self.map_a1.pk]))
        self.assertEqual(response.status_code, 403)


class AdminSiteTest(TestCase):
    def test_group_page_is_hidden(self):
        self.assertFalse(django_admin.site.is_registered(Group))
