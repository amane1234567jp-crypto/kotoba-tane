"""ほけんしつ・びょういん・はいしゃさん の 合成リスト: cd tools/aivis && python3 jobs/st20/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"hoken2": "doshin", "byouin": "chu", "haisha": "gao"}
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
RS = {"hoken2": ("chu", "ありがとう。ほけんしつに いく ところなんだ", "ありがとう。保健室に行くところなんだ"), "byouin": ("kamejii", "ほっほ、どうぞ どうぞ", "ほっほ、どうぞどうぞ"), "haisha": ("doshin", "うん……いっしょなら がんばる", "うん……一緒なら頑張る")}
for st, (w, t, y) in RS.items(): add(f"rs_{st}", w, t, y)
MQ = {"dou": ("きょうは どうしましたか？", "今日はどうしましたか？"), "itsu": ("それは、いつからですか？", "それは、いつからですか？"), "hoka": ("ほかに、へんな ところは ありますか？", "ほかに、変なところはありますか？"),
      "res": ("よく おしえて くれましたね。これで よく わかりました", "よく教えてくれましたね。これでよく分かりました")}
for k, (t, y) in MQ.items(): add(f"mq_{k}", "wanko", t, y)
json.dump(lines, open('jobs/st20/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st20/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
