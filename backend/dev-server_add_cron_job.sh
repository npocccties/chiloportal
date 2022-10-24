#!/bin/sh

readonly ENV_FILE=$1
cron_job_line="0 0 01 */1 * /opt/chiloportal/backend/dev-server_restart.sh ${ENV_FILE}"

# crontabファイル
cron_file="/var/spool/cron/github-backend"

# 無ければ作る
[ -f ${cron_file} ] && touch ${cron_file}

# 既に登録されているかどうかを判定
cron_job_line_for_grep="${cron_job_line//\\/\\\\}"
if [ `grep "${cron_job_line_for_grep}" "${cron_file}" | wc -l` -eq 0 ] ; then
    echo "not registered yet. begin registering..."
    echo "${cron_job_line}" >> "${cron_file}"
    /etc/init.d/crond restart
    echo "End of registration."
else
    echo "Already registered."
fi
