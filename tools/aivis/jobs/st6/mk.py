"""ライバルの かわりに とらお・くまたが 出る 場面と、こうしゃから うつした 場面の 合成リスト: cd tools/aivis && python3 jobs/st6/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"kousha": "gao", "undou": "pyon", "kouen": "mii", "omise": "chu", "densha": "doshin", "gakkou2": "kon", "toukou": "gao", "gakkou3": "mii", "kyuushoku": "doshin", "gekou": "pyon"}
IDS = {"butsukaru", "sakaagari", "koronda", "kurakura", "irete", "maigo", "orimasu", "tkakashingou", "kygyuunyuu", "damedayo", "tatakareta", "bokujanai", "osanaide"}
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y.replace("「", "").replace("」", "")
for s in S:
    if s['id'] not in IDS: continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s.get('qy', s['q'])); add(f"sr_{s['id']}", s['asker'], s['res'], s.get('ry', s['res']))
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv:
        for i, t in enumerate(s['tiers']):
            add(f"sg_{s['id']}_{i}", rv, t['a'], t.get('y', t['a']))
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'], t.get('wy', t['wrong']))
json.dump(lines, open('jobs/st6/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st6/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
