#
# テーブルの定義はマイグレーション（chiloportal/migrations/）で管理する。
# モデルを変えたら python manage.py makemigrations chiloportal でマイグレーションを作り、一緒にコミットしてください。
# 既存の本番の表（create_table.sql で作成）に合わせるため、ID は integer（apps.py の AutoField）にし、
# 外部キーの列には索引を作らない（db_index=False）。索引を足すときは、マイグレーションで明示的に足す。
#
# 注意事項：
# ・models.pyのrelated_nameはそのままにしておいてください。（クエリで使用しているため）
# ・models.pyのmanaged = True はそのままにしておいてください。（テストで動的にテーブル作成するため）
# ・外部キーは PROTECT にする。紐づくデータがあるものは削除できず、管理画面に理由が出る。
#
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from . import revalidate


class CategorisedBadges(models.Model):
    wisdom_badges = models.ForeignKey(
        "WisdomBadges",
        models.PROTECT,
        db_index=False,
        related_name="categorised_badges_wisdom_badges",
        verbose_name="バッジ",
    )
    goal = models.ForeignKey(
        "Goal",
        models.PROTECT,
        db_index=False,
        related_name="categorised_badges_goal",
        verbose_name="目標",
    )
    description = models.TextField("説明", blank=True, null=True)

    class Meta:
        managed = True
        db_table = "categorised_badges"
        verbose_name = "目標とバッジの対応"
        verbose_name_plural = "目標とバッジの対応"

    def __str__(self):
        return f"{self.goal} - {self.wisdom_badges}"


class Field(models.Model):
    field1_name = models.CharField("指標項目（大）", max_length=128)
    field2_name = models.CharField("指標項目（中）", max_length=128)
    field3_name = models.CharField("指標項目（小）", max_length=128)
    sort_key = models.IntegerField("表示順")

    class Meta:
        managed = True
        db_table = "field"
        verbose_name = "指標項目"
        verbose_name_plural = "指標項目"

    def __str__(self):
        return " / ".join(n for n in [self.field1_name, self.field2_name, self.field3_name] if n)


class Goal(models.Model):
    framework = models.ForeignKey(
        "Framework",
        models.PROTECT,
        db_index=False,
        related_name="goal_framework",
        verbose_name="教員育成指標",
    )
    field = models.ForeignKey(
        Field,
        models.PROTECT,
        db_index=False,
        related_name="goal_field",
        verbose_name="指標項目",
    )
    stage = models.ForeignKey(
        "Stage",
        models.PROTECT,
        db_index=False,
        related_name="goal_stage",
        verbose_name="成長段階",
    )
    description = models.TextField("説明")

    class Meta:
        managed = True
        db_table = "goal"
        verbose_name = "目標"
        verbose_name_plural = "目標"

    def __str__(self):
        return self.description[:40]


class Consumer(models.Model):
    name = models.CharField("名前", max_length=256)
    url = models.TextField("URL", blank=True, null=True)
    email = models.CharField("メールアドレス", max_length=256, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "consumer"
        verbose_name = "教育委員会"
        verbose_name_plural = "教育委員会"

    def __str__(self):
        return self.name


class Criteria(models.Model):
    knowledge_badges = models.ForeignKey(
        "KnowledgeBadges",
        models.PROTECT,
        db_index=False,
        related_name="criteria_knowledge_badges",
        verbose_name="スタンプ",
    )
    type = models.CharField("種類", max_length=32)
    name = models.CharField("名前", max_length=256)
    sort_key = models.IntegerField("表示順")

    class Meta:
        managed = True
        db_table = "criteria"
        verbose_name = "クライテリア"
        verbose_name_plural = "クライテリア"

    def __str__(self):
        return self.name


class Issuer(models.Model):
    """バッジ発行機関。ポータルに登録し、専用ページを持つ機関。"""

    name = models.CharField("名前", max_length=256, blank=True, null=True)
    url = models.TextField("URL", blank=True, null=True)
    email = models.TextField("連絡先", blank=True, null=True)
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="assigned_issuers",
        verbose_name="機関管理者",
        help_text="この機関を担当する管理者。1人が複数の機関を担当でき、1つの機関に複数の管理者を置ける。",
    )

    class Meta:
        managed = True
        db_table = "issuer"
        verbose_name = "バッジ発行機関"
        verbose_name_plural = "バッジ発行機関"

    def __str__(self):
        return self.name or f"（名前なし #{self.id}）"


