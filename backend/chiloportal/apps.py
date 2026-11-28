from django.apps import AppConfig


class ChiloportalConfig(AppConfig):
    # 既存の表（create_table.sql で作成）の ID は integer なので AutoField に合わせる
    default_auto_field = 'django.db.models.AutoField'
    name = 'chiloportal'
    verbose_name = 'ポータル'

    def ready(self):
        from . import signals  # noqa: F401  保存・削除のときにページの作り直しを予約する
