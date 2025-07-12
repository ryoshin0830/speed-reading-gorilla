# SuiReN ― Japanese Speed Reading

日本語学習者のための速読練習ウェブサイト

## プロジェクト概要

SuiReNは、日本語学習者の読解流暢さ（Fluency）向上を目的とした速読練習ウェブサイトです。

### 主な機能

- 🦍 **モダンなデザイン**: ガラスモーフィズム効果とアニメーション付きUI
- 📚 **高度な文章管理**: 検索、フィルタリング、並び替え機能搭載
- 📖 **読解速度測定**: 読書時間とスクロール行動を自動記録
- 📝 **理解度テスト**: 選択式問題による理解度確認
- 📱 **QRコード結果**: 正答率に応じた色分けQRコード生成
- 📊 **統計ダッシュボード**: 文章数とレベル別統計の表示
- 🔧 **管理画面**: コンテンツ管理とシステム監視
- 🗄️ **データベース管理**: PostgreSQL + Prisma による動的コンテンツ管理
- 🔌 **REST API**: コンテンツのCRUD操作が可能なAPIエンドポイント
- 🖼️ **画像サポート**: Base64圧縮による複数画像対応・位置指定機能

### 練習ライブラリ機能

- **検索機能**: タイトルやIDでの高速検索
- **フィルタリング**: レベル別（中級前半・中級・上級）での絞り込み
- **並び替え**: ID順、タイトル順、レベル順、問題数順での表示
- **表示モード**: グリッドビューとリストビューの切り替え
- **ページネーション**: 大量のコンテンツにも対応
- **研究配慮**: 事前に文章内容を閲覧できない設計

### QRコード色分けシステム

- 🔴 **赤色**: 70%未満の正答率
- 🔵 **青色**: 70-80%の正答率
- 🟢 **緑色**: 80%以上の正答率

## 技術スタック

- **フレームワーク**: Next.js 15 + React 19
- **データベース**: PostgreSQL (Neon) + Prisma ORM
- **スタイリング**: Tailwind CSS（モダンアニメーション・ガラスモーフィズム）
- **QRコード**: qrcode ライブラリ
- **フォント**: Inter（モダンタイポグラフィ）
- **API**: REST API (Next.js App Router)
- **ホスティング**: Vercel
- **認証**: 基本パスワード認証

## リポジトリ情報

- **GitHub**: https://github.com/ryoshin0830/SuiReN
- **Vercelプロジェクト**: SuiReN

## セットアップ

### ローカル開発環境

```bash
# リポジトリのクローン
git clone https://github.com/ryoshin0830/SuiReN.git
cd SuiReN

# 依存関係のインストール
npm install

# 環境変数設定（.env.localファイルを作成）
# DATABASE_URL=your_neon_database_url_here

# Prismaセットアップ
npx prisma generate
npx prisma db push

# 初期データの投入（オプション）
node scripts/seed.js

# レベルマスタの初期化
node scripts/migrate-levels.js

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ページ構成

- `/` - ホームページ（モダンなヒーローセクションと詳細説明）
- `/about` - Fluency概念の詳細説明
- `/reading` - 読解練習ライブラリ（検索・フィルタリング機能搭載）
- `/admin` - 管理画面（パスワード: gorira）

## API エンドポイント

### コンテンツ管理 API

#### 全コンテンツ取得
```bash
GET /api/contents
```
**レスポンス例:**
```json
[
  {
    "id": "1-1",
    "title": "ももたろう",
    "level": "初級修了レベル",
    "levelCode": "beginner",
    "text": "むかし、むかし、あるところに...",
    "questions": [
      {
        "id": 1,
        "question": "おじいさんは何をしに山に行きましたか。",
        "options": ["しばかりに", "桃を取りに", "洗濯に", "買い物に"],
        "correctAnswer": 0
      }
    ]
  }
]
```

#### 特定コンテンツ取得
```bash
GET /api/contents/[id]
```

#### 新規コンテンツ作成
```bash
POST /api/contents
Content-Type: application/json

{
  "title": "新しい文章",
  "level": "中級レベル",
  "levelCode": "intermediate",
  "text": "文章の内容...\n\n{{IMAGE:img_001}}\n\n続きの文章...",
  "images": [
    {
      "id": "img_001",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA...",
      "alt": "説明画像",
      "caption": "画像のキャプション",
      "width": 800,
      "height": 600,
      "compressionRatio": "78.5"
    }
  ],
  "questions": [
    {
      "question": "問題文",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctAnswer": 1
    }
  ]
}
```

#### コンテンツ更新
```bash
PUT /api/contents/[id]
Content-Type: application/json

