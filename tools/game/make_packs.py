"""ステージごとの声のパック（packs/<ステージ>.json）を作る: python3 tools/game/make_packs.py
声は tools/game/stage_audio/<key>.mp3（ゲーム用に そろえた もの）。ゲームは ステージを はじめるときに パックを まとめて 読みこむ。
  ぽにーのお手本 sa_*   : VOICEVOX 調整版（scratch の pony_gen.py で作り、ここへ置く）
  相手・がお sq_/sr_/sg_/sx_ : AivisSpeech（GitHub Actions → aivis-out ブランチ → 変換してここへ）"""
import base64, json, sys
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[1]
A = G / "stage_audio"; OUT = R / "packs"; OUT.mkdir(exist_ok=True)
S = json.loads((G / "sit/sits.json").read_text())
RIVAL_OF = {"kousha": "gao", "undou": "pyon", "kouen": "mii", "omise": "chu", "densha": "doshin", "gakkou2": "kon", "toukou": "gao", "gakkou3": "mii", "kyuushoku": "doshin", "gekou": "pyon", "ouchi1": "mii", "tomodachi1": "chu", "sensei1": "pyon", "ie1": "chu", "kouen2": "mii", "seki1": "gao", "tokei": "gao", "asobiba": "mii", "burger": "pyon", "sansu": "chu", "hoken2": "doshin", "byouin": "chu", "yuushoku": "gao", "kokugo": "kon", "taiiku": "pyon", "ongaku": "mii", "zukou": "chu", "jitensha": "doshin", "yasumi": "kon", "haisha": "gao"}
def keys_of(s):
    new = s["stage"] != "kousha" or not (G / "sit/audio" / f"sq_{s['id']}.mp3").exists()  # こうしゃの はじめの 場面は 段1〜4が ページに 入っている
    ks = []
    if new: ks += [f"sq_{s['id']}", f"sr_{s['id']}"]
    if s["asker"] == "mama": ks += [f"{q}_{s['id']}_{m}" for m in ("pyonmama", "gaomama", "miimama", "chumama") for q in ("sq", "sr")]  # じぶんの ママ（2026-10-18）
    if s["asker"] == "papa" and s["stage"] in ("yuushoku", "jitensha"): ks += [f"{q}_{s['id']}_{m}" for m in ("gaopapa", "doshinpapa") for q in ("sq", "sr")]  # じぶんの パパ（2026-10-19）
    if s["asker"] == "onii" and s["stage"] == "yuushoku": ks += [f"{q}_{s['id']}_gaonii" for q in ("sq", "sr")]
    ks += [f"st_{s['id']}_{i}" for i, r in enumerate(s.get("talk", [])) if r[2]] + [f"se_{s['id']}_{i}" for i, r in enumerate(s.get("after", [])) if r[2]]
    for i, t in enumerate(s["tiers"]):
        if not new and i < 4: continue
        ks.append(f"sa_{s['id']}_{i}")
        if s.get("gaoOk") and s["asker"] != RIVAL_OF[s["stage"]] and RIVAL_OF[s["stage"]] not in s.get("noHero", []):
            ks.append(f"sg_{s['id']}_{i}")
            if t.get("wrong"): ks.append(f"sx_{s['id']}_{i}")
    return ks
missing = []
for st in ["kousha", "undou", "kouen", "omise", "densha", "gakkou2", "toukou", "gakkou3", "kyuushoku", "gekou", "ouchi1", "tomodachi1", "sensei1", "ie1", "kouen2", "seki1", "tokei", "asobiba", "burger", "hoken2", "byouin", "haisha", "yuushoku", "kokugo", "taiiku", "ongaku", "zukou", "jitensha", "yasumi"]:
    pack = {}
    for s in S:
        if s["stage"] != st: continue
        for k in keys_of(s):
            p = A / f"{k}.mp3"
            if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
            else: missing.append(k)
    if st == "byouin":  # つづけて もんしん（ぽにー mn_*・わんこせんせい mq_*）
        for p in sorted(A.glob("mn_*.mp3")) + sorted(A.glob("mq_*.mp3")): pack[p.stem] = base64.b64encode(p.read_bytes()).decode()
    if st == "yuushoku":  # つづけて おはなし（ぽにー kn_*・ママ kq_*）
        for p in sorted(A.glob("kn_*.mp3")) + sorted(A.glob("kq_*.mp3")): pack[p.stem] = base64.b64encode(p.read_bytes()).decode()
    if st == "jitensha":  # ルールクイズ（ぽにー rl_*・おまわりさん rq_*）
        for p in sorted(A.glob("rl_*.mp3")) + sorted(A.glob("rq_*.mp3")): pack[p.stem] = base64.b64encode(p.read_bytes()).decode()
    if (A / f"bgm_{st}.mp3").exists(): pack[f"bgm_{st}"] = base64.b64encode((A / f"bgm_{st}.mp3").read_bytes()).decode()
    (OUT / f"{st}.json").write_text(json.dumps(pack, separators=(",", ":")))
    print(st, len(pack), round((OUT / f"{st}.json").stat().st_size / 1e6, 2), "MB")
