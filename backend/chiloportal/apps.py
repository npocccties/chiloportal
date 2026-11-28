from django.apps import AppConfig


class ChiloportalConfig(AppConfig):
    # 既存の表（create_table.sql で作成）の ID は integer なので AutoField に合わせる
    default_auto_field = 'django.db.models.AutoField'
    name = 'chiloportal'
    verbose_name = 'ポータル'
