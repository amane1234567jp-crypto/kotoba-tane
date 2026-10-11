import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"]); pg = await b.new_page()
        await pg.add_init_script("delete window.webkitSpeechRecognition;")
        pg.on("pageerror", lambda e: print("ERR", e)); pg.on("console", lambda m: m.type=="error" and print("CON", m.text))
        await pg.goto("file:///tmp/claude-0/-home-claude/ac928818-493a-5912-8719-b50ed5650b98/scratchpad/board/board_demo.html")
        await pg.evaluate("()=>{document.getElementById('startBox').remove(); audio();}")
        sid=sys.argv[1]
        await pg.evaluate(f"()=>{{ E.L=5; E.h=1; pickSit=()=>SITS.find(s=>s.id==='{sid}'); window.__done=false; runSit('x').then(()=>window.__done=true, e=>{{window.__done='ERR '+e.stack}}); }}")
        for i in range(120):
            await pg.wait_for_timeout(300)
            d = await pg.evaluate("window.__done")
            if d: print("done", d); break
            if await pg.locator("#d-ok:not([disabled])").count(): await pg.click("#d-ok")
        else: print("TIMEOUT", await pg.inner_text("#engine"))
        await b.close()
asyncio.run(main())
