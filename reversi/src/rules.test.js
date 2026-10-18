// node src/rules.test.js
const R = require("./rules.js");
let fails = 0;
const ok = (cond, msg) => { if (!cond) { fails++; console.log("NG", msg); } };

// 1. 初期局面の合法手は4つ、どれも1枚返す
const b0 = R.initBoard();
const m0 = R.legalMoves(b0, R.BLACK).map(m => `${m.r}${m.c}:${m.n}`).sort();
ok(JSON.stringify(m0) === JSON.stringify(["23:1", "32:1", "45:1", "54:1"]), "初期の合法手 " + m0);

// 2. (2,3) に置くと (3,3) が返る
const a = R.applyMove(b0, R.BLACK, 2, 3);
ok(a.board[R.at(3, 3)] === R.BLACK && R.count(a.board).black === 4, "1手目の裏返し");
ok(a.flips.length === 1 && a.flips[0].dir.join() === "1,0", "方向は下");

// 3. 置けないマス
ok(R.flipsFor(b0, R.BLACK, 0, 0).length === 0, "角は置けない");
ok(R.flipsFor(b0, R.BLACK, 3, 3).length === 0, "石のあるマスは置けない");

// 4. 乱数で1000局。履歴の再計算と1手ずつの計算が一致し、終局で両者とも置けない
let seed = 7; const rnd = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
let withPass = null, nearEnd = null, games = 0;
for (let g = 0; g < 1000; g++) {
  const hist = []; let s = R.replay(hist), passes = 0;
  while (!s.over) {
    const ms = R.legalMoves(s.board, s.turn);
    const m = ms[rnd(ms.length)];
    const before = s;
    hist.push([m.r, m.c]);
    s = R.replay(hist);
    const inc = R.applyMove(before.board, before.turn, m.r, m.c).board;
    ok(inc.join() === s.board.join(), "再計算の一致 " + g);
    if (s.passed) { passes++; if (!withPass && hist.length > 30) withPass = hist.slice(0, -1); }
  }
  const c = R.count(s.board);
  ok(!R.legalMoves(s.board, 1).length && !R.legalMoves(s.board, 2).length, "終局の判定 " + g);
  ok(c.black + c.white <= 64, "石の数");
  if (!nearEnd && hist.length >= 58) nearEnd = hist.slice(0, -3);
  games++;
}

// 5. まった：自分の手の直後なら1手、相手が打った後なら2手
const h = [[2, 3], [2, 2]];
ok(R.undoDepth(h, R.WHITE) === 1, "しろの直後のまった");
ok(R.undoDepth(h, R.BLACK) === 2, "くろは2手もどす");
ok(R.undoDepth([], R.BLACK) === 0, "手がないときは もどせない");

console.log(fails ? `${fails} 件 NG` : `OK（${games}局）`);
require("fs").writeFileSync(__dirname + "/fixtures.js", `/* 確認用の局面（rules.test.js が自動生成） */\nconst FIX = ${JSON.stringify({ pass: withPass, end: nearEnd })};\n`);
process.exit(fails ? 1 : 0);
