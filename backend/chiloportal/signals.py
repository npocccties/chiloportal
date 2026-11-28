#
# 保存・削除したときに、ポータルのページの作り直しを予約する（revalidate.py）。
# バッジの保存は models.WisdomBadges.save で扱う（前の担当機関も分かるため）。
#
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from . import revalidate
from .models import Issuer, PortalCategory, WisdomBadges


@receiver(post_delete, sender=WisdomBadges)
def wisdom_badge_deleted(sender, instance, **kwargs):
    revalidate.request(instance.issuer_id)


@receiver([post_save, post_delete], sender=Issuer)
def issuer_changed(sender, instance, **kwargs):
    revalidate.request(instance.id)


@receiver([post_save, post_delete], sender=PortalCategory)
def portal_category_changed(sender, instance, **kwargs):
    # カテゴリの名前とバッジの数は、すべての機関ページに出る
    revalidate.request(*Issuer.objects.values_list("id", flat=True))
