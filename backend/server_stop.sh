#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
readonly ENV_FILE=$1
sudo cp $ENV_FILE .env
readonly DOCKER_COMPOSE_YML=$2
echo $DOCKER_COMPOSE_YML
sudo cp $DOCKER_COMPOSE_YML docker-compose.yml
/bin/sh ./server_db_backup.sh $ENV_FILE
docker-compose down -v
