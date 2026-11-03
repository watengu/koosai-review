import Link from "next/link";

/**
 * ゴール再現版ホーム（ゴール: aijin-billionaire.com の区間構成を再現し、
 * テキストのみ当方のサンプルデータ・文面に差し替えた確定版）。
 * 数字はサンプルデータの実測値（2026-11-02 時点で本番データと照合済み）。
 */
const clubs = [
  { slug: "tokyo-ritz", name: "東京Ritz", feature: "創業40年以上の老舗・女性スタッフ対応・お試しあり", score: "86.2", join: "¥110,000", annual: "¥55,000", perUse: "¥33,000", total: "¥957,000", areas: "東京（関東近辺が中心）" },
  { slug: "sample-amethyst", name: "クラブ・アメジスト", feature: "関西特化・総額を抑えたコース", score: "83.3", join: "¥88,000", annual: "¥55,000", perUse: "¥19,800", total: "¥618,200", areas: "大阪・京都・神戸" },
  { slug: "sample-etoile", name: "エトワール倶楽部", feature: "全国6都市に面接拠点", score: "82.2", join: "¥110,000", annual: "¥110,000", perUse: "¥22,000", total: "¥748,000", areas: "東京・大阪・名古屋・札幌・仙台・福岡" },
  { slug: "sample-rin", name: "凛サロン倶楽部", feature: "入会金を抑えた始めやすい価格", score: "80.0", join: "¥55,000", annual: "¥33,000", perUse: "¥16,500", total: "¥484,000", areas: "東京・神奈川・千葉・埼玉" },
  { slug: "sample-lumiere", name: "ルミエール倶楽部", feature: "銀座の高級会員制", score: "76.7", join: "¥550,000", annual: "¥550,000", perUse: "¥55,000", total: "¥2,420,000", areas: "東京・大阪・名古屋・福岡" },
  { slug: "sample-vert", name: "サロン・ド・ヴェール", feature: "料金表が分かりやすい中核価格帯", score: "75.6", join: "¥220,000", annual: "¥220,000", perUse: "¥33,000", total: "¥1,232,000", areas: "東京・大阪・京都" },
  { slug: "sample-hakua", name: "クラブ白亜", feature: "新宿特化・紹介までの速さ", score: "72.2", join: "¥165,000", annual: "¥110,000", perUse: "¥27,500", total: "¥935,000", areas: "東京" },
  { slug: "sample-sogetsu", name: "倶楽部蒼月", feature: "青山・少人数で質を重視", score: "71.1", join: "¥330,000", annual: "¥330,000", perUse: "¥38,500", total: "¥1,584,000", areas: "東京・横浜" },
  { slug: "sample-tsukikage", name: "クラブ月影", feature: "麻布の会員制・料金は面接時案内", score: "51.1", join: "¥440,000", annual: "¥440,000", perUse: "非公開", total: "試算不可", areas: "東京" },
];

