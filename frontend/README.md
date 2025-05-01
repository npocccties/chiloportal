# frontend

## 動作環境

- OS: Unix 系（Windows では [WSL](https://docs.microsoft.com/ja-jp/windows/wsl/install) 等をお使いください）
- Node.js: [Active LTS](https://nodejs.org/en/about/releases/)
- Docker (任意)

## 開発

動作環境を用意したのち、ベアメタル環境あるいは Docker 環境にて以下のコマンドを実行すると開発サーバーが起動します。

開発サーバーが起動したのち、ブラウザーで[http://localhost:3000](http://localhost:3000) にアクセスすることで、開発中のアプリケーションを確認することができます。

### ベアメタル環境

モックサーバーを有効化し、フロントエンドの開発サーバーを起動する場合は、以下の手順を実施してください。

```shell
npm i -g corepack # パッケージマネージャーをバージョン管理するツールのインストール https://yarnpkg.com/corepack
yarn install # NPM パッケージのインストール
yarn dev # 開発サーバーの起動
```

モックサーバーを無効化し、バックエンドの開発サーバーを使用しつつ静的サイト生成の動作確認をする場合は、以下の手順を実施してください。

```shell
yarn install # NPM パッケージのインストール
cat << EOL > .env.test # テスト用環境変数の用意
> NEXT_PUBLIC_API_MOCKING=false # モックサーバーを無効化
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_BASE_URL=<ベースとなる URL>
> NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL=<Shibboleth SP ログイン URL>
> EOL
NODE_ENV=test yarn build # テスト環境変数でのアプリケーションのビルド
yarn start # テストサーバーの起動
```

### Docker 環境

```shell
cp .env.development .env # 環境変数の用意 (別途 .env.test 作成でも可)
docker build -t frontend -f ../Dockerfile.frontend .. # Docker イメージのビルド
docker run --rm -p 3000:3000 frontend # Docker コンテナの起動
```

## 環境変数

| 変数名                               | 説明                                           | デフォルト値                               |
| :----------------------------------- | :--------------------------------------------- | :----------------------------------------- |
| JWT_DEBUG_VALUE                      | デバッグ用 JWT                                 | なし                                       |
| JWT_VERIFICATION_KEY_BASE64          | JWT 署名検証鍵（PEM 形式）の Base64 エンコード | なし                                       |
| NEXT_PUBLIC_API_BASE_URL             | API のベースとなる URL                         | なし                                       |
| NEXT_PUBLIC_API_MOCKING              | API モックの使用をするか否か（真偽値[^yn]）    | 偽                                         |
| NEXT_PUBLIC_API_PER_PAGE             | API におけるページネーションのページあたり件数 | `30`                                       |
| NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH | バッジ発行者の画像のパス                       | `"issuer/image.png"`                       |
| NEXT_PUBLIC_BADGE_ANALYSIS_URL       | バッジ分析の URL                               | "https://badge-analysis.example.org/"      |
| NEXT_PUBLIC_BASE_URL                 | ベースとなる URL                               | "https://portal.example.org/"              |
| NEXT_PUBLIC_CHILOWALLET_API_BASE_URL | バッジウォレット API のベースとなる URL        | "https://chilowallet.example.org/api/v1/"  |
| NEXT_PUBLIC_CHILOWALLET_BASE_URL     | バッジウォレットのベースとなる URL             | "https://chilowallet.example.org/"         |
| NEXT_PUBLIC_GOOGLE_TAG_ID            | Google Analytics に使用する Google タグ ID     | なし                                       |
| NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL  | Shibboleth SP ログイン URL                     | "https://shibboleth-sp.example.org/login"  |
| NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL | Shibboleth SP ログアウト URL                   | "https://shibboleth-sp.example.org/logout" |

[^yn]: [yn](https://github.com/sindresorhus/yn#readme)によって truly/falsy な値として解釈されます

> [!NOTE]
>
> NEXT_PUBLIC\_\* に始まる環境変数はビルド時に参照され、アプリケーションのコードに埋め込まれますが、JWT_VERIFICATION_KEY_BASE64 環境変数は実行時（`yarn start` あるいは `docker run`）に環境変数の指定が必要です。

> [!TIP]
>
> JWT_VERIFICATION_KEY_BASE64 環境変数の値は Base64 エンコードする必要があります。`cat key.pub.pem | base64` のようなコマンドによって Base64 エンコードした鍵の値が得られます。

## 静的コンテンツ

### サンプル

examples ディレクトリに動作確認用のファイルが配置されています。contents ディレクトリに静的コンテンツを配置した場合、そちらを参照して表示します。contents ディレクトリ外の静的コンテンツについては参照しなくなります。

各静的コンテンツについて以下の条件で参照先を切り替えます。

- YAML ファイル: contents/\*\*/\*.(yml|yaml) ファイルが存在するか否か
- マークダウンファイル: contents/\*\*/\*.md ファイルが存在するか否か

### contents/\*\*/\*.(yml|yaml)

#### issuerId

おすすめのバッジやその他のコンテンツといった教育資源の所有者である発行機関の識別子を指定します。指定しない場合、大学連携が所有している教育資源とみなされます。

issuerId が重複した場合、[fast-glob](https://github.com/mrmlnc/fast-glob)がファイルを走査する順に依存した最初のファイルのみ本アプリケーションで使用されます。

#### backgroundImage

大学別ページで使用する背景画像のパスを指定します。指定しない場合、デフォルトの背景画像が使用されます。

背景画像は public フォルダに配置します。パスは public フォルダ直下をルート（`/`）とみなして記載してください。

#### recommendedWisdomBadgesIds

おすすめのバッジとして表示する能力バッジの id を指定します。指定可能な id の件数に上限はありません。

```yaml
recommendedWisdomBadgesIds:
  - 1
  - 2
  - 3
```

#### learningContents

その他のコンテンツとして表示する学習コンテンツを指定します。指定可能な学習コンテンツの件数に上限はありません。

```yaml
learningContents:
  - name: Example 1
    type: public
    url: https://example.com/
    description: Example 1 description
  - name: Example 2
    type: private
    url: https://example.com/
    description: Example 2 description
```

| 項目名      | 説明                                                                 |
| :---------- | :------------------------------------------------------------------- |
| name        | 学習コンテンツの名称、必須                                           |
| type        | 公開範囲の種類、 `"public"` と `"private"` いずれかの値、必須[^type] |
| url         | 学習コンテンツの URL、必須                                           |
| description | 学習コンテンツの説明、必須                                           |

[^type]: あくまで URL 先の学習コンテンツが公開であるか非公開であるか示すものであり、本アプリケーションとしてはいずれの値でも表示します。

### contents/\*\*/\*.md

> [!WARNING]
>
> マークダウンファイルは [MDX](https://mdxjs.com/docs/what-is-mdx/) パーサーによって React テンプレートに変換されます。[HTML ブロック](https://spec.commonmark.org/0.31.2/#html-blocks)を使用する際は React JSX テンプレートとして記述する必要があり、一部の HTML 属性（class, etc.）を受け付けないので注意してください。class 属性を使用したい場合は代わりに className プロパティを使用してください。

#### おしらせ

おしらせとして表示するマークダウンファイルを記述します。フロントマターのtypeプロパティに`"post"`を指定します。 `<url origin>/posts/<slug>` の静的なページが生成されます。トップページ、おしらせ一覧ページに配置されたマークダウンファイルへの動線（ハイパーリンク）が一覧されます。一覧は公開日降順でソートされます。公開日が同じ場合 [fast-glob](https://github.com/mrmlnc/fast-glob) で得られる結果に依存した並びになります。公開日は一覧の並び以外に影響しません。

#### メニュー

グローバルメニューに動線配置されるマークダウンファイルを記述します。フロントマターのtypeプロパティに`"menu"`を指定します。 `<url origin>/<slug>` の静的なページが生成されます。配置されたマークダウンファイルへの動線（ハイパーリンク）は用意されないため、別途動線の実装が必要です。

#### ページ

汎用的なマークダウンファイルを記述します。フロントマターのtypeプロパティに`"page"`を指定します。 `<url origin>/<slug>` の静的なページが生成されます。配置されたマークダウンファイルへの動線（ハイパーリンク）は用意されないため、別途動線の実装が必要です。

#### カスタム

大学連携が管理するトップページのカスタマイズ可能な領域を記述します（現状は発行機関別のカスタマイズに非対応で無視されます）。フロントマターのtypeプロパティに`"custom"`を指定します。複数カスタムのためのマークダウンファイルが存在した場合は2件目以降無視します。

#### フロントマター

| 項目名        | 説明                                                                                          |
| :------------ | :-------------------------------------------------------------------------------------------- |
| title         | タイトル、種類が `"custom"` 以外のとき必須                                                    |
| type          | マークダウンファイルの種類、`"post"` と `"menu"` と `"page"` と `"custom"` いずれかの値、必須 |
| issuerId      | 執筆者である発行機関の識別子、任意（ない場合大学連携が執筆したものとみなされます）            |
| slug          | URL に含まれる文字列、種類が `"custom"` 以外のとき必須                                        |
| datePublished | 公開日（RFC 3339 の日付形式）、種類が `"post"` のとき必須                                     |
| order         | 表示順、種類が `"menu"` のとき必須 (現状はorderによるソートに非対応で無視されます)            |

## デプロイ（セルフホスティング）

動作環境を用意したのち、ベアメタル環境あるいは Docker 環境にて以下のコマンドを実行すると本番サーバーが起動します。

### ベアメタル環境

```shell
cat << EOL > .env # 環境変数の用意
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_BASE_URL=<ベースとなる URL>
> NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL=<Shibboleth SP ログイン URL>
> EOL
yarn install --immutable # NPM パッケージのインストール
yarn build # アプリケーションのビルド
JWT_VERIFICATION_KEY_BASE64=xxx yarn start # 本番サーバーの起動
```

### Docker 環境

```shell
cat << EOL > .env # 環境変数の用意
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_BASE_URL=<ベースとなる URL>
> NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL=<Shibboleth SP ログイン URL>
> EOL
docker build -t frontend -f ../Dockerfile.frontend .. # Docker イメージのビルド
docker run --env JWT_VERIFICATION_KEY_BASE64=xxx --rm -p 3000:3000 frontend # Docker コンテナの起動
```

詳細は [Next.js の公式ドキュメント](https://nextjs.org/docs/deployment#self-hosting)を参照してください。

## スクリプト

Yarn が提供するサブコマンドについては [Yarn の公式ドキュメント](https://yarnpkg.com/cli)を参照してください。

### `yarn build`

アプリケーションをビルドします。

### `yarn dev`

開発サーバーを起動します。

### `yarn format`

テキストファイルを整形します。

### `yarn lint`

静的コード解析します。

### `yarn start`

本番サーバーを起動します。

## バッジウォレット API 仕様の更新

OpenAPI 形式の API 仕様を chilowallet リポジトリから git subtree で取得しています。

<details>

<summary>初回のコマンド</summary>

実行済みなので参考情報として参照してください（実行不要です）。

```shell
$ git remote add chilowallet git@github.com:npocccties/chilowallet.git # chilowallet リモートリポジトリを追加
$ pushd .. # トップレベルで実施が必要
$ git subtree add --prefix frontend/chilowallet --squash chilowallet main # git subtree 追加
$ popd
```

</details>

更新するには、次のコマンドを実行してください。

```shell
$ git remote add chilowallet git@github.com:npocccties/chilowallet.git # chilowallet リモートリポジトリを追加（追加していなかった場合）
$ pushd .. # トップレベルで実施が必要
$ git subtree pull --prefix frontend/chilowallet --squash chilowallet main # git subtree 更新
$ popd
```
