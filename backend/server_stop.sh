#!/bin/sh
readonly DOCKER_COMPOSE_YML=$2
sudo cp $DOCKER_COMPOSE_YML docker-compose.yml
/bin/sh ./server_db_backup.sh $ENV_FILE
docker-compose down -v