# さんすう：sn_*（ぽにー）と csn_*（ちゅう）
pack = {}
for p in sorted(A.glob("sn_*.mp3")) + sorted(A.glob("csn_*.mp3")): pack[p.stem] = base64.b64encode(p.read_bytes()).decode()
if (A / "bgm_sansu.mp3").exists(): pack["bgm_sansu"] = base64.b64encode((A / "bgm_sansu.mp3").read_bytes()).decode()
(OUT / "sansu.json").write_text(json.dumps(pack, separators=(",", ":"))); print("sansu", len(pack), round((OUT / "sansu.json").stat().st_size / 1e6, 2), "MB")
# とけい：tk_*（ぽにー）と gtk_*（がお）
pack = json.loads((OUT / "tokei.json").read_text()) if (OUT / "tokei.json").exists() else {}
for p in sorted(A.glob("tk_*.mp3")) + sorted(A.glob("gtk_*.mp3")): pack[p.stem] = base64.b64encode(p.read_bytes()).decode()
(OUT / "tokei.json").write_text(json.dumps(pack, separators=(",", ":"))); print("tokei", len(pack), round((OUT / "tokei.json").stat().st_size / 1e6, 2), "MB")
# だいぼうけん（ロングコース）：lk_*（かけあい＝Aivis／ぽにー＝VOICEVOX）。ぽにーの リストは sit/pony_long.json、かけあいは aivis/jobs/long
lk = [p[0] for p in json.loads((G / "sit/pony_long.json").read_text())] + [l["key"] for j in ["long", "long2"] for l in json.loads((R / f"tools/aivis/jobs/{j}/lines.json").read_text())]
pack = {}
for k in lk:
    p = A / f"{k}.mp3"
    if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
    else: missing.append(k)
pack["bgm_long"] = base64.b64encode((A / "bgm_long.mp3").read_bytes()).decode()
(OUT / "long.json").write_text(json.dumps(pack, separators=(",", ":"))); print("long", len(pack), round((OUT / "long.json").stat().st_size / 1e6, 2), "MB")
# ともだちの だいぼうけん（ltomo）：場面（sq/sr/sa）＋ 課題（lk_f*/lk_n*/lk_y*）＋ lt_*＋ だいぼうけんと 共通の 声
pack = {}
lt = [l["key"] for l in json.loads((R / "tools/aivis/jobs/st10/lines.json").read_text())] + [p[0] for p in json.loads((G / "sit/pony_ltomo.json").read_text())]
lt += ["lk_ask", "lk_seikai", "lk_tap", "lk_plus1", "lk_minus1", "lk_rest_now", "lk_again_now", "lk_ev_swap_none", "lk_ev_call_none", "bgm_ltomo"]
for k in dict.fromkeys(lt):
    p = A / f"{k}.mp3"
    if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
    else: missing.append(k)
(OUT / "ltomo.json").write_text(json.dumps(pack, separators=(",", ":"))); print("ltomo", len(pack), round((OUT / "ltomo.json").stat().st_size / 1e6, 2), "MB")
# ちょうロング（sumi・sokashi・suchu）：ぽにーの 声（sit/pony_slong.json）＋ BGM 3きょく。ほかの 声は long・ltomo・kousha の パックを つかう
pack = {}
for k in [p[0] for p in json.loads((G / "sit/pony_slong.json").read_text())] + ["bgm_sumi", "bgm_sokashi", "bgm_suchu", "bgm_eki"]:
    p = A / f"{k}.mp3"
    if not p.exists(): p = G / "board/audio" / f"{k}.mp3"
    if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
    else: missing.append(k)
(OUT / "slong.json").write_text(json.dumps(pack, separators=(",", ":"))); print("slong", len(pack), round((OUT / "slong.json").stat().st_size / 1e6, 2), "MB")
# かんがえて みよう（komatta）：ぽにー km_*・kmp_*（sit/pony_komatta.json）、きく人 kmq_*、がお kmg_*、とおせんぼ、BGM
pack = {}
for k in [p[0] for p in json.loads((G / "sit/pony_komatta.json").read_text())] + [l["key"] for l in json.loads((R / "tools/aivis/jobs/km1/lines.json").read_text())] + ["bgm_komatta"]:
    p = A / f"{k}.mp3"
    if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
    else: missing.append(k)
(OUT / "komatta.json").write_text(json.dumps(pack, separators=(",", ":"))); print("komatta", len(pack), round((OUT / "komatta.json").stat().st_size / 1e6, 2), "MB")
# おでかけ だいぼうけん（ちょうロング）：ぽにーの 声（sit/pony_odekake.json）＋ BGM。場面の 声は jitensha・toukou・gekou の パックを つかう
pack = {}
for k in [p[0] for p in json.loads((G / "sit/pony_odekake.json").read_text())] + ["bgm_odekake"]:
    p = A / f"{k}.mp3"
    if p.exists(): pack[k] = base64.b64encode(p.read_bytes()).decode()
    else: missing.append(k)
(OUT / "odekake.json").write_text(json.dumps(pack, separators=(",", ":"))); print("odekake", len(pack), round((OUT / "odekake.json").stat().st_size / 1e6, 2), "MB")
print("missing", len(missing), missing[:20])
if missing and "--strict" in sys.argv: sys.exit(1)
