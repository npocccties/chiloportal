import os
import requests
import logging
from django.core.management.base import BaseCommand
from django.db import transaction
from ...enums import *
from ...models import *
from ...utils import *
from ...exceptions import *
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Moodleの能力バッジのインポートコマンド"
    wisdom_badge_id = 0
    judge_badge = os.getenv("JUDGE_BADGE", JudgeBadge.ALIGNMENTS.name.lower())

    def add_arguments(self, parser):
        parser.add_argument(
            "--url", nargs="?", default="", type=str, help="能力バッジの取得URL"
        )
        parser.add_argument(
            "--pcid", nargs="?", default=0, type=int, help="ポータル独自カテゴリの主キー"
        )

    def handle(self, *args, **options):
        logger.debug("------- Import start -------")
        try:
            json = self.request_get_json(options["url"])
            self.do_import(json, options["pcid"])
            self.stdout.write("OK")
        except AppException as e:
            logger.error(str(e))
            self.stderr.write("NG")
        logger.debug("------- Import end -------")

    def find_portal_category(self, portal_category_id):
        queryset = PortalCategory.objects.filter(id=portal_category_id)
        if queryset.exists() == False:
            return None
        return queryset.first()

    def do_import(self, json, portal_category_id):
        portal_category = self.find_portal_category(portal_category_id)
        if portal_category == None:
            raise AppException(
                f"ポータル独自カテゴリに存在しないIDが指定されましたので処理継続できません。pcid: {portal_category_id}"
            )
        alignments = json.get("alignments")
        version = json.get("version")
        badge_class = self.judge_wisdom_badge(alignments, version)
        if badge_class == BadgeType.NONE:
            raise AppException("バッジ種別が判断できないので処理を中断します。")
        elif badge_class == BadgeType.KNOWLEDGE:
            raise AppException("知識バッジのため処理継続できません。能力バッジを指定してください。")
        elif badge_class == BadgeType.WISDOM:
            with transaction.atomic():
                self.update_wisdom_badge(json, portal_category)

    def judge_wisdom_badge(self, alignments, version):
        badge_class = BadgeType.NONE
        if self.judge_badge.lower() == JudgeBadge.ALIGNMENTS.name.lower():
            if alignments == None:
                badge_class = BadgeType.KNOWLEDGE
            else:
                badge_class = BadgeType.WISDOM
        elif self.judge_badge.lower() == JudgeBadge.VERSION.name.lower():
            if version:
                if version.endswith(BadgeType.KNOWLEDGE.name.lower()):
                    badge_class = BadgeType.KNOWLEDGE
                elif version.endswith(BadgeType.WISDOM.name.lower()):
                    badge_class = BadgeType.WISDOM
            else:
                badge_class = BadgeType.NONE
        return badge_class

    def request_get_json(self, url):
        try:
            json = self.request_get(url).json()
        except:
            raise AppException("JSONが取得できませんでした。")
        error = json.get("error")
        if error != None:
            raise AppException(f"APIのレスポンスにエラーが含まれるため処理を中断します。エラー内容: {error}")
        return json

    def request_get(self, url):
        logger.debug("--- request ---")
        logger.debug("url: " + url)
        try:
            return requests.get(url)
        except requests.exceptions.RequestException as e:
            logger.error(str(e))
            raise AppException("APIへのリクエストでエラーが発生しました。")

    def get_badge_data(self, json):
        id = json.get("id")
        name = json.get("name")
        description = json.get("description")
        criteria_narrative = json.get("criteria", {}).get("narrative")
        image_id = json.get("image", {}).get("id")
        image_author = json.get("image", {}).get("author")
        version = json.get("@context")
        issuer_name = json.get("issuer", {}).get("name")
        issuer_url = json.get("issuer", {}).get("url")
        issuer_email = json.get("issuer", {}).get("email")
        return (
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        )

    def download_file(self, image_id, image_dir="/workspace/output/images/"):
        try:
            response = self.request_get(image_id)
            content_type = response.headers.get("Content-Type")
        except Exception as e:
            logger.error(str(e))
            raise AppException("image.idのURLの画像取得時にエラーが発生しました。")
        array = content_type.split("/")
        if len(array) != 2 or array[0].lower() != "image":
            logger.error(f"処理対象外のContent-Type: {content_type}")
            raise AppException("image.idのURLのContent-Typeがimageではありません。")
        ext = array[1]
        urlparsed = urlparse(image_id)
        urlpath = urlparsed.path
        fname = urlpath.replace("/", ".")[1:]  # 先頭に/が付いているので、2文字目以降を抽出
        filename = f"{fname}.{ext}"
        path = os.path.join(image_dir, filename)
        if os.path.exists(image_dir) == False:
            os.makedirs(image_dir)
        with open(path, "wb") as f:
            f.write(response.content)
            return path

    def update_wisdom_badge(self, json, portal_category):
        (
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        ) = self.get_badge_data(json)
        alignments = json.get("alignments", [])
        target_name = None
        target_url = None
        for alignment in alignments:
            target_url = alignment.get("targetUrl", "")
            if "/course/view.php" in target_url:
                target_url = target_url
                target_name = alignment.get("targetName", "")
                break
        image_path = self.download_file(image_id)
        image_fname = os.path.basename(image_path)
        issuer = self.update_issuer(issuer_name, issuer_url, issuer_email)
        wisdom_badge_set = WisdomBadges.objects.filter(badge_class_id=id)
        if wisdom_badge_set.exists():
            logger.debug("--- update ---")
            wisdom_badge = wisdom_badge_set.first()
            # 洗い替えが可能な知識バッジとコースはDELETE/INSERTとする
            knowledge_badge_set = KnowledgeBadges.objects.filter(
                wisdom_badges=wisdom_badge
            )
            if knowledge_badge_set.exists():
                for knowledge_badge in knowledge_badge_set:
                    criteria_set = Criteria.objects.filter(
                        knowledge_badges=knowledge_badge
                    )
                    if criteria_set.exists():
                        criteria_set.all().delete()
            knowledge_badge_set.all().delete()
            wisdom_badge.name = name
            wisdom_badge.description = description
            wisdom_badge.image_id = image_fname
            wisdom_badge.image_author = image_author
            wisdom_badge.version = version
            wisdom_badge.issuer = issuer
            wisdom_badge.alignments_targetname = target_name
            wisdom_badge.alignments_targeturl = target_url
            wisdom_badge.portal_category = portal_category
            wisdom_badge.save()
            self.wisdom_badge_id = wisdom_badge.id
        else:
            logger.debug("--- insert ---")
            wisdom_badge = WisdomBadges.objects.create(
                badge_class_id=id,
                name=name,
                description=description,
                image_id=image_fname,
                image_author=image_author,
                version=version,
                issuer=issuer,
                alignments_targeturl=target_url,
                alignments_targetname=target_name,
                portal_category=portal_category,
            )
            self.wisdom_badge_id = wisdom_badge.id
        self.create_knowledge_badges(alignments, wisdom_badge)
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        msg = f"wisdom_badge.id: {self.wisdom_badge_id}"
        logger.info(msg)
        self.stdout.write(msg)
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    def update_issuer(self, issuer_name, issuer_url, issuer_email):
        queryset = Issuer.objects.filter(name=issuer_name)
        if queryset.exists():
            issuer = queryset.first()
            issuer.name = issuer_name
            issuer.url = issuer_url
            issuer.email = issuer_email
            issuer.save()
            return issuer
        else:
            return Issuer.objects.create(
                name=issuer_name, url=issuer_url, email=issuer_email
            )

    def create_knowledge_badges(self, alignments, wisdom_badge):
        for alignment in alignments:
            target_url = alignment.get("targetUrl", "")
            if "/badges/badge_json" in target_url:
                knowledge_json = self.request_get_json(target_url)
                image_id = knowledge_json.get("image", {}).get("id")
                image_path = self.download_file(image_id)
                knowledge_badge, criteria_list = self.create_knowledge_badge(
                    knowledge_json, wisdom_badge, image_path
                )
                criteria_sort_key = 1
                self.create_criterias(knowledge_badge, criteria_list, criteria_sort_key)

    def create_criterias(self, knowledge_badge, criteria_list, criteria_sort_key):
        for criteria in criteria_list:
            if len(criteria) < 2:
                continue
            self.create_criteria(
                criteria[0], criteria[1], knowledge_badge, criteria_sort_key
            )
            criteria_sort_key += 1

    def create_knowledge_badge(self, json, wisdom_badge, image_path):
        (
            id,
            name,
            description,
            criteria_narrative,
            image_id,
            image_author,
            version,
            issuer_name,
            issuer_url,
            issuer_email,
        ) = self.get_badge_data(json)
        issuer = self.update_issuer(issuer_name, issuer_url, issuer_email)
        knowledge_badge = KnowledgeBadges.objects.create(
            badge_class_id=id,
            name=name,
            description=description,
            criteria_narrative=criteria_narrative,
            image_id=os.path.basename(image_path),
            image_author=image_author,
            version=version,
            issuer=issuer,
            wisdom_badges=wisdom_badge,
        )
        logger.debug(f"knowledge_badge.id: {knowledge_badge.id}")
        criteria_list = self.parse_narrative(criteria_narrative)
        return knowledge_badge, criteria_list

    def parse_narrative(self, criteria_narrative):
        criteria_list = []
        delimiter = " - "
        if criteria_narrative != None:
            nlist = criteria_narrative.replace('"', "").split("\n")
            for n in nlist:
                index = n.find(delimiter)
                if index == -1:
                    continue
                criteria_type = n[:index]
                criteria_name = n[index + len(delimiter) :]
                if not criteria_type or not criteria_name:
                    continue
                criteria_list.append([criteria_type, criteria_name])
        return criteria_list

    def create_criteria(self, type, name, knowledge_badge, sort_key):
        criteria = Criteria.objects.create(
            type=type, name=name, knowledge_badges=knowledge_badge, sort_key=sort_key
        )
        logger.debug(f"criteria.id: {criteria.id}")
