#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

readonly BACKEND_DIR="${DIR}/backend"
cd $BACKEND_DIR
./import_badge.sh $1 $2
RESULT=$?
if [ $RESULT -eq 1 ]; then
    echo "インポートが正常に終了しませんでした。"
    exit 1
fi

FRONT_BUILD=$3
if [ -z $FRONT_BUILD ]; then
    FRONT_BUILD=1
fi
if [ $FRONT_BUILD -eq 1 ]; then
    echo "フロントエンドのビルドを開始します。"
    readonly FRONTEND_DIR="${DIR}/frontend"
    cd $FRONTEND_DIR
    ./build.sh
    echo "フロントエンドのビルドを終了しました。"
else
    echo "フロントエンドのビルドは行われませんでした。"
fi

exit 0
