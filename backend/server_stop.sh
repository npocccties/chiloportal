#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
/bin/sh ./server_db_backup.sh
docker-compose down -v
