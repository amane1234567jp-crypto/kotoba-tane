"""2026-10-13 夜：ステージの ライバル（すごろくで いっしょに すすむ 子）が 場面にも 出ると、
すごろくでは うしろに いるのに 同じ マスに いるように 見えて おかしい。→ その 役を とらの「とらお」・くまの「くまた」に かえる。
実行の じゅん: … → sits_fix2.py → sits_fix3.py（何回 実行しても よい）"""
import json
from pathlib import Path
from sits_more import yfix

SWAP = {  # 場面 → あたらしい 相手役
    "butsukaru": "tora", "sakaagari": "tora", "koronda": "kuma", "kurakura": "kuma", "irete": "tora",
    "maigo": "kuma", "orimasu": "kuma", "tkakashingou": "tora", "kygyuunyuu": "kuma", "damedayo": "tora"}
TEXT = {  # 名前などの 書きかえ（ひらがな → ひらがな、漢字まじりにも おなじ ように）
    "orimasu": [("どしん、", "くまたくん、")],
    "tkakashingou": [("がおくん、", "とらおくん、"), ("ガオくん、", "とらおくん、")],
    "kygyuunyuu": [("はなが あたっちゃった", "ひじが あたっちゃった"), ("鼻が当たっちゃった", "肘が当たっちゃった")],
}
KEYS = {"tkakashingou": None, "orimasu": None}

if __name__ == "__main__":
    P = Path(__file__).resolve().parent / "sits.json"
    S = json.loads(P.read_text())
    for s in S:
        if s["id"] in SWAP: s["asker"] = SWAP[s["id"]]
        for a, b in TEXT.get(s["id"], []):
            for f in ("q", "qy", "res", "ry"):
                if f in s: s[f] = s[f].replace(a, b)
            for t in s["tiers"]:
                for f in ("a", "y", "wrong", "wy"):
                    if f in t: t[f] = t[f].replace(a, b)
        for f in ("qy", "ry"): s[f] = yfix(s[f]) if f in s else None
        for t in s["tiers"]:
            if "y" in t: t["y"] = yfix(t["y"])
            if "wy" in t: t["wy"] = yfix(t["wy"])
        s.pop("qy", None) if s.get("qy") is None else None; s.pop("ry", None) if s.get("ry") is None else None
    P.write_text(json.dumps(S, ensure_ascii=False, indent=1))
    RV = {"kousha": "gao", "undou": "pyon", "kouen": "mii", "omise": "chu", "densha": "doshin", "gakkou2": "kon", "toukou": "gao", "gakkou3": "mii", "kyuushoku": "doshin", "gekou": "pyon"}
    bad = [(s["id"], s.get("stage")) for s in S if s["asker"] == RV[s.get("stage", "kousha")] or RV[s.get("stage", "kousha")] in (s.get("extras") or []) + (s.get("cast") or [])]
    print("ライバルが 出る 場面:", bad)
