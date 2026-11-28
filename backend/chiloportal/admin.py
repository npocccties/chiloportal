#
# 管理画面
#
# 役割は2つ。
# ・全体管理者：Django の superuser。すべての操作ができる。
# ・機関管理者：スタッフのユーザーで、バッジ発行機関の「機関管理者」に指定された人。
#   担当機関のバッジだけを見て、公開・非表示とカテゴリを変えられる。
# ログインは学認（auth.py・admin_site.py）。管理ユーザーは eppn をユーザー名にして、パスワードなしで登録する。
#
from django import forms
from django.contrib import admin, messages
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth import admin as auth_admin  # noqa: F401  先に読み込んで、ユーザー・グループの画面を登録させる
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core import signing
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.db.models import Count, F, Q
from django.shortcuts import redirect

from . import models

# 権限はグループではなく役割（全体管理者・機関管理者）で分けるので、グループの画面は出さない
admin.site.unregister(Group)


from django.utils.html import format_html


def is_overall_admin(user):
    return user.is_active and user.is_superuser


def is_issuer_admin(user):
    return user.is_active and user.is_staff and not user.is_superuser


class OverallAdminOnly(admin.ModelAdmin):
    """全体管理者だけが使う画面。"""

    def has_module_permission(self, request):
        return is_overall_admin(request.user)

    def has_view_permission(self, request, obj=None):
        return is_overall_admin(request.user)

    def has_add_permission(self, request):
        return is_overall_admin(request.user)

    def has_change_permission(self, request, obj=None):
        return is_overall_admin(request.user)

    def has_delete_permission(self, request, obj=None):
        return is_overall_admin(request.user)


class IssuerScoped(admin.ModelAdmin):
    """機関管理者には、担当機関のデータだけを見せる画面。"""

    # 担当機関をたどる経路（例：wisdom_badges__issuer）
    issuer_path = "issuer"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if is_overall_admin(request.user):
            return queryset
        return queryset.filter(**{f"{self.issuer_path}__admins": request.user}).distinct()

    def in_scope(self, request, obj):
        if obj is None or is_overall_admin(request.user):
            return True
        return self.get_queryset(request).filter(pk=obj.pk).exists()

    def has_module_permission(self, request):
        return is_overall_admin(request.user) or is_issuer_admin(request.user)

    def has_view_permission(self, request, obj=None):
        return self.has_module_permission(request) and self.in_scope(request, obj)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# ---------------------------------------------------------------------------
# バッジ
# ---------------------------------------------------------------------------


class UnmappedFilter(admin.SimpleListFilter):
    title = "担当機関"
    parameter_name = "unmapped"

    def lookups(self, request, model_admin):
        return [("yes", "決まっていない"), ("no", "決まっている")]

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(issuer__isnull=True)
        if self.value() == "no":
            return queryset.filter(issuer__isnull=False)
        return queryset


def locked(queryset):
    """一覧で選んだバッジを、更新のためにロックして取り直す（一覧の絞り込みは DISTINCT を含むことがある）。"""
    return models.WisdomBadges.objects.filter(pk__in=queryset.values("pk")).order_by("pk").select_for_update()


class KnowledgeBadgesInline(admin.TabularInline):
    model = models.KnowledgeBadges
    fk_name = "wisdom_badges"
    fields = ["name", "badge_class_id"]
    readonly_fields = fields
    extra = 0
    can_delete = False
    show_change_link = True
    verbose_name_plural = "スタンプ（Moodle の順番）"

    def get_queryset(self, request):
        return super().get_queryset(request).order_by("pk")

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