class IssuerMapping(models.Model):
    """バッジの issuer.name と issuer.url の組み合わせと、バッジ発行機関の対応。"""

    issuer_name = models.TextField("issuer.name")
    issuer_url = models.TextField("issuer.url")
    issuer = models.ForeignKey(
        Issuer,
        models.PROTECT,
        blank=True,
        null=True,
        related_name="mappings",
        verbose_name="バッジ発行機関",
        help_text="空のときは、まだ対応づけていない組み合わせ。この組み合わせのバッジは全体管理者が管理する。",
    )
    created_at = models.DateTimeField("最初に取り込んだ日時", auto_now_add=True)

    class Meta:
        managed = True
        db_table = "issuer_mapping"
        verbose_name = "組み合わせ（issuer.name と issuer.url）"
        verbose_name_plural = "組み合わせ（issuer.name と issuer.url）"
        constraints = [
            models.UniqueConstraint(
                fields=["issuer_name", "issuer_url"], name="issuer_mapping_unique"
            )
        ]

    def __str__(self):
        return f"{self.issuer_name}＠{self.issuer_url}"


class KnowledgeBadges(models.Model):
    wisdom_badges = models.ForeignKey(
        "WisdomBadges",
        models.PROTECT,
        db_index=False,
        related_name="knowledge_badges_wisdom_badges",
        verbose_name="バッジ",
    )
    badge_class_id = models.TextField("バッジクラスの ID")
    name = models.CharField("名前", max_length=512)
    description = models.TextField("説明", blank=True, null=True)
    tags = models.TextField("タグ", blank=True, null=True)
    criteria_narrative = models.TextField("クライテリア（原文）", blank=True, null=True)
    image_id = models.TextField("画像", blank=True, null=True)
    image_author = models.TextField("画像の作者", blank=True, null=True)
    version = models.TextField("版", blank=True, null=True)
    issuer = models.ForeignKey(
        Issuer,
        models.PROTECT,
        db_index=False,
        blank=True,
        null=True,
        related_name="knowledge_badges_issuer",
        verbose_name="バッジ発行機関",
    )
    issuer_name = models.TextField("issuer.name", blank=True, null=True)
    issuer_url = models.TextField("issuer.url", blank=True, null=True)

    class Meta:
        managed = True
        db_table = "knowledge_badges"
        verbose_name = "スタンプ"
        verbose_name_plural = "スタンプ"

    def __str__(self):
        return self.name


class PortalCategory(models.Model):
    name = models.CharField("名前", max_length=128)
    description = models.TextField("説明", blank=True, null=True)
    image_url_path = models.TextField("画像のパス", blank=True, null=True)
    sort_key = models.IntegerField(
        "表示順", blank=True, help_text="小さい順に表示する。空のまま保存すると末尾の番号が入る。"
    )

    class Meta:
        managed = True
        db_table = "portal_category"
        verbose_name = "カテゴリ"
        verbose_name_plural = "カテゴリ"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.sort_key is None:
            last = PortalCategory.objects.aggregate(models.Max("sort_key"))["sort_key__max"]
            self.sort_key = (last or 0) + 1
        super().save(*args, **kwargs)


class Stage(models.Model):
    name = models.CharField("名前", max_length=256)
    sub_name = models.TextField("副題", blank=True, null=True)
    description = models.TextField("説明", blank=True, null=True)
    sort_key = models.IntegerField("表示順")
    password = models.TextField("パスワード（ハッシュ）", blank=True, null=True)

    class Meta:
        managed = True
        db_table = "stage"
        verbose_name = "成長段階"
        verbose_name_plural = "成長段階"

    def __str__(self):
        return self.name


