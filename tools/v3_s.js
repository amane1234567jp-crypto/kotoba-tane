// ---------- 音（iPad の マナーモード対策・BGM・効果音・よみあげ） ----------
var actx=null, AU={master:null,bgm:null,sfx:null,voice:null,route:'ふつう',bgmOn:true};
try{var bo=localStorage.getItem('kanjiboken.bgm');if(bo==='0')AU.bgmOn=false;}catch(e){}
function ac(){
  if(!actx){
    try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
    try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}
    var out=actx.destination;
    // 音を「音声ファイルの再生」として流す（マナーモードでも鳴る）。だめなら ふつうの出口
    try{if(actx.createMediaStreamDestination){var d=actx.createMediaStreamDestination(),a=document.createElement('audio');a.setAttribute('playsinline','');a.autoplay=true;a.srcObject=d.stream;a.style.display='none';document.body.appendChild(a);
      var p=a.play();out=d;AU.route='media';if(p&&p.catch)p.catch(function(){reroute();});setTimeout(function(){if(a.paused)reroute();},1500);AU._el=a;}}catch(e){out=actx.destination;}
    AU.master=actx.createGain();AU.master.gain.value=1;AU.master.connect(out);
    AU.bgm=actx.createGain();AU.bgm.gain.value=AU.bgmOn?.16:0;AU.bgm.connect(AU.master);
    AU.sfx=actx.createGain();AU.sfx.gain.value=.55;AU.sfx.connect(AU.master);
    AU.voice=actx.createGain();AU.voice.gain.value=1;AU.voice.connect(AU.master);
  }
  if(actx.state==='suspended'){try{actx.resume();}catch(e){}}
  if(AU._el&&AU._el.paused){try{var pp=AU._el.play();if(pp&&pp.catch)pp.catch(function(){});}catch(e){}}
  if(BG.want!==undefined){var w=BG.want;BG.want=undefined;BG.name=null;bgm(w);}
  return actx;
}
function reroute(){if(AU.route!=='media')return;try{AU.master.disconnect();AU.master.connect(actx.destination);AU.route='ふつう';}catch(e){}}
function tone(f,type,dur,vol,glide,when,dest){var c=ac();if(!c)return;try{var t=(when||c.currentTime),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest||AU.sfx);o.start(t);o.stop(t+dur+0.03);}catch(e){}}
var NOISE=null;
function noiseBuf(){var c=ac();if(!NOISE){NOISE=c.createBuffer(1,c.sampleRate,c.sampleRate);var d=NOISE.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;}return NOISE;}
function noise(dur,vol,ftype,freq,when,dest,q){var c=ac();if(!c)return;try{var t=when||c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuf();f.type=ftype||'highpass';f.frequency.value=freq||2000;if(q)f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(dest||AU.sfx);s.start(t,Math.random()*.5);s.stop(t+dur+.02);}catch(e){}}
function beep(fs,gap){fs.forEach(function(f,i){setTimeout(function(){tone(f,'triangle',.28,.22);tone(f*2,'sine',.2,.05);},i*(gap||110));});}
function endSound(kind){if(kind==='tome')tone(240,'square',.09,.2,160);else if(kind==='hane')tone(420,'triangle',.22,.24,980);else tone(700,'sine',.45,.2,220);}
// ピキッ… たまごの ひびわれ（n が 大きいほど はげしく）
function crackSound(n){var c=ac();if(!c)return;var t=c.currentTime,k=3+Math.min(6,n||1);
  for(var i=0;i<k;i++){var w=t+i*(.018+Math.random()*.03);noise(.035+Math.random()*.03,.5+(n||1)*.04,'bandpass',2500+Math.random()*3500,w,null,3);}
  tone(2600,'square',.03,.12,1200,t);tone(1500,'square',.05,.1,500,t+.06);noise(.18,.12,'highpass',5000,t+.04);}
