# chiloportal

## 実行環境
* Docker
* Docker Compose (v2)

## 新規構築時

1. git clone https://github.com/npocccties/chiloportal.git
2. chiloportal/backend/.env 用意 (本番用)
3. chiloportal/frontend/.env や 静的コンテンツを用意 (本番用)
4. sudo chmod 755 chiloportal/deploy.sh
5. chiloportal/deploy.sh ( ← フロントエンドのdocker ビルドも実行）
※ 各 env  や 静的コンテンツがない場合は，停止 or デフォルト設定で実行

## バックエンド設定更新時

1. /backend/.env 更新
2. chiloportal/backend/server_restart.sh

## フロントエンド設定更新時

1. /frontend/.env や 静的コンテンツを更新
2. chiloportal/backend/build.sh

## 能力バッジのインポート時
   ```
   chiloportal/import.sh {CSVファイルパス ※以降、インポートCSV} {フロントエンドのビルドを行うか否かで省略可（--build: ビルドする ※デフォルト, --no-build: ビルドしない）}
   ```
   * ビルド時使用例： `./import.sh /opt/test.csv`
   * ビルド時使用例： `./import.sh /opt/test.csv --build`
   * ビルドなし時使用例： `./import.sh /opt/test.csv --no-build`
   * インポートCSV書式：能力バッジを取得するURL,ポータル独自カテゴリの主キー
   * インポートCSVヘッダー：無し
   * インポートCSVファイル凡例：  
     ```
     https://lms.example.org/badges/badge_json.php?id=19,101
     https://lms.example.org/badges/badge_json.php?id=20,101
     ```
   * インポートの結果は `chiloportal/backend/import_result.csv` に出力されます
   * インポート結果CSVファイル書式：OK/NG,能力バッジを取得するURLポータル独自カテゴリの主キー,インポート済み能力バッジのID
