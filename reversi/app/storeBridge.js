/* WebView の localStorage を アプリ側（ファイル）にも控えておく仕組み。
   端末の中のサーバーの番号（ポート）が変わると、WebView の保存場所（オリジン）が変わり、
   名前・とうろくした ひと・設定・端末の番号が すべて見えなくなる（1.0.3 までの不具合）。
   そこで：
   ・ページが localStorage に書くたびに、中身ぜんぶを殻へ送る（{t:"store", data}）→ 殻がファイルに保存
   ・ページを開くとき（ゲームのスクリプトより先）に、控えのうち まだ無いキーを localStorage に戻す
   この関数は「ページに注入する JavaScript の文字列」を作るだけの純関数（node から検算する：tests/store-bridge.js） */
function storeScript(snapshot) {
  const snap = JSON.stringify(snapshot && typeof snapshot === "object" ? snapshot : {});
  return `(function(){try{
var S=window.localStorage, P=Storage.prototype, os=P.setItem, orm=P.removeItem, ocl=P.clear;
var snap=${snap};
for (var k in snap) { if (Object.prototype.hasOwnProperty.call(snap,k) && S.getItem(k)===null && typeof snap[k]==="string") { try{ os.call(S,k,snap[k]); }catch(e){} } }
var t=0;
function dump(){ var o={}; for (var i=0;i<S.length;i++){ var key=S.key(i); o[key]=S.getItem(key); } return o; }
function flush(){ clearTimeout(t); t=0; try{ if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({t:"store",data:dump()})); }catch(e){} }
function later(){ clearTimeout(t); t=setTimeout(flush,250); }
P.setItem=function(k,v){ os.call(this,k,v); if(this===S) later(); };
P.removeItem=function(k){ orm.call(this,k); if(this===S) later(); };
P.clear=function(){ ocl.call(this); if(this===S) later(); };
addEventListener("pagehide",function(){ if(t) flush(); });
document.addEventListener("visibilitychange",function(){ if(document.visibilityState==="hidden" && t) flush(); });
}catch(e){}})();`;
}

module.exports = { storeScript };