class Framework(models.Model):
    consumer = models.ForeignKey(
        Consumer,
        models.PROTECT,
        db_index=False,
        related_name="framework_consumer",
        verbose_name="教育委員会",
    )
    name = models.CharField("名前", max_length=256)
    description = models.TextField("説明", blank=True, null=True)
    supplementary = models.TextField("補足", blank=True, null=True)
    url = models.TextField("URL")
    sort_key = models.IntegerField("表示順")

    class Meta:
        managed = True
        db_table = "framework"
        verbose_name = "教員育成指標"
        verbose_name_plural = "教員育成指標"

    def __str__(self):
        return self.name


class WisdomBadges(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = "published", "公開"
        HIDDEN = "hidden", "ポータル非表示"
        AUTO_HIDDEN = "auto_hidden", "ポータル非表示（Moodle で無効・削除）"

    portal_category = models.ForeignKey(
        PortalCategory,
        models.PROTECT,
        db_index=False,
        blank=True,
        null=True,
        related_name="wisdom_badges_portal_category",
        verbose_name="カテゴリ",
    )
    badge_class_id = models.TextField("バッジクラスの ID")
    name = models.CharField("名前", max_length=512)
    description = models.TextField("説明", blank=True, null=True)
    tags = models.TextField("タグ", blank=True, null=True)
    image_id = models.TextField("画像", blank=True, null=True)
    image_author = models.TextField("画像の作者", blank=True, null=True)
    version = models.TextField("版", blank=True, null=True)
    issuer = models.ForeignKey(
        Issuer,
        models.PROTECT,
        db_index=False,
        blank=True,
        null=True,
        related_name="wisdom_badges_issuer",
        verbose_name="バッジ発行機関",
        help_text="issuer.name と issuer.url の組み合わせの対応から自動で決まる。",
    )
    issuer_name = models.TextField("issuer.name", blank=True, null=True)
    issuer_url = models.TextField("issuer.url", blank=True, null=True)
    alignments_targetname = models.TextField("コース名")
    alignments_targeturl = models.TextField("コースの URL")
    status = models.CharField(
        "公開状態",
        max_length=16,
        choices=Status.choices,
        default=Status.HIDDEN,
    )
    published_at = models.DateTimeField("公開した日時", blank=True, null=True)

    class Meta:
        managed = True
        db_table = "wisdom_badges"
        verbose_name = "バッジ"
        verbose_name_plural = "バッジ"

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if self.status == self.Status.PUBLISHED and self.portal_category_id is None:
            raise ValidationError({"status": "カテゴリを設定しないと公開できません。"})
        if self.status == self.Status.PUBLISHED and getattr(self, "_loaded_status", None) == self.Status.AUTO_HIDDEN:
            raise ValidationError(
                {"status": "Moodle で無効・削除されているため公開できません。Moodle で有効にしてから取り込み直してください。"}
            )

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        # 読み込んだ時点の公開状態。公開に切り替わったかどうかを save で判定する
        instance._loaded_status = instance.__dict__.get("status")
        instance._loaded_issuer_id = instance.__dict__.get("issuer_id")
        return instance

    def save(self, *args, **kwargs):
        # 非表示から公開に切り替えたときに、最初に公開した日時を記録する（NEW の表示に使う）。
        # すでに公開中のバッジを保存しても記録しないので、公開日が分からない既存のバッジは空のまま。
        loaded_status = getattr(self, "_loaded_status", None)
        if (
            self.status == self.Status.PUBLISHED
            and loaded_status != self.Status.PUBLISHED
            and self.published_at is None
        ):
            self.published_at = timezone.now()
            update_fields = kwargs.get("update_fields")
            if update_fields is not None:
                kwargs["update_fields"] = {*update_fields, "published_at"}
        super().save(*args, **kwargs)
        # 機関ページのバッジの数が変わるので、前と今の担当機関のページを作り直す
        revalidate.request(getattr(self, "_loaded_issuer_id", None), self.issuer_id)
        self._loaded_status = self.status
        self._loaded_issuer_id = self.issuer_id
