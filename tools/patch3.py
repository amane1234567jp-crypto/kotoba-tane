import re
p='index.html'; s=open(p,encoding='utf-8').read()

# --- A: 敵の定義と絵 ---
a=s.index("var MOBS=["); b=s.index("function heroSVG(){")
s=s[:a]+r'''// てき：漢字の いみで つよい・よわいが きまる
var MOBS=[
 {name:'みずスライム',col:'#6cc0ea',col2:'#3b8fc4',weak:'火日土',why:'みずは 火で わかすと きえる。日（おひさま）で かわく。土が すいこむ',deco:'drop'},
 {name:'ほのおスライム',col:'#ff8a5c',col2:'#e04a2a',weak:'水川雨',why:'ほのおは 水や 雨で きえる',deco:'flame'},
 {name:'くさスライム',col:'#8fdc78',col2:'#4fa83a',weak:'火虫手',why:'くさは 火で もえる。虫が たべる。手で ぬける',deco:'leaf'},
 {name:'いわスライム',col:'#c9c2b6',col2:'#8a847a',weak:'水力大木',why:'いわは 水で けずれる。力もちや 大きいひとが わる。木の ねっこも わる',deco:'rock'},
 {name:'よるおばけ',col:'#9a7ad9',col2:'#6a4ab0',weak:'日火月王',why:'くらやみの おばけは あかるい 日や 火、月の ひかりが にがて',deco:'ghost'},
 {name:'かぜスライム',col:'#eef6ff',col2:'#a8c8e8',weak:'山森林石',why:'かぜは 山や 森・林に ぶつかって とまる。石は とばされない',deco:'swirl'}
];
function strongIn(t,g){return MOBS[t].weak.indexOf(g)>=0;}
function strongAgainst(g){var r=[];MOBS.forEach(function(m,i){if(m.weak.indexOf(g)>=0)r.push(m.name);});return r;}
function mobSVG(t){
  var m=MOBS[t%MOBS.length], d='';
  if(m.deco==='drop')d='<path d="M80,14 C70,30 66,40 80,46 C94,40 90,30 80,14 Z" fill="'+m.col+'" stroke="#2a2a3a" stroke-width="4"/>';
  if(m.deco==='flame')d='<path d="M80,10 C96,28 98,40 80,52 C62,40 64,28 80,10 Z" fill="#ffd23f" stroke="#2a2a3a" stroke-width="4"/>';
  if(m.deco==='leaf')d='<path d="M80,50 Q60,30 70,14 Q92,24 80,50 Z" fill="#5fb860" stroke="#2a2a3a" stroke-width="4"/>';
  if(m.deco==='rock')d='<path d="M44,70 l12,-10 l10,8 M108,64 l10,6 l-4,12" fill="none" stroke="#6b665e" stroke-width="5" stroke-linecap="round"/>';
  if(m.deco==='swirl')d='<path d="M60,30 q20,-14 34,0 q10,12 -4,18 q-12,4 -10,-6" fill="none" stroke="#7fa8d0" stroke-width="5" stroke-linecap="round"/>';
  var body=m.deco==='ghost'?'<path d="M24,140 L24,96 C24,62 50,42 80,42 C110,42 136,62 136,96 L136,140 L118,128 L100,140 L80,128 L60,140 L42,128 Z" fill="'+m.col+'" stroke="#2a2a3a" stroke-width="5" stroke-linejoin="round"/>'
    :'<path d="M20,140 C14,90 46,46 80,46 C114,46 146,90 140,140 Z" fill="'+m.col+'" stroke="#2a2a3a" stroke-width="5" stroke-linejoin="round"/><path d="M20,140 C14,90 46,46 80,46 L80,140 Z" fill="'+m.col2+'" opacity=".35"/>';
  return body+d
   +'<ellipse cx="62" cy="96" rx="9" ry="12" fill="#fff" stroke="#2a2a3a" stroke-width="3"/><ellipse cx="98" cy="96" rx="9" ry="12" fill="#fff" stroke="#2a2a3a" stroke-width="3"/>'
   +'<ellipse cx="64" cy="99" rx="5" ry="7" fill="#2a2a3a"/><ellipse cx="96" cy="99" rx="5" ry="7" fill="#2a2a3a"/>'
   +'<path d="M50,82 L70,88 M110,82 L90,88" stroke="#2a2a3a" stroke-width="4" stroke-linecap="round"/>'
   +'<path d="M70,118 Q80,126 90,118" fill="none" stroke="#2a2a3a" stroke-width="4" stroke-linecap="round"/>'
   +'<ellipse cx="46" cy="70" rx="8" ry="5" fill="#fff" opacity=".6"/>';
}
// 字の いみ（キャラの せつめい）
var MEAN={
'一':'よこぼう 1ぽんで「ひとつ」。いもむしも 1ぴき。','二':'よこぼう 2ほんで「ふたつ」。上が みじかく 下が ながい。','三':'よこぼう 3ぼんで「みっつ」。まんなかが いちばん みじかい。',
'四':'「よっつ」。しかくい おべんとうばこの かどは よっつ。','五':'「いつつ」。サイコロの 5の めの ならびと おなじ。','六':'「むっつ」。ありの あしは 6ぽん。',
'七':'「ななつ」。ななほしてんとうの ほしは 7こ。','八':'「やっつ」。はち（蜂）の「はち」と おなじ おと。','九':'「ここのつ」。ボール（球）の「きゅう」と おなじ おと。',
'十':'「とお」。りょうての ゆびを ぜんぶ あわせて 10ぽん。','上':'たかい ほう、うえの こと。はたが うえに あがる。','下':'ひくい ほう、したの こと。くもが したへ おりてくる。',
'入':'そとから なかへ「はいる」こと。','年':'1ねん、2ねんの「とし」。たんじょうびで ひとつ としを とる。','円':'おかねの「えん」（100えん）。まるい ことも 円という。',
'文':'かいた ことば、「ぶん」。てがみや さくぶん。','小':'「ちいさい」こと。ひよこみたいに ちいさい。','山':'たかく もりあがった「やま」。3つの とんがりが やまの かたち。',
'火':'もえる「ひ」。ほのおの かたちから できた字。','日':'おひさまの「ひ」。「いちにち」の 日でも ある。','木':'はえている「き」。上が えだ、下が ねっこ。',
'土':'じめんの「つち」。つちから めが でる かたち。','田':'おこめを そだてる「たんぼ」。あぜみちで 4つに わかれる。','石':'かたい「いし」。がけの したに ころがる いし。',
'竹':'まっすぐ のびる「たけ」。はっぱが 2つ ならぶ。','虫':'ちいさな いきもの「むし」。','犬':'わんわん「いぬ」。てんは みみ。',
'林':'木が 2ほん、たくさん ならんだ「はやし」。','森':'木が 3ぼん、もっと ふかい「もり」。','休':'ひとが 木に もたれて「やすむ」。',
'本':'よむ「ほん」。木の ねもとに しるしで「もと」の いみも。','村':'いえが あつまった いなかの「むら」。','草':'じめんに はえる「くさ」。',
'花':'さく「はな」。くさかんむりが ついている。','生':'めが でて「うまれる」「いきる」。','水':'ながれる「みず」。まんなかが ながれ、まわりが しぶき。',
'川':'みずが ながれる「かわ」。3ぼんの ながれ。','貝':'うみの「かい」。むかしは おかねの かわりだった。','雨':'そらから ふる「あめ」。くもから しずくが おちる。',
'玉':'まるい「たま」。ほうせきの たま。','王':'くにで いちばん えらい「おう」さま。','白':'ゆきや とうふの いろ、「しろ」。',
'百':'「ひゃく」。白の うえに いちを のせると 100。','金':'ぴかぴかの「きん」。おかねの「かね」でも ある。','青':'そらや みずの いろ、「あお」。',
'赤':'ひの いろ、「あか」。','気':'くうき、げんき、きもちの「き」。','出':'なかから そとへ「でる」。',
'月':'よるの「つき」。1がつ、2がつの 月でも ある。','夕':'ひが しずむ「ゆうがた」。','天':'あたまの うえに ひろがる「てん」（そら）。',
'空':'ひろい「そら」。からっぽの「から」とも よむ。','早':'あさ「はやい」。おひさまが でたばかり。','音':'みみに きこえる「おと」。',
'人':'「ひと」。ひとが よこを むいて たつ すがた。','大':'りょうてを ひろげて「おおきい」。','子':'あかちゃん、「こども」。',
'女':'「おんな」の ひと。','男':'たんぼで 力を だす「おとこ」の ひと。','目':'ものを みる「め」。',
'見':'目に あしが ついて「みる」。','耳':'おとを きく「みみ」。','口':'たべたり はなしたり する「くち」。',
'名':'よばれる「なまえ」。口で なまえを いう。','手':'ものを もつ「て」。ゆびが 5ほん。','足':'あるく「あし」。',
'力':'うでの「ちから」。ちからこぶ。','立':'じめんに「たつ」。','車':'うごく「くるま」。上から みた わの かたち。',
'糸':'ほそい「いと」。','字':'かいた「じ」、もじ。おうちで こどもが ならう。','学':'がっこうで「まなぶ」。',
'校':'「がっこう」の こう。','町':'みせや いえが あつまる「まち」。','先':'いちばん まえ、「さき」。せんせいの 先。',
'正':'まちがいが ない「ただしい」。','中':'まんなか、「なか」。','右':'はしを もつ ほう、「みぎ」（たいていの ひと）。',
'左':'みぎの はんたい、「ひだり」。','千':'「せん」。1000の こと。'
};
function meanOf(g){return MEAN[g]||'';}
'''+s[b:]

