/* ================= 2026-10-29 の 直し：ロングの ライバルの 場面 =================
   ・ともだち ロング（ltomo）：ライバル（がお）に あう 場面が ltomo に なく、pickSit が undefined を かえして 止まって いた → こうしゃの 場面を つかう
   ・じゅぎょう・ちょうロング など：こうしゃの 場面を つかうが、こうしゃの パックは 読んで いないので、ページに 入って いる 場面（声が ある もの）だけ えらぶ（PICK_NEED_AUDIO） */
{ const ps = pickSit;
  pickSit = function (place, heroKind = "shima") {
    const sl = (typeof isSL === "function" && isSL()) || curStage === "ltomo" || curStage === "jugyou";
    if (!sl) return ps(place, heroKind);
    PICK_NEED_AUDIO = true;
    try { if (curStage === "ltomo") { curStage = "kousha"; try { return ps(place, heroKind); } finally { curStage = "ltomo"; } } return ps(place, heroKind); }
    finally { PICK_NEED_AUDIO = false; } }; }