const others = [
  { slug: "sample-amethyst", name: "クラブ・アメジスト", score: "83.3", body: "関西（大阪・京都・神戸）に特化した交際クラブ。関西在住の方向けに、料金を抑えたコースを用意しています。会員数 約3,100名、女性20代中心。入会金 ¥88,000／年会費 ¥55,000／セッティング料 ¥19,800、年間総額 ¥618,200。最終確認日 2026-11-01。" },
  { slug: "sample-etoile", name: "エトワール倶楽部", score: "82.2", body: "全国6都市に面接拠点を持つ大手型の交際クラブ。出張先でも利用しやすいエリア網が特徴です。会員数 約8,900名（8社最大）、女性20代〜40代。入会金 ¥110,000／年会費 ¥110,000／セッティング料 ¥22,000、年間総額 ¥748,000。最終確認日 2026-11-01。" },
  { slug: "sample-rin", name: "凛サロン倶楽部", score: "80.0", body: "首都圏をカバーし、入会金を抑えた始めやすい価格設定の交際クラブ。その分、キャンセル条件は厳しめです。会員数 約5,400名、女性20代〜30代。入会金 ¥55,000／年会費 ¥33,000／セッティング料 ¥16,500、年間総額 ¥484,000。最終確認日 2026-11-01。" },
  { slug: "sample-lumiere", name: "ルミエール倶楽部", score: "76.7", body: "銀座に面接サロンを構える、落ち着いた大人のための会員制交際クラブ。厳格な審査と丁寧なコンシェルジュ対応を掲げています。会員数 約6,500名、女性20代〜30代中心。入会金 ¥550,000／年会費 ¥550,000／セッティング料 ¥55,000、年間総額 ¥2,420,000。最終確認日 2026-11-01。" },
  { slug: "sample-vert", name: "サロン・ド・ヴェール", score: "75.6", body: "六本木拠点の中核価格帯クラブ。料金表が分かりやすく、初めての方でも総額を把握しやすい構成です。会員数 約3,800名、女性20代〜40代。入会金 ¥220,000／年会費 ¥220,000／セッティング料 ¥33,000、年間総額 ¥1,232,000。最終確認日 2026-11-01。" },
  { slug: "sample-hakua", name: "クラブ白亜", score: "72.2", body: "新宿のみに拠点を置く、東京特化の交際クラブ。エリアを絞る代わりに、面接から紹介までの速さを掲げています。会員数 約2,600名、女性20代〜30代。入会金 ¥165,000／年会費 ¥110,000／セッティング料 ¥27,500、年間総額 ¥935,000。最終確認日 2026-11-01。" },
  { slug: "sample-sogetsu", name: "倶楽部蒼月", score: "71.1", body: "青山を拠点に、少人数・高品質を掲げる交際クラブ。登録人数を絞り、セッティングの質を重視する運営です。会員数 約4,200名、女性20代中心。入会金 ¥330,000／年会費 ¥330,000／セッティング料 ¥38,500、年間総額 ¥1,584,000。最終確認日 2026-11-01。" },
  { slug: "sample-tsukikage", name: "クラブ月影", score: "51.1", body: "麻布の会員制クラブ。セッティング料は非公開で、面接時に案内される形式です。審査は厳格とされています。入会金 ¥440,000／年会費 ¥440,000／セッティング料 非公開のため、年間総額は試算不可。この「総額が先に分からない」こと自体が、このサイトでの評価が下がる理由です。最終確認日 2026-11-01。" },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 border-l-[6px] border-brand bg-[#F2F5F9] px-4 py-2.5 text-xl font-bold leading-relaxed first:mt-0">
      {children}
    </h2>
  );
}

