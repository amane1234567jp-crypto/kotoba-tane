import json, base64, re
from pathlib import Path
R = Path(".")
fd = (R/"rig/friends_demo.html").read_text()
i = fd.index("const AUD = ") + len("const AUD = "); j = fd.index(";\n", i)
AUD = json.loads(fd[i:j])
AUD = {k: AUD[k] for k in ["shima", "doshin", "kamejii", "gao"]}
b64 = lambda p: "data:audio/mpeg;base64," + base64.b64encode(p.read_bytes()).decode()
for p in sorted((R/"board/audio").glob("*.mp3")): AUD[p.stem] = b64(p)
for k in ["k13_main", "k16_main"]: AUD[k] = b64(R/"kousha/audio"/(k + ".mp3"))
for p in sorted((R/"sit/audio").glob("*.mp3")): AUD[p.stem] = b64(p)
for p in sorted((R/"board/sfx").glob("*.mp3")): AUD["sfx_" + p.stem] = b64(p)
AUD["sfx_bgm"] = "data:audio/wav;base64," + base64.b64encode((R/"board/sfx/bgm.wav").read_bytes()).decode()
shell = (R/"board/board_shell.html").read_text()
rep = {"__AUDIO__": json.dumps(AUD), "__SCENES__": (R/"kousha/scenes.json").read_text(), "__KEYS__": (R/"board/keys.json").read_text(),
 "__CHARS__": (R/"rig/part_chars.js").read_text(), "__SOUND__": (R/"rig/part_sound.js").read_text(), "__MOVES__": (R/"rig/part_moves.js").read_text(), "__GAME__": (R/"board/game.js").read_text(), "__SIT__": (R/"board/more_data.js").read_text() + "\n" + (R/"board/sit.js").read_text() + "\n" + (R/"board/stages.js").read_text() + "\n" + (R/"board/multi.js").read_text() + "\n" + (R/"board/boards.js").read_text() + "\n" + (R/"board/gakkou2.js").read_text() + "\n" + (R/"board/long_data.js").read_text() + "\n" + (R/"board/long.js").read_text() + "\n" + (R/"board/long_fun.js").read_text() + "\n" + (R/"board/stages3.js").read_text() + "\n" + (R/"board/stages4.js").read_text() + "\n" + (R/"board/stages5.js").read_text() + "\n" + (R/"board/stages6.js").read_text() + "\n" + (R/"board/stages7.js").read_text() + "\n" + (R/"board/stages8.js").read_text() + "\n" + (R/"board/komatta_data.js").read_text() + "\n" + (R/"board/stages9.js").read_text() + "\n" + (R/"board/stages10.js").read_text() + "\n" + (R/"board/tokei.js").read_text() + "\n" + (R/"board/sansu_data.js").read_text() + "\n" + (R/"board/sansu.js").read_text() + "\n" + (R/"board/ltomo_data.js").read_text() + "\n" + (R/"board/ltomo.js").read_text() + "\n" + (R/"board/slong.js").read_text() + "\n" + (R/"board/eki.js").read_text() + "\n" + (R/"board/odekake.js").read_text() + "\n" + (R/"board/odekake2.js").read_text() + "\n" + (R/"board/kimochi_data.js").read_text() + "\n" + (R/"board/kimochi.js").read_text() + "\n" + (R/"board/makete_data.js").read_text() + "\n" + (R/"board/dekigoto_data.js").read_text() + "\n" + (R/"board/makete.js").read_text() + "\n" + (R/"board/jugyou_data.js").read_text() + "\n" + (R/"board/jugyou.js").read_text() + "\n" + (R/"board/souzou_data.js").read_text() + "\n" + (R/"board/tachiba_data.js").read_text() + "\n" + (R/"board/sakiyomi_data.js").read_text() + "\n" + (R/"board/chotto_data.js").read_text() + "\n" + (R/"board/aite_data.js").read_text() + "\n" + (R/"board/stages11.js").read_text() + "\n" + (R/"board/stages12.js").read_text() + "\n" + (R/"board/manekko_data.js").read_text() + "\n" + (R/"board/stages13.js").read_text() + "\n" + (R/"board/shapes_data.js").read_text() + "\n" + (R/"board/shapes.js").read_text() + "\n" + (R/"board/bgm_data.js").read_text() + "\n" + (R/"board/bgm.js").read_text() + "\n" + (R/"board/menu.js").read_text() + "\n" + (R/"board/forest.js").read_text() + "\n" + (R/"board/solo_long.js").read_text() + "\n" + (R/"board/pause.js").read_text() + "\n" + (R/"board/srfix.js").read_text() + "\n" + (R/"board/menu_genre.js").read_text() + "\n" + (R/"board/detarame_data.js").read_text() + "\n" + (R/"board/detarame.js").read_text() + "\n" + (R/"board/bgfit.js").read_text() + "\n" + (R/"board/dashboard.js").read_text() + "\n" + (R/"board/fixes1025.js").read_text(), "__SITS__": (R/"sit/sits.json").read_text()}
for k, v in rep.items(): shell = shell.replace(k, v, 1)
(R/"board/board_demo.html").write_text(shell)
js = shell[shell.index("<script>")+8: shell.rindex("</script>")]
(R/"board/check.js").write_text(js)
print(len(shell)/1e6, "MB", len(AUD))
