(function(){
  // 書き順データは kanji1.js（KanjiVG を160×160の折れ線に変換したもの）。ends: tome=とめ, hane=はね, harai=はらい
  var CREATURE={'山':'#yama-happy','木':'#ki-happy','火':'#hi-happy','小':'#sho-happy'};
  var CCOL={'山':'#6ec46a','木':'#5fcb75','火':'#ff6b3d','小':'#b48cff'};
  var PALETTE=['#6ec46a','#4fb3f0','#ff6b3d','#b48cff','#ffb400','#ff8aa8','#5fcb75','#f6b9a0','#9ad36b','#9aa3ad'];
  var KANJI={};
  (window.KANJI1||[]).forEach(function(k,i){
    KANJI[k.g]={name:k.r,glyph:k.g,color:CCOL[k.g]||PALETTE[i%PALETTE.length],creature:CREATURE[k.g]||null,strokes:k.s,ends:k.e};
  });
  var eggsBox=document.getElementById('eggs');
  Object.keys(KANJI).forEach(function(g,i){
    var b=document.createElement('button');b.type='button';b.className='egg';b.setAttribute('data-k',g);b.setAttribute('aria-pressed',i===0?'true':'false');
    b.innerHTML='<b>'+g+'</b><small>'+KANJI[g].name+'</small>';eggsBox.appendChild(b);
  });
  var ENDWORD={tome:'ピタッ',hane:'ピョン',harai:'スーッ'};
  var ENDNAME={tome:'とめ',hane:'はね',harai:'はらい'};
  var NS='http://www.w3.org/2000/svg';
  var pad=document.getElementById('pad'), egg=document.getElementById('egg'), guides=document.getElementById('guides'),
      done=document.getElementById('done'), live=document.getElementById('live'), hatch=document.getElementById('hatch'),
      confetti=document.getElementById('confetti'), msg=document.getElementById('msg'), sub=document.getElementById('sub'),
      penInfo=document.getElementById('penInfo'), btnGuide=document.getElementById('btnGuide'), starsEl=document.getElementById('stars');
  var cur=Object.keys(KANJI)[0]||'山', state='egg', si=0, showGuide=true, samples=[], target=0, drawing=false, pts=[], pointerType='touch', stars=0, rec=[];

  function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
  function clear(g){while(g.firstChild)g.removeChild(g.firstChild);}
  function dist(a,b){var dx=a[0]-b[0],dy=a[1]-b[1];return Math.sqrt(dx*dx+dy*dy);}
  function resample(poly,step){var out=[poly[0]];for(var i=1;i<poly.length;i++){var a=poly[i-1],b=poly[i],d=dist(a,b),n=Math.max(1,Math.round(d/step));for(var j=1;j<=n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}return out;}
  function pathD(poly){return poly.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ');}

  var ctx=null;
  function beep(fs){try{if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();var t=ctx.currentTime;fs.forEach(function(f,i){var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t+i*0.11);g.gain.exponentialRampToValueAtTime(0.22,t+i*0.11+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+i*0.11+0.28);o.connect(g);g.connect(ctx.destination);o.start(t+i*0.11);o.stop(t+i*0.11+0.3);});}catch(e){}}
  // とめ・はね・はらいの音（合成）
  function endSound(kind){
    try{
      if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();
      var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
      if(kind==='tome'){o.type='square';o.frequency.setValueAtTime(240,t);o.frequency.exponentialRampToValueAtTime(160,t+0.06);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.3,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.09);o.start(t);o.stop(t+0.1);}
      else if(kind==='hane'){o.type='triangle';o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(980,t+0.16);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.25,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.22);o.start(t);o.stop(t+0.24);}
      else {o.type='sine';o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(220,t+0.42);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.22,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+0.45);o.start(t);o.stop(t+0.48);}
    }catch(e){}
  }
  // ペンのとき、終わり方を筆圧と速度から拾う（ごほうび用。減点はしない）
  function judgeEnd(kind){
    if(pointerType!=='pen'||rec.length<8)return false;
    var n=rec.length,last=rec[n-1];
    function speedBetween(a,b){var d=0;for(var i=a+1;i<=b;i++)d+=dist(rec[i].p,rec[i-1].p);var dt=(rec[b].t-rec[a].t)||1;return d/dt;}
    var mid0=Math.floor(n*0.3),mid1=Math.floor(n*0.7),endI=n-1,endStart=Math.max(mid1,n-5);
    var vMid=speedBetween(mid0,mid1),vEnd=speedBetween(endStart,endI);
    var pMid=0,c=0;for(var i=mid0;i<=mid1;i++){pMid+=rec[i].pr;c++;}pMid=pMid/(c||1);
    var pEnd=0,c2=0;for(var j=endStart;j<=endI;j++){pEnd+=rec[j].pr;c2++;}pEnd=pEnd/(c2||1);
    if(kind==='tome')return vEnd<vMid*0.45;
    if(kind==='harai')return vEnd>vMid*1.05&&pEnd<pMid*0.75;
    if(kind==='hane'){
      var k=n-1;while(k>0&&dist(rec[k].p,last.p)<7)k--; if(k<=0)return false;
      var m=k;while(m>0&&dist(rec[m].p,rec[k].p)<12)m--; if(m<=0)return false;
      var a1=Math.atan2(last.p[1]-rec[k].p[1],last.p[0]-rec[k].p[0]),a2=Math.atan2(rec[k].p[1]-rec[m].p[1],rec[k].p[0]-rec[m].p[0]);
      var diff=Math.abs(a1-a2);if(diff>Math.PI)diff=2*Math.PI-diff;
      return diff>Math.PI/3&&dist(rec[k].p,last.p)<30;
    }
    return false;
  }
  function sparkle(p){
    var cols=['#ffd23f','#ff7a59','#fff'];
    for(var i=0;i<6;i++){var a=i/6*Math.PI*2,r=el('polygon',{points:'0,-6 1.8,-1.8 6,0 1.8,1.8 0,6 -1.8,1.8 -6,0 -1.8,-1.8',fill:cols[i%3],transform:'translate('+(p[0]+Math.cos(a)*14)+','+(p[1]+Math.sin(a)*14)+')'});r.setAttribute('class','conf');r.style.animationDuration='.9s';confetti.appendChild(r);}
    setTimeout(function(){clear(confetti);},1000);
  }
  // はらいの先細りの始点：最後の線分の途中（画全体の長さの4割ぶん手前）
  function taperStart(poly){
    var n=poly.length,e=poly[n-1],b=poly[n-2];
    var total=0;for(var i=1;i<n;i++)total+=dist(poly[i],poly[i-1]);
    var back=Math.min(total*0.4,dist(e,b)-2);
    var dx=e[0]-b[0],dy=e[1]-b[1],L=Math.sqrt(dx*dx+dy*dy)||1;
    return [e[0]-dx/L*back,e[1]-dy/L*back];
  }
  // 端の印。w = その線の太さ（先細りの根元の幅に使う）
  function endMarker(poly,kind,color,op,w){
    var n=poly.length,e=poly[n-1],b=poly[n-2],dx=e[0]-b[0],dy=e[1]-b[1],L=Math.sqrt(dx*dx+dy*dy)||1;dx/=L;dy/=L;
    var qx=-dy,qy=dx,g=el('g',{opacity:op}),hw=(w||10)/2;
    if(kind==='tome'){g.appendChild(el('circle',{cx:e[0],cy:e[1],r:hw+1,fill:color}));}
    else if(kind==='harai'){
      // はらい：根元は線と同じ太さ、先端はとがって少し先まで抜ける。内側がふくらむ曲線で筆っぽく
      var s=taperStart(poly),tipx=e[0]+dx*7,tipy=e[1]+dy*7;
      var d='M'+(s[0]+qx*hw)+','+(s[1]+qy*hw)+' Q'+((s[0]+tipx)/2+qx*hw*0.45)+','+((s[1]+tipy)/2+qy*hw*0.45)+' '+tipx+','+tipy
            +' Q'+((s[0]+tipx)/2-qx*hw*0.45)+','+((s[1]+tipy)/2-qy*hw*0.45)+' '+(s[0]-qx*hw)+','+(s[1]-qy*hw)+' Z';
      g.appendChild(el('path',{d:d,fill:color}));
      g.appendChild(el('circle',{cx:s[0],cy:s[1],r:hw,fill:color}));
    }
    else {
      // はね：角（b）から先端（e の少し先）へ細く鋭く跳ね上がる三角
      var hx=e[0]+dx*6,hy=e[1]+dy*6;
      g.appendChild(el('polygon',{points:(b[0]+qx*hw*0.9)+','+(b[1]+qy*hw*0.9)+' '+(b[0]-qx*hw*0.9)+','+(b[1]-qy*hw*0.9)+' '+hx+','+hy,fill:color,'stroke-linejoin':'round'}));
    }
    return g;
  }
  // はらいを「太さが連続的に変わるひとつの形」として作る（継ぎ目なし）
  // w=線の太さ, extra=終点の先に抜ける長さ
  function haraiShape(poly,w,extra){
    var n=poly.length,e=poly[n-1],b=poly[n-2],dx=e[0]-b[0],dy=e[1]-b[1],L=Math.sqrt(dx*dx+dy*dy)||1;dx/=L;dy/=L;
    var ext=poly.slice(0,n-1).concat([[e[0]+dx*extra,e[1]+dy*extra]]);
    var pts=resample(ext,1.5),total=0,cum=[0];
    for(var i=1;i<pts.length;i++){total+=dist(pts[i],pts[i-1]);cum.push(total);}
    var taperFrom=total*0.55,left=[],right=[];
    for(var j=0;j<pts.length;j++){
      var p=pts[j],a=pts[Math.max(0,j-1)],c=pts[Math.min(pts.length-1,j+1)];
      var tx=c[0]-a[0],ty=c[1]-a[1],tl=Math.sqrt(tx*tx+ty*ty)||1;tx/=tl;ty/=tl;
      var s=cum[j]<=taperFrom?0:(cum[j]-taperFrom)/(total-taperFrom);
      var hw=(w/2)*Math.pow(1-s,1.7);
      left.push([p[0]-ty*hw,p[1]+tx*hw]);right.push([p[0]+ty*hw,p[1]-tx*hw]);
    }
    var d='M'+left[0][0].toFixed(1)+','+left[0][1].toFixed(1);
    for(var k=1;k<left.length;k++)d+=' L'+left[k][0].toFixed(1)+','+left[k][1].toFixed(1);
    for(var m=right.length-1;m>=0;m--)d+=' L'+right[m][0].toFixed(1)+','+right[m][1].toFixed(1);
    return d+' Z';
  }
  function haraiEl(poly,color,w,extra,op){
    var g=el('g',{opacity:op});
    g.appendChild(el('path',{d:haraiShape(poly,w,extra),fill:color,'stroke-linejoin':'round'}));
    g.appendChild(el('circle',{cx:poly[0][0],cy:poly[0][1],r:w/2,fill:color}));
    return g;
  }
  // 表示用：はねはフックを省く／はらいは先細りの始点までを太線で描く（残りは endMarker）
  function viewPoly(poly,kind){
    if(kind==='hane')return poly.slice(0,poly.length-1);
    if(kind==='harai')return poly.slice(0,poly.length-1).concat([taperStart(poly)]);
    return poly;
  }
  function say(txt){try{if(!window.speechSynthesis)return;var u=new SpeechSynthesisUtterance(txt);u.lang='ja-JP';u.rate=0.95;u.pitch=1.2;window.speechSynthesis.cancel();window.speechSynthesis.speak(u);}catch(e){}}

  function drawGuides(){
    clear(guides); var k=KANJI[cur];
    k.strokes.forEach(function(s,i){
      if(i<si)return;
      var col=i===si?'#8fb3d9':'#d9d2c0',op=showGuide?1:(i===si?0.25:0),wd=i===si?12:10;
      if(k.ends[i]==='harai'){guides.appendChild(haraiEl(s,col,wd,8,op));}
      else{
        guides.appendChild(el('path',{d:pathD(viewPoly(s,k.ends[i])),fill:'none',stroke:col,'stroke-width':wd,'stroke-linecap':'round','stroke-linejoin':'round',opacity:op}));
        guides.appendChild(endMarker(s,k.ends[i],k.ends[i]==='tome'?(i===si?'#5f8fc4':'#c9c0aa'):col,showGuide?1:(i===si?0.3:0),wd));
      }
      if(i>=si){var t=el('text',{x:s[0][0]-10,y:s[0][1]-4,'font-size':'9','font-weight':'900',fill:'#6b5f4a',opacity:showGuide?1:0});t.textContent=String(i+1);guides.appendChild(t);}
    });
    if(si<k.strokes.length){var s0=k.strokes[si][0];var c=el('circle',{cx:s0[0],cy:s0[1],r:8,fill:'#ff7a59',opacity:.9});c.setAttribute('class','pulse');guides.appendChild(c);}
  }
  function startStroke(){
    var k=KANJI[cur]; if(si>=k.strokes.length)return;
    samples=resample(k.strokes[si],4); target=0; drawGuides();
    msg.textContent=String(si+1)+'かくめ！ オレンジから なぞろう（さいごは '+ENDNAME[k.ends[si]]+'）';
  }
  function begin(){
    state='trace'; si=0; egg.style.display='none'; guides.style.display=''; clear(done); clear(live); clear(hatch); hatch.style.display='none';
    sub.textContent=KANJI[cur].glyph+'（'+KANJI[cur].name+'）を かく。ぜんぶ '+KANJI[cur].strokes.length+'かく';
    startStroke(); beep([523]);
  }
  function reset(){state='egg'; si=0; stars=0; starsEl.textContent='きれいボーナス：（Apple Pencilのときだけ）'; egg.style.display=''; guides.style.display='none'; clear(done); clear(live); clear(hatch); hatch.style.display='none'; clear(confetti);
    msg.textContent='たまごを タップ！'; sub.textContent='なぞるとき、ひとふでずつ ゆっくりで だいじょうぶ';
    var kc=KANJI[cur]; ['spot1','spot2','spot3'].forEach(function(id){document.getElementById(id).setAttribute('fill',kc.color);}); document.getElementById('eggGlyph').textContent=kc.glyph;}

  function finishStroke(){
    var k=KANJI[cur], kind=k.ends[si], s=k.strokes[si];
    if(kind==='harai'){
      done.appendChild(haraiEl(s,'#2a2a3a',11,8,1));
      done.appendChild(haraiEl(s,k.color,6,5,1));
    } else {
      var vs=viewPoly(s,kind);
      done.appendChild(el('path',{d:pathD(vs),fill:'none',stroke:'#2a2a3a','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round'}));
      done.appendChild(endMarker(s,kind,'#2a2a3a',1,11));
      done.appendChild(el('path',{d:pathD(vs),fill:'none',stroke:k.color,'stroke-width':6,'stroke-linecap':'round','stroke-linejoin':'round'}));
      if(kind==='hane'){done.appendChild(endMarker(s,kind,k.color,1,5.5));}
    }
    endSound(kind);
    var good=judgeEnd(kind);
    if(good){stars++; starsEl.textContent='きれいボーナス：'+'★'.repeat(stars)+'（'+ENDNAME[kind]+' きれい！）'; sparkle(s[s.length-1]);}
    var bonus=good?'　きれい！':'';
    si++;
    if(si>=k.strokes.length){ setTimeout(hatchNow,250); }
    else { startStroke(); msg.textContent=ENDWORD[kind]+'！'+bonus+'　つぎは '+String(si+1)+'かくめ（さいごは '+ENDNAME[k.ends[si]]+'）'; }
  }
  function hatchNow(){
    state='done'; clear(guides); msg.textContent='うまれた！ '+KANJI[cur].name+'ちゃん'; sub.textContent='こんどは「おてほん：みえない」で ちょうせん！';
    beep([523,659,784,1047]); say(KANJI[cur].name);
    setTimeout(function(){
      var k=KANJI[cur]; clear(live);
      hatch.style.display=''; clear(hatch);
      var g=el('g',{}); g.setAttribute('class','pop');
      if(k.creature){ clear(done); g.appendChild(el('use',{href:k.creature})); }
      else {
        // 専用キャラがない字は、書いた字そのものに顔がついて生き物になる
        var xs=[],ys=[];k.strokes.forEach(function(s){s.forEach(function(p){xs.push(p[0]);ys.push(p[1]);});});
        var cx=(Math.min.apply(null,xs)+Math.max.apply(null,xs))/2, top=Math.min.apply(null,ys), bot=Math.max.apply(null,ys);
        var fy=top+(bot-top)*0.42;
        g.appendChild(el('ellipse',{cx:cx-13,cy:fy,rx:8,ry:10,fill:'#fff',stroke:'#2a2a3a','stroke-width':3}));
        g.appendChild(el('ellipse',{cx:cx+13,cy:fy,rx:8,ry:10,fill:'#fff',stroke:'#2a2a3a','stroke-width':3}));
        g.appendChild(el('ellipse',{cx:cx-11,cy:fy+2,rx:5,ry:6.5,fill:'#2a2a3a'}));g.appendChild(el('ellipse',{cx:cx+15,cy:fy+2,rx:5,ry:6.5,fill:'#2a2a3a'}));
        g.appendChild(el('circle',{cx:cx-9,cy:fy-1,r:2,fill:'#fff'}));g.appendChild(el('circle',{cx:cx+17,cy:fy-1,r:2,fill:'#fff'}));
        g.appendChild(el('ellipse',{cx:cx-24,cy:fy+14,rx:6,ry:4,fill:'#ff8aa8',opacity:.7}));g.appendChild(el('ellipse',{cx:cx+24,cy:fy+14,rx:6,ry:4,fill:'#ff8aa8',opacity:.7}));
        g.appendChild(el('path',{d:'M'+(cx-9)+','+(fy+16)+' Q'+cx+','+(fy+28)+' '+(cx+9)+','+(fy+16)+' Z',fill:'#c0392b',stroke:'#2a2a3a','stroke-width':3,'stroke-linejoin':'round'}));
      }
      hatch.appendChild(g);
      var cols=['#ff7a59','#ffd23f','#6ec46a','#4fb3f0','#ff8aa8'];
      clear(confetti);
      for(var i=0;i<22;i++){var r=el('rect',{x:10+Math.random()*140,y:-10-Math.random()*40,width:5,height:8,rx:1,fill:cols[i%5]});r.setAttribute('class','conf');r.style.animationDelay=(Math.random()*.6)+'s';confetti.appendChild(r);}
    },350);
  }

  function pos(ev){var r=pad.getBoundingClientRect();return [(ev.clientX-r.left)/r.width*160,(ev.clientY-r.top)/r.height*160];}
  function tol(){return pointerType==='pen'?22:30;}

  pad.addEventListener('pointerdown',function(ev){
    ev.preventDefault(); pointerType=ev.pointerType||'touch';
    penInfo.textContent='入力：'+(pointerType==='pen'?'Apple Pencil（はんてい きびしめ）':pointerType==='mouse'?'マウス':'ゆび（はんてい ゆるめ）');
    if(state==='egg'){begin();return;}
    if(state!=='trace')return;
    var p=pos(ev);
    if(dist(p,samples[0])>tol()*1.3){ var g=guides.lastChild; if(g){g.classList.remove('wob');void g.getBoundingClientRect();g.classList.add('wob');} msg.textContent='オレンジの まるから スタート！'; return; }
    drawing=true; pts=[p]; target=0; rec=[{p:p,t:ev.timeStamp,pr:ev.pressure||0.5}]; pad.setPointerCapture(ev.pointerId);
    var lp=el('path',{d:pathD(pts),fill:'none',stroke:'#3b6fd9','stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85}); clear(live); live.appendChild(lp);
  });
  pad.addEventListener('pointermove',function(ev){
    if(!drawing)return; ev.preventDefault();
    var p=pos(ev); pts.push(p); rec.push({p:p,t:ev.timeStamp,pr:ev.pressure||0.5});
    var lp=live.firstChild; if(lp){lp.setAttribute('d',pathD(pts)); if(ev.pressure&&pointerType==='pen')lp.setAttribute('stroke-width',(5+ev.pressure*8).toFixed(1));}
    while(target<samples.length-1&&dist(p,samples[target+1])<tol())target++;
  });
  function up(ev){
    if(!drawing)return; drawing=false;
    var okEnd=dist(pts[pts.length-1],samples[samples.length-1])<tol()*1.3;
    if(target>=samples.length*0.8&&okEnd){ clear(live); finishStroke(); }
    else { msg.textContent='おしい！ もういちど '+String(si+1)+'かくめ'; var lp=live.firstChild; if(lp){lp.setAttribute('opacity','.3'); setTimeout(function(){clear(live);},500);} beep([392]); }
  }
  pad.addEventListener('pointerup',up); pad.addEventListener('pointercancel',up);

  document.querySelectorAll('.egg').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.egg').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true');
    cur=b.getAttribute('data-k'); reset();
  });});
  btnGuide.addEventListener('click',function(){showGuide=!showGuide; btnGuide.textContent='おてほん：'+(showGuide?'みえる':'みえない'); if(state==='trace')drawGuides();});
  document.getElementById('btnReset').addEventListener('click',reset);
  reset();
})();
