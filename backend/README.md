# 開発環境
* Visual Studio Code
* Django REST Framework

# Visual Studio Code
## 環境構築手順

1. Visual Studio Code に拡張機能「Dev - Containers」をインストール  

1. `.env.local-debug`を複製し、複製したファイルを`.env`にリネーム  

1. 表示 ⇒ コマンドパレット で「Remote-Containers: Open Folder in Container...」を選択し、backendフォルダを選択  

1. コンテナのビルドが終了したら、ターミナル ⇒ 新しいターミナル で以降のコマンドを実行  

1. 管理者作成  
   ```
   python /workspace/manage.py createsuperuser
   ```

## デバッグ方法
### バックエンドAPI
1. 実行とデバッグで「Backend API」を選択し、F5キーを押下したのち、ブラウザから http://localhost:8000/api/v1/swagger/ を参照することでSwaggerUIを使用可能  

### インポートコマンド
1. 実行とデバッグで「Import command」を選択し、F5キーを押下  

   * 能力バッジを取得するURLは .vscode/launch.json にて定義しているので、適宜変更してください

## テスト方法
1. 実行とデバッグで「Unit Test」を選択し、F5キーを押下し、エラーがないことを確認  

   * エラーがあればエラー発生箇所を修正してください  
   * インポートコマンドの単体テスト：chiloportal/tests/commands/*.py
   * バックエンドAPIの単体テスト：chiloportal/tests/views/*.py


# 開発サーバー
## 環境構築手順

1. dockerおよびdocker-composeをインストール（詳細はググってください。「Rocky docker docker-compose」等で）  

1. chiloportal のソースを git で取得
   ```
   git clone https://github.com/npocccties/chiloportal.git
   ```

1. docker-compose.ymlのあるbackendフォルダに移動  
   ```
   cd chiloportal/backend
   ```

1. `.env.dev-server-debug`を複製し、複製したファイルを`.env`にリネーム  

   * DBの認証情報やdjangoの秘密鍵を含めてますので、本番環境でも使用する場合は適宜変更してください  

1. コンテナの起動  
   ```
   docker-compose up -d
   ```
   ※ リビルドしたい場合は以下を実行（但しDBが消えるので必要に応じてバックアップをしてください）
   ```
   docker-compose build --no-cache
   ```

1. 管理者作成  
   ```
   docker-compose exec app python /workspace/manage.py createsuperuser
   ```
   
   * 本番環境の管理者の認証情報は類推されにくいユーザ名およびパスワードを設定してください。
   * 上記コマンド実行時に、エラー「relation "auth_user" does not exist」が発生する場合、マイグレーションが正しく行われてない可能性があるので、下記コマンドを実行してください。
   ```
   docker-compose exec app python /workspace/manage.py makemigrations
   docker-compose exec app python /workspace/manage.py migrate
   ```

1. コンテナログの確認  
   ```
   docker-compose logs -f
   ```

1. コンテナの停止  
   ```
   docker-compose stop
   ```

## デプロイ方法
コンテナが起動している前提で下記を行ってください。  

### バックエンドAPI
1. バックエンドAPIサービス実行  
   ```
   docker-compose exec -d app python /workspace/manage.py runserver --noreload --nothreading 0.0.0.0:8000
   ```

## 動作確認
### バックエンドAPI
1. ブラウザから http://dev-portal.oku.cccties.org/api/v1/swagger/ にアクセス

1. 該当のAPIを開いてから、「Try it out」を押下

1. 必要に応じてパラメータ入力を行う

1. 「Execute」を押下し、期待する値が得られているか確認する

### インポートコマンド
1. インポート実行  
   ```
   docker-compose exec app python /workspace/manage.py import_badge --url {能力バッジを取得するURL} --pcid {ポータル独自カテゴリの主キー}
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


# 環境変数の説明
|環境変数名|説明|備考|
|:--|:--|:--|
|APP_PORT|バックエンドAPIのサービスの公開ポート番号|-|
|SECRET_KEY|djangoで使用される署名用の秘密鍵|-|
|DB_HOST|DBのホスト名|localhostや開発サーバーではdocker-compose.ymlに記載されている`db`がホスト名|
|DB_NAME|DB名|POSTGRES_DBと合わせること|
|DB_USER|DBのユーザ名|POSTGRES_USERと合わせること|
|DB_PASS|DBのパスワード|POSTGRES_PASSWORDと合わせること|
|DB_PORT|DBのポート番号|5432固定|
|DEBUG|デバッグ機能|デバッグ用で例外発生時のエラー内容が参照できるようになる<br>True: 有効<br>False: 無効<br>※本番リリース時は必ず「False」を設定してください|
|ALLOWED_HOSTS|公開ホスト名|本番リリースする際は本番サーバーのホスト名を設定してください|
|LOGGER_LEVEL|ロガーレベル|ログファイルの出力基準で以下を指定可能<br>DEBUG/INFO/WARNING/ERROR/CRITICAL|
|IMAGE_DIR|画像ファイルの公開ディレクトリ（相対パス指定）|本番リリースする際は本番サーバーの公開ディレクトリを設定してください|
|JUDGE_BADGE|バッジ判定方法|version:<br>JSONのversionフィールド値の末尾がwisdomならば能力バッジとみなす<br>※本番リリース用<br><br>alignments:<br>JSONにalignmentsがあれば能力バッジとみなす<br>※動作確認用|
|PER_PAGE|1ページあたりのデータ数|APIのクエリパラメータとしてページ番号(page_number)が指定可能な場合、同APIの1ページあたりのデータ数|
|POSTGRES_DB|DB名|-|
|POSTGRES_USER|DBのユーザ名|-|
|POSTGRES_PASSWORD|DBのパスワード|-|


# DBの確認
## ローカル環境
1. SQLクライアントツールから参照
   * サーバー名: 127.0.0.1
   * データベース名: develop
   * ユーザID/パスワード: postgres
   * ポート番号: 5433

## 開発サーバー
1. db コンテナを通してコマンド実行
   例えば、スキーマとデータのエクスポートを行う場合は以下。
   ```
   docker-compose exec db pg_dump -h 127.0.0.1 -p 5432 -d develop -U postgres -t portal_category -t issuer -t wisdom_badges -t knowledge_badges -t criteria -t categorised_badges -t consumer -t framework -t field -t stage -t goal --data-only > /tmp/chiloportal.dump
   ```
   パスワードを入力する。
   ```
   Password:postgres
   ```

# djangoの管理画面
```
{ドメイン}/admin
```

* SQLを使用せずともdjangoの管理画面からデータを作成することは可能です（1件毎の手入力となりますので効率は下がります）

# ログファイル
ファイルサイズ上限は100MBでローリングし、7日間バックアップを行います。(下記ログは Python が入っているコンテナ「app」に格納)  
1. バックエンドAPI
   ```
   /var/log/chiloportal/backend-api.log
   ```
1. インポートコマンド
   ```
   /var/log/chiloportal/import.log
   ```
1. 備考  
   app コンテナに入るためのコマンド
   ```
   docker-compose exec app sh
   ```
   コンテナから出るためのコマンド
   ```
   exit
   ```

# Pythonの追加パッケージのインストール時

1. pipコマンドにより Python のパッケージをインストールした場合、下記コマンドを実行し requirements.txt を更新してください。  
   ```
   pip freeze > requirements.txt
   ```


# 単体テストのカバレッジ取得

1. 下記コマンド実行後、htmlcov/index.html にカバレッジが出力されるので、未走行パスを確認して必要に応じて消化してください。  
   ```
   coverage run --source='.' manage.py test && coverage report && coverage html
   ```
