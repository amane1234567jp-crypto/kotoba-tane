# 合体字30字 決定稿一覧
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
sys.argv = [sys.argv[0]]  # 各モジュールの書き出しを抑止
import parts
import hana_yuru as HY, kin2_gen as K2, ki2_gen as KI
import six_gen as S1, six2_gen as S2, six2_alt as S2A, na_hon3 as NH, six3_gen as S3, six3_alt as S3A, six4_gen as S4
OUT = os.path.join(os.path.dirname(__file__), '..', 'kanji-bokujo', 'project')

FINAL = [
 ('花', 'はなっこ', HY.body()), ('金', 'きんぞう', K2.kura(yen=False)), ('気', 'ゆげっち', KI.cloud_body() + KI.face('blow') + KI.blow_lines() + KI.pinwheel()),
 ('休', '木にもたれて昼寝', S1.yasumu()), ('男', '野球帽の力持ち', S1.otoko()), ('字', 'おうち帽子で字を書く', S1.ji()),
 ('学', 'ひらめき学帽', S1.gaku()), ('空', '雲の帽子の鳥', S1.sora()), ('町', '窓が目のたてもの', S1.machi()),
 ('明', 'ひーさま＆つきまる', S2.akarui()), ('名', '口＋フキダシ', NH.namae_f()), ('見', '目玉が歩く', S2.miru()),
 ('早', 'めざまし時計', S2A.hayai_neck()), ('草', '草の王冠の草っこ', S2.kusa()), ('本', 'きーぼうが本を読む', NH.hon_f()),
 ('出', 'ふんすい', S3A.deru2()), ('村', '木と「むら」の看板', S3.mura()), ('音', 'たいこをたたく', S3A.oto2()),
 ('右', '右をさす', S3A.migi2()), ('左', '左をさす', S3A.hidari2()), ('中', 'だんごの串', S3.naka()),
 ('白', 'おとうふくん', S4.shiro()), ('百', '100てんのおとうふくん', S4.hyaku()), ('千', 'かかし', S4.sen()),
 ('生', 'めばえちゃん', S4.umareru()), ('青', '青いペンキのバケツ', S4.ao()), ('赤', 'あかだこ', S4.aka()),
 ('正', 'せいかいロボ', S4.tadashii()), ('校', '木と校舎', S4.kou()), ('先', 'せんとうくん', S4.saki()),
]
svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;flex-direction:column;align-items:center;gap:0;background:#fff;border-radius:14px;padding:2px 4px;min-height:0">
      {svg(b, 74)}
      <div style="display:flex;align-items:baseline;gap:5px"><div style="font-size:18px;font-weight:900;line-height:1">{k}</div><div style="font-size:8.5px;color:#6b5f4a;white-space:nowrap">{n}</div></div>
    </div>''' for k, n, b in FINAL)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-35 合体字30字 決定稿一覧</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&display=swap">
<style>
body{{margin:0}}
a{{color:#2a2a3a}}a:hover{{color:#000}}
</style>
</helmet>
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 16px 24px; background: #e8f4ff; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 6px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 24px; font-weight: 900; background: #3b6fd9; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-35</div>
    <h1 style="margin: 0; font-size: 20px; font-weight: 900; white-space:nowrap">合体字30字 決定稿一覧</h1>
    <div style="font-size: 11px; font-weight: 500; color: #6b5f4a">今の意味でキャラ化・筆画を部品に・2頭身。単体33体（A-5〜A-11）とあわせて1年生80字のうち63字</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 6px; flex: 1 1 auto; min-height: 0">{cells}
  </div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":880,"height":560}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
open(os.path.join(OUT, 'A35_Final30.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
