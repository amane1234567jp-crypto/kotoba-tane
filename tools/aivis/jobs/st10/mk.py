"""ともだちの だいぼうけん（ltomo）の 合成リスト: cd tools/aivis && python3 jobs/st10/mk.py
  Aivis（この ジョブ）: 場面の 相手 sq_/sr_、かいわ lk_f*_t*/_r、つなげよう lk_n*_t/_r、とおせんぼ lt_blk_res
  ぽにー（VOICEVOX）: ../game/sit/pony_ltomo.json に かく（pony_gen.py で つくる）"""
import json, re
S = json.load(open('../game/sit/sits.json')); D = json.load(open('../game/sit/ltomo.json'))
q = lambda s: s.replace("「", "").replace("」", "")
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = q(y)
P = []
pa = lambda k, t: P.append([k, q(t), None, None])
for s in S:
    if s.get('stage') != 'ltomo': continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    for i, t in enumerate(s['tiers']): pa(f"sa_{s['id']}_{i}", t['a'])
for it in D['kaiwa']:
    for i, (w, t, y) in enumerate(it['talk']): add(f"lk_{it['id']}_t{i}", w, t, y)
    w, t, y = it['reply']; add(f"lk_{it['id']}_r", w, t, y)
    pa(f"lk_{it['id']}_a", f"こたえは、{it['opts'][0][0]}")
for it in D['tsunagu']:
    add(f"lk_{it['id']}_t", it['who'], it['t'], it['y']); add(f"lk_{it['id']}_r", it['who'], it['r'], it['ry'])
    pa(f"lk_{it['id']}_a", f"{it['ok']}、って いうと、おはなしが つづくね")
for it in D['yasashiku']:
    pa(f"lk_{it['id']}_q", f"{it['q']}。やさしい いいかたは どっちかな？"); pa(f"lk_{it['id']}_a", f"{it['ok']}、と いうと、ともだちが うれしいね")
add("lt_blk_res", "tora", "あ、わりい！ どうぞ", "あ、悪い！どうぞ")
src = open('../game/board/ltomo.js').read()
for k, t in re.findall(r'"(lt_[a-z0-9_]+)", "([^"]+)"', src):
    if k != "lt_blk_res": pa(k, t)
seen = set(); P = [p for p in P if not (p[0] in seen or seen.add(p[0]))]
json.dump(lines, open('jobs/st10/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st10/yomi.json', 'w'), ensure_ascii=False, indent=1)
json.dump(P, open('../game/sit/pony_ltomo.json', 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines), len(P), "pony")
