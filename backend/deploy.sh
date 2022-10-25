#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
readonly CHECKOUT_DIR="${DIR}/chiloportal/"
if [ -d $CHECKOUT_DIR ]; then
   cd $CHECKOUT_DIR
   sudo git checkout backend/
   sudo git pull
else
   sudo git clone https://github.com/npocccties/chiloportal.git
fi
readonly BACKEND_DIR="${CHECKOUT_DIR}backend"
cd $BACKEND_DIR
sudo chmod 755 dev-server_*.sh
readonly ENV_FILE=$1
readonly DOCKER_COMPOSE_YML=$2
./dev-server_restart.sh $ENV_FILE $DOCKER_COMPOSE_YML