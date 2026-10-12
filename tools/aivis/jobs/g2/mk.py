"""がっこう2・おみせの店員さん・こん の 合成リスト: cd tools/aivis && python3 jobs/g2/mk.py"""
import json, re
S = json.load(open('../game/sit/sits.json'))
lines, yomi = [], {}
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = y
for s in S:
    if s['stage'] == 'omise' and s['asker'] in ('pyonmama', 'gaojii', 'miibaa', 'doshinpapa'):
        add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    if s['stage'] != 'gakkou2': continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    for i, (who, t, y) in enumerate(s['talk']):
        if y: add(f"st_{s['id']}_{i}", who, t, y)
    for i, (who, t, y) in enumerate(s['after']):
        if y: add(f"se_{s['id']}_{i}", who, t, y)
    for i, t in enumerate(s['tiers']):
        add(f"sg_{s['id']}_{i}", "kon", t['a'], t['y'])
        if t.get('wrong'): add(f"sx_{s['id']}_{i}", "kon", t['wrong'], t['wy'])
RV = {"go": "いくよっ", "huh": "あれ？ ちがった？", "thanks": "そっか。ありがとう！", "rival": "てんこうせいの こんだよ。がっこうの なかで きょうそうしよう！", "rival2": "こんどは まけないよ！", "win": "やった、こんの かち！", "good": "たのしかったね", "next": "つぎも がんばるね"}
RY = {"rival": "転校生のこんだよ。学校の中で競争しよう！", "rival2": "今度は負けないよ！", "win": "やった、こんの勝ち！", "good": "楽しかったね", "next": "次も頑張るね"}
for k, t in RV.items(): add(f"rv_kon_{k}", "kon", t, RY.get(k, t.replace(" ", "")))
json.dump(lines, open('jobs/g2/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/g2/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
