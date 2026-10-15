// ---------- エンディング ----------
function ending(){
  S.ending=true;save();show('ending');var v=$('ending');
  var L=GD.ending,i=0;
  function page(){v.innerHTML='';var l=L[i];
    var art=l[0]==='fudeko'?'<svg viewBox="0 0 100 100">'+fudekoSVG()+'</svg>':(l[0]==='maou'||l[0]==='maouA')?'<svg viewBox="0 0 160 160">'+maouSVG(l[0]==='maou')+'</svg>':'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#ffd23f"/><text x="50" y="64" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" font-family="Zen Maru Gothic">★</text></svg>';
    v.appendChild(mk('div','endart',art));if(l[1])v.appendChild(mk('div','count',esc(l[1])));v.appendChild(mk('p','storytxt dark',esc(l[2])));say(l[2],l[0]||'narr');
    var r=mk('div','row');r.appendChild(btn('つぎへ ▶','go',function(){i++;if(i<L.length)page();else parade();}));v.appendChild(r);}
  function parade(){v.innerHTML='';
    v.appendChild(mk('h2','logo small','おめでとう！'));
    v.appendChild(mk('p','say','かんじ 80こ ぜんぶ とりもどした！ コンプリート！'));
    var p=mk('div','parade');ORDER.forEach(function(g,k){var d=mk('div','',charSVG(g)+'<b>'+g+'</b>');d.style.animationDelay=(k*0.05)+'s';p.appendChild(d);});v.appendChild(p);
    beep([523,659,784,1047,1319,1568]);say(TX.parade);sfx('win');
    var r=mk('div','row');r.appendChild(btn('ぼうけんを つづける','go',function(){show('field');}));r.appendChild(btn('かんじ牧場を みる','',function(){show('ranch');}));v.appendChild(r);}
  page();
}

// ---------- かんじ牧場（コレクション） ----------
var wander=null;
function renderRanch(){
  var v=$('ranch'); v.innerHTML='';
  var born=bornList();
  var past=mk('div','pasture','<div class="fence"></div>');
  if(!born.length)past.appendChild(mk('div','empty','まだ だれも いないよ。ぼうけんで たまごを みつけよう！'));
  var crit=[];
  born.slice(-12).forEach(function(g,i){var b=document.createElement('button');b.type='button';b.className='critter';b.style.left=(10+Math.random()*80)+'%';b.style.top=(50+Math.random()*34)+'%';
    b.innerHTML='<div class="bob" style="animation-delay:-'+(i*.31).toFixed(2)+'s">'+charSVG(g)+'</div>';b.setAttribute('aria-label',nameOf(g));
    b.onclick=function(){openCard(g);};past.appendChild(b);crit.push(b);});
  v.appendChild(past);
  clearInterval(wander);wander=setInterval(function(){if(cur!=='ranch'){clearInterval(wander);return;}crit.forEach(function(b){if(Math.random()<.5){b.style.left=(8+Math.random()*84)+'%';b.style.top=(50+Math.random()*34)+'%';}});},2800);
  setTimeout(function(){crit.forEach(function(b){b.style.left=(8+Math.random()*84)+'%';});},80);
  v.appendChild(mk('p','ztitle','かんじずかん　'+born.length+' / 80'));
  MAPS.forEach(function(mp,mi){if(!mp.kanji)return;
    var got=regKanji(mi).filter(function(g){return S.born[g];}).length;
    v.appendChild(mk('p','zhead',kt(mp.name)+'　<small>'+got+' / '+regKanji(mi).length+(S.cleared[mi]?'　クリア！':'')+'</small>'));
    var gr=mk('div','zgrid');
    regKanji(mi).forEach(function(g){var i=ORDER.indexOf(g),ok=!!S.born[g],b=document.createElement('button');b.type='button';b.className='zcard'+(ok?'':' locked');
      b.innerHTML='<span class="no">No.'+String(i+1).padStart(2,'0')+'</span>'+(ok?charSVG(g):'<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M80,18 C112,18 128,72 126,96 C124,128 104,142 80,142 C56,142 36,128 34,96 C32,72 48,18 80,18 Z" fill="#e2d9c4" stroke="#b8ad94" stroke-width="5" stroke-dasharray="8 6"/><text x="80" y="104" text-anchor="middle" font-size="44" font-weight="900" fill="#b8ad94" font-family="Zen Maru Gothic,sans-serif">？</text></svg>')
        +'<span class="g">'+(ok?g:'？')+'</span><span class="n">'+(ok?nameOf(g):'まだ たまご')+'</span>';
      if(ok)b.onclick=function(){openCard(g);};else b.disabled=true;gr.appendChild(b);});
    v.appendChild(gr);});
}
