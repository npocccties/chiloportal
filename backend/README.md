# 実行環境
* Docker
* Django

# 開発環境
* Visual Studio Code

# Visual Studio Code
## 環境構築手順

1. Docker および Docker Compose をインストール  
1. Visual Studio Code に拡張機能「Dev - Containers」をインストール  
1. `.env.localhost`を複製し、複製したファイルを`.env`にリネーム  
1. 表示 ⇒ コマンドパレット で「Remote-Containers: Open Folder in Container...」を選択し、backendフォルダを選択  

## デバッグ方法
### バックエンドAPI
1. 実行とデバッグで「Backend API」を選択し、デバッグの開始を押下
1. ブラウザから http://localhost/api/v1/swagger/ を参照する
1. 該当のAPIを開いてから、「Try it out」を押下
1. 必要に応じてパラメータ入力を行う
1. 「Execute」を押下し、期待する値が得られているか確認する

### インポートコマンド
1. 実行とデバッグで「Import command」を選択し、デバッグの開始を押下  
   * 能力バッジを取得するURLは .vscode/launch.json にて定義しているので、適宜変更してください

## テスト方法
1. 実行とデバッグで「Unit Test」を選択し、デバッグの開始を押下し、エラーがないことを確認  
   * エラーがあればエラー発生箇所を修正してください  
   * インポートコマンドの単体テスト：chiloportal/tests/commands/*.py
   * バックエンドAPIの単体テスト：chiloportal/tests/views/*.py

## Pythonのパッケージのインストール時
1. pipコマンドにより Python のパッケージをインストールした場合、下記コマンドを実行し requirements.txt を更新してください。  
   ```
   pip freeze > requirements.txt
   ```

## 単体テストのカバレッジ取得
1. 下記コマンド実行  
   ```
   pytest --cov --cov-branch --cov-report=term-missing --cov-report=html --ignore=chiloportal/tests/views/dev_server
   ```
   * htmlcov/index.html にカバレッジを出力します  
   * 上記 html の coverage 列（カバレッジ：網羅率）は C0（命令網羅）とC1（分岐網羅）を含みます  
1. カバレッジを確認して必要に応じてテストコードを追加
1. 再度、カバレッジを出力する


# 開発サーバー
## 環境構築手順

1. 下記をインストール
   * Docker
   * Docker Compose
   * Git  
1. `/opt` へ移動
   ```
   cd /opt
   ```
1. `deploy.sh` というファイルを以下から取得
   ```
   https://github.com/npocccties/chiloportal/blob/develop/backend/deploy.sh
   ```
1. `deploy.sh` に権限付与
   ```
   sudo chmod 755 deploy.sh
   ```
1. `deploy.sh` の実行
   ```
   ./deploy.sh {環境変数を記載した .envから始まるファイル名}
   ```
   例
   ```
   ./deploy.sh .env.dev-server
   ```
   * 本番環境で指定する場合は、あらかじめ本番サーバーで作成した `.env` のパスを `deploy.sh` に渡してください
1. 備考  
   コンテナ起動  
   ```
   /opt/chiloportal/backend/dev-server_start.sh {環境変数を記載した .envから始まるファイル名}
   ```
   例
   ```
   /opt/chiloportal/backend/dev-server_start.sh .env.dev-server
   ```
   コンテナ停止  
   ```
   /opt/chiloportal/backend/dev-server_stop.sh
   ```
   * DBが `/var/chiloportal.dump` にバックアップされます  

   コンテナ再起動  
   ```
   /opt/chiloportal/backend/dev-server_restart.sh
   ```
   * `dev-server_stop.sh` と `dev-server_start.sh` を呼びます
   
   DBバックアップ  
   ```
   /opt/chiloportal/backend/dev-server_db_backup.sh
   ```
   * DBが `/var/chiloportal.dump` にバックアップされます  
   
   DBリストア  
   ```
   /opt/chiloportal/backend/dev-server_db_restore.sh
   ```
   * `/var/chiloportal.dump` にあるバックアップデータをもとにDBをリストア（復元）します  

   全てのコンテナログの確認  
   ```
   docker-compose logs -f
   ```
   * -f の後ろにコンテナ名（appやdb等）を入れると該当コンテナのみのログが見れます  

   管理者作成  
   ```
   docker-compose exec app python /workspace/manage.py createsuperuser
   ```
   * Django の管理画面からログインするための管理者アカウントを作成します  
   * 本番環境では類推されにくいユーザ名およびパスワードを設定してください  

## 動作確認
### バックエンドAPI
1. ブラウザから https://dev-portal.oku.cccties.org/api/v1/swagger/ にアクセス
1. 該当のAPIを開いてから、「Try it out」を押下
1. 必要に応じてパラメータ入力を行う
1. 「Execute」を押下し、期待する値が得られているか確認する

### インポートコマンド
1. インポート実行  
   ```
   docker-compose exec app python /workspace/manage.py import_badge --url={能力バッジを取得するURL} --pcid={ポータル独自カテゴリの主キー}
   ```
   例
   ```
   docker-compose exec app python /workspace/manage.py import_badge --url=https://opedu.lib.osaka-kyoiku.ac.jp/badges/badge_json.php?id=41 --pcid=1
   ```
1. 能力バッジIDの確認  
   インポート実行するとコンソールに処理経過が出力され、最後に「wisdom_badge.id: {能力バッジID}」と出力されるので、その能力バッジIDをもとに関連データを作成してください。   
   出力例：
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   wisdom_badge.id: 1
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```


# 環境変数
|環境変数名|説明|備考|
|:--|:--|:--|
|SECRET_KEY|Django で使用される署名用の秘密鍵|-|
|DB_HOST|DBのホスト名|docker-compose.*.yml に記載されている`db`がホスト名|
|DB_NAME|DB名|-|
|DB_USER|DBのユーザ名|-|
|DB_PASS|DBのパスワード|-|
|DEBUG|デバッグ機能|デバッグ用で例外発生時のエラー内容が参照できるようになる<br>`True`: 有効 ※本番リリース用<br>`False`: 無効 ※動作確認用|
|ALLOWED_HOSTS|公開ホスト名|本番リリースする際は本番サーバーのホスト名を設定してください|
|LOGGER_LEVEL|ロガーレベル|ログファイルの出力基準で以下を指定可能<br>`DEBUG`/`INFO`/`WARNING`/`ERROR`/`CRITICAL`|
|IMAGE_DIR|画像ファイルの公開ディレクトリ（相対パス指定）|-|
|JUDGE_BADGE|バッジ判定方法|`version`:<br>JSONのversionフィールド値の末尾がwisdomならば能力バッジとみなす<br>※本番リリース用<br><br>`alignments`:<br>JSONにalignmentsがあれば能力バッジとみなす<br>※動作確認用|
|PER_PAGE|1ページあたりのデータ数|APIのクエリパラメータとしてページ番号(page_number)が指定可能な場合、同APIの1ページあたりのデータ数|
|STAGE|SSL証明書/自己署名証明書|`production`: SSL証明書を使用する ※本番リリース用<br>`local`: 自己署名証明書を使用する ※動作確認用<br>`staging`: 同上<br>証明書出力場所: `./ssl_certs`|


# DBの確認
## ローカル環境
1. SQLクライアントツールから参照
   * サーバー名: 127.0.0.1
   * データベース名: develop
   * ユーザID/パスワード: postgres
   * ポート番号: 5433
   * DB: PostgreSQL

## 開発サーバー
1. SELECT文の実行
   ```
   cd /opt/chiloportal/backend
   docker-compose exec db sh
   psql -d develop -U postgres
   select * from consumer;
   quit
   exit
   ```

# Django の管理画面
ブラウザから下記のURLを参照
## ローカル環境
http://localhost/admin
* ローカル環境で管理者を使用することはないと思いますが、使用する場合は 開発サーバー ⇒ 環境構築手順 ⇒ 備考 ⇒ 管理者作成 を参照し、管理者を作成しておいてください

## 開発サーバー
https://dev-portal.oku.cccties.org/admin

* SQLを使用せずとも Django の管理画面からデータを作成することは可能です（1件毎の手入力となりますので効率は下がります）

# ログファイル
ログファイルのファイルサイズが 100MB に達するとバックアップを行い、7世代分を保持します。  
1. バックエンドAPI
   ```
   chiloportal/backend/logs/backend_api.log
   ```
1. インポートコマンド
   ```
   chiloportal/backend/logs/import_badge.log
   ```

# 補足
## Visual Studio Code
### コード整形
* black
### 静的解析ツール
* mypy
### テストフレームワーク
* pytest

## 開発サーバー
### サーバー構成
* WEBサーバー: Nginx
* WSGIサーバー: gunicorn
* APIサーバー: Django REST framework
* DBサーバー: PostgresSQL
### SSL証明書
* Let's Encrypt（無料SSL証明書）
