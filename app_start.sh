#!/bin/sh
# バックエンドのコンテナ起動
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
if ! docker network ls | grep db_network > /dev/null 2>&1; then
    docker network create db_network
fi

docker compose -f docker-compose.production-db.yml up -d

if docker ps -q --filter "name=^chilowallet$" | grep -q .; then
    echo "Stopping existing container: chilowallet"
    docker container stop chilowallet
fi

docker compose -f docker-compose.production.yml -p chilowallet-app up -d --build