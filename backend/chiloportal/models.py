#
# DBの内容からModelを生成するときは下記コマンドを実行し、models.py.txtの内容から不要なテーブル(djangoが生成する)を除外し、chiloportal/models.pyに転記してください。
#   python manage.py inspectdb > chiloportal/models.py.txt
#
# 注意事項：
# ・models.pyのrelated_nameはそのままにしておいてください。（クエリで使用しているため）
# ・models.pyのmanaged = True はそのままにしておいてください。（テストで動的にテーブル作成するため）
#
from django.db import models


class CategorisedBadges(models.Model):
    wisdom_badges = models.ForeignKey(
        "WisdomBadges",
        models.DO_NOTHING,
        related_name="categorised_badges_wisdom_badges",
    )
    goal = models.ForeignKey(
        "Goal", models.DO_NOTHING, related_name="categorised_badges_goal"
    )
    description = models.TextField()

    class Meta:
        managed = True
        db_table = "categorised_badges"


class Field(models.Model):
    field1_name = models.CharField(max_length=128)
    field2_name = models.CharField(max_length=128)
    field3_name = models.CharField(max_length=128)
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = "field"


class Goal(models.Model):
    framework = models.ForeignKey(
        "Framework", models.DO_NOTHING, related_name="goal_framework"
    )
    field = models.ForeignKey(Field, models.DO_NOTHING, related_name="goal_field")
    stage = models.ForeignKey("Stage", models.DO_NOTHING, related_name="goal_stage")
    description = models.TextField()

    class Meta:
        managed = True
        db_table = "goal"


class Consumer(models.Model):
    name = models.CharField(max_length=256)
    url = models.TextField(blank=True, null=True)
    email = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "consumer"


class Criteria(models.Model):
    knowledge_badges = models.ForeignKey(
        "KnowledgeBadges", models.DO_NOTHING, related_name="criteria_knowledge_badges"
    )
    type = models.CharField(max_length=32)
    name = models.CharField(max_length=256)
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = "criteria"


class Issuer(models.Model):
    name = models.CharField(max_length=256, blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    email = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "issuer"


class KnowledgeBadges(models.Model):
    wisdom_badges = models.ForeignKey(
        "WisdomBadges", models.DO_NOTHING, related_name="knowledge_badges_wisdom_badges"
    )
    badge_class_id = models.TextField()
    name = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    criteria_narrative = models.TextField(blank=True, null=True)
    image_id = models.TextField(blank=True, null=True)
    image_author = models.TextField(blank=True, null=True)
    version = models.TextField(blank=True, null=True)
    issuer = models.ForeignKey(
        Issuer,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="knowledge_badges_issuer",
    )

    class Meta:
        managed = True
        db_table = "knowledge_badges"


class PortalCategory(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    image_url_path = models.TextField(blank=True, null=True)
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = "portal_category"


class Stage(models.Model):
    name = models.CharField(max_length=256)
    sub_name = models.TextField()
    description = models.TextField()
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = "stage"


class Framework(models.Model):
    consumer = models.ForeignKey(
        Consumer, models.DO_NOTHING, related_name="framework_consumer"
    )
    name = models.CharField(max_length=256)
    description = models.TextField()
    supplementary = models.TextField()
    url = models.TextField()
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = "framework"


class WisdomBadges(models.Model):
    portal_category = models.ForeignKey(
        PortalCategory,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="wisdom_badges_portal_category",
    )
    badge_class_id = models.TextField()
    name = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    image_id = models.TextField(blank=True, null=True)
    image_author = models.TextField(blank=True, null=True)
    version = models.TextField(blank=True, null=True)
    issuer = models.ForeignKey(
        Issuer,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="wisdom_badges_issuer",
    )
    alignments_targetname = models.TextField(blank=True, null=True)
    alignments_targeturl = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "wisdom_badges"
