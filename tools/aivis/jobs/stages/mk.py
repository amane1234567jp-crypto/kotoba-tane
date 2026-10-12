"""sits.json から 新しいセリフ（新ステージ・うんち・段5〜6）の合成リストを作る: cd tools/aivis && python3 jobs/stages/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
lines = []; yomi = {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y
for s in S:
    new = s['stage'] != 'kousha' or s['id'] == 'unko'
    if new:
        add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    if s.get('gaoOk'):
        for i, t in enumerate(s['tiers']):
            if not new and i < 4: continue
            add(f"sg_{s['id']}_{i}", "gao", t['a'], t['y'])
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", "gao", t['wrong'], t['wy'])
json.dump(lines, open('jobs/stages/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/stages/yomi.json', 'w'), ensure_ascii=False, indent=1)
print(len(lines))
