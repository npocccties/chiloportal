#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
readonly URL=$1
echo "URL: ${URL}"
if [ $# != 2 ]; then
    echo "使用方法"
    echo "　第1引数：能力バッジの取得URL"
    echo "　第2引数：能力バッジの取得URLに引き渡すIDとポータル独自カテゴリIDを記載したCSVファイルのパス"
    echo ""
    echo "使用例："
    echo "./import_badge.sh https://dev-lms.oku.cccties.org/badges/badge_json.php test.csv"
    exit 1
fi
readonly CSV_PATH=$2
if [ ! -e $CSV_PATH ]; then
    echo "${CSV_PATH} が存在しないため、処理継続できません。"
    exit 1
fi
echo "CSV_PATH: ${CSV_PATH}"

wisdom_badge_id_array=()
while read LINE; do
    json_badge_id=`echo ${LINE} | cut -d , -f 1`
    portal_category_id=`echo ${LINE} | cut -d , -f 2`
    echo "${json_badge_id},${portal_category_id}"
    import_result=`docker-compose exec -T app python /workspace/manage.py import_badge --url=${URL}?id=${json_badge_id} --pcid=${portal_category_id}`
    echo ""
    echo ""
    echo ""
    echo ""
    echo ""
    echo "$import_result"
    wisdom_badge_id=`echo "$import_result" | sed -r "s/wisdom_badge.id: ([0-9]+)/\1/"`
    echo $wisdom_badge_id
    wisdom_badge_id_array+=($wisdom_badge_id)
done < $CSV_PATH
echo "wisdom_badge_id_array: ${wisdom_badge_id_array}"
# LINE="wisdom_badge.id: 123"
# RETVAL=`echo "$LINE" | sed -r "s/^wisdom_badge.id: ([0-9]+)/\1/"`
# echo $RETVAL

exit 0
