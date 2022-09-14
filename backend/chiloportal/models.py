#
# DBの内容からModelを生成するときは下記コマンドを実行し、models.py.txtの内容から不要なテーブル(djangoが生成するテーブル)を除外し、chiloportal/models.pyに転記してください。
#   python manage.py inspectdb > models.py.txt
#
# 以下転記の際に行ってください。
# ・models.ForeignKeyを同じクラス内で2つ以上使用している場合、related_nameに重複しないように名前を指定してください。（migrateの際にエラーとなるため）
# ・managedにFalseを入れているので、managed = True に変更してください。（単体テストでDBを作成したいため）
#
from django.db import models


class CategorisedBadges(models.Model):
    wisdom_badges = models.ForeignKey('WisdomBadges', models.DO_NOTHING, related_name='categorised_badges_wisdom_badges')
    cell = models.ForeignKey('Cell', models.DO_NOTHING, related_name='categorised_badges_cell')
    description = models.TextField()

    class Meta:
        managed = True
        db_table = 'categorised_badges'


class Category(models.Model):
    category1_name = models.CharField(max_length=128)
    category2_name = models.CharField(max_length=128)
    category3_name = models.CharField(max_length=128)
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'category'


class Cell(models.Model):
    target_occupations = models.ForeignKey('TargetOccupations', models.DO_NOTHING, related_name='cell_target_occupations')
    category = models.ForeignKey(Category, models.DO_NOTHING, related_name='cell_category')
    target_carrier_stage = models.ForeignKey('TargetCarrierStage', models.DO_NOTHING, related_name='cell_target_carrier_stage')
    description = models.TextField()

    class Meta:
        managed = True
        db_table = 'cell'


class Consumer(models.Model):
    name = models.CharField(max_length=256)
    url = models.TextField(blank=True, null=True)
    email = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'consumer'


class Criteria(models.Model):
    knowledge_badges = models.ForeignKey('KnowledgeBadges', models.DO_NOTHING, related_name='criteria_knowledge_badges')
    type = models.CharField(max_length=32)
    name = models.CharField(max_length=256)

    class Meta:
        managed = True
        db_table = 'criteria'


class Issuer(models.Model):
    name = models.CharField(max_length=256, blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    email = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'issuer'


class KnowledgeBadges(models.Model):
    wisdom_badges = models.ForeignKey('WisdomBadges', models.DO_NOTHING, related_name='knowledge_badges_wisdom_badges')
    badge_class_id = models.TextField()
    name = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    criteria_narrative = models.TextField(blank=True, null=True)
    image_id = models.TextField(blank=True, null=True)
    image_author = models.TextField(blank=True, null=True)
    version = models.TextField(blank=True, null=True)
    issuer = models.ForeignKey(Issuer, models.DO_NOTHING, blank=True, null=True, related_name='knowledge_badges_issuer')

    class Meta:
        managed = True
        db_table = 'knowledge_badges'


class PortalCategory(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'portal_category'


class TargetCarrierStage(models.Model):
    name = models.CharField(max_length=256)
    sub_name = models.TextField()
    description = models.TextField()
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'target_carrier_stage'


class TargetOccupations(models.Model):
    consumer = models.ForeignKey(Consumer, models.DO_NOTHING, related_name='target_occupations_consumer')
    name = models.CharField(max_length=256)
    description = models.TextField()
    supplementary = models.TextField()
    sort_key = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'target_occupations'


class WisdomBadges(models.Model):
    portal_category = models.ForeignKey(PortalCategory, models.DO_NOTHING, blank=True, null=True, related_name='wisdom_badges_portal_category')
    badge_class_id = models.TextField()
    name = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    criteria_narrative = models.TextField(blank=True, null=True)
    image_id = models.TextField(blank=True, null=True)
    image_author = models.TextField(blank=True, null=True)
    version = models.TextField(blank=True, null=True)
    issuer = models.ForeignKey(Issuer, models.DO_NOTHING, blank=True, null=True, related_name='wisdom_badges_issuer')
    alignments_targeturl = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'wisdom_badges'
