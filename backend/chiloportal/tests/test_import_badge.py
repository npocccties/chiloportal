from ctypes import alignment
from io import StringIO
from django.test import TestCase
from django.core import management
from django.db.models import Q
from ..management.commands import import_badge
from ..management.commands.enums import *
from ..exceptions import *
from ..models import *

class ImportBadgeCommandTests(TestCase):
    wisdom_badge_url = 'https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=41'
    
    @classmethod
    def setUp(self):
        self.portal_category = PortalCategory.objects.create(name='hoge', sort_key=1)

    def test_run_ok(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command('import_badge', url=self.wisdom_badge_url, pcid=self.portal_category.id, stdout=stdout, stderr=stderr)
        self.assertEqual(stdout.getvalue(), 'OK\n')
        self.assertNotEqual(stderr.getvalue(), 'NG\n')

    def test_run_ng(self):
        stdout = StringIO()
        stderr = StringIO()
        management.call_command('import_badge', url=self.wisdom_badge_url, pcid=0, stdout=stdout, stderr=stderr)
        self.assertNotEqual(stdout.getvalue(), 'OK\n')
        self.assertEqual(stderr.getvalue(), 'NG\n')
