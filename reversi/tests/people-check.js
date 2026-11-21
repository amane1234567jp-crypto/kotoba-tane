// とうろくした ひと・リンクの種類 の検算（node reversi/tests/people-check.js）
const P = require("../src/people.js");
let fail = 0;
const eq = (a, b, msg) => { const ok = JSON.stringify(a) === JSON.stringify(b); console.log((ok ? "OK  " : "NG  ") + msg + (ok ? "" : `\n    got ${JSON.stringify(a)}\n    exp ${JSON.stringify(b)}`)); if (!ok) fail++; };
const D1 = "AAAAAAAAAAAAAAAAAAAA", D2 = "BBBBBBBBBBBBBBBBBBBB", D3 = "CCCCCCCCCCCCCCCCCCCC";

// リンクを読む
eq(P.parseLink("?m=reg&n=%E3%81%B0%E3%81%82%E3%81%B0&fd=" + D1).mode, "reg", "とうろくリンク");
eq(P.parseLink("?m=reg&n=x").mode, null, "端末番号のない とうろくリンクは 無視");
eq(P.parseLink("?m=play&r=abcd1234&n=a&fd=" + D1), { mode: "play", room: "abcd1234", name: "a", dev: D1 }, "あそぶリンク");
eq(P.parseLink("?r=abcd1234&n=a&fd=" + D1).mode, "legacy", "むかしのリンク（m なし）は legacy");
eq(P.parseLink("?r=ab&fd=" + D1).mode, null, "部屋の形が おかしければ 無視");
eq(P.parseLink("?m=play&r=abcd1234&fd=bad").dev, "", "端末番号の形が おかしければ 空");
eq(P.parseLink("").mode, null, "ふつうの起動");
// 作って 読みもどせる
const base = "https://www.uchinoaji.com/rv/";
eq(P.parseLink(P.regLink(base, "ばあば", D1).split("?")[1]), { mode: "reg", name: "ばあば", dev: D1, room: "" }, "とうろくリンクを 作って 読める");
eq(P.parseLink(P.playLink(base, "abcd1234", "ゆうくん", D2).split("?")[1]), { mode: "play", room: "abcd1234", name: "ゆうくん", dev: D2 }, "あそぶリンクを 作って 読める");
eq(new URL(P.regLink(base, "a", D1)).searchParams.has("r"), false, "とうろくリンクには 部屋が 入らない（ひらいても 対局しない）");

// 表
let L = [];
L = P.peopleUpsert(L, { dev: D1, name: "ばあば", at: 1 });
L = P.peopleUpsert(L, { dev: D2, name: "じいじ", at: 2 });
eq(L.map(p => p.name), ["じいじ", "ばあば"], "新しい人が 先頭");
L = P.peopleUpsert(L, { dev: D1, name: "おおばあば", at: 3 });
eq(L.map(p => p.name), ["おおばあば", "じいじ"], "同じ端末番号は 1人（名前を 上書き）");
L = P.peopleUpsert(L, { dev: D1, name: "", at: 4 });
eq(L[0].name, "おおばあば", "名前が 空なら 前の名前のまま");
L = P.peopleUpsert(L, { dev: D2, room: "room1234", at: 5 });
eq(L[0], { dev: D2, room: "room1234", name: "じいじ", at: 5 }, "あとから部屋が わかったら 足す");
eq(P.peopleUpsert(L, { name: "x" }).length, L.length, "端末番号も部屋もない人は 入れない");
eq(P.peopleRemove(L, D1).map(p => p.name), ["じいじ"], "けす");
let M = []; for (let i = 0; i < 12; i++) M = P.peopleUpsert(M, { dev: ("D" + i).padEnd(20, "x"), name: "p" + i });
eq(M.length, P.PEOPLE_MAX, "8人まで");

// 1.0.4 までの記録から まとめる
const mig = P.peopleMigrate(
  [{ room: "room1111", name: "ばあば", dev: D1, at: 10 }, { room: "room2222", name: "たいせんあいて", at: 5 }],
  [{ dev: D1, name: "あいて", at: 20 }, { dev: D3, name: "おじさん", at: 30 }]
);
eq(mig.map(p => [p.name, !!p.dev, p.room]), [["おじさん", true, ""], ["ばあば", true, "room1111"], ["あいて", false, "room2222"]], "むかしの2つの表を 1つに（同じ端末は まとめる・名前は 意味のあるほう）");
eq(P.peopleMigrate(null, null), [], "記録がなければ 空");
// 部屋だけの むかしの記録に、同じ部屋で端末番号つきが来たら 1つに
let R = P.peopleUpsert([], { room: "room3333", name: "ばあば" });
R = P.peopleUpsert(R, { room: "room3333", dev: D1, name: "ばあば" });
eq(R.length, 1, "部屋だけの記録と 端末番号つきが 同じ人なら 1つに");

// 送る文
eq(P.regText("ゆうくん", "U"), "ゆうくんです。テレビ電話をしながらリバーシで遊べるアプリがあるので、いっしょに遊びませんか？\n下のリンクからアプリを入れて（無料）、開いてください。\nU", "さそう文（あまねさんと決めた文）");
eq(/なかま|まだ ゲーム/.test(P.regText("a", "u") + P.playText("a", "u")), false, "送る文に「なかま」「まだ ゲームは」を 入れない");
eq(decodeURIComponent(P.lineShareURL("あ\nhttps://x/?a=1&b=2").split("text=")[1]), "あ\nhttps://x/?a=1&b=2", "LINE を ひらく URL に 文が そのまま 入る（& も こわれない）");
eq(P.playText("", "u").startsWith("いまリバーシで遊べるよ"), true, "名前がなくても 文になる");

console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
process.exit(fail ? 1 : 0);