# --- B: てきの種類えらび ---
s=s.replace("var p=cand[Math.floor(Math.random()*cand.length)];if(p)mobs.push({x:p[0],y:p[1],t:Math.floor(Math.random()*3),id:'mob'+i});}",
 "var p=cand[Math.floor(Math.random()*cand.length)];if(p)mobs.push({x:p[0],y:p[1],t:pickMob(),id:'mob'+i});}")
s=s.replace("function spawnMobs(){","""function pickMob(){
  // なかまの だれかが つよい てきを おおめに だす（かてる てきで まなぶ）
  var born=bornList(), good=[];MOBS.forEach(function(m,i){if(born.some(function(g){return m.weak.indexOf(g)>=0;}))good.push(i);});
  if(good.length&&Math.random()<.8)return good[Math.floor(Math.random()*good.length)];
  return Math.floor(Math.random()*MOBS.length);
}
function lvOf(g){return (S.lv&&S.lv[g])||1;}
function spawnMobs(){""")

# --- C: バトル ---
a=s.index("// ---------- バトル"); b=s.index("// ---------- かんじ牧場（コレクション）")
s=s[:a]+r'''// ---------- バトル（まけは ない。1かい かくと 1かい こうげき。いみで つよい・よわい） ----------
var HPMAX=4;
function startBattle(t){
  show('battle'); var v=$('battle'); v.innerHTML='';
  var mob=MOBS[t%MOBS.length], hp=HPMAX;
  var head=document.createElement('p');head.className='say';head.textContent=mob.name+'が あらわれた！ だれで たたかう？';v.appendChild(head);
  var weakTxt=Array.from(mob.weak).map(function(g){return '「'+g+'」';}).join('');
  var hint=document.createElement('p');hint.className='hintbox';hint.textContent=mob.name+'には '+weakTxt+'が つよい！ '+mob.why;v.appendChild(hint);
  var party=document.createElement('div');party.className='party';v.appendChild(party);
  function pickBtn(g){var b=document.createElement('button');b.type='button';var strong=strongIn(t,g);b.className='pick'+(strong?' strong':'');
    b.innerHTML=(strong?'<span class="badge">つよい！</span>':'')+charSVG(g)+'<b>'+g+'</b><small>Lv.'+lvOf(g)+'</small>';b.setAttribute('aria-label',nameOf(g));b.onclick=function(){fight(g);};return b;}
  function fill(list){party.innerHTML='';list.forEach(function(g){party.appendChild(pickBtn(g));});
    if(bornList().length>list.length){var b=document.createElement('button');b.type='button';b.className='pick';b.innerHTML='<b style="font-size:16px;margin:auto">ほかの<br>なかま</b>';b.onclick=function(){fill(shuffle(bornList()).slice(0,4));};party.appendChild(b);}}
  var born=bornList(), strong=born.filter(function(g){return strongIn(t,g);}), rest=born.filter(function(g){return !strongIn(t,g);}).reverse();
  fill(strong.concat(rest).slice(0,4));
  var row=document.createElement('div');row.className='row';var run=document.createElement('button');run.className='btn';run.type='button';run.textContent='にげる';run.onclick=function(){show('field');};row.appendChild(run);v.appendChild(row);
  say(mob.name+'が あらわれた！ '+mob.name+'には '+Array.from(mob.weak).map(readOf).join('、')+'が つよい');

  function fight(g){
    v.innerHTML='';
    var strong=strongIn(t,g), dmg=strong?2:1;
    var duel=document.createElement('div');duel.className='duel';
    var me=document.createElement('div');me.className='side';var fg=document.createElement('div');fg.className='fighter';fg.innerHTML=charSVG(g);me.appendChild(fg);
    var nm=document.createElement('div');nm.className='count';nm.innerHTML=nameOf(g)+' <span class="lv">Lv.'+lvOf(g)+'</span>';me.appendChild(nm);
    var mid=document.createElement('div');mid.className='side';var stage=document.createElement('div');stage.className='stage';mid.appendChild(stage);
    var foe=document.createElement('div');foe.className='side';var hpb=document.createElement('div');hpb.className='hp';foe.appendChild(hpb);
    var mn=document.createElement('div');mn.className='mon';mn.innerHTML='<svg viewBox="0 0 160 160" aria-hidden="true">'+mobSVG(t)+'</svg>';foe.appendChild(mn);
    var mnn=document.createElement('div');mnn.className='count';mnn.textContent=mob.name;foe.appendChild(mnn);
    duel.appendChild(me);duel.appendChild(mid);duel.appendChild(foe);v.appendChild(duel);
    var msg=document.createElement('p');msg.className='say';v.appendChild(msg);
    var row=document.createElement('div');row.className='row';
    var bUndo=document.createElement('button');bUndo.className='btn';bUndo.type='button';bUndo.textContent='いまの なし';
    var run=document.createElement('button');run.className='btn';run.type='button';run.textContent='にげる';run.onclick=function(){show('field');};
    row.appendChild(bUndo);row.appendChild(run);v.appendChild(row);
    function paintHp(){hpb.innerHTML='';for(var i=0;i<HPMAX;i++){var d=document.createElement('i');if(i>=hp)d.className='off';hpb.appendChild(d);}}
    paintHp();
    var lines=['ぷるぷる ふるえてる','ぴょんと はねた','こっちを みてる','めが ぐるぐる'];
    var tr=tracer(stage,g,(S.writes[g]||0)<12?'faint':'dot',{
      onStroke:function(i,n,w){msg.textContent=w+'！　'+(i+1)+' / '+n+'かくめ';},
      onHint:function(tx){msg.textContent=tx;},
      onWrite:function(){
        S.writes[g]=(S.writes[g]||0)+1;
        fg.classList.remove('lunge');void fg.offsetWidth;fg.classList.add('lunge');
        setTimeout(function(){
          boom();if(strong)setTimeout(boom,140);
          mn.classList.remove('hit');void mn.offsetWidth;mn.classList.add('hit');
          hp=Math.max(0,hp-dmg);paintHp();
          if(hp<=0){
            mn.classList.add('vanish');S.beaten++;row.innerHTML='';
            msg.textContent='やっつけた！ ほしが でてきた！';say('やっつけた！');beep([523,659,784,1047]);
            setTimeout(function(){absorbStars(v,mn,fg,g,function(nl){
              nm.innerHTML=nameOf(g)+' <span class="lv">Lv.'+nl+'</span>';
              msg.textContent=nameOf(g)+'が Lv.'+nl+'に レベルアップ！';say(nameOf(g)+'が レベルアップ！');
              var b=document.createElement('button');b.className='btn go';b.type='button';b.textContent='ぼうけんに もどる';b.onclick=function(){show('field');};row.appendChild(b);
            });},700);
          }else{
            msg.textContent=(strong?'こうかばつぐん！ ':'')+nameOf(g)+'の こうげき！ スライムは '+lines[hp%4];
            say(strong?'こうか ばつぐん！':readOf(g)+'！');save();setTimeout(function(){tr.reset();},500);
          }
        },300);
      }
    });
    bUndo.onclick=function(){tr.undo();};
    msg.textContent=(strong?'「'+g+'」は '+mob.name+'に つよい！ ':'')+'「'+g+'」を かくと こうげき！';
    say((strong?'つよいぞ！ ':'')+readOf(g)+'を かいて こうげき！');
  }
}
// ほしが きらりーんと ひかって キャラに すいこまれる → レベルアップ
function absorbStars(box,from,to,g,done){
  var br=box.getBoundingClientRect(),a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  var ax=a.left-br.left+a.width/2+box.scrollLeft, ay=a.top-br.top+a.height/2+box.scrollTop;
  var bx=b.left-br.left+b.width/2+box.scrollLeft, by=b.top-br.top+b.height/2+box.scrollTop;
  var big=document.createElement('div');big.className='bigstar';big.textContent='★';big.style.left=ax+'px';big.style.top=ay+'px';box.appendChild(big);
  tone(1568,'sine',.5,.18);setTimeout(function(){tone(2093,'sine',.6,.16);},180);
  var bigAnim=big.animate([{transform:'translate(-50%,-50%) scale(.2) rotate(0deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1.5) rotate(180deg)',opacity:1,offset:.35},{transform:'translate(-50%,-50%) scale(1.2) rotate(360deg)',opacity:1}],{duration:900,easing:'ease-out',fill:'forwards'});
  bigAnim.onfinish=function(){
    var n=7,left=n;
    for(var i=0;i<n;i++)(function(i){
      var s=document.createElement('div');s.className='flystar';s.textContent='★';s.style.left=ax+'px';s.style.top=ay+'px';box.appendChild(s);
      var mx=(ax+bx)/2+(i-3)*28, my=Math.min(ay,by)-90-Math.abs(i-3)*12;
      var an=s.animate([{transform:'translate(-50%,-50%) scale(1)',left:ax+'px',top:ay+'px'},{left:mx+'px',top:my+'px',transform:'translate(-50%,-50%) scale(1.2)',offset:.45},{left:bx+'px',top:by+'px',transform:'translate(-50%,-50%) scale(.3)',opacity:.6}],{duration:900,delay:i*90,easing:'ease-in',fill:'forwards'});
      an.onfinish=function(){s.remove();tone(1200+i*120,'triangle',.12,.12);left--;if(!left)finish();};
    })(i);
    big.animate([{opacity:1},{opacity:0,transform:'translate(-50%,-50%) scale(.2)'}],{duration:500,fill:'forwards'}).onfinish=function(){big.remove();};
  };
  function finish(){
    S.lv=S.lv||{};S.lv[g]=lvOf(g)+1;S.stars++;save();hud();
    to.classList.remove('levelup');void to.offsetWidth;to.classList.add('levelup');
    var lb=document.createElement('div');lb.className='lvpop';lb.textContent='Lv.'+S.lv[g]+'！';lb.style.left=bx+'px';lb.style.top=(by-70)+'px';box.appendChild(lb);
    beep([784,988,1175,1568]);setTimeout(function(){lb.remove();},2200);
    done(S.lv[g]);
  }
}

'''+s[b:]

