#!/bin/sh
/bin/sh dev-server_stop.sh
readonly ENV_FILE=$1
/bin/sh dev-server_start.sh $ENV_FILE
