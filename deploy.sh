#!/bin/sh
sudo git checkout .
sudo git pull
sudo chmod 755 deploy.sh
# frontend
cd frontend
docker build -t frontend .
docker container stop frontend 2>&1 || true
docker run --rm -p 3000:3000 --name frontend --net app_network --detach frontend
# backend
cd ../backend
sudo chmod 755 server_*.sh
readonly ENV_FILE=$1
readonly DOCKER_COMPOSE_YML=$2
./server_restart.sh $ENV_FILE $DOCKER_COMPOSE_YML
