# 1. 動作環境
- OS: Unix 系（Windows では WSL 等をお使いください）
- Node.js: v16.20.1
- Docker
- Docker Compose (v2)

# 2. setup
git clone実行後、ルートディレクトリで以下のコマンドを実行します。
```
./setup.sh
```

# 3. 開発

コンテナのビルド
```
docker compose -f docker-compose.dev-local.yml build
```

コンテナ起動
```
docker compose -f docker-compose.dev-local.yml up -d
```

appコンテナ内に移動
```
docker container exec -it chilowallet sh
```

コンテナのdown
```
docker compose -f docker-compose.dev-local.yml down
```

アプリケーションの起動（appコンテナ内）
```
npm run dev
```

## 3-1. アプリケーションとDBとの連携
appコンテナ内に移動した後、以下に記載している「prismaの使用方法」より、コマンドを実行してDBとの連携を行います。

## 3-2. Visual Studio CodeでdevContainerを使用する場合
1. Docker および Docker Compose をインストール
2. Visual Studio Code に拡張機能「Dev - Containers」をインストール
3. 当READMEのsetupを実行
4. コマンドパレット で「Remote-Containers: Open Folder in Container...」を選択し、chilowalletディレクトリを選択

## 3-3. デバッグ方法
上記のdevContainerを起動し、VSCodeの左側にあるデバッグから起動ボタンを押して実行してください。

