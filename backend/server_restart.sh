#!/bin/sh
/bin/sh server_stop.sh
readonly ENV_FILE=$1
readonly DOCKER_COMPOSE_YML=$2
/bin/sh server_start.sh $ENV_FILE $DOCKER_COMPOSE_YML
