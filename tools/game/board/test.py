import asyncio, random, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg = await b.new_page(viewport={"width":1200,"height":1100})
        if len(sys.argv)>2: await pg.add_init_script("delete window.webkitSpeechRecognition; delete window.SpeechRecognition;")
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
        await pg.goto("file:///tmp/claude-0/-home-claude/ac928818-493a-5912-8719-b50ed5650b98/scratchpad/board/board_demo.html")
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path="board/s0.png")
        await pg.click("#startBtn")
        shots={"scene":0,"board":0}; t=0; random.seed(int(sys.argv[1]) if len(sys.argv)>1 else 1)
        gs=0
        while t<2500:
            t+=1; await pg.wait_for_timeout(400)
            if await pg.locator(".again").count(): break
            if gs<2 and await pg.evaluate("view==='scene' && doer!==null"):
                await pg.wait_for_timeout(1500); await pg.screenshot(path=f'board/g{gs}.png'); gs+=1
            if await pg.locator("#dice:not([disabled])").count():
                if shots["board"]<2: await pg.screenshot(path=f"board/b{shots['board']}.png"); shots["board"]+=1
                await pg.click("#dice", force=True); continue
            if await pg.locator(".arrow").count(): await pg.locator(".arrow").first.click(force=True); continue
            if await pg.locator("#d-ok:not([disabled])").count():
                v = await pg.evaluate("view")
                if v=="scene" and shots["scene"]<3: await pg.screenshot(path=f"board/c{shots['scene']}.png"); shots["scene"]+=1
                r=random.random() if len(sys.argv)<3 else 0; await pg.click("#d-ok" if r<.7 else "#d-part" if r<.85 else "#d-none")
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path="board/end.png")
        print("steps",t,"engine",await pg.inner_text("#engine"),"sr",await pg.inner_text("#srState"))
        print("errors",errs[:5])
        await b.close()
asyncio.run(main())