function step(){tone(520,'sine',.05,.045,480);}
function boom(){tone(140,'sawtooth',.35,.25,50);noise(.25,.35,'lowpass',900);}
function sfx(name){var c=ac();if(!c)return;var t=c.currentTime;
  if(name==='tap')tone(880,'sine',.06,.08,1100);
  if(name==='talk'){tone(660,'triangle',.06,.1);tone(990,'triangle',.08,.08,null,t+.06);}
  if(name==='warp'){tone(300,'sine',.4,.15,900);noise(.4,.08,'bandpass',1200,t,null,1);}
  if(name==='found'){[1047,1319,1568,2093].forEach(function(f,i){tone(f,'sine',.25,.12,null,t+i*.07);});}
  if(name==='encounter'){tone(220,'square',.12,.12,440,t);tone(440,'square',.12,.12,880,t+.12);tone(330,'square',.25,.12,660,t+.24);noise(.3,.1,'highpass',3000,t);}
  if(name==='crit'){tone(880,'square',.1,.15,1760,t);tone(1320,'square',.15,.12,2640,t+.08);noise(.2,.25,'highpass',2500,t);}
  if(name==='bossatk'){tone(160,'sawtooth',.4,.22,60,t);noise(.4,.3,'lowpass',600,t);}
  if(name==='sleep'){[660,550,440,330].forEach(function(f,i){tone(f,'triangle',.22,.12,null,t+i*.16);});}
  if(name==='swap'){tone(400,'triangle',.12,.15,800,t);tone(600,'triangle',.15,.15,1200,t+.1);}
  if(name==='win'){[523,659,784,1047,784,1047].forEach(function(f,i){tone(f,'square',.16,.1,null,t+i*.1);tone(f/2,'triangle',.16,.1,null,t+i*.1);});}
  if(name==='miss')tone(300,'sine',.15,.08,220);
  if(name==='gate'){noise(.8,.2,'lowpass',500,t);[392,523,659,784].forEach(function(f,i){tone(f,'triangle',.3,.12,null,t+.3+i*.1);});}
  if(name==='star'){tone(1568,'sine',.5,.16);tone(2093,'sine',.6,.14,null,t+.18);}
  if(name==='riser'){var o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(1400,t+1.3);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+1.2);g.gain.exponentialRampToValueAtTime(.0001,t+1.35);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+1.4);
    for(var i=0;i<14;i++)noise(.04,.25+i*.03,'bandpass',2000+Math.random()*4000,t+i*.09,null,3);}
  if(name==='burst'){tone(90,'sine',.8,.5,40,t);noise(.9,.5,'lowpass',2500,t);noise(1.2,.25,'highpass',6000,t+.05);
    [1047,1319,1568,2093,2637,3136].forEach(function(f,i){tone(f,'sine',.6,.1,null,t+.15+i*.06);tone(f*1.5,'triangle',.4,.04,null,t+.18+i*.06);});}
}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.btn,.navb,.pick,.zcard,.critter');if(b)sfx('tap');},true);

