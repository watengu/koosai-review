# 復元区間 照合レポート（2026-10-31）

## 対象と照合先

- 対象: `neon/schema.sql` の【復元区間】（reviews の status 以降のカラム、articles、links、clicks、check_log、ビュー review_axis_stats / ranking）
- 照合先:
  - 設計書 `~/workspace/personal-lane/koosai-club-site/design-2026-10-27.md` §6（L197-271）、§3・§4
  - `lib/types.ts` / `lib/scoring.ts` / `lib/data.ts`
  - `app/api/reviews/route.ts` / `app/go/[id]/route.ts`

## 結果サマリ

- 照合 14 項目: OK 13 件、MISMATCH 1 件（軽微。本ファイルで修正済み）
- ライブ Neon DB への再適用が必要な変更: ranking ビューの再作成（`create or replace view public.ranking` の再実行）1 件のみ。アプリコードは ranking ビューを参照していないため（ランキングは lib/data.ts の getRanking が scoring.ts で算出）、公開中の挙動への影響はない
- GitHub への push はしていない

## 項目別

### reviews（schema.sql L137-162）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 1 | status の check 値 `pending` / `approved` / `rejected`、既定 `pending` | OK | 設計書 L232。route.ts L82-84 が `status='pending'` 固定で INSERT。schema L140-141 |
| 2 | カラム構成: axis_ratings / body / author_age_range / author_area / used_period | OK | 設計書 L233（投稿者属性・利用時期・評価軸別★・本文）。types.ts L47-57（PublicReview）の全フィールドと一致。schema L142-146 |
| 3 | 内部カラム contact_email / screening_note / ip_hash が公開側に出ない | OK | 設計書 L234。data.ts L213・L219・L234 の SELECT は公開カラムのみで内部カラムを含まない。PublicReview 型にも含めない（types.ts L46 のコメントどおり）。schema L147-149 |
| 4 | axis_ratings の JSON 形 {axis_key: 1..5 の整数} と jsonb 型 | OK | route.ts L60-69 が整数 1〜5 のみを通して JSON.stringify で jsonb に INSERT（L80-84）。types.ts L50 は Record<string, number>。schema L142（jsonb not null default '{}'）|
| 5 | approved_at / created_at / updated_at の有無と型 | OK | data.ts が approved_at 降順で並べ（L215・L221）、types.ts L56-57 が created_at / approved_at を要求。schema L150-152（timestamptz）|

### articles（schema.sql L167-184）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 6 | カラム構成 slug / title / body / is_published / published_at | OK | 設計書 L237。types.ts L60-70（Article）と一致。data.ts L297-316 が is_published=true のみ取得 |
| 7 | kind の check 値 `column` / `editorial` | OK | 設計書 L237 の区分（コラム・編集部データ記事）に対応。types.ts L64 の `"column" \| "editorial"` と一致。schema L172-173 |
| 8 | item_id（設計書の主要カラム一覧に無い追加カラム） | OK | 設計書 L237 は「主要カラム」の列挙で網羅指定ではない。types.ts L65 と data.ts の mapArticle（L124-139）が item_id を読み、schema L174（nullable、on delete set null）と一致 |

### links（schema.sql L193-210）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 9 | カラム構成 item_id / url / kind / partner / note | OK | 設計書 L240・L343。partner / note は設計書 §6 からの復元どおり存在。schema L195-201 |
| 10 | kind の check 値 `official` / `affiliate` と is_active | OK | 設計書 L240（公式リンク・紹介報酬対象の区別）。types.ts L76 と一致。data.ts L190-197 と go/route.ts L22-25 が is_active=true のみ対象 |

### clicks（schema.sql L218-227）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 11 | カラム構成 link_id / created_at、および referrer / user_agent | OK | 設計書 L243（link_id / クリック日時）。go/route.ts L37-39 が link_id / referrer / user_agent を INSERT するため両カラムが必須で、schema L220-223 に存在 |

### check_log（schema.sql L234-243）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 12 | カラム構成 item_id / checked_at / note / source_url | OK | 設計書 L246（確認日・確認内容・出典URL）。schema L236-239。アプリコードからは参照されない編集部記録用テーブルで、過不足なし |

### ビュー（schema.sql L253-286）

| # | 項目 | 判定 | 根拠 |
|---|---|---|---|
| 13 | review_axis_stats: 出力カラム item_id / axis_key / avg_score / review_count、承認済みのみ・軸別平均（小数2桁） | OK | scoring.ts L40-57（averageRatings）と同計算（平均は小数2桁丸め、件数は母数）。schema L253-262。注記: ビューは review_axes に存在するキーのみ集計する。フォーム送信キーは定義済み軸のみ（ReviewForm が axes 由来）ため実質の差異は出ない |
| 14 | ranking: total_score の式は computeTotalScore と一致するが、scored_axes の数え方が不一致 | MISMATCH（軽微）→ 修正済み | 設計書 L269（DB ビューと scoring.ts で同じ式に揃える）。総和の式は一致（schema L269-272 と scoring.ts L17-32）。ただし修正前の `count(s.score)` は、無効化された軸（is_active=false）や review_axes に無い軸へのスコアも数えており、scoring.ts L27-31（有効な軸のスコアのみ数える）と定義がずれていた |

## 修正内容（neon/schema.sql のみ）

- ranking ビューの `count(s.score) as scored_axes` を `count(a.key) as scored_axes` に変更（schema.sql L273）。review_axes への LEFT JOIN が一致した行（＝有効な軸のスコア）だけを数えるため、computeTotalScore の scoredAxes と定義が揃う
- 変更はビューの SELECT 内の集計式 1 箇所のみ。他テーブル・他ビューへの影響なし

## 再適用メモ（未実施）

- ライブ Neon DB（プロジェクト koosai-review）の ranking ビューは修正前の定義のまま。反映するには修正後の `create or replace view public.ranking ...` 文だけを Neon に再実行すればよい（テーブル・データへの影響なし）
- 本照合では DB への再適用と GitHub push は行っていない
