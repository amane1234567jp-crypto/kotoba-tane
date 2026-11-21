/* ---------- とうろくした ひと（2026-11-19）・リンクの種類 ----------
   「とうろく」と「あそぶ」を分けた（あまねさん 2026-11-19）。
   ・とうろく（さそう）リンク：?m=reg&n=名前&fd=端末番号 … ひらくと とうろく するだけ（ゲームは始まらない）
   ・あそぶ リンク        ：?m=play&r=部屋&n=名前&fd=端末番号 … ひらくと その部屋で 対局
   ・むかしの リンク（m なし）：?r=部屋&n=&fd= … 1.0.4 までの招待。これまでどおり 登録して 対局
   とうろくした ひと は 1つの表（端末番号＋名前。むかしの記録は 部屋だけのものもある）。
   ここは画面に さわらない純関数だけ（node で検算：reversi/tests/people-check.js） */
const PEOPLE_MAX = 8;
const DEV_RE = /^[A-Za-z0-9_-]{16,64}$/;
const ROOM_RE = /^[a-z0-9]{4,40}$/;
const cleanName = s => String(s || "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, 10);

// 1人ぶんを 表に入れる（同じ端末番号、なければ同じ部屋の人を 上書き。新しい人が 先頭）
function peopleUpsert(list, rec) {
  const dev = DEV_RE.test(rec.dev || "") ? rec.dev : "", room = ROOM_RE.test(rec.room || "") ? rec.room : "";
  if (!dev && !room) return list.slice();
  const out = list.slice();
  let i = dev ? out.findIndex(p => p.dev === dev) : -1;
  if (i < 0 && room) i = out.findIndex(p => p.room === room && (!p.dev || !dev || p.dev === dev));
  const old = i >= 0 ? out[i] : {};
  const name = cleanName(rec.name) || old.name || "あいて";
  const merged = { dev: dev || old.dev || "", room: room || old.room || "", name, at: rec.at || Date.now() };
  if (i >= 0) out.splice(i, 1);
  out.unshift(merged);
  // 端末番号で 入った人と、部屋だけで 覚えていた むかしの記録が 同じ人なら 1つにまとめる
  if (merged.dev && merged.room) for (let j = out.length - 1; j > 0; j--) if (out[j].room === merged.room && !out[j].dev) out.splice(j, 1);
  return out.slice(0, PEOPLE_MAX);
}
function peopleRemove(list, key) { return list.filter(p => (p.dev || "r:" + p.room) !== key); }
const peopleKey = p => p.dev || "r:" + p.room;

// 1.0.4 までの2つの表（よんだ相手＝callers、招待された部屋＝partners）を 1つに まとめる
function peopleMigrate(partnersList, callersList) {
  let out = [];
  const all = []
    .concat((callersList || []).map(c => ({ dev: c.dev, name: c.name === "あいて" ? "" : c.name, at: c.at || 0 })))
    .concat((partnersList || []).map(p => ({ dev: p.dev, room: p.room, name: p.name === "たいせんあいて" ? "" : p.name, at: p.at || 0 })))
    .sort((a, b) => (a.at || 0) - (b.at || 0));   // 古い順に入れて、新しい人が 先頭に来るように
  for (const r of all) out = peopleUpsert(out, Object.assign({}, r, { at: r.at || 1 }));
  return out;
}

// リンクを読む
function parseLink(search) {
  const q = new URLSearchParams(search || "");
  const m = q.get("m"), r = q.get("r") || "", n = cleanName(q.get("n")), fd = DEV_RE.test(q.get("fd") || "") ? q.get("fd") : "";
  if (m === "reg") return fd ? { mode: "reg", name: n, dev: fd, room: "" } : { mode: null };
  if (r && ROOM_RE.test(r)) return { mode: m === "play" ? "play" : "legacy", room: r, name: n, dev: fd };
  return { mode: null };
}
// リンクを作る（openExternalBrowser=1：LINE の中のブラウザではなく Safari／Chrome で開かせる）
function regLink(base, name, dev) {
  return base + "?m=reg" + (name ? "&n=" + encodeURIComponent(name) : "") + "&fd=" + dev + "&openExternalBrowser=1";
}
function playLink(base, room, name, dev) {
  return base + "?m=play&r=" + room + (name ? "&n=" + encodeURIComponent(name) : "") + (dev ? "&fd=" + dev : "") + "&openExternalBrowser=1";
}
// LINE で送る文（受けとるのは おとな。ふつうの漢字かなまじり。2026-11-21 あまねさん）
// 本文（リンクの前）。送る前に アプリの中で 見せて 直せる（LINE 側では 本文が見えない・直せない：11/21 実機で確認）
const regBody = myName => `${myName ? myName + "です。" : ""}テレビ電話をしながらリバーシで遊べるアプリがあるので、いっしょに遊びませんか？\n下のリンクからアプリを入れて（無料）、開いてください。`;
const playBody = myName => `${myName ? myName + "です。" : ""}いまリバーシで遊べるよ！ このリンクをタップしてね。`;
// 本文 ＋ リンク（リンクは かならず 最後に つける。本文を 消しても リンクだけは 送る）
const withLink = (body, url) => (String(body || "").trim() ? String(body).trim().slice(0, 300) + "\n" : "") + url;
// リンクも 文面の中に 見せる（2026-11-21 あまねさん「あとから追加されるのは分かりづらい」）。
// 送るときは 文面の中の このアプリの リンクを いまの 正しい リンクに 置きかえる（書きかえで 壊れても・名前が変わっても 大丈夫）。
// 消してしまっていたら 最後に つける。2つ以上あれば 最初の1つだけ 残す
const OUR_LINK = /https?:\/\/(?:www\.uchinoaji\.com\/rv\/|amane1234567jp-crypto\.github\.io\/kotoba-tane\/reversi\/)[^\s]*/g;
function fixLink(text, url) {
  let t = String(text || "").slice(0, 600), seen = false;
  t = t.replace(OUR_LINK, () => { if (seen) return ""; seen = true; return url; }).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return seen ? t : (t ? t + "\n" : "") + url;
}
const regText = (myName, url) => withLink(regBody(myName), url);
const playText = (myName, url) => withLink(playBody(myName), url);
// LINE を直接ひらく（相手を選んだあと、送る前に 文を見て 直せる…かを 実機で ためす。2026-11-21）
const lineShareURL = text => "https://line.me/R/share?text=" + encodeURIComponent(text);
const lineMsgURL = text => "line://msg/text/" + encodeURIComponent(text);

if (typeof module !== "undefined") module.exports = { peopleUpsert, peopleRemove, peopleKey, peopleMigrate, parseLink, regLink, playLink, regText, playText, regBody, playBody, withLink, fixLink, lineShareURL, lineMsgURL, PEOPLE_MAX };
