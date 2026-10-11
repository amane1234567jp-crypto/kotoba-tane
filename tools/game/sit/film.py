import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
IDS = sys.argv[1].split(",")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"]); pg = await b.new_page(viewport={"width":1000,"height":800})
        await pg.add_init_script("delete window.webkitSpeechRecognition;")
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file:///tmp/claude-0/-home-claude/ac928818-493a-5912-8719-b50ed5650b98/scratchpad/board/board_demo.html")
        await pg.evaluate("()=>{document.getElementById('startBox').remove(); audio();}")
        for sid in IDS:
            gao = sid.startswith("g:"); sid2 = sid[2:] if gao else sid
            await pg.evaluate(f"()=>{{ E.L=5; E.h=1; pickSit=()=>SITS.find(s=>s.id==='{sid2}'); window.__done=false; ({'gaoSit(\"0\")' if gao else 'runSit(\"x\")'}).then(()=>window.__done=true); }}")
            frames=[]
            for i in range(int(sys.argv[2]) if len(sys.argv)>2 else 40):
                await pg.wait_for_timeout(330)
                if await pg.evaluate("window.__done"): break
                if await pg.locator("#d-ok:not([disabled])").count(): await pg.click("#d-ok")
                if i % (2 if len(sys.argv)>2 else 1) == 0 and len(frames) < 24:
                    await pg.locator("#stage").screenshot(path="sit/_f.png"); frames.append(Image.open("sit/_f.png").resize((240,150)))
            while not await pg.evaluate("window.__done"):
                await pg.wait_for_timeout(300)
                if await pg.locator("#d-ok:not([disabled])").count(): await pg.click("#d-ok")
            W=Image.new("RGB",(240*6,150*4),"white")
            for k,f in enumerate(frames): W.paste(f,((k%6)*240,(k//6)*150))
            W.save(f"sit/film_{sid2}{'_g' if gao else ''}.png")
        print(errs); await b.close()
asyncio.run(main())
