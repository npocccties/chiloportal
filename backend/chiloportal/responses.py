
def to_consumer(consumer):
    return {
        'consumer_id': consumer.id,
        'name': consumer.name,
        'url': consumer.url,
        'email': consumer.email,
    }
