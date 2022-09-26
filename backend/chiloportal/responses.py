from collections import defaultdict

def to_portal_category(pc):
    return {
        'portal_category_id': pc.id,
        'name': pc.name,
        'description': pc.description,
        'image_url_path': pc.image_url_path,
        'badges_count': pc.wisdom_badges_portal_category__count,
    }

def to_consumers(queryset):
    return [to_consumer(consumer) for consumer in queryset]

def to_consumer(consumer):
    return {
        'consumer_id': consumer.id,
        'name': consumer.name,
        'url': consumer.url,
        'email': consumer.email,
    }

def to_criteria(criteria):
    return {
        'criteria_id': criteria.id,
        'type': criteria.type,
        'name': criteria.name,
    }

def to_wisdom_badges_by_page(page):
    badge_array = []
    for wisdom_badge in page.object_list:
        badge_array.append(to_wisdom_badge(wisdom_badge))
    return {
        'badges': badge_array,
        'total_count': page.paginator.object_list.count(),
        'start': page.start_index(),
        'end': page.end_index()
    }

def to_wisdom_badge(wisdom_badge):
    knowledge_badges = wisdom_badge.knowledge_badges_wisdom_badges
    knowledge_badges_id_list = sorted([knowledge_badge.id for knowledge_badge in knowledge_badges.all()])
    issuer = wisdom_badge.issuer
    return {
        'badges_id': wisdom_badge.id,
        'type': 'wisdom',
        'name': wisdom_badge.name,
        'description': wisdom_badge.description,
        'image': wisdom_badge.image_id,
        'image_author': wisdom_badge.image_author,
        'tags': wisdom_badge.tags,
        'issuer_name': issuer.name if issuer else None,
        'issuer_url': issuer.url if issuer else None,
        'issuer_email': issuer.email if issuer else None,
        'degital_badge_class_id': wisdom_badge.badge_class_id,
        'detail': {
            'knowledge_badges_list': knowledge_badges_id_list,
        }
    }

def to_knowledge_badge(knowledge_badge):
    criterias = knowledge_badge.criteria_knowledge_badges
    issuer = knowledge_badge.issuer
    return {
        'badges_id': knowledge_badge.id,
        'type': 'knowledge',
        'name': knowledge_badge.name,
        'description': knowledge_badge.description,
        'image': knowledge_badge.image_id,
        'image_author': knowledge_badge.image_author,
        'tags': knowledge_badge.tags,
        'issuer_name': issuer.name if issuer else None,
        'issuer_url': issuer.url if issuer else None,
        'issuer_email': issuer.email if issuer else None,
        'degital_badge_class_id': knowledge_badge.badge_class_id,
        'detail': [to_criteria(criteria) for criteria in criterias.all()]
    }

def to_frameworks(query_set):
    return [to_framework(framework) for framework in query_set]

def to_framework(framework):
    return {
        'framework_id': framework.id,
        'name': framework.name,
        'description': framework.description,
        'url': framework.url,
        'supplementary': framework.supplementary
    }

def to_stages(query_set):
    return [to_stage(stage) for stage in query_set]

def to_stage(stage):
    return {
        'stage_id': stage.id,
        'name': stage.name,
        'sub_name': stage.sub_name,
        'description': stage.description
    }

delimiter = '____$$$____'

def make_field2_key(cp):
    return f'{cp.field1_name}{delimiter}{cp.field2_name}'

def split_field2_key(key):
    return key.split(delimiter)

def get_fields_keys(field_set):
    field1keys = set()
    field2keys = set()
    field_dict = defaultdict(list)
    for field in field_set:
        field1keys.add(field.field1_name)
        field2keys.add(make_field2_key(field))
        field_dict[make_field2_key(field)].append(field)
    return field1keys, field2keys, field_dict

def to_fields(field_set):
    field1keys, field2keys, field_dict = get_fields_keys(field_set)
    field1_array = []
    for field1key in sorted(list(field1keys)):
        field1_array.append(_to_field(field_dict, field1key, field2keys))
    return field1_array

def _to_field(field_dict, field1key, field2keys):
    field2_array = []
    for field2key in sorted(list(field2keys)):
        if not field2key.startswith(field1key):
            continue
        fields = sorted(field_dict[field2key], key=lambda f: f.sort_key)
        field3_array = []
        for field in fields:
            field3_array.append({'field_id': field.id, 'field3_name': field.field3_name})
        field2_array.append({'field2_name': split_field2_key(field2key)[1], 'field3': field3_array})
    field1 = {'field1_name': field1key, 'field2': field2_array}
    return {'field1': field1}

def get_fields_detail_keys(categorised_badge_set):
    field1keys = set()
    field2keys = set()
    field_dict = defaultdict(list)
    wisdom_dict = defaultdict(list)
    for cb in categorised_badge_set:
        field = cb.goal.field
        field1keys.add(field.field1_name)
        field2keys.add(make_field2_key(field))
        field_dict[make_field2_key(field)].append(field)
        wisdom_dict[make_field2_key(field)].append(cb.wisdom_badges.id)
    return field1keys, field2keys, field_dict, wisdom_dict

def to_fields_detail(categorised_badge_set):
    field1keys, field2keys, field_dict, wisdom_dict = get_fields_detail_keys(categorised_badge_set)
    field1_list = []
    for field1key in sorted(list(field1keys)):
        field1_list.append(_to_field_detail(field_dict, field1key, field2keys, wisdom_dict))
    return field1_list

def _to_field_detail(field_dict, field1key, field2keys, wisdom_dict):
    field2_array = []
    for field2key in sorted(list(field2keys)):
        if not field2key.startswith(field1key):
            continue
        fields = sorted(field_dict[field2key], key=lambda f: f.sort_key)
        wisdom_badge_id_array = sorted(wisdom_dict[field2key])
        field3_array = []
        for field in fields:
            field3_array.append({'field_id': field.id, 'field3_name': field.field3_name, 'wisdom_badges': wisdom_badge_id_array})
        field2_array.append({'field2_name': split_field2_key(field2key)[1], 'field3': field3_array})
    field1 = {'field1_name': field1key, 'field2': field2_array}
    return {'field1': field1}
