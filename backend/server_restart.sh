#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
readonly ENV_FILE=$1
source $ENV_FILE
DOCKER_COMPOSE_YML=""
echo $LETS_ENCRYPT
if [ $LETS_ENCRYPT ]; then
    DOCKER_COMPOSE_YML="docker-compose.dev-server.yml"
else
    DOCKER_COMPOSE_YML="docker-compose.production.yml"
fi
echo $DOCKER_COMPOSE_YML
/bin/sh server_stop.sh $ENV_FILE $DOCKER_COMPOSE_YML
/bin/sh server_start.sh $ENV_FILE $DOCKER_COMPOSE_YML
