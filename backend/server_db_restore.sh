#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
source ./.env
docker-compose exec -T db pg_restore --clean -h 127.0.0.1 -p 5432 -d $DB_NAME -U $DB_USER -v < /var/chiloportal.dump
