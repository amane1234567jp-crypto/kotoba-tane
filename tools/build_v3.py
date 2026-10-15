D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
L=open(D+'app/index_v2.html',encoding='utf-8').read().split('\n')
def r(a,b): return '\n'.join(L[a-1:b])
def f(n): return open(D+'tools/'+n,encoding='utf-8').read()
head=r(1,129).replace('<title>かんじ牧場</title>','<title>かんじぼうけん</title>')
html='''</style>

<div id="app">
  <header class="bar">
    <h1>かんじぼうけん</h1>
    <span class="pill" title="とりもどした かんじ">なかま <span id="bornN">0</span>/80</span>
    <span class="pill" title="ほし">★ <span id="starN">0</span></span>
    <span class="sp"></span>
    <button class="navb" id="navField" type="button">ぼうけん</button>
    <button class="navb" id="navRanch" type="button">かんじ牧場</button>
    <button class="bgmbtn" id="bgmBtn" type="button">♪ オン</button>
    <button class="gear" id="gear" type="button" aria-label="おうちのひと（ながおし）">おうちのひと</button>
  </header>
  <main>
    <section class="view" id="title"></section>
    <section class="view" id="story" hidden></section>
    <section class="view" id="field" aria-label="ぼうけん" hidden>
      <svg id="fieldSvg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="mapname" id="mapName"></div>
      <div class="prog" id="prog" hidden></div>
      <div class="tip" id="tip"></div>
      <div class="dpad" aria-label="いどう">
        <span></span><button type="button" data-d="0,-1" aria-label="うえ">▲</button><span></span>
        <button type="button" data-d="-1,0" aria-label="ひだり">◀</button><span></span><button type="button" data-d="1,0" aria-label="みぎ">▶</button>
        <span></span><button type="button" data-d="0,1" aria-label="した">▼</button><span></span>
      </div>
      <div id="talk" hidden><div class="face"></div><div class="tbody"><div class="who"></div><div class="txt"></div></div><span class="nxt">▼</span></div>
    </section>
    <section class="view pad16" id="egg" hidden></section>
    <section class="view pad16" id="battle" hidden></section>
    <section class="view pad16" id="ranch" hidden></section>
    <section class="view" id="ending" hidden></section>
  </main>
</div>
<div id="modal" class="modal" hidden></div>

<script src="kanji1.js"></script>
<script src="chars.js"></script>
<script src="world.js"></script>
<script src="voice/index.js"></script>
<script>
(function(){
'use strict';
'''
js='\n'.join([r(165,167),f('v3_a.js'),r(233,244),f('v3_b.js'),f('v3_t.js'),f('v3_s.js'),r(257,274),f('v3_c.js'),r(302,332),f('v3_d.js'),r(440,508),f('v3_e.js'),f('v3_f.js'),r(641,666),f('v3_g.js'),r(690,704).replace("say(nameOf(g)+'。'+meanOf(g));",'say(TX.card(g));'),f('v3_h.js')])
out=head+'\n'+f('v3_css.css')+html+js+'\n})();\n</script>\n'
open(D+'app/index.html','w',encoding='utf-8').write(out)
open(D+'app/test.html','w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+out+'</body></html>')
print(len(out))
