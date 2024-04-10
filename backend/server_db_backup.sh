#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
source ./.env
BACKUP_FILE="${DIR}/postgresql/data/chiloportal.dump"
docker compose exec -T db pg_dump -h 127.0.0.1 \
    -p 5432 -d $DB_NAME -U $DB_USER \
    -Fc -v > "$BACKUP_FILE"
if [ -e $BACKUP_FILE ]; then
    echo "start to ./server_db_backup_dump.sh"
    sudo cp $BACKUP_FILE /var
    /bin/sh ./server_db_backup_dump.sh
else
    echo "chiloportal.dumpが出力できませんでした。"
fi

