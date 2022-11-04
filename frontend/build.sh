#!/bin/sh
docker build -t frontend .
docker container stop frontend 2>&1 || true
docker run --rm -p 3000:3000 --name frontend --net app_network --detach frontend
