import Link from "next/link";
import { getRanking } from "@/lib/data";
import { formatSettingFeeYen } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * ゴール再現版ホーム（ゴール: aijin-billionaire.com の区間構成を再現し、
 * テキストのみ当方のサンプルデータ・文面に差し替えた確定版）。
 * 数字はサンプルデータの実測値（2026-11-02 時点で本番データと照合済み）。
 */
const clubs = [
  { slug: "tokyo-ritz", name: "東京Ritz", feature: "創業40年以上の老舗・女性スタッフ対応・お試しあり", score: "93.2", join: "¥110,000", annual: "¥55,000", perUse: "¥33,000〜55,000", total: "¥957,000", areas: "東京（関東近辺が中心）", checked: "2026-11-03" },
  { slug: "minami-aoyama-classy", name: "南青山Classy", score: "89.3", join: "¥100,000", annual: "¥30,000", perUse: "¥30,000〜80,000", total: "¥850,000", areas: "東京・札幌・大阪・福岡", feature: "4都市対応・会員クラス制・写真は無加工", checked: "2026-11-03" },
  { slug: "sample-amethyst", name: "クラブ・アメジスト", feature: "関西特化・総額を抑えたコース", score: "77.8", join: "¥88,000", annual: "¥55,000", perUse: "¥19,800", total: "¥618,200", areas: "大阪・京都・神戸", checked: "2026-11-01" },
  { slug: "sample-etoile", name: "エトワール倶楽部", feature: "全国6都市に面接拠点", score: "75.6", join: "¥110,000", annual: "¥110,000", perUse: "¥22,000", total: "¥748,000", areas: "東京・大阪・名古屋・札幌・仙台・福岡", checked: "2026-11-01" },
  { slug: "sample-rin", name: "凛サロン倶楽部", feature: "入会金を抑えた始めやすい価格", score: "73.3", join: "¥55,000", annual: "¥33,000", perUse: "¥16,500", total: "¥484,000", areas: "東京・神奈川・千葉・埼玉", checked: "2026-11-01" },
  { slug: "sample-hakua", name: "クラブ白亜", feature: "新宿特化・紹介までの速さ", score: "71.1", join: "¥165,000", annual: "¥110,000", perUse: "¥27,500", total: "¥935,000", areas: "東京", checked: "2026-11-01" },
  { slug: "sample-vert", name: "サロン・ド・ヴェール", feature: "料金表が分かりやすい中核価格帯", score: "71.1", join: "¥220,000", annual: "¥220,000", perUse: "¥33,000", total: "¥1,232,000", areas: "東京・大阪・京都", checked: "2026-11-01" },
  { slug: "sample-lumiere", name: "ルミエール倶楽部", feature: "銀座の高級会員制", score: "66.7", join: "¥550,000", annual: "¥550,000", perUse: "¥55,000", total: "¥2,420,000", areas: "東京・大阪・名古屋・福岡", checked: "2026-11-01" },
  { slug: "sample-sogetsu", name: "倶楽部蒼月", feature: "青山・少人数で質を重視", score: "66.7", join: "¥330,000", annual: "¥330,000", perUse: "¥38,500", total: "¥1,584,000", areas: "東京・横浜", checked: "2026-11-01" },
  { slug: "sample-tsukikage", name: "クラブ月影", feature: "麻布の会員制・料金は面接時案内", score: "48.9", join: "¥440,000", annual: "¥440,000", perUse: "非公開", total: "試算不可", areas: "東京", checked: "2026-11-01" },
  { slug: "sample-regent", name: "リージェント", feature: "銀座の会員制・コース制", score: "46.7", join: "¥30,000", annual: "¥30,000", perUse: "¥25,000", total: "¥660,000", areas: "東京（銀座）", checked: "2026-11-03" },
];

