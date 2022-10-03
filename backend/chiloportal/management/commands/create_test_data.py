import logging
from django.core.management.base import BaseCommand
from ...models import *
from ...utils import *
from ...exceptions import *
from ...tests.views.base_api_view_tests import *

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "テストデータ作成コマンド"

    def handle(self, *args, **options):
        tests = BaseAPIViewTests()
        tests.create_test_categorised_badges_data(BaseAPIViewTests.test_data_count)
