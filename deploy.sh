#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
sudo git checkout .
sudo git pull
sudo chmod 755 import.sh
docker network rm app_network
docker network create -d bridge app_network
# frontend
readonly FRONTEND_DIR="${DIR}/frontend"
cd $FRONTEND_DIR
sudo chmod 755 build.sh
./build.sh
# backend
readonly BACKEND_DIR="${DIR}/backend"
cd $BACKEND_DIR
sudo chmod 755 *.sh
./server_restart.sh