class WisdomBadgesForm(forms.ModelForm):
    class Meta:
        model = models.WisdomBadges
        fields = ["status", "portal_category", "labels", "new_dismissed", "display_image"]
        widgets = {"labels": forms.CheckboxSelectMultiple}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        status = self.fields.get("status")
        if status is None:
            return
        if self.instance.status == models.WisdomBadges.Status.AUTO_HIDDEN:
            # Moodle で無効・削除されたバッジは、Moodle で有効にして取り込み直すまで公開できない
            status.disabled = True
            status.help_text = "Moodle で無効・削除されているため、ここでは変えられません。Moodle で有効にしてから取り込み直してください。"
        else:
            # 「自動で非表示」は Moodle との連携だけが設定する。手で選べるのは公開と非表示
            status.choices = [c for c in status.choices if c[0] != models.WisdomBadges.Status.AUTO_HIDDEN]


@admin.register(models.WisdomBadges)
class WisdomBadgesAdmin(IssuerScoped):
    form = WisdomBadgesForm
    # Moodle から取り込む項目は、ポータルでは書き換えない（Moodle で直して取り込み直す）
    moodle_fields = [
        "name",
        "description",
        "tags",
        "image_id",
        "image_author",
        "version",
        "badge_class_id",
        "alignments_targetname",
        "alignments_targeturl",
        "issuer_name",
        "issuer_url",
    ]
    fieldsets = [
        (
            "ポータルでの掲載",
            {"fields": ["status", "portal_category", "labels", "new_dismissed", "issuer", "published_at"]},
        ),
        (
            "表示用の画像（取り込み直しても変わらない）",
            {"fields": ["image_preview", "display_image"]},
        ),
        ("Moodle から取り込んだ内容", {"fields": moodle_fields}),
    ]
    readonly_fields = ["issuer", "published_at", "image_preview", *moodle_fields]
    list_display = ["name", "status", "portal_category", "label_names", "issuer", "published_at", "issuer_name"]
    list_display_links = ["name"]
    list_filter = ["status", UnmappedFilter, "issuer", "portal_category", "labels"]
    list_select_related = ["issuer", "portal_category"]
    search_fields = ["name", "description", "tags", "alignments_targetname", "issuer_name", "issuer_url", "badge_class_id"]
    ordering = ["-pk"]
    actions = ["publish", "hide"]
    inlines = [KnowledgeBadgesInline]
    list_per_page = 50

    def has_change_permission(self, request, obj=None):
        return self.has_view_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        # 不要になったバッジは削除せず、ポータル非表示にする
        return False

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("labels")

    @admin.display(description="ラベル")
    def label_names(self, obj):
        return "、".join(label.name for label in obj.labels.all())

    @admin.display(description="ポータルで表示する画像")
    def image_preview(self, obj):
        if obj.display_image:
            return format_html(
                '<img src="{}" alt="" style="max-width:160px;max-height:160px"><br>表示用の画像を表示しています。',
                obj.display_image.url,
            )
        if obj.image_id:
            return format_html(
                '<img src="/images/{}" alt="" style="max-width:160px;max-height:160px"><br>Moodle から取り込んだ画像を表示しています。',
                obj.image_id,
            )
        return "（画像なし）"

    def get_list_filter(self, request):
        if is_overall_admin(request.user):
            return self.list_filter
        return ["status", "portal_category"]

    @admin.action(description="選んだバッジを公開する")
    def publish(self, request, queryset):
        published, skipped, disabled = 0, [], []
        with transaction.atomic():
            for badge in locked(queryset):
                if badge.status == models.WisdomBadges.Status.PUBLISHED:
                    continue
                if badge.status == models.WisdomBadges.Status.AUTO_HIDDEN:
                    disabled.append(badge.name)
                    continue
                if badge.portal_category_id is None:
                    skipped.append(badge.name)
                    continue
                badge.status = models.WisdomBadges.Status.PUBLISHED
                badge.save(update_fields=["status"])
                self.log_change(request, badge, "公開にしました。")
                published += 1
        if published:
            self.message_user(request, f"{published} 件のバッジを公開しました。", messages.SUCCESS)
        if skipped:
            self.message_user(
                request,
                f"カテゴリが設定されていないので、次の {len(skipped)} 件は公開していません：" + "、".join(skipped),
                messages.WARNING,
            )
        if disabled:
            self.message_user(
                request,
                f"Moodle で無効・削除されているので、次の {len(disabled)} 件は公開していません：" + "、".join(disabled),
                messages.WARNING,
            )

    @admin.action(description="選んだバッジをポータル非表示にする")
    def hide(self, request, queryset):
        hidden = 0
        with transaction.atomic():
            for badge in locked(queryset):
                if badge.status != models.WisdomBadges.Status.PUBLISHED:
                    continue
                badge.status = models.WisdomBadges.Status.HIDDEN
                badge.save(update_fields=["status"])
                self.log_change(request, badge, "ポータル非表示にしました。")
                hidden += 1
        self.message_user(request, f"{hidden} 件のバッジをポータル非表示にしました。", messages.SUCCESS)


