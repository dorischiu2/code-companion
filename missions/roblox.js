/* Roblox / Luau interactive missions (mini-Studio) */
(function () {
  const SPAWN = (o) => Object.assign({ kind: "spawn", name: "SpawnLocation", x: 3, y: 3, w: 6, h: 1, color: "#5b8def", locked: true }, o || {});
  const FINISH = (o) => Object.assign({ kind: "finish", name: "Finish", x: 22, y: 3, w: 6, h: 1, color: "#ffffff", locked: true }, o || {});
  const ev = (c, t) => c.ev && c.ev.type === t;
  const stepEvents = (c, t) => c.log.slice(c.since).filter((e) => e.type === t);
  const user = (c) => c.engine.userParts();
  const colorName = (h) => window.StudioUtil.colorName(h);

  function gapTalk(c) {
    const un = user(c).filter((p) => !p.anchored);
    if (un.length) return "Some parts aren't Anchored 🪂 so they fell. Tap them and switch ⚓ Anchored ON.";
    const g = c.engine.analyzeGaps();
    const big = g.gaps.find((x) => x.dist > 3.9);
    if (big) return "One jump is <b>" + big.dist.toFixed(1) + " studs</b> wide — your avatar can jump about <b>4</b>. Drag a part closer! ✋";
    const tall = g.gaps.find((x) => x.up > 3.5);
    if (tall) return "One step goes up <b>" + tall.up.toFixed(1) + " studs</b> — too high! Make the stairs smaller.";
    if (!g.reached) return "The path doesn't reach the 🏁 yet — add another part!";
    return "So close! Nudge your parts so the path is smooth.";
  }
  function reactPlay(c) {
    const e = c.ev;
    if (e.type === "partFell" && e.part && e.part.user) return "Whoa, your part fell! 🪂 It isn't <b>Anchored</b>. Tap it and turn ⚓ Anchored ON.";
    if (e.type === "fell") return "Oops — into the void! 💥 " + gapTalk(c);
    if (e.type === "died") return "💀 Your avatar's Health hit 0!";
    if (e.type === "timeout") return "Your avatar got stuck. ⏱️ Is something in the way?";
    return null;
  }
  function lastUserPart(c) { const u = user(c); return u[u.length - 1] || null; }
  async function demoPlace(c, x, y) {
    let p = lastUserPart(c);
    if (!p) p = c.engine.insertPart("part");
    c.engine.select(p);
    await c.engine.animateMoveTo(p, x, y, 1200);
  }
  const inZone = (p, z, tol) => Math.abs(p.x - z.x) <= (tol || 1.5) && Math.abs(p.y - z.y) <= 1.2;
  const propBy = (c, name, key, pred) => c.log.slice(c.since).some((e) => e.type === "prop" && e.byScript && e.part && e.part.name === name && e.key === key && (!pred || pred(e.value)));

  const M = {};

  M.rb1 = {
    track: "roblox", title: "Bridge the Gap", emoji: "🌉", kind: "studio", xpReward: 30, badge: "Bridge Builder",
    goal: "Place a Part so your avatar can reach the 🏁",
    setup: { parts: [SPAWN(), FINISH({ x: 19, w: 6 })], tools: ["part", "move"] },
    steps: [
      { say: "Hi, I'm <b>Byte</b> 🤖! Your avatar wants to reach the 🏁 flag, but there's a gap. Tap <b>🧱 Part</b> to make a block.",
        highlight: '[data-act="part"]', check: (c) => ev(c, "insert"),
        hints: ["Look at the top bar — the button with the 🧱 brick!"], praise: "A brand-new Part! ✨" },
      { say: "Now <b>drag</b> the Part into the glowing purple spot ✋", ghost: { x: 11, y: 3, w: 4, h: 1 },
        check: (c) => user(c).some((p) => inZone(p, { x: 11, y: 3 })),
        react: (c) => ev(c, "move") ? "Close! Drag it right into the purple glow 💜" : null,
        hints: ["Press on the grey block and slide your finger (or mouse) down to the glow.", "Tap 👀 Show me and I'll do it!"],
        demo: (c) => demoPlace(c, 11, 3), praise: "Perfect spot! 🎯" },
      { say: "Bridge built! Press <b>▶ Play</b> and watch your avatar run! 🏃", highlight: '[data-act="play"]',
        check: (c) => ev(c, "win"), react: reactPlay, hints: ["The green ▶ Play button is at the top right."],
        praise: "🏁 You made it across!" }
    ],
    finale: "You built your first bridge! Real Roblox games start just like this. 🧱"
  };

  M.rb2 = {
    track: "roblox", title: "Anchors Away", emoji: "⚓", kind: "studio", xpReward: 35, badge: "Anchor Ace",
    goal: "Learn why parts fall — and Anchor them",
    setup: { parts: [SPAWN(), FINISH({ x: 23, w: 6 })], tools: ["part", "move", "delete"], defaultAnchored: false },
    steps: [
      { say: "This gap needs <b>2 Parts</b>. Make two and drag them between the platforms. (Watch for the 🪂 sign…)",
        highlight: '[data-act="part"]', check: (c) => user(c).filter((p) => p.x > 6 && p.x < 21 && p.y > 1 && p.y < 6).length >= 2,
        ghost: { x: 14.5, y: 3, w: 11, h: 1, label: "Put 2 parts here" },
        demo: async (c) => { let u = user(c); while (u.length < 2) { c.engine.insertPart("part"); u = user(c); } await c.engine.animateMoveTo(u[0], 10.5, 3, 900); await c.engine.animateMoveTo(u[1], 17.5, 3, 900); },
        hints: ["Tap 🧱 Part twice, then drag each one into the gap."] },
      { say: "Ready? Press <b>▶ Play</b> and see what happens!", highlight: '[data-act="play"]',
        check: (c) => ev(c, "partFell") || ev(c, "win"),
        praise: "Whoa, they <b>fell</b>! 🪂 Parts that aren't <b>Anchored</b> drop with gravity.", pause: 2600 },
      { say: "Tap each part, then switch <b>⚓ Anchored</b> ON in Properties. Then Play again!", highlight: '[data-prop="anchored"]',
        check: (c) => ev(c, "win") && user(c).every((p) => p.anchored), react: reactPlay,
        hints: ["Press ■ Stop first. Tap a part — Properties shows on the right. Flip the ⚓ switch.", "Do it for BOTH parts!"],
        praise: "Rock solid! ⚓ Anchored parts stay put." },
      { say: "Make it yours: tap a part and pick a <b>Color</b> 🎨", highlight: '[data-prop="color"]',
        check: (c) => c.log.slice(c.since).some((e) => e.type === "prop" && !e.byScript && e.key === "Color" && e.part && e.part.user),
        hints: ["Tap a part, then tap a color circle in Properties."], praise: "Looking stylish! 🎨" }
    ],
    finale: "Anchored = stays still. Not anchored = gravity wins! You know a real Roblox property now."
  };

  M.rb3 = {
    track: "roblox", title: "Scale & Rotate Stairs", emoji: "🪜", kind: "studio", xpReward: 35, badge: "Shape Shifter",
    goal: "Use Scale and Rotate to build stairs up to a high 🏁",
    setup: { parts: [SPAWN(), FINISH({ x: 27, y: 8, w: 6 })], tools: ["part", "move", "scale", "rotate", "delete"] },
    steps: [
      { say: "The 🏁 is up high! First, pick the <b>↔️ Scale</b> tool.", highlight: '[data-tool="scale"]',
        check: (c) => c.engine.tool === "scale", checkOnEnter: false, hints: ["It's in the top bar, next to ✋ Move."] },
      { say: "Make a Part, then <b>drag on it</b> to stretch it until it's <b>8 wide</b> (or tap W + in Properties).", highlight: '[data-act="part"]',
        check: (c) => user(c).some((p) => p.w >= 7.5),
        demo: async (c) => { let p = lastUserPart(c) || c.engine.insertPart("part"); for (let i = 0; i < 4; i++) { p.w += 1; await new Promise((r) => setTimeout(r, 200)); } c.engine.emit("scale", { part: p }); c.engine.renderProps(); },
        hints: ["Press on the Part and drag to the right — it grows!", "Or tap the + next to W in Properties."] , praise: "Super stretch! 📏" },
      { say: "Now pick <b>🔄 Rotate</b> and tap a part — it flips standing up!", highlight: '[data-tool="rotate"]',
        check: (c) => ev(c, "rotate"), hints: ["Pick 🔄 Rotate in the top bar, then tap any of your parts."], praise: "Spin! 🔄" },
      { say: "Build <b>stairs</b> up to the 🏁 (each step 3 studs higher or less), then press ▶ Play!",
        ghost: { x: 10, y: 5.5, w: 5, h: 1, label: "first step?" }, highlight: '[data-act="play"]',
        check: (c) => ev(c, "win"), react: reactPlay,
        hints: ["Your avatar can jump about 3 studs UP. Make a middle step between the start and the 🏁.", "Use ✋ Move to drag a part so it sits a bit higher than the start."],
        demo: (c) => demoPlace(c, 10, 5.5), praise: "Up, up and away! 🪜" }
    ],
    finale: "Move, Scale, Rotate — the three tools every Roblox builder uses!"
  };

  M.rb4 = {
    track: "roblox", title: "Obby Builder", emoji: "🏃", kind: "studio", xpReward: 40, badge: "Obby Maker",
    goal: "Design your own 3+ part obby and beat it",
    setup: { parts: [SPAWN(), FINISH({ x: 29, y: 5, w: 6 })], tools: ["part", "sphere", "move", "scale", "rotate", "delete"] },
    steps: [
      { say: "Your turn to design! Build a path with <b>at least 3 Parts</b> to the far 🏁. Jumps must be <b>under 4 studs</b>.",
        check: (c) => user(c).length >= 3, highlight: '[data-act="part"]',
        hints: ["Tap 🧱 Part three times, then drag them into a path."], praise: "Nice plan! 🗺️" },
      { say: "Test it! Press <b>▶ Play</b>. Game designers test again and again.", highlight: '[data-act="play"]',
        check: (c) => ev(c, "win"), react: reactPlay,
        hints: (function () { return ["Watch where your avatar falls — that's the jump to fix.", "Drag parts closer together. About 3 studs apart is perfect."]; })(),
        praise: "Your obby is beatable! 🏁" },
      { say: "Make it fun: add a <b>⚪ Sphere</b> to the path and win again!", highlight: '[data-act="sphere"]',
        check: (c) => ev(c, "win") && user(c).some((p) => p.shape === "ball"), react: reactPlay,
        hints: ["Tap ⚪ Sphere, then drag it so the avatar has to jump on it."], praise: "Bouncy design! ⚪" }
    ],
    finale: "You designed, tested and fixed a level — that's what real game designers do!"
  };

  const PATH = (xs) => xs.map(([x, y, w, name, extra]) => Object.assign({ name: name || "Platform", x, y, w: w || 4, h: 1, color: "#a3a2a5", locked: true }, extra || {}));

  M.rb5 = {
    track: "roblox", title: "Paint with Code", emoji: "🎨", kind: "studio", xpReward: 40, badge: "First Script",
    goal: "Write Luau that changes a part's color",
    setup: {
      parts: [SPAWN(), ...PATH([[11, 3, 4, "Platform"]]), FINISH({ x: 19, w: 6 })], tools: ["move"],
      code: "-- This Script changes the Platform!\nlocal platform = workspace.Platform\n\n-- ✏️ add code below\n",
      blocks: [{ label: "🎨 Make it red", code: "platform.Color = Color3.new(1, 0, 0)" }, { label: "👻 Half see-through", code: "platform.Transparency = 0.5" }, { label: "💬 Print hello", code: 'print("Hello from my script!")' }]
    },
    steps: [
      { say: "This is a <b>Script</b> 📜 — instructions for the game. Tap the <b>🎨 Make it red</b> block to add a line of Luau.",
        highlight: ".st-blocks", check: (c) => /\.Color\s*=|BrickColor/.test(c.engine.getCode()), praise: "That's real Luau code! 👀",
        hints: ["The blocks are just above the code box."] },
      { say: "Scripts run when the game starts. Press <b>▶ Play</b>!", highlight: '[data-act="play"]',
        check: (c) => propBy(c, "Platform", "Color"), praise: "It turned color — <b>your code did that!</b> 🎨" },
      { say: "Now type it yourself: change it to <b>blue</b>. Color3.new(<b>R</b>, <b>G</b>, <b>B</b>) — blue is <code>Color3.new(0, 0, 1)</code>. Then Play.",
        highlight: ".st-editor", check: (c) => propBy(c, "Platform", "Color", (v) => colorName(v) === "blue"),
        react: (c) => ev(c, "prop") && c.ev.byScript && c.ev.key === "Color" ? "That made it " + colorName(c.ev.value) + ". For blue, R=0, G=0, B=1 → <code>Color3.new(0, 0, 1)</code>" : null,
        hints: ["Change the numbers inside Color3.new( ) to 0, 0, 1", "The line should look like: platform.Color = Color3.new(0, 0, 1)"], praise: "Blue! 💙 You edited code!" },
      { say: "Last one: add a <b>print(\"...\")</b> line with your own message, then Play. It shows in Output below.",
        highlight: ".st-blocks", check: (c) => ev(c, "print"), hints: ['Type print("I can code!") on a new line, or tap 💬 Print hello.'], praise: "Your script talked! 💬" }
    ],
    finale: "You wrote a real Roblox script: properties, Color3 and print!"
  };

  M.rb6 = {
    track: "roblox", title: "Lava Kill Brick", emoji: "🌋", kind: "studio", xpReward: 45, badge: "Lava Coder",
    goal: "Script a Touched event that makes lava deadly",
    setup: {
      parts: [SPAWN(), PATH([[11.5, 0, 11, "Lava", { color: "#ff3b1f", lava: true }]])[0], FINISH({ x: 20, w: 6 })], tools: ["part", "move", "delete"],
      code: 'local lava = workspace.Lava\n\nlava.Touched:Connect(function(hit)\n  local humanoid = hit.Parent:FindFirstChild("Humanoid")\n  if humanoid then\n    -- ✏️ make the player lose here\n  end\nend)\n',
      codeMode: "blocks", blocks: [{ label: "💀 Health = 0", code: "humanoid.Health = 0" }, { label: "💬 Print ouch", code: 'print("Ouch! Lava!")' }]
    },
    steps: [
      { say: "This red part is named <b>Lava</b>… but it's not dangerous yet. Press <b>▶ Play</b> and see!", highlight: '[data-act="play"]',
        check: (c) => ev(c, "win") || ev(c, "stop"), praise: "It walked right over the lava! 😅 Let's code danger.", pause: 2000 },
      { say: "<b>Touched</b> runs code when something bumps the lava. Inside the <b>if</b>, set <code>humanoid.Health = 0</code>. Then Play!",
        highlight: ".st-blocks", check: (c) => ev(c, "died"),
        react: (c) => ev(c, "win") ? "It still survived! Is <code>humanoid.Health = 0</code> inside the <b>if</b> … <b>end</b>?" : null,
        hints: ["Tap the 💀 Health = 0 block — it goes right where the ✏️ line is.", "The line must be between 'if humanoid then' and 'end'."], praise: "💀 Real kill brick! That's an EVENT in action." },
      { say: "Now save your avatar: build a <b>Part bridge</b> over the lava and win! (Keep the deadly code.)", ghost: { x: 11.5, y: 3, w: 4, h: 1 },
        check: (c) => ev(c, "win") && /Health\s*=\s*0/.test(c.engine.getCode()), react: reactPlay,
        hints: ["Make a Part and drag it above the lava, level with the start."], demo: (c) => demoPlace(c, 11.5, 3), praise: "Safe! You beat your own trap. 😎" }
    ],
    finale: "Events + if = game rules. Every Roblox obby uses this exact kill brick script!"
  };

  M.rb7 = {
    track: "roblox", title: "Disappearing Platform", emoji: "👻", kind: "studio", xpReward: 45, badge: "Vanish Wizard",
    goal: "Make a platform vanish after you step on it",
    setup: {
      parts: [SPAWN(), ...PATH([[11.5, 3, 4, "Vanish", { color: "#04afec" }]]), FINISH({ x: 20, w: 6 })], tools: ["move"],
      code: "local platform = workspace.Vanish\n\nplatform.Touched:Connect(function(hit)\n  -- ✏️ wait, then disappear\nend)\n",
      blocks: [{ label: "⏱️ wait(0.3)", code: "wait(0.3)" }, { label: "👻 invisible", code: "platform.Transparency = 1" }, { label: "🚪 fall through", code: "platform.CanCollide = false" }]
    },
    steps: [
      { say: "Let's make a sneaky platform! When it's <b>Touched</b>: <b>wait</b>, then turn it <b>invisible</b> and <b>fall-through</b>. Use all 3 blocks in order, then Play.",
        highlight: ".st-blocks", check: (c) => propBy(c, "Vanish", "CanCollide", (v) => v === false),
        react: (c) => ev(c, "win") ? "It didn't vanish yet. You need <code>platform.CanCollide = false</code> inside the function." : null,
        hints: ["Tap ⏱️ wait, then 👻 invisible, then 🚪 fall through.", "CanCollide = false means things fall through it."], praise: "Poof! 👻 It vanished!", pause: 1800 },
      { say: "Too sneaky? If your avatar fell, make it fair: change <code>wait(0.3)</code> to <code>wait(1)</code> so players can escape. Win with the vanish still on!",
        highlight: ".st-editor", check: (c) => stepEvents(c, "win").length > 0 && propBy(c, "Vanish", "CanCollide", (v) => v === false),
        react: (c) => ev(c, "fell") ? "Fell through! 😱 Give the player more time — a bigger number in wait( )." : null,
        hints: ["Find the number inside wait( ) and make it bigger, like 1."], praise: "Fair AND tricky — great game design! ⚖️" }
    ],
    finale: "wait() controls time in your game. You used events, wait and two properties!"
  };

  M.rb8 = {
    track: "roblox", title: "Blink Loop", emoji: "🔁", kind: "studio", xpReward: 45, badge: "Loop Master",
    goal: "Use a loop to make a part blink",
    setup: {
      parts: [SPAWN(), ...PATH([[11.5, 3, 4, "Blinker", { color: "#ffff00" }]]), FINISH({ x: 20, w: 6 })], tools: ["move"],
      code: "local part = workspace.Blinker\n\nwhile true do\n  -- ✏️ blink!\nend\n",
      blocks: [{ label: "👻 Transparency = 1", code: "part.Transparency = 1" }, { label: "⏱️ wait(1)", code: "wait(1)" }, { label: "🟨 Transparency = 0", code: "part.Transparency = 0" }]
    },
    steps: [
      { say: "A <b>loop</b> repeats code. Make the Blinker blink: invisible → wait → visible → wait. Then Play!",
        highlight: ".st-blocks", check: (c) => { const v = new Set(c.log.slice(c.since).filter((e) => e.type === "prop" && e.byScript && e.key === "Transparency").map((e) => e.value)); return v.size >= 2; },
        hints: ["Order: 👻, ⏱️, 🟨, ⏱️ — tap the blocks in that order.", "Forgot wait? The loop goes so fast the game freezes. Each loop needs a wait()."], praise: "Blink, blink! ✨ A loop runs forever." },
      { say: "<code>while true</code> runs forever. Change the first loop line to <code>for i = 1, 3 do</code> to blink exactly <b>3 times</b>, then Play.",
        highlight: ".st-editor", check: (c) => /for\s+\w+\s*=\s*1\s*,\s*3\s+do/.test(c.engine.getCode()) && stepEvents(c, "play").length > 0 && c.log.slice(c.since).filter((e) => e.type === "prop" && e.byScript).length >= 2,
        hints: ["Replace the words 'while true do' with 'for i = 1, 3 do' — keep the 'end'."], praise: "Counted loop! 🔢" }
    ],
    finale: "while loops run forever, for loops count. You used both!"
  };

  M.rb9 = {
    track: "roblox", title: "Checkpoint Save", emoji: "🚩", kind: "studio", xpReward: 45, badge: "Checkpoint Champ",
    goal: "Add a checkpoint and fix a too-hard jump",
    setup: {
      parts: [SPAWN(), ...PATH([[9.5, 3, 3], [14.5, 4, 3], [19.5, 5, 3]]), { name: "LastStep", x: 27, y: 5, w: 3, h: 1, color: "#da8541" }, FINISH({ x: 30.5, y: 6, w: 3 })],
      tools: ["checkpoint", "move", "delete"]
    },
    steps: [
      { say: "This obby has a <b>nasty jump</b> near the end. Press ▶ Play and see.", highlight: '[data-act="play"]',
        check: (c) => ev(c, "fell"), praise: "Ouch! Starting ALL the way over is no fun. 😩", pause: 1800 },
      { say: "Add a <b>🚩 Checkpoint</b> and drag it onto the <b>third grey platform</b> — right before the hard jump!", highlight: '[data-act="checkpoint"]',
        ghost: { x: 19.5, y: 6, w: 3, h: 1, label: "Checkpoint here" },
        check: (c) => c.engine.parts.some((p) => p.kind === "checkpoint" && p.x > 16 && p.x < 23),
        demo: async (c) => { let p = c.engine.parts.find((q) => q.kind === "checkpoint") || c.engine.insertPart("checkpoint"); await c.engine.animateMoveTo(p, 19.5, 6, 1200); },
        hints: ["Tap 🚩 Checkpoint, then drag it on top of the third grey platform."], praise: "Saved spot set! 🚩" },
      { say: "Play again — watch where you come back after falling!", highlight: '[data-act="play"]',
        check: (c) => ev(c, "respawn"), react: (c) => ev(c, "fell") && !c.ev.willRespawn ? "Hmm, no respawn. Did the avatar touch the 🚩 first? Put it right on the path." : null,
        praise: "Respawned at the checkpoint! 🙌" },
      { say: "Now fix the jump: drag <b>LastStep</b> (orange) closer so the gap is under 4 studs. Then win!", highlight: '[data-act="play"]',
        ghost: { x: 24.5, y: 5, w: 3, h: 1 }, check: (c) => ev(c, "win"), react: reactPlay,
        demo: async (c) => { const p = c.engine.find("LastStep"); if (p) { c.engine.select(p); await c.engine.animateMoveTo(p, 24.5, 5, 1100); } },
        hints: ["Drag the orange part to the left a little."], praise: "Beaten! 🏁" }
    ],
    finale: "Checkpoints + fair jumps = players who keep playing your game!"
  };

  M.rb10 = {
    track: "roblox", title: "Coin Counter", emoji: "🪙", kind: "studio", xpReward: 50, badge: "Coin Collector",
    goal: "Script coins that add to the leaderboard",
    setup: {
      parts: [SPAWN(), ...PATH([[9.5, 3, 3], [14.5, 3, 3], [19.5, 3, 3]]),
        { kind: "coin", name: "Coin1", x: 9.5, y: 4.5, w: 1, h: 1, canCollide: false, locked: true },
        { kind: "coin", name: "Coin2", x: 14.5, y: 4.5, w: 1, h: 1, canCollide: false, locked: true },
        { kind: "coin", name: "Coin3", x: 19.5, y: 4.5, w: 1, h: 1, canCollide: false, locked: true },
        FINISH({ x: 26, w: 6 })],
      tools: ["move"], showCoins: true,
      code: 'local Players = game:GetService("Players")\n\nlocal function collect(coin)\n  coin.Touched:Connect(function(hit)\n    local player = Players:GetPlayerFromCharacter(hit.Parent)\n    if player then\n      -- ✏️ add a coin here\n    end\n  end)\nend\n\ncollect(workspace.Coin1)\ncollect(workspace.Coin2)\ncollect(workspace.Coin3)\n',
      blocks: [{ label: "➕ add 1 coin", code: "player.leaderstats.Coins.Value += 1" }, { label: "🙈 hide coin", code: "coin:Destroy()" }]
    },
    steps: [
      { say: "Coins! 🪙 This script runs <b>collect</b> on each coin. Add a line that gives the player <b>+1 coin</b>, then Play.",
        highlight: ".st-blocks", check: (c) => stepEvents(c, "coins").some((e) => e.value >= 1),
        hints: ["Tap ➕ add 1 coin. 'leaderstats' is the scoreboard in Roblox.", "+= 1 means 'add one more'."], praise: "Cha-ching! 🪙" },
      { say: "Grab <b>all 3</b> and finish! Then add <b>🙈 hide coin</b> so each coin disappears after it's collected.",
        check: (c) => stepEvents(c, "coins").some((e) => e.value >= 3) && c.log.slice(c.since).some((e) => e.type === "destroy" && e.byScript),
        react: (c) => ev(c, "win") && !/Destroy/.test(c.engine.getCode()) ? "3 coins! Now add <code>coin:Destroy()</code> so coins vanish when grabbed." : null,
        hints: ["Put coin:Destroy() right under the += 1 line."], praise: "Collected and cleaned up! 🧹" }
    ],
    finale: "Functions, events and leaderstats — you just built a real Roblox coin system!"
  };

  function reviewHtml(r) {
    const li = (a) => a.map((x) => "<li>" + x + "</li>").join("");
    return '<div class="rv"><h3>📝 Byte\'s Build Review</h3>' +
      '<p class="rv-stats">🧱 ' + r.stats.parts + " parts · 🏁 " + r.stats.wins + " wins · biggest jump " + r.stats.maxGap.toFixed(1) + " studs</p>" +
      '<div class="rv-col"><h4>🌟 Strengths</h4><ul>' + li(r.strengths.length ? r.strengths : ["You started building — that's the hardest part!"]) + "</ul></div>" +
      '<div class="rv-col"><h4>🔧 Try next</h4><ul>' + li(r.improve.length ? r.improve : ["Honestly? It's great. Make a second level!"]) + "</ul></div>" +
      '<p class="rv-next">🚀 <b>Next challenge:</b> ' + r.next + "</p>" +
      '<details class="rv-real" open><summary>🛠️ Build it in real Roblox Studio</summary><ol>' +
      "<li>Open Roblox Studio → <b>New</b> → <b>Baseplate</b>.</li>" +
      "<li><b>Home → Part</b> to insert each platform; use <b>Move / Scale / Rotate</b> like here.</li>" +
      "<li>In <b>Properties</b>, tick <b>Anchored</b> on every platform.</li>" +
      "<li>Right-click a part → <b>Insert Object → Script</b> and paste your Luau code.</li>" +
      "<li>Add a <b>SpawnLocation</b> and a <b>Checkpoint</b> (another SpawnLocation) mid-way.</li>" +
      "<li>Press <b>Play (F5)</b> and test every jump. Then <b>File → Publish to Roblox</b> (ask a grown-up).</li></ol></details></div>";
  }

  M.rbcap = {
    track: "roblox", title: "Capstone: Dream Obby", emoji: "🏆", kind: "studio", xpReward: 80, badge: "Roblox Capstone",
    goal: "Free build! Byte reviews your real build",
    setup: {
      parts: [SPAWN(), FINISH({ x: 29, y: 7, w: 6 })], tools: ["part", "sphere", "checkpoint", "move", "scale", "rotate", "delete"], defaultAnchored: true,
      code: "-- Optional: add a kill brick, vanishing platform or coins!\n-- Name a part in Properties, then use workspace.ThatName\n\n-- ✏️ your code here\n",
      blocks: [
        { label: "💀 kill brick", code: 'workspace.Lava.Touched:Connect(function(hit)\n  local h = hit.Parent:FindFirstChild("Humanoid")\n  if h then h.Health = 0 end\nend)' },
        { label: "👻 vanish", code: "workspace.Vanish.Touched:Connect(function()\n  wait(1)\n  workspace.Vanish.Transparency = 1\n  workspace.Vanish.CanCollide = false\nend)" },
        { label: "🎨 color", code: "workspace.Part.Color = Color3.new(1, 0, 1)" }
      ]
    },
    steps: [
      { say: "🏆 <b>Your Dream Obby!</b> Build at least <b>5 parts</b> to the high 🏁, use any tools, add a script if you like — then beat it with ▶ Play.",
        check: (c) => ev(c, "win") && user(c).length >= 5, react: (c) => { if (ev(c, "win")) return "You won! Now make it a real course — at least 5 parts. 🧱"; return reactPlay(c); },
        hints: ["Start with a staircase up to the 🏁, then add twists: a sphere, a checkpoint, a kill brick.", "Name a red part 'Lava' (Properties → Name) and use the 💀 kill brick block!"], fastSecs: 1 },
      { say: "Amazing build! Tap below and I'll review it like a real game designer. 🧐<div class=\"tb-choices\"><button type=\"button\" class=\"btn btn-sun tb-review\">📝 Review my build</button></div>",
        mounted: (c, bub) => { const b = bub.querySelector(".tb-review"); if (b) b.onclick = () => { const r = c.engine.feedbackReport(); c.engine.showFeedback(reviewHtml(r)); c.engine.emit("feedback", { report: r }); }; },
        check: (c) => ev(c, "feedback"), praise: "Read my notes below! 👇", pause: 1500 }
    ],
    finale: "You're a Roblox builder AND scripter. Take your obby into real Roblox Studio!"
  };

  window.MISSIONS = Object.assign(window.MISSIONS || {}, M);
  window.MISSION_TRACKS = Object.assign(window.MISSION_TRACKS || {}, { roblox: ["rb1", "rb2", "rb3", "rb4", "rb5", "rb6", "rb7", "rb8", "rb9", "rb10", "rbcap"] });
  window.ccReviewHtml = reviewHtml;
})();
