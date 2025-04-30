#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

if ! docker network ls | grep db_network > /dev/null 2>&1; then
    docker network create db_network
fi
docker compose -f docker-compose.dev-server-db.yml up -d
docker container stop chilowallet 2>&1 || true
docker compose -f docker-compose.dev-server.yml build --no-cache
docker compose -f docker-compose.dev-server.yml up -d