@admin.register(models.KnowledgeBadges)
class KnowledgeBadgesAdmin(IssuerScoped):
    issuer_path = "wisdom_badges__issuer"
    list_display = ["name", "wisdom_badges", "issuer_name"]
    list_select_related = ["wisdom_badges"]
    search_fields = ["name", "description", "tags", "wisdom_badges__name", "badge_class_id"]
    ordering = ["-pk"]

    def has_change_permission(self, request, obj=None):
        # 中身はすべて Moodle から取り込むので、見るだけにする
        return False


@admin.register(models.Criteria)
class CriteriaAdmin(OverallAdminOnly):
    list_display = ["name", "type", "knowledge_badges", "sort_key"]
    list_select_related = ["knowledge_badges"]
    search_fields = ["name", "knowledge_badges__name"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# ---------------------------------------------------------------------------
# バッジ発行機関と、issuer.name・issuer.url の組み合わせの対応
# ---------------------------------------------------------------------------


class IssuerMappingInline(admin.TabularInline):
    model = models.IssuerMapping
    fields = ["issuer_name", "issuer_url", "created_at"]
    readonly_fields = fields
    extra = 0
    can_delete = False
    show_change_link = True
    verbose_name_plural = "対応づけた issuer.name と issuer.url の組み合わせ"

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(models.Issuer)
class IssuerAdmin(OverallAdminOnly):
    list_display = ["name", "url", "admin_names", "mapping_count", "badge_count"]
    search_fields = ["name", "url", "email", "mappings__issuer_name", "mappings__issuer_url"]
    filter_horizontal = ["admins"]
    inlines = [IssuerMappingInline]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(
                _mapping_count=Count("mappings", distinct=True),
                _badge_count=Count("wisdom_badges_issuer", distinct=True),
            )
            .prefetch_related("admins")
        )

    @admin.display(description="機関管理者")
    def admin_names(self, obj):
        return "、".join(user.get_username() for user in obj.admins.all())

    @admin.display(description="組み合わせの数", ordering="_mapping_count")
    def mapping_count(self, obj):
        return obj._mapping_count

    @admin.display(description="バッジの数", ordering="_badge_count")
    def badge_count(self, obj):
        return obj._badge_count

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "admins":
            from django.contrib.auth import get_user_model

            # 全体管理者はすべての機関を操作できるので、選択肢には出さない
            kwargs["queryset"] = get_user_model().objects.filter(is_staff=True, is_superuser=False).order_by("username")
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class MappingUnmappedFilter(admin.SimpleListFilter):
    title = "対応づけ"
    parameter_name = "mapped"

    def lookups(self, request, model_admin):
        return [("no", "まだ対応づけていない"), ("yes", "対応づけ済み")]

    def queryset(self, request, queryset):
        if self.value() == "no":
            return queryset.filter(issuer__isnull=True)
        if self.value() == "yes":
            return queryset.filter(issuer__isnull=False)
        return queryset