{
  "title": "更新された文章",
  "level": "上級レベル",
  "levelCode": "advanced",
  "text": "更新された内容...\n\n{{IMAGE:img_001}}\n\n文章続き...\n\n{{IMAGE:img_002}}\n\n最後の文章",
  "images": [
    {
      "id": "img_001",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA...",
      "alt": "更新された画像1",
      "caption": "新しい画像",
      "width": 800,
      "height": 600
    },
    {
      "id": "img_002", 
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA...",
      "alt": "追加画像2",
      "caption": "2番目の画像",
      "width": 800,
      "height": 600
    }
  ],
  "questions": [...]
}
```

#### コンテンツ削除
```bash
DELETE /api/contents/[id]
```

### API テスト例

```bash
# 全コンテンツ取得
curl http://localhost:3000/api/contents

# 新規作成
curl -X POST http://localhost:3000/api/contents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テスト文章",
    "level": "初級修了レベル",
    "levelCode": "beginner",
    "text": "これはテスト用の文章です。\n\n{{IMAGE:test_img_001}}\n\n画像付きの文章例です。",
    "images": [
      {
        "id": "test_img_001",
        "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA...",
        "alt": "美しい夕日の風景",
        "caption": "テスト用画像",
        "width": 800,
        "height": 600,
        "compressionRatio": "82.3"
      }
    ],
    "questions": [
      {
        "question": "この文章の目的は？",
        "options": ["練習", "テスト", "学習", "研究"],
        "correctAnswer": 1
      }
    ]
  }'

# 特定コンテンツ取得
curl http://localhost:3000/api/contents/1-1

# 削除
curl -X DELETE http://localhost:3000/api/contents/[id]
```

## 📝 コンテンツ管理ガイド

既存のコンテンツに問題を追加したり、新しいコンテンツを作成する方法について詳しく説明します。

### 🎯 既存コンテンツへの問題追加（推奨方法）

#### 方法1: 管理画面を使用（初心者向け）

1. **管理画面にアクセス**
   ```
   http://localhost:3000/admin
   パスワード: gorira
   ```

2. **コンテンツ一覧から対象を選択**
   - 「編集」ボタンをクリック

3. **問題セクションで問題を追加**
   - 「質問を追加」ボタンをクリック
   - 問題文を入力
   - 4つの選択肢を入力
   - 正解の選択肢を選択（0から始まるインデックス）
   - 「保存」をクリック

#### 方法2: API経由での問題追加（上級者向け）

**ステップ1: 現在のコンテンツIDを確認**
```bash
# 全コンテンツを取得してIDを確認
curl http://localhost:3000/api/contents | jq '.[] | {id: .id, title: .title}'
```

**ステップ2: 既存コンテンツに問題を追加**
```bash
# 例：仏教コンテンツ（ID: cmbn8uwb4000q4w2l7h3q0n8i）に問題を追加
curl -X PUT http://localhost:3000/api/contents/cmbn8uwb4000q4w2l7h3q0n8i \
  -H "Content-Type: application/json" \
  -d '{
    "title": "仏教",
    "level": "初級修了レベル", 
    "levelCode": "beginner",
    "text": "仏教の文章内容...",
    "images": [],
    "questions": [
      {
        "question": "ブッダは約（　　）年前に生きていました。",
        "options": ["500", "1,500", "2,000", "2,500"],
        "correctAnswer": 3
      },
      {
        "question": "ブッダの家は（　　）でした。",
        "options": ["お金がありません", "みんな病気", "とてもお金持ち", "幸せ"],
        "correctAnswer": 2
      }
    ]
  }'
```

### 📋 問題のデータ形式

#### 問題オブジェクトの構造
```json
{
  "question": "問題文（括弧付きでも可）",
  "options": [
    "選択肢1",
    "選択肢2", 
    "選択肢3",
    "選択肢4"
  ],
  "correctAnswer": 0  // 正解のインデックス（0-3）
}
```

#### レベル設定
```json
{
  "level": "初級修了レベル",    // 表示用レベル名
  "levelCode": "beginner"     // システム用コード
}