## 3-4. prismaの使用方法
詳細に関しては[ドキュメント](https://www.prisma.io/docs/reference/api-reference/command-reference)を参照してください。

1. コンテナ起動後、以下のコマンドでDBのテーブル定義をschema.prismaに反映します。
```
npx prisma db pull
```

2. 立ち上げたDBコンテナへダミーデータを反映する場合は、以下のコマンドを使用してください。
```
npx prisma db seed
```

3. [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)を起動します。（localhost:5555が起動する）
```
npx prisma studio
```

## 3-5. ローカルで動かす場合
session_cookieというNameのeppn, displayNameをPayloadに含んだ署名付きJWTを用意します。

1. 秘密鍵、公開鍵のペアを用意する
1. [jwt.io](https://jwt.io/)等で鍵を作成したアルゴリズムを選択し、Payloadにeppn, displayNameプロパティを入力する。
1. 用意した秘密鍵、公開鍵を入力し、JWTを作成する
1. 環境変数の orthros_login_key_base64 に作成した公開鍵のbase64エンコードしたものを設定する
1. 立ち上がったアプリケーションのブラウザで開発者ツールを開き、Application > Cookiesで作成したJWTをValueに手打ちで入れる

上記の手順でアプリケーションが動作するようになります。

# 4. 開発サーバー（または本番サーバー）へのデプロイ

1. 下記をインストール
   * Docker
   * Docker Compose (v2)
   * Git  
1. 適当なディレクトリへ移動
   ```
   cd /opt
   ```
1. chilowallet のソースを取得
   ```
   git clone https://github.com/npocccties/chilowallet.git
   ```
   * 既にディレクトリが存在するならば `sudo rm -rf chilowallet` にて削除してください
1. chilowallet へ移動
   ```
   cd chilowallet
   ```
1. `*.sh` に権限付与
   ```
   sudo chmod 755 *.sh
   ```

1. ルートディレクトリで、`setup.sh` を実行する

1. デプロイ
   ```
   ./app_start.sh
   ```
   * 権限付与後の `app_start.sh` は何度でも実行可能です
   * 開発サーバー
      * `./app_start_dev.sh`を実行する
      * 停止は `./app_stop_dev.sh`を実行してください
      * http-portalを使用する場合は、.envにSSL_CERTS_DIR, ALLOWED_HOSTS を設定してください（詳細は[portal](https://github.com/npocccties/chiloportal/tree/main/backend#%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0)を参照）

1. 備考  
   コンテナ起動  
   ```
   chilowallet/app_start.sh
   ```

   コンテナ停止  
   ```
   chilowallet/app_stop.sh
   ```
   * DBが `/var/chilowallet.dump` にバックアップされます  

   コンテナ再起動  
   ```
   chilowallet/app_restart.sh
   ```
   * `app_stop.sh` と `app_start.sh` を呼びます

   DBのデータはvolumeによって保持されますが、万が一復元が必要な場合は後述のDBリストアコマンドを実行してください。

   DBバックアップ  
   ```
   chilowallet/server_db_backup.sh
   ```
   * DBが `/var/chilowallet.dump` にダンプ出力されます  
   * 上記ファイルは、環境変数 `DUMP_BACKUP_DIR` のディレクトリへ .tar.gz 形式で圧縮および格納されます
   * 古い圧縮ファイルは削除されます（環境変数 `DUMP_BACKUP_COUNT` で保持する期間を日数で指定）
   
   DBリストア  
   ```
   chilowallet/server_db_restore.sh
   ```
   * `/var/chilowallet.dump` にあるバックアップデータをもとにDBをリストア（復元）します  

   全てのコンテナログの確認  
   ```
   docker container logs -f
   ```
   * -f の後ろにコンテナ名（chilowalletやdb等）を入れると該当コンテナのみのログが見れます  

## 4-1. テストデータ作成（開発サーバー環境）
コンテナ起動後、chilowallet-appに入り、下記を実行
```
npx prisma db seed
```

もしType Error等で失敗する場合は、`npx prisma generate`を実行してから再度上記のコマンドを実行してください。

※ ビルドキャッシュなどの影響で、稀にschema.prismaの中身がローカルのファイルと異なった状態でコピーされていることがあります。その場合はdockerのキャッシュを適宜削除して再度コンテナを起動してください。


# 5. 環境変数
sampleに記載の値（client_idやclient_secrett等）はダミー値です。
運用環境に合わせて適宜設定して下さい。

サンプルの設定値では、文字列中に空白を含むものに対しては "" (ダブルクォーテーション) を使用しています。

## 5-1. DB, ビルド時用

.env
| 変数名                               | 説明                                        | デフォルト値         | 必須/任意|
| :----------------------------------- | :------------------------------------------ | :------------------- | :---- |
|DB_HOST|DBのホスト名|docker-compose.*.yml に記載されている`db`がホスト名|必須|
|DB_NAME|DB名|-|必須|
|DB_USER|DBのユーザ名|-|必須|
|DB_PASS|DBのパスワード|-|必須|
|DATABASE_URL|接続先データベースのURL|-|必須|
|LOG_LEVEL|ログレベル<br>'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'|info|必須|
|LOG_MAX_SIZE|ログファイルサイズ<br>単位には k / m / g のいずれか指定|100m|必須|
|LOG_MAX_FILE|ログファイルの世代数|7|必須|
|DUMP_BACKUP_DIR|DBの圧縮ファイルのバックアップディレクトリ（絶対パス指定）<br>DBバックアップを実行すると `/var/chilowallet.dump` をダンプ出力するが、そのダンプファイルを下記命名で圧縮したうえで左記ディレクトリに格納する<br>`chilowallet.dump_{yyyyMMdd}.tar.gz`|/var/chilowallet/db_dump_backup|必須|
|DUMP_BACKUP_COUNT|DBの圧縮ファイルの保持日数<br>・保持日数を経過したDBの圧縮ファイルは削除される (例)1週間、保持したい場合は `7` を指定する<br>・削除の契機は、DBバックアップの実行時<br>・起点は昨日|7|必須|

## 5-2. Next.jsアプリケーション用
Next.jsアプリケーションでは、環境毎に以下のパターンで.envファイルを参照します。

| ファイル名 |	読み込まれるタイミング
| :--------- | :--------- | 
|.env.local |	毎回
|.env.development |	next dev 時のみ
|.env.production	| next start 時のみ

https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

以下の2つの環境変数の値を記述します。

.env.development

.env.production

| 変数名                               | 説明                                        | デフォルト値         |必須/任意|
| :----------------------------------- | :------------------------------------------ | :------------------- | :---- |
|NEXT_PUBLIC_SERVICE_NAME|サービス名|バッジウォレット|必須|
|NEXT_PUBLIC_SERVICE_DESCRIPTION|サービスの説明<br>metaタグに設定される説明です。|バッジウォレットは、取得したOpen Badgeを格納、提出ができるアプリケーションです。|必須|
|NEXT_PUBLIC_COPYRIGHT|フッターに表示するコピーライト|-|必須|
|NEXT_PUBLIC_COPYRIGHT_LINK|フッターに表示するコピーライトのリンク|-|必須|
|NEXT_PUBLIC_E_PORTFOLIO_LINK|e-ポートフォリオシステムへのリンク<br>末尾にはスラッシュは付与しないこと|-|必須|
|NEXT_PUBLIC_LOGOUT_LINK|オルトロスのログアウトのリンク|-|必須|
|NEXT_PUBLIC_HELP_LINK|ヘルプのリンク|-|必須|
|baseURL|アプリケーション起動時のURL|http://localhost:3000|必須|
|clientName|アプリケーションの名称|chilowallet|必須|
|did_authority|VC発行者のDID|-|必須|
|vcApp_client_id|AzureクライアントID|-|必須|
|vcApp_azTenantId|AzureテナントID|-|必須|
|vcApp_client_secret|Azureクライアントシークレット|-|必須|
|vc_manifest_url|Entra Verified Idで発行者として登録しているmanifest url|-|必須|
|private_key_jwk|Walletの鍵情報（秘密鍵、公開鍵のペア）。詳細は「鍵の作成」項目に記載|-|必須|
|orthros_login_key_base64|Orthrosから発行されるJWTの署名に対応した公開鍵のbase64エンコード形式|-|必須|
|smtp_mail_server_host|メール送信サーバーのhost|-|必須|
|smtp_mail_server_port|メール送信サーバーのpost|-|必須|
|mail_sender_address|メール送信時のFromに設定されるaddress|-|必須|
|get_session_redirect_url|未ログイン時のリダイレクトURL|/redirect|必須|
|moodle_api_request_retry_count|MoodleのAPIアクセス失敗時のリトライ回数設定|-|必須|
|moodle_api_request_retry_time|MoodleのAPIアクセス失敗時のリトライ間隔（ms）設定|-|必須|
|smtp_mail_request_retry_count|メール送信用サーバーアクセス失敗時のリトライ回数設定|-|必須|
|smtp_mail_request_retry_time|メール送信用サーバーアクセス失敗時のリトライ間隔（ms）設定|-|必須|
|oepnbadge_verify_api_request_retry_count|openbadge検証用APIアクセス失敗時のリトライ回数設定|-|必須|
|oepnbadge_verify_api_request_retry_time|openbadge検証用APIアクセス失敗時のリトライ間隔（ms）設定|-|必須|
|ms_entra_id_api_request_retry_count|VC発行関連（Microsoft Entra Verified ID）アクセス失敗時のリトライ回数設定|-|必須|
|ms_entra_id_api_request_retry_time|VC発行関連（Microsoft Entra Verified ID）アクセス失敗時のリトライ間隔（ms）設定|-|必須|
|badge_cabinet_api_request_retry_count|CabinetのAPIアクセス失敗時のリトライ回数設定|-|必須|
|badge_cabinet_api_request_retry_count|CabinetのAPIアクセス失敗時のリトライ間隔（ms）設定|-|必須|
|vc_credential_issuer|Entra Verified Idの発行者|指定がなければvc_manifest_urlから該当情報を取得する|任意|


### 5-2-1. vc* に設定する環境変数について
Microsoft Entra Verified ID関連の環境構築は、wikiにある[「1.0 Microsoft Entra Verified ID環境」](https://github.com/npocccties/chilowallet/wiki/1.0-Microsoft-Entra-Verified-ID%E7%92%B0%E5%A2%83)項目に記載しています。
環境構築にあたって生成された値を設定してください。

did_authorityにはEntra Verified IDでの環境構築にあたって作成されたdidを設定してください。

### 5-2-2. 鍵の作成
「バッジウォレット」アプリケーションとしてDIDを発行するための秘密鍵、公開鍵を作成し環境変数 private_key_jwk に設定する必要があります。

node環境上（ローカル開発環境のコンテナ内など）で、下記を実行
（node_modulesにion-toolsがないと実行できません。npm installを行っていない場合は、scriptを実行する環境上で `npm install` を行ってください。もしnpm installで依存関係上の問題が発生する場合は `npm install --legacy-peer-deps` を実行してください）

※ nodeはv16を想定しています。

```
node keypair.ts
```
プロジェクトの直下にkey.txtというファイルで秘密鍵と公開鍵のキーペア (JWK) が作成されるので、出力された内容を環境変数に設定してください。

※ 鍵の情報は外部に漏れないよう大切に保管してください。

## 6. Moodleとの連携
DBに入り、「lms_list」テーブルに任意のMoodleを登録してください。

### 6.1 SSOを行うMoodleとの連携
ssoEnabledは対象のMoodleがOrthrosによってSSOされるかを判定します。SSOを行う場合はtrueを設定してください。

上記のssoEnabledをtrueにした場合、lmsAccessTokenの設定が必須になります。

設定方法
1. Moodle側で [Token generator](https://moodle.org/plugins/tool_token) プラグインをインストール
1. サイト管理 > サーバ > ウェブサービス > 外部サービス を確認し、Token Generator Service がサービスに追加されていることを確認。
   1. 「許可ユーザ」項目より、管理者権限のユーザーを許可ユーザーとして追加する。
   1. 「編集」をクリックし、「有効」にチェックを入れて変更を保存する。
1. 一般 > 拡張機能 より、「ウェブサービスを有効にする」にチェックを入れる
1. サイト管理 > サーバ > ウェブサービス > 外部サービス より、ページ下部の「追加」リンクをクリックする
   1. 名称: 任意の文字列で入力する
   1. 省略名: 名称に関連づく形でsnake_caseの形式で入力する（こちらの「省略名」がバッジ一覧取得URLに使用する文字列となります）
   1. 「有効」にチェックを入れて変更を保存する
1. 追加したサービスの「関数」を選択し、「関数を追加する」からcore_badges_get_user_badges を選択し、追加する
1. サイト管理 > プラグイン > 管理ツール > Token generator より、以下2点のチェックを入れる
   1. Enabled auth methodsで「Shibboleth」をチェックする
   1. Enabled userfieldsで「username」のみをチェックする
   1. Enabled servicesで4で追加したserviceにチェックする
1. サイト管理 > サーバ > ウェブサービス > トークンを管理する より、「トークンを作成する」を選択し、Token Generator Serviceを選択。Tokenを作成（ユーザーは2-1で設定した許可ユーザーから選択する）
1. Wallet側のDBに入り、7で発行したtokenをlms_access_tokenカラムに登録する
1. 8と同様に、4で作成したserviceの省略名をlms_serviceカラムに登録する

カラム登録の例
| lms_id          | lms_name      | lms_url         | ssoEnabled | lms_access_token | lms_service |
| :-------------- | :-------------| :-------------- | :--------- | :--------------- | :---------- |
|1| ○○学習サービス| https://example.service.com | true | af41a7413229f7ae31171b741d4fd89b | test_service |

### 6.2 SSOを行わないMoodleとの連携

Moodle側で下記のように設定し、Wallet側のDBにデータを登録してください。

1. サイト管理 > サーバ > ウェブサービス > 外部サービス より、ページ下部の「追加」リンクをクリックする
   1. 名称: 任意の文字列で入力する
   1. 省略名: 名称に関連づく形でsnake_caseの形式で入力する（こちらの「省略名」がバッジ一覧取得URLに使用する文字列となります）
   1. 「有効」にチェックを入れて変更を保存する
1. 追加したサービスの「関数」を選択し、「関数を追加する」からcore_badges_get_user_badges を選択し、追加する
1. サイト管理 > ユーザ > パーミッション > ロールを定義する > 任意のユーザー を選択し、編集から「webservice/rest:use」を許可する
1. Wallet側のDBに入り、1で作成したserviceの省略名をlms_serviceカラムに登録する

カラム登録の例
| lms_id          | lms_name      | lms_url         | ssoEnabled | lms_access_token | lms_service |
| :-------------- | :-------------| :-------------- | :--------- | :--------------- | :---------- |
|2| △△学習サービス| https://example.service.com | false |  | test_service |


参考資料
- [Githubリポジトリ](https://github.com/catalyst/moodle-tool_token)
- [ウェブサービスを使用する](https://docs.moodle.org/2x/ja/%E3%82%A6%E3%82%A7%E3%83%96%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)

## 7. キャビネットとの連携
バッジの提出先情報は、DBのbadge_consumersテーブルに保存されます。

以下の例のように、それぞれ対応した値を登録してください。

- consumer_name: 提出先の名称（Walletでリストに表示されます）
- cabinet_url: 提出先のURL。対象のキャビネットのURL（origin）を登録してください。

カラム登録の例
| consumer_id          | consumer_name      | cabinet_url        |
| :-------------- | :-------------| :-------------- |
|1| ○○市教育委員会 | https://example.com |

## 8. configの設定値
/configs/index.ts に設定されている固定値

基本的に設定の変更は不要です。

```
export const SERVICE_NAME = process.env.NEXT_PUBLIC_SERVICE_NAME;
export const SERVICE_DESCRITION = process.env.NEXT_PUBLIC_SERVICE_DESCRIPTION;
export const CUSTOME_SCHEMA = "openid-vc://";
export const REQUEST_URI_KEY = `${CUSTOME_SCHEMA}?request_uri`;
export const DID_ION_KEY_ID = "signingKey";
export const SIOP_VALIDITY_IN_MINUTES = 30;
export const REQUEST_RETRY_COUNT 3;
```

| 変数名                               | 説明                                        | 
| :----------------------------------- | :------------------------------------------ | 
|SERVICE_NAME|サービス名 環境変数で設定された値が代入されます|
|SERVICE_DESCRITION|サービスの説明<br>metaタグに設定される説明です。 環境変数で設定された値が代入されます|
|CUSTOME_SCHEMA|VCリクエスト時に使用するschema|
|REQUEST_URI_KEY|VCリクエストで返却されたurlを取得するためのkey|
|DID_ION_KEY_ID|VC発行リクエスト時の署名のDIDに付与するkey|
|SIOP_VALIDITY_IN_MINUTES|VC発行リクエスト時の署名の有効期限設定値|

### 8.1 外部リクエスト時のリトライ回数、間隔設定
/configs/retry.ts に設定されている値は、環境変数によって定義された各外部サービスに対するリトライ回数とリトライ間隔を定義したファイルです。

下記の形式に合わせて、設定した環境変数をConfig関数として割り当ててください。
```
export const moodleRetryConfig: RetryConfig = {
  count: Number(process.env.moodle_api_request_retry_count),
  time: Number(process.env.moodle_api_request_retry_time),
};
```

実際にリトライ処理を実装する場合は、以下のようにlib/retryRequest.ts に定義されている関数を使用してください。第一引数にPromiseを返却する関数、第二引数に先ほど定義したconfigデータを指定します。
```
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
```

