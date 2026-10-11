# 引き継ぎ：AivisSpeech の声を聞き比べページに足す

この作業は「ことばのたね」（小1向けの、場面に合う言葉を練習するiPadゲーム）の声を人間らしくする取り組みの続き。
前の作業では、ネットワーク制限で AivisHub / Hugging Face に届かず、AivisSpeech を試せなかった。
この作業はネットワーク「フル」の環境で動かすこと。

依頼者は あまねさん（文字入力が苦手。URLやコマンドを手で打たせない。報告は日本語で、短く）。

## ゴール

聞き比べページ https://amane1234567jp-crypto.github.io/kotoba-tane/listen/ に、
4つ目の列「AivisSpeech」として、同じ 38 本のセリフの声を追加して公開する。
**ゲーム本体（index.html）や音声は変更しない。** 選んでもらうまでは聞き比べページだけ。

## 材料（このリポジトリ内）

- `tools/listen/lines.json` … 38 本のセリフ。`key`（ファイル名）, `who`（キャラ）, `name`, `mood`（気持ち）, `text`
- `tools/listen/page.html` … ページのひな形。`tools/listen/build_page.py` で `listen/index.html` を作る。
  `listen/a/aivis/<key>.mp3` が 38 本そろうと、自動で AivisSpeech 列が有効になる（4列をかくしてシャッフルにも対応済み）
- `tools/listen/gen_listen.py` … VOICEVOX 側の作り方（参考）。`hq_post()` が「高音質」列の後処理（軽い部屋の響き＋EQ＋loudnorm I=-17, mp3 112k/48kHz/モノラル）
- `tools/sit/sits.json` … 30 場面の台本全体。`tools/sit/fix.json` … VOICEVOX 用アクセント修正（AivisSpeech では使えない）
- `listen/a/now|tuned|hq/` … 既存の3列の音声

## キャラと声の方向（いまの VOICEVOX の配役）

| who | 役 | いまの声 | 方向性 |
|---|---|---|---|
| metan | ぽにー（ナビ・おてほん） | 四国めたん | 明るくやさしいお姉さん。子どもがまねするお手本なので、はっきり・ゆっくりめ |
| meebaa | めえばあ（ほけんの先生） | 東北イタコ | やさしい年配の女の先生 |
| kamejii | かめじい（校長先生） | ちび式じい | おじいさん。「ほっほ」 |
| gao | がお（ライバル） | 玄野武宏 | やんちゃで乱暴ぎみの男の子 |
| chu | ちゅう | 白上虎太郎 | 気弱でびくびくした男の子 |
| doshin | どしん | 麒ヶ島宗麟 | 体が大きく、おっとり低い声 |
| pyon | ぴょん | 満別花丸 | 元気いっぱいの女の子 |
| mii | みい | 九州そら | しっかり者で少し生意気な女の子 |
| nobbo | のっぽ（としょの先生） | 剣崎雌雄 | ていねいな大人の男性 |

## 手順

1. **AivisSpeech Engine を動かす**（Linux, CPU）
   - GitHub の Aivis-Project/AivisSpeech-Engine の Releases にある Linux 版を使うか、README に従ってソースから起動。ポート 10101。
   - 初回起動で BERT モデル（Hugging Face）と既定の声モデル（AivisHub）を取りにいく。
2. **声モデルを選んで入れる**
   - AivisHub（hub.aivis-project.com / API: api.aivis-project.com）で、上の配役に合う声を探す。
   - **ライセンスを1本ずつ確認**：商用利用可（ACML 1.0 や CC0 など）を優先。非商用限定・クレジット不明のものは避ける。
   - Engine の API（`/aivm_models/install` など）でインストール。
   - 9キャラそれぞれに声（とスタイル）を割り当てる。`mood` に合うスタイルがあれば使う。
3. **38 本を合成する**
   - `/audio_query` → `/synthesis`。テキストは分かち書きの空白を取り除いてから渡す（「、」「。」は残す）。
   - 話速・抑揚は、聞いて不自然にならない範囲で調整。お手本（metan）は速すぎないように。
   - 後処理は既存の「高音質」列とそろえる（`gen_listen.py` の `hq_post()` を流用。音量は loudnorm I=-17 でそろえる）。
   - 出力：`listen/a/aivis/<key>.mp3`（`lines.json` の key と同名）。
4. **ページを作り直す**：`python3 tools/listen/build_page.py`（HAS_AIVIS = True と出ればOK）
5. **確認**
   - 38 本すべてあるか、長さが極端でないか、無音・音割れがないか。
   - 読み間違い（漢字の読みではなく、ひらがな文の区切り違い）がないか、可能なら音声認識で確認。
   - ページをブラウザで開いて JS エラーがないこと。
6. **README.md のクレジット**に、使った AivisSpeech の声モデル名・作者・ライセンスを追記。
7. **コミットして main に push**（GitHub Pages に反映）。コミットは `-c user.name=amane1234567jp-crypto -c user.email=amane1234567jp@gmail.com`。
8. **あまねさんへの報告**：どのキャラにどの声を選んだか（とライセンス）を短く。iPad で同じページを開き直す（QRは前と同じ）よう伝え、「けっかをコピー」を貼ってもらう。

## そのあと（あまねさんが選んでから）

選ばれた方式で、ゲームの全セリフ（約350本: sq/sr 各30, sa 120, sg 100, sx 37, sw 17, ぽにーの案内 board/audio）を作り直して組み込む。
ゲーム一式は `tools/game/` にある（`tools/README.md` 参照）。音声を差し替えたら `python3 tools/game/make_index.py` で index.html を作り直す。
