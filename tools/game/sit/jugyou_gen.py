"""ロングコース「じゅぎょうの いちにち」（jugyou、2026-10-21）の ぽにーの ことば
python3 tools/game/sit/jugyou_gen.py → board/jugyou_data.js ・ sit/pony_jugyou.json
課題は ショートコース（こくご・さんすう・おんがく・ずこう・たいいく・とけい・がっこう2・せんせい1・となりの せき）の 場面と 声を そのまま つかう。
ここで つくるのは じかんわりの アナウンス・しかけ・順位の いれかわりの ことば だけ。"""
import json
from pathlib import Path
G = Path(__file__).resolve().parents[1]

TXT = {
    "sl_jugyou_blk": "のっぽせんせいが ろうかで プリントを くばって いるよ",
    "jg_area1": "キーンコーン カーンコーン。1じかんめは こくご！",
    "jg_area2": "キーンコーン カーンコーン。2じかんめは さんすう！",
    "jg_area3": "キーンコーン カーンコーン。3じかんめは おんがくと ずこう！",
    "jg_area4": "キーンコーン カーンコーン。4じかんめは たいいく！ もう すぐ きゅうしょくだよ",
    # しかけ
    "jg_ev_sekigae": "せきがえ くじ！ くじを ひくと、みんなの ばしょが いれかわるよ",
    "jg_ev_kotai": "となりの せきと こうたい！ すぐ まえの ひとと ばしょを かえるよ",
    "jg_ev_test100": "テストで 100てん！ いちばん まえの ひとの すぐ うしろまで とんで いくよ",
    "jg_ev_dodge": "ドッジボール じゃんけん！ いちばん まえの ひとと じゃんけん！ かったら いれかわるよ",
    "jg_ev_toban": "きゅうしょく とうばん！ いちばん うしろの ひとを よんで くるよ",
    "jg_ev_chime": "チャイムが なった！ みんな ここに あつまれ！",
    "jg_ev_wasure": "わすれものを しちゃった！ 3マス もどるよ",
    "jg_ev_shukudai": "しゅくだいを わすれちゃった！ つぎは 1かい やすみ",
    # しかけの けっか
    "jg_sk_pick": "すきな くじを タッチしてね",
    "jg_sk_done": "せきがえ おしまい！ じゅんばんが かわったね",
    "jg_sk_same": "あれれ、おなじ せきに なったよ",
    "jg_kt_top": "きみが いちばん まえ！ そのままだよ",
    "jg_t100_top": "きみが いちばん まえ！ 3マス すすむよ",
    "jg_t100_near": "もう すぐ うしろに いるね！ 2マス すすむよ",
    "jg_rank": "じゅんいが いれかわった！",
    "jg_goal": "きゅうしょくの じかんだよ！",
}

if __name__ == "__main__":
    (G / "board/jugyou_data.js").write_text("/* 「じゅぎょうの いちにち」の ぽにーの ことば（sit/jugyou_gen.py が かく） */\nconst JG = " + json.dumps({"txt": TXT}, ensure_ascii=False) + ";\n")
    PJ = G / "sit/pony_jugyou.json"; old = {j[0]: j for j in json.loads(PJ.read_text())} if PJ.exists() else {}
    PJ.write_text(json.dumps([[k, t, {}, old[k][3] if k in old and old[k][1] == t else None] for k, t in TXT.items()], ensure_ascii=False, indent=0))
    print(len(TXT), "pony")
