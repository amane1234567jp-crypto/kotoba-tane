/* ================= みんなで あそぶ 専用「ちょうロングコース」3つ（2026-10-16） =================
   🏝️ うみの だいぼうけん（sumi）／🍭 おかしの くに（sokashi）／🚀 うちゅうの だいぼうけん（suchu）
   約65マスの ぐねぐね道。サイコロ 1〜6。マスは「ことばの 課題」「おもしろ課題（こえなし）」「しかけ」が だいたい 3:3:4。
   ことばの 課題は だいぼうけん・ともだちの だいぼうけんの ものを つかう（声も その パックから）。
   あたらしい 声は ぽにーだけ（sl_*・n0・n7〜n12。packs/slong.json）。 */
const SL = ["sumi", "sokashi", "suchu", "eki", "odekake", "kimochi", "makete", "dekigoto"];
const SL_HIDE = new Set([]); /* 声が そろうまで メニューに ださない コースを ここに */
const isSL = () => SL.includes(curStage);
SL.forEach(id => LONGS.add(id));
const SL_TH = {
  sumi: { name: "うみの だいぼうけん", icon: "🏝️", areas: ["すなはま", "ふね", "むじんとう", "うみの そこ"], fills: ["#FFF1C2", "#D7ECFF", "#D9F0C8", "#BFE3F2"], ground: "#8FD3F0",
    blk: { who: "kamejii", intro: ["sl_sumi_blk", "かめじいが すなはまで ひなたぼっこ してる！"], say: ["blk_kouen", "すみません、とおります"], to: "かめじいに いおう", keys: [["すみません", "済みません"], ["とおります", "通ります", "とうります"]], res: ["rs_kouen", "ほっほ、どうぞ どうぞ"] },
    item: "さかな", obs: "なみ", call: "ふね", deco: [["🌴", 120, 990], ["🐚", 520, 990], ["⛵", 1500, 760], ["🏝️", 140, 560], ["🐠", 1480, 450], ["🐙", 760, 230], ["🦀", 1060, 990], ["🌊", 1500, 990], ["🐬", 640, 520]] },
  sokashi: { name: "おかしの くに", icon: "🍭", areas: ["クッキーの みち", "チョコの かわ", "ケーキの やま", "わたあめの くも"], fills: ["#F6DDB4", "#E6C3A8", "#FFE0EE", "#F2E8FF"], ground: "#FFD6E6",
    blk: { who: "doshin", intro: ["sl_sokashi_blk", "どしんが ケーキを たべてて とおれない！"], say: ["blk_undou", "とおして ください"], to: "どしんに いおう", keys: [["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["rs_undou", "あっ、ごめんね。どうぞ、どうぞ"] },
    item: "あめ", obs: "ドーナツ", call: "ぞうさん", deco: [["🍩", 120, 990], ["🍪", 520, 990], ["🍫", 1500, 760], ["🎂", 140, 560], ["🍦", 1480, 450], ["🍬", 760, 230], ["🧁", 1060, 990], ["🍭", 1500, 990], ["🍓", 640, 520]] },
  suchu: { name: "うちゅうの だいぼうけん", icon: "🚀", areas: ["ロケット", "つき", "ほしの めいろ", "うちゅうじんの ほし"], fills: ["#DCE4F5", "#F2F0E0", "#E2D4FF", "#D3F5E6"], ground: "#2E3A6E",
    blk: { who: "nobbo", intro: ["sl_suchu_blk", "のっぽせんせいが うちゅうふくで とおせんぼ！"], say: ["lk_blk_say", "せんせい、とおして ください"], to: "せんせいに いおう", keys: [["せんせい", "先生"], ["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["lk_blk_res", "おっと、すみません。どうぞ"] },
    item: "ほし", obs: "いんせき", call: "うちゅうじん", deco: [["🪐", 120, 990], ["⭐", 520, 990], ["🛸", 1500, 760], ["🌙", 140, 560], ["☄️", 1480, 450], ["👽", 760, 230], ["🌟", 1060, 990], ["🚀", 1500, 990], ["🌍", 640, 520]] },
  eki: { name: "えきの だいぼうけん", icon: "🚉", areas: ["かいさつ", "ホーム", "でんしゃの なか", "しゅうてん"], fills: ["#E6EEF5", "#FFF1C2", "#D7F0D2", "#FFE0E6"], ground: "#DDE6EE",
    blk: { who: "kamejii", intro: ["sl_eki_blk", "えきいんさんの かめじいが きっぷを しらべて いるよ"], say: ["blk_densha", "すみません、とおして ください"], to: "かめじいに いおう", keys: [["すみません", "済みません"], ["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["rs_densha", "おお、すまんのう。どうぞ"] },
    item: "でんしゃ", obs: "でんしゃ", call: "えきいんさん", deco: [["🚉", 120, 990], ["🎫", 520, 990], ["🚦", 1500, 760], ["🕰️", 140, 470], ["🚃", 1480, 450], ["🍱", 760, 130], ["🛤️", 1060, 990], ["🚄", 1500, 990], ["🏙️", 1300, 130]] },
  // おでかけ だいぼうけん（2026-10-19）：まえはんぶんは あるいて、うしろはんぶんは じてんしゃ。こうつう ルールの マスが いっぱい（odekake.js）
  odekake: { name: "おでかけ だいぼうけん", icon: "🚲", areas: ["いえの まわり", "しょうてんがい", "こうえん", "かわぞいの みち"], fills: ["#FFF1D6", "#FFE0E6", "#D9F0C8", "#D7ECFF"], ground: "#CFE8C0",
    blk: { who: "kamejii", intro: ["sl_odekake_blk", "かめじいが ほどうを ゆっくり あるいて いるよ。こえを かけて とおして もらおう"], say: ["blk_jitensha", "すみません、とおります"], to: "かめじいに いおう", keys: [["すみません", "済みません"]], res: ["rs_jitensha", "ほっほ、ていねいに ありがとう"] },
    item: "ちょうちょ", obs: "みずたまり", call: "おまわりさん", deco: [["🏠", 120, 990], ["🌷", 520, 990], ["🚦", 1500, 760], ["🏪", 140, 560], ["🌳", 1480, 450], ["🦆", 760, 230], ["🍦", 1060, 990], ["🚲", 1500, 990], ["🐕", 640, 520]] },
  // きもちの だいぼうけん（2026-10-19）：あそびは すくなめ。きもちの ことばの マスが ほとんど（kimochi.js）
  kimochi: { name: "きもちの だいぼうけん", icon: "💗", areas: ["いえ", "がっこう", "こうえん", "おでかけ"], fills: ["#FFE9D6", "#E3F0FF", "#DDF2D0", "#FFE0EE"], ground: "#FFF4F7",
    blk: { who: "kon", intro: ["p_blk_kimochi", "こんくんが、みちで ないて いるよ。どうしたのって きいて あげよう"], say: ["blk_kimochi", "どうしたの？"], to: "こんくんに きこう", keys: [["どうしたの", "どうした", "どうしたん"]], res: ["rs_kimochi", "ころんで いたかったの。きいて くれて ありがとう"] },
    item: "ハート", obs: "あめ", call: "ともだち", deco: [] },
  // まけても だいじょうぶ・きょうの できごと（2026-10-19、makete.js）
  makete: { name: "まけても だいじょうぶ", icon: "💪", areas: ["いえ", "がっこう", "こうえん", "おまつり"], fills: ["#FFE9D6", "#E3F0FF", "#DDF2D0", "#FFE0C2"], ground: "#FFF6EC",
    blk: { who: "pyon", intro: ["p_blk_makete", "ぴょんちゃんが、かけっこで まけて ないて いるよ。こえを かけよう"], say: ["blk_makete", "まけても だいじょうぶだよ"], to: "ぴょんちゃんに いおう", keys: [["だいじょうぶ", "大丈夫"]], res: ["rs_makete", "……うん。ありがとう。つぎ がんばる！"] },
    item: "メダル", obs: "あめ", call: "ともだち", deco: [] },
  dekigoto: { name: "きょうの できごと", icon: "📖", areas: ["がっこう", "こうえん", "いえ", "おでかけ"], fills: ["#E3F0FF", "#DDF2D0", "#FFE9D6", "#FFE0EE"], ground: "#F2F7FF",
    blk: { who: "chu", intro: ["p_blk_dekigoto", "ちゅうくんが、きょうの ことを はなしたそうに して いるよ。きいて あげよう"], say: ["blk_dekigoto", "きょう、なにが あったの？"], to: "ちゅうくんに きこう", keys: [["なにが", "何が", "あったの", "どうしたの"]], res: ["rs_dekigoto", "きいて！ さかあがりが できたんだ！"] },
    item: "ほん", obs: "あめ", call: "ともだち", deco: [] },
};
// しかけの せりふ（テーマごと）
const SL_EVT = {
  sumi: { dice2: "ヤシの みが ふたつ おちて きた！ つぎは サイコロ 2こで ふれるよ", warp: "イルカが せなかに のせて くれた！ ずっと さきまで いけるよ", bigwarp: "ジェットスキーで びゅーん！ ゴールの ちかくまで とぶよ",
    fake: "なみに のって 3マス すすむ！ …と おもったら、ひきなみで 4マス もどる！", rand: "うずしおだ！ ぐるぐる……どこに いくかな？", rest: "ひなたぼっこで ねむく なった。つぎは 1かい やすみ",
    x2: "たからの ちずを みつけた！ つぎの サイコロは 2ばいだよ", zero: "あしが すなに うまっちゃった！ つぎの サイコロは 0に なるよ", home: "おおきな クジラに のみこまれた！ ふりだしに もどる！",
    back10: "かいぞくに つかまった！ 10マス もどる！", bonus: "たからばこだ！ たねを 3こ ゲット！", allf: "おいかぜだ！ みんな 2マス すすむよ", allb: "おおなみが きた！ みんな 2マス もどるよ",
    janken: "カニさんの じゃんけん しょうぶ！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ", again: "とびうおが はねた！ もう いっかい サイコロを ふれるよ",
    nebou: "ハンモックで ねちゃった！ みんなで「おきて！」って いって、おこして あげて", trolley: "おおきな ふねが きた！ ちかくの ひとも いっしょに 3マス すすむよ", call: "おーい！ いちばん うしろの ひとを ボートで むかえに いくよ", atsumare: "ビーチバレーの じかん！ みんな ここに あつまれ！", kumikae: "おおきな なみで コースが ばらばらに！ コースが くみかわるよ" },
  sokashi: { dice2: "ドーナツが ふたつ ころがって きた！ つぎは サイコロ 2こで ふれるよ", warp: "ジェットコースターに のった！ ずっと さきまで いけるよ", bigwarp: "わたあめの くもに のって、ゴールの ちかくまで とぶよ",
    fake: "ガムで 3マス のびーる！ …と おもったら、ちぢんで 4マス もどる！", rand: "キャンディの うずまき！ ぐるぐる……どこに いくかな？", rest: "おなか いっぱいで うごけない。つぎは 1かい やすみ",
    x2: "ふくらむ パンを たべた！ つぎの サイコロは 2ばいだよ", zero: "キャラメルで あしが くっついた！ つぎの サイコロは 0に なるよ", home: "チョコの かわに ながされた！ ふりだしに もどる！",
    back10: "クッキーの みちが くずれた！ 10マス もどる！", bonus: "おかしの たからばこ！ たねを 3こ ゲット！", allf: "ポップコーンが はじけた！ みんな 2マス すすむよ", allb: "ゼリーで つるつる すべった！ みんな 2マス もどるよ",
    janken: "グミの じゃんけん しょうぶ！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ", again: "ラムネが しゅわっ！ もう いっかい サイコロを ふれるよ",
    nebou: "ふわふわの マシュマロで ねちゃった！ みんなで「おきて！」って いって、おこして あげて", trolley: "おかしの きしゃが きた！ ちかくの ひとも いっしょに 3マス すすむよ", call: "おーい！ いちばん うしろの ひとを ソフトクリームで よびよせるよ", atsumare: "おやつの じかん！ みんな ここに あつまれ！", kumikae: "ケーキの やまが くずれて、コースが ばらばらに！ コースが くみかわるよ" },
  suchu: { dice2: "ながれぼしが ふたつ！ つぎは サイコロ 2こで ふれるよ", warp: "ワープ ゲートだ！ ずっと さきまで いけるよ", bigwarp: "ロケット はっしゃ！ ゴールの ちかくまで とぶよ",
    fake: "ふわっと 3マス すすむ！ …と おもったら、いんりょくで 4マス もどる！", rand: "うちゅうの うずまき！ ぐるぐる……どこに いくかな？", rest: "うちゅうふくが きつくて ひとやすみ。つぎは 1かい やすみ",
    x2: "つきで ジャンプ！ からだが かるい！ つぎの サイコロは 2ばいだよ", zero: "いんせきに つまずいた！ つぎの サイコロは 0に なるよ", home: "ブラックホールに すいこまれた！ ふりだしに もどる！",
    back10: "うちゅうじんの ユーフォーに さらわれた！ 10マス もどる！", bonus: "ほしの たからばこ！ たねを 3こ ゲット！", allf: "すいせいが とおった！ みんな 2マス すすむよ", allb: "うちゅうの かぜだ！ みんな 2マス もどるよ",
    janken: "うちゅう じゃんけん しょうぶ！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ", again: "ながれぼしに おねがい！ もう いっかい サイコロを ふれるよ",
    nebou: "むじゅうりょくで ふわふわ ねちゃった！ みんなで「おきて！」って いって、おこして あげて", trolley: "うちゅうせんが きた！ ちかくの ひとも いっしょに 3マス すすむよ", call: "おーい！ いちばん うしろの ひとを ビームで よびよせるよ", atsumare: "うちゅうせんの しゅうごう！ みんな ここに あつまれ！", kumikae: "うちゅうの じしんで、コースが ばらばらに！ コースが くみかわるよ" },
  eki: { dice2: "きゅうこうに のった！ つぎは サイコロ 2こで ふれるよ", warp: "しんかんせんに のった！ ずっと さきまで いけるよ", bigwarp: "リニアモーターカーで びゅーん！ ゴールの ちかくまで とぶよ",
    fake: "でんしゃで 3マス すすむ！ …と おもったら、はんたいの でんしゃだった！ 4マス もどる！", rand: "のりかえを まちがえた！ どこに いくかな？",
    rest: "ドアが しまります！ のりおくれた。つぎは 1かい やすみ", x2: "かいそくに のった！ つぎの サイコロは 2ばいだよ", zero: "ふみきりが しまってる！ つぎの サイコロは 0に なるよ",
    home: "きっぷを なくした！ かいさつに もどる！", back10: "でんしゃで ねすごした！ 10マス もどる！", bonus: "えきべんだ！ たねを 3こ ゲット！", allf: "でんしゃが はやく ついた！ みんな 2マス すすむよ",
    allb: "でんしゃが おくれて いる！ みんな 2マス もどるよ", janken: "ホームで じゃんけん しょうぶ！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ", again: "ちょうど でんしゃが きた！ もう いっかい サイコロを ふれるよ",
    nebou: "でんしゃで ねむっちゃった！ みんなで「おきて！」って いって、おこして あげて", trolley: "ながい でんしゃが きた！ ちかくの ひとも いっしょに 3マス すすむよ", call: "おーい！ いちばん うしろの ひとを でんしゃで むかえに いくよ",
    atsumare: "まもなく でんしゃが まいります！ みんな ここに あつまれ！", kumikae: "せんろの きりかえだ！ コースが くみかわるよ" },
  odekake: { dice2: "おべんとうを たべて げんき いっぱい！ つぎは サイコロ 2こで ふれるよ", warp: "バスに のった！ ずっと さきまで いけるよ", bigwarp: "タクシーに のせて もらった！ ゴールの ちかくまで いくよ",
    fake: "くだりざかで 3マス すすむ！ …と おもったら、わすれものに きづいて 4マス もどる！", rand: "みちに まよっちゃった！ どこに いくかな？", rest: "あめが ふって きた！ あまやどりで 1かい やすみ",
    x2: "おいかぜだ！ つぎの サイコロは 2ばいだよ", zero: "ふみきりが しまってる！ つぎの サイコロは 0に なるよ", home: "わすれものを した！ いえに もどる！",
    back10: "みちを まちがえた！ 10マス もどる！", bonus: "アイスクリームやさんだ！ たねを 3こ ゲット！", allf: "あおしんごうが つづいた！ みんな 2マス すすむよ", allb: "いぬの おさんぽの ぎょうれつだ！ みんな まって 2マス もどるよ",
    janken: "こうえんで じゃんけん しょうぶ！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ", again: "おまわりさんに あいさつ できた！ もう いっかい サイコロを ふれるよ",
    nebou: "ベンチで ねちゃった！ みんなで「おきて！」って いって、おこして あげて", trolley: "サイクリングの なかまが きた！ ちかくの ひとも いっしょに 3マス すすむよ", call: "おーい！ いちばん うしろの ひとを むかえに いくよ",
    atsumare: "こうえんで ひとやすみ！ みんな ここに あつまれ！", kumikae: "みちが こうじちゅう！ コースが くみかわるよ" },
  kimochi: {}, /* しかけは kimochi.js で きめる */
  makete: {}, dekigoto: {},
};
const SL_ICON = { dice2: "🎲", warp: "🌀", bigwarp: "🚀", fake: "🤪", rand: "❓", rest: "💤", x2: "✖️", zero: "0️⃣", home: "↩", back10: "⏪", bonus: "🎁", allf: "⏩", allb: "🌊", janken: "✊", again: "🔁", nebou: "😴", trolley: "🚃", call: "🧲", tsukkomi: "🤣", atsumare: "📣", kumikae: "🔀" };
const SL_EVC = { warp: "#D9C2F0", bigwarp: "#D9C2F0", rand: "#D9C2F0", home: "#FFC2D1", back10: "#FFC2D1", fake: "#FFE27A", tsukkomi: "#FFE27A", bonus: "#C9EBB5", atsumare: "#FFE27A", kumikae: "#FFE27A" };

/* ---------- 盤：コースごとに ちがう 形 ----------
   うみ＝おおきな なみの へび道、おかし＝たてに ジグザグ、うちゅう＝うずまき（まんなかが ゴール） */
const SL_SHAPE = { // 47マス＋ゴール（まえは 65＋1。ながすぎたので みじかく した 2026-10-17）
  sumi() { const P = [], ROWS = [930, 800, 670, 540, 410]; ROWS.forEach((y, r) => { const cnt = r < 4 ? 10 : 7;
      for (let j = 0; j < cnt; j++) { const col = r % 2 ? 9 - j : j; P.push([175 + col * 140, y + Math.sin(col * .9 + r) * 26]); } }); P.push([690, 300]); return P; },
  sokashi() { const P = [], COLS = 8, ys = [930, 832, 734, 636, 538, 440]; for (let c = 0; c < COLS && P.length < 47; c++) { const down = c % 2;
      for (let r = 0; r < 6 && P.length < 47; r++) { const y = ys[down ? 5 - r : r]; P.push([200 + c * 160 + (r % 2 ? 26 : -26), y]); } }
    P.push([1420, 300]); return P; },
  suchu() { const C = 9, R = 6, seen = new Set(), P = []; let x = 0, y = R - 1, dx = 1, dy = 0; // そとがわから うちがわへ
    const xy = (i, j) => [240 + i * 140, 360 + j * 115];
    for (let k = 0; k < C * R; k++) { P.push(xy(x, y)); seen.add(x + "," + y); const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= C || ny < 0 || ny >= R || seen.has(nx + "," + ny)) { [dx, dy] = [dy, -dx]; } x += dx; y += dy; }
    return P.slice(0, 48); },
  eki() { const V = [[170, 930], [1320, 930], [1440, 840], [1320, 750], [280, 750], [170, 660], [280, 570], [1320, 570], [1440, 480], [1320, 390], [280, 390], [170, 300], [280, 225], [1180, 225]]; // ろせんずの ような ジグザグ
    const seg = V.slice(1).map((p, i) => Math.hypot(p[0] - V[i][0], p[1] - V[i][1])), tot = seg.reduce((a, b) => a + b, 0), P = [];
    for (let k = 0; k < 48; k++) { let d = tot * k / 47, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; } const t = Math.min(1, d / seg[i]); P.push([V[i][0] + (V[i + 1][0] - V[i][0]) * t, V[i][1] + (V[i + 1][1] - V[i][1]) * t]); }
    return P; },
  kimochi() { const P = [], ROWS = [930, 765, 600, 435]; ROWS.forEach((y, r) => { for (let j = 0; j < 12; j++) { const col = r % 2 ? 11 - j : j; P.push([175 + col * 114, y + Math.sin(col * .8 + r * 1.3) * 22]); } }); return P; }, // 4だん＝4つの ばしょ（いえ・がっこう・こうえん・おでかけ）
  makete() { return SL_SHAPE.kimochi(); }, dekigoto() { return SL_SHAPE.kimochi(); },
  odekake() { const P = [], ROWS = [930, 770, 610, 450]; ROWS.forEach((y, r) => { for (let j = 0; j < 12; j++) { const col = r % 2 ? 11 - j : j; P.push([170 + col * 115, y]); } }); return P; }, // まちの みちの ような 4だん（したの 2だんは あるき、うえの 2だんは じてんしゃ）
};
const SL_ORDER = {}, SL_PTS = {}, SL_ORDER0 = {};
SL.forEach(sid => {
  const T = SL_TH[sid], n = {}, pl = {}, nx = {}, ids = [];
  const pts = SL_SHAPE[sid](); // 65マス＋ゴール の ざひょう（コースごとに ちがう 形）
  pts.forEach(([x, y], k) => { const id = k === 0 ? "0" : k === 21 ? "4" : k === pts.length - 1 ? "15" : "q" + k; n[id] = [Math.round(x), Math.round(y)]; pl[id] = T.areas[Math.min(3, Math.floor(k / pts.length * 4))]; ids.push(id); });
  n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ids); SL_ORDER[sid] = ids; SL_PTS[sid] = pts.map(([x, y]) => [Math.round(x), Math.round(y)]); SL_ORDER0[sid] = ids.slice();
  BOARD[sid] = { nodes: n, place: pl, next: nx, away: [1560, 560], style: () => sid === "eki" ? "rail" : "park", labels: [] };
  STAGE_DEF[sid] = { ground: T.ground, sky: "#CFEAFB", names: STAGE_DEF.undou.names, fills: Object.fromEntries(T.areas.map((a, i) => [a, T.fills[i]])) };
  RIVAL_OF[sid] = "gao"; SLEEPER_OF[sid] = T.blk.who; BLOCK_DEF[sid] = { ...T.blk, sleep: false };
  // しかけ と 課題の ならび
  const EVS = ["dice2", "fake", "warp", "kumikae", "home", "x2", "rand", "bonus", "allf", "janken", "zero", "rest", "nebou", "atsumare", "bigwarp", "again", "trolley", "back10", "dice2", "allb", "call", "warp", "kumikae", "fake", "rand"]; // ふりだしは はやめ、10マスもどるは 1かいだけ
  const WORD = ["kaiwa", "scene", "gag", "yasashiku", "monomane", "tsunagu", "haya", "scene", "oogoe", "kaiwa", "sakasa", "sagasu", "scene", "yasashiku", "gag", "tsunagu", "monomane", "kaiwa", "scene"];
  const FUN = ["stop", "catch", "balloon", "more", "cups", "shadow", "battle", "stop", "balloon", "catch", "cups", "more", "shadow", "battle", "balloon", "stop", "catch", "cups", "more"];
  const ev = {}, task = {}; let e = 0, w = 0, f = 0;
  ids.forEach((id, i) => { if (i === 0 || id === "4" || id === "15") return;
    const slot = i % 5; // 5マスに 2つ しかけ、ことば・おもしろ が 1〜2つずつ
    if ((slot === 1 || slot === 3) && e < EVS.length && i < ids.length - 3) { const t = EVS[e++]; ev[id] = [t, 0, `sl_${sid}_${t}`, t === "tsukkomi" ? "つっこみマス！" : SL_EVT[sid][t]]; }
    else if (slot === 0 || slot === 4 ? w <= f : w < f) { const t = WORD[w++ % WORD.length]; task[id] = sid === "eki" && t === "gag" ? "scene" : t; } /* えきに がっこうの にせもの せんせいは ださない */ else task[id] = FUN[f++ % FUN.length]; });
  EVENTS[sid] = ev; LONG_TASKS[sid] = task;
  LEGENDS[sid] = [["kaiwa", "ことば"], ["scene", "いってみよう"], ["stop", "おもしろ"], ["oogoe", "こえ"]];
  const SCHOOL = ["げんかん", "きゅうしょく", "きょうしつ", "ほけんしつ", "しょくいんしつ", "としょしつ", "トラック"]; // えきの コースでは がっこうの 会話を ださない
  LDATA[sid] = { kaiwa: sid === "eki" ? LONG.kaiwa.filter(k => !SCHOOL.includes(k.place)) : LONG.kaiwa, gag: LONG.gag, haya: LONG.haya, sagasu: LONG.sagasu, hantai: LONG.hantai, yasashiku: LONG_T.yasashiku, tsunagu: LONG_T.tsunagu };
  BOARD_BG[sid] = L => slBG(sid, L);
});
Object.assign(LTASK, { stop: ["#FFE27A", "🎯"], catch: ["#FFE27A", "🖐"], balloon: ["#FFE27A", "🎈"], more: ["#FFE27A", "🔢"], cups: ["#FFE27A", "🥤"], shadow: ["#FFE27A", "👤"], jump: ["#FFE27A", "🦘"], battle: ["#FFE27A", "🎲"],
  oogoe: ["#FFC6E0", "📣"], monomane: ["#FFC6E0", "🐮"], sakasa: ["#FFC6E0", "🔁"] });
function slBG(sid, L) {
  const T = SL_TH[sid];
  if (sid === "suchu") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#1E2550" }, L); for (let i = 0; i < 70; i++) el("circle", { cx: (i * 233) % 1600, cy: (i * 137) % 1000, r: 2 + (i % 3), fill: "#FFF6C8", opacity: .8 }, L); }
  else if (sid === "eki") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#DDE6EE" }, L); [[60, 160, 120, 300], [240, 120, 90, 340], [1300, 100, 110, 360], [1440, 180, 130, 280], [600, 60, 80, 200]].forEach(([x, y, w, h]) => { el("rect", { x, y, width: w, height: h, fill: "#C3CFDA", ...S6(4) }, L); for (let yy = y + 20; yy < y + h - 20; yy += 40) for (let xx = x + 15; xx < x + w - 20; xx += 30) el("rect", { x: xx, y: yy, width: 16, height: 20, fill: "#FFF6C8" }, L); }); }
  else if (sid === "sokashi") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFE3EE" }, L); for (let i = 0; i < 30; i++) el("circle", { cx: (i * 211) % 1600, cy: (i * 157) % 1000, r: 10, fill: ["#FF8FA3", "#7FCBF0", "#FFD25E", "#7BD389"][i % 4], opacity: .35 }, L); }
  else { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#8FD3F0" }, L); for (let y = 60; y < 1000; y += 90) el("path", { d: `M0 ${y} Q100 ${y - 14} 200 ${y} T400 ${y} T600 ${y} T800 ${y} T1000 ${y} T1200 ${y} T1400 ${y} T1600 ${y}`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .35 }, L); }
  if (sid !== "eki") el("path", { d: "M90 990 Q30 820 90 640 Q50 420 160 300 Q300 230 560 250 Q900 210 1240 250 Q1530 270 1560 430 Q1590 640 1545 830 Q1505 995 1300 995 Z", fill: T.fills[0], opacity: sid === "suchu" ? .22 : .55, ...S6(5) }, L);
  T.deco.forEach(([e, x, y]) => txt(L, x, y, e, 62, { "text-anchor": "middle", opacity: .85 }));
  Object.entries(EVENTS[sid]).forEach(([id, [type]]) => { const to = slWarpTo(sid, id, type); if (!to) return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 120} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .6 }, L); });
}
// ワープ先（まえへ とぶ ものだけ 線を かく）
function slWarpTo(sid, id, type) { const O = SL_ORDER[sid], i = O.indexOf(id); if (type === "warp") return O[Math.min(O.length - 4, i + 12)]; if (type === "bigwarp") return O[O.length - 5]; return null; }
// しるし（しかけは テーマの 絵文字）
{ const db = drawBoard; drawBoard = function () { db(); if (!isSL()) return;
    Object.entries(EVENTS[curStage]).forEach(([id, [type]]) => { const [x, y] = NODES[id]; el("circle", { cx: x, cy: y, r: 36, fill: SL_EVC[type] || "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, SL_ICON[type] || "★", 36, { "text-anchor": "middle" }); }); }; }

/* ---------- いどう（まっすぐの 道なので、ばんごうで すすむ・もどる） ---------- */
const slIdx = id => SL_ORDER[curStage].indexOf(id);
async function slGo(pc, d) {
  const O = SL_ORDER[curStage]; let i = slIdx(pc.node); const step = d > 0 ? 1 : -1;
  for (let k = 0; k < Math.abs(d); k++) { const j = i + step; if (j < 0 || j >= O.length) break; i = j; await hop(pc, O[i], .26, k);
    if (O[i] === GOAL) { if (!winner) { winnerPc = pc; winner = pc.kind; } return; } }
}
async function slSay(key, text) { showBanner(text.split(/[！。]/)[0] + "！", 1500); await speak(C.pony, key, text); }
async function slMove(pc, d) {
  if (!d) { await speak(C.pony, "sl_0", "そのままだよ"); return; }
  if (d > 0) await speak(C.pony, `sl_f${d}`, `${d}マス すすむよ`); else await speak(C.pony, `sl_b${-d}`, `${-d}マス もどるよ`);
  await slGo(pc, d);
}
const others = pc => PLAYERS.map(p => p.pc).filter(p => p !== pc);

/* ---------- しかけ ---------- */
const SL_TSK = [ // つっこみ：ぽにーが へんな ことを いう →「ちがうよ」と つっこむ
  { id: "goal", e: "👉🏁❌", t: "ゴールは こっちだよ！", keys: [["ぎゃく", "逆", "ちがう", "違う", "あっち", "反対", "はんたい"]], a: "ほんとは あっちだよね" },
  { id: "dice", e: "🎲", t: "これは ボールだよ！", keys: [["さいころ", "サイコロ", "ちがう", "違う"]], a: "ほんとは サイコロだよね" },
  { id: "inu", e: "🐶", t: "いぬは、ニャーって なくんだよ", keys: [["わんわん", "ワンワン", "ちがう", "違う", "わん"]], a: "ほんとは わんわんだよね" },
  { id: "tasu", e: "1️⃣➕1️⃣", t: "いち たす いちは、さん！", keys: [["2", "２", "二", "ちがう", "違う", "にだよ"]], a: "ほんとは にだよね" },
  { id: "sakana", e: "🐟☁️", t: "おさかなは、おそらを とぶんだよ", keys: [["とばない", "飛ばない", "うみ", "海", "およ", "泳", "ちがう", "違う"]], a: "ほんとは うみを およぐんだよね" },
  { id: "yuki", e: "⛄☀️", t: "ゆきだるまは、なつに つくるんだよ", keys: [["ふゆ", "冬", "ちがう", "違う"]], a: "ほんとは ふゆだよね" },
  { id: "zou", e: "🐘", t: "ぞうさんって、ちいさいね", keys: [["おおきい", "大きい", "でかい", "ちがう", "違う"]], a: "ほんとは おおきいよね" },
  { id: "hashi", e: "🥢🍲", t: "スープは、おはしで のもうね", keys: [["すぷーん", "スプーン", "ちがう", "違う"]], a: "ほんとは スプーンだよね" },
];
const slFlag = (pc, k) => { if (pc.player) pc.player[k] = 1; };
{ const be = boardEvent; boardEvent = async function (pc) {
    if (!isSL()) return be(pc);
    if (pc.player && pc.player.stay) return; // 0マス（うごいて いない）ときは、もう いちど おきない
    const ev = EVENTS[curStage][pc.node]; if (!ev) return;
    let [type, , key, text] = ev; const O = SL_ORDER[curStage];
    // ゴールに ちかい ところ（くみかえで うしろに きた とき）では、ふりだしでは なく 10マス もどる
    if (type === "home" && slIdx(pc.node) >= 30) { const b = Object.values(EVENTS[curStage]).find(e => e[0] === "back10"); if (b) [type, , key, text] = b; }
    await sleep(300); markAbove(pc, "ex"); chime();
    if (type === "tsukkomi") return slTsukkomi(pc);
    await slSay(key, text);
    if (type === "dice2" || type === "x2" || type === "zero") { slFlag(pc, type); markAbove(pc, "sparkle"); }
    else if (type === "warp" || type === "bigwarp") { const to = slWarpTo(curStage, pc.node, type), e = SL_VEH[curStage] && SL_VEH[curStage][type];
      if (e === "🌀") { await warpTo(pc, to); } else if (e) await slRide(pc, to, e, { arc: type === "bigwarp" ? 260 : 120, ms: type === "bigwarp" ? 1800 : 1500, noflip: e === "🚀" || e === "☁️" }); else await warpTo(pc, to); }
    else if (type === "fake") { await slGo(pc, 3); if (winner) return; await sleep(300); noise(.3, 400, .4); markAbove(pc, "drop"); await slGo(pc, -4); }
    else if (type === "rand") { let d = 0; while (!d) d = rnd(25) - 12; const j = Math.max(0, Math.min(O.length - 3, slIdx(pc.node) + d));
      for (let i = 0; i < 8; i++) later(i * 70, () => mark("sparkle", pc.px, pc.py - 30, { vx: Math.cos(i) * 260, vy: Math.sin(i) * 260, life: .6, s: .5 }));
      await warpTo(pc, O[j]); await speak(C.pony, d > 0 ? "sl_rand_f" : "sl_rand_b", d > 0 ? "やったね、まえに とんだ！" : "あれれ、うしろに とんじゃった！"); }
    else if (type === "rest") { slFlag(pc, "rest"); markAbove(pc, "z", { i: 1 }); }
    else if (type === "again") { slFlag(pc, "again"); }
    else if (type === "home") { const e = SL_VEH[curStage] && SL_VEH[curStage].home; if (e === "🐳") await slSwallow(pc, e); else if (e === "🌑") await slSwallow(pc, e, true); else if (e) await slRide(pc, "0", e, { arc: 60, ms: 1800, noflip: true }); else await warpTo(pc, "0"); }
    else if (type === "back10") { await slGo(pc, -10); }
    else if (type === "bonus") { if (pc.player) pc.player.ok += 3; GS.ok += 3; GS.pend = 0; confetti(50); for (let i = 0; i < 3; i++) later(i * 250, () => blip(900 + i * 200, 1300, .1, "square")); }
    else if (type === "allf" || type === "allb") { const d = type === "allf" ? 2 : -2; for (const o of PLAYERS.map(p => p.pc)) { jump(o, .5); await slGo(o, d); if (winner) break; } }
    else if (type === "trolley") { const d0 = distToGoal(pc.node); const near = others(pc).filter(o => Math.abs(distToGoal(o.node) - d0) <= 3); for (const o of [pc, ...near]) { jump(o, .6); await slGo(o, 3); if (winner) break; } }
    else if (type === "call") { const last = others(pc).filter(o => slIdx(o.node) < slIdx(pc.node)).sort((a, b) => slIdx(a.node) - slIdx(b.node))[0]; if (last) await warpTo(last, pc.node); else await speak(C.pony, "lk_ev_call_none", "うしろに だれも いないね"); }
    else if (type === "janken") await slJanken(pc);
    else if (type === "atsumare") { for (const o of others(pc)) { jump(o, .6); await warpTo(o, pc.node); } confetti(40); }
    else if (type === "kumikae") await slKumikae(pc);
    else if (type === "nebou") await slNebou(pc);
    await sleep(300); }; }
async function slTsukkomi(pc) {
  const it = SL_TSK[rnd(SL_TSK.length)];
  await speak(C.pony, "sl_tsk_intro", "つっこみマス！ ぽにーが へんな ことを いうよ。「ちがうよ！」って つっこんでね");
  const g = panel("つっこみマス", "#FFFBE6"); txt(g, 800, 420, it.e, 170, { "text-anchor": "middle" }); txt(g, 800, 620, `「${it.t}」`, 60, { "text-anchor": "middle" });
  playMove(C.pony, "point"); await speak(C.pony, `sl_tsk_${it.id}`, it.t);
  showTask("ちがうよ！", "つっこもう", 260); setListen(pc, true); const r = await listen(it.keys, 7000); setListen(pc, false); hideTask();
  g.remove(); playLog({ type: "tsukkomi", id: it.id, ok: r.r === "ok", who: NAMES[pc.kind] });
  if (r.r === "ok") { noise(.06, 3000, .5); blip(1600, 600, .12, "square"); const st = slam("ナイス つっこみ！", 330, 140, "#FF9E5E"); later(1400, () => st.remove()); confetti(40); playMove(C.pony, "laugh");
    await speak(C.pony, "sl_tsk_ok", "ナイス つっこみ！ 2マス すすむよ"); await slGo(pc, 2); return true; }
  playMove(C.pony, "laugh"); await speak(C.pony, `sl_tska_${it.id}`, `あはは、${it.a}`); return false;
}
async function slJanken(pc) {
  const lead = others(pc).sort((a, b) => slIdx(b.node) - slIdx(a.node))[0];
  if (!lead || slIdx(lead.node) <= slIdx(pc.node)) { await speak(C.pony, "sl_jk_top", "きみが いちばん まえ！ そのままだよ"); return; }
  const H = ["✊", "✌️", "🖐"];
  for (let n = 0; n < 4; n++) {
    const g = panel("じゃんけん", "#FFF8E8"); txt(g, 420, 300, NAMES[pc.kind], 50, { "text-anchor": "middle" }); txt(g, 1180, 300, NAMES[lead.kind], 50, { "text-anchor": "middle" });
    const a = txt(g, 420, 620, "✊", 220, { "text-anchor": "middle" }), b = txt(g, 1180, 620, "✊", 220, { "text-anchor": "middle" }); txt(g, 800, 560, "VS", 80, { "text-anchor": "middle", fill: "#E8735A" });
    // ひとが あそんで いる ときは、じぶんで てを えらぶ（タッチ）。あいては かくして おく
    const pick = (o, cx, txtEl) => { if (!o.player || o.player.cpu) return Promise.resolve(rnd(3));
      txtEl.textContent = "？"; const bs = el("g", {}, g);
      return new Promise(res => { let done = false; const fin = v => { if (done) return; done = true; bs.remove(); txtEl.textContent = "？"; txt(g, cx, 760, "きめた！", 44, { "text-anchor": "middle", fill: "#3F9150" }); blip(900, 1300, .08, "square"); res(v); };
        H.forEach((h, i) => { const b0 = el("g", { style: "cursor:pointer" }, bs), bx = cx - 210 + i * 140; el("rect", { x: bx, y: 690, width: 140 - 16, height: 130, rx: 24, fill: "#FFFFFF", ...S6(6) }, b0); txt(b0, bx + 62, 785, h, 80, { "text-anchor": "middle" }); b0.onpointerdown = () => fin(i); });
        later(20000, () => fin(rnd(3))); }); };
    if ((pc.player && !pc.player.cpu) || (lead.player && !lead.player.cpu)) await speak(C.pony, "sl_jk_pick", "じぶんの てを タッチしてね");
    const [x, y] = await Promise.all([pick(pc, 420, a), pick(lead, 1180, b)]);
    await speak(C.pony, "sl_jk_say", "じゃんけん……"); for (let i = 0; i < 6; i++) { a.textContent = H[i % 3]; b.textContent = H[(i + 1) % 3]; blip(500 + i * 60, 600, .05, "square"); await sleep(110); }
    a.textContent = H[x]; b.textContent = H[y]; boom(.3); await speak(C.pony, "sl_jk_pon", "ぽん！");
    await sleep(500); g.remove();
    if (x === y) { await speak(C.pony, "sl_jk_aiko", "あいこ！ もう いっかい"); continue; }
    if ((x + 1) % 3 === y) { confetti(40); await speak(C.pony, "sl_jk_win", "かった！ いれかわるよ"); const p1 = pc.node, p2 = lead.node; await Promise.all([warpTo(pc, p2), warpTo(lead, p1)]); return; }
    await speak(C.pony, "sl_jk_lose", "まけちゃった！ そのままだよ"); return;
  }
}
async function slNebou(pc) {
  playMove(pc, "sleep"); markAbove(pc, "z");
  showTask("おきて！", "みんなで いおう", 260); setListen(pc, true); const r = await listen([["おきて", "起きて", "おきろ", "起きろ"]], 7000); setListen(pc, false); hideTask();
  if (r.r === "ok") { surprise(pc); jump(pc, .7); await speak(C.pony, "sl_nb_ok", "おきた！ やすまなくて いいよ"); }
  else { slFlag(pc, "rest"); await speak(C.pony, "sl_nb_ng", "ぐうぐう……おきなかった。つぎは 1かい やすみ"); }
}
/* ---------- サイコロ：2こ・2ばい・0 ---------- */
Object.assign(NUMS, { 0: "ゼロ！", 7: "なな！", 8: "はち！", 9: "きゅう！", 10: "じゅう！", 11: "じゅういち！", 12: "じゅうに！" });
{ const rd = rollDice; rollDice = async function (forced) {
    const pl = CUR_PL; if (!isSL() || !pl || forced) return rd(forced);
    if (pl.zero) { pl.zero = 0; pl.stay = 1; await rd(); noise(.3, 300, .5); await speak(C.pony, "sl_zero_now", "0に なっちゃった！ うごけない！"); popNumber(0); return 0; }
    let v = await rd();
    if (pl.dice2) { pl.dice2 = 0; await speak(C.pony, "sl_d2_more", "もう ひとつ ふってね"); await waitDice(); const w = await rd(); v += w; popNumber(v); await sleep(400); }
    if (pl.x2) { pl.x2 = 0; await speak(C.pony, "sl_x2_now", "2ばいに なるよ！"); v *= 2; popNumber(v); await sleep(400); }
    return v; }; }
// ばん：ひとやすみ・もういっかい（だいぼうけんの しくみを つかう）。ゴールを こえた ぶんは そのまま ゴール
/* ---------- 場面（いってみよう）は こうしゃの 場面を つかう ---------- */
{ const ps = pickSit; pickSit = function (place, heroKind = "shima") { if (!isSL()) return ps(place, heroKind); const st = curStage; curStage = st === "eki" ? "densha" : "kousha"; try { return ps(place, heroKind); } finally { curStage = st; } }; }
/* ---------- 声の パック：こうしゃ＋だいぼうけん＋ともだちの だいぼうけん＋ちょうロング（ぜんぶ その ときに ほどく） ---------- */
{ const lp = loadPack; loadPack = async function (id) {
    if (!SL.includes(id)) return lp(id);
    await lp("kousha"); if (id === "eki") await lp("densha");
    for (const p of ["long", "ltomo", "slong"]) if (!PACK.loaded[p]) { try { const r = await fetch(`packs/${p}.json`, { cache: "no-cache" }); if (r.ok) { const d = await r.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[p] = Object.keys(d); } } catch (e) { } }
    if (AUD["bgm_" + id]) await voiceBuf("bgm_" + id); return true; }; }
/* ---------- 場面の はいけい（テーマの 4つの ばしょ） ---------- */
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!isSL() || !SL_TH[curStage].areas.includes(place)) return dr(place, noSign);
    sceneLayer.innerHTML = ""; const L = sceneLayer, T = SL_TH[curStage], i = T.areas.indexOf(place);
    const sky = curStage === "suchu" ? "#1E2550" : curStage === "sokashi" ? "#FFE3EE" : "#BDE3F2";
    el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: sky }, L);
    if (curStage === "suchu") for (let k = 0; k < 50; k++) el("circle", { cx: (k * 233) % 1600, cy: (k * 97) % 700, r: 3, fill: "#FFF6C8" }, L);
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: T.fills[i] }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
    T.deco.slice(i * 2, i * 2 + 3).forEach(([e], k) => txt(L, 300 + k * 520, 520 - (k % 2) * 120, e, 150, { "text-anchor": "middle", opacity: .9 }));
    if (!noSign) { const g = el("g", {}, L); el("rect", { x: 560, y: 24, width: 480, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 7 ? 36 : 44, { "text-anchor": "middle" }); }
  }; }
// つっこみ・ギャグの へやは だいぼうけんと 同じ（ROOMS2 を つかう）

/* ================= おもしろ課題（こえなし。タッチで あそぶ） ================= */
const delta = (pc, d) => slMove(pc, d);
// 🎯 ストップ ゲーム：まわる ルーレットを タッチで とめる
async function slStop(pc) {
  const g = panel("ストップ ゲーム", "#FFFBE6"); const V = [3, -1, 2, 0, 4, -2, 1, "🎲"], C8 = ["#FF8FA3", "#B9A8D9", "#7FCBF0", "#DDDDDD", "#FFD25E", "#C9B8A8", "#7BD389", "#FFB98A"];
  const wheel = el("g", {}, g), cx = 800, cy = 560, R = 300;
  V.forEach((v, i) => { const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
    el("path", { d: `M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`, fill: C8[i], ...S6(5) }, wheel);
    const am = (a0 + a1) / 2; txt(wheel, cx + R * .66 * Math.cos(am), cy + R * .66 * Math.sin(am) + 20, typeof v === "number" ? (v > 0 ? "+" + v : v === 0 ? "0" : String(v)) : v, 58, { "text-anchor": "middle" }); });
  el("path", { d: `M${cx - 30} ${cy - R - 50} L${cx + 30} ${cy - R - 50} L${cx} ${cy - R + 10} Z`, fill: "#E8473C", ...S6(5) }, g);
  el("circle", { cx, cy, r: 40, fill: "#FFFFFF", ...S6(5) }, g);
  await speak(C.pony, "sl_stop", "ルーレットを とめよう！ すきな ときに タッチしてね");
  let ang = 0, sp = 520, stopping = false, done = false, tick = 0;
  const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001", style: "cursor:pointer" }, g);
  const fin = new Promise(res => { addTick(dt => { if (!g.isConnected) return false; if (stopping) sp = Math.max(0, sp - 420 * dt); ang = (ang + sp * dt) % 360; wheel.setAttribute("transform", `rotate(${ang.toFixed(1)} ${cx} ${cy})`);
      tick += sp * dt; if (tick > 45) { tick = 0; blip(900, 900, .03, "square"); } if (stopping && sp === 0 && !done) { done = true; res(); return false; } }); });
  hit.onclick = () => { hit.onclick = null; stopping = true; }; later(8000, () => { stopping = true; });
  await fin; const idx = Math.floor((((360 - ang) % 360) / 45)) % 8; const v = V[idx]; chime(); await sleep(700); g.remove();
  if (v === "🎲") { slFlag(pc, "dice2"); await speak(C.pony, "sl_st_d2", "サイコロ 2こ！ つぎの ばんで 2こ ふれるよ"); } else await delta(pc, v);
  return false;
}
// 🖐 つかまえろ：とびまわる ものを タッチ
const SL_ITEM = { sumi: "🐟", sokashi: "🍬", suchu: "⭐", eki: "🚃", odekake: "🦋" };
async function slCatch(pc) {
  const g = panel("つかまえろ！", "#EAF6FF"); const T = SL_TH[curStage];
  const cnt = txt(g, 800, 180, "0", 70, { "text-anchor": "middle" }); const bar = el("rect", { x: 300, y: 860, width: 1000, height: 26, rx: 13, fill: "#7BD389", ...S6(4) }, g);
  await speak(C.pony, `sl_catch_${curStage}`, `${T.item}を タッチして つかまえよう！`);
  let n = 0; const its = [];
  for (let i = 0; i < 6; i++) { const e = el("g", { style: "cursor:pointer" }, g); el("circle", { r: 105, fill: "#FFFFFF01" }, e); txt(e, 0, 34, SL_ITEM[curStage], 100, { "text-anchor": "middle" }); // あたりは 大きめの まる
    const o = { e, x: 200 + rnd(1200), y: 330 + rnd(420), vx: (rnd(2) ? 1 : -1) * (80 + rnd(80)), vy: (rnd(2) ? 1 : -1) * (60 + rnd(60)) }; its.push(o);
    e.onpointerdown = () => { if (o.got) return; o.got = 1; n++; cnt.textContent = n; blip(800 + n * 80, 1400, .08, "square"); for (let k = 0; k < 6; k++) mark("sparkle", o.x, o.y - 30, { vx: Math.cos(k) * 220, vy: Math.sin(k) * 220, life: .5, s: .5 });
      later(600, () => { o.got = 0; o.x = 200 + rnd(1200); o.y = 300 + rnd(450); }); }; }
  // つかまえた 数の 上限（声が ある 30 まで）
  const T0 = 10; let t = 0;
  await new Promise(res => addTick(dt => { if (!g.isConnected) return false; t += dt; bar.setAttribute("width", Math.max(0, 1000 * (1 - t / T0)).toFixed(0));
    its.forEach(o => { o.x += o.vx * dt; o.y += o.vy * dt; if (o.x < 160 || o.x > 1440) o.vx *= -1; if (o.y < 320 || o.y > 800) o.vy *= -1; o.e.setAttribute("transform", `translate(${o.x.toFixed(0)} ${o.y.toFixed(0)})`); o.e.setAttribute("opacity", o.got ? .15 : 1); });
    if (t >= T0) { res(); return false; } }));
  chime(); await sleep(400); g.remove(); n = Math.min(n, 30);
  await speak(C.pony, `sl_got_${n}`, `${n}こ つかまえた！`);
  await delta(pc, n >= 16 ? 6 : n >= 12 ? 5 : n >= 9 ? 4 : n >= 6 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0); return false;
}
// 🎈 ふうせん わり
async function slBalloon(pc) {
  const g = panel("ふうせん わり", "#FFF0F5"); const P = shuffle([3, 2, -2, "🎲", "🌱"]); const cols = ["#FF6F91", "#FFD25E", "#7FCBF0", "#7BD389", "#B9A8D9"];
  const bs = P.map((p, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 260 + i * 270; el("path", { d: `M${x} 720 Q${x - 10} 780 ${x + 10} 840`, fill: "none", ...S6(4) }, b);
    el("ellipse", { cx: x, cy: 560, rx: 100, ry: 130, fill: cols[i], ...S6(6) }, b); el("ellipse", { cx: x - 36, cy: 500, rx: 20, ry: 34, fill: "#FFFFFF", opacity: .6 }, b); el("path", { d: `M${x - 12} 690 L${x + 12} 690 L${x} 706 Z`, fill: cols[i], ...S6(4) }, b); b.x = x; return b; });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; bs.forEach((b, i) => b.setAttribute("transform", `translate(0 ${(Math.sin(t * 2 + i) * 14).toFixed(1)})`)); });
  await speak(C.pony, "sl_balloon", "ふうせんを ひとつ えらんで わってね");
  const i = await tapOnce(bs); const p = P[i], b = bs[i]; boom(.6); noise(.2, 2000, .7);
  for (let k = 0; k < 12; k++) mark("sparkle", b.x, 560, { vx: Math.cos(k * .52) * 400, vy: Math.sin(k * .52) * 400, life: .7, s: .7 });
  b.innerHTML = ""; txt(b, b.x, 600, typeof p === "number" ? (p > 0 ? "+" + p : String(p)) : p, 110, { "text-anchor": "middle" });
  await sleep(900); bs.forEach((o, j) => { if (j !== i) { o.innerHTML = ""; txt(o, o.x, 600, typeof P[j] === "number" ? (P[j] > 0 ? "+" + P[j] : String(P[j])) : P[j], 70, { "text-anchor": "middle", opacity: .5 }); } });
  await sleep(1300); g.remove();
  if (p === "🎲") { slFlag(pc, "dice2"); await speak(C.pony, "sl_st_d2", "サイコロ 2こ！ つぎの ばんで 2こ ふれるよ"); }
  else if (p === "🌱") { if (pc.player) pc.player.ok += 2; GS.ok += 2; GS.pend = 0; confetti(40); await speak(C.pony, "sl_bl_tane", "たねが 2こ でて きた！"); }
  else await delta(pc, p);
  return false;
}
// 🔢 どっちが おおい？
async function slMore(pc) {
  const g = panel("どっちが おおい？", "#F0FAEA"); const a = 4 + rnd(6); let b = a + (rnd(2) ? 1 : -1) * (1 + rnd(3)); b = Math.max(2, b);
  const E2 = SL_ITEM[curStage]; const sides = [a, b].map((n, s) => { const gg = el("g", { style: "cursor:pointer" }, g), x0 = 160 + s * 680;
    el("rect", { x: x0, y: 260, width: 600, height: 560, rx: 40, fill: "#FFFFFF", ...S6(6) }, gg);
    for (let k = 0; k < n; k++) txt(gg, x0 + 90 + (k % 4) * 140, 380 + Math.floor(k / 4) * 140, E2, 90, { "text-anchor": "middle" }); gg.rect = gg.firstChild; return gg; });
  await speak(C.pony, "sl_more", "おおいのは どっち？ はやく タッチしてね");
  const i = await Promise.race([tapOnce(sides), sleep(7000).then(() => -1)]); sides.forEach(s => s.onclick = null);
  const ok = i >= 0 && [a, b][i] > [a, b][1 - i]; const right = a > b ? 0 : 1;
  sides[right].rect.setAttribute("fill", "#C9EBB5"); if (i >= 0 && !ok) sides[i].rect.setAttribute("fill", "#FFC2D1");
  txt(g, 460, 870, String(a), 60, { "text-anchor": "middle" }); txt(g, 1140, 870, String(b), 60, { "text-anchor": "middle" });
  if (ok) { chime(); confetti(30); await speak(C.pony, "sl_good", "やったね！"); } else await speak(C.pony, "sl_miss", "ざんねん！");
  await sleep(800); g.remove(); await delta(pc, ok ? 2 : 0); return false;
}
// 🥤 どこに はいってる？（コップ シャッフル）
async function slCups(pc) {
  const g = panel("どこに はいってる？", "#FFF8E8"); const X = [400, 800, 1200], cups = [0, 1, 2].map(i => { const c = el("g", {}, g); el("path", { d: "M-80 -150 Q0 -170 80 -150 L112 88 Q0 108 -112 88 Z", fill: "#E8735A", ...S6(6) }, c); el("path", { d: "M-96 -40 Q0 -24 96 -40", fill: "none", stroke: "#FFFFFF", "stroke-width": 10, opacity: .6 }, c); el("ellipse", { cx: 0, cy: 90, rx: 112, ry: 16, fill: "#C9583F", ...S6(5) }, c); c.pos = i; c.y = 0; c.setAttribute("style", "cursor:pointer"); return c; });
  const ball = el("circle", { r: 46, fill: "#E8473C", ...S6(5) }, g); g.insertBefore(ball, cups[0]); let hasBall = rnd(3);
  const place = () => cups.forEach(c => c.setAttribute("transform", `translate(${X[c.pos]} ${700 + c.y})`));
  ball.setAttribute("cx", X[cups[hasBall].pos]); ball.setAttribute("cy", 744); place();
  await speak(C.pony, "sl_cups", "ボールは どこかな？ よく みててね");
  await tween(400, k => { cups[hasBall].y = -200 * Math.sin(k * Math.PI); place(); }); await sleep(300);
  ball.setAttribute("opacity", 0);
  const L = 4 + Math.min(4, E.L);
  for (let s = 0; s < L; s++) { const i = rnd(3); let j = rnd(2); j = j >= i ? j + 1 : j; const a = cups.find(c => c.pos === i), b = cups.find(c => c.pos === j);
    const xa = X[i], xb = X[j]; blip(500, 600, .05, "square"); await tween(Math.max(260, 480 - s * 25), k => { const e = k * k * (3 - 2 * k); a.setAttribute("transform", `translate(${xa + (xb - xa) * e} ${700 - 60 * Math.sin(k * Math.PI)})`); b.setAttribute("transform", `translate(${xb + (xa - xb) * e} ${700 + 60 * Math.sin(k * Math.PI)})`); }); a.pos = j; b.pos = i; }
  place(); await speak(C.pony, "sl_cups_q", "どこに はいってる？");
  const k = await tapOnce(cups); const ok = k === hasBall;
  ball.setAttribute("cx", X[cups[hasBall].pos]); ball.setAttribute("opacity", 1); await tween(400, t => { cups[k].y = -200 * Math.sin(t * Math.PI / 2); if (k !== hasBall) cups[hasBall].y = -200 * Math.sin(t * Math.PI / 2); place(); });
  if (ok) { chime(); confetti(30); await speak(C.pony, "sl_good", "やったね！"); } else await speak(C.pony, "sl_miss", "ざんねん！");
  await sleep(800); g.remove(); await delta(pc, ok ? 2 : 0); return false;
}
// どうぶつの なまえ（はじめて あそぶ 人にも わかるように）
const SL_DESC = { pyon: "うさぎの ", mii: "ねこの ", chu: "ねずみの ", gao: "ライオンの ", doshin: "ぞうの ", kamejii: "かめの ", nobbo: "きりんの ", kon: "きつねの ", meebaa: "ひつじの ", kuma: "くまの ", tora: "とらの ", shima: "しまうまの " };
// 👤 かげ あて
async function slShadow(pc) {
  const pool = ["pyon", "mii", "chu", "gao", "doshin", "kamejii", "nobbo", "kon", "meebaa", "kuma", "tora"];
  const ans = pool[rnd(pool.length)], opts = shuffle([ans, ...shuffle(pool.filter(k => k !== ans)).slice(0, 2)]);
  const g = panel("この かげは だれ？", "#F4EEFF");
  const f = el("filter", { id: "slsil" }, el("defs", {}, g)); el("feColorMatrix", { type: "matrix", values: "0 0 0 0 .17  0 0 0 0 .16  0 0 0 0 .2  0 0 0 1 0" }, f);
  const c = clone(ans, 800, 640, Math.min(.9, (KID_S[ans] || .8) * .9)); c.root.setAttribute("filter", "url(#slsil)"); hudLayer.appendChild(c.root);
  await speak(C.pony, "sl_shadow", "この かげは だれかな？");
  const cards = opts.map((k, i) => card(g, 140 + i * 450, 740, 420, 170, (SL_DESC[k] || "") + NAMES[k], null, { fs: 50 }));
  const i = await tapOnce(cards); const ok = opts[i] === ans; flashCard(cards[i], ok);
  c.root.removeAttribute("filter"); jump(c, .6); if (ok) { chime(); confetti(30); await speak(C.pony, "sl_good", "やったね！"); } else { flashCard(cards[opts.indexOf(ans)], true); await speak(C.pony, "sl_miss", "ざんねん！"); }
  await sleep(900); clearClones(); g.remove(); await delta(pc, ok ? 2 : 0); return false;
}
// 🦘 ジャンプ ゲーム
const SL_OBS = { sumi: "🌊", sokashi: "🍩", suchu: "☄️", eki: "🚃", odekake: "💧" };
async function slJump(pc) {
  const g = panel("ジャンプ ゲーム", "#EAF6FF"); el("rect", { x: 110, y: 760, width: 1380, height: 20, fill: SL_TH[curStage].fills[0], ...S6(4) }, g);
  const hero = clone(pc.kind, 400, 760, (KID_S[pc.kind] || .8) * .55); hudLayer.appendChild(hero.root); const by = hero.y;
  await speak(C.pony, `sl_jump_${curStage}`, `${SL_TH[curStage].obs}が くるよ！ タッチして ジャンプ！`);
  let jy = 0, jv = 0, ok = 0; const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001" }, g); hit.onclick = () => { if (jy === 0) { jv = 1150; blip(500, 900, .1, "sine"); } };
  for (let r = 0; r < 3; r++) { const o = txt(g, 1500, 750, SL_OBS[curStage], 110, { "text-anchor": "middle" }); let x = 1500, bumped = false; const sp = 520 + r * 90 + E.L * 15;
    await new Promise(res => addTick(dt => { if (!g.isConnected) { res(); return false; } x -= sp * dt; o.setAttribute("x", x.toFixed(0)); o.setAttribute("transform", `rotate(${(-x / 2) % 360} ${x} 715)`);
      jv -= 2600 * dt; jy = Math.max(0, jy + jv * dt); if (jy === 0) jv = 0; hero.y = by - jy * .7;
      if (!bumped && Math.abs(x - 400) < 70 && jy < 90) { bumped = true; flop(hero); noise(.15, 500, .6); }
      if (x < 120) { o.remove(); if (!bumped) { ok++; blip(1000, 1500, .1, "square"); } res(); return false; } }));
    await sleep(300); }
  hit.onclick = null; await speak(C.pony, `sl_jok_${ok}`, `${ok}かい とべた！`); await sleep(300); clearClones(); g.remove();
  await delta(pc, ok === 3 ? 3 : ok === 2 ? 1 : 0); return false;
}
// 🎲 みんなで サイコロ バトル：ひとりずつ じぶんの サイコロを タッチ
async function slBattle(pc) {
  const g = panel("サイコロ バトル", "#FFF8E8"); const ps = PLAYERS, W = 1300 / ps.length, vals = [];
  const dice = ps.map((p, i) => { const x = 150 + W * (i + .5); txt(g, x, 300, NAMES[p.kind], 42, { "text-anchor": "middle" });
    const d = el("g", { style: "cursor:pointer" }, g); const r = el("rect", { x: x - 90, y: 380, width: 180, height: 180, rx: 32, fill: "#FFFFFF", ...S6(7) }, d); const t = txt(d, x, 510, "？", 110, { "text-anchor": "middle" }); d.r = r; d.t = t; d.x = x; return d; });
  await speak(C.pony, "sl_battle", "みんなで サイコロ バトル！ いちばん おおきい めの ひとが 3マス すすむよ");
  await speak(C.pony, "sl_bt_tap", "じゅんばんに、じぶんの サイコロを タッチしてね");
  for (let i = 0; i < ps.length; i++) { const d = dice[i]; const off = lampOn(d.r); markAbove(ps[i].pc, "ex");
    if (ps[i].cpu) await sleep(800); else await new Promise(res => { d.onpointerdown = () => { d.onpointerdown = null; res(); }; }); off();
    for (let k = 0; k < 8; k++) { d.t.textContent = String(1 + rnd(6)); blip(400 + k * 50, 500, .04, "square"); await sleep(65); }
    const v = 1 + rnd(6); vals.push(v); d.t.textContent = String(v); boom(.2); await sleep(350); }
  const mx = Math.max(...vals); dice.forEach((d, i) => { if (vals[i] === mx) d.r.setAttribute("fill", "#FFE27A"); }); const win = ps.filter((p, i) => vals[i] === mx); await sleep(900); g.remove();
  if (win.length === ps.length) { await speak(C.pony, "sl_bt_all", "みんな おなじ！ みんなで 1マス すすもう"); for (const w of win) { await slGo(w.pc, 1); if (winner) break; } return false; }
  for (const w of win) { joy(w.pc); await speak(C.pony, `mw_${w.kind}`, `${NAMES[w.kind]}の かち！`); await slGo(w.pc, 3); if (winner) break; }
  return false;
}

/* ================= こえの おもしろ課題 ================= */
// 📣 おおきな こえで よぼう：マイクの 大きさ（または 聞きとり）で とおくの ものが ちかづく
async function slOogoe(pc) {
  const T = SL_TH[curStage]; const g = panel("おおきな こえで よぼう", "#EAF6FF"); const tgt = { sumi: "⛵", sokashi: "🐘", suchu: "👽", eki: "🧑‍✈️", odekake: "👮" }[curStage];
  const far = txt(g, 1300, 520, tgt, 60, { "text-anchor": "middle" }); const meter = el("rect", { x: 180, y: 820, width: 0, height: 40, rx: 20, fill: "#FF8FA3", ...S6(4) }, g); el("rect", { x: 180, y: 820, width: 1240, height: 40, rx: 20, fill: "none", ...S6(4) }, g);
  await speak(C.pony, `sl_oogoe_${curStage}`, `${T.call}を おおきな こえで よぼう！「おーい！」`);
  showTask("おーい！", "おおきな こえで", 260); setListen(pc, true);
  let an = null, peak = 0; try { if (MIC.stream && ctx) { const src = ctx.createMediaStreamSource(MIC.stream); an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an); } } catch (e) { an = null; }
  const buf = new Uint8Array(512); let heardOk = false;
  const tk = addTick(() => { if (!g.isConnected) return false; let lv = 0; if (an) { an.getByteTimeDomainData(buf); let s = 0; for (const v of buf) s += (v - 128) ** 2; lv = Math.min(1, Math.sqrt(s / buf.length) / 40); }
    peak = Math.max(peak * .995, lv, heardOk ? 1 : 0); meter.setAttribute("width", (1240 * peak).toFixed(0)); far.setAttribute("font-size", (60 + 260 * peak).toFixed(0)); far.setAttribute("x", (1300 - 500 * peak).toFixed(0)); });
  const r = await listen([["おーい", "おい", "おーーい", "オーイ", "おおい"]], 6000); heardOk = r.r === "ok"; setListen(pc, false); hideTask();
  await sleep(600); const ok = heardOk || peak > .7;
  if (ok) { chime(); confetti(40); await speak(C.pony, "sl_og_ok", "きこえた！ ちかくまで きて くれたよ"); } else await speak(C.pony, "sl_og_ng", "あれれ、きこえなかったみたい");
  g.remove(); await delta(pc, ok ? 2 : 0); return ok;
}
// 🐮 ものまね
const SL_MN = [
  { id: "inu", e: "🐶", n: "いぬ", a: "わんわん", keys: [["わん", "ワン"]] }, { id: "neko", e: "🐱", n: "ねこ", a: "にゃー", keys: [["にゃ", "ニャ"]] }, { id: "ushi", e: "🐮", n: "うし", a: "もー", keys: [["もー", "モー", "もう", "もお", "モウ"]] },
  { id: "buta", e: "🐷", n: "ぶた", a: "ぶーぶー", keys: [["ぶー", "ブー", "ぶう", "ブウ"]] }, { id: "kaeru", e: "🐸", n: "かえる", a: "けろけろ", keys: [["けろ", "ケロ", "げろ", "ゲロ"]] }, { id: "tori", e: "🐔", n: "にわとり", a: "こけこっこー", keys: [["こけこっこ", "コケコッコ", "こけっこ", "コケッコ"]] },
  { id: "hiyoko", e: "🐤", n: "ひよこ", a: "ぴよぴよ", keys: [["ぴよ", "ピヨ"]] }, { id: "hitsuji", e: "🐑", n: "ひつじ", a: "めー", keys: [["めー", "メー", "めえ", "メエ"]] }, { id: "lion", e: "🦁", n: "らいおん", a: "がおー", keys: [["がお", "ガオ"]] }, { id: "karasu", e: "🐦‍⬛", n: "からす", a: "かーかー", keys: [["かー", "カー", "かあ", "カア"]] },
];
async function slMonomane(pc) {
  const it = SL_MN[rnd(SL_MN.length)]; const g = panel("ものまね", "#FFF0F5"); txt(g, 800, 560, it.e, 300, { "text-anchor": "middle" });
  await speak(C.pony, `sl_mn_${it.id}`, `${it.n}は なんて なく？ まねしてね`);
  showTask("？？？", "なきごえを まねしよう", 260); setListen(pc, true); const r = await listen(it.keys, 6000); setListen(pc, false); hideTask();
  const ok = r.r === "ok"; if (ok) { chime(); confetti(40); await speak(C.pony, "sl_mn_ok", "そっくり！"); } else await speak(C.pony, `sl_mna_${it.id}`, `${it.n}は、${it.a}、だね`);
  playLog({ type: "monomane", id: it.id, ok, who: NAMES[pc.kind] }); grade(ok); g.remove(); await delta(pc, ok ? 1 : 0); return ok;
}
// 🔁 さかさことば：もじを うらがえして、ぎゃくから よむ
const SL_SK = [
  { w: "いか", r: "かい", keys: [["かい", "カイ", "貝", "会", "回", "海", "買い", "階", "下位", "甲斐", "飼い", "櫂", "開"]] }, { w: "なす", r: "すな", keys: [["すな", "スナ", "砂", "須奈"]] },
  { w: "たい", r: "いた", keys: [["いた", "イタ", "板", "居た", "痛", "伊田", "井田"]] }, { w: "かさ", r: "さか", keys: [["さか", "サカ", "坂", "酒", "逆", "阪", "佐賀", "左官"]] },
  { w: "くま", r: "まく", keys: [["まく", "マク", "幕", "巻く", "撒く", "膜", "蒔く", "真紅"]] }, { w: "とまと", r: "とまと", keys: [["とまと", "トマト"]] }, { w: "やおや", r: "やおや", keys: [["やおや", "ヤオヤ", "八百屋"]] }, { w: "しんぶんし", r: "しんぶんし", keys: [["しんぶんし", "シンブンシ", "新聞紙", "新聞誌", "新聞し"]] },
  { w: "いす", r: "すい", keys: [["すい", "スイ", "水", "粋", "酸い", "吸い", "推"]] }, { w: "ねこ", r: "こね", keys: [["こね", "コネ", "捏ね", "小根", "こねこ"]] }, { w: "るす", r: "する", keys: [["する", "スル", "擦る", "刷る", "摺る"]] },
  { w: "きつつき", r: "きつつき", keys: [["きつつき", "キツツキ", "啄木鳥"]] }, { w: "たけやぶ", r: "ぶやけた", keys: [["ぶやけた", "ブヤケタ", "分やけた", "部焼けた"]] },
];
async function slSakasa(pc) {
  const i = rnd(SL_SK.length), it = SL_SK[i]; const g = panel("さかさことば", "#F0FAEA"); const ch = [...it.w], W = 200, x0 = 800 - ch.length * W / 2;
  const tiles = ch.map((c, k) => { const t = card(g, x0 + k * W + 10, 380, W - 20, 220, c, null, { fs: 130 }); t.k = k; return t; });
  await speak(C.pony, `sl_sk_${i}`, `「${it.w}」を さかさまに いうと？`);
  await sleep(300); for (let s = 0; s < 3; s++) blip(600 + s * 100, 700, .06, "square");
  await tween(900, e => tiles.forEach(t => { const to = ch.length - 1 - t.k; t.setAttribute("transform", `translate(${((to - t.k) * W * e).toFixed(0)} ${(-120 * Math.sin(e * Math.PI)).toFixed(0)})`); }));
  showTask("？", "よんでみよう", 260); setListen(pc, true); it.keys.noCut = true; const r = await listen(it.keys, 10000); /* さかさことばは あたまの もじを けずった こうほを つかわない（「つき」「やけた」で せいかいに ならない） */ setListen(pc, false); hideTask();
  const ok = r.r === "ok"; if (ok) { chime(); confetti(40); await speak(C.pony, it.w === it.r ? "sl_sk_same" : "sl_good", it.w === it.r ? "せいかい！ さかさまでも おなじだね！" : "やったね！"); }
  else await speak(C.pony, `sl_ska_${i}`, it.w === it.r ? `こたえは「${it.r}」。さかさまでも おなじなんだよ` : `こたえは「${it.r}」`);
  playLog({ type: "sakasa", w: it.w, ok, who: NAMES[pc.kind] }); grade(ok); await sleep(400); g.remove(); await delta(pc, ok ? 1 : 0); return ok;
}
Object.assign(LTASK_RUN, { stop: slStop, catch: slCatch, balloon: slBalloon, more: slMore, cups: slCups, shadow: slShadow, jump: slJump, battle: slBattle, oogoe: slOogoe, monomane: slMonomane, sakasa: slSakasa });

/* ---------- メニュー：みんなで あそぶ に 3つ ---------- */
{ const smm = showMultiMenu; showMultiMenu = function () {
    smm(); const st = document.querySelector(".mstages"); if (!st) return; let after = st.querySelector(".mtomo") || st.querySelector(".mlong");
    SL.filter(sid => !SL_HIDE.has(sid)).forEach(sid => { const T = SL_TH[sid]; const b = document.createElement("button"); b.type = "button"; b.className = "mst mlong mslong";
      b.innerHTML = `<span class="mno">★★</span><span class="mico">${T.icon}</span><span class="mname">${T.name.replace(" の ", "の<br>").replace("の だいぼうけん", "の<br>だいぼうけん").replace("おでかけ だいぼうけん", "おでかけ<br>だいぼうけん")}</span><span class="mstat">ちょうロング</span>`;
      b.onclick = () => { const on = document.querySelector(".mnum.on"); if (!on) return; const n = parseInt(on.textContent, 10); boot(); document.getElementById("startBox").remove(); newGame({ stage: sid, multi: n }); };
      if (after) { after.after(b); after = b; } else st.prepend(b); }); }; }
(function () { const s = document.createElement("style"); s.textContent = `.start.menu .mst.mslong{background:#E3F3FF;border-color:#3E7FD6}.start.menu .mmcard .mst{padding-top:3px!important;padding-bottom:3px!important}.start.menu .mmcard .mst .mico{font-size:clamp(18px,2.4vw,26px)!important}.start.menu .mmcard .mstages{gap:5px!important;grid-template-columns:repeat(11,minmax(0,1fr))!important}.start.menu .mmcard{width:min(95%,1060px)!important}.start.menu .mmcard h2{font-size:clamp(28px,4.4vw,48px)!important}`; document.head.appendChild(s); })();

// 盤の 上の ぽにーは、マスの ない 右上へ
{ const sv = setView; setView = function (v, ...a) { const r = sv(v, ...a); if (v === "board" && isSL()) place(C.pony, 1545, 985, .32); return r; }; }

// 0マスの ときは マスの 課題も しない（つぎの ばんで もとに もどす）
{ const lc = landChild; landChild = async function (pc = P.shima) { if (isSL() && pc.player && pc.player.stay) { pc.player.stay = 0; return; } return lc(pc); }; }
// 🐬 のりもの：イルカ・ジェットコースター・ロケットなどが コマを のせて はこぶ（盤の 上で うごく）
const SL_VEH = { sumi: { warp: "🐬", bigwarp: "🚤", home: "🐳" }, sokashi: { warp: "🚃", bigwarp: "☁️", home: "🍫" }, suchu: { warp: "🌀", bigwarp: "🚀", home: "🌑" }, eki: { warp: "🚅", bigwarp: "LIN", home: "🚃" }, odekake: { warp: "🚌", bigwarp: "🚕", home: "🚌" } };
const SL_SWALLOW = { sumi: "home", suchu: "home" }; // くじら・ブラックホールは のみこむ（コマが きえて、スタートで でてくる）
// リニアモーターカー（えもじが ないので 絵で）：ひだりむき、ながい はなさき、しゃりん なしで ういて いる
function linearG(g, size) { const k = size / 130, o = el("g", {}, g), t = el("g", { transform: `scale(${k.toFixed(3)})` }, o);
  el("ellipse", { cx: -20, cy: 40, rx: 150, ry: 9, fill: "#9FE8FF", opacity: .8 }, t); el("rect", { x: -170, y: 46, width: 320, height: 10, rx: 5, fill: "#C9D3DE", stroke: INK, "stroke-width": 3 }, t);
  el("path", { d: "M-190 18 Q-150 -4 -40 -30 L130 -30 Q140 -30 140 -18 L140 18 Q140 24 130 24 L-110 24 Q-180 26 -190 18 Z", fill: "#F4F7FA", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, t);
  el("path", { d: "M-150 8 L130 6 L130 14 L-170 16 Z", fill: "#3E5BD6" }, t); el("path", { d: "M-96 -12 Q-80 -24 -50 -24 L-50 -6 L-100 -6 Z", fill: "#2B2A33" }, t);
  [-20, 20, 60, 100].forEach(x => el("rect", { x, y: -20, width: 26, height: 16, rx: 4, fill: "#BDE3F2", stroke: INK, "stroke-width": 3 }, t));
  [0, 1, 2].forEach(i => el("path", { d: `M${150 + i * 18} ${-14 + i * 12} h${24 + i * 6}`, stroke: "#7FCBF0", "stroke-width": 5, "stroke-linecap": "round" }, t)); return o; }
function slEmoji(e, x, y, size = 120) { const g = el("g", {}, front()); const t = e === "LIN" ? linearG(g, size) : txt(g, 0, size * .36, e, size, { "text-anchor": "middle" }); g.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`); g.__t = t; return g; }
async function slRide(pc, toId, e, opt = {}) {
  const [tx, ty] = nodeXY(pc, toId), x0 = pc.px, y0 = pc.py, dir = tx >= x0 ? 1 : -1, sz = opt.size || 130;
  const v = slEmoji(e, x0 - dir * 900, y0 + 10, sz); const faceL = ["🚅", "🚄", "🚃", "LIN", "🚌", "🚕"].includes(e); // でんしゃの えもじは ひだりむき → すすむ ほうに むける（2026-10-18 ぎゃくそう なおし）
  if (faceL ? dir > 0 : (dir < 0 && !opt.noflip)) v.__t.setAttribute("transform", "scale(-1 1)");
  const at = (x, y) => v.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`);
  noise(.4, 600, .3); await tween(700, k => at(x0 - dir * 900 * (1 - k), y0 + 10 + Math.sin(k * 12) * 6)); // やってくる
  jump(pc, .6); blip(500, 900, .15, "sine"); await sleep(350); // のる
  const cx = (x0 + tx) / 2, cy = Math.min(y0, ty) - (opt.arc ?? 140);
  await tween(opt.ms || 1600, k => { const u = 1 - k; const x = u * u * x0 + 2 * u * k * cx + k * k * tx, y = u * u * y0 + 2 * u * k * cy + k * k * ty + Math.sin(k * 14) * 5; at(x, y); pc.px = x; pc.py = y - 36; if (k < 1 && k * 20 % 4 < .3) mark("puff", x - dir * 50, y + 30, { vy: -40, life: .5, s: .4 }); });
  pc.node = toId; pc.px = tx; pc.py = ty; pc.trail = []; jump(pc, .5); chime(); // おりる
  await tween(600, k => at(tx + dir * 900 * k, ty + 10 + Math.sin(k * 10) * 6)); v.remove();
}
async function slSwallow(pc, e, blink = false) {
  const [tx, ty] = nodeXY(pc, "0"), x0 = pc.px, y0 = pc.py, sz = 170;
  const v = slEmoji(e, blink ? x0 : x0 + 900, y0, sz); const at = (x, y, k = 1) => v.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${k})`);
  if (blink) { v.setAttribute("opacity", 0); await tween(500, k => { v.setAttribute("opacity", k); at(x0, y0, k); }); } else { noise(.5, 300, .4); await tween(800, k => at(x0 + 900 * (1 - k), y0 + Math.sin(k * 8) * 8)); }
  blip(200, 60, .4, "triangle"); await tween(500, k => { pc.root.setAttribute("opacity", (1 - k).toFixed(2)); pc.py = y0 + 30 * k; }); pc.root.setAttribute("opacity", 0); // のまれる
  for (let i = 0; i < 6; i++) later(i * 60, () => mark("puff", x0, y0 - 20, { vy: -80, life: .5, s: .5 }));
  if (blink) { await tween(500, k => { v.setAttribute("opacity", 1 - k); at(x0, y0, 1 - k); }); v.setAttribute("opacity", 0); at(tx, ty, 0); await tween(500, k => { v.setAttribute("opacity", k); at(tx, ty, k); }); }
  else { v.__t.setAttribute("transform", "scale(-1 1)"); const cx = (x0 + tx) / 2, cy = Math.min(y0, ty) - 160; await tween(1600, k => { const u = 1 - k; at(u * u * x0 + 2 * u * k * cx + k * k * tx, u * u * y0 + 2 * u * k * cy + k * k * ty + Math.sin(k * 12) * 6); }); }
  pc.node = "0"; pc.px = tx; pc.py = ty; pc.trail = []; noise(.3, 900, .4); await tween(400, k => { pc.root.setAttribute("opacity", k.toFixed(2)); pc.py = ty - 60 * Math.sin(k * Math.PI); }); pc.root.setAttribute("opacity", 1); pc.py = ty; jump(pc, .5); // はきだされる
  if (blink) await tween(400, k => { v.setAttribute("opacity", 1 - k); at(tx, ty, 1 - k); }); else await tween(700, k => at(tx - 900 * k, ty + Math.sin(k * 8) * 8)); v.remove();
}
// 🔀 くみかえ：コースを 6マスずつの ブロック（11こ）に わけて、スタートと ゴールの ブロック いがいを ならべかえる。
//    コマは のって いる マスごと いっしょに うごくので、じゅんばん（まえ・うしろ）も かわる。
function slRelink(sid, O) { const nx = BOARD[sid].next; Object.keys(nx).forEach(k => delete nx[k]); linkLine(nx, O); SL_ORDER[sid] = O; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (SL.includes(id) && SL_ORDER0[id]) slRelink(id, SL_ORDER0[id].slice()); return ap(id, ...a); }; }
async function slKumikae(pc) {
  const sid = curStage, O = SL_ORDER[sid].slice(), SZ = 6, segs = [];
  for (let i = 0; i < O.length; i += SZ) segs.push(O.slice(i, i + SZ));
  const head = segs[0], tail = segs[segs.length - 1], mid = segs.slice(1, -1); let mixed;
  do { mixed = shuffle(mid); } while (mixed.every((g, i) => g === mid[i]));
  const O2 = [...head, ...mixed.flat(), ...tail];
  const from = {}, to = {}, segOf = {}; O.forEach(id => from[id] = NODES[id].slice(0, 2)); O2.forEach((id, k) => to[id] = SL_PTS[sid][k]);
  mixed.forEach((g, j) => g.forEach(id => segOf[id] = j));
  const pcs = PLAYERS.map(p => p.pc).concat(P.doshin && P.doshin.node === BLOCK ? [P.doshin] : []);
  // 1) ゆれて、みちが ブロックごとに きれる
  noise(1.2, 120, .7); let t = 0;
  await new Promise(res => addTick(dt => { t += dt; boardLayer.setAttribute("transform", t < 1 ? `translate(${(Math.sin(t * 60) * 10 * (1 - t)).toFixed(1)} ${(Math.cos(t * 47) * 6 * (1 - t)).toFixed(1)})` : ""); if (t >= 1) { res(); return false; } }));
  const nx = BOARD[sid].next; Object.keys(nx).forEach(k => delete nx[k]); segs.forEach(g => linkLine(nx, g)); drawBoard(); blip(300, 900, .3, "sine");
  await sleep(500);
  // 2) ブロックが ふわっと とんで、あたらしい ばしょへ（コマも いっしょ）
  const D = 1.3, ST = .12, total = D + ST * (mixed.length - 1); let acc = 1; t = 0;
  mixed.forEach((g, j) => later(j * ST * 1000, () => blip(500 + j * 60, 900 + j * 60, .12, "sine")));
  await new Promise(res => addTick(dt => { t += dt; acc += dt; const done = t >= total;
    if (acc >= .05 || done) { acc = 0;
      O.forEach(id => { const j = segOf[id]; if (j === undefined) return; const k = done ? 1 : Math.min(1, Math.max(0, (t - j * ST) / D));
        const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, lift = Math.sin(k * Math.PI) * 110;
        NODES[id][0] = Math.round(from[id][0] + (to[id][0] - from[id][0]) * e); NODES[id][1] = Math.round(from[id][1] + (to[id][1] - from[id][1]) * e - lift); });
      drawBoard(); pcs.forEach(p => { if (p && p.node && NODES[p.node]) [p.px, p.py] = nodeXY(p, p.node); }); }
    if (done) { res(); return false; } }));
  // 3) みちが つながる
  slRelink(sid, O2); drawBoard(); pcs.forEach(p => { if (p && p.node && NODES[p.node]) [p.px, p.py] = nodeXY(p, p.node); });
  chime(); mixed.forEach((g, j) => later(j * 60, () => { const [x, y] = NODES[g[0]]; mark("sparkle", x, y - 20, { vy: -160, life: .6, s: .5 }); }));
  await sleep(900);
}
