"""2026-10-18 なおし：じぶんの ママ（ぴょん・がお・みい・ちゅうの ママ）の 声・セリフを かえた 場面: cd tools/aivis && python3 jobs/st19/mk.py"""
import json
S = {s['id']: s for s in json.load(open('../game/sit/sits.json'))}
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y.replace("「", "").replace("」", "")
import glob, os
Y = {}  # ママの セリフで、まえに 読みを なおした もの（例：空くまで→あくまで）は それを つかう
for f in sorted(glob.glob('jobs/*/yomi.json'), key=os.path.getmtime):
    if 'st19' in f: continue
    Y.update(json.load(open(f)))
MOMS = ["pyonmama", "gaomama", "miimama", "chumama"]
for s in S.values():
    if s['asker'] != 'mama': continue
    qy, ry = Y.get(f"sq_{s['id']}", s['qy']), Y.get(f"sr_{s['id']}", s['ry'])
    if s['id'] == 'ociyana': ry = s['ry']
    if s['id'] == 'bgtoire': qy = s['qy']
    for m in MOMS: add(f"sq_{s['id']}_{m}", m, s['q'], qy); add(f"sr_{s['id']}_{m}", m, s['res'], ry)
add("sr_ociyana", "mama", S['ociyana']['res'], S['ociyana']['ry']); add("sq_bgtoire", "mama", S['bgtoire']['q'], S['bgtoire']['qy'])
for sid, rv, tiers in [("tdbokuno", "chu", [3, 4, 5]), ("bguketori", "pyon", [3]), ("bgtoire", "pyon", [5])]:
    for i in tiers: t = S[sid]['tiers'][i]; add(f"sg_{sid}_{i}", rv, t['a'], t['y'])
json.dump(lines, open('jobs/st19/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st19/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
