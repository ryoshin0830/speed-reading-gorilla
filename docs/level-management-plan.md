# レベル管理機能 実装計画書

## 1. 概要

現在ハードコードされているレベルシステムを、動的に管理可能なシステムに拡張します。

### 現状
- レベルは3つ固定：中級前半、中級レベル、上級レベル
- レベル情報はコード内にハードコード
- レベルの追加・変更・削除は不可能

### 目標
- レベルの追加・編集・削除を管理画面から実行可能
- レベル名の変更が即座に全画面に反映
- レベル削除時の既存コンテンツの適切な移行
- レベルの表示順序の管理

## 2. データベース設計

### 新規テーブル: levels

```sql
CREATE TABLE levels (
  id          TEXT PRIMARY KEY,        -- レベルコード (beginner, intermediate等)
  displayName TEXT NOT NULL,           -- 表示名 (中級前半、中級レベル等)
  orderIndex  INTEGER NOT NULL,        -- 表示順序
  isDefault   BOOLEAN DEFAULT FALSE,   -- デフォルトレベルフラグ
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

### Contentテーブルの変更

```sql
-- 外部キー制約を追加
ALTER TABLE contents 
ADD CONSTRAINT fk_level 
FOREIGN KEY (levelCode) REFERENCES levels(id) 
ON DELETE SET DEFAULT;
```

### 初期データ

```sql
INSERT INTO levels (id, displayName, orderIndex, isDefault) VALUES
('beginner', '中級前半', 1, true),
('intermediate', '中級レベル', 2, false),
('advanced', '上級レベル', 3, false);
```

## 3. API設計

### レベル管理API エンドポイント

#### GET /api/levels
全レベルの取得（orderIndex順）

#### POST /api/levels
新規レベルの作成
```json
{
  "id": "upper-intermediate",
  "displayName": "中上級レベル",
  "orderIndex": 3
}
```

#### PUT /api/levels/:id
レベルの更新（表示名、順序）
```json
{
  "displayName": "新しい表示名",
  "orderIndex": 2
}
```

#### DELETE /api/levels/:id
レベルの削除
- クエリパラメータ: `?targetLevelId=beginner` (移行先レベル)
- デフォルトレベルは削除不可
- 削除時に関連コンテンツを指定レベルに移行

#### PUT /api/levels/:id/set-default
デフォルトレベルの設定

## 4. UI設計

### 管理画面のレベル管理セクション

```
[レベル管理] タブ
├── レベル一覧
│   ├── [↑↓] 順序変更ボタン
│   ├── 表示名（編集可能）
│   ├── レベルコード（表示のみ）
│   ├── コンテンツ数
│   ├── デフォルトフラグ
│   └── [編集] [削除] ボタン
├── [新規レベル追加] ボタン
└── レベル追加/編集モーダル
```

### レベル削除時の確認ダイアログ

```
「中級レベル」を削除しますか？
このレベルには 5 個のコンテンツが存在します。

移行先レベルを選択してください：
[ドロップダウン: 他のレベル一覧]

[キャンセル] [削除して移行]
```

## 5. 実装手順

### Phase 1: データベース準備
1. Prismaスキーマの更新
2. マイグレーションの作成
3. 初期データのシード

### Phase 2: API実装
1. レベル管理APIの実装
2. 既存のContent APIの更新（レベル情報の結合）
3. エラーハンドリングの実装

### Phase 3: フロントエンド更新
1. レベル情報を動的に取得する仕組みの実装
2. level-constants.jsの廃止と新しいレベル管理システムへの移行
3. 各コンポーネントの更新

### Phase 4: 管理画面
1. レベル管理UIの実装
2. ドラッグ&ドロップによる順序変更機能
3. インライン編集機能

### Phase 5: テスト
1. レベル削除時のコンテンツ移行テスト
2. UI/UXテスト
3. パフォーマンステスト

## 6. 考慮事項

### データ整合性
- レベル削除時は必ず移行先を指定
- デフォルトレベルは常に1つ存在
- 最低1つのレベルは必須

### パフォーマンス
- レベル情報はキャッシュして頻繁なDB問合せを避ける
- レベル変更時は関連するキャッシュをクリア

### 互換性
- 既存のlevelCodeは維持（beginner, intermediate, advanced）
- 新規レベルのIDは英数字とハイフンのみ許可

### セキュリティ
- レベル管理は管理者権限必須
- APIレベルでの権限チェック

## 7. リスクと対策

### リスク1: 大量コンテンツの移行
- 対策: トランザクション処理とプログレス表示

### リスク2: 実行中のレベル削除
- 対策: 使用中チェックとソフトデリート

### リスク3: 表示崩れ
- 対策: 表示名の文字数制限（20文字）

## 8. 今後の拡張性

- レベルごとの色やアイコンのカスタマイズ
- レベル別の難易度指標の追加
- レベル推奨機能（ユーザーの成績に基づく）