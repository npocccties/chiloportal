#
# 管理ユーザーを登録する（最初の全体管理者は、このコマンドで登録する）
#
#   python manage.py createadmin <eppn> --superuser
#
# パスワードは設定しない。登録した eppn で学認にログインすると、管理画面を使える。
# 2人目からは、管理画面の「ユーザー」で全体管理者が登録する。
#
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import ValidationError


class Command(BaseCommand):
    help = "管理ユーザーを eppn で登録する（パスワードなし。ログインは学認）"

    def add_arguments(self, parser):
        parser.add_argument("eppn", help="学認の eppn（例：user@example.ac.jp）")
        parser.add_argument("--superuser", action="store_true", help="全体管理者として登録する")

    def handle(self, *args, **options):
        User = get_user_model()
        eppn = options["eppn"].strip()
        username_field = User._meta.get_field("username")
        try:
            username_field.run_validators(eppn)
        except ValidationError as e:
            raise CommandError(f"eppn として使えない文字が含まれています：{eppn}（{'; '.join(e.messages)}）")
        user, created = User.objects.get_or_create(username=eppn)
        user.is_staff = True
        user.is_active = True
        if options["superuser"]:
            user.is_superuser = True
        if created or user.has_usable_password():
            # 学認だけでログインする（ID・パスワードではログインさせない）
            user.set_unusable_password()
        user.save()
        role = "全体管理者" if user.is_superuser else "機関管理者"
        action = "登録しました" if created else "更新しました"
        self.stdout.write(f"{eppn} を{role}として{action}。")
