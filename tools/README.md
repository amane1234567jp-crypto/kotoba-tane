# tools — ことばのたね の作業一式

| 場所 | 中身 |
|---|---|
| `HANDOFF_AIVIS.md` | 次の作業への引き継ぎ（AivisSpeech の声を聞き比べページに足す） |
| `listen/` | 聞き比べページのひな形・セリフ一覧・作り直し用スクリプト（`build_page.py`） |
| `game/` | ゲーム本体の組み立て一式。`python3 tools/game/make_index.py` で直下の `index.html` を作り直す |
| `game/board/` | すごろく・HUD・音（`game.js`）、場面アニメ（`sit.js`）、殻HTML、ナビ音声 `audio/`、効果音・BGM `sfx/` |
| `game/sit/` | 30 場面の台本（`sits.py` → `sits.json`）、VOICEVOX 合成（`gen.py`）、アクセント修正（`fix.json`）、場面音声 `audio/` |
| `game/rig/`, `game/kousha/` | キャラの部品・動き・音、校舎の背景データ |
| `sit/` | 台本と合成スクリプトの写し（`listen/gen_listen.py` が参照） |

音声合成（`gen.py` 系）には VOICEVOX core 0.17 が必要（`vv/` に wheel・onnxruntime・辞書・`vvmrepo`（VOICEVOX/voicevox_vvm）を置く）。これらはリポジトリに入れていない。
