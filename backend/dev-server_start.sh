#!/bin/sh
DIR=`dirname "${0}"`
cd $DIR
sudo cp .env.dev-server .env
readonly DOCKER_COMPOSE_YML=$1
sudo cp $DOCKER_COMPOSE_YML docker-compose.yml
docker-compose up -d
/bin/sh ./dev-server_db_restore.sh
# コンテナ作成時に requirements.txt から django-cors-headers をインストールしても /usr/local/lib/python3.9/site-packages にインストールされていないので、
# デプロイのタイミングで django-cors-headers をインストールする
docker-compose exec -T app pip install --upgrade pip
docker-compose exec -T app pip install django-cors-headers
docker-compose exec -T app python /workspace/manage.py makemigrations
docker-compose exec -T app python /workspace/manage.py migrate
docker-compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
docker-compose exec -d app gunicorn project.wsgi:application --bind 0.0.0.0:8000