# --- D: うまれた画面に いみ ---
s=s.replace("""  var s2=document.createElement('p');s2.className='say';s2.style.fontSize='16px';s2.style.color='#6b5f4a';s2.textContent='かんじ牧場に なかまいり！ ずかんにも のったよ';v.appendChild(s2);
  beep([523,659,784,1047]);setTimeout(function(){say('うまれた！ '+nameOf(g)+'。'+readOf(g));},500);""",
"""  var mean=document.createElement('p');mean.className='meanbox';mean.textContent='「'+g+'」は… '+meanOf(g);v.appendChild(mean);
  var s2=document.createElement('p');s2.className='say';s2.style.fontSize='16px';s2.style.color='#6b5f4a';s2.textContent='かんじ牧場に なかまいり！ ずかんにも のったよ';v.appendChild(s2);
  beep([523,659,784,1047]);setTimeout(function(){say('うまれた！ '+nameOf(g)+'。'+meanOf(g));},500);""")

# --- E: ずかんカード ---
s=s.replace("""'<dl class="data"><dt>よみ</dt><dd>'+readOf(g)+'</dd>""","""'<p class="meanbox" style="margin:0">'+meanOf(g)+'</p><dl class="data"><dt>よみ</dt><dd>'+readOf(g)+'</dd><dt>レベル</dt><dd>Lv.'+lvOf(g)+'</dd><dt>つよい あいて</dt><dd>'+(strongAgainst(g).join('・')||'—')+'</dd>""")
s=s.replace("say(nameOf(g)+'。'+readOf(g));\n}\n\n// ---------- おうちのひと","say(nameOf(g)+'。'+meanOf(g));\n}\n\n// ---------- おうちのひと")
s=s.replace("b1.textContent='きく';b1.onclick=function(){say(nameOf(g)+'。'+readOf(g));};","b1.textContent='きく';b1.onclick=function(){say(nameOf(g)+'。'+meanOf(g));};")