def combination_filter(issuer_name, issuer_url):
    """組み合わせに当たるバッジの条件。空の値は "" と NULL のどちらでも当てる（古いデータに NULL が残っていても漏らさない）。"""

    def field(name, value):
        condition = Q(**{name: value})
        return condition | Q(**{f"{name}__isnull": True}) if value == "" else condition

    return field("issuer_name", issuer_name) & field("issuer_url", issuer_url)


def badges_of_mapping(mapping):
    return models.WisdomBadges.objects.filter(combination_filter(mapping.issuer_name, mapping.issuer_url))


class IssuerMappingForm(forms.ModelForm):
    # 確認の画面を出したときの内容（署名付き）。もう一度保存したときに、同じ内容かを照合する
    confirmation = forms.CharField(required=False, widget=forms.HiddenInput)

    CONFIRMATION_SALT = "chiloportal.issuer-mapping-confirmation"
    CONFIRMATION_MAX_AGE = 60 * 60

    class Meta:
        model = models.IssuerMapping
        fields = ["issuer_name", "issuer_url", "issuer"]

    def clean(self):
        cleaned = super().clean()
        if self.instance.pk is None or "issuer" not in self.changed_data:
            return cleaned
        new_issuer = cleaned.get("issuer")
        badges = badges_of_mapping(self.instance).exclude(issuer=new_issuer)
        count = badges.count()
        if count == 0:
            return cleaned
        names = [user.get_username() for user in new_issuer.admins.order_by("username")] if new_issuer else []
        published = badges.filter(status=models.WisdomBadges.Status.PUBLISHED).count()
        summary = [self.instance.pk, new_issuer.pk if new_issuer else None, count, published, names]
        try:
            confirmed = signing.loads(
                cleaned.get("confirmation") or "", salt=self.CONFIRMATION_SALT, max_age=self.CONFIRMATION_MAX_AGE
            )
        except signing.BadSignature:
            confirmed = None
        if confirmed == summary:
            return cleaned
        # 確認の画面を出す。表示した内容を署名して持たせ、もう一度保存したときに照合する
        self.data = self.data.copy()
        self.data[self.add_prefix("confirmation")] = signing.dumps(summary, salt=self.CONFIRMATION_SALT)
        if new_issuer is None:
            who = "担当機関が決まっていない状態になり、全体管理者だけが管理します。"
        else:
            who = (
                f"「{new_issuer}」の担当になり、次の機関管理者が管理できるようになります："
                + ("、".join(names) if names else "（機関管理者がいません）")
                + "。"
            )
        raise forms.ValidationError(
            f"この組み合わせのバッジ {count} 件が、{who}"
            f"公開中の {published} 件はポータル非表示に戻り、新しい担当機関の公開待ちになります。"
            "よければ、もう一度「保存」を押してください。"
        )


@admin.register(models.IssuerMapping)
class IssuerMappingAdmin(OverallAdminOnly):
    form = IssuerMappingForm
    list_display = ["issuer_name", "issuer_url", "issuer", "badge_count", "created_at"]
    list_filter = [MappingUnmappedFilter, "issuer"]
    list_select_related = ["issuer"]
    search_fields = ["issuer_name", "issuer_url", "issuer__name"]
    # まだ対応づけていない組み合わせを先に出す
    ordering = [F("issuer").asc(nulls_first=True), "issuer_name", "issuer_url"]

    def get_fields(self, request, obj=None):
        fields = ["issuer_name", "issuer_url", "issuer"]
        if obj is not None:
            fields.append("confirmation")
        return fields

    def get_readonly_fields(self, request, obj=None):
        # 組み合わせそのものは、取り込んだバッジの値なので変えない
        return ["issuer_name", "issuer_url"] if obj is not None else []

    @admin.display(description="バッジの数")
    def badge_count(self, obj):
        return badges_of_mapping(obj).count()

    def has_delete_permission(self, request, obj=None):
        if obj is not None and badges_of_mapping(obj).exists():
            return False
        return super().has_delete_permission(request, obj)

    def save_model(self, request, obj, form, change):
        with transaction.atomic():
            super().save_model(request, obj, form, change)
            if change and "issuer" in form.changed_data:
                moved = reassign_badges(obj)
                if moved:
                    self.message_user(
                        request,
                        f"バッジ {moved} 件の担当機関を「{obj.issuer or '決まっていない'}」に変え、ポータル非表示にしました。",
                        messages.SUCCESS,
                    )

    def construct_change_message(self, request, form, formsets, add=False):
        message = super().construct_change_message(request, form, formsets, add)
        if not add and "issuer" in form.changed_data:
            before = form.initial.get("issuer")
            before = models.Issuer.objects.filter(pk=before).first() if before else None
            message.append(
                {"changed": {"fields": [f"バッジ発行機関（{before or 'なし'} → {form.instance.issuer or 'なし'}）"]}}
            )
        return message


