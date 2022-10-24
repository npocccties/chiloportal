#!/bin/sh
DIR=`dirname "${0}"`
cd $DIR
/bin/sh ./dev-server_db_backup.sh
docker-compose down -v
