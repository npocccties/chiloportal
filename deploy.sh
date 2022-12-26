#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
sudo git checkout .
sudo git pull
sudo chmod 755 import.sh
docker network create -d bridge app_network --gateway=172.18.0.254 --subnet=172.18.0.0/24
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
