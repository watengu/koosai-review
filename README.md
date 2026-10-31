# 口コミサイト・デフォルトパッケージ v0.1

ジャンル非依存の「口コミ・比較サイト」基盤（スキャフォールド）。
ジャンル固有の部分は **バーティカル設定ファイル** に分離してあり、設定を
差し替えるだけで別ジャンルの口コミサイトが立つ構造になっています。

第1号バーティカルとして **交際クラブ版** の設定を同梱しています
（根拠資料: `~/workspace/personal-lane/koosai-club-site/design-2026-10-27.md`、
検証: `~/workspace/personal-lane/research/koosai-club-review-deploy-check-2026-10-27.md`）。

技術: Next.js (App Router) + TypeScript + Tailwind CSS + Neon (Postgres)。
ホスティングは未決（Vercel Pro / Cloudflare Pages 等）のため、特定ホスティング
依存の機能は使っていません。

## 設計の核（ジャンル共通）

- **根拠の公開**: 順位は公開した採点式（評価軸×重み）で機械的に算出する。
  契約の有無で順位を操作しない。軸ごとに根拠・出典・確認日を表示する。
- **口コミは実投稿のみ**: 承認制（投稿→承認→表示の一方向）。自作自演や
  対価を伏せた依頼投稿は景表法（ステマ規制・優良誤認）に触れるため、
  仕組みとしても運用としても入れない。ダミー口コミ生成機能は意図的に無い。
- **鮮度の可視化**: 掲載対象ごとに最終確認日（last_checked_at）を表示する。
- **データ不足は正直に出す**: 採点できない軸は「データ不足」と表示し、
  非公開の金額は「非公開」と表示する。推測で埋めない。
- **PR表記の常時表示**: 全ページのヘッダー直下に PR バーを出す。

## 新しいバーティカル（ジャンル）の立ち上げ手順

1. **設定ファイルを作る**
   `config/vertical.example.ts` をコピーして `config/verticals/<genre>.ts` を作り、
   サイト名・対象の呼称・テーマカラー・PR表記文・評価軸・スペック項目・
   料金ラベル・運営者情報をそのジャンルのものに書き換える。
   未確定の値は勝手に確定させず、「仮」とコメントを付けてプレースホルダにする。
2. **有効化する**
   `config/vertical.ts` の import 先を新しいファイルに切り替える。
   アプリ側のコードはすべて `vertical` を参照しているため、ページ側の変更は不要。
3. **DB を用意する**
   新規 Neon プロジェクトに `neon/schema.sql` を流し、
   `neon/seed.sql` を参考に、そのジャンルの評価軸だけを
   `review_axes` に投入する（口コミや対象のダミーデータは投入しない）。
4. **環境変数を設定する**
   `.env.example` をコピーして `.env.local` を作り、Neon の接続文字列（DATABASE_URL）を入れる。
5. **対象データを投入する**
   一次確認した対象（items）とスコア・根拠（item_scores）、送客リンク（links）を
   編集部作業として投入し、確認履歴を check_log に残す。
6. **公開前にチェックする**
   `docs/deploy-checklist.md` の全項目（法務・表示・運用・未決事項）を確認する。

### 設定差し替えで変わるもの

| 変わるもの | 設定キー |
|---|---|
| サイト名・見出し・説明文 | `siteName` / `tagline` / `description` |
| 対象の呼称（クラブ/店舗/サービス等） | `itemNoun` |
| テーマカラー | `theme.primary` / `theme.accent` |
| PR表記文 | `prNotice` |
| 評価軸・重み・定義文（/method にも自動反映） | `axes` |
| スペック表の項目 | `specFields` |
| 料金ラベル（シミュレーター/詳細） | `priceModel` |
| 投稿フォームの属性ラベル | `reviewForm` |
| 運営者情報・削除窓口の連絡先 | `legal` |

変わらないもの: ページ構成、採点ロジック（lib/scoring.ts）、DB スキーマ、
口コミの承認フロー、クリック計測、PR バーの常時表示。

## ディレクトリ説明

