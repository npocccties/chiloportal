#!/bin/sh
if [ $# -eq 0 ]; then
    echo "使用方法"
    echo "第1引数：CSVファイルのパス（絶対/相対）"
    echo "第2引数：フロントエンドのビルドを行うか否かで省略可（--build: ビルドする ※デフォルト, --no-build 未指定時: ビルドしない）"
    echo ""
    echo "CSVファイル書式："
    echo "能力バッジの取得URL,能力バッジの取得URLに引き渡すID,ポータル独自カテゴリID"
    echo ""
    echo "CSVファイル凡例"
    echo "https://dev-lms.oku.cccties.org/badges/badge_json.php,19,101"
    echo "https://dev-lms.oku.cccties.org/badges/badge_json.php,20,101"
    echo "https://dev-lms.oku.cccties.org/badges/badge_json.php,21,101"
    echo ""
    echo "ビルド時の使用例："
    echo "./import.sh test.csv"
    echo "./import.sh test.csv --build"
    echo ""
    echo "ビルドなし時の使用例："
    echo "./import.sh test.csv --no-build"
    exit 1
fi
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

echo $1
echo $2

readonly BACKEND_DIR="${DIR}/backend"
cd $BACKEND_DIR
./import_badge.sh $1
RESULT=$?
if [ $RESULT -eq 1 ]; then
    echo "インポートが正常に終了しませんでした。"
    exit 1
fi

FRONT_BUILD=$2
if [ -z "$FRONT_BUILD" ]; then
    FRONT_BUILD="--build"
fi
if [ "$FRONT_BUILD" == "--build" ]; then
    echo "フロントエンドのビルドを開始します。"
    readonly FRONTEND_DIR="${DIR}/frontend"
    cd $FRONTEND_DIR
    ./build.sh
    echo "フロントエンドのビルドを終了しました。"
else
    echo "フロントエンドのビルドは行われませんでした。"
fi

exit 0
