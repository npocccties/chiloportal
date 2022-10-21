#!/bin/sh
DIR=`dirname "${0}"`
cd $DIR
docker-compose exec db pg_dump -h 127.0.0.1 \
    -p 5432 -d develop -U postgres -t portal_category -t issuer \
    -t wisdom_badges -t knowledge_badges -t criteria -t categorised_badges \
    -t consumer -t framework -t field -t stage -t goal \
    -Fc -v --file=/var/lib/postgresql/chiloportal.dump
BACKUP_FILE="/opt/chiloportal/backend/postgresql/data/chiloportal.dump"
if [ -e $BACKUP_FILE ]; then
    sudo cp $BACKUP_FILE /var
fi
