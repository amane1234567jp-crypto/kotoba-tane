// ---------- たまご ----------
function openEgg(e){
  var g=e.g; if(!g)return;
  if(S.tut===1)S.tut=2;
  show('egg'); var v=$('egg'); v.innerHTML='';
  var n0=function(){return S.egg[g]||0;}, ci=ORDER.indexOf(g);
  var duel=mk('div','duel'),left=mk('div','side'),eggBox=mk('div','bigegg'),cnt=mk('div','count'),dots=mk('div','dots');
  left.appendChild(eggBox);left.appendChild(cnt);left.appendChild(dots);
  var right=mk('div','side'),stage=mk('div','stage');right.appendChild(stage);
  duel.appendChild(left);duel.appendChild(right);v.appendChild(duel);
  var msg=mk('p','say');v.appendChild(msg);
  var row=mk('div','row');
  var tr;
  row.appendChild(btn('いまの なし','',function(){tr.undo();beep([440]);}));
  row.appendChild(btn('おてほん','',function(){tr.toggle();}));
  row.appendChild(btn('また あとで','',function(){stepBack();show('field');}));
  v.appendChild(row);
  function paint(shake){
    eggBox.innerHTML=eggSVG(ci,n0(),g);
    if(shake){eggBox.classList.remove('shake');void eggBox.offsetWidth;eggBox.classList.add('shake');}
    cnt.textContent=n0()?'あと '+(EGG_GOAL-n0())+'かい で うまれる！':'「'+g+'」を 10かい かくと うまれるよ';
    dots.innerHTML='';for(var i=0;i<EGG_GOAL;i++){var d=document.createElement('i');if(i<n0())d.className='on';dots.appendChild(d);}
  }
  tr=tracer(stage,g,guideFor(n0()),{
    onStroke:function(i,n,w){msg.textContent=w+'！　'+(i+1)+' / '+n+'かくめ';},
    onHint:function(t){msg.textContent=t;say(t);sfx('miss');},
    onWrite:function(){
      S.egg[g]=n0()+1;S.writes[g]=(S.writes[g]||0)+1;save();crackSound(n0());paint(true);chips(eggBox,n0());
      if(n0()>=EGG_GOAL){msg.textContent='うまれる…！';stopVoice();setTimeout(function(){hatch(g,eggBox);},500);return;}
      if(S.tut===2&&n0()===1){msg.textContent=TX.eggTut1;say(TX.eggTut1,'fudeko');}
      else{msg.textContent=TX.eggTip(n0());say(TX.eggTip(n0()));}
      setTimeout(function(){tr.reset(guideFor(n0()));},650);
    }
  });
  paint(false);
  sfx('found');bgm('egg');
  if(S.tut===2&&!n0()){msg.innerHTML='ふでこ「たまごに かいてある 字を、かきじゅんどおりに なぞろう。<b>オレンジの まる</b>から スタート！」';say(TX.eggTut,'fudeko');}
  else{msg.textContent=n0()?TX.eggCont:'たまごに「'+g+'」と かいてあるよ。かきじゅんどおりに なぞってね';say(n0()?TX.eggCont:TX.eggNew(g));}
}
// ひびが はいるたびに からの かけらが ぽろっと おちる
function chips(box,n){var r=box.getBoundingClientRect(),host=box;host.style.position='relative';
  for(var i=0;i<2+Math.min(4,n>>1);i++){var d=mk('div','chip');d.style.left=(35+Math.random()*30)+'%';d.style.top=(25+Math.random()*40)+'%';d.style.background=EGGCOL[0];host.appendChild(d);
    var dx=(Math.random()-.5)*120,an=d.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+dx+'px,'+(80+Math.random()*80)+'px) rotate('+(Math.random()*540-270)+'deg)',opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.3,0,.8,1)'});an.onfinish=(function(d){return function(){d.remove();};})(d);}}
// うまれる！ … からが とびちって、ぴかーっと ひかる
function hatch(g,oldEgg){
  var v=$('egg'),ci=ORDER.indexOf(g),col=EGGCOL[ci%EGGCOL.length];
  S.born[g]=today(); delete S.egg[g]; S.lv[g]=S.lv[g]||1; if(S.tut===2)S.tut=3; save(); hud();
  bgm(null);v.innerHTML='';
  var box=mk('div','hatchbox');v.appendChild(box);
  var rays=mk('div','rays','<svg viewBox="-100 -100 200 200" aria-hidden="true">'+(function(){var s='';for(var i=0;i<16;i++)s+='<path d="M0,0 L'+(100*Math.cos((i*22.5-4)*Math.PI/180)).toFixed(1)+','+(100*Math.sin((i*22.5-4)*Math.PI/180)).toFixed(1)+' L'+(100*Math.cos((i*22.5+4)*Math.PI/180)).toFixed(1)+','+(100*Math.sin((i*22.5+4)*Math.PI/180)).toFixed(1)+' Z" fill="'+(i%2?'#fff3a0':'#ffd23f')+'"/>';return s;})()+'<circle r="34" fill="#fff" opacity=".9"/></svg>');
  box.appendChild(rays);
  var chb=mk('div','hatchchar','<svg viewBox="0 0 160 160" aria-hidden="true">'+(C[g]?C[g].svg:'')+'</svg>');box.appendChild(chb);
  var egg=mk('div','hatchegg',eggSVG(ci,10,g));box.appendChild(egg);
  var t=mk('p','say','うまれる…！');v.appendChild(t);
  sfx('riser');
  egg.animate([{transform:'rotate(0)'},{transform:'rotate(-9deg) scale(1.02)'},{transform:'rotate(9deg) scale(1.04)'},{transform:'rotate(-12deg) scale(1.06)'},{transform:'rotate(12deg) scale(1.08)'},{transform:'rotate(0) scale(1.12)'}],{duration:1300,easing:'ease-in'});
  setTimeout(function(){
    // ぴかーっ！
    sfx('burst');
    var fl=mk('div','flash');document.body.appendChild(fl);fl.animate([{opacity:0},{opacity:1,offset:.15},{opacity:0}],{duration:900,easing:'ease-out'}).onfinish=function(){fl.remove();};
    egg.remove();
    // からの かけら
    for(var i=0;i<14;i++){var p=mk('div','shard','<svg viewBox="0 0 40 40"><path d="M4,30 L12,6 L20,18 L28,4 L36,28 L20,36 Z" fill="'+col+'" stroke="#2a2a3a" stroke-width="3" stroke-linejoin="round"/></svg>');box.appendChild(p);
      var a=i/14*Math.PI*2+Math.random()*.3,dist=180+Math.random()*160,sz=.6+Math.random()*.9;
      p.animate([{transform:'translate(-50%,-50%) scale('+sz+') rotate(0)',opacity:1},{transform:'translate(calc(-50% + '+(Math.cos(a)*dist)+'px),calc(-50% + '+(Math.sin(a)*dist+60)+'px)) scale('+sz+') rotate('+(Math.random()*720-360)+'deg)',opacity:0}],{duration:1100+Math.random()*500,easing:'cubic-bezier(.15,.7,.4,1)',fill:'forwards'});}
    // きらきら
    for(var k=0;k<22;k++){var st=mk('div','spark','★');box.appendChild(st);var b2=Math.random()*Math.PI*2,d2=90+Math.random()*200;
      st.style.color=['#ffd23f','#fff','#ff8ab0','#8fd3ff'][k%4];
      st.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:'translate(calc(-50% + '+(Math.cos(b2)*d2)+'px),calc(-50% + '+(Math.sin(b2)*d2)+'px)) scale(1.3) rotate(180deg)',opacity:0}],{duration:900+Math.random()*700,delay:Math.random()*250,easing:'ease-out',fill:'forwards'});}
    rays.classList.add('on');chb.classList.add('on');
    setTimeout(function(){
      t.textContent='うまれた！「'+g+'」の '+nameOf(g)+'（'+readOf(g)+'）';
      v.appendChild(mk('p','meanbox',esc('「'+g+'」は… '+meanOf(g))));
      v.appendChild(mk('p','back','ひらがなの「'+esc(readOf(g))+'」が、かんじの「<b class="kjbig">'+g+'</b>」に もどった！'));
      beep([523,659,784,1047,1319],120);
      setTimeout(function(){say(TX.born(g));},700);
      var row=mk('div','row');
      row.appendChild(btn('ぼうけんに もどる','go',function(){show('field');}));
      row.appendChild(btn('かんじ牧場を みる','',function(){show('ranch');}));
      v.appendChild(row);
      var cf=mk('div','confbox');box.appendChild(cf);var cols=['#ff7a59','#ffd23f','#6ec46a','#4fb3f0','#ff8aa8'];
      for(var i=0;i<40;i++){var c=mk('i','');c.style.left=(Math.random()*100)+'%';c.style.background=cols[i%5];c.style.animationDelay=(Math.random()*.8)+'s';c.style.animationDuration=(1.6+Math.random())+'s';cf.appendChild(c);}
    },700);
  },1350);
}

