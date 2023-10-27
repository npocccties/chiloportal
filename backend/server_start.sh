#!/bin/sh
# バックエンドのコンテナ起動
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
docker compose up -d
# コンテナ作成時に requirements.txt から django-cors-headers をインストールしても /usr/local/lib/python3.9/site-packages にインストールされていないので、
# デプロイのタイミングで django-cors-headers をインストールする
docker compose exec -T app pip install --upgrade pip
docker compose exec -T app pip install django-cors-headers
docker compose exec -T app pip install django-ipware
docker compose exec -T app pip install django-axes
docker compose exec -T app pip install bcrypt
docker compose exec -T app python /workspace/manage.py makemigrations
docker compose exec -T app python /workspace/manage.py migrate
docker compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
docker compose exec -d app gunicorn project.wsgi:application --bind 0.0.0.0:8000
# コンテナ作成直後だとDB接続できないことがあるので、とりあえず遅らせてみる
/bin/sh ./server_db_restore.sh
