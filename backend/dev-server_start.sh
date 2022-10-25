#!/bin/sh
DIR=$(cd $(dirname $0); pwd)
cd $DIR
readonly ENV_FILE=$1
sudo cp $ENV_FILE .env
sudo cp docker-compose.dev-server.yml docker-compose.yml
docker-compose up -d
/bin/sh ./dev-server_db_restore.sh
# コンテナ作成時に requirements.txt から django-cors-headers をインストールしても /usr/local/lib/python3.9/site-packages にインストールされていないので、
# デプロイのタイミングで django-cors-headers をインストールする
docker-compose exec -T app pip install --upgrade pip
docker-compose exec -T app pip install django-cors-headers
docker-compose exec -T app pip install django-ipware
docker-compose exec -T app python /workspace/manage.py makemigrations
docker-compose exec -T app python /workspace/manage.py migrate
docker-compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
docker-compose exec -d app gunicorn project.wsgi:application --bind 0.0.0.0:8000