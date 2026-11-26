#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

# ベースイメージのパッチ版の修正を毎回取り込むため、ビルドの前に pull する
FRONTEND_BASE_IMAGES="node:26-slim gcr.io/distroless/nodejs26-debian13"
for image in $FRONTEND_BASE_IMAGES; do
    docker pull -q "$image"
done
docker build -t frontend -f Dockerfile.frontend .
# 使ったベースイメージの版（ダイジェスト）を記録する
echo "$(date '+%Y-%m-%d %H:%M:%S') frontend $(docker image inspect --format '{{index .RepoDigests 0}}' $FRONTEND_BASE_IMAGES | tr '\n' ' ')" >> image-versions.log
docker container rm -f frontend 2>&1 || true
# 実行時に必要な環境変数（JWT_VERIFICATION_KEY_BASE64 など）は Git 管理外の frontend/.env.runtime に書く
ENV_FILE_OPT=""
if [ -f frontend/.env.runtime ]; then
    ENV_FILE_OPT="--env-file frontend/.env.runtime"
fi
docker run --restart unless-stopped -p 3000:3000 --name frontend --net app_network $ENV_FILE_OPT --detach frontend
