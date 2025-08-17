# OAuth2 Proxy Sample

oauth2-proxyを使用してSSOを実装したWebアプリケーションのサンプルです。認証が完了したユーザーのみがアプリケーションにアクセスできます。

## 概要

このプロジェクトは以下の技術で構成されています：

- **oauth2-proxy**: SSO認証を搭載したリバースプロキシ
- **React Router v7**: Webアプリケーション
- **Docker Compose**: 開発環境とデプロイメント

## アーキテクチャ

```
ユーザー → oauth2-proxy → React Routerアプリ (内部ネットワーク)
```

- oauth2-proxyがリバースプロキシとして機能
- 認証されていないユーザーはIdpのグインページにリダイレクト
- 認証後、内部のWebアプリにプロキシ

## セットアップ

### 1. GitHub OAuth Appの設定
このリポジトリでは、githubのOAuth Appsを使用してSSOを実装しています。

1. [GitHub Developer Settings](https://github.com/settings/developers)でOAuth Appを作成
2. Authorization callback URLを `http://localhost/sso/callback` に設定
3. Client IDとClient Secretを取得

### 2. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、以下の値を設定：

```bash
cp .env.example .env
```

```env
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
OAUTH2_PROXY_COOKIE_SECRET="your_32_char_secret_key"
```

Cookie Secretは以下のコマンドで生成可能：

```bash
openssl rand -base64 32 | tr -- '+/' '-_'
```

### 3. アプリケーションの起動

```bash
docker-compose up -d
```

### 4. アクセス

- ブラウザで `http://localhost` にアクセスすると、GitHub認証が要求されます。
- `http://localhost:5187`で直接webアプリケーションに接続できないことが確認できます。
