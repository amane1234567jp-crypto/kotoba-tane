/* ---------- 遠隔対戦の回数と、課金による解放 ----------
   遠隔対戦は 10回まで無料。11回目からは「解放」（買い切り）が必要。
   払うのは よぶ側（親機・ホスト）だけ。リンクから入る相手（ゲスト）は いつでも無料。
   回数は「対局が始まった」ときに数える（もういっかい も1回。つなぎなおしは数えない）。

   いまの Web 版（GitHub Pages）では ストアの課金が使えないので、購入ボタンは
   「ストア版で解放できます」の案内になる。ストア版（Capacitor）では window.MarushimaIAP
   （ネイティブ側が用意する）を通して App Store／Google Play のアプリ内課金を呼ぶ。
   開発・確認用に、おとなの設定の中に「テスト用に解放」の切り替えがある（ストア版では外す）。 */
const BILLING = (() => {
  const FREE = 10, KEY = "marushima-reversi-remote";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* 保存できなくても遊べる */ } };
  const st = Object.assign({ used: 0, unlocked: false, log: [] }, load());
  const iap = () => window.MarushimaIAP || null;
  const B = {
    FREE,
    get used() { return st.used; },
    get left() { return Math.max(0, FREE - st.used); },
    get unlocked() { return !!st.unlocked; },
    get allowed() { return st.unlocked || st.used < FREE; },
    // 対局が始まったときに1回数える
    count() { if (st.unlocked) return; st.used++; st.log = (st.log || []).concat(Date.now()).slice(-50); save(st); },
    setUnlocked(v, how) { st.unlocked = !!v; st.unlockedBy = how || ""; st.unlockedAt = v ? Date.now() : 0; save(st); },
    get canBuy() { return !!iap(); },
    // 購入（ストア版だけ）。成功したら解放
    async purchase() {
      const p = iap(); if (!p) return { ok: false, reason: "web" };
      try { const r = await p.purchase("remote_unlock"); if (r && r.ok) B.setUnlocked(true, "store"); return r || { ok: false }; }
      catch (e) { return { ok: false, reason: String(e) }; }
    },
    // 機種変更などで購入を引きつぐ（ストア版だけ）
    async restore() {
      const p = iap(); if (!p) return { ok: false, reason: "web" };
      try { const r = await p.restore("remote_unlock"); if (r && r.ok) B.setUnlocked(true, "restore"); return r || { ok: false }; }
      catch (e) { return { ok: false, reason: String(e) }; }
    },
  };
  return B;
})();
