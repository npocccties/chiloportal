#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
cd $DIR
readonly ENV_FILE=$1
/bin/sh ./server_db_backup.sh $ENV_FILE
docker-compose down -v