// 利用可能なレベル
// beginner: "初級修了レベル"
// intermediate: "中級レベル"  
// advanced: "上級レベル"
```

### 🎯 実践例：仏教コンテンツへの10問追加

以下は実際に仏教コンテンツに10個の問題を追加した例です：

**問題一覧と正解:**
1. ブッダは約（　　）年前に生きていました。 → **d. 2,500**
2. ブッダの家は（　　）でした。 → **c. とてもお金持ち**
3. ブッダは29歳の時、（　　）ので、家族と別れて家を出ました。 → **b. 問題の答えを探したかった**
4. 家を出た後、ブッダは最初に（　　）。 → **b. 先生に教えてもらいました**
5. ブッダが、木の下に座って考えたのは（　　）日間です。 → **b. 49**
6. ブッダによると、人は（　　）時、幸せになれません。 → **a. 物がほしい**
7. お坊さんは（　　）。 → **c. お金を持っていません**
8. お坊さんが着る服はふつう（　　）色です。 → **c. 黄**
9. ブッダの考えは、彼が（　　）に記録されました。 → **d. 死んだ後**
10. どの文が正しい (correct) ですか。 → **c. 仏教は、西洋の国にも広まりました。**

**完全なAPIコマンド例:**
```bash
curl -X PUT http://localhost:3000/api/contents/[CONTENT_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "title": "仏教",
    "level": "初級修了レベル",
    "levelCode": "beginner", 
    "text": "仏教の本文...",
    "images": [],
    "questions": [
      {
        "question": "ブッダは約（　　）年前に生きていました。",
        "options": ["500", "1,500", "2,000", "2,500"],
        "correctAnswer": 3
      },
      {
        "question": "ブッダの家は（　　）でした。",
        "options": ["お金がありません", "みんな病気", "とてもお金持ち", "幸せ"],
        "correctAnswer": 2
      }
      // ... 残り8問
    ]
  }'
```

### 🔧 トラブルシューティング

#### よくある問題と解決方法

**1. API更新時のエラー**
```
Error: Route "/api/contents/[id]" used `params.id`. `params` should be awaited
```
**解決済み**: Next.js 15対応済み（`await params`を使用）

**2. Prismaトランザクションタイムアウト**
```
Transaction timeout error (5000ms)
```
**解決済み**: タイムアウトを30秒に延長済み

**3. 正解インデックスの注意点**
- `correctAnswer`は0から始まります（0, 1, 2, 3）
- 選択肢の配列インデックスと一致させてください

**4. 文字エンコーディング**
- 日本語文字は自動的に適切にエンコードされます
- 特殊文字（括弧等）も問題なく使用可能

### 📊 問題追加の確認方法

**追加した問題を確認:**
```bash
# 特定コンテンツの問題一覧を表示
curl http://localhost:3000/api/contents/[CONTENT_ID] | jq '.questions[] | {id: .id, question: .question, correctAnswer: .correctAnswer}'

# 全コンテンツの問題数を確認
curl http://localhost:3000/api/contents | jq '.[] | {title: .title, questionCount: (.questions | length)}'
```

### 🚀 高度な機能

#### 一括問題追加スクリプト
```bash
#!/bin/bash
# 複数のコンテンツに問題を一括追加するスクリプト例

CONTENT_IDS=("id1" "id2" "id3")
for id in "${CONTENT_IDS[@]}"; do
  echo "Adding questions to content: $id"
  curl -X PUT "http://localhost:3000/api/contents/$id" \
    -H "Content-Type: application/json" \
    -d @"questions_${id}.json"
