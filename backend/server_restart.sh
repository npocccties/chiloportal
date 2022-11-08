#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
source ./.env
echo $LETS_ENCRYPT
DOCKER_COMPOSE_YML=""
if "${LETS_ENCRYPT}"; then
    DOCKER_COMPOSE_YML="docker compose.dev-server.yml"
else
    DOCKER_COMPOSE_YML="docker compose.production.yml"
fi
sudo cp $DOCKER_COMPOSE_YML docker compose.yml
/bin/sh server_stop.sh
/bin/sh server_start.sh
