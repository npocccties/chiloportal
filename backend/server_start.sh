#!/bin/sh
# バックエンドのコンテナ起動
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
# イメージを作り直してから起動する（requirements.txt の変更とベースイメージのパッチ版を取り込む）
docker compose pull --ignore-buildable
docker compose build --pull
docker compose up -d
docker compose exec -T app python /workspace/manage.py makemigrations
docker compose exec -T app python /workspace/manage.py migrate
docker compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
# コンテナ作成直後だとDB接続できないことがあるので、とりあえず遅らせてみる
