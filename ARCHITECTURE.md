# アーキテクチャの概要

## 全体構成

![アーキテクチャの構成図](docs/assets/arch.svg)

## フレームワーク

### フロントエンド

### バックエンド
* Django

## DBスキーマの全体像

![DBスキーマの全体像](docs/assets/db_schema.png)

## DBテーブル定義

https://github.com/npocccties/chiloportal/blob/develop/backend/sql/create_table.sql


## APIドキュメント

## Code Map

### frontend

### backend

#### chiloportal/admin.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/admin.py))

* Django の管理画面で DB に対して編集を行うことが出来るが、その対象を定義。
* models.py の中のクラスを指定。

#### chiloportal/apps.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/apps.py))

アプリケーション構成を定義。

#### chiloportal/enums.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/enums.py))

列挙型を定義。

#### chiloportal/exceptions.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/exceptions.py))

例外クラスを定義。

#### chiloportal/management/commands/import_badge.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/management/commands/import_badge.py))

能力バッジのインポートコマンドを定義。

#### chiloportal/models.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/models.py))

DBテーブル定義で示した各テーブルとのデータのやりとりを行うクラス群を定義。

#### chiloportal/responses.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/responses.py))

各APIのレスポンスを定義。

#### chiloportal/swagger.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/swagger.py))

SwaggerUI 用のパラメータを定義。

#### chiloportal/urls.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/urls.py))

下記のURLディスパッチャを定義。
* openapi.yaml（Chiloportal の OpenAPI を記載）
* SwaggerUI

#### chiloportal/utils.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/utils.py))

ユーティリティクラスを定義。

#### chiloportal/views ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/views))

[Chiloportal の OpenAPI](https://github.com/npocccties/chiloportal/blob/develop/backend/doc/openapi.yaml) に記載された各APIのリクエストハンドラーを定義。

#### chiloportal/tests ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/chiloportal/tests))

単体テストコードを定義。

#### project/asgi.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/project/asgi.py))

ASGIを定義。

#### project/settings.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/project/settings.py))

* Django の動作設定。
* 環境変数はここで受け渡している。

#### project/urls.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/project/urls.py))

下記のURLディスパッチャを定義。
* Django の管理画面
* Chiloportal

#### project/wsgi.py ([code](https://github.com/npocccties/chiloportal/blob/develop/backend/project/wsgi.py))

WSGIを定義。

### docs/assets ([code](https://github.com/npocccties/chiloportal/tree/main/docs/assets))

ドキュメント用の図の画像など静的ファイルのためのディレクトリ。
