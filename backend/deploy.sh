#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
readonly CHECKOUT_DIR="${DIR}/chiloportal/"
if [ -d $CHECKOUT_DIR ]; then
   cd $CHECKOUT_DIR
   sudo git checkout .
   sudo git pull
else
   sudo git clone https://github.com/npocccties/chiloportal.git
fi
# frontend
readonly FRONTEND_DIR="${CHECKOUT_DIR}frontend"
cd $FRONTEND_DIR
docker build -t frontend .
docker container stop frontend
docker run --rm -p 3000:3000 --name frontend --net app_network --detach frontend
# backend
readonly BACKEND_DIR="${CHECKOUT_DIR}backend"
cd $BACKEND_DIR
sudo chmod 755 server_*.sh
readonly ENV_FILE=$1
readonly DOCKER_COMPOSE_YML=$2
./server_restart.sh $ENV_FILE $DOCKER_COMPOSE_YML
