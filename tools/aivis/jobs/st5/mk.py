"""こうしゃの おきかえ 11場面と、がっこう3の 追加 3場面の 合成リスト: cd tools/aivis && python3 jobs/st5/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"kousha": "gao", "gakkou3": "mii"}
IDS = {"tatakareta", "kegashita", "mayotta", "bokujanai", "osanaide", "mienai", "haittemasu", "mukae", "hirotta", "damedayo", "nureta", "gskenkou", "gsdekimashita", "gsnanisuru"}
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y.replace("「", "").replace("」", "")
for s in S:
    if s['id'] not in IDS: continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv:
        for i, t in enumerate(s['tiers']):
            add(f"sg_{s['id']}_{i}", rv, t['a'], t['y'])
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'], t['wy'])
json.dump(lines, open('jobs/st5/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st5/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
