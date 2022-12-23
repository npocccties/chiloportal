# アーキテクチャの概要

## 全体構成

![アーキテクチャの構成図](docs/assets/arch.png)

## フレームワーク

### フロントエンド

#### [Next.js](https://nextjs.org/)

ウェブアプリケーションフレームワーク。

#### [Tailwind CSS](https://tailwindcss.com/)

CSSフレームワーク。

#### [Jumpu UI](https://github.com/tuqulore/jumpu-ui)

CSSフレームワークと協調するUIフレームワーク。一貫性のある見た目の実装に使用。

#### [Headless UI](https://headlessui.com/)

CSSフレームワークあるいはUIフレームワークと協調するヘッドレスUIフレームワーク。動的な振る舞いの実装に使用。

#### [Iconify](https://iconify.design/)

アイコンフレームワーク。

### バックエンド

#### [Django](https://www.djangoproject.com/)

Pythonで実装されたWebアプリケーションフレームワーク。
主に、Django REST framework を使用しバックエンドAPIを実装している。

## DBスキーマの全体像

![DBスキーマの全体像](docs/assets/db_schema.png)

## DBテーブル定義

https://github.com/npocccties/chiloportal/tree/main/backend/sql/create_table.sql


## APIドキュメント

[OpenAPI仕様に準拠した仕様書](https://github.com/npocccties/chiloportal/blob/main/backend/doc/openapi.yaml)を参照してください。

## Code Map

### frontend

#### frontend ([code](https://github.com/npocccties/chiloportal/tree/main/frontend), [docs](https://github.com/npocccties/chiloportal/tree/main/frontend#readme))

フロントエンドアプリケーションを提供するサーバー。[Next.js](https://nextjs.org/)で実行。

#### frontend/components ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/components))

Reactコンポーネント。

#### frontend/contents ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/contents))

静的なページとして表示するマークダウンファイル。詳細は[こちら](https://github.com/npocccties/chiloportal/tree/main/frontend#contentsmd-%E3%81%82%E3%82%8B%E3%81%84%E3%81%AF-overridescontentsmd)を参照してください。

#### frontend/lib ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/lib))

ユーティリティやヘルパー関数。補助的な機能の提供。

#### frontend/mocks ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/mocks))

バックエンドモックサーバー。[MSW](https://mswjs.io/)で実行。

#### frontend/overrides ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/overrides))

静的コンテンツの上書き。詳細は[こちら](https://github.com/npocccties/chiloportal/tree/main/frontend#%E4%B8%8A%E6%9B%B8%E3%81%8D)を参照してください。

#### frontend/pages ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/pages))

データフェッチ関数とReactコンポーネントをもとに作られる実体とそれらのルーティング。

#### frontend/posts ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/posts))

おしらせとして表示するマークダウンファイル。詳細は[こちら](https://github.com/npocccties/chiloportal/tree/main/frontend#postsmd-%E3%81%82%E3%82%8B%E3%81%84%E3%81%AF-overridespostsmd)を参照してください。

#### frontend/public ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/public))

画像など静的ファイルの提供。バッジ、コンシューマー、ポータルカテゴリーの画像を追加するには[能力バッジのインポート](https://github.com/npocccties/chiloportal/blob/main/INSTALL.md#%E8%83%BD%E5%8A%9B%E3%83%90%E3%83%83%E3%82%B8%E3%81%AE%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E6%99%82)をおこなってください。

#### frontend/schemas ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/schemas))

[JSON Schema](https://json-schema.org/)。バリデーションに使用。

#### frontend/styles ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/styles))

スタイルシート。

#### frontend/templates ([code](https://github.com/npocccties/chiloportal/tree/main/frontend/templates))

[Atomic Design MethodologyにおけるTemplates](https://atomicdesign.bradfrost.com/chapter-2/#templates)。Reactコンポーネント。

### backend

#### backend/chiloportal/admin.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/admin.py))

* Django の管理画面で DB に対して編集を行うことが出来るが、その対象を定義。
* models.py の中のクラスを指定。

#### backend/chiloportal/apps.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/apps.py))

アプリケーション構成を定義。

#### backend/chiloportal/enums.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/enums.py))

列挙型を定義。

#### backend/chiloportal/exceptions.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/exceptions.py))

例外クラスを定義。

#### backend/chiloportal/management/commands/import_badge.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/management/commands/import_badge.py))

能力バッジのインポートコマンドを定義。

#### backend/chiloportal/models.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/models.py))

DBテーブル定義で示した各テーブルとのデータのやりとりを行うクラス群を定義。

#### backend/chiloportal/responses.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/responses.py))

各APIのレスポンスを定義。

#### backend/chiloportal/swagger.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/swagger.py))

SwaggerUI 用のパラメータを定義。

#### backend/chiloportal/urls.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/urls.py))

下記のURLディスパッチャを定義。
* openapi.yaml（Chiloportal の OpenAPI を記載）
* SwaggerUI

#### backend/chiloportal/utils.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/utils.py))

ユーティリティクラスを定義。

#### backend/chiloportal/views ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/views))

[Chiloportal の OpenAPI](https://github.com/npocccties/chiloportal/tree/main/backend/doc/openapi.yaml) に記載された各APIのリクエストハンドラーを定義。

#### backend/chiloportal/tests ([code](https://github.com/npocccties/chiloportal/tree/main/backend/chiloportal/tests))

単体テストコードを定義。

#### backend/project/asgi.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/project/asgi.py))

ASGIを定義。

#### backend/project/settings.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/project/settings.py))

* Django の動作設定。
* 環境変数はここで受け渡している。

#### backend/project/urls.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/project/urls.py))

下記のURLディスパッチャを定義。
* Django の管理画面
* Chiloportal

#### backend/project/wsgi.py ([code](https://github.com/npocccties/chiloportal/tree/main/backend/project/wsgi.py))

WSGIを定義。

### docs/assets ([code](https://github.com/npocccties/chiloportal/tree/main/docs/assets))

ドキュメント用の図の画像など静的ファイルのためのディレクトリ。
