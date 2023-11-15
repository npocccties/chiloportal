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
corepack yarn install # NPM パッケージのインストール
corepack yarn dev # 開発サーバーの起動
```

モックサーバーを無効化し、バックエンドの開発サーバーを使用しつつ静的サイト生成の動作確認をする場合は、以下の手順を実施してください。

```shell
corepack yarn install # NPM パッケージのインストール
cat << EOL > .env.test # テスト用環境変数の用意
> NEXT_PUBLIC_API_MOCKING=false # モックサーバーを無効化
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_MOODLE_DASHBOARD_URL=<Moodle ダッシュボードの URL>
> EOL
NODE_ENV=test corepack yarn build # テスト環境変数でのアプリケーションのビルド
corepack yarn start # テストサーバーの起動
```

### Docker 環境

```shell
cp .env.development .env # 環境変数の用意 (別途 .env.test 作成でも可)
docker build -t frontend . # Docker イメージのビルド
docker run --rm -p 3000:3000 frontend # Docker コンテナの起動
```

## 環境変数

| 変数名                               | 説明                                        | デフォルト値         |
| :----------------------------------- | :------------------------------------------ | :------------------- |
| NEXT_PUBLIC_API_MOCKING              | API モックの使用をするか否か（真偽値[^yn]） | 偽                   |
| NEXT_PUBLIC_API_BASE_URL             | API のベースとなる URL                      | なし                 |
| NEXT_PUBLIC_MOODLE_DASHBOARD_URL     | Moodle ダッシュボードの URL                 | なし                 |
| NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH | バッジ発行者の画像のパス                    | `"issuer/image.png"` |

[^yn]: [yn](https://github.com/sindresorhus/yn#readme)によって truly/falsy な値として解釈されます

## 静的コンテンツ

### 上書き

overrides ディレクトリに静的コンテンツを配置した場合、そちらを参照して表示します。overrides ディレクトリ外の静的コンテンツについては参照しなくなります。

各静的コンテンツについて以下の条件で参照先を切り替えます。

- config.yaml: overrides/config.yaml が存在するか否か
- contents/\*.md: overrides/contents ディレクトリが存在するか否か
- posts/\*.md: overrides/posts ディレクトリが存在するか否か

### config.yaml あるいは overrides/config.yaml

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

### マークダウンファイル

#### contents/\*.md あるいは overrides/contents/\*.md

静的なページとして表示するマークダウンファイルを記述します。 `<url origin>/<slug>` の静的なページが生成されます。配置されたマークダウンファイルへの動線（ハイパーリンク）は用意されないため、別途動線の実装が必要です。

#### posts/\*.md あるいは overrides/posts/\*.md

おしらせとして表示するマークダウンファイルを記述します。 `<url origin>/posts/<slug>` の静的なページが生成されます。トップページ、おしらせ一覧ページに配置されたマークダウンファイルへの動線（ハイパーリンク）が一覧されます。一覧は公開日降順でソートされます。公開日が未設定の場合は `"1970-01-01"` とみなします。公開日が同じ場合 [fsPromises.readdir()](https://nodejs.org/api/fs.html#fspromisesreaddirpath-options) で得られる結果に依存した並びになります。公開日は一覧の並び以外に影響しません。

#### フロントマッター

| 項目名        | 説明                                |
| :------------ | :---------------------------------- |
| title         | 記事のタイトル、必須                |
| slug          | 記事の URL に含まれる文字列、必須   |
| datePublished | 公開日（RFC 3339 の日付形式）、任意 |

## デプロイ（セルフホスティング）

動作環境を用意したのち、ベアメタル環境あるいは Docker 環境にて以下のコマンドを実行すると本番サーバーが起動します。

### ベアメタル環境

```shell
cat << EOL > .env # 環境変数の用意
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_MOODLE_DASHBOARD_URL=<Moodle ダッシュボードの URL>
> EOL
corepack yarn install --immutable # NPM パッケージのインストール
corepack yarn build # アプリケーションのビルド
corepack yarn start # 本番サーバーの起動
```

### Docker 環境

```shell
cat << EOL > .env # 環境変数の用意
> NEXT_PUBLIC_API_BASE_URL=<API のベースとなる URL>
> NEXT_PUBLIC_MOODLE_DASHBOARD_URL=<Moodle ダッシュボードの URL>
> EOL
docker build -t frontend . # Docker イメージのビルド
docker run --rm -p 3000:3000 frontend # Docker コンテナの起動
```

詳細は [Next.js の公式ドキュメント](https://nextjs.org/docs/deployment#self-hosting)を参照してください。

## スクリプト

Yarn が提供するサブコマンドについては [Yarn の公式ドキュメント](https://yarnpkg.com/cli)を参照してください。

### `corepack yarn build`

アプリケーションをビルドします。

### `corepack yarn dev`

開発サーバーを起動します。

### `corepack yarn format`

テキストファイルを整形します。

### `corepack yarn lint`

静的コード解析します。

### `corepack yarn start`

本番サーバーを起動します。
