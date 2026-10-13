// Solves each Roblox mission through the engine API and checks the tutor reaches completion.
export default async function (page, ok) {
  const run = (id, fn) => page.evaluate(async ([id, src]) => {
    startMission(id); const E = ccDebug.engine(); const R = ccDebug.runner();
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const until = async (f, ms) => { const t = Date.now(); while (Date.now() - t < (ms || 12000)) { if (f()) return true; await sleep(100); } return false; };
    const place = (x, y, w) => { const p = E.insertPart("part"); p.x = x; p.y = y; if (w) p.w = w; E.emit("move", { part: p }); return p; };
    const playWait = async (type) => { const n = R.log.length; E.play(); await until(() => R.log.slice(n).some((e) => e.type === type || e.type === "stop"), 15000); await until(() => !E.playing, 5000); await sleep(1500); };
    const setCode = (c) => { E.ta.value = c; E.emit("code", { code: c }); };
    const step = async () => { const i = R.i; await until(() => R.i !== i || R.done || R.pending, 3000); await sleep(1500); };
    const fly = () => { const b = document.querySelector(".tb-stay"); if (b) b.click(); };
    try { await (new Function("E", "R", "place", "playWait", "setCode", "sleep", "until", "fly", "return (async()=>{" + src + "})()"))(E, R, place, playWait, setCode, sleep, until, fly); } catch (e) { return "ERR " + e; }
    await sleep(1900); return R.done ? "done" : "stuck at step " + R.i + ": " + document.querySelector("#bubble").textContent.slice(0, 80);
  }, [id, fn]);
  const cases = {
    rb2: `place(10.5,3); place(17.5,3); await sleep(1600); fly(); await playWait("win"); fly(); E.userParts().forEach(p=>E.setProp(p,"Anchored",true,false)); await playWait("win"); fly(); await sleep(300); E.setProp(E.userParts()[0],"Color","#ff0000",false);`,
    rb3: `E.setTool("scale"); await sleep(1600); fly(); const p=place(10,5.5); p.w=8; E.emit("scale",{part:p}); await sleep(1600); fly(); E.setTool("rotate"); E.emit("rotate",{part:p}); await sleep(1600); fly(); p.w=5; p.x=10; p.y=5.5; place(18,7.5,8); await playWait("win");`,
    rb4: `place(10,4); place(16,4.5); place(22,5); await sleep(1600); fly(); await playWait("win"); fly(); const b=E.insertPart("sphere"); b.x=13; b.y=5; b.w=b.h=1; E.emit("move",{part:b}); await playWait("win");`,
    rb5: `E.insertCode("platform.Color = Color3.new(1, 0, 0)"); await sleep(1600); fly(); await playWait("scriptRan"); fly(); setCode("local platform = workspace.Platform\\nplatform.Color = Color3.new(0, 0, 1)"); await playWait("win"); fly(); setCode('print("I can code")'); await playWait("print");`,
    rb6: `await playWait("win"); fly(); E.insertCode("humanoid.Health = 0"); await playWait("died"); fly(); place(11.5,3); await playWait("win");`,
    rb7: `E.insertCode("wait(0.3)"); E.insertCode("platform.Transparency = 1"); E.insertCode("platform.CanCollide = false"); await playWait("fell"); fly(); setCode(E.getCode().replace("wait(0.3)","wait(1)")); await playWait("win");`,
    rb8: `["part.Transparency = 1","wait(1)","part.Transparency = 0","wait(1)"].forEach(c=>E.insertCode(c)); E.play(); await sleep(2500); E.stop("t"); await sleep(1600); fly(); setCode(E.getCode().replace("while true do","for i = 1, 3 do")); E.play(); await sleep(2500); E.stop("t");`,
    rb9: `await playWait("fell"); fly(); const c=E.insertPart("checkpoint"); c.x=19.5; c.y=6; E.emit("move",{part:c}); await sleep(1600); fly(); E.play(); await until(()=>R.i===3||R.pending,15000); await until(()=>!E.playing,8000); await sleep(1600); fly(); const l=E.find("LastStep"); l.x=24.5; E.emit("move",{part:l}); await playWait("win");`,
    rb10: `E.insertCode("player.leaderstats.Coins.Value += 1"); await playWait("win"); fly(); E.insertCode("coin:Destroy()"); await playWait("win");`,
    rbcap: `place(9,4); place(14,5); place(19,6); place(24,7); place(3,10); await playWait("win"); await sleep(500); document.querySelector(".tb-review").click(); await sleep(200);`
  };
  for (const [id, src] of Object.entries(cases)) { const r = await run(id, src); ok("solve " + id, r === "done", r); }
  const fb = await page.textContent(".st-feedback"); ok("capstone review shows strengths + Studio checklist", /Strengths/.test(fb) && /Roblox Studio/.test(fb));
}
