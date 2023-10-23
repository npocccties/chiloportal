from collections import defaultdict
from .enums import *
from .utils import *


def to_portal_categories(queryset):
    return [to_portal_category(pc) for pc in queryset]


def to_portal_category(pc):
    return {
        "portal_category_id": pc.id,
        "name": pc.name,
        "description": pc.description,
        "image_url_path": pc.image_url_path,
        "badges_count": pc.wisdom_badges_portal_category__count,
    }


def to_consumers(queryset):
    return [to_consumer(consumer) for consumer in queryset]


def to_consumer(consumer):
    return {
        "consumer_id": consumer.id,
        "name": consumer.name,
        "url": consumer.url,
        "email": consumer.email,
    }


def to_criteria(criteria):
    return {
        "criteria_id": criteria.id,
        "type": criteria.type,
        "name": criteria.name,
    }


def to_pager_wisdom_badges(page):
    badge_array = []
    for wisdom_badge in page.object_list:
        badge_array.append(to_wisdom_badge(wisdom_badge))
    return {
        "badges": badge_array,
        "total_count": page.paginator.object_list.count(),
        "start": page.start_index(),
        "end": page.end_index(),
    }


def to_pager_wisdom_badges_all(queryset):
    badge_array = [to_wisdom_badge(badge) for badge in queryset]
    return {
        "badges": badge_array,
        "total_count": len(badge_array),
        "start": 1,
        "end": len(badge_array),
    }


def to_pager_wisdom_badges_empty():
    return {
        "badges": [],
        "total_count": 0,
        "start": 0,
        "end": 0,
    }


def to_wisdom_badges(queryset, output_portal_category=False, output_alignments=False):
    return [
        to_wisdom_badge(wisdom_badge, output_portal_category, output_alignments)
        for wisdom_badge in queryset
    ]


def to_wisdom_badge(
    wisdom_badge, output_portal_category=False, output_alignments=False
):
    knowledge_badges = wisdom_badge.knowledge_badges_wisdom_badges
    knowledge_badges_id_list = sorted(
        [knowledge_badge.id for knowledge_badge in knowledge_badges.all()]
    )
    issuer = wisdom_badge.issuer
    portal_category = wisdom_badge.portal_category
    result = {
        "badges_id": wisdom_badge.id,
        "type": BadgeType.WISDOM.name.lower(),
        "name": wisdom_badge.name,
        "description": wisdom_badge.description,
        "image": wisdom_badge.image_id,
        "image_author": wisdom_badge.image_author,
        "tags": wisdom_badge.tags,
        "issuer_name": issuer.name if issuer else None,
        "issuer_url": issuer.url if issuer else None,
        "issuer_email": issuer.email if issuer else None,
        "digital_badge_class_id": wisdom_badge.badge_class_id,
        "detail": {
            "knowledge_badges_list": knowledge_badges_id_list,
        },
    }
    if output_portal_category and portal_category:
        result["portal_category_id"] = portal_category.id
        result["portal_category_name"] = portal_category.name
        result["portal_category_description"] = portal_category.description
        result["portal_category_image_url_path"] = portal_category.image_url_path
    if output_alignments:
        result["alignments_targetname"] = wisdom_badge.alignments_targetname
        result["alignments_targeturl"] = wisdom_badge.alignments_targeturl
    return result


def to_knowledge_badges(queryset):
    return [to_knowledge_badge(knowledge_badge) for knowledge_badge in queryset]


def to_knowledge_badge(knowledge_badge):
    criterias = knowledge_badge.criteria_knowledge_badges
    issuer = knowledge_badge.issuer
    return {
        "badges_id": knowledge_badge.id,
        "type": BadgeType.KNOWLEDGE.name.lower(),
        "name": knowledge_badge.name,
        "description": knowledge_badge.description,
        "image": knowledge_badge.image_id,
        "image_author": knowledge_badge.image_author,
        "tags": knowledge_badge.tags,
        "issuer_name": issuer.name if issuer else None,
        "issuer_url": issuer.url if issuer else None,
        "issuer_email": issuer.email if issuer else None,
        "digital_badge_class_id": knowledge_badge.badge_class_id,
        "detail": [to_criteria(criteria) for criteria in criterias.all()],
    }


def to_frameworks(query_set):
    return [to_framework(framework) for framework in query_set]


