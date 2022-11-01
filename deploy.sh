#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
sudo git checkout .
sudo git pull
sudo chmod 755 deploy.sh
docker network rm app_network
docker network create -d bridge app_network
# frontend
readonly FRONTEND_DIR="${DIR}/frontend"
cd $FRONTEND_DIR
docker build -t frontend .
docker container stop frontend 2>&1 || true
docker run --rm -p 3000:3000 --name frontend --net app_network --detach frontend
# backend
readonly BACKEND_DIR="${DIR}/backend"
cd $BACKEND_DIR
sudo chmod 755 server_*.sh
./server_restart.sh
