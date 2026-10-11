import asyncio, sys
from playwright.async_api import async_playwright
IDS = sys.argv[1].split(",")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"]); pg = await b.new_page(viewport={"width":1200,"height":900})
        await pg.add_init_script("delete window.webkitSpeechRecognition;")
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file:///tmp/claude-0/-home-claude/ac928818-493a-5912-8719-b50ed5650b98/scratchpad/board/board_demo.html")
        await pg.evaluate("()=>{document.getElementById('startBox').remove(); audio();}")
        for sid in IDS:
            gao = sid.startswith("g:"); sid2 = sid[2:] if gao else sid
            lv = int(sys.argv[2]) if len(sys.argv)>2 else 5
            await pg.evaluate(f"()=>{{ E.L={lv}; E.h=1; pickSit=()=>SITS.find(s=>s.id==='{sid2}'); window.__done=false; Math.random=(()=>{{let x=0.1;return()=>x}})(); ({'gaoSit(\"0\")' if gao else 'runSit(\"x\")'}).then(()=>window.__done=true); }}")
            shots=0
            for i in range(120):
                await pg.wait_for_timeout(250)
                if await pg.evaluate("window.__done"): break
                if await pg.locator("#d-ok:not([disabled])").count():
                    await pg.locator("#stage").screenshot(path=f"sit/s_{sid2}{'_g' if gao else ''}_listen.png"); await pg.click("#d-ok")
                if i in (14,) : await pg.locator("#stage").screenshot(path=f"sit/s_{sid2}{'_g' if gao else ''}_intro.png")
                if await pg.evaluate("!!document.querySelector('#scene g text') && [...hudLayer.querySelectorAll('text')].some(t=>t.getAttribute('font-size')=='52' && t.closest('g').getAttribute('opacity')!=='0')") and shots==0:
                    await pg.wait_for_timeout(300); await pg.locator("#stage").screenshot(path=f"sit/s_{sid2}{'_g' if gao else ''}_word.png"); shots=1
        print(errs)
        await b.close()
asyncio.run(main())