const others = [
  { slug: "minami-aoyama-classy", name: "南青山Classy", score: "89.3", body: "南青山の高級交際クラブ（実在）。会員クラス制（ゴールド／プラチナ／VIP／VVIP）を取り、女性もクラス分けされています。写真は加工を一切せず、女性会員は全員が面談と身分証明書の提出を経て登録します。対応エリアは東京・札幌・大阪・福岡の4都市。入会金 ¥100,000／年会費 ¥30,000／セッティング費 ¥30,000〜、年間総額の目安は ¥850,000（入会クラスと最安クラスの女性で換算）です。", checked: "2026-11-03" },
  { slug: "sample-amethyst", name: "クラブ・アメジスト", score: "77.8", body: "関西（大阪・京都・神戸）に特化した交際クラブ。関西在住の方向けに、料金を抑えたコースを用意しています。会員数 約3,100名、女性20代中心。入会金 ¥88,000／年会費 ¥55,000／セッティング料 ¥19,800、年間総額 ¥618,200。最終確認日 2026-11-01。" },
  { slug: "sample-etoile", name: "エトワール倶楽部", score: "75.6", body: "全国6都市に面接拠点を持つ大手型の交際クラブ。出張先でも利用しやすいエリア網が特徴です。会員数 約8,900名（8社最大）、女性20代〜40代。入会金 ¥110,000／年会費 ¥110,000／セッティング料 ¥22,000、年間総額 ¥748,000。最終確認日 2026-11-01。" },
  { slug: "sample-rin", name: "凛サロン倶楽部", score: "73.3", body: "首都圏をカバーし、入会金を抑えた始めやすい価格設定の交際クラブ。その分、キャンセル条件は厳しめです。会員数 約5,400名、女性20代〜30代。入会金 ¥55,000／年会費 ¥33,000／セッティング料 ¥16,500、年間総額 ¥484,000。最終確認日 2026-11-01。" },
  { slug: "sample-hakua", name: "クラブ白亜", score: "71.1", body: "新宿のみに拠点を置く、東京特化の交際クラブ。エリアを絞る代わりに、面接から紹介までの速さを掲げています。会員数 約2,600名、女性20代〜30代。入会金 ¥165,000／年会費 ¥110,000／セッティング料 ¥27,500、年間総額 ¥935,000。最終確認日 2026-11-01。" },
  { slug: "sample-vert", name: "サロン・ド・ヴェール", score: "71.1", body: "六本木拠点の中核価格帯クラブ。料金表が分かりやすく、初めての方でも総額を把握しやすい構成です。会員数 約3,800名、女性20代〜40代。入会金 ¥220,000／年会費 ¥220,000／セッティング料 ¥33,000、年間総額 ¥1,232,000。最終確認日 2026-11-01。" },
  { slug: "sample-lumiere", name: "ルミエール倶楽部", score: "66.7", body: "銀座に面接サロンを構える、落ち着いた大人のための会員制交際クラブ。厳格な審査と丁寧なコンシェルジュ対応を掲げています。会員数 約6,500名、女性20代〜30代中心。入会金 ¥550,000／年会費 ¥550,000／セッティング料 ¥55,000、年間総額 ¥2,420,000。最終確認日 2026-11-01。" },
  { slug: "sample-sogetsu", name: "倶楽部蒼月", score: "66.7", body: "青山を拠点に、少人数・高品質を掲げる交際クラブ。登録人数を絞り、セッティングの質を重視する運営です。会員数 約4,200名、女性20代中心。入会金 ¥330,000／年会費 ¥330,000／セッティング料 ¥38,500、年間総額 ¥1,584,000。最終確認日 2026-11-01。" },
  { slug: "sample-tsukikage", name: "クラブ月影", score: "48.9", body: "麻布の会員制クラブ。セッティング料は非公開で、面接時に案内される形式です。審査は厳格とされています。入会金 ¥440,000／年会費 ¥440,000／セッティング料 非公開のため、年間総額は試算不可。この「総額が先に分からない」こと自体が、このサイトでの評価が下がる理由です。最終確認日 2026-11-01。" },
  { slug: "sample-regent", name: "リージェント", score: "46.7", body: "銀座を拠点とする会員制交際クラブ（サンプル）。面接を経た女性会員と、審査を経た男性会員をスタッフがつなぐ形で、一次会は30分から90分が目安とされています。入会金 ¥30,000／年会費 ¥30,000（初年度無料）／オファー料 ¥25,000〜、年間総額 ¥660,000。運営者情報は掲載準備中で、料金の一部（ASKコース・お手当）は個別設定のため、評価は最下位となっています。最終確認日 2026-11-03。" },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 border-l-[6px] border-brand bg-[#F2F5F9] px-4 py-2.5 text-xl font-bold leading-relaxed first:mt-0">
      {children}
    </h2>
  );
}

