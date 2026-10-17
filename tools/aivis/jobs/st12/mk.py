"""ともだちの いえ・こうえん2・となりの せき の 合成リスト: cd tools/aivis && python3 jobs/st12/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"ie1": "chu", "kouen2": "mii", "seki1": "gao"}
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y.replace("「", "").replace("」", "")
for s in S:
    if s['stage'] not in RIVAL: continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv:
        for i, t in enumerate(s['tiers']):
            add(f"sg_{s['id']}_{i}", rv, t['a'], t['y'])
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'], t['wy'])
RS = {"ie1": ("pyonmama", "はい、どうぞ。ゆっくり あそんでいってね", "はい、どうぞ。ゆっくり遊んでいってね"), "kouen2": ("tora", "おっ、いいぜ。とおりな", "おっ、いいぜ。通りな"), "seki1": ("doshin", "あ、ごめんね。はい、どうぞ", "あ、ごめんね。はい、どうぞ")}
for st, (w, t, y) in RS.items(): add(f"rs_{st}", w, t, y)
json.dump(lines, open('jobs/st12/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st12/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
