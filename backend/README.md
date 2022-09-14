# Visual Studio Code
## 環境構築手順

1. Visual Studio Code に拡張機能「Remote - Containers」をインストール

1. `.env.local-debug`を複製し、複製したファイルを`.env`にリネーム

1. 表示 ⇒ コマンドパレット で「Remote-Containers: Open Folder in Container...」を選択し、backendフォルダを選択

1. コンテナのビルドが終了したら、ターミナル ⇒ 新しいターミナル で以降のコマンドを実行

1. 管理者作成
   ```
   python /workspace/manage.py createsuperuser
   ```

## デバッグ方法
### バックエンドAPI
1. 実行とデバッグで「Backend API」を選択し、F5キーを押下したのち、ブラウザから「http://localhost:8000/api/v1/swagger/」を参照することでSwaggerUIを使用可能
※SwaggerUIは環境変数「DEBUG=True」とすることで有効になります

### インポートコマンド
1. 実行とデバッグで「Import command」を選択し、F5キーを押下

## テスト方法
1. 実行とデバッグで「Unit Test」を選択し、F5キーを押下し、エラーがないことを確認

1. エラーがあればエラー発生箇所を修正してください

1. ソース修正した場合は、適宜「chiloportal/tests/*.py」にテストコードを追加してください


# 開発サーバー
## 環境構築手順

1. dockerおよびdocker-composeをインストール（詳細はググってください。「Rocky docker docker-compose」等で）

1. ファイル転送ソフトで「chiloportal/backend」の内容を開発サーバーにコピーする

1. docker-compose.ymlのあるbackendフォルダに移動
   ```
   cd backend
   ```

1. `.env.dev-server-debug`を複製し、複製したファイルを`.env`にリネーム
DBの認証情報やdjangoの秘密鍵を含めてますので、本番環境でも使用する場合は適宜変更してください。

1. コンテナの起動
   ```
   docker-compose up -d
   ```
   ※リビルドしたい場合は以下を実行（但しDBが消えるので必要に応じてバックアップをしておくこと）
   ```
   docker-compose build --no-cache
   ```

1. 管理者作成
   ```
   docker-compose exec app python /workspace/manage.py createsuperuser
   ```
   ※本番環境の管理者の認証情報は類推されにくいユーザ名およびパスワードを設定してください。

1. APIキーの作成
   ブラウザで`http://dev-portal.oku.cccties.org/admin`を参照し、作成した管理者でログインしたうえで、「API Keys」の追加からAPIキーを作成してください。
   作成すると、ブラウザのアドレスバーの下（Chromeの場合）にAPIキーが表示されるので、それをメモしてフロントエンドチームに配布してください。
   RESTful APIのヘッダーに指定する認証情報は以下の通りです。
   なお、本番環境でも同じことが言えますので、本番環境でもAPIキーの作成および配布は必要です。

   * キー名：Authorization
   * 値：Api-Key {APIキーの値} ※Api-Keyの後ろは半角スペースを入れる

1. コンテナログの確認
   ```
   docker-compose logs -f
   ```

1. コンテナの停止
   ```
   docker-compose stop
   ```

## デプロイ方法
### バックエンドAPI
コンテナが起動している前提で下記を行う。
1. バックエンドAPIサービス実行
   ```
   docker-compose exec -d app python /workspace/manage.py runserver --noreload --nothreading 0.0.0.0:8000
   ```

### インポートコマンド
コンテナが起動している前提で下記を行う。
1. インポート実行
   ```
   docker-compose exec app python /workspace/manage.py import_badge --url {能力バッジを取得するURL} --pcid {ポータル独自カテゴリの主キー}
   ```
1. 能力バッジIDの確認
   インポート実行するとコンソールに処理経過が出力され、最後に「wisdom_badge.id: {能力バッジID}」と出力される


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
|DEBUG|デバッグ用でブラウザからAPI参照できたり、例外発生時のエラー内容が参照できるようになる|True: 有効, False: 無効<br>※本番リリース時は必ず「False」を設定してください|
|ALLOWED_HOSTS|公開ホスト名|本番リリースする際は本番サーバーのホスト名を設定してください|
|LOGGER_LEVEL|ロガーレベル|ログファイルの出力基準<br>以下を指定可能<br>DEBUG/INFO/WARNING/ERROR/CRITICAL|
|POSTGRES_DB|DB名|-|
|POSTGRES_USER|DBのユーザ名|-|
|POSTGRES_PASSWORD|DBのパスワード|-|


# DBの確認
環境変数に設定しているDBのホスト名/DB名/DBのユーザ名/DBのパスワードおよび、ポート番号に「5433」を使用して、SQLツールにて接続してください。


# djangoの管理画面
```
{ドメイン}/admin
```


# ログファイル
ファイルサイズ上限は100MBでローリングし、7日間バックアップを行う。(下記ログはpythonが入っているコンテナ「app」に格納)
1. バックエンドAPI
   ```
   /var/log/chiloportal/backend-api.log
   ```
1. インポートコマンド
   ```
   /var/log/chiloportal/import.log
   ```
