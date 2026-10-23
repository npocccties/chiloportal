#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

docker build -t frontend -f Dockerfile.frontend .
docker container rm -f frontend 2>&1 || true
docker run --restart unless-stopped -p 3000:3000 --name frontend --net app_network --detach frontend
