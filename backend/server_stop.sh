#!/bin/sh
readonly ENV_FILE=$1
/bin/sh ./server_db_backup.sh $ENV_FILE
docker-compose down -v
