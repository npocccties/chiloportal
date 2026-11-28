#!/bin/sh
# バックエンドのコンテナ起動
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
# イメージを作り直してから起動する（requirements.txt の変更と、ベースイメージのパッチ版の修正を取り込む）
BACKEND_BASE_IMAGE="python:3.13-slim"  # Dockerfile の FROM と合わせる
docker pull -q "$BACKEND_BASE_IMAGE"
docker compose pull --ignore-buildable
docker compose build
docker compose up -d
# 使ったイメージの版（ダイジェスト）を記録する
IMAGE_VERSIONS=""
for image in "$BACKEND_BASE_IMAGE" $(docker compose config --images | sort -u); do
    IMAGE_VERSIONS="$IMAGE_VERSIONS $(docker image inspect --format '{{if .RepoDigests}}{{index .RepoDigests 0}}{{else}}{{index .RepoTags 0}}@{{.Id}}{{end}}' "$image" 2>/dev/null)"
done
echo "$(date '+%Y-%m-%d %H:%M:%S') backend$IMAGE_VERSIONS" >> image-versions.log
# 表はマイグレーション（chiloportal/migrations/）で作る。up -d で migration サービスが migrate --fake-initial を実行するので、
# ここでは実行せずに終わるのを待つ（ここでも実行すると、2つが同時に同じ表を作ろうとして片方が失敗する）
if ! docker compose wait migration; then
    echo "マイグレーションに失敗しました。docker compose logs migration を確認してください。" >&2
    exit 1
fi
docker compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
# コンテナ作成直後だとDB接続できないことがあるので、とりあえず遅らせてみる