export default async function HomePage() {
  // 掲載状態に連動する（取り下げ＝is_published=false のクラブはホームからも消える）。
  // 取得に失敗した場合は全クラブ表示にフォールバックし、ホームを空白にしない。
  const ranking = await getRanking().catch(() => []);
  const published = ranking.length
    ? new Set(ranking.map((r) => r.item.slug))
    : new Set(clubs.map((c) => c.slug));
  const shown = clubs.filter((c) => published.has(c.slug));
  // ミラー表示でのみ生える、静的配列に無い掲載クラブ（＝確認中のクラブ本人）。
  // 通常表示では ranking の全件が静的配列に含まれるため空になり、表示は変わらない。
  const extraRanked = ranking.filter((r) => !clubs.some((c) => c.slug === r.item.slug));
  const top = shown[0];
  const total = shown.length + extraRanked.length;
  const realShown = [
    ...shown.filter((c) => !c.slug.startsWith("sample-")),
    ...extraRanked.filter((r) => !r.item.slug.startsWith("sample-")).map((r) => ({ name: r.item.name })),
  ];
  const ritzShown = published.has("tokyo-ritz");
  const classyShown = published.has("minami-aoyama-classy");
  const othersShown = others.filter((o) => published.has(o.slug) && o.slug !== top?.slug);
  // ランキング表の行: 静的クラブと追加クラブ（ミラーの確認中クラブ）を統合し、総合スコア降順に並べる。
  // 同点は静的側（掲載中クラブ）を先に置く（安定ソート）。通常表示では追加行が無いため従来どおり。
  type HomeRow = { slug: string; name: string; feature: string; score: string; join: string; annual: string; perUse: string; total: string; areas: string; checked: string };
  const yen = (n: number | null) => (n !== null ? `¥${n.toLocaleString()}` : "―");
  const extraRows: HomeRow[] = extraRanked.map((r) => {
    const areas = Array.isArray(r.item.specs?.areas)
      ? (r.item.specs.areas as string[]).join("・")
      : typeof r.item.specs?.location === "string"
        ? (r.item.specs.location as string)
        : "―";
    const annualTotal =
      r.item.price_join !== null && r.item.price_annual !== null && r.item.price_per_use !== null
        ? yen(r.item.price_join + r.item.price_annual + r.item.price_per_use * 24)
        : "―";
    return {
      slug: r.item.slug,
      name: r.item.name,
      feature: r.item.summary ? `${r.item.summary.split("。")[0]}。` : "新規掲載の確認中クラブ",
      score: r.totalScore !== null ? r.totalScore.toFixed(1) : "採点中",
      join: yen(r.item.price_join),
      annual: yen(r.item.price_annual),
      perUse: formatSettingFeeYen(r.item),
      total: annualTotal,
      areas,
      checked: r.item.last_checked_at ? r.item.last_checked_at.slice(0, 10) : "―",
    };
  });
  const rows: HomeRow[] = [...shown, ...extraRows].sort(
    (a, b) => (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0),
  );
  // 同率は同順位（例: 89.3 が2件なら両方とも2位）。
  const rankOf = (row: HomeRow) =>
    1 + rows.filter((x) => (parseFloat(x.score) || 0) > (parseFloat(row.score) || 0)).length;
  // 紹介枠のローテーション: 掲載中の実在クラブの間で、3時間ごとに決定的に切り替える（全訪問者で同じ表示）。
  // 取り下げ中のクラブは published に含まれないため、自動でローテーションから外れる。
  const realPublished = shown.filter((c) => !c.slug.startsWith("sample-"));
  const slot = Math.floor(Date.now() / (3 * 60 * 60 * 1000));
  const featured = realPublished.length > 0 ? realPublished[slot % realPublished.length] : top;
  const featuredRank = featured ? shown.findIndex((c) => c.slug === featured.slug) + 1 : 0;
  const realOthers = othersShown.filter((o) => !o.slug.startsWith("sample-"));
  return (
    <div className="leading-loose">
      <h1 className="text-2xl font-bold leading-relaxed">
        交際クラブおすすめ{total}社比較｜根拠を全部開示して選ぶ
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero.jpg" alt="銀座の夜のイメージ（サンプル）" className="mt-4 w-full rounded" />
      <p className="mt-1 text-right text-xs text-gray-400">イメージ写真（サンプル）</p>

      <p className="mt-4">交際クラブって、実際どこがいいのか分かりにくいですよね。料金はクラブごとに公開の仕方が違い、入会金だけ見ても総額は分かりません。</p>
      <p className="mt-3">このページでは、編集部が{total}社の料金・スペックを同じ条件でそろえて確認し、「結局どこがどう違うのか」の結論を出します。採点式は全文公開し、順位は契約の有無で操作しません。確認できなかった項目は、推測で埋めず、項目ごと表示しません。</p>
      <p className="mt-3 text-sm text-gray-500">※掲載中の{total}社のうち、実在クラブは「実在・公式確認済み」と表示した{realShown.map((c) => c.name).join("と")}の{realShown.length}社で、残り{total - realShown.length}社はデモ用のサンプルです。掲載順位は公開した採点式のみで決定します。</p>
      <p className="mt-3 text-sm text-gray-500">※交際クラブは、都内だけでも60〜100社あると言われる業界です。当サイトが「実在・公式確認済み」と表示するのは、編集部が公式サイトの情報と届出を実際に確認できたクラブだけに限っています。</p>

      {realShown.length >= 2 ? (
        <>
      <H2>結論：編集部が確認できた実在クラブは{realShown.length}社。決め手は「強みの違い」</H2>
      <p className="mt-4"><strong>東京Ritz（総合 93.2 / 100・{total}社中1位）</strong>は、創業40年以上の老舗で、料金がすべて公式に公開され、入会前に試せるのが強みです。入会金・年会費・紹介料（3クラス）が公式サイトに明示され、年間総額は ¥957,000（月2回・スタンダード換算）と先に計算できます。お試しキャンペーンでは紹介料のみで利用を始められ、東京都の条例届出も受理済みで、登録番号が公式サイトに明記されています。</p>
      <p className="mt-3"><strong>南青山Classy（総合 89.3 / 100）</strong>は、南青山の高級クラブで、会員クラス制と対応エリアの広さが強みです。女性もクラス分けされ、全員が面談と身分証明書の提出を経て登録し、写真は無加工で掲載されます。対応エリアは東京・札幌・大阪・福岡の4都市、年間総額の目安は ¥850,000（最安クラス換算）です。</p>
      <p className="mt-3">迷ったときの決め手は順位ではなく、強みの違いです。老舗の総合力と「まず試せる」形なら東京Ritz、クラス制の高級感と地方都市でも使える形なら南青山Classy。このページでは{total}社すべてを比較し、それぞれの特徴を解説しました。なお、この下の特集枠は実在クラブを平等に紹介するため3時間ごとに入れ替わります（順位・スコアは変わりません）。</p>
        </>
      ) : featured && !featured.slug.startsWith("sample-") ? (
        <>
      <H2>結論：編集部がいま紹介する実在クラブは{featured.name}</H2>
      <p className="mt-4"><strong>{featured.name}は、公式情報を確認できた実在クラブです。</strong>総合 {featured.score} / 100（{total}社中{featuredRank}位）。年間総額（月2回・1年）は {featured.total}、対応エリアは{featured.areas}です。式と重み、軸ごとの根拠は評価方法ページと詳細ページで全公開しています。</p>
      <p className="mt-3">この紹介枠は、実在クラブを平等に紹介するため3時間ごとに入れ替わります。順位とスコアは採点式で固定で、入れ替えで変わることはありません。このページでは{total}社すべてを比較し、それぞれの特徴を解説しました。</p>
        </>
      ) : top ? (
        <>
      <H2>結論：現在の掲載クラブで編集部が選ぶのは{top.name}</H2>
      <p className="mt-4"><strong>迷ったら、まずは現在の総合1位の{top.name}から検討してください。</strong>総合 {top.score} / 100 で、掲載中の{total}社で最も高いスコアです。年間総額（月2回・1年）は {top.total}、対応エリアは{top.areas}です。式と重み、軸ごとの根拠は評価方法ページと詳細ページで全公開しています。</p>
      <p className="mt-3">全員に{top.name}が最適とは限りません。このページでは{total}社すべてを比較し、それぞれの特徴を解説しました。</p>
        </>
      ) : null}
      <p className="mt-3">{total}社の違いを、先に一覧にしておきます。総合スコアは、編集部が料金の総額・公開度・運営対応などで付けたものです。</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="border border-[#D5DCE6] p-2">クラブ</th>
              <th className="border border-[#D5DCE6] p-2">特徴</th>
              <th className="border border-[#D5DCE6] p-2">総合スコア</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <td className="border border-[#D5DCE6] p-2 font-bold">
                  <Link href={`/items/${c.slug}`} className="text-brand hover:underline">{c.name}</Link>
                </td>
                <td className="border border-[#D5DCE6] p-2">{c.feature}</td>
                <td className="border border-[#D5DCE6] p-2 font-bold text-[#C73E2C]">{c.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4">交際クラブの相場感をつかむために、入会金とセッティング料の早見も置いておきます。</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="border border-[#D5DCE6] p-2">クラブ</th>
              <th className="border border-[#D5DCE6] p-2">入会金</th>
              <th className="border border-[#D5DCE6] p-2">セッティング料</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <td className="border border-[#D5DCE6] p-2">{c.name}</td>
                <td className="border border-[#D5DCE6] p-2 text-right">{c.join}</td>
                <td className="border border-[#D5DCE6] p-2 text-right">{c.perUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-gray-500">※金額はサンプルデータです。年会費を含む年間総額は次の比較表で並べています。</p>

      <H2>交際クラブおすすめ{total}社の比較表</H2>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="border border-[#D5DCE6] p-2">クラブ</th>
              <th className="border border-[#D5DCE6] p-2">総合</th>
              <th className="border border-[#D5DCE6] p-2">入会金</th>
              <th className="border border-[#D5DCE6] p-2">年会費</th>
              <th className="border border-[#D5DCE6] p-2">セッティング料</th>
              <th className="border border-[#D5DCE6] p-2">年間総額（月2回）</th>
              <th className="border border-[#D5DCE6] p-2">対応エリア</th>
              <th className="border border-[#D5DCE6] p-2">最終確認日</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <td className="border border-[#D5DCE6] p-2 font-bold">
                  <Link href={`/items/${c.slug}`} className="text-brand hover:underline">{c.name}</Link>
                </td>
                <td className="border border-[#D5DCE6] p-2 font-bold text-[#C73E2C]">{c.score}</td>
                <td className="border border-[#D5DCE6] p-2 text-right">{c.join}</td>
                <td className="border border-[#D5DCE6] p-2 text-right">{c.annual}</td>
                <td className="border border-[#D5DCE6] p-2 text-right">{c.perUse}</td>
                <td className="border border-[#D5DCE6] p-2 text-right font-bold">{c.total}</td>
                <td className="border border-[#D5DCE6] p-2">{c.areas}</td>
                <td className="border border-[#D5DCE6] p-2">{c.checked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-3 md:hidden">
        {rows.map((c) => (
          <article key={c.slug} className="rounded border border-[#D5DCE6] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold">
                <span className="mr-2 text-brand-accent">{rankOf(c)}位</span>
                <Link href={`/items/${c.slug}`} className="text-brand hover:underline">{c.name}</Link>
                {!c.slug.startsWith("sample-") && (
                  <span className="ml-2 rounded bg-[#B08D3E] px-2 py-0.5 text-xs font-bold text-white">実在</span>
                )}
              </h3>
              <p className="shrink-0 text-right">
                <span className="text-xs text-gray-500">総合</span>{" "}
                <span className="text-xl font-bold text-[#C73E2C]">{c.score}</span>
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-600">{c.feature}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded bg-gray-50 p-2">
                <dt className="text-xs text-gray-500">入会金</dt>
                <dd className="font-bold">{c.join}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2">
                <dt className="text-xs text-gray-500">年会費</dt>
                <dd className="font-bold">{c.annual}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2">
                <dt className="text-xs text-gray-500">セッティング料</dt>
                <dd className="font-bold">{c.perUse}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2">
                <dt className="text-xs text-gray-500">年間総額（月2回）</dt>
                <dd className="font-bold">{c.total}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-gray-500">対応エリア：{c.areas}／最終確認日 {c.checked}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 rounded border-2 border-brand bg-[#FBFCFE] p-4">
        <p><strong>この表の採点式</strong>：総合スコア＝評価軸（料金の総額3／料金の公開度2／スタッフ対応2／セッティング速度2／会員層2／キャンセル条件1／対応エリア1／運営体制の透明性2）の重み付き集計（100点満点）。口コミの平均は実投稿が集まるまで採点に入れず「データ不足」と表示します。</p>
      </div>

      <H2>交際クラブの選び方｜見るべき5つの基準</H2>
      <p className="mt-4">では何を基準に交際クラブを選ぶべきか。編集部が比較のときに必ず確認する5つの判断軸がこちら。</p>
      <h3 className="mt-8 text-lg font-bold">①女性の数と質</h3>
      <p className="mt-2">選択肢が多いほど、理想の相手に出会える確率は上がります。ただし数字は「延べ登録数」なのか「現在の会員数」なのかで意味が変わります。このサイトでは、各社が開示している会員数と女性の年齢層をそのまま並べています。実在クラブには会員数を公表していない社もあり、その場合は無いものとして扱い、数字を並べません。</p>
      <h3 className="mt-8 text-lg font-bold">②料金体系はトータルで比較する</h3>
      <p className="mt-2">入会金・年会費・セッティング料を合わせた年間トータルで比較しないと、本当の費用感は分かりません。入会金が安くてもセッティング料が高いクラブもあれば、その逆もあります。だからこのサイトの比較表は、月2回・1年での年間総額を主役にしています。お手当・食事代・ホテル代はクラブへ払う費用ではないので、総額には含めていません。</p>
      <h3 className="mt-8 text-lg font-bold">③対応エリア（全国展開しているか）</h3>
      <p className="mt-2">東京在住なら選択肢は多いですが、地方在住の方は使えるクラブが限られます。出張で複数都市を行き来する方は、対応エリアの広いクラブの方が使い勝手がいい。{classyShown && "実在クラブでは南青山Classyが4都市（東京・札幌・大阪・福岡）対応で、実在の中で最も広く使えます。"}「広さ」か「地元での密度」か、自分の生活圏で選んでください。</p>
      <h3 className="mt-8 text-lg font-bold">④動画プロフィールの有無</h3>
      <p className="mt-2"><strong>現時点では評価対象外。</strong>現在、比較に必要な動画プロフィールの情報を確認できていないため、本項目は評価対象外としています。確認できていない情報を根拠に順位を付けることはしません。</p>
      <h3 className="mt-8 text-lg font-bold">⑤運営のサポート体制</h3>
      <p className="mt-2">見落とされがちですが、重要です。面接から紹介までの速さ、キャンセル条件、スタッフ対応の評判。このサイトでは「セッティング速度」「キャンセル条件」を独立した評価軸にして、各社の根拠とあわせて開示しています。あわせて、いつの情報か分かるよう、全社に最終確認日を付けています。</p>

      {featured ? (
        <>
      <H2>{featured.name}の特徴と編集部の評価</H2>
      <div className="mt-4 rounded border-2 border-[#B08D3E] bg-brand p-6 text-white">
        {featured.slug === "tokyo-ritz" && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/images/clubs/tokyo-ritz.jpg" alt="東京Ritzのイメージ（公式提供）" className="mb-5 h-52 w-full rounded object-cover object-top" />
        )}
        <p>
          <span className="rounded bg-[#B08D3E] px-2 py-1 text-xs font-bold text-white">第{featuredRank}位{featured.slug.startsWith("sample-") ? "" : "・実在クラブ"}</span>
        </p>
        <p className="mt-3 text-2xl font-bold tracking-wide">{featured.name}</p>
        <p className="mt-3 leading-relaxed text-gray-100">{featured.feature}</p>
        <p className="mt-3">
          総合スコア <span className="text-xl font-bold text-[#E9CF8F]">{featured.score} / 100</span>
          （{total}社中{featuredRank}位）｜対応エリア：{featured.areas}｜最終確認日 {featured.checked}
        </p>
        <p className="mt-4 text-gray-100">
          入会金 {featured.join}／年会費 {featured.annual}／セッティング料 {featured.perUse}。年間総額（月2回）は {featured.total} です。
        </p>
        <p className="mt-4">
          <Link href={`/items/${featured.slug}`} className="inline-block rounded bg-white px-5 py-2 font-bold text-brand">
            {featured.name}の詳細と根拠を見る
          </Link>
        </p>
      </div>
        </>
      ) : null}
      {realPublished.length >= 2 && (
        <p className="mt-2 text-sm text-gray-500">※この特集枠は、実在クラブを平等に紹介するため3時間ごとに入れ替わります（順位・スコアは変わりません）。</p>
      )}

      <H2>タイプ別おすすめ｜あなたに合う交際クラブはどこ？</H2>
      {featured?.slug === "tokyo-ritz" ? (
        <>
      <h3 className="mt-6 text-lg font-bold">初めて交際クラブを使う人 → 東京Ritz</h3>
      <p className="mt-2">いきなり入会金を払わなくていいのが理由です。東京Ritzにはお試しキャンペーンがあり、紹介料のみで利用を始めて、2回目以降の利用で本入会を判断できます。総合スコアも1位で、届出と運営歴が確認できる実在クラブです。関西にお住まいなら、大阪に対応する南青山Classyも候補になります。</p>
        </>
      ) : featured?.slug === "minami-aoyama-classy" ? (
        <>
      <h3 className="mt-6 text-lg font-bold">初めて交際クラブを使う人 → 南青山Classy</h3>
      <p className="mt-2">面談のときに登録女性の写真とプロフィールを見せてもらえ、その場で入会するかどうかを判断できるのが理由です。面談は希望の場所までスタッフが来てくれます。総合 {featured.score}（{total}社中{featuredRank}位）で、届出と運営方針が確認できる実在クラブです。</p>
        </>
      ) : null}
      {classyShown && (
        <>
      <h3 className="mt-8 text-lg font-bold">ハイクラスな女性と出会いたい人 → 南青山Classy</h3>
      <p className="mt-2">南青山の高級交際クラブです。会員クラス制（ゴールド／プラチナ／VIP／VVIP）を採用し、女性もクラス分けされています。女性会員は全員が面談と身分証明書の提出を経て登録し、写真は無加工で掲載。総合 89.3 は実在クラブで2位、年間総額の目安は ¥850,000（最安クラス換算）です。</p>
        </>
      )}
      {classyShown && (
        <>
      <h3 className="mt-8 text-lg font-bold">地方在住・出張が多い人 → 南青山Classy</h3>
      <p className="mt-2">対応エリアは東京・札幌・大阪・福岡の4都市で、実在クラブの中では最も広く使えます。面談は希望の場所までスタッフが来てくれる形で、出張の合間でも登録を進めやすい設計です。「地元にクラブがない」が起きにくいのが特徴です。</p>
        </>
      )}
      {ritzShown && (
        <>
      <h3 className="mt-8 text-lg font-bold">初期費用を抑えたい人 → 東京Ritz</h3>
      <p className="mt-2">コストの見方は2つあります。初期費用を抑えたいなら東京Ritzで、お試しキャンペーンにより紹介料のみで利用を始められ、本入会は2回目以降の利用で判断できます。一方、年間総額の目安で比べると南青山Classyの ¥850,000 が実在2社では低めで、東京Ritzは ¥957,000（スタンダード換算）です。「始めやすさ」か「年間の総額」かで選んでください。</p>
        </>
      )}

      <H2>ほかの交際クラブ{othersShown.length}社の特徴と編集部の評価</H2>
      <p className="mt-4">ここからは1位以外の{othersShown.length}社です。{ritzShown && realOthers.length === 1 ? "2位の南青山Classyは実在クラブで、その他8社はデモ用のサンプルクラブです。" : realOthers.length > 0 ? `${realOthers.map((o) => o.name).join("と")}は実在クラブで、その他${othersShown.length - realOthers.length}社はデモ用のサンプルクラブです。` : "以下はすべてデモ用のサンプルクラブです。"}評価はサンプルデータと公開している採点式に基づきます。</p>
      {othersShown.map((o) => (
        <div key={o.slug}>
          <h3 className="mt-8 text-lg font-bold">{o.name}（総合 {o.score}）</h3>
          <div className="mt-2 rounded border border-[#D5DCE6] p-4">
            {o.slug.startsWith("sample-") && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`/images/clubs/${o.slug}.jpg`} alt={`${o.name}のイメージ（サンプル）`} className="mb-3 w-full rounded" />
            )}
            <p>{o.body}</p>
            <p className="mt-2"><Link href={`/items/${o.slug}`} className="text-brand underline">{o.name}の詳細ページ</Link></p>
          </div>
        </div>
      ))}

      <H2>費用の目安｜年間総額を試算すると</H2>
      <p className="mt-4">月2回・1年続けた場合の年間総額（クラブへ払う費用のみ）で見ると、実在クラブでは南青山Classyが目安 ¥850,000、東京Ritzが ¥957,000（スタンダード換算）です。サンプル9社まで広げると ¥484,000 から ¥2,420,000 まで約5倍の幅があります（サンプル側の数字は、比較の物差しとしての試算です）。</p>
      <p className="mt-3">東京Ritz（スタンダード）で内訳を見ると、入会金 ¥110,000＋年会費 ¥55,000＋紹介料 ¥33,000×24回＝¥792,000、合計 ¥957,000。総額の8割超は「会うたびの料金」です。だからこそ、比較は入会金ではなく総額で見る必要があります。自分の回数での試算は、本サイトの<Link href="/simulator" className="text-brand underline">料金シミュレーター</Link>でできます。</p>

      <H2>体験談</H2>
      <p className="mt-4">体験談は、実在の利用者からの投稿だけを掲載します。運営が書いた体験談や口コミは掲載しません。</p>
      <h3 className="mt-6 text-lg font-bold">交際クラブの体験談</h3>
      <div className="mt-2 rounded border border-dashed border-[#B9C4D4] bg-[#FAFBFD] p-4">
        <p>現在、実投稿の受付準備中です。体験談はまだありません。投稿の受付を開始したら、この節に承認済みの体験談だけを掲載します。</p>
      </div>
      <h3 className="mt-8 text-lg font-bold">パパ活体験談</h3>
      <div className="mt-2 rounded border border-dashed border-[#B9C4D4] bg-[#FAFBFD] p-4">
        <p>現在、実投稿の受付準備中です。体験談はまだありません。架空の体験談は掲載しません。</p>
      </div>

      <H2>交際クラブのよくある質問</H2>
      <dl>
        <dt className="mt-6 font-bold">Q. 交際クラブの入会審査に落ちることはありますか？</dt>
        <dd className="mt-1">あります。審査の有無と厳しさはクラブごとに違います。このサイトでは、各社の審査や運営体制を「運営体制の透明性」の軸で評価し、各社のページに根拠を書いています。なお、実際に掲載するクラブは、出会い系サイト規制法の届出が確認できたクラブのみに限定する方針です{realShown.length > 0 ? `（${realShown.map((c) => c.name).join("と")}は届出を公式情報で確認済み。その他の掲載クラブはデモ用のサンプルです）` : "（掲載クラブはデモ用のサンプルです）"}。</dd>
        <dt className="mt-6 font-bold">Q. お手当は総額に入っていますか？</dt>
        <dd className="mt-1">入っていません。このサイトの総額は、入会金・年会費・セッティング料という「クラブへ払う費用」だけです。女性へ直接渡すお手当は当事者間で決まるものなので、相場として数字は出しません。</dd>
        <dt className="mt-6 font-bold">Q. ハイクラスな女性と出会えますか？</dt>
        <dd className="mt-1">クラブ選びと会員ランクによります。このサイトでは、各社が開示している会員数と女性の年齢層を比較表と各社のページにそのまま表示しています。開示情報の範囲で判断してください。</dd>
        <dt className="mt-6 font-bold">Q. 地方でも交際クラブは使えますか？</dt>
        <dd className="mt-1">使えますが、対応エリアはクラブで大きく違います。{ritzShown && "実在の東京Ritzは関東近辺が中心で地方在住でも利用可能と案内されており、"}{classyShown && "南青山Classyは東京・札幌・大阪・福岡の4都市対応です。"}比較表の「対応エリア」で、自分の生活圏に合うかを確認してください。</dd>
      </dl>

      <H2>交際クラブの基礎知識</H2>
      <p className="mt-4">交際クラブの仕組みや料金、評価の方法をもっと詳しく知りたい方向けに、本サイトに解説を用意しています。</p>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li><Link href="/method" className="text-brand underline">評価方法と比較のルール（採点式の全文）</Link></li>
        <li><Link href="/simulator" className="text-brand underline">料金シミュレーター（自分の回数で総額を試算）</Link></li>
        <li><Link href="/compare" className="text-brand underline">比較表（全項目で比べる）</Link></li>
        <li><Link href="/about" className="text-brand underline">運営者情報と料金の考え方</Link></li>
      </ul>

      <H2>関連サービス</H2>
      <h3 className="mt-6 text-lg font-bold">パパ活アプリ</h3>
      <div className="mt-2 rounded border border-dashed border-[#B9C4D4] bg-[#FAFBFD] p-4">
        <p>交際クラブほどの確実性はないものの、手軽に始められるのがパパ活アプリの強みです。この枠は関連サービスの紹介枠ですが、現在はサンプル公開のため、個別サービスの紹介は準備中です。リンクは置いていません。</p>
      </div>
      <h3 className="mt-8 text-lg font-bold">既婚者マッチングアプリ</h3>
      <div className="mt-2 rounded border border-dashed border-[#B9C4D4] bg-[#FAFBFD] p-4">
        <p>既婚者向けのマッチングサービスも、関連サービスとして紹介する枠です。現在はサンプル公開のため、個別サービスの紹介は準備中です。リンクは置いていません。</p>
      </div>

      <p className="mt-12 border-t border-[#D5DCE6] pt-4 text-sm text-gray-500">
        「実在・公式確認済み」と表示したクラブ以外は、すべて架空のサンプルデータで、実在のクラブとは関係ありません。口コミ・体験談は実投稿のみを掲載する方針で、現在は受付準備中です。
      </p>
    </div>
  );
}
