function bornList(){return ORDER.filter(function(g){return S.born[g];});}
function bornCount(){return bornList().length;}
function lvOf(g){return (S.lv&&S.lv[g])||1;}
function hud(){$('bornN').textContent=bornCount();$('starN').textContent=S.stars;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
// {山|やま} … その字を とりもどしていれば かんじ（ふりがな つき）、まだなら ひらがな
function knows(k){return Array.from(k).every(function(c){return !!S.born[c];});}
function kt(s){return esc(s).replace(/\{([^|}]+)\|([^}]+)\}/g,function(_,k,y){return knows(k)?'<ruby class="kj">'+k+'<rt>'+y+'</rt></ruby>':y;});}
function plain(s){return String(s).replace(/\{([^|}]+)\|([^}]+)\}/g,'$2');}
function mk(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function btn(txt,cls,fn){var b=document.createElement('button');b.type='button';b.className='btn'+(cls?' '+cls:'');b.innerHTML=txt;b.onclick=fn;return b;}

// ---------- 画面切替 ----------
var VIEWS=['title','story','field','egg','battle','ranch','ending'], cur='title';
function show(v){cur=v;VIEWS.forEach(function(x){$(x).hidden=(x!==v);});
  document.body.classList.toggle('nobar',v==='title'||v==='story'||v==='ending');
  $('navField').setAttribute('aria-current',v==='field');$('navRanch').setAttribute('aria-current',v==='ranch');
  if(v!=='field'&&talking)endTalk(false);
  if(v==='field'){drawField();setTimeout(hooks,350);} if(v==='ranch'){renderRanch();bgm('ranch');} if(v==='title'||v==='story')bgm('title'); if(v==='ending')bgm('ending'); hud();}
$('navField').onclick=function(){ac();show('field');};
$('navRanch').onclick=function(){ac();show('ranch');};
$('bgmBtn').onclick=function(){ac();toggleBgm();};

// ---------- じんぶつ・どうぶつ（タイル 10×10 の 中に かく） ----------
var INK='#2a2a3a';
var PEOPLE={
 oba:{hair:'#d8d8d8',st:'bun',body:'#9a6fc8'}, oji:{hair:'#d8d8d8',st:'bald',body:'#6b8e4e',beard:'#f4f4f4'},
 elder:{hair:'#eee',st:'bald',body:'#a0703c',beard:'#fff'}, farmer:{hair:'#5a3a1a',st:'straw',body:'#3b6fd9'},
 boy:{hair:INK,st:'short',body:'#e04a4a'}, girl:{hair:'#7a4a2a',st:'tails',body:'#ff8ab0'},
 traveler:{hair:'#5a3a1a',st:'hat',hat:'#8b5a2b',body:'#4f8a4f'}, fisher:{hair:INK,st:'straw',body:'#4fb3f0'},
 woman:{hair:'#4a2a1a',st:'long',body:'#ff9a3c'}, police:{hair:INK,st:'cap',hat:'#2a4aa0',body:'#3b5fc0'},
 clerk:{hair:INK,st:'short',body:'#5fb860',apron:1}, teacher:{hair:'#5a3a1a',st:'long',body:'#ff7a59',glasses:1},
 drummer:{hair:INK,st:'band',body:'#3b6fd9'}, sumo:{hair:INK,st:'topknot',body:'#ffd9b0',belt:'#5a3a98'},
 king:{hair:'#eee',st:'crown',body:'#e04a4a',beard:'#fff'}, princess:{hair:'#ffd23f',st:'tiara',body:'#ff8ab0'},
 soldier:{hair:INK,st:'helmet',hat:'#c0c8d8',body:'#e04a4a'}
};
function personSVG(k){
  var p=PEOPLE[k]||PEOPLE.boy, s='<ellipse cx="5" cy="9.6" rx="3.2" ry=".9" fill="#000" opacity=".18"/>';
  s+='<rect x="3" y="5.8" width="4" height="3.6" rx="1.3" fill="'+p.body+'" stroke="'+INK+'" stroke-width=".45"/>';
  if(p.apron)s+='<rect x="3.8" y="6.6" width="2.4" height="2.6" rx=".5" fill="#fff"/>';
  if(p.belt)s+='<rect x="3" y="7.5" width="4" height="1" fill="'+p.belt+'"/>';
  if(p.st==='long'||p.st==='tiara')s+='<path d="M2.3,4 Q2.1,7.4 3.2,7.6 L6.8,7.6 Q7.9,7.4 7.7,4 Z" fill="'+p.hair+'" stroke="'+INK+'" stroke-width=".4"/>';
  if(p.st==='tails')s+='<circle cx="2.1" cy="4.8" r="1" fill="'+p.hair+'" stroke="'+INK+'" stroke-width=".4"/><circle cx="7.9" cy="4.8" r="1" fill="'+p.hair+'" stroke="'+INK+'" stroke-width=".4"/>';
  s+='<circle cx="5" cy="4.1" r="2.6" fill="#ffd9b0" stroke="'+INK+'" stroke-width=".45"/>';
  var cap='M2.4,4 Q2.5,1.3 5,1.3 Q7.5,1.3 7.6,4 Q6.4,2.7 5,2.8 Q3.6,2.7 2.4,4 Z';
  if(p.st!=='bald'&&p.st!=='straw'&&p.st!=='cap'&&p.st!=='helmet'&&p.st!=='hat')s+='<path d="'+cap+'" fill="'+p.hair+'" stroke="'+INK+'" stroke-width=".4"/>';
  if(p.st==='bald')s+='<path d="M2.6,3.8 Q2.4,3 3,2.9 M7.4,3.8 Q7.6,3 7,2.9" fill="none" stroke="'+p.hair+'" stroke-width=".7"/>';
  if(p.st==='bun')s+='<circle cx="5" cy="1.2" r="1.1" fill="'+p.hair+'" stroke="'+INK+'" stroke-width=".4"/>';
  if(p.st==='topknot')s+='<ellipse cx="5" cy="1.1" rx="1.3" ry=".6" fill="'+p.hair+'"/>';
  if(p.st==='band')s+='<rect x="2.4" y="2.5" width="5.2" height=".8" fill="#fff" stroke="'+INK+'" stroke-width=".3"/>';
  if(p.st==='straw')s+='<ellipse cx="5" cy="2.7" rx="3.8" ry=".9" fill="#f2d27a" stroke="'+INK+'" stroke-width=".4"/><path d="M3.2,2.6 Q3.4,.6 5,.6 Q6.6,.6 6.8,2.6 Z" fill="#f2d27a" stroke="'+INK+'" stroke-width=".4"/><rect x="3.3" y="1.9" width="3.4" height=".5" fill="#e04a4a"/>';
  if(p.st==='hat')s+='<ellipse cx="5" cy="2.6" rx="3.9" ry=".9" fill="'+p.hat+'" stroke="'+INK+'" stroke-width=".4"/><path d="M3.3,2.5 Q3.4,.5 5,.5 Q6.6,.5 6.7,2.5 Z" fill="'+p.hat+'" stroke="'+INK+'" stroke-width=".4"/>';
  if(p.st==='cap')s+='<path d="M2.4,3.4 Q2.6,.8 5,.8 Q7.4,.8 7.6,3.4 Z" fill="'+p.hat+'" stroke="'+INK+'" stroke-width=".4"/><path d="M2.2,3.3 L7.8,3.3" stroke="'+INK+'" stroke-width=".6"/><circle cx="5" cy="2" r=".5" fill="#ffd23f"/>';
  if(p.st==='helmet')s+='<path d="M2.3,3.8 Q2.4,.9 5,.9 Q7.6,.9 7.7,3.8 Z" fill="'+p.hat+'" stroke="'+INK+'" stroke-width=".4"/><path d="M5,.9 Q6.6,-.6 7.4,.4" fill="none" stroke="#e04a4a" stroke-width=".9" stroke-linecap="round"/>';
  if(p.st==='crown')s+='<path d="M3,2.5 L3.2,.5 L4.1,1.6 L5,.2 L5.9,1.6 L6.8,.5 L7,2.5 Z" fill="#ffd23f" stroke="'+INK+'" stroke-width=".4"/>';
  if(p.st==='tiara')s+='<path d="M3.6,1.9 L4.3,.9 L5,1.6 L5.7,.9 L6.4,1.9 Z" fill="#ffd23f" stroke="'+INK+'" stroke-width=".3"/><circle cx="5" cy="1.4" r=".3" fill="#ff8ab0"/>';
  s+='<circle cx="4.1" cy="4.4" r=".38" fill="'+INK+'"/><circle cx="5.9" cy="4.4" r=".38" fill="'+INK+'"/>';
  if(p.glasses)s+='<circle cx="4.1" cy="4.4" r=".85" fill="none" stroke="'+INK+'" stroke-width=".3"/><circle cx="5.9" cy="4.4" r=".85" fill="none" stroke="'+INK+'" stroke-width=".3"/><path d="M4.95,4.4 L5.05,4.4" stroke="'+INK+'" stroke-width=".3"/>';
  s+='<circle cx="3.4" cy="5.1" r=".45" fill="#ff9aa8" opacity=".7"/><circle cx="6.6" cy="5.1" r=".45" fill="#ff9aa8" opacity=".7"/>';
  if(p.beard)s+='<path d="M3,5 Q5,8.4 7,5 Q5,6.1 3,5 Z" fill="'+p.beard+'" stroke="'+INK+'" stroke-width=".35"/>';
  else s+='<path d="M4.4,5.5 Q5,6 5.6,5.5" fill="none" stroke="'+INK+'" stroke-width=".35" stroke-linecap="round"/>';
  return s;
}
var ANIMAL={
 cow:{say:'モ〜！',hz:[180,150]}, chick:{say:'ピヨピヨ',hz:[1800,2100]}, pig:{say:'ブーブー',hz:[220,200]}, dog:{say:'ワンワン！',hz:[520,440]},
 cat:{say:'ニャ〜',hz:[800,600]}, duck:{say:'ガーガー',hz:[400,380]}, frog:{say:'ケロケロ',hz:[300,500]}, owl:{say:'ホーホー',hz:[420,380]},
 rabbit:{say:'ぴょんぴょん',hz:[900,1200]}, pigeon:{say:'ポッポー',hz:[500,460]}, goat:{say:'メェ〜',hz:[330,300]}, horse:{say:'ヒヒーン！',hz:[700,500]},
 swan:{say:'クワッ',hz:[600,520]}, sheep:{say:'メェ〜',hz:[360,330]}, ghost:{}, maou:{}, maouA:{}
};
function eye(x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||.4)+'" fill="'+INK+'"/>';}
function animalSVG(k){
  var o='stroke="'+INK+'" stroke-width=".4"', s='<ellipse cx="5" cy="9.5" rx="3.4" ry=".8" fill="#000" opacity=".16"/>';
  if(k==='cow')s+='<rect x="2.3" y="7.6" width=".9" height="1.8" fill="'+INK+'"/><rect x="6.6" y="7.6" width=".9" height="1.8" fill="'+INK+'"/><ellipse cx="5.4" cy="6.5" rx="3.6" ry="2.2" fill="#fff" '+o+'/><path d="M5,4.6 Q6.4,5.4 5.8,6.6 Q4.8,6.4 5,4.6 Z M7.6,5.6 Q8.6,6.4 8,7.6 Q7,7 7.6,5.6 Z" fill="'+INK+'"/><ellipse cx="2.4" cy="5.2" rx="1.8" ry="1.6" fill="#fff" '+o+'/><ellipse cx="2.2" cy="6.2" rx="1.2" ry=".7" fill="#ffb3c0" '+o+'/><path d="M1.2,3.9 L.6,3.2 M3.4,3.8 L3.9,3.1" '+o+'/>'+eye(1.8,4.9,.3)+eye(3,4.9,.3);
  if(k==='chick')s+='<circle cx="5" cy="6.8" r="2.4" fill="#ffe14a" '+o+'/><path d="M7.3,6.6 L8.6,7 L7.3,7.4 Z" fill="#ff9a3c" '+o+'/><path d="M3.6,7.2 Q4.4,8.2 5.2,7.2" fill="none" '+o+'/>'+eye(6.2,6.2);
  if(k==='pig')s+='<ellipse cx="5.2" cy="6.8" rx="3.4" ry="2.2" fill="#ffb3c8" '+o+'/><circle cx="2.6" cy="6.2" r="1.6" fill="#ffb3c8" '+o+'/><ellipse cx="1.6" cy="6.6" rx=".7" ry=".55" fill="#ff8aa8" '+o+'/><path d="M2.2,4.8 L1.8,4 L3,4.5" fill="#ffb3c8" '+o+'/>'+eye(2.6,5.8,.3)+'<path d="M8.5,6.4 q.6,-.4 .3,-1" fill="none" '+o+'/>';
  if(k==='dog')s+='<ellipse cx="5.6" cy="7" rx="2.8" ry="1.8" fill="#d9a066" '+o+'/><circle cx="3" cy="5.4" r="1.9" fill="#d9a066" '+o+'/><ellipse cx="1.6" cy="5.4" rx=".7" ry="1.3" fill="#8b5a2b"/><ellipse cx="4.4" cy="5.2" rx=".7" ry="1.3" fill="#8b5a2b"/><circle cx="3" cy="6.2" r=".4" fill="'+INK+'"/>'+eye(2.4,5.2,.3)+eye(3.6,5.2,.3)+'<path d="M8.3,6.6 Q9.3,5.4 8.8,4.8" fill="none" '+o+'/>';
  if(k==='cat')s+='<ellipse cx="5.6" cy="7.2" rx="2.6" ry="1.7" fill="#ffb34a" '+o+'/><circle cx="3.2" cy="5.6" r="1.8" fill="#ffb34a" '+o+'/><path d="M1.7,4.8 L1.9,3.2 L3,4.2 Z M3.4,4 L4.5,3.2 L4.7,4.8 Z" fill="#ffb34a" '+o+'/>'+eye(2.6,5.5,.3)+eye(3.8,5.5,.3)+'<path d="M8.1,7 Q9.6,6 8.9,4.6" fill="none" stroke="#ffb34a" stroke-width=".8" stroke-linecap="round"/>';
  if(k==='duck'||k==='swan')s+=(k==='swan'?'<ellipse cx="5" cy="8.8" rx="4.2" ry=".9" fill="#6cc0ea"/>':'')+'<ellipse cx="5.6" cy="7.2" rx="2.9" ry="1.8" fill="#fff" '+o+'/>'+(k==='swan'?'<path d="M3.4,7 Q2,4 3.6,2.8" fill="none" stroke="'+INK+'" stroke-width="1.6" stroke-linecap="round"/><path d="M3.4,7 Q2,4 3.6,2.8" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/><path d="M3.6,2.8 L5,3.1" stroke="#ff9a3c" stroke-width=".8" stroke-linecap="round"/>'+eye(3.6,3,.25):'<circle cx="3.2" cy="5" r="1.6" fill="#fff" '+o+'/><path d="M1.8,5.3 L.6,5.6 L1.8,5.9 Z" fill="#ff9a3c" '+o+'/>'+eye(2.8,4.7,.3));
  if(k==='frog')s+='<ellipse cx="5" cy="7.4" rx="3" ry="2" fill="#6ec46a" '+o+'/><circle cx="3.6" cy="5.4" r="1.1" fill="#6ec46a" '+o+'/><circle cx="6.4" cy="5.4" r="1.1" fill="#6ec46a" '+o+'/>'+eye(3.6,5.3)+eye(6.4,5.3)+'<path d="M3.8,7.6 Q5,8.4 6.2,7.6" fill="none" '+o+'/>';
  if(k==='owl')s+='<ellipse cx="5" cy="6.4" rx="2.6" ry="3" fill="#a0703c" '+o+'/><ellipse cx="5" cy="7.2" rx="1.6" ry="1.8" fill="#f2d9a6"/><circle cx="4" cy="5.2" r="1" fill="#fff" '+o+'/><circle cx="6" cy="5.2" r="1" fill="#fff" '+o+'/>'+eye(4,5.2,.45)+eye(6,5.2,.45)+'<path d="M4.7,6 L5,6.6 L5.3,6 Z" fill="#ff9a3c"/><path d="M2.8,3.6 L3.4,4.4 M7.2,3.6 L6.6,4.4" '+o+'/>';
  if(k==='rabbit')s+='<ellipse cx="5" cy="7.4" rx="2.4" ry="1.8" fill="#fff" '+o+'/><circle cx="5" cy="5.4" r="1.7" fill="#fff" '+o+'/><ellipse cx="4.2" cy="2.6" rx=".6" ry="1.7" fill="#fff" '+o+'/><ellipse cx="5.8" cy="2.6" rx=".6" ry="1.7" fill="#fff" '+o+'/><ellipse cx="4.2" cy="2.7" rx=".25" ry="1.1" fill="#ffb3c8"/><ellipse cx="5.8" cy="2.7" rx=".25" ry="1.1" fill="#ffb3c8"/>'+eye(4.4,5.3,.3)+eye(5.6,5.3,.3)+'<circle cx="5" cy="5.9" r=".25" fill="#ff8aa8"/>';
  if(k==='pigeon')s+='<ellipse cx="5.4" cy="7.2" rx="2.6" ry="1.7" fill="#a8acc0" '+o+'/><circle cx="3.2" cy="5.4" r="1.3" fill="#a8acc0" '+o+'/><path d="M3,6.4 Q3.8,7 4.4,6.4" fill="none" stroke="#5fb8a0" stroke-width=".7"/><path d="M2,5.4 L1.2,5.7 L2,6" fill="#ff9a3c"/>'+eye(3,5.1,.28);
  if(k==='goat'||k==='sheep')s+=(k==='sheep'?'<g fill="#fff" '+o+'><circle cx="4" cy="6.4" r="1.4"/><circle cx="5.6" cy="5.8" r="1.4"/><circle cx="7" cy="6.6" r="1.3"/><circle cx="5.4" cy="7.6" r="1.5"/><circle cx="3.8" cy="7.6" r="1.2"/></g><ellipse cx="2.4" cy="5.8" rx="1.2" ry="1.4" fill="'+INK+'"/><circle cx="2.1" cy="5.6" r=".25" fill="#fff"/>':'<ellipse cx="5.6" cy="7" rx="2.8" ry="1.8" fill="#f4f4f4" '+o+'/><ellipse cx="2.8" cy="5.4" rx="1.4" ry="1.6" fill="#f4f4f4" '+o+'/><path d="M2.2,4 Q1.4,2.8 2.4,2.4 M3.4,4 Q4,2.8 3.4,2.4" fill="none" stroke="#a0703c" stroke-width=".6"/><path d="M2.6,6.8 L2.8,7.8" stroke="#ddd" stroke-width=".7"/>'+eye(2.4,5.3,.28)+eye(3.3,5.3,.28));
  if(k==='horse')s+='<rect x="3.4" y="7.6" width=".7" height="1.8" fill="#8b5a2b"/><rect x="7" y="7.6" width=".7" height="1.8" fill="#8b5a2b"/><ellipse cx="5.6" cy="6.8" rx="3" ry="1.6" fill="#c8864a" '+o+'/><path d="M3.4,6.4 L2.4,3.6 Q2.8,2.6 1.4,3.2 L.8,4.6 Q1.6,5 2.2,4.6 L2.8,6.4 Z" fill="#c8864a" '+o+'/><path d="M2.6,3 Q3.8,3.6 3.8,5.8" fill="none" stroke="#5a3a1a" stroke-width=".7"/>'+eye(1.8,3.8,.25);
  if(k==='ghost')s+='<path d="M2,9 L2,5 Q2,1.6 5,1.6 Q8,1.6 8,5 L8,9 L6.8,8.2 L5.6,9 L4.4,8.2 L3.2,9 Z" fill="#d8ccf4" '+o+'/>'+eye(4,4.8,.45)+eye(6,4.8,.45)+'<path d="M4.4,6.2 Q5,6.8 5.6,6.2" fill="none" '+o+'/>';
  if(k==='maou'||k==='maouA')s+='<g transform="translate(-1.6,-3.4) scale(.083)">'+maouSVG(k==='maou')+'</g>';
  return s;
}
function spriteSVG(k){return ANIMAL[k]?animalSVG(k):personSVG(k);}
function isAnimal(k){return !!ANIMAL[k]&&k!=='ghost'&&k!=='maou'&&k!=='maouA';}
// ふでの ようせい「ふでこ」（viewBox 0 0 100 100）
function fudekoSVG(){
  return '<ellipse cx="22" cy="54" rx="16" ry="10" fill="#cfeaff" stroke="'+INK+'" stroke-width="2.5" opacity=".9" transform="rotate(-20 22 54)"/><ellipse cx="78" cy="54" rx="16" ry="10" fill="#cfeaff" stroke="'+INK+'" stroke-width="2.5" opacity=".9" transform="rotate(20 78 54)"/>'
   +'<rect x="33" y="40" width="34" height="50" rx="15" fill="#f0d79a" stroke="'+INK+'" stroke-width="3.5"/><path d="M34,74 L66,74" stroke="#c9a66b" stroke-width="3"/>'
   +'<path d="M29,46 Q26,20 50,3 Q74,20 71,46 Q60,40 50,44 Q40,40 29,46 Z" fill="'+INK+'"/><path d="M42,16 Q46,10 50,8" fill="none" stroke="#6b6b80" stroke-width="3" stroke-linecap="round"/>'
   +'<circle cx="43" cy="57" r="3.6" fill="'+INK+'"/><circle cx="57" cy="57" r="3.6" fill="'+INK+'"/><circle cx="44" cy="55.8" r="1.2" fill="#fff"/><circle cx="58" cy="55.8" r="1.2" fill="#fff"/>'
   +'<circle cx="38" cy="64" r="3" fill="#ff9aa8" opacity=".7"/><circle cx="62" cy="64" r="3" fill="#ff9aa8" opacity=".7"/><path d="M45,64 Q50,69 55,64" fill="none" stroke="'+INK+'" stroke-width="2.6" stroke-linecap="round"/>';
}
// まおう ヒラガナー（viewBox 0 0 160 160）。nice=なかなおり後
function maouSVG(nice){
  return '<path d="M30,150 Q20,90 50,70 L110,70 Q140,90 130,150 Z" fill="#3a2460" stroke="'+INK+'" stroke-width="5" stroke-linejoin="round"/>'
   +'<path d="M48,62 L34,18 L64,46 Z M112,62 L126,18 L96,46 Z" fill="#ffe9a8" stroke="'+INK+'" stroke-width="5" stroke-linejoin="round"/>'
   +'<ellipse cx="80" cy="96" rx="48" ry="50" fill="#8a5cc8" stroke="'+INK+'" stroke-width="5"/><path d="M40,96 Q40,52 80,48 L80,146 Q40,140 40,96 Z" fill="#5a3a98" opacity=".35"/>'
   +'<circle cx="80" cy="122" r="16" fill="#ffd23f" stroke="'+INK+'" stroke-width="4"/><text x="80" y="130" text-anchor="middle" font-size="22" font-weight="900" fill="'+INK+'" font-family="Zen Maru Gothic,sans-serif">あ</text>'
   +(nice?'<path d="M56,82 Q64,74 72,82 M88,82 Q96,74 104,82" fill="none" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/><path d="M66,98 Q80,110 94,98" fill="none" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="94" r="6" fill="#ff9aa8" opacity=".7"/><circle cx="106" cy="94" r="6" fill="#ff9aa8" opacity=".7"/>'
     :'<ellipse cx="64" cy="84" rx="10" ry="12" fill="#fff" stroke="'+INK+'" stroke-width="3"/><ellipse cx="96" cy="84" rx="10" ry="12" fill="#fff" stroke="'+INK+'" stroke-width="3"/><circle cx="66" cy="87" r="5.5" fill="#e04a4a"/><circle cx="94" cy="87" r="5.5" fill="#e04a4a"/><path d="M48,66 L74,76 M112,66 L86,76" stroke="'+INK+'" stroke-width="6" stroke-linecap="round"/><path d="M64,104 Q80,96 96,104 L92,110 L86,104 L80,110 L74,104 L68,110 Z" fill="#fff" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/>')
   +'<path d="M128,72 L150,40" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/><circle cx="152" cy="36" r="9" fill="#ff8ab0" stroke="'+INK+'" stroke-width="4"/>';
}
