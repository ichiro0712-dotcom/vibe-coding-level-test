# Netlifyデプロイ手順

バイブコーディング レベル診断サイトをNetlifyにデプロイする手順です。

## 📋 前提条件

- Netlifyアカウント（無料で作成可能）
- Gemini API Key（Google AI Studioで取得）
- このプロジェクトのファイル一式

## 🔑 Gemini API Keyの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. "Create API Key" をクリック
4. API Keyをコピーして保存（後で使用）

## 🚀 デプロイ方法

### 方法1: Netlify UI経由（推奨・初心者向け）

#### ステップ1: Gitリポジトリの準備

1. GitHubで新しいリポジトリを作成

2. ローカルでGitを初期化してプッシュ:

```bash
cd /Users/kawashimaichirou/Desktop/バイブコーディング/ranktest

# Gitを初期化
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Vibe Coding Level Test"

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# プッシュ
git branch -M main
git push -u origin main
```

#### ステップ2: Netlifyでサイトを作成

1. [Netlify](https://app.netlify.com/) にアクセスしてログイン

2. "Add new site" → "Import an existing project" をクリック

3. "Deploy with GitHub" を選択

4. GitHubアカウントを連携（初回のみ）

5. 先ほど作成したリポジトリを選択

#### ステップ3: ビルド設定

以下の設定を入力:

- **Branch to deploy**: `main`
- **Build command**: （空欄のまま）
- **Publish directory**: `.` （ドット）
- **Functions directory**: `netlify/functions`

"Deploy site" をクリック

#### ステップ4: 環境変数の設定

1. デプロイ後、サイトの設定画面に移動

2. 左メニューから "Site configuration" → "Environment variables" をクリック

3. "Add a variable" をクリック

4. 以下を入力:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: （取得したGemini API Key）
   - **Scopes**: すべてのデプロイにチェック

5. "Create variable" をクリック

#### ステップ5: 再デプロイ

環境変数を設定したら、サイトを再デプロイ:

1. "Deploys" タブに移動
2. "Trigger deploy" → "Deploy site" をクリック

完了！数分でサイトが公開されます。

---

### 方法2: Netlify CLI経由（上級者向け）

#### ステップ1: Netlify CLIのインストール

```bash
npm install -g netlify-cli
```

#### ステップ2: Netlifyにログイン

```bash
netlify login
```

ブラウザが開くので、Netlifyアカウントでログイン

#### ステップ3: サイトの初期化

```bash
cd /Users/kawashimaichirou/Desktop/バイブコーディング/ranktest

netlify init
```

以下の質問に答える:

- **What would you like to do?**: Create & configure a new site
- **Team**: 自分のチームを選択
- **Site name**: 任意の名前（例: vibe-coding-test）
- **Build command**: （Enterを押してスキップ）
- **Directory to deploy**: `.` （ドット）
- **Netlify functions folder**: `netlify/functions`

#### ステップ4: 環境変数の設定

```bash
netlify env:set GEMINI_API_KEY "your_actual_api_key_here"
```

**注意**: `your_actual_api_key_here` を実際のAPI Keyに置き換えてください

#### ステップ5: デプロイ

```bash
netlify deploy --prod
```

完了！サイトのURLが表示されます。

---

## 🔍 デプロイ確認

デプロイが成功したら、以下を確認:

1. **トップページ** (`/`) にアクセスできるか
2. **診断テスト** (`/test.html`) が正常に動作するか
3. **結果ページ** で AIアドバイスが表示されるか（Gemini API連携の確認）
4. **管理画面** (`/admin.html`) で質問管理ができるか

## 🐛 トラブルシューティング

### Gemini APIが動作しない

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. Netlify管理画面 → Environment variables を確認
2. `GEMINI_API_KEY` が正しく設定されているか確認
3. 再デプロイを実行

### Functions のエラー

**原因**: Functions ディレクトリが正しく認識されていない

**解決方法**:
1. `netlify.toml` ファイルが正しく設定されているか確認
2. `functions = "netlify/functions"` の記述があるか確認

### ページが表示されない

**原因**: Publish directory の設定ミス

**解決方法**:
1. Netlify設定画面で Publish directory が `.` (ドット) になっているか確認
2. ファイルが正しくリポジトリにプッシュされているか確認

## 📊 カスタムドメインの設定（オプション）

独自ドメインを使用する場合:

1. Netlify管理画面 → "Domain management" をクリック
2. "Add custom domain" をクリック
3. ドメイン名を入力
4. DNSレコードを設定（Netlifyの指示に従う）

## 🔒 セキュリティ

- **API Key**: 必ず環境変数として設定し、コードに直接書かない
- **HTTPS**: Netlifyは自動的にHTTPSを有効化
- **アクセス制限**: 必要に応じてパスワード保護を設定可能

## 📈 アクセス解析

Netlifyの Analytics機能で、サイトのアクセス状況を確認できます（有料プランで利用可能）

---

## ✅ デプロイ完了後のチェックリスト

- [ ] トップページが表示される
- [ ] 診断テストが動作する
- [ ] 結果ページでAIアドバイスが取得できる
- [ ] 管理画面で質問管理ができる
- [ ] レスポンシブデザインが正しく表示される
- [ ] Gemini API Keyが環境変数として設定されている

すべてチェックが完了したら、デプロイ成功です！🎉

---

**質問やトラブルがあれば、GitHubのIssuesで報告してください。**
