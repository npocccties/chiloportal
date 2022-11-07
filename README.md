# chiloportal

## 能力バッジのインポート
   ```
   ./import.sh {CSVファイルパス ※以降、インポートCSV} {フロントエンドのビルドを行うか否かで省略可（--build: ビルドする ※デフォルト, --no-build: ビルドしない）}
   ```
   * ビルド時使用例： `./import.sh /opt/test.csv`
   * ビルド時使用例： `./import.sh /opt/test.csv --build`
   * ビルドなし時使用例： `./import.sh /opt/test.csv --no-build`
   * インポートCSV書式：能力バッジを取得するURL,ポータル独自カテゴリの主キー
   * インポートCSVヘッダー：無し
   * インポートCSVファイル凡例：  
     ```
     19,101
     20,101
     21,101
     ```
   * インポートの結果は `chiloportal/backend/import_result.csv` に出力されます
   * インポート結果CSVファイル書式：OK/NG,能力バッジを取得するURLポータル独自カテゴリの主キー,インポート済み能力バッジのID
