#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
DUMP_FILE="/var/chilowallet.dump"
if [ ! -e $DUMP_FILE ]; then
    echo "${DUMP_FILE} が存在しないためDBのリストアは行いません。"
    exit 1
fi
source ./.env
for i in {1..10};
do
    docker compose -f docker-compose.production-db.yml exec -T db pg_restore --clean -h 127.0.0.1 -p 5432 -d $DB_NAME -U $DB_USER -v < /var/chilowallet.dump
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
        break
    else
        echo "DBのリストアに失敗したためリトライしています。${i} 回目"
    fi
    sleep 1
done
if [ $RESULT -eq 1 ]; then
    echo "リトライの上限に達したためDBのリストアを中断します。"
    exit 1
fi
exit 0