```
app/                 Next.js App Router のページ群
  page.tsx           トップ（ランキング抜粋＋新着口コミ＋差別化の提示）
  ranking/           ランキング一覧（採点式で機械生成）
  compare/           比較表（PC=テーブル / スマホ=カードの二重表示）
  items/[slug]/      対象詳細（スペック表＋軸別スコアと根拠＋口コミ＋最終確認日＋公式CTA）
  reviews/           口コミ一覧 / 詳細
  reviews/post/      口コミ投稿（承認制の説明つき）
  simulator/         料金シミュレーター（モデルケース型）
  method/            評価方法（採点式の全文・口コミポリシー）
  about/             運営者情報・PR表記
  removal/           削除要請窓口（プロバイダ責任制限法対応）
  privacy/           プライバシーポリシー
  articles/          コラム・編集部記事（一覧/詳細）
  api/reviews/       口コミ投稿の受付API（検証＋ハニーポット＋pending保存）
  go/[id]/           送客リンクの計測つきリダイレクト
components/          Header / Footer / PrNotice / ItemCard / ReviewCard /
                     ScoreBar / Stars / ReviewForm / SimulatorClient
config/
  vertical.example.ts  バーティカル設定の型＋交際クラブ版の実例
  vertical.ts          現在有効な設定（差し替えポイント）
lib/
  db.ts              Neon クライアント（DATABASE_URL。サーバ専用）
  data.ts            データ取得層（未設定・失敗時は空に倒す）
  scoring.ts         採点ロジック（DB の ranking ビューと同式）
  simulator.ts       料金シミュレーターの計算
  format.ts          金額・日付・スペック値の表示整形
  types.ts           DB 行型
neon/
  schema.sql         8テーブル＋ビュー（汎用設計。アクセス制御はアプリ側クエリ条件）
  seed.sql           評価軸のシード例（交際クラブ版）
docs/
  deploy-checklist.md  デプロイ前チェックリスト（法務セーフ項目）
```

## DB スキーマと設計書の対応

| 汎用名（本パッケージ） | 設計書（交際クラブ版） |
|---|---|
| items | clubs |
| review_axes | review_axes |
| item_scores | club_scores |
| reviews | reviews |
| articles | articles |
| links | links |
| clicks | clicks |
| check_log | check_log |

詳細は `neon/schema.sql` 冒頭のコメントにも対応表があります。

## ローカル起動

```bash
npm install
cp .env.example .env.local   # DATABASE_URL を入れる（未設定でもページは開ける）
npm run dev
```

DB 未設定・未投入の状態では、各ページはエラーにならず「データがありません」の
空状態を表示します。Neon 側は SQL Editor で `neon/schema.sql` →
`neon/seed.sql` の順に流してください（評価軸のシードだけは任意のジャンル用に
書き換える）。

## 未決事項（勝手に確定させていないもの）

- **ホスティング**: Vercel Pro（月$20）か Cloudflare Pages 等かは未決。
  Vercel 無料枠は商用不可のため、収益化リンクを置くなら使えない（検証レポート条件1）。
- **サイト名・ドメイン**: 未決。設定ファイルのサイト名は仮名。
- **運営者情報・受付メール**: 未決。`config` の `legal` はプレースホルダのまま。
  公開前に実値へ差し替える（チェックリスト★項目）。
- **採点の重み**: 設計書に確定値が無いため、設定・シードとも「仮」の値。
- **送客の契約条件**: 歩合率・計測ID/リンクの発行形態・支払い条件は未確定。
  links テーブルの partner / note に記録する想定。
- **CAPTCHA**: 口コミ投稿の本実装時に Turnstile 等を入れるかは未決
  （現状はハニーポット＋承認制のみ）。
- **記事の描画**: v0.1 はプレーンテキスト段落描画。MDX 化は本実装の課題。

## 注意

- 口コミの自作自演を助ける機能（ダミー生成・自動投稿など）は意図的に作っていません。
  追加もしないでください（景表法リスク＋サイトの看板「根拠の公開」と矛盾）。
- `DATABASE_URL` はサーバ専用です。NEXT_PUBLIC_ を付けず、ブラウザ側のコードに渡さないこと。
