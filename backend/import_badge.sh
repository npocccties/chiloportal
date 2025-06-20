#!/bin/sh
if [ $# != 1 ]; then
    echo "使用方法"
    echo "第1引数：CSVファイルのパス（絶対/相対）"
    echo ""
    echo "CSVファイル書式："
    echo "バッジの取得URL,ポータル独自カテゴリID"
    echo ""
    echo "CSVファイル凡例"
    echo "https://lms.example.org/badges/badge_json.php?id=19,101"
    echo "https://lms.example.org/badges/badge_json.php?id=20,101"
    echo "https://lms.example.org/badges/badge_json.php?id=21,101"
    echo ""
    echo "本スクリプトの使用例："
    echo "./import_badge.sh test.csv"
    exit 1
fi
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR

readonly CSV_PATH=$1
if [ ! -e $CSV_PATH ]; then
    echo "${CSV_PATH} が存在しないため、処理継続できません。"
    exit 1
fi
echo "CSV_PATH: ${CSV_PATH}"

lines=()
while read line || [[ -n "${line}" ]]; do
    lines+=("$line")
done < $CSV_PATH

exit_code=0
messages=("OK/NG,url,portal_category.id,wisdom_badges.id")
for line in ${lines[@]}; do
    echo "${line}"
    url=`echo ${line} | cut -d , -f 1`
    portal_category_id=`echo ${line} | cut -d , -f 2`
    import_result=`docker compose exec -T app python /workspace/manage.py import_badge --url=${url} --pcid=${portal_category_id}`
    wisdom_badge_id=`echo "$import_result" | sed -e 's/[^0-9]//g'`
    if [[ $import_result == *"OK"* ]]; then
        message="OK,${url},${portal_category_id},${wisdom_badge_id}"
    else
        message="NG,${url},${portal_category_id},-"
        exit_code=1
    fi
    messages+=("$message")
done

echo "インポート結果："
readonly RESULT_CSV_FNAME="import_result.csv"
sudo rm -rf $RESULT_CSV_FNAME
for message in ${messages[@]}; do
    echo "${message}" | sudo tee -a $RESULT_CSV_FNAME
done

exit $exit_code
