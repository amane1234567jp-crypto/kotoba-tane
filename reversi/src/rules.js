/* ---------- リバーシのルール（画面にも通信にも依存しない） ----------
   盤は 64 マスの配列。0 = 空き、1 = くろ、2 = しろ。くろが先手。
   対局は「手の履歴」（[行, 列] の列）だけで表す。パスは履歴に入れず、
   再計算のときに自動で入る。両方の端末が同じ履歴を持てば、同じ盤になる。 */
const EMPTY = 0, BLACK = 1, WHITE = 2;
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const opp = p => 3 - p;
const at = (r, c) => r * 8 + c;
const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

function initBoard() {
  const b = new Array(64).fill(EMPTY);
  b[at(3, 3)] = WHITE; b[at(3, 4)] = BLACK; b[at(4, 3)] = BLACK; b[at(4, 4)] = WHITE;
  return b;
}

/* 置いたときに返る石を、方向ごとに「置いた石に近い順」で返す */
function flipsFor(b, p, r, c) {
  if (!inside(r, c) || b[at(r, c)] !== EMPTY) return [];
  const out = [];
  for (const [dr, dc] of DIRS) {
    const cells = [];
    let y = r + dr, x = c + dc;
    while (inside(y, x) && b[at(y, x)] === opp(p)) { cells.push([y, x]); y += dr; x += dc; }
    if (cells.length && inside(y, x) && b[at(y, x)] === p) out.push({ dir: [dr, dc], cells });
  }
  return out;
}
const flipCount = f => f.reduce((n, d) => n + d.cells.length, 0);

function legalMoves(b, p) {
  const list = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const f = flipsFor(b, p, r, c);
    if (f.length) list.push({ r, c, n: flipCount(f) });
  }
  return list;
}

function applyMove(b, p, r, c) {
  const flips = flipsFor(b, p, r, c);
  if (!flips.length) throw new Error(`置けない手: ${r},${c}`);
  const nb = b.slice();
  nb[at(r, c)] = p;
  flips.forEach(d => d.cells.forEach(([y, x]) => { nb[at(y, x)] = p; }));
  return { board: nb, flips };
}

function count(b) {
  let black = 0, white = 0;
  b.forEach(v => { if (v === BLACK) black++; else if (v === WHITE) white++; });
  return { black, white };
}

/* 履歴から盤を作り直す。turn = 次に打つ側（パスは解決済み）、
   passed = 直前にパスが起きた側（なければ 0）、over = 終局 */
function replay(history) {
  let b = initBoard(), turn = BLACK, passed = 0;
  const steps = [];
  for (const [r, c] of history) {
    if (!legalMoves(b, turn).length) turn = opp(turn);
    const { board, flips } = applyMove(b, turn, r, c);
    steps.push({ player: turn, r, c, flips });
    b = board; turn = opp(turn);
  }
  let over = false;
  if (!legalMoves(b, turn).length) {
    if (legalMoves(b, opp(turn)).length) { passed = turn; turn = opp(turn); }
    else over = true;
  }
  return { board: b, turn, passed, over, steps };
}

/* その側の最後の手を取り消すには、末尾から何手もどすか（0 = もどせない） */
function undoDepth(history, player) {
  const { steps } = replay(history);
  for (let i = steps.length - 1; i >= 0; i--) if (steps[i].player === player) return steps.length - i;
  return 0;
}

if (typeof module !== "undefined") module.exports = { EMPTY, BLACK, WHITE, DIRS, opp, at, initBoard, flipsFor, flipCount, legalMoves, applyMove, count, replay, undoDepth };