def to_framework(framework):
    return {
        "framework_id": framework.id,
        "name": framework.name,
        "description": framework.description,
        "url": framework.url,
        "supplementary": framework.supplementary,
    }


def to_stages(query_set):
    return [to_stage(stage) for stage in query_set]


def to_stage(stage):
    return {
        "stage_id": stage.id,
        "name": stage.name,
        "sub_name": stage.sub_name,
        "description": stage.description,
    }


delimiter = "____$$$____"


def make_field2_key(field):
    return f"{field.field1_name}{delimiter}{field.field2_name}"


def make_field3_key(field):
    return f"{make_field2_key(field)}{delimiter}{field.field3_name}"


def split_field2_key(key):
    return key.split(delimiter)


def get_fields_detail_keys(categorised_badge_set):
    field1keys = dict()
    field2keys = dict()
    field_dict = defaultdict(list)
    wisdom_dict = defaultdict(list)
    for cb in categorised_badge_set:
        field = cb.goal.field
        if field.field1_name not in field1keys.values():
            field1keys[field.sort_key] = field.field1_name
        field2_key = make_field2_key(field)
        if field2_key not in field2keys.values():
            field2keys[field.sort_key] = field2_key
        field_result = list(
            filter(
                lambda f: True if f.id == field.id else False, field_dict[field2_key]
            )
        )
        if len(field_result) == 0:
            field_dict[field2_key].append(field)
        field3_key = make_field3_key(field)
        if cb.wisdom_badges.id not in wisdom_dict[field3_key]:
            wisdom_dict[field3_key].append(cb.wisdom_badges.id)
    return field1keys, field2keys, field_dict, wisdom_dict


def to_fields_detail(categorised_badge_set):
    field1keys, field2keys, field_dict, wisdom_dict = get_fields_detail_keys(
        categorised_badge_set
    )
    field1_list = []
    for field1key, field1value in sorted(field1keys.items()):
        field1_list.append(
            _to_field_detail(field_dict, field1value, field2keys, wisdom_dict)
        )
    return {"field1": field1_list}


def _to_field_detail(field_dict, field1value, field2keys, wisdom_dict):
    field2_array = []
    for field2key, field2value in sorted(field2keys.items()):
        if not field2value.startswith(field1value):
            continue
        fields = sorted(field_dict[field2value], key=lambda f: f.sort_key)
        field3_array = []
        for field in fields:
            field3_key = make_field3_key(field)
            wisdom_badge_id_array = sorted(wisdom_dict[field3_key])
            field3_array.append(
                {
                    "field_id": field.id,
                    "field3_name": field.field3_name,
                    "wisdom_badges": wisdom_badge_id_array,
                }
            )
        field2_array.append(
            {"field2_name": split_field2_key(field2value)[1], "field3": field3_array}
        )
    return {"field1_name": field1value, "field2": field2_array}

def to_consumer_framework_badges_list(wisdom_badge_set):
    return [to_consumer_framework_badges(wisdom_badge) for wisdom_badge in wisdom_badge_set]

def to_consumer_framework_badges(wisdom_badge):
    return {
        "consumer_id": wisdom_badge['categorised_badges_wisdom_badges__goal__framework__consumer__id'],
        "consumer_name": wisdom_badge['categorised_badges_wisdom_badges__goal__framework__consumer__name'],
        "framework_id": wisdom_badge['categorised_badges_wisdom_badges__goal__framework__id'],
        "framework_name": wisdom_badge['categorised_badges_wisdom_badges__goal__framework__name'],
        "stage_id": wisdom_badge['categorised_badges_wisdom_badges__goal__stage__id'],
        "stage_name": wisdom_badge['categorised_badges_wisdom_badges__goal__stage__name'],
        "stage_invisible": wisdom_badge['categorised_badges_wisdom_badges__goal__stage__invisible'],
        "field1_name": wisdom_badge['categorised_badges_wisdom_badges__goal__field__field1_name'],
        "digital_badge_class_id": wisdom_badge['badge_class_id'],
        "wisdom_badges_id": wisdom_badge['id'],
        "wisdom_badges_name": wisdom_badge['name'],
        "wisdom_badges_description": wisdom_badge['description'],
        "knowledge_badges_count": wisdom_badge['knowledge_badges_count'],
    }