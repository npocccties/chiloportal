#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
cd $DIR
source ./.env
docker-compose exec -T db pg_dump -h 127.0.0.1 \
    -p 5432 -d $DB_NAME -U $DB_USER \
    -Fc -v --file=/var/lib/postgresql/chiloportal.dump
BACKUP_FILE="${DIR}/postgresql/data/chiloportal.dump"
if [ -e $BACKUP_FILE ]; then
    sudo cp $BACKUP_FILE /var
fi
