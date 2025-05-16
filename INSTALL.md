# インストール方法

## 実行環境
* Docker
* Docker Compose (v2)

## 新規構築時

1. git clone https://github.com/npocccties/chiloportal.git
2. chiloportal/backend/.env 用意 (本番用)
3. chiloportal/backend/nginx.conf 用意 (本番用)
4. chiloportal/frontend/.env や 静的コンテンツを用意 (本番用)
5. sudo chmod 755 chiloportal/deploy.sh
6. chiloportal/deploy.sh ( ← フロントエンドのdocker ビルドも実行）
※ 各 env  や 静的コンテンツがない場合は，停止 or デフォルト設定で実行

## バックエンド設定更新時

1. /backend/.env 更新
2. chiloportal/backend/server_restart.sh

## フロントエンド設定更新時

1. /frontend/.env や 静的コンテンツを更新
2. chiloportal/backend/build.sh

## バッジのインポート時
   ```
   chiloportal/import.sh {CSVファイルパス ※以降、インポートCSV} {フロントエンドのビルドを行うか否かで省略可（--build: ビルドする ※デフォルト, --no-build: ビルドしない）}
   ```
   * ビルド時使用例： `./import.sh /opt/test.csv`
   * ビルド時使用例： `./import.sh /opt/test.csv --build`
   * ビルドなし時使用例： `./import.sh /opt/test.csv --no-build`
   * インポートCSV書式：バッジの取得URL,ポータル独自カテゴリの主キー
   * インポートCSVヘッダー：無し
   * インポートCSVファイル凡例：  
     ```
     https://lms.example.org/badges/badge_json.php?id=19,101
     https://lms.example.org/badges/badge_json.php?id=20,101
     ```
   * インポートの結果は `chiloportal/backend/import_result.csv` に出力されます
   * インポート結果CSVファイル書式：OK/NG,バッジの取得URL (*1),ポータル独自カテゴリの主キー,インポート済みバッジのID
   * (*1) バッジの取得URL: `Moodle` にあらかじめ登録しているバッジのJSONを取得するためのURLです
