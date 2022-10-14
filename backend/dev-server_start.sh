#!/bin/sh
sudo cp .env.dev-server .env
sudo cp docker-compose.dev-server.yml docker-compose.yml
docker-compose up -d
docker-compose exec app python /workspace/manage.py makemigrations
docker-compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
