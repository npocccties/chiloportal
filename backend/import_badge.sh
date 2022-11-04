#!/bin/sh
if [ $# != 2 ]; then
    echo "使用方法"
    echo "第1引数：能力バッジの取得URL"
    echo "第2引数：能力バッジの取得URLに引き渡すIDとポータル独自カテゴリIDを記載したCSVファイルのパス（絶対/相対）"
    echo ""
    echo "CSVファイル書式："
    echo "能力バッジの取得URLに引き渡すID,ポータル独自カテゴリID"
    echo ""
    echo "CSVファイル凡例"
    echo "19,101"
    echo "20,101"
    echo "21,101"
    echo ""
    echo "本スクリプトの使用例："
    echo "./import_badge.sh https://dev-lms.oku.cccties.org/badges/badge_json.php test.csv"
    exit 1
fi
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
readonly URL=$1
echo "URL: ${URL}"

readonly CSV_PATH=$2
if [ ! -e $CSV_PATH ]; then
    echo "${CSV_PATH} が存在しないため、処理継続できません。"
    exit 1
fi
echo "CSV_PATH: ${CSV_PATH}"

lines=()
while read line; do
    echo "${line}"
    lines+=("$line")
done < $CSV_PATH

exit_code=0
messages=("OK/NG,badge_json.php?id,portal_category.id,wisdom_badges.id")
for line in ${lines[@]}; do
    echo "${line}"
    json_badge_id=`echo ${line} | cut -d , -f 1`
    portal_category_id=`echo ${line} | cut -d , -f 2`
    import_result=`docker-compose exec -T app python /workspace/manage.py import_badge --url=${URL}?id=${json_badge_id} --pcid=${portal_category_id}`
    wisdom_badge_id=`echo "$import_result" | sed -e 's/[^0-9]//g'`
    if [[ $import_result == *"OK"* ]]; then
        message="OK,${json_badge_id},${portal_category_id},${wisdom_badge_id}"
    else
        message="NG,${json_badge_id},${portal_category_id},-"
        exit_code=1
    fi
    messages+=("$message")
done < $CSV_PATH

echo "インポート結果："
readonly RESULT_CSV_FNAME="import_result.csv"
sudo rm -rf $RESULT_CSV_FNAME
for message in ${messages[@]}; do
    echo "${message}" | sudo tee -a $RESULT_CSV_FNAME
done

exit $exit_code
