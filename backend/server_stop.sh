#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
cd $DIR
/bin/sh ./server_db_backup.sh
docker-compose down -v
