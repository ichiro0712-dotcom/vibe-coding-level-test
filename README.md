# バイブコーディング レベル診断サイト

バイブコーディングの会の参加者が、自身のAI活用レベルを診断できるWebサイトです。

## 🎯 機能

- **適応型診断テスト**: 20問の質問で、V0からV9までの10段階でレベルを判定
- **第1フェーズ**: 5問の初期スクリーニングで大まかなレベル帯を判定
- **第2フェーズ**: レベル帯に応じた15問の詳細質問
- **AI アドバイス**: Gemini APIを使った個別アドバイス
- **質問管理画面**: 質問の追加・編集・削除、重み付け、スコア範囲の調整が可能

## 🎨 デザイン

- カラースキーム: 黄色・黒・白・グレー
- レスポンシブデザイン対応
- シンプルでモダンなUI

## 📁 プロジェクト構成

```
/ranktest
├── index.html              # トップページ
├── test.html               # 診断テストページ
├── result.html             # 結果表示ページ
├── admin.html              # 質問管理ページ
├── css/
│   └── style.css          # 共通スタイル
├── js/
│   ├── test.js            # 診断ロジック
│   ├── result.js          # 結果表示ロジック
│   └── admin.js           # 質問管理ロジック
├── netlify/
│   └── functions/
│       └── gemini.js      # Gemini API呼び出し
├── data/
│   └── questions.json     # 質問データ
├── netlify.toml           # Netlify設定
├── package.json           # 依存関係
└── README.md              # 本ファイル
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、Gemini API Keyを設定:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:8888` にアクセス

## 📦 Netlifyへのデプロイ

### 方法1: Netlify CLI を使用

1. Netlify CLIをインストール（未インストールの場合）:

```bash
npm install -g netlify-cli
```

2. Netlifyにログイン:

```bash
netlify login
```

3. サイトを初期化:

```bash
netlify init
```

4. 環境変数を設定:

```bash
netlify env:set GEMINI_API_KEY "your_gemini_api_key_here"
```

5. デプロイ:

```bash
npm run deploy
```

### 方法2: GitHubと連携

1. このプロジェクトをGitHubリポジトリにプッシュ

2. [Netlify](https://app.netlify.com/)にログイン

3. "Add new site" → "Import an existing project"

4. GitHubリポジトリを選択

5. ビルド設定:
   - Build command: （空欄）
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

6. 環境変数を設定:
   - `GEMINI_API_KEY`: あなたのGemini API Key

7. "Deploy site"をクリック

## 🔑 Gemini API Keyの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス

2. "Create API Key"をクリック

3. 生成されたAPI Keyをコピーして、環境変数に設定

## 🛠 質問のカスタマイズ

### 管理画面から変更

1. ブラウザで `/admin.html` にアクセス

2. 質問の追加・編集・削除、重み付けの変更が可能

3. スコア範囲の調整も可能

4. 「変更を保存」をクリック

**注意**: 管理画面での変更は LocalStorage に保存されます（ブラウザ単位）

### データファイルを直接編集

`data/questions.json` を直接編集して、質問やスコア範囲を変更できます。

## 📊 レベル一覧

- **V0: オブザーバー** - AIを眺めて「すごいな〜」と言ってる段階
- **V1: リスナー** - AIに話しかけてみる。指示がうまく伝わらない
- **V2: プレイヤー** - 例を真似してAIを動かせるようになる
- **V3: チューナー** - トーン・文体・構成を微調整できる
- **V4: スクリプター** - コード構造、データ形式をAIに書かせられる
- **V5: アレンジャー** - AI同士やツールを組み合わせてワークフローを設計
- **V6: ストラクチャラー** - 出力構造を設計。RAGやAPIの意味も理解
- **V7: コンダクター** - AIをチームのように扱い、成果物を演出できる
- **V8: アーキテクト** - 複数のサービスをつなぎ、AIと人間の作業を統合
- **V9: バイブアルケミスト** - 感覚と構造を同時にデザイン。創造と制御が一体化

## 🤝 貢献

このプロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。

---

**Enjoy Vibe Coding! 🎉**
