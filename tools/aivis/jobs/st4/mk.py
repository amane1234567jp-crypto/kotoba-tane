"""新ステージ4つ（とうこう・がっこう3・きゅうしょく・げこう）と、ステージ2〜5の おきかえ場面の 合成リスト: cd tools/aivis && python3 jobs/st4/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"toukou": "gao", "gakkou3": "mii", "kyuushoku": "doshin", "gekou": "pyon", "undou": "pyon", "kouen": "mii", "omise": "chu", "densha": "doshin"}
REPL = {"yasumu", "yamete", "atodene", "sagashite", "asobou", "rule", "toiredoko", "hagure", "totte", "saifu", "norisugoshi", "kippunakushi"}
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y.replace("「", "").replace("」", "")
for s in S:
    if not (s['stage'] in ("toukou", "gakkou3", "kyuushoku", "gekou") or s['id'] in REPL): continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv:
        for i, t in enumerate(s['tiers']):
            add(f"sg_{s['id']}_{i}", rv, t['a'], t['y'])
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'], t['wy'])
RS = {"toukou": ("kamejii", "ほっほ。きを つけて いくんじゃよ", "ほっほ。気をつけて行くんじゃよ"), "gakkou3": ("doshin", "あっ、ごめんね。どうぞ", "あっ、ごめんね。どうぞ"),
      "kyuushoku": ("gao", "サンキュー！ たすかったぜ", "サンキュー！助かったぜ"), "gekou": ("omawari", "こんにちは。きを つけて かえってね", "こんにちは。気をつけて帰ってね")}
for st, (w, t, y) in RS.items(): add(f"rs_{st}", w, t, y)
json.dump(lines, open('jobs/st4/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st4/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
