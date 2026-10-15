// ---------- おうちのひと（ながおし） ----------
var holdT=null;
$('gear').addEventListener('pointerdown',function(){holdT=setTimeout(openParent,900);});
['pointerup','pointerleave','pointercancel'].forEach(function(e){$('gear').addEventListener(e,function(){clearTimeout(holdT);});});
$('gear').addEventListener('click',function(){toast('おうちのひとは ながおし してね');});
function openParent(){
  var m=$('modal');m.hidden=false;m.innerHTML='';
  var misses=Object.keys(S.miss).filter(function(g){return S.miss[g]>0;}).sort(function(a,b){return S.miss[b]-S.miss[a];}).slice(0,10);
  var total=Object.keys(S.writes).reduce(function(a,g){return a+S.writes[g];},0);
  var cl=MAPS.filter(function(mp,i){return mp.kanji&&S.cleared[i];}).length;
  var sh=mk('div','sheet');
  sh.innerHTML='<p class="say" style="margin:0">おうちのひと</p>'
   +'<p class="small">とりもどした漢字：'+bornCount()+' / 80　クリアした国：'+cl+' / 8'+(S.ending?'（魔王も撃破）':'')+'<br>書いた回数：'+total+'回　やっつけた敵：'+S.beaten+'<br>つまずいた字（多い順）：'+(misses.length?misses.join(' '):'まだありません')+'</p>'
   +'<p class="small">卵は10回書くと孵ります（1〜3回目はお手本あり、4〜7回目はうすいお手本、8〜10回目は書きはじめの点だけ）。<br>ふつうの敵は攻撃してこないので負けません。ボスは攻撃してきますが、全員つかれても「ボスのへとへと」は残るので、くり返せば必ず倒せます。<br>記録はこの端末のブラウザの中だけに保存されます。<br>書き順データ：KanjiVG（© Ulrich Apel, CC BY-SA 3.0）<br>こえ：AivisSpeech（音声合成モデル：みちのくあいり・らせつん〈こずかた学園プロジェクト〉、morioki、ろてじん（長老ボイス）、澤原 玄二郎・阿井田 茂〈古山キリヲ〉、凛音エル、まお〈オズチャット〉、fumifumi、わかな・すみれ・さつき〈声は x.com/dopoiro のAI〉、TANAKA、hinakoyuhara、花音、立神ケイ〈ニッケル・海月ニケ〉、猩々博士、Lux〈Lami〉、kokuren_voice〈kokuren〉、yukyu、にせ〈MAHOPROGRAM〉／ACML 1.0）</p>';
  var row=mk('div','row');
  var b2=btn('きろくを けす','',function(){if(b2.dataset.ok){S=JSON.parse(JSON.stringify(S0));save();m.hidden=true;renderTitle();show('title');toast('きろくを けしました');}else{b2.dataset.ok='1';b2.textContent='ほんとうに けす（もういちど おす）';}});
  row.appendChild(b2);row.appendChild(btn('とじる','go',function(){m.hidden=true;m.innerHTML='';}));sh.appendChild(row);m.appendChild(sh);
}

// ---------- はじめ ----------
renderTitle(); show('title');
setInterval(moveMobs,900);
window.__kb={S:function(){return S;},set:function(o){for(var k in o)S[k]=o[k];save();},hero:function(){return hero;},go:function(m,x,y){hero.m=m;hero.x=x;hero.y=y;hero.px=x;hero.py=y;S.map=m;S.pos=[x,y];save();spawnMobs();show('field');},miss:function(){return Object.keys(VO.missing);},mobs:function(){return mobs;},boss:function(){return bossActive(hero.m);},ord:ORDER};