def reassign_badges(mapping):
    """組み合わせの対応づけを変えたときに、その組み合わせのバッジの担当機関を付け替え、非表示に戻す。"""
    moved = 0
    for badge in badges_of_mapping(mapping).exclude(issuer=mapping.issuer).select_for_update():
        badge.issuer = mapping.issuer
        if badge.status == models.WisdomBadges.Status.PUBLISHED:
            badge.status = models.WisdomBadges.Status.HIDDEN
        badge.save(update_fields=["issuer", "status"])
        moved += 1
    models.KnowledgeBadges.objects.filter(
        combination_filter(mapping.issuer_name, mapping.issuer_url)
    ).exclude(issuer=mapping.issuer).update(issuer=mapping.issuer)
    return moved


# ---------------------------------------------------------------------------
# マスタ（全体管理者だけ）
# ---------------------------------------------------------------------------


@admin.register(models.Label)
class LabelAdmin(OverallAdminOnly):
    list_display = ["name", "sample", "color", "sort_key", "badge_count"]
    list_editable = ["color", "sort_key"]
    search_fields = ["name"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_badge_count=Count("badges"))

    @admin.display(description="見え方")
    def sample(self, obj):
        return format_html(
            '<span class="chiloportal-label chiloportal-label--{}">{}</span>', obj.color, obj.name
        )

    @admin.display(description="付けているバッジの数", ordering="_badge_count")
    def badge_count(self, obj):
        return obj._badge_count

    class Media:
        css = {"all": ["chiloportal/admin.css"]}


@admin.register(models.PortalSettings)
class PortalSettingsAdmin(OverallAdminOnly):
    fields = ["new_badge_days", "default_sort"]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # 1件だけなので、一覧を出さずに設定の画面を開く
        if not self.has_view_permission(request):
            raise PermissionDenied
        settings = models.PortalSettings.load()
        return redirect("admin:chiloportal_portalsettings_change", settings.pk)


@admin.register(models.PortalCategory)
class PortalCategoryAdmin(OverallAdminOnly):
    list_display = ["name", "sort_key", "badge_count"]
    list_editable = ["sort_key"]
    ordering = ["sort_key"]
    search_fields = ["name", "description"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_badge_count=Count("wisdom_badges_portal_category"))

    @admin.display(description="バッジの数", ordering="_badge_count")
    def badge_count(self, obj):
        return obj._badge_count


@admin.register(models.Consumer)
class ConsumerAdmin(OverallAdminOnly):
    list_display = ["name", "url", "email"]
    search_fields = ["name", "url"]


@admin.register(models.Framework)
class FrameworkAdmin(OverallAdminOnly):
    list_display = ["name", "consumer", "sort_key"]
    list_filter = ["consumer"]
    list_select_related = ["consumer"]
    search_fields = ["name", "description"]
    ordering = ["consumer", "sort_key"]


@admin.register(models.Stage)
class StageAdmin(OverallAdminOnly):
    list_display = ["name", "sub_name", "sort_key"]
    search_fields = ["name", "sub_name"]
    ordering = ["sort_key"]
    exclude = ["password"]


