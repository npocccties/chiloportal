# frontend

## 動作環境

- OS: Unix 系（Windows では [WSL](https://docs.microsoft.com/ja-jp/windows/wsl/install) 等をお使いください）
- Node.js: [Active LTS](https://nodejs.org/en/about/releases/)

## 開発

動作環境を用意したのち、ローカル環境にて以下のコマンドを実行すると開発サーバーが起動します。

```shell
corepack yarn install # NPM パッケージのインストール
corepack yarn dev # 開発サーバーの起動
```

[http://localhost:3000](http://localhost:3000) にブラウザーでアクセスすることで、開発中のアプリケーションを確認することができます。

## 環境変数

| 変数名                           | 説明                                        | デフォルト値 |
| :------------------------------- | :------------------------------------------ | :----------- |
| NEXT_PUBLIC_API_MOCKING          | API モックの使用をするか否か（真偽値[^yn]） | 偽           |
| NEXT_PUBLIC_API_BASE_URL         | API のベースとなる URL                      | なし         |
| NEXT_PUBLIC_MOODLE_DASHBOARD_URL | Moodle ダッシュボードの URL                 | なし         |

[^yn]: [yn](https://github.com/sindresorhus/yn#readme)によって truly/falsy な値として解釈されます

## デプロイ

### Vercel

以下のデプロイボタンから、 Vercel に Next.js プロジェクトを作成してデプロイすることができます。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnpocccties%2Fchiloportal%2Ftree%2Fmain%2Ffrontend)

詳細は [Next.js の公式ドキュメント](https://nextjs.org/docs/deployment#managed-nextjs-with-vercel)を参照してください。

### セルフホスティング

動作環境を用意したのち、本番環境にて以下のコマンドを実行すると本番サーバーが起動します。

```shell
corepack yarn install --immutable # NPM パッケージのインストール
corepack yarn build # アプリケーションのビルド
corepack yarn start # 本番サーバーの起動
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
