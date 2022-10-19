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
1. 実行とデバッグで「Backend API」を選択し、F5キーを押下
1. ブラウザから http://localhost:8000/api/v1/swagger/ を参照する
1. 該当のAPIを開いてから、「Try it out」を押下
1. 必要に応じてパラメータ入力を行う
1. 「Execute」を押下し、期待する値が得られているか確認する

### インポートコマンド
1. 実行とデバッグで「Import command」を選択し、F5キーを押下  
   * 能力バッジを取得するURLは .vscode/launch.json にて定義しているので、適宜変更してください

## テスト方法
1. 実行とデバッグで「Unit Test」を選択し、F5キーを押下し、エラーがないことを確認  
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

1. Docker および Docker Compose をインストール  
1. optフォルダに移動
   ```
   cd /opt
   ```
1. chiloportal のソースを git で取得  
   ```
   git clone https://github.com/npocccties/chiloportal.git
   ```
1. backendフォルダに移動  
   ```
   cd chiloportal/backend
   ```
1. .env の作成  
   ```
   cp .env.dev-server .env
   ```
   * DBの認証情報や Django の秘密鍵を含めてますので、本番環境でも使用する場合は適宜変更してください  
1. docker-compose.yml の作成  
   ```
   cp docker-compose.dev-server.yml docker-compose.yml
   ```
1. コンテナの起動  
   ```
   docker-compose up -d
   ```
1. マイグレーション  
   ```
   docker-compose exec app python /workspace/manage.py makemigrations
   docker-compose exec app python /workspace/manage.py migrate
   ```
1. static ファイルの収集
   ```
   docker-compose exec -d app python /workspace/manage.py collectstatic --no-input --clear
   ```
1. 備考  
   コンテナログの確認  
   ```
   docker-compose logs -f
   ```
   コンテナの再起動  
   ```
   docker-compose restart
   ```
   コンテナの停止  
   ```
   docker-compose stop
   ```
   コンテナの停止、削除（DBも消えます）  
   ```
   docker-compose down -v
   ```
   コンテナのリビルド（DBも消えます）
   ```
   docker-compose build --no-cache
   ```
   .env ファイルの作成 ～ static ファイルの収集までのスクリプト
   ```
   sudo chmod 755 ./dev-server_start.sh
   ./dev-server_start.sh
   ```
   管理者作成（※必要に応じて）  
   ```
   docker-compose exec app python /workspace/manage.py createsuperuser
   ```
   * 本番環境の管理者の認証情報は類推されにくいユーザ名およびパスワードを設定してください  

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
|DEBUG|デバッグ機能|デバッグ用で例外発生時のエラー内容が参照できるようになる<br>`True`: 有効<br>`False`: 無効<br>※本番リリース時は必ず「`False`」を設定してください|
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

## 開発サーバー
あらかじめ/opt/chiloportal/backendに移動し、db コンテナを通してコマンド実行  
1. バックアップ
   ```
   docker-compose exec db sh
   pg_dump -h 127.0.0.1 -p 5432 -d develop -U postgres -t portal_category -t issuer -t wisdom_badges -t knowledge_badges -t criteria -t categorised_badges -t consumer -t framework -t field -t stage -t goal -Fc -v > /var/lib/postgresql/chiloportal.dump
   exit
   sudo cp /opt/chiloportal/backend/postgresql/data/chiloportal.dump /tmp
   ```
   * 上記コンテナ内の出力ファイルは /opt/chiloportal/backend/postgresql/data に出力されます
   * 出力ファイルは適当な場所にコピーしておいてください（理由：コンテナを down したりすると消えるため）
1. リストア
   ```
   sudo cp /tmp/chiloportal.dump /opt/chiloportal/backend/postgresql/data
   docker-compose exec db sh
   pg_restore --clean -h 127.0.0.1 -p 5432 -d develop -U postgres -v /var/lib/postgresql/chiloportal.dump
   exit
   ```

# Django の管理画面
ブラウザから下記のURLを参照
## ローカル環境
http://localhost:8000/admin
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
* Let's Encrypt の無料SSL証明書を使用
### SSL証明書の更新ジョブ
Let’Encrypt のSSL証明書は発行してから`90`日間有効で、有効期限の`30`日前を過ぎている場合、  
コンテナを再起動することで SSL証明書が自動更新されますので、  
crontab コマンドで毎月月初の日付が変わったタイミングでコンテナ再起動のジョブを登録する運用とします。
* ジョブ:  `0 0 01 */1 * docker-compose -f /opt/chiloportal/backend/docker-compose.yml restart`
