import asyncio, json
from playwright.async_api import async_playwright
S=json.load(open("sit/sits.json"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"]); pg = await b.new_page()
        await pg.add_init_script("delete window.webkitSpeechRecognition;")
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file:///tmp/claude-0/-home-claude/ac928818-493a-5912-8719-b50ed5650b98/scratchpad/board/board_demo.html")
        await pg.evaluate("()=>{document.getElementById('startBox').remove(); audio(); speak = async()=>{}; speakPart = async()=>{};}")
        bad=[]
        for s in S:
            for mode in (["c","g"] if s["gaoOk"] else ["c"]):
                lv = 9 if mode=="g" else 3
                await pg.evaluate(f"()=>{{ E.L={lv}; E.h=1; pickSit=()=>SITS.find(x=>x.id==='{s['id']}'); Math.random=()=>0.1; window.__done=false; ({'gaoSit(\"0\")' if mode=='g' else 'runSit(\"x\")'}).then(()=>window.__done=true, e=>window.__done='ERR '+e); }}")
                for i in range(200):
                    await pg.wait_for_timeout(150)
                    d = await pg.evaluate("window.__done")
                    if d: break
                    if await pg.locator("#d-ok:not([disabled])").count(): await pg.click("#d-ok")
                if d is not True: bad.append((s["id"],mode,d))
        print("bad", bad); print("errs", errs[:5]); await b.close()
asyncio.run(main())