@admin.register(models.Field)
class FieldAdmin(OverallAdminOnly):
    list_display = ["field1_name", "field2_name", "field3_name", "sort_key"]
    search_fields = ["field1_name", "field2_name", "field3_name"]
    ordering = ["sort_key"]


@admin.register(models.Goal)
class GoalAdmin(OverallAdminOnly):
    list_display = ["__str__", "framework", "stage", "field"]
    list_filter = ["framework", "stage"]
    list_select_related = ["framework", "stage", "field"]
    search_fields = ["description"]


@admin.register(models.CategorisedBadges)
class CategorisedBadgesAdmin(OverallAdminOnly):
    list_display = ["goal", "wisdom_badges"]
    list_select_related = ["goal", "wisdom_badges"]
    search_fields = ["wisdom_badges__name", "goal__description"]
    autocomplete_fields = ["wisdom_badges"]


# ---------------------------------------------------------------------------
# 管理ユーザー（全体管理者だけ）
# ---------------------------------------------------------------------------

User = get_user_model()
admin.site.unregister(User)


class AdminUserForm(forms.ModelForm):
    issuers = forms.ModelMultipleChoiceField(
        queryset=models.Issuer.objects.order_by("name"),
        required=False,
        label="担当機関",
        widget=FilteredSelectMultiple("担当機関", is_stacked=False),
        help_text="機関管理者が操作できるバッジ発行機関。全体管理者は、指定しなくてもすべての機関を操作できる。",
    )

    class Meta:
        model = User
        fields = ["username", "first_name", "is_active", "is_superuser"]
        labels = {
            "username": "eppn",
            "first_name": "表示名",
            "is_active": "有効",
            "is_superuser": "全体管理者",
        }
        help_texts = {
            "username": "学認の eppn（例：user@example.ac.jp）。この eppn で学認にログインした人が、管理画面を使えるようになる。",
            "first_name": "学認でログインしたときに、学認の表示名で上書きされる。",
            "is_active": "外すと、管理画面を使えなくなる（停止）。",
            "is_superuser": "すべての機関とポータル全体の設定を操作できる。外すと機関管理者になり、担当機関だけを操作できる。",
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields["issuers"].initial = self.instance.assigned_issuers.all()


class RoleFilter(admin.SimpleListFilter):
    title = "役割"
    parameter_name = "role"

    def lookups(self, request, model_admin):
        return [("overall", "全体管理者"), ("issuer", "機関管理者")]

    def queryset(self, request, queryset):
        if self.value() == "overall":
            return queryset.filter(is_superuser=True)
        if self.value() == "issuer":
            return queryset.filter(is_superuser=False)
        return queryset


@admin.register(User)
class AdminUserAdmin(OverallAdminOnly):
    form = AdminUserForm
    fields = ["username", "first_name", "is_active", "is_superuser", "issuers", "last_login"]
    readonly_fields = ["last_login"]
    list_display = ["username", "display_name", "role", "is_active", "issuer_names", "last_login"]
    list_filter = [RoleFilter, "is_active"]
    search_fields = ["username", "first_name", "assigned_issuers__name"]
    ordering = ["username"]

    def get_queryset(self, request):
        # 管理画面のユーザーだけを出す
        return super().get_queryset(request).filter(is_staff=True).prefetch_related("assigned_issuers")

    @admin.display(description="表示名", ordering="first_name")
    def display_name(self, obj):
        return obj.first_name

    @admin.display(description="役割", ordering="is_superuser")
    def role(self, obj):
        return "全体管理者" if obj.is_superuser else "機関管理者"

    @admin.display(description="担当機関")
    def issuer_names(self, obj):
        return "、".join(str(issuer) for issuer in obj.assigned_issuers.all())

    def save_model(self, request, obj, form, change):
        obj.is_staff = True
        if not change:
            # パスワードでのログインはしない
            obj.set_unusable_password()
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.assigned_issuers.set(form.cleaned_data["issuers"])
