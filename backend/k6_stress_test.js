// 本ファイルは負荷テストツール k6 に指定するスクリプトです。
// URLは適宜変更してください。
// 
// 試験条件：
// ・同時接続数：100
// ・試験時間：60分
//
// 使用方法：
// git clone https://github.com/grafana/k6.git
// cd k6
// docker compose up influxdb grafana -d
// docker compose run --rm -T k6 run - < {本ファイルのパス} --vus 100 --duration 60m
//
import http from 'k6/http';
export default function () {
    http.get('https://test-portal.oku.cccties.org/consumers/1/frameworks/1/stages/1');
}
