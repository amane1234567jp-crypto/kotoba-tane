"""ショートコース 8つ（きりかえ・ききかえす・まつ・SOS・じゅんばん・ことわる・ぼうさい・でんわ）の 合成リスト: cd tools/aivis && python3 jobs/st23/mk.py"""
import json
S = json.load(open('../game/sit/sits.json'))
RIVAL = {"kirikae": "mii", "kikikaesu": "kon", "matsu": "gao", "sos": "pyon", "junban": "kon", "kotowaru": "mii", "bousai": "gao", "denwa": "mii"}
NAME = {"mii": "みい", "kon": "こん", "gao": "がお", "pyon": "ぴょん"}
FAM = {"mama": ["pyonmama", "gaomama", "miimama", "chumama"]}
RS = {"kirikae": ("doshin", "そうか！ ありがとう", "そうか！ありがとう"), "kikikaesu": ("kuma", "とおって いいよって いったんだ。どうぞ", "通っていいよって言ったんだ。どうぞ"),
      "matsu": ("pyon", "いいよ。わたしの つぎね", "いいよ。私の次ね"), "sos": ("doshin", "おおきい おとが にがてなんだ。きいて くれて ありがとう", "大きい音が苦手なんだ。聞いてくれてありがとう"),
      "junban": ("doshin", "あ、そうか！ くつしたが さきだね", "あ、そうか！靴下が先だね"), "kotowaru": ("kuma", "そ、そうだね。やめとく", "そ、そうだね。やめとく"),
      "bousai": ("pyon", "うん、ありがとう", "うん、ありがとう"), "denwa": ("doshin", "あっ、ほんとだ。ありがとう", "あっ、本当だ。ありがとう")}
lines, yomi = [], {}
def Y(y): return y.replace("「", "").replace("」", "").replace("次", "つぎ").replace("他の", "ほかの").replace("寂しい", "さみしい").replace("描", "か")
def add(key, who, text, y): lines.append({"key": key, "who": who, "text": text}); yomi[key] = Y(y)
for s in S:
    if s['stage'] not in RIVAL: continue
    add(f"sq_{s['id']}", s['asker'], s['q'], s['qy']); add(f"sr_{s['id']}", s['asker'], s['res'], s['ry'])
    for m in FAM.get(s['asker'], []):
        add(f"sq_{s['id']}_{m}", m, s['q'], s['qy']); add(f"sr_{s['id']}_{m}", m, s['res'], s['ry'])
    rv = RIVAL[s['stage']]
    if s.get('gaoOk') and s['asker'] != rv and rv not in s.get('noHero', []):
        for i, t in enumerate(s['tiers']):
            nm = NAME[rv]
            add(f"sg_{s['id']}_{i}", rv, t['a'].replace("〇〇", nm), t['y'].replace("〇〇", nm))
            if t.get('wrong'): add(f"sx_{s['id']}_{i}", rv, t['wrong'].replace("〇〇", nm), t['wy'].replace("〇〇", nm))
for st, (who, t, y) in RS.items(): add(f"rs_{st}", who, t, y)
json.dump(lines, open('jobs/st23/lines.json', 'w'), ensure_ascii=False, indent=0)
json.dump(yomi, open('jobs/st23/yomi.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(lines), Counter(l['who'] for l in lines))