export default function HomePage() {
  return (
    <div className="leading-loose">
      <h1 className="text-2xl font-bold leading-relaxed">
        交際クラブおすすめ9社比較｜根拠を全部開示して選ぶ
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero.jpg" alt="銀座の夜のイメージ（サンプル）" className="mt-4 w-full rounded" />
      <p className="mt-1 text-right text-xs text-gray-400">イメージ写真（サンプル）</p>

      <p className="mt-4">交際クラブって、実際どこがいいのか分かりにくいですよね。料金はクラブごとに公開の仕方が違い、入会金だけ見ても総額は分かりません。</p>
      <p className="mt-3">このページでは、編集部が9社の料金・スペックを同じ条件でそろえて確認し、「結局どこがどう違うのか」の結論を出します。採点式は全文公開し、順位は契約の有無で操作しません。確認できなかった項目は、推測で埋めず「非公開」と書きます。</p>
      <p className="mt-3 text-sm text-gray-500">※掲載中の9社のうち、実在クラブは「実在・公式確認済み」と表示した東京Ritzのみで、残り8社はデモ用のサンプルです。掲載順位は公開した採点式のみで決定します。</p>

      <H2>結論：編集部が全項目を確認して選んだ交際クラブは東京Ritz</H2>
      <p className="mt-4"><strong>迷ったら、まずは総合1位の東京Ritzから検討してください。</strong>9社の料金とスペックを同じ物差しで並べたとき、根拠を開示したうえで1位になったのが、この実在クラブです。理由は大きく3つあります。</p>
      <p className="mt-3"><strong>1つ目は、総合スコアが9社で最も高いこと。</strong>総合 86.2 / 100。料金の総額、料金の公開度、スタッフ対応、会員層などの7つの軸に、公式サイトで確認できる実データを当てて集計した結果です。式と重み、軸ごとの根拠はこのページの下と評価方法ページ、詳細ページで全公開しています。</p>
      <p className="mt-3"><strong>2つ目は、料金がすべて公式に公開され、入会前に試せること。</strong>入会金・年会費・紹介料（3クラス）が公式サイトに明示され、総額は月2回・1年で ¥957,000（スタンダード換算）と先に計算できます。さらに、お試しキャンペーンでは紹介料のみで利用を開始でき、2回目以降の利用で本入会を判断できます。</p>
      <p className="mt-3"><strong>3つ目は、運営の素性が確認できること。</strong>創業40年以上の老舗で、東京都の条例届出は受理済み、登録番号も公式サイトに明記されています。女性への対応は全て女性スタッフが行い、女性会員は全員が面談後に登録、写真は無加工で掲載されます。</p>
      <p className="mt-3"><strong>ただし！</strong></p>
      <p className="mt-3">全員に東京Ritzが最適とは限りません。高級志向ならルミエール倶楽部、出張が多く全国で使いたいならエトワール倶楽部、とにかく総額を抑えたいなら凛サロン倶楽部（いずれもサンプル）。このページでは9社すべてを比較し、それぞれの特徴を解説しました。</p>
      <p className="mt-3">9社の違いを、先に一覧にしておきます。総合スコアは、編集部が料金の総額・公開度・運営対応などで付けたものです。</p>
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
            {clubs.map((c) => (
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
            {clubs.map((c) => (
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

      <H2>交際クラブおすすめ9社の比較表</H2>
      <div className="mt-4 overflow-x-auto">
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
            {clubs.map((c) => (
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
                <td className="border border-[#D5DCE6] p-2">2026-11-01</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded border-2 border-brand bg-[#FBFCFE] p-4">
        <p><strong>この表の採点式</strong>：総合スコア＝評価軸（料金の総額3／料金の公開度2／スタッフ対応2／セッティング速度2／会員層2／キャンセル条件1／対応エリア1／運営体制の透明性2）の重み付き集計（100点満点）。口コミの平均は実投稿が集まるまで採点に入れず「データ不足」と表示します。</p>
      </div>

      <H2>交際クラブの選び方｜見るべき5つの基準</H2>
      <p className="mt-4">では何を基準に交際クラブを選ぶべきか。編集部が比較のときに必ず確認する5つの判断軸がこちら。</p>
      <h3 className="mt-8 text-lg font-bold">①女性の数と質</h3>
      <p className="mt-2">選択肢が多いほど、理想の相手に出会える確率は上がります。ただし数字は「延べ登録数」なのか「現在の会員数」なのかで意味が変わります。このサイトでは、各社が開示している会員数と女性の年齢層をそのまま並べています（例：エトワール倶楽部 約8,900名／女性20代〜40代、ルミエール倶楽部 約6,500名／女性20代〜30代中心）。公表していない社は、無いものとして扱います。</p>
      <h3 className="mt-8 text-lg font-bold">②料金体系はトータルで比較する</h3>
      <p className="mt-2">入会金・年会費・セッティング料を合わせた年間トータルで比較しないと、本当の費用感は分かりません。入会金が安くてもセッティング料が高いクラブもあれば、その逆もあります。だからこのサイトの比較表は、月2回・1年での年間総額を主役にしています。お手当・食事代・ホテル代はクラブへ払う費用ではないので、総額には含めていません。</p>
      <h3 className="mt-8 text-lg font-bold">③対応エリア（全国展開しているか）</h3>
      <p className="mt-2">東京在住なら選択肢は多いですが、地方在住の方は使えるクラブが限られます。出張で複数都市を行き来する方は、対応エリアの広いクラブの方が使い勝手がいい。サンプル8社では、エトワール倶楽部が6都市対応で最も広く、逆にクラブ白亜は東京特化です。「広さ」か「地元での密度」か、自分の生活圏で選んでください。</p>
      <h3 className="mt-8 text-lg font-bold">④動画プロフィールの有無</h3>
      <p className="mt-2"><strong>現時点では評価対象外。</strong>現在、比較に必要な動画プロフィールの情報を確認できていないため、本項目は評価対象外としています。確認できていない情報を根拠に順位を付けることはしません。</p>
      <h3 className="mt-8 text-lg font-bold">⑤運営のサポート体制</h3>
      <p className="mt-2">見落とされがちですが、重要です。面接から紹介までの速さ、キャンセル条件、スタッフ対応の評判。このサイトでは「セッティング速度」「キャンセル条件」を独立した評価軸にして、各社の根拠とあわせて開示しています。あわせて、いつの情報か分かるよう、全社に最終確認日を付けています。</p>

      <H2>東京Ritzの特徴と編集部の評価</H2>
      <div className="mt-4 rounded border-2 border-[#B08D3E] bg-brand p-6 text-white">
        <p>
          <span className="rounded bg-[#B08D3E] px-2 py-1 text-xs font-bold text-white">第1位・実在クラブ</span>
          <span className="ml-2 rounded border border-white/50 px-2 py-1 text-xs">公式確認済み</span>
        </p>
        <p className="mt-3 text-2xl font-bold tracking-wide">東京Ritz</p>
        <p className="mt-3 leading-relaxed text-gray-100">
          創業40年以上の老舗高級交際クラブ。新宿駅南口から徒歩6分、女性スタッフが対応します。
          女性会員は全員が面談後に登録し、写真は無加工で掲載。紹介料のみで始められるお試しキャンペーンがあり、
          入会した男性は全てのランクの女性を紹介可能です。
        </p>
        <p className="mt-3">
          総合スコア <span className="text-xl font-bold text-[#E9CF8F]">86.2 / 100</span>
          （9社中1位・7/8軸で採点）｜拠点：東京（新宿）｜最終確認日 2026-11-03
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-white/25 bg-white/10 p-3">
            <p className="font-bold">お試しキャンペーン</p>
            <p className="mt-1 text-sm text-gray-200">紹介料のみで利用を開始でき、2回目以降の利用で本入会を判断できます。</p>
          </div>
          <div className="rounded border border-white/25 bg-white/10 p-3">
            <p className="font-bold">全ランク紹介可能</p>
            <p className="mt-1 text-sm text-gray-200">入会した男性は、スタンダードからVIPまで全てのランクの女性を紹介可能です。</p>
          </div>
          <div className="rounded border border-white/25 bg-white/10 p-3">
            <p className="font-bold">女性スタッフ対応</p>
            <p className="mt-1 text-sm text-gray-200">女性への対応は全て女性スタッフ。女性会員は全員が面談後に登録されます。</p>
          </div>
          <div className="rounded border border-white/25 bg-white/10 p-3">
            <p className="font-bold">届出受理済み・老舗</p>
            <p className="mt-1 text-sm text-gray-200">東京都の条例届出が受理済みで登録番号を明記。前日までのキャンセルは無料です。</p>
          </div>
        </div>
        <p className="mt-4 text-gray-100">
          入会金 ¥110,000／年会費 ¥55,000／紹介料 ¥33,000（スタンダード）〜¥55,000（VIP）。
          年間総額（月2回・スタンダード換算）は ¥957,000 です。
        </p>
        <p className="mt-4">
          <Link href="/items/tokyo-ritz" className="inline-block rounded bg-white px-5 py-2 font-bold text-brand">
            東京Ritzの詳細と根拠を見る
          </Link>
          <span className="ml-3 text-sm text-gray-300">公式サイトへのリンクは詳細ページにあります</span>
        </p>
      </div>

      <H2>タイプ別おすすめ｜あなたに合う交際クラブはどこ？</H2>
      <h3 className="mt-6 text-lg font-bold">初めて交際クラブを使う人 → 東京Ritz</h3>
      <p className="mt-2">いきなり入会金を払わなくていいのが理由です。東京Ritzにはお試しキャンペーンがあり、紹介料のみで利用を始めて、2回目以降の利用で本入会を判断できます。総合スコアも1位で、届出と運営歴が確認できる実在クラブです。関西にお住まいなら、クラブ・アメジスト（サンプル・総合2位）も候補になります。</p>
      <h3 className="mt-8 text-lg font-bold">ハイクラスな女性と出会いたい人 → ルミエール倶楽部</h3>
      <p className="mt-2">銀座に面接サロンを構える高級会員制。厳格な審査と丁寧なコンシェルジュ対応を掲げています。その分、入会金 ¥550,000・年会費 ¥550,000 と費用はサンプル8社で最も高く、年間総額は ¥2,420,000。質への投資として割り切れる方向けです。</p>
      <h3 className="mt-8 text-lg font-bold">地方在住・出張が多い人 → エトワール倶楽部</h3>
      <p className="mt-2">全国6都市（東京・大阪・名古屋・札幌・仙台・福岡）に面接拠点を持つ大手型。会員数 約8,900名はサンプル8社で最大です。出張先でも利用しやすいエリア網が特徴で、「地元にクラブがない」が起きにくい設計です。</p>
      <h3 className="mt-8 text-lg font-bold">コストを抑えたい人 → 凛サロン倶楽部</h3>
      <p className="mt-2">年間総額 ¥484,000 は全9社で最安。入会金を抑えた始めやすい価格設定です。その分、キャンセル条件は厳しめとされています。首都圏（東京・神奈川・千葉・埼玉）が対象エリアです。</p>

      <H2>ほかの交際クラブ8社の特徴と編集部の評価</H2>
      <p className="mt-4">ここからは1位以外の8社です。以下はすべてデモ用のサンプルクラブで、評価はサンプルデータと公開している採点式に基づきます。</p>
      {others.map((o) => (
        <div key={o.slug}>
          <h3 className="mt-8 text-lg font-bold">{o.name}（総合 {o.score}）</h3>
          <div className="mt-2 rounded border border-[#D5DCE6] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/clubs/${o.slug}.jpg`} alt={`${o.name}のイメージ（サンプル）`} className="mb-3 w-full rounded" />
            <p>{o.body}</p>
            <p className="mt-2"><Link href={`/items/${o.slug}`} className="text-brand underline">{o.name}の詳細ページ</Link></p>
          </div>
        </div>
      ))}

      <H2>費用の目安｜8社の年間総額を試算すると</H2>
      <p className="mt-4">この節は個人の利用実績ではなく、サンプルデータからの試算です。月2回・1年続けた場合の年間総額（クラブへ払う費用のみ）は、最安 ¥484,000（凛サロン倶楽部）から最高 ¥2,420,000（ルミエール倶楽部）まで、約5倍の幅があります。</p>
      <p className="mt-3">中央値のクラブ白亜で内訳を見ると、入会金 ¥165,000＋年会費 ¥110,000＋セッティング料 ¥27,500×24回＝¥660,000、合計 ¥935,000。総額の7割は「会うたびの料金」です。だからこそ、比較は入会金ではなく総額で見る必要があります。自分の回数での試算は、本サイトの<Link href="/simulator" className="text-brand underline">料金シミュレーター</Link>でできます。</p>

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
        <dd className="mt-1">あります。審査の有無と厳しさはクラブごとに違います。このサイトでは、各社の審査や運営体制を「運営体制の透明性」の軸で評価し、各社のページに根拠を書いています。なお、実際に掲載するクラブは、出会い系サイト規制法の届出が確認できたクラブのみに限定する方針です（東京Ritzは届出の受理を公式情報で確認済み。その他の掲載クラブはデモ用のサンプルです）。</dd>
        <dt className="mt-6 font-bold">Q. お手当は総額に入っていますか？</dt>
        <dd className="mt-1">入っていません。このサイトの総額は、入会金・年会費・セッティング料という「クラブへ払う費用」だけです。女性へ直接渡すお手当は当事者間で決まるものなので、相場として数字は出しません。</dd>
        <dt className="mt-6 font-bold">Q. ハイクラスな女性と出会えますか？</dt>
        <dd className="mt-1">クラブ選びと会員ランクによります。このサイトでは、各社が開示している会員数と女性の年齢層を比較表と各社のページにそのまま表示しています。開示情報の範囲で判断してください。</dd>
        <dt className="mt-6 font-bold">Q. 地方でも交際クラブは使えますか？</dt>
        <dd className="mt-1">使えますが、対応エリアはクラブで大きく違います。実在の東京Ritzは関東近辺が中心で地方在住でも利用可能と案内されており、サンプルでは全国6都市対応のエトワール倶楽部、関西特化のクラブ・アメジスト、東京特化のクラブ白亜など、形はさまざまです。比較表の「対応エリア」で、自分の生活圏に合うかを確認してください。</dd>
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
