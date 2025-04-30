#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
source ./.env

PATH=/usr/local/sbin:/usr/bin:/bin

# バックアップファイルの存在チェック
DUMP_DIR="/var"
DUMP_FNAME="chilowallet.dump"
DUMP_PATH="${DUMP_DIR}/${DUMP_FNAME}"
if [ ! -e $DUMP_PATH ]; then
    echo "${DUMP_PATH} が存在しないためDBのバックアップファイルの圧縮は行いません。"
    exit 1
fi

# バックアップ対象のディレクトリへ移動
cd ${DUMP_DIR}

# 今日の日付を取得する
DATE=`/bin/date '+%Y%m%d'`
echo $DATE

# バックアップ対象ファイルを圧縮して保存
sudo mkdir -p ${DUMP_BACKUP_DIR}
DUMP_BACKUP_PATH="${DUMP_BACKUP_DIR}/${DUMP_FNAME}_${DATE}.tar.gz"
echo $DUMP_BACKUP_PATH
sudo rm -rf $DUMP_BACKUP_PATH >& /dev/null
sudo tar zcf $DUMP_BACKUP_PATH ${DUMP_FNAME}

# 削除する日付を取得する
DELETE_DAY=$(($DUMP_BACKUP_COUNT + 1))
DELETE_DATE=`/bin/date -d "$DELETE_DAY day ago" +%Y%m%d`
echo $DELETE_DATE

DELETE_PATH="${DUMP_BACKUP_DIR}/${DUMP_FNAME}_${DELETE_DATE}.tar.gz"
echo $DELETE_PATH
# 過去のバックアップを削除
if [ -f $DELETE_PATH ]; then
    sudo rm -rf $DELETE_PATH
fi

exit 0