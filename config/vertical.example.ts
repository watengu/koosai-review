/**
 * バーティカル設定ファイル（テンプレート兼・第1号バーティカル実例）
 * =====================================================================
 * このパッケージは「ジャンル非依存の口コミ・比較サイト基盤」です。
 * ジャンル固有の要素はすべてこの設定ファイルに分離してあります。
 *
 * 新しいジャンル（バーティカル）を立ち上げる手順:
 *   1. このファイルをコピーして config/verticals/<genre>.ts を作る
 *   2. 下記の値をそのジャンルのものに書き換える
 *   3. config/vertical.ts の import 先を新しいファイルに切り替える
 *   4. Supabase 側は supabase/schema.sql を流し、review_axes に
 *      この設定の axes を投入する（supabase/seed.example.sql 参照）
 *
 * 注意: 設計書で「未決・未確認」とされた事項は、ここでも確定させていません。
 * 仮置きの値には必ず「仮」とコメントを付けています。
 */

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

/** 評価軸の出どころ。editorial=編集部が一次情報から採点 / review_avg=実投稿の平均 */
export type AxisSource = "editorial" | "review_avg";

export interface AxisConfig {
  /** DB の review_axes.key と一致させる安定キー（英小文字スネークケース） */
  key: string;
  /** 表示名 */
  label: string;
  /** /method ページで公開する定義文 */
  description: string;
  /** 総合スコア算出時の重み（合計は任意。lib/scoring.ts で正規化する） */
  weight: number;
  /** 満点（通常 5） */
  maxScore: number;
  source: AxisSource;
}

export interface SpecFieldConfig {
  /** items.specs (jsonb) のキー */
  key: string;
  label: string;
  /** 表示整形。yen=円表記 / text=そのまま / list=配列を「、」連結 */
  format: "yen" | "text" | "list";
}

export interface PriceModelConfig {
  /** items テーブルの金額カラムに対応する表示ラベル（シミュレーター/スペック表用） */
  joinLabel: string; // 初期費用（入会金など）
  annualLabel: string; // 年額費用（年会費など）
  perUseLabel: string; // 1回あたり費用（セッティング料など）
}

export interface VerticalConfig {
  /** バーティカルの識別子 */
  id: string;
  /** サイト名（仮名可。その場合は仮である旨をコメントで明記する） */
  siteName: string;
  /** トップの見出し・説明文 */
  tagline: string;
  description: string;
  /** 掲載対象の呼称（例: クラブ / 店舗 / サービス）。UI 文言に差し込まれる */
  itemNoun: string;
  /** テーマカラー（Tailwind の brand 色に注入される） */
  theme: {
    primary: string;
    accent: string;
  };
  /** PR表記文（全ページ共通。ステマ規制対応のため記事冒頭相当の位置に常時表示する） */
  prNotice: string;
  /** 評価軸（DB の review_axes と対応） */
  axes: AxisConfig[];
  /** スペック表の項目（items.specs の jsonb キーと対応） */
  specFields: SpecFieldConfig[];
  /** 料金モデル（シミュレーター用） */
  priceModel: PriceModelConfig;
  /** 口コミ投稿フォームの補足文言 */
  reviewForm: {
    /** 投稿者の属性として任意で聞く項目のラベル例（個人を特定しない粒度に限る） */
    authorAgeLabel: string;
    authorAreaLabel: string;
  };
  /** 運営者情報（未確定の項目はプレースホルダのままにし、公開前に実値へ差し替える） */
  legal: {
    operatorName: string; // 仮: 運営者名・事業者名（未決）
    contactEmail: string; // 仮: 問い合わせ・削除要請の受付メール（未決）
    address: string; // 仮: 所在地表記（未決。表記の要否自体も要確認）
  };
}

// ---------------------------------------------------------------------------
// 第1号バーティカル: 交際クラブ版（設定実例）
// 根拠: ~/workspace/personal-lane/koosai-club-site/design-2026-10-27.md
// ---------------------------------------------------------------------------

export const koosaiClubVertical: VerticalConfig = {
  id: "koosai-club",
  // 仮: サイト名は未決（設計書§10）。仮名として置く。
  siteName: "交際クラブ比較案内（仮）",
  tagline: "男性向けに、根拠を全部開示して比較する交際クラブ案内所",
  description:
    "料金総額はシミュレーターで試算でき、順位は公開した採点式で決まり、口コミは承認制の実投稿だけを載せます。",
  itemNoun: "クラブ",
  theme: {
    primary: "#1f3a5f", // 仮: 落ち着いた紺（テーマカラーは未決）
    accent: "#b08d3e", // 仮: アクセントの金（未決）
  },
  prNotice:
    "当サイトは広告・紹介報酬を含むコンテンツを含みます。掲載順位は公開した採点式のみで決定し、契約の有無で操作しません。",
  axes: [
    {
      key: "cost_total",
      label: "料金総額",
      description:
        "入会金＋年会費＋セッティング料×想定回数（月2回×12か月）で年総額を算出し採点。公式料金表を一次確認する。",
      weight: 3, // 仮: 重みは設計書でも確定値が示されていないため仮置き
      maxScore: 5,
      source: "editorial",
    },
    {
      key: "price_transparency",
      label: "料金の透明性",
      description:
        "入会金・年会費・セッティング料の3項目を公式サイトで確認できるかを機械的に採点する。",
      weight: 2, // 仮
      maxScore: 5,
      source: "editorial",
    },
    {
      key: "staff",
      label: "スタッフ対応",
      description:
        "問い合わせ対応・面接時の対応の丁寧さ。実投稿口コミの軸別評価の集計のみで採点し、編集部は点数を付けない。",
      weight: 2, // 仮
      maxScore: 5,
      source: "review_avg",
    },
    {
      key: "speed",
      label: "セッティング速度",
      description:
        "登録から初回セッティングまでの速さ・成立率の体感。実投稿の集計。公式に日数目安があれば出典つきで併記する。",
      weight: 2, // 仮
      maxScore: 5,
      source: "review_avg",
    },
    {
      key: "member_quality",
      label: "女性会員の質",
      description:
        "会員の層・審査の厳しさ。実投稿の集計と公式の審査フロー情報に基づく。編集部の主観では付けない。",
      weight: 2, // 仮
      maxScore: 5,
      source: "review_avg",
    },
    {
      key: "cancel_policy",
      label: "キャンセル/返金条件",
      description:
        "キャンセル料、返金可否等の条件を各クラブの規約・免責条項から出典つきで確認し採点する。",
      weight: 1, // 仮
      maxScore: 5,
      source: "editorial",
    },
    {
      key: "area_coverage",
      label: "エリア充実度",
      description: "対応エリア数・主要都市での面接可否を公式情報から一次確認する。",
      weight: 1, // 仮
      maxScore: 5,
      source: "editorial",
    },
    {
      key: "safety",
      label: "安全性・運営体制",
      description:
        "デートクラブ規制条例の届出、運営会社情報の公開度、本人確認の方法を確認する。届出が確認できないクラブは掲載しない。",
      weight: 2, // 仮
      maxScore: 5,
      source: "editorial",
    },
  ],
  specFields: [
    { key: "operator", label: "運営会社", format: "text" },
    { key: "location", label: "所在地", format: "text" },
    { key: "member_count", label: "会員数（公式発表）", format: "text" },
    { key: "age_range", label: "年齢層", format: "text" },
    { key: "areas", label: "対応エリア", format: "list" },
    { key: "filing_status", label: "条例届出（編集部確認）", format: "text" },
  ],
  priceModel: {
    joinLabel: "入会金",
    annualLabel: "年会費",
    perUseLabel: "セッティング料（1回）",
  },
  reviewForm: {
    authorAgeLabel: "年代（例: 40代）",
    authorAreaLabel: "利用エリア（例: 東京）",
  },
  legal: {
    operatorName: "（未決：運営者名）", // 仮
    contactEmail: "（未決：受付メールアドレス）", // 仮
    address: "（未決：所在地表記）", // 仮
  },
};
