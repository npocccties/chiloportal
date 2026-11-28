from django.apps import AppConfig
from django.contrib.admin.apps import AdminConfig


class ChiloportalConfig(AppConfig):
    # 既存の表（create_table.sql で作成）の ID は integer なので AutoField に合わせる
    default_auto_field = 'django.db.models.AutoField'
    name = 'chiloportal'
    verbose_name = 'ポータル'

    def ready(self):
        from . import signals  # noqa: F401  保存・削除のときにページの作り直しを予約する


class ChiloportalAdminConfig(AdminConfig):
    """管理画面に、ログインを学認にした独自の AdminSite を使う。"""

    default_site = "chiloportal.admin_site.ChiloportalAdminSite"
