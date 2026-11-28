#!/bin/sh
# 管理画面でアップロードした画像（backend/media）を、DB のバックアップと同じ場所に圧縮して控える。
# 保持する日数は DB と同じ（DUMP_BACKUP_COUNT）。DB のバックアップ（server_db_backup.sh）と同じタイミングで実行する。
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
. ./.env

PATH=/usr/local/sbin:/usr/bin:/bin

if [ ! -d "${DIR}/media" ]; then
    echo "${DIR}/media がないため、画像のバックアップは行いません。"
    exit 0
fi

DATE=`/bin/date '+%Y%m%d'`
sudo mkdir -p ${DUMP_BACKUP_DIR}
MEDIA_BACKUP_PATH="${DUMP_BACKUP_DIR}/chiloportal-media_${DATE}.tar.gz"
echo $MEDIA_BACKUP_PATH
sudo tar zcf $MEDIA_BACKUP_PATH -C ${DIR} media

# 保持する日数を過ぎたものを消す
DELETE_DAY=$(($DUMP_BACKUP_COUNT + 1))
DELETE_DATE=`/bin/date -d "$DELETE_DAY day ago" +%Y%m%d`
DELETE_PATH="${DUMP_BACKUP_DIR}/chiloportal-media_${DELETE_DATE}.tar.gz"
if [ -f $DELETE_PATH ]; then
    sudo rm -f $DELETE_PATH
fi

exit 0
