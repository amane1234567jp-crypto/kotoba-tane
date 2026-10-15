// てき：漢字の いみで つよい・よわいが きまる（まおうには どの 字も つよい）
var MAOU=12;
function strongIn(t,g){return t===MAOU||MOBS[t].weak.indexOf(g)>=0;}
function strongAgainst(g){var r=[];MOBS.forEach(function(m,i){if(i!==MAOU&&m.weak.indexOf(g)>=0)r.push(m.name);});return r;}
function mobSVG(t,boss){
  var m=MOBS[t%MOBS.length], d='', ink=INK;
  if(m.deco==='maou')return maouSVG(false);
  var body, eyes='<ellipse cx="62" cy="96" rx="9" ry="12" fill="#fff" stroke="'+ink+'" stroke-width="3"/><ellipse cx="98" cy="96" rx="9" ry="12" fill="#fff" stroke="'+ink+'" stroke-width="3"/><ellipse cx="64" cy="99" rx="5" ry="7" fill="'+ink+'"/><ellipse cx="96" cy="99" rx="5" ry="7" fill="'+ink+'"/>';
  var brow='<path d="M50,82 L70,88 M110,82 L90,88" stroke="'+ink+'" stroke-width="'+(boss?6:4)+'" stroke-linecap="round"/>';
  var mouth='<path d="M70,118 Q80,126 90,118" fill="none" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>';
  if(m.deco==='drop')d='<path d="M80,14 C70,30 66,40 80,46 C94,40 90,30 80,14 Z" fill="'+m.col+'" stroke="'+ink+'" stroke-width="4"/>';
  if(m.deco==='flame')d='<path d="M80,10 C96,28 98,40 80,52 C62,40 64,28 80,10 Z" fill="#ffd23f" stroke="'+ink+'" stroke-width="4"/>';
  if(m.deco==='leaf')d='<path d="M80,50 Q60,30 70,14 Q92,24 80,50 Z" fill="#5fb860" stroke="'+ink+'" stroke-width="4"/>';
  if(m.deco==='rock')d='<path d="M44,70 l12,-10 l10,8 M108,64 l10,6 l-4,12" fill="none" stroke="#6b665e" stroke-width="5" stroke-linecap="round"/>';
  if(m.deco==='swirl')d='<path d="M60,30 q20,-14 34,0 q10,12 -4,18 q-12,4 -10,-6" fill="none" stroke="#7fa8d0" stroke-width="5" stroke-linecap="round"/>';
  if(m.deco==='ice')d='<path d="M56,52 L62,26 L70,50 L80,16 L90,50 L98,26 L104,52 Z" fill="#e8f8ff" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>';
  if(m.deco==='sleep'){d='<path d="M44,62 Q70,30 112,16 Q108,44 116,62 Z" fill="#7a9ae0" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><circle cx="114" cy="16" r="8" fill="#fff" stroke="'+ink+'" stroke-width="3"/><text x="128" y="58" font-size="22" font-weight="900" fill="'+ink+'" font-family="Zen Maru Gothic,sans-serif">z</text><text x="140" y="40" font-size="16" font-weight="900" fill="'+ink+'" font-family="Zen Maru Gothic,sans-serif">z</text>';
    eyes='<path d="M52,98 Q62,106 72,98 M88,98 Q98,106 108,98" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';brow='';mouth='<ellipse cx="80" cy="120" rx="7" ry="5" fill="#c04a6a" stroke="'+ink+'" stroke-width="3"/>';}
  if(m.deco==='letter'){d='<text x="30" y="40" font-size="26" font-weight="900" fill="'+ink+'" font-family="Zen Maru Gothic,sans-serif">あ</text><text x="110" y="34" font-size="24" font-weight="900" fill="'+ink+'" font-family="Zen Maru Gothic,sans-serif">い</text><text x="74" y="22" font-size="20" font-weight="900" fill="'+ink+'" font-family="Zen Maru Gothic,sans-serif">う</text>';
    mouth='<path d="M58,112 Q80,140 102,112 Z" fill="#c04a4a" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M66,112 L70,120 L74,112 M86,112 L90,120 L94,112" fill="#fff" stroke="'+ink+'" stroke-width="2"/>';}
  if(m.deco==='question')d='<text x="80" y="42" text-anchor="middle" font-size="44" font-weight="900" fill="#ff7a59" stroke="'+ink+'" stroke-width="2" font-family="Zen Maru Gothic,sans-serif">？</text>';
  if(m.deco==='paint'){d='<circle cx="40" cy="58" r="7" fill="#e04a4a" stroke="'+ink+'" stroke-width="3"/><circle cx="120" cy="56" r="7" fill="#3b6fd9" stroke="'+ink+'" stroke-width="3"/><circle cx="80" cy="30" r="7" fill="#fff" stroke="'+ink+'" stroke-width="3"/>';
    brow='<rect x="40" y="84" width="80" height="18" rx="8" fill="'+ink+'" opacity=".85"/>';}
  if(m.deco==='crow'){
    body='<path d="M26,104 Q16,80 40,84 L46,100 Z M134,104 Q144,80 120,84 L114,100 Z" fill="'+m.col+'" stroke="'+ink+'" stroke-width="5" stroke-linejoin="round"/><ellipse cx="80" cy="100" rx="48" ry="44" fill="'+m.col+'" stroke="'+ink+'" stroke-width="5"/><path d="M68,112 L80,132 L92,112 Z" fill="#ffd23f" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M60,54 Q70,40 80,56 Q88,40 98,52" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
    mouth='';eyes=eyes.replace(/fill="#fff"/g,'fill="#fff"');
  }else if(m.deco==='ghost')body='<path d="M24,140 L24,96 C24,62 50,42 80,42 C110,42 136,62 136,96 L136,140 L118,128 L100,140 L80,128 L60,140 L42,128 Z" fill="'+m.col+'" stroke="'+ink+'" stroke-width="5" stroke-linejoin="round"/>';
  else body='<path d="M20,140 C14,90 46,46 80,46 C114,46 146,90 140,140 Z" fill="'+m.col+'" stroke="'+ink+'" stroke-width="5" stroke-linejoin="round"/><path d="M20,140 C14,90 46,46 80,46 L80,140 Z" fill="'+m.col2+'" opacity=".35"/>';
  var crown=boss?'<g transform="translate(52,-2) rotate(16) scale(.66)"><path d="M54,52 L50,22 L66,38 L80,14 L94,38 L110,22 L106,52 Z" fill="#ffd23f" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><circle cx="80" cy="40" r="5" fill="#e04a4a"/></g>':'';
  return body+d+crown+eyes+brow+mouth+'<ellipse cx="46" cy="70" rx="8" ry="5" fill="#fff" opacity=".6"/>';
}
