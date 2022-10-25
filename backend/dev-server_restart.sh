#!/bin/sh
/bin/sh dev-server_stop.sh
readonly ENV_FILE=$1
readonly DOCKER_COMPOSE_YML=$2
/bin/sh dev-server_start.sh $ENV_FILE $DOCKER_COMPOSE_YML