// ---------- BGM（小さな シーケンサー） ----------
// 音名は 8分音符ずつ。「.」=休み、「-」=のばす
var NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function midi(n){var m=/^([A-G])(#|b)?(\d)$/.exec(n);if(!m)return null;return 12*(+m[3]+1)+NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);}
function hz(m){return 440*Math.pow(2,(m-69)/12);}
var SONGS={
 title:{bpm:118,lead:'square',a:'C5 E5 G5 E5 A5 G5 E5 - F5 A5 C6 A5 G5 - - . E5 G5 C6 G5 A5 G5 E5 C5 D5 E5 F5 D5 C5 - - .',b:'C3 . G2 . A2 . E2 . F2 . C3 . G2 . G2 . C3 . G2 . A2 . E2 . F2 . G2 . C3 . C3 .',d:'k.h.s.h.k.h.s.h.'},
 grass:{bpm:112,lead:'triangle',a:'G4 C5 E5 - D5 C5 A4 - G4 A4 C5 D5 E5 - - . E5 G5 E5 D5 C5 - A4 C5 D5 - C5 A4 G4 - - .',b:'C3 . E3 . F3 . A2 . C3 . G2 . C3 . G2 . F2 . A2 . G2 . B2 . C3 . G2 . C3 . . .',d:'k...s...k.k.s...'},
 pond:{bpm:96,lead:'sine',a:'F5 - A5 - C6 - A5 G5 F5 - D5 - C5 - - . D5 F5 G5 A5 G5 F5 D5 - C5 D5 F5 - - - . .',b:'F2 - C3 - D3 - A2 - Bb2 - F2 - C3 - - - D3 - A2 - Bb2 - C3 - F2 - C3 - F2 - - -',d:'k.......s.......'},
 forest:{bpm:92,lead:'triangle',a:'A4 C5 E5 - D5 C5 B4 - A4 - E4 - G4 A4 - . C5 D5 E5 G5 E5 D5 C5 - B4 C5 B4 G4 A4 - - .',b:'A2 - E3 - G2 - D3 - F2 - C3 - E2 - B2 - A2 - E3 - G2 - D3 - F2 - E2 - A2 - - -',d:'k...h...s...h...'},
 town:{bpm:124,lead:'square',a:'G4 B4 D5 G5 F#5 D5 E5 - C5 E5 G5 E5 D5 - - . B4 D5 G5 B5 A5 G5 E5 - F#5 G5 A5 F#5 G5 - - .',b:'G2 . D3 . E3 . B2 . C3 . G2 . D3 . D3 . G2 . D3 . E3 . B2 . C3 . D3 . G2 . G2 .',d:'k.h.s.h.k.k.s.hh'},
 school:{bpm:116,lead:'square',a:'D5 - D5 E5 F#5 - A5 - G5 F#5 E5 - D5 - - . F#5 - A5 - B5 A5 G5 F#5 E5 - F#5 E5 D5 - - .',b:'D3 . A2 . D3 . A2 . G2 . A2 . D3 . A2 . D3 . F#2 . G2 . A2 . D3 . A2 . D3 . . .',d:'k.s.k.s.k.s.kks.'},
 fest:{bpm:108,lead:'triangle',a:'D5 E5 G5 A5 G5 E5 D5 - E5 G5 A5 C6 A5 G5 E5 - D5 E5 D5 C5 A4 - C5 D5 E5 G5 E5 D5 D5 - - .',b:'D3 . D3 A2 D3 . D3 A2 C3 . C3 G2 D3 . D3 . D3 . D3 A2 D3 . D3 A2 C3 . C3 G2 D3 . . .',d:'t..t.t..t..tt.t.'},
 snow:{bpm:88,lead:'sine',a:'Eb5 G5 Bb5 - Ab5 G5 F5 - Eb5 F5 G5 - Bb4 - - . C5 Eb5 G5 - F5 Eb5 D5 - Eb5 - Bb4 - Eb5 - - -',b:'Eb3 - Bb2 - Ab2 - Bb2 - Eb3 - Bb2 - G2 - Bb2 - Ab2 - Eb3 - Bb2 - F2 - Eb3 - Bb2 - Eb3 - - -',d:'................',bell:1},
 kingdom:{bpm:104,lead:'square',a:'Bb4 - D5 F5 Bb5 - A5 G5 F5 - G5 A5 Bb5 - - . G5 - F5 Eb5 D5 - C5 D5 Eb5 - D5 C5 Bb4 - - .',b:'Bb2 . F3 . Eb3 . F3 . Bb2 . F3 . G2 . F2 . Eb2 . Bb2 . F2 . C3 . F2 . F2 . Bb2 . . .',d:'k...s...k.k.s...'},
 castle:{bpm:84,lead:'sawtooth',a:'D4 - F4 - A4 - G#4 - A4 - D5 - C5 - A4 - Bb4 - A4 - G4 - F4 - E4 - F4 - D4 - - -',b:'D2 - D2 - D2 - D2 - Bb1 - Bb1 - A1 - A1 - D2 - D2 - D2 - D2 - Bb1 - A1 - D2 - - -',d:'k.......k...s...'},
 egg:{bpm:84,lead:'sine',a:'C5 - E5 G5 - E5 F5 - A5 G5 - E5 D5 - - . E5 - G5 C6 - B5 A5 - G5 F5 - D5 C5 - - .',b:'C3 - G2 - F2 - C3 - F2 - G2 - C3 - G2 - C3 - E3 - F2 - D3 - G2 - B2 - C3 - - -',d:'................',bell:1},
 battle:{bpm:150,lead:'square',a:'A4 C5 E5 A5 G5 E5 C5 E5 F5 A5 C6 A5 G5 E5 D5 E5 A4 C5 E5 A5 B5 A5 G5 E5 F5 E5 D5 B4 C5 B4 A4 .',b:'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 G2 G3 G2 G3 A2 A3 A2 A3 E2 E3 E2 E3 F2 F3 G2 G3 A2 E3 A2 .',d:'k.hsk.hsk.hsk.ss'},
 boss:{bpm:156,lead:'sawtooth',a:'E5 - G5 F#5 E5 - B4 - C5 D5 E5 - D5 C5 B4 - E5 - G5 A5 B5 - A5 G5 F#5 G5 A5 F#5 E5 - - .',b:'E2 E2 E3 E2 E2 E2 E3 E2 C2 C2 C3 C2 D2 D2 D3 D2 E2 E2 E3 E2 E2 E2 E3 E2 C2 C2 D2 D2 E2 E2 E3 E2',d:'k.hsk.hsk.hskkss'},
 final:{bpm:160,lead:'sawtooth',a:'D5 F5 A5 D6 C6 A5 Bb5 - G5 Bb5 D6 Bb5 A5 - - . D5 F5 A5 D6 E6 D6 C#6 A5 Bb5 A5 G5 E5 D5 - - .',b:'D2 D3 D2 D3 D2 D3 D2 D3 G2 G3 G2 G3 A2 A3 A2 A3 D2 D3 D2 D3 A1 A2 A1 A2 Bb1 Bb2 A1 A2 D2 D3 D2 D3',d:'kshsk.hsksshkkss'},
 ranch:{bpm:100,lead:'triangle',a:'G4 - B4 D5 G5 - E5 - D5 B4 G4 - A4 - - . B4 - D5 G5 B5 - A5 G5 E5 - D5 - G4 - - .',b:'G2 . D3 . C3 . D3 . G2 . D3 . D3 . D3 . G2 . D3 . C3 . D3 . E3 . D3 . G2 . . .',d:'k...h...k...h...'},
 ending:{bpm:96,lead:'square',a:'C5 - E5 - G5 - C6 - B5 - G5 - A5 - - - F5 - A5 - C6 - E6 - D6 - B5 - C6 - - -',b:'C3 - G2 - A2 - E2 - F2 - C3 - D3 - G2 - F2 - C3 - A2 - E2 - G2 - G2 - C3 - - -',d:'k...s...k...s...',bell:1}
};
var BG={name:null,timer:null,i:0,t:0};
function parseSeq(s){return s.split(/\s+/).map(function(x){return x==='.'?null:x==='-'?'-':midi(x);});}
function bgm(name){
  if(!actx){BG.want=name;return;}
  if(BG.name===name)return;BG.name=name;clearInterval(BG.timer);BG.timer=null;
  if(!name||!SONGS[name])return;var c=ac();if(!c)return;
  var sg=SONGS[name];if(!sg._a){sg._a=parseSeq(sg.a);sg._b=parseSeq(sg.b);}
  var e8=60/sg.bpm/2;BG.i=0;BG.t=c.currentTime+.08;
  BG.timer=setInterval(function(){
    if(!actx)return;
    while(BG.t<actx.currentTime+.25){
      var i=BG.i, a=sg._a[i%sg._a.length], b=sg._b[i%sg._b.length], dch=sg.d.charAt(i%sg.d.length);
      if(a&&a!=='-'){var len=1;while(sg._a[(i+len)%sg._a.length]==='-'&&len<8)len++;voiceNote(hz(a),sg.lead,e8*len*.95,.32,BG.t);if(sg.bell)tone(hz(a)*2,'sine',e8*len*.6,.06,null,BG.t,AU.bgm);}
      if(b&&b!=='-'){var lb=1;while(sg._b[(i+lb)%sg._b.length]==='-'&&lb<8)lb++;voiceNote(hz(b),'triangle',e8*lb*.9,.5,BG.t);}
      if(dch==='k')tone(110,'sine',.16,.6,45,BG.t,AU.bgm);
      if(dch==='s')noise(.12,.35,'bandpass',1800,BG.t,AU.bgm,.8);
      if(dch==='h')noise(.04,.18,'highpass',7000,BG.t,AU.bgm);
      if(dch==='t'){tone(90,'sine',.25,.8,55,BG.t,AU.bgm);noise(.08,.3,'lowpass',400,BG.t,AU.bgm);}
      BG.i++;BG.t+=e8;
    }
  },40);
}
function voiceNote(f,type,dur,vol,t){var c=actx;try{var o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*(type==='square'||type==='sawtooth'?.35:1),t+.015);g.gain.setValueAtTime(vol*(type==='square'||type==='sawtooth'?.28:.8),t+Math.max(.02,dur*.6));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(AU.bgm);o.start(t);o.stop(t+dur+.05);}catch(e){}}
function bgmVol(){if(!AU.bgm)return;var v=AU.bgmOn?(VO.playing?.05:.16):0;try{AU.bgm.gain.setTargetAtTime(v,actx.currentTime,.12);}catch(e){}}
function toggleBgm(){AU.bgmOn=!AU.bgmOn;try{localStorage.setItem('kanjiboken.bgm',AU.bgmOn?'1':'0');}catch(e){}bgmVol();$('bgmBtn').textContent=AU.bgmOn?'♪ オン':'♪ オフ';}

// ---------- よみあげ（VOICEVOX で つくった こえ。なければ 端末の よみあげ） ----------
var VO={idx:window.VOICE_INDEX||{},packs:{},wait:{},buf:{},lru:[],playing:false,tok:0,src:null,missing:{}};
function splitS(t){t=String(t).replace(/[▶◀▲▼]/g,'').replace(/\s+/g,' ').trim();var out=[],cur='';
  for(var i=0;i<t.length;i++){var ch=t.charAt(i);cur+=ch;if('。！？!?'.indexOf(ch)>=0){var nx=t.charAt(i+1);if(nx==='」'||nx==='』'||'！？!?'.indexOf(nx)>=0)continue;if(cur.trim())out.push(cur.trim());cur='';}}
  if(cur.trim())out.push(cur.trim());return out;}
function vkey(who,s){return who+'|'+s;}
function loadPack(p){
  if(VO.packs[p])return Promise.resolve(VO.packs[p]);
  if(VO.wait[p])return VO.wait[p].pr;
  var w={};w.pr=new Promise(function(res){w.res=res;var sc=document.createElement('script');sc.src='voice/'+p+'.js';sc.onerror=function(){VO.packs[p]={};res({});};document.head.appendChild(sc);setTimeout(function(){if(!VO.packs[p]){res({});}},20000);});
  VO.wait[p]=w;return w.pr;
}
window.VOICE_PACK=function(p,data){VO.packs[p]=data;if(VO.wait[p])VO.wait[p].res(data);};
function b64buf(b){var s=atob(b),n=s.length,u=new Uint8Array(n);for(var i=0;i<n;i++)u[i]=s.charCodeAt(i);return u.buffer;}
function getBuf(k){
  var ref=VO.idx[k];if(!ref)return Promise.resolve(null);
  if(VO.buf[k])return Promise.resolve(VO.buf[k]);
  var c=ac();if(!c)return Promise.resolve(null);
  var pack=ref.split('/')[0],id=ref.split('/')[1];
  return loadPack(pack).then(function(d){var b=d[id];if(!b)return null;
    return new Promise(function(res){try{var pr=c.decodeAudioData(b64buf(b),function(ab){res(ab);},function(){res(null);});if(pr&&pr.then)pr.then(res,function(){res(null);});}catch(e){res(null);}});
  }).then(function(ab){if(ab){VO.buf[k]=ab;VO.lru.push(k);if(VO.lru.length>80){var o=VO.lru.shift();delete VO.buf[o];}}return ab;});
}
function prefetch(list){list.forEach(function(x){var r=VO.idx[x];if(r)loadPack(r.split('/')[0]);});}
function prefetchPacks(ps){ps.forEach(function(p){loadPack(p);});}
function stopVoice(){VO.tok++;if(VO.src){try{VO.src.onended=null;VO.src.stop();}catch(e){}VO.src=null;}try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){}VO.playing=false;bgmVol();}
// say(ぶん, だれ) … ぶんを 「。！？」で くぎって、じゅんばんに ならす
function say(text,who){
  who=who||'narr';stopVoice();var tok=VO.tok,parts=splitS(plain(text));if(!parts.length)return Promise.resolve();
  return new Promise(function(done){
    var i=0;
    function next(){
      if(tok!==VO.tok){done();return;}
      if(i>=parts.length){VO.playing=false;bgmVol();done();return;}
      var s=parts[i++],k=vkey(who,s);
      getBuf(k).then(function(ab){
        if(tok!==VO.tok){done();return;}
        if(ab){var c=ac(),src=c.createBufferSource();src.buffer=ab;src.connect(AU.voice);VO.src=src;VO.playing=true;bgmVol();src.onended=function(){if(VO.src===src)VO.src=null;setTimeout(next,90);};src.start();}
        else{VO.missing[k]=1;if(window.__voiceMissing)window.__voiceMissing(k);fallbackSpeak(s,next);}
      });
    }
    next();
  });
}
function fallbackSpeak(s,next){try{if(!window.speechSynthesis){setTimeout(next,300);return;}var u=new SpeechSynthesisUtterance(s);u.lang='ja-JP';u.rate=.95;u.pitch=1.1;VO.playing=true;bgmVol();u.onend=function(){next();};u.onerror=function(){next();};window.speechSynthesis.speak(u);}catch(e){setTimeout(next,300);}}