# --- G: CSS ---
s=s.replace(".pick b{font-size:22px}",""".pick b{font-size:22px}
.pick{position:relative}
.pick small{font-size:13px;font-weight:900;color:var(--ink2)}
.pick.strong{background:#fff3c4;border-color:#e6a400;box-shadow:0 0 0 4px #ffd23f}
.pick .badge{position:absolute;top:-12px;right:-8px;background:var(--accent);color:#fff;border:3px solid var(--ink);border-radius:12px;font-size:13px;font-weight:900;padding:1px 8px}
.hintbox,.meanbox{background:var(--paper);border:3px dashed #c9a66b;border-radius:16px;padding:8px 14px;font-weight:700;font-size:16px;line-height:1.6;max-width:640px;margin:8px auto 0;text-align:center}
.lv{background:var(--gold);border:2px solid var(--ink);border-radius:8px;padding:0 6px;font-size:14px}
.bigstar,.flystar{position:absolute;color:#ffd23f;font-size:84px;line-height:1;pointer-events:none;z-index:8;-webkit-text-stroke:3px #2a2a3a;text-shadow:0 0 18px #fff6a0,0 0 36px #ffd23f}
.flystar{font-size:34px;-webkit-text-stroke:2px #2a2a3a}
.levelup{animation:levelup 1.2s ease-out}
@keyframes levelup{0%{filter:drop-shadow(0 0 0 #ffd23f)}30%{transform:scale(1.18);filter:drop-shadow(0 0 22px #ffd23f) brightness(1.3)}100%{transform:none;filter:none}}
.lvpop{position:absolute;transform:translate(-50%,-50%);font-size:44px;font-weight:900;color:#fff;-webkit-text-stroke:3px #2a2a3a;background:none;z-index:9;animation:lvpop 2.2s ease-out forwards;pointer-events:none;white-space:nowrap}
@keyframes lvpop{0%{transform:translate(-50%,-30%) scale(.3);opacity:0}20%{transform:translate(-50%,-50%) scale(1.2);opacity:1}80%{opacity:1}100%{transform:translate(-50%,-90%);opacity:0}}
#battle{position:absolute}""")
open(p,'w',encoding='utf-8').write(s)
missing=[k for k in '一二三四五六七八九十上下入年円文小山火日木土田石竹虫犬林森休本村草花生水川貝雨玉王白百金青赤気出月夕天空早音人大子女男目見耳口名手足力立車糸字学校町先正文中右左千']
import json
m=re.search(r"var MEAN=\{(.*?)\};",s,re.S).group(1)
keys=re.findall(r"'(.)':",m)
print(len(set(keys)), [k for k in set(missing) if k not in keys])
