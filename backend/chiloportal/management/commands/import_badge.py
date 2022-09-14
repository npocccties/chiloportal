import re
import requests
import logging
from django.core.management.base import BaseCommand
from django.db import transaction
from .enums import *
from ...models import *
from ...utils import *
from ...exceptions import *

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Moodleの能力バッジのインポートコマンド"
    wisdom_badge_id = 0

    def add_arguments(self, parser):
        parser.add_argument('--url', nargs='?', default='', type=str, help='能力バッジを取得するURL')
        parser.add_argument('--pcid', nargs='?', default=0, type=int, help='ポータル独自カテゴリの主キー')


    def handle(self, *args, **options):
        try:
            self.do_import(options['url'], options['pcid'])
            self.stdout.write('OK')
        except AppException as e:
            logger.error(str(e))
            self.stderr.write('NG')


    def find_portal_category(self, portal_category_id):
        queryset = PortalCategory.objects.filter(id=portal_category_id)
        if queryset.exists() == False:
            return None
        return queryset.first()


    def do_import(self, url, portal_category_id):
        portal_category = self.find_portal_category(portal_category_id)
        if portal_category == None:
            raise AppException(f'ポータル独自カテゴリに存在しないIDが指定されましたので処理継続できません。pcid: {portal_category_id}')
        json = self.request_get(url)
        alignments = json.get('alignments')
        badge_class = self.get_badge_class(alignments)
        if badge_class == BadgeClass.NONE:
            raise AppException('バッジ種別が判断できないので処理を中断します。')
        elif badge_class == BadgeClass.KNOWLEDGE:
            raise AppException('知識バッジのため処理継続できません。能力バッジを指定してください。')
        elif badge_class == BadgeClass.WISDOM:
            with transaction.atomic():
                self.update_wisdom_badge(json, portal_category)


    def get_badge_class(self, alignments):
        badge_class = BadgeClass.NONE
        if (alignments == None):
            badge_class = BadgeClass.KNOWLEDGE
        else:
            badge_class = BadgeClass.WISDOM
        return badge_class


    def request_get(self, url):
        logger.debug('--- request ---')
        logger.debug('url: ' + url)
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException as e:
            logger.error(str(e))
            raise AppException('APIへのリクエストでエラーが発生しました。')
        try:
            json = response.json()
        except:
            raise AppException('JSONが取得できませんでした。')
        error = json.get('error')
        if error != None:
            raise AppException(f'APIのレスポンスにエラーが含まれるため処理を中断します。エラー内容: {error}')
        return json


    def get_badge_data(self, json):
        id = json.get('id')
        name = json.get('name')
        description = json.get('description')
        criteria_narrative = json.get('criteria', {}).get('narrative')
        image_id = json.get('image', {}).get('id')
        image_author = json.get('image', {}).get('author')
        version = json.get('@context')
        issuer_name = json.get('issuer', {}).get('name')
        issuer_url = json.get('issuer', {}).get('url')
        issuer_email = json.get('issuer', {}).get('email')
        return id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email


    def update_wisdom_badge(self, json, portal_category):
        id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email = self.get_badge_data(json)
        alignments = json.get('alignments', [])
        url = None
        for alignment in alignments:
            target_url = alignment.get('targetUrl', '')
            if '/course/view.php' in target_url:
                url = target_url
                break
        issuer = self.update_issuer(issuer_name, issuer_url, issuer_email)
        wisdom_badge_set = WisdomBadges.objects.filter(badge_class_id = id)
        if wisdom_badge_set.exists():
            logger.debug('--- update ---')
            wisdom_badge = wisdom_badge_set.first()
            # 洗い替えが可能な知識バッジとコースはDELETE/INSERTとする
            knowledge_badge_set = KnowledgeBadges.objects.filter(wisdom_badges=wisdom_badge)
            if knowledge_badge_set.exists():
                for knowledge_badge in knowledge_badge_set:
                    criteria_set = Criteria.objects.filter(knowledge_badges=knowledge_badge)
                    if criteria_set.exists():
                        criteria_set.all().delete()
            knowledge_badge_set.all().delete()
            wisdom_badge.name = name
            wisdom_badge.description = description
            wisdom_badge.criteria_narrative = criteria_narrative
            wisdom_badge.image_id = image_id
            wisdom_badge.image_author = image_author
            wisdom_badge.version = version
            wisdom_badge.issuer = issuer
            wisdom_badge.alignments_targeturl = url
            wisdom_badge.portal_category = portal_category
            wisdom_badge.save()
            self.wisdom_badge_id = wisdom_badge.id
        else:
            logger.debug('--- insert ---')
            wisdom_badge = WisdomBadges.objects.create(badge_class_id=id, name=name, description=description, criteria_narrative=criteria_narrative,
                image_id=image_id, image_author=image_author, version=version, issuer=issuer, alignments_targeturl=url, portal_category=portal_category)
            self.wisdom_badge_id = wisdom_badge.id
        self.create_criterias(alignments, wisdom_badge)
        logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        logger.info(f'wisdom_badge.id: {self.wisdom_badge_id}')
        logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')


    def update_issuer(self, issuer_name, issuer_url, issuer_email):
        queryset = Issuer.objects.filter(name = issuer_name)
        if queryset.exists():
            issuer = queryset.first()
            issuer.name = issuer_name
            issuer.url = issuer_url
            issuer.email = issuer_email
            issuer.save()
            return issuer
        else:
            return Issuer.objects.create(name=issuer_name, url=issuer_url, email=issuer_email)


    def create_criterias(self, alignments, wisdom_badge):
        for alignment in alignments:
            target_url = alignment.get('targetUrl', '')
            if '/badges/badge_json' in target_url:
                knowledge_json = self.request_get(target_url)
                knowledge_badge, criteria_list = self.create_knowledge_badge(knowledge_json, wisdom_badge)
                for criteria in criteria_list:
                    if len(criteria) < 2:
                        continue
                    self.create_criteria(criteria[0], criteria[1], knowledge_badge)


    def create_knowledge_badge(self, json, wisdom_badge):
        id, name, description, criteria_narrative, image_id, image_author, version, issuer_name, issuer_url, issuer_email = self.get_badge_data(json)
        issuer = self.update_issuer(issuer_name, issuer_url, issuer_email)
        knowledge_badge = KnowledgeBadges.objects.create(badge_class_id=id, name=name, description=description, criteria_narrative=criteria_narrative,
            image_id=image_id, image_author=image_author, version=version, issuer=issuer, wisdom_badges=wisdom_badge)
        logger.debug(f'knowledge_badge.id: {knowledge_badge.id}')
        criteria_list = self.parse_narrative(criteria_narrative)
        return knowledge_badge, criteria_list


    def parse_narrative(self, criteria_narrative):
        criteria_list = []
        if criteria_narrative != None:
            nlist = criteria_narrative.replace('\"', '').split('\n')
            for n in nlist:
                m = re.match(r'(.+) - (.+)', n)
                if m != None:
                    criteria_list.append(m.groups())
        return criteria_list


    def create_criteria(self, type, name, knowledge_badge):
        criteria = Criteria.objects.create(type=type, name=name, knowledge_badges=knowledge_badge)
        logger.debug(f'criteria.id: {criteria.id}')
