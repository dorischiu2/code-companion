// Solves missions on every non-Roblox track via the engines and checks the tutor completes them.
export default async function (page, ok) {
  const run = (id, src, ms) => page.evaluate(async ([id, src, ms]) => {
    startMission(id); const E = ccDebug.engine(); const R = ccDebug.runner();
    const sleep = (t) => new Promise((r) => setTimeout(r, t));
    const until = async (f, t) => { const s = Date.now(); while (Date.now() - s < (t || 15000)) { if (f()) return true; await sleep(100); } return false; };
    const next = async () => { const i = R.i; await until(() => R.i !== i || R.done, ms || 15000); const b = document.querySelector(".tb-stay"); if (b) b.click(); await sleep(200); };
    const S = (list) => { E.script = list.map(([k, a]) => E.mk(k, a)); E.cursor = E.script.length; E.renderScript(); E.emit("block", { k: "t" }); };
    const py = async (code) => { E.ta.value = code; E.ta.dispatchEvent(new Event("input")); await E.run(); };
    const web = async (tab, code) => { E.setTab(tab); E.ta.value = code; E.ta.dispatchEvent(new Event("input")); await sleep(1200); };
    const click = (sel, n) => { const d = E.doc(); for (let i = 0; i < (n || 1); i++) d.querySelector(sel).click(); };
    try { await (new Function("E", "R", "S", "py", "web", "click", "sleep", "until", "next", "return (async()=>{" + src + "})()"))(E, R, S, py, web, click, sleep, until, next); } catch (e) { return "ERR " + e; }
    await until(() => R.done, 4000); return R.done ? "done" : "stuck at step " + R.i + ": " + document.querySelector("#bubble").textContent.slice(0, 90);
  }, [id, src, ms]);
  const C = {
    "sc-walk": `E.add("move"); await next(); await E.run("flag"); await next(); E.script[1].arg=200; await E.run("flag");`,
    "sc-square": `E.add("repeat"); await next(); S([["flag"],["repeat",4],["move",100],["turn",90],["end"]]); await E.run("flag"); await next(); S([["flag"],["repeat",3],["move",100],["turn",120],["end"]]); await E.run("flag");`,
    "sc-click": `E.add("click"); await next(); E.add("costume"); await E.run("click"); await next(); E.add("say"); E.add("grow"); await E.run("click");`,
    "sc-star": `S([["flag"],["move",300],["turn",-90],["move",210]]); await E.run("flag"); await next(); S([["flag"],["goto","140 100"],["say","Yay"]]); await E.run("flag");`,
    "sj-loop": `S([["flag"],["repeat",7],["move",1],["end"]]); await E.run("flag"); await next(); E.add("say"); await E.run("flag");`,
    "hs-draw": `S([["flag"],["pen"],["move",100]]); await E.run("flag"); await next(); S([["flag"],["pen"],["repeat",3],["move",120],["turn",120],["end"]]); await E.run("flag"); await next(); E.add("color"); await E.run("flag");`,
    "ai-counter": `E.addRule("Button1.Click"); E.addAct({set:"Label1",kind:"inc"}); await next(); for(let i=0;i<5;i++) E.fire("Button1.Click"); await next(); E.addAct({set:"Label1",kind:"bg",val:"#fde047"}); E.fire("Button1.Click");`,
    "py-if": `await until(()=>E.ready,60000); await py('password = "dragon"\\nif password == "dragon":\\n    print("Door opens!")'); await next(); await py('password = "cat"\\nif password == "dragon":\\n    print("x")\\nelse:\\n    print("Wrong password!")'); await next(); await py('age = 11\\nif age >= 13:\\n    print("Teen!")\\nelse:\\n    print("Kid!")');`,
    "py-loop": `await py('for i in range(3):\\n    print("Hip hip hooray!")'); await next(); await py('for n in range(10, 0, -1):\\n    print(n)\\nprint("Liftoff!")');`,
    "hc-style": `await web("css","h1 { color: purple; font-size: 50px }\\n.card { background: lightyellow; padding: 20px; border-radius: 20px; }"); await next(); await next();`,
    "js-counter": `await web("js",'let score=0;const label=document.querySelector("#score");document.querySelector("#tap").addEventListener("click",()=>{score=score+1;label.textContent=score;if(score>=10){label.textContent="You win!"}});'); click("#tap",5); await next(); click("#tap",5);`,
    "js-if": `await web("js",'document.querySelector("#check").addEventListener("click",()=>{const pw=document.querySelector("#pw").value;const result=document.querySelector("#result");if(pw.length>=8){result.textContent="Strong"}else{result.textContent="Too short"}});');`,
    "fs-fetch": `await sleep(800); click("#go"); await next(); E.insert(E.cfg.snippets[0].code); await sleep(1300); click("#go"); await sleep(800);`,
    "fs-post": `await sleep(800); E.insert(E.cfg.snippets[0].code); await sleep(1300); E.doc().querySelector("#task").value="Feed cat"; click("#add"); await next(); await sleep(800);`,
    "un-physics": `const c=E.find("Crate"); E.setProp(c,"Anchored",false,false); E.play(); await until(()=>!E.playing,15000);`,
    "ca-ship": `await web("html",'<h1>My Arcade</h1><button id="play">Play</button><p id="out"></p>'); await web("css","body{background:#fef}\\nbutton{padding:10px}\\nh1{color:red}"); await web("js",'let n=0;document.querySelector("#play").onclick=()=>{n++;document.querySelector("#out").textContent=n;if(n>3){document.body.style.background="gold"}};'); document.querySelector(".tb-review").click();`
  };
  for (const [id, src] of Object.entries(C)) { const r = await run(id, src, id.startsWith("py") ? 70000 : 15000); ok("solve " + id, r === "done", r); }
  // screenshot a Scratch mission mid-way
  await page.evaluate(() => startMission("sc-square"));
  await page.evaluate(async () => { const E = ccDebug.engine(); E.add("repeat"); await new Promise(r=>setTimeout(r,1600)); E.script = [["flag"],["repeat",4],["move",100],["turn",90],["end"]].map(([k,a])=>E.mk(k,a)); E.renderScript(); E.run("flag"); });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: "/workspace/cc-scratch-mission.png" });
  ok("scratch screenshot saved", true);
}
