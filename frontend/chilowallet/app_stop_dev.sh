#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

docker compose -f docker-compose.dev-server-db.yml down
docker compose -f docker-compose.dev-server.yml down