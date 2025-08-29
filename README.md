# 楽器管理システム / Instrument Management Demo

React 18 + TypeScript + Vite + Supabase を使った最小構成のデモです。
メール/パスワード認証と、楽器データの作成・一覧・編集・削除（CRUD）のみを実装しています。

This is a minimal demo built with React 18, TypeScript, Vite and Supabase.
It implements email/password authentication and basic CRUD for instrument records.

## 技術要件 / Requirements

- **Vite** （本プロジェクトは Vite 前提。環境変数は VITE_ プレフィックス必須）
- **React 18** 
- **TypeScript**
- **Supabase** （Database / Auth / Realtime）

## 機能 / Features

- 楽器一覧表示（認証不要）
- 楽器の登録・編集・削除（認証必要）
- ユーザー認証（メール/パスワード）
- リアルタイム更新 ※他ユーザーの変更がリアルタイムで反映されます

## セットアップ / Setup

npm install
cp .env.example .env.local   # 環境変数テンプレをコピー
# .env.local を編集して Supabase の URL / KEY を設定
npm run dev                  # 開発サーバー起動

### Supabase設定

#### 1. テーブル作成
```sql
CREATE TABLE instruments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. RLS（Row Level Security）
このデモでは RLS を有効化し、次の方針でポリシーを作成
※本番では要件に応じて変更してください。

-SELECT: 誰でも閲覧可能（認証不要）
-INSERT / UPDATE / DELETE: 認証済みユーザーのみ許可

#### 3. リアルタイム有効化
Supabase管理画面で `instruments` テーブルのリアルタイムを有効にする

#### 4. 認証設定
- Email confirmation: 無効（本番環境では有効化推奨）

## プロジェクト構造/ Project Structure

```
src/
├── components/
│   ├── CreateInstrument.tsx   # 作成フォーム
│   ├── EditInstrument.tsx     # 編集フォーム
│   ├── Header.tsx             # ヘッダー
│   ├── InstrumentList.tsx     # 一覧
│   ├── Login.tsx              # ログイン
│   └── Register.tsx           # 新規登録
├── context/
│   ├── AuthContext.tsx        # 認証状態
│   └── InstrumentContext.tsx  # データ（CRUD+リアルアイム）
├── lib/
│   └── supabase.ts           # supabaseクライアント設定
└── App.tsx                   # メインアプリ
```

