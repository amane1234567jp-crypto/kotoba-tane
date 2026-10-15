var WD=window.WORLD||{maps:[],mobs:[]}, MAPS=WD.maps, MOBS=WD.mobs;
var EGG_GOAL=10;   // 10回かいたら うまれる
var ORDER=[]; MAPS.forEach(function(m){Array.from(m.kanji||'').forEach(function(g){ORDER.push(g);});});

// ---------- 保存 ----------
var KEY='kanjiboken.v3';
var S0={born:{},writes:{},lv:{},egg:{},stars:0,beaten:0,miss:{},map:0,pos:null,tut:0,mb:{},bossHp:{},cleared:{},seen:{},ending:false};
var S=JSON.parse(JSON.stringify(S0));
function load(){try{var t=localStorage.getItem(KEY);if(t){var o=JSON.parse(t);for(var k in o)S[k]=o[k];}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function today(){var d=new Date();return d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();}
load();