done
```

#### 問題のバックアップ
```bash
# 現在の全問題をバックアップ
curl http://localhost:3000/api/contents | jq '.' > content_backup_$(date +%Y%m%d).json
```

## 🖼️ 画像機能（Base64複数画像システム）

### 対応する画像形式
- **アップロード対応**: JPEG、PNG、WebP、GIF（最大10MB）
- **自動圧縮**: 最大800×600px、品質80%で最適化
- **Base64保存**: データベース内蔵でExternal依存なし
- **複数画像**: 一つの文章に複数の画像を任意の位置に配置可能

### 画像配置システム
- **プレースホルダー記法**: `{{IMAGE:画像ID}}` で文章内任意位置に配置
- **管理画面統合**: ドラッグ&ドロップでアップロード、ワンクリックで文章挿入
- **リアルタイムプレビュー**: 編集中にリアルタイムで最終表示確認
- **画像管理**: 個別編集・削除・メタデータ管理

### 圧縮・最適化機能
- **自動圧縮**: アップロード時に自動的にサイズ・品質最適化
- **圧縮率表示**: 元ファイルとの比較でデータ削減効果を可視化
- **バンドルサイズ管理**: 総画像データサイズをリアルタイム監視
- **パフォーマンス配慮**: 読み込み遅延やエラーハンドリング完備

### 管理画面での操作
- **画像アップロード**: ファイル選択で自動圧縮・プレビュー
- **メタデータ編集**: 代替テキスト・キャプション設定
- **配置操作**: 「テキストに挿入」ボタンでカーソル位置に自動挿入
- **統計表示**: 文字数・行数・画像数・配置済み画像数のリアルタイム表示

### データベース設計
```prisma
model Content {
  images Json? // 画像配列データ（Base64、メタデータ含む）
}
```

画像データ構造例:
```json
{
  "images": [
    {
      "id": "img_1a2b3c4d5e",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA...",
      "alt": "桜の花が咲いている公園",
      "caption": "春の美しい桜並木",
      "width": 800,
      "height": 600,
      "originalSize": 2048576,
      "compressedSize": 345678,
      "compressionRatio": "83.1"
    }
  ]
}
```

## 収録コンテンツ

### 初級修了レベル
- **桃太郎** - 1問（理解度確認問題付き）
- **仏教** - 10問（理解度確認問題付き）
  - ブッダの生涯、教え、仏教の特徴に関する問題
  - 2025年6月更新：包括的な理解度確認問題を追加

### 中級レベル
- エチオピアのコーヒー（問題未設定）

### 上級レベル
- （コンテンツ準備中）

### 問題設定状況
- ✅ 桃太郎：1問設定済み
- ✅ 仏教：10問設定済み（新規追加）
- ❌ エチオピアのコーヒー：問題未設定
- 📝 今後のコンテンツ：問題追加予定

## プロジェクトメンバー

- **光恵さん（Mitsue Tabata-Sandom）**: マッセイ大学、プロジェクト主導者
- **梁震さん（リョウ・シン）**: 京都大学、ITエンジニア・開発担当
- **松下達彦さん（たつさん）**: 国立国語研究所、アドバイザー

## 研究背景

このプロジェクトは国際交流基金助成金（4,000ドル）により実施され、多読プログラムで併用できる速読サイトの構築を通じて、日本語学習者の読解流暢さ向上を目指しています。

## ライセンス

このプロジェクトは研究・教育目的で開発されています。

## デプロイ

### 🌐 本番環境
**プロジェクトは既にVercelにデプロイ済みです！**

- **プロジェクト名**: SuiReN
- **デプロイ方法**: GitHubリポジトリから手動デプロイ
- **URL**: https://suiren.vercel.app （予想URL - 実際のURLを確認してください）

### 新規デプロイ
他の環境にデプロイする場合は、以下のボタンを使用してください：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryoshin0830/SuiReN)

## デザイン特徴

### モダンUI/UX
- **ガラスモーフィズム**: 透明感のあるカードデザイン
- **グラデーション**: 美しい色彩遷移
- **マイクロインタラクション**: ホバーエフェクトとアニメーション
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応

### SuiReNロゴ
- 日本的な美しさと静かさを表現
- 読書と学習をイメージしたデザイン

## 大規模コンテンツ対応

システムは数百の文章に対応できるよう設計されています：
- 効率的な検索・フィルタリング
- ページネーション（9件ずつ表示）
- パフォーマンス最適化
- 直感的なナビゲーション

## 今後の機能追加予定

- [x] ~~新しいコンテンツの追加機能~~ ✅ 完了
- [x] ~~既存コンテンツの編集機能~~ ✅ 完了  
- [x] ~~データベース統合~~ ✅ 完了
- [x] ~~REST API 機能~~ ✅ 完了
- [x] ~~画像サポート機能~~ ✅ 完了
- [x] ~~問題追加・編集機能~~ ✅ 完了（2025年6月）
- [x] ~~Next.js 15対応~~ ✅ 完了（API仕様更新対応）
- [ ] タグ機能とカテゴリ分類
- [ ] 学習データの分析機能
- [ ] 多言語対応（英語・中国語）
- [ ] 実際のWordファイルからのコンテンツ自動読み込み
- [ ] ダークモード対応
- [ ] ユーザー認証システム
- [ ] 学習進捗の保存機能
