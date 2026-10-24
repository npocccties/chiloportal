#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

docker build -t frontend -f Dockerfile.frontend .
docker container rm -f frontend 2>&1 || true
# 実行時に必要な環境変数（JWT_VERIFICATION_KEY_BASE64 など）は Git 管理外の frontend/.env.runtime に書く
ENV_FILE_OPT=""
if [ -f frontend/.env.runtime ]; then
    ENV_FILE_OPT="--env-file frontend/.env.runtime"
fi
docker run --restart unless-stopped -p 3000:3000 --name frontend --net app_network $ENV_FILE_OPT --detach frontend
