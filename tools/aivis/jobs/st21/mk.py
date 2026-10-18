"""ショートコース 7つ（ゆうごはん・こくご・たいいく・おんがく・ずこう・じてんしゃ・やすみじかん）の 合成リスト: cd tools/aivis && python3 jobs/st21/mk.py"""
import json, re
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"yuushoku": "gao", "kokugo": "kon", "taiiku": "pyon", "ongaku": "mii", "zukou": "chu", "jitensha": "doshin", "yasumi": "kon"}
# かぞくの いれかえ（board/sit.js の FAM_OF と おなじ）
FAM = {"mama": ["pyonmama", "gaomama", "miimama", "chumama"], "papa": ["gaopapa", "doshinpapa"], "onii": ["gaonii"]}
lines, yomi = [], {}
def Y(y): return y.replace("「", "").replace("」", "").replace("次", "つぎ").replace("他の", "ほかの").replace("寂しい", "さみしい")
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = Y(y)
for s in S:
    if s['stage'] not in RIVAL: continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    for m in FAM.get(s['asker'], []):
        if s['asker'] == "papa" and m == "gaopapa" and s['stage'] not in ("yuushoku", "jitensha"): continue
        add(f"sq_{s['id']}_{m}", m, s['q'], s['qy']); add(f"sr_{s['id']}_{m}", m, s['res'], s['ry'])
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv and rv not in s.get('noHero', []):
        for i, t in enumerate(s['tiers']):
            add(f"sg_{s['id']}_{i}", rv, t['a'], t['y'])
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'], t['wy'])
D = json.load(open('jobs/st21/data.json'))
for st, b in D['blk'].items(): add(b['res'][0], b['who'], b['res'][1], b['res'][1])
for ak in sorted(set(D['KQ_ASK'].values())):
    for q, t in D['KQ'].items(): add(f"kq_{q}_{ak}", ak, t, t)
for it in D['RQ']: add(f"rq_{it['id']}", "omawari", it['q'], it['q'])
for k, t in {"rq_ok": "せいかい！", "rq_ng": "ざんねん。もう いっぽうが ただしいよ", "rq_say": "じゃあ、ルールを いって みよう", "rq_res": "ルールを まもって、あんぜんに のろうね"}.items(): add(k, "omawari", t, t)
json.dump(lines, open('jobs/st21/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st21/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