// ---------- バトル（ざこは こうげきして こない。ボスは こうげきして くる） ----------
function sorted(t){return bornList().slice().sort(function(a,b){return (strongIn(t,b)-strongIn(t,a))||(lvOf(b)-lvOf(a));});}
function pickCard(t,g,cls){var b=document.createElement('button');b.type='button';var strong=strongIn(t,g);b.className='pick'+(strong?' strong':'')+(cls?' '+cls:'');
  b.innerHTML=(strong?'<span class="badge">つよい！</span>':'')+charSVG(g)+'<b>'+g+'</b><small>Lv.'+lvOf(g)+'</small>';b.setAttribute('aria-label',nameOf(g));return b;}
function weakHint(t){var mob=MOBS[t];if(t===MAOU)return 'どの かんじも つよい！ '+kr(mob.why);return esc(mob.name)+'には '+Array.from(mob.weak).map(function(g){return '「<b class="kjw">'+g+'</b>」';}).join('')+'が つよい！<br>'+kr(mob.why);}
function kr(s){return esc(s).replace(/\{([^|}]+)\|([^}]+)\}/g,function(_,k,y){return '<ruby class="kj">'+k+'<rt>'+y+'</rt></ruby>';});}
function startMob(mb){
  show('battle');var v=$('battle');v.innerHTML='';var t=mb.t,mob=MOBS[t];
  v.appendChild(mk('p','say',esc(mob.name+'が あらわれた！ だれで たたかう？')));
  v.appendChild(mk('p','hintbox',weakHint(t)));
  var party=mk('div','party');v.appendChild(party);
  var list=sorted(t),showAll=false;
  function fill(){party.innerHTML='';(showAll?list:list.slice(0,5)).forEach(function(g){var b=pickCard(t,g);b.onclick=function(){fight({t:t,team:[g],mob:mb});};party.appendChild(b);});
    if(!showAll&&list.length>5){var b=document.createElement('button');b.type='button';b.className='pick';b.innerHTML='<b style="font-size:16px;margin:auto">ほかの<br>なかま</b>';b.onclick=function(){showAll=true;fill();};party.appendChild(b);}}
  fill();
  var row=mk('div','row');row.appendChild(btn('にげる','',function(){stepBack();spawnMobs();show('field');}));v.appendChild(row);
  bgm('battle');sfx('encounter');say(TX.mob(t));
}
function bossEncounter(m){
  var b=bossActive(m);if(!b)return;
  if(b.final){talk(GD.maouPre.map(function(x){return {who:x[0],name:x[1],text:x[2]};}),function(){teamSelect(m,b);});return;}
  teamSelect(m,b);
}
function teamSelect(m,b){
  show('battle');var v=$('battle');v.innerHTML='';var t=b.t,max=b.final?5:3,team=[];
  var hpNow=S.bossHp[m]!=null?S.bossHp[m]:b.hp;
  v.appendChild(mk('p','say',esc((b.final?'まおう ヒラガナー':'ボス「'+b.name+'」')+'との たたかい！ '+max+'にん えらんでね')));
  var top=mk('div','duel');var mon=mk('div','mon boss','<svg viewBox="0 0 160 160" aria-hidden="true">'+mobSVG(t,true)+'</svg>');
  var info=mk('div','side');info.appendChild(mk('div','count',esc(b.name)));var bar=mk('div','hpbar','<i style="width:'+(100*hpNow/b.hp)+'%"></i>');info.appendChild(bar);
  if(hpNow<b.hp)info.appendChild(mk('div','small','まえの たたかいで へとへと！'));
  top.appendChild(mon);top.appendChild(info);v.appendChild(top);
  v.appendChild(mk('p','hintbox',weakHint(t)+'<br>レベルが たかいと ハートが おおくて、ながく たたかえるよ。'));
  var slots=mk('div','team');v.appendChild(slots);
  var party=mk('div','party');v.appendChild(party);
  var row=mk('div','row');
  var go=btn('しゅつげき！','go',function(){if(team.length)fight({t:t,team:team.slice(),boss:b,m:m});});
  row.appendChild(btn('おすすめ','',function(){team=sorted(t).slice(0,max);paint();}));
  row.appendChild(go);
  row.appendChild(btn('にげる','',function(){stepBack();show('field');}));
  v.appendChild(row);
  function paint(){slots.innerHTML='';for(var i=0;i<max;i++){var g=team[i],s=mk('div','slot'+(g?' on':''));s.innerHTML=g?charSVG(g)+'<b>'+g+'</b><span class="hearts">'+hearts(1+lvOf(g),1+lvOf(g))+'</span>':'<span>'+(i+1)+'</span>';slots.appendChild(s);}
    party.innerHTML='';sorted(t).forEach(function(g){var b2=pickCard(t,g,team.indexOf(g)>=0?'chosen':'');b2.onclick=function(){var k=team.indexOf(g);if(k>=0)team.splice(k,1);else if(team.length<max)team.push(g);else{team[max-1]=g;}paint();};party.appendChild(b2);});
    go.disabled=!team.length;}
  paint();
  bgm(b.final?'final':'boss');sfx('encounter');say(TX.team(b,max));
}
function hearts(n,max){var s='';for(var i=0;i<max;i++)s+='<i'+(i>=n?' class="off"':'')+'></i>';return s;}
function fight(o){
  var v=$('battle');v.innerHTML='';
  var t=o.t,mob=MOBS[t],boss=o.boss,m=o.m;
  var fmax=boss?boss.hp:4, fhp=boss?(S.bossHp[m]!=null?S.bossHp[m]:boss.hp):4;
  var al=o.team.map(function(g){return {g:g,hp:1+lvOf(g),max:1+lvOf(g)};}),idx=0,busy=false;
  var duel=mk('div','duel');
  var me=mk('div','side'),fg=mk('div','fighter'),nm=mk('div','count'),hb=mk('div','hearts big');
  me.appendChild(fg);me.appendChild(nm);if(boss)me.appendChild(hb);
  var bench=mk('div','bench');if(boss&&al.length>1)me.appendChild(bench);
  var mid=mk('div','side'),stage=mk('div','stage');mid.appendChild(stage);
  var foe=mk('div','side'),bar=mk('div','hpbar','<i></i>'),mn=mk('div','mon'+(boss?' boss':''),'<svg viewBox="0 0 160 160" aria-hidden="true">'+mobSVG(t,!!boss)+'</svg>');
  foe.appendChild(bar);foe.appendChild(mn);foe.appendChild(mk('div','count',esc(boss?boss.name:mob.name)));
  duel.appendChild(me);duel.appendChild(mid);duel.appendChild(foe);v.appendChild(duel);
  var msg=mk('p','say');v.appendChild(msg);
  var row=mk('div','row'),tr;
  var bUndo=btn('いまの なし','',function(){tr&&tr.undo();});
  var bRun=btn('にげる','',function(){stepBack();spawnMobs();show('field');});
  row.appendChild(bUndo);row.appendChild(bRun);v.appendChild(row);
  function A(){return al[idx];}
  function strong(){return strongIn(t,A().g);}
  function paintBar(){bar.firstChild.style.width=(100*Math.max(0,fhp)/fmax)+'%';}
  function paintMe(){var a=A();fg.className='fighter';fg.innerHTML=charSVG(a.g);nm.innerHTML=esc(nameOf(a.g))+' <span class="lv">Lv.'+lvOf(a.g)+'</span>';hb.innerHTML=hearts(a.hp,a.max);
    bench.innerHTML='';al.forEach(function(b,i){var s=mk('span',(i===idx?'on':'')+(b.hp<=0?' zz':''),charSVG(b.g));bench.appendChild(s);});}
  function newTracer(){tr=tracer(stage,A().g,(S.writes[A().g]||0)<12?'faint':'dot',{
      onStroke:function(i,n,w){msg.textContent=w+'！　'+(i+1)+' / '+n+'かくめ';},
      onHint:function(tx){msg.textContent=tx;say(tx);sfx('miss');},
      onWrite:attack});
    msg.textContent=(strong()?'「'+A().g+'」は つよい！ ':'')+'「'+A().g+'」を かくと こうげき！';
    say(TX.fight(A().g,strong()));}
  function lock(b){busy=b;stage.style.pointerEvents=b?'none':'';}
  function attack(){
    var a=A(),g=a.g,dmg=strong()?2:1;lock(true);
    S.writes[g]=(S.writes[g]||0)+1;
    fg.classList.remove('lunge');void fg.offsetWidth;fg.classList.add('lunge');
    setTimeout(function(){
      boom();if(dmg>1)setTimeout(boom,140);
      mn.classList.remove('hit');void mn.offsetWidth;mn.classList.add('hit');
      fhp=Math.max(0,fhp-dmg);paintBar();if(boss)S.bossHp[m]=fhp;save();
      if(fhp<=0){win();return;}
      msg.textContent=(dmg>1?'こうかばつぐん！ ':'')+nameOf(g)+'の こうげき！';if(dmg>1)sfx('crit');say(dmg>1?TX.crit:TX.shout(g));
      if(boss)setTimeout(foeAttack,900);else setTimeout(function(){tr.reset();lock(false);},500);
    },300);
  }
  function foeAttack(){
    mn.classList.remove('lungeL');void mn.offsetWidth;mn.classList.add('lungeL');
    msg.textContent=boss.atk;say(boss.atk,'boss');sfx('bossatk');
    setTimeout(function(){
      var a=A();a.hp--;fg.classList.remove('hit');void fg.offsetWidth;fg.classList.add('hit');paintMe();
      if(a.hp>0){msg.textContent=nameOf(a.g)+'は まだ がんばれる！（ハート '+a.hp+'）';setTimeout(function(){tr.reset();lock(false);},500);return;}
      fg.classList.add('sleepy');msg.textContent=nameOf(a.g)+'は つかれて ねむっちゃった… zzz';say(TX.sleep(a.g));sfx('sleep');
      setTimeout(function(){
        var nx=-1;for(var i=0;i<al.length;i++)if(al[i].hp>0){nx=i;break;}
        if(nx<0){retreat();return;}
        idx=nx;paintMe();fg.classList.add('pop');newTracer();lock(false);
        msg.textContent='つぎは '+nameOf(A().g)+'！ たのんだよ！';say(TX.next(A().g));sfx('swap');
      },1600);
    },350);
  }
  function retreat(){
    v.innerHTML='';
    v.appendChild(mk('div','mon boss','<svg viewBox="0 0 160 160" aria-hidden="true">'+mobSVG(t,true)+'</svg>'));
    var b2=mk('div','hpbar','<i style="width:'+(100*fhp/fmax)+'%"></i>');b2.style.margin='6px auto';v.appendChild(b2);
    v.appendChild(mk('p','say','みんな つかれちゃった… でも '+esc(boss.name)+'も へとへとだ！'));
    v.appendChild(mk('p','hintbox','ボスの へとへとは そのまま のこるよ。<br>れんしゅうの てきを やっつけて なかまを そだてたり、あいしょうの いい なかまを つれて、また いどもう！'));
    var r=mk('div','row');r.appendChild(btn('ぼうけんに もどる','go',function(){stepBack();spawnMobs();show('field');}));v.appendChild(r);
    say(TX.retreat);
  }
  function win(){
    var a=A(),g=a.g;mn.classList.add('vanish');row.innerHTML='';
    if(boss&&boss.final){S.bossHp[m]=0;save();msg.textContent='やった！ まおうを たおした！';say(TX.finalWin);sfx('win');setTimeout(ending,1600);return;}
    if(boss){S.cleared[m]=true;delete S.bossHp[m];}
    else{S.beaten++;if(o.mob&&o.mob.i>=0){S.mb[hero.m]=S.mb[hero.m]||[];if(S.mb[hero.m].indexOf(o.mob.i)<0)S.mb[hero.m].push(o.mob.i);}}
    save();
    msg.textContent=TX.win;say(TX.win);sfx('win');
    setTimeout(function(){absorbStars(v,mn,fg,g,function(nl){
      nm.innerHTML=esc(nameOf(g))+' <span class="lv">Lv.'+nl+'</span>';
      if(boss){al.forEach(function(b){if(b.g!==g){S.lv[b.g]=lvOf(b.g)+1;}});save();
        msg.textContent=boss.name+'を たおした！ みんな レベルアップ！';say(TX.bossWin(boss));
        pendingGuide={lines:m<7?GD.clear:GD.clear7,gate:1};
      }else{msg.textContent=nameOf(g)+'が Lv.'+nl+'に レベルアップ！';say(TX.lvup(g));
        if(S.tut===4){S.tut=5;save();pendingGuide={lines:GD.t4};}}
      row.appendChild(btn('ぼうけんに もどる','go',function(){spawnMobs();show('field');}));
    });},700);
  }
  paintBar();paintMe();newTracer();
  if(boss)say(TX.go(A().g));
}
