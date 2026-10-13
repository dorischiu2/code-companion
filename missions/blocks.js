/* Block-based missions: Scratch, Scratch Jr, Hopscotch, App Inventor */
(function () {
  const ev = (c, t) => c.ev && c.ev.type === t;
  const S = (c) => c.engine;
  const setScript = (E, list) => { E.halt(); E.script = list.map(([k, a]) => E.mk(k, a)); E.cursor = E.script.length; E.renderScript(); E.emit("block", { k: "demo" }); };
  const M = {};

  // ---------- Scratch ----------
  M["sc-walk"] = { track: "scratch", title: "Cat on the Move", emoji: "🐱", kind: "stage", xpReward: 25, badge: "First Script",
    goal: "Make the cat walk with a move block",
    setup: { mode: "scratch", blocks: ["flag", "move", "turn", "say", "wait"], sprite: "🐱", start: { x: -160, y: 0, dir: 90 }, scenery: [["🌳", 180, -10]], rotate: false },
    steps: [
      { say: "Hi! I'm <b>Byte</b> 🤖. Scripts start with a 🏁 hat. Tap the blue <b>move 10 steps</b> block to snap it under the hat.", highlight: '.sg-palette [data-k="move"]', check: (c) => S(c).count("move") >= 1, hints: ["It's the blue block in the Blocks area."], praise: "Snap! 🧩" },
      { say: "Now press <b>🏁 Go</b> to run your script!", highlight: '[data-act="go"]', check: (c) => ev(c, "done") && c.ev.moved > 0, praise: "It moved! …a tiny bit. 🐾" },
      { say: "10 steps is tiny! Tap the <b>10</b> in your script, type <b>200</b>, then 🏁 Go. Can you reach the tree 🌳?", highlight: ".sg-script .sg-in", check: (c) => ev(c, "done") && c.ev.moved >= 150,
        react: (c) => ev(c, "done") && c.ev.moved < 150 ? "Further! Make the number bigger — try 200." : null, hints: ["Click on the white number bubble inside the move block and type 200."],
        demo: async (c) => setScript(S(c), [["flag"], ["move", 200]]), praise: "Zoom! 🐈💨" }
    ], finale: "Hat + blocks = a script. You're a Scratch coder!" };

  M["sc-say"] = { track: "scratch", title: "Hello, World!", emoji: "💬", kind: "stage", xpReward: 25, badge: "Storyteller",
    goal: "Make your sprite talk", setup: { mode: "scratch", blocks: ["flag", "move", "say", "wait"], sprite: "🐶", start: { x: 0, y: -40, dir: 90 }, rotate: false },
    steps: [
      { say: "Let's make the dog talk! Add a purple <b>say</b> block and press 🏁 Go.", highlight: '.sg-palette [data-k="say"]', check: (c) => ev(c, "say"), praise: "Woof! 🐶" },
      { say: "Make it say <b>your</b> words: tap “Hello!” in the script, type something new, then Go.", highlight: ".sg-script .sg-in", check: (c) => ev(c, "say") && c.ev.text !== "Hello!", hints: ["Click the word Hello! inside the say block and type your own message."], praise: "Great line! 🎤" },
      { say: "A story needs more! Add <b>wait</b> and a second <b>say</b>, then Go.", check: (c) => ev(c, "done") && S(c).count("say") >= 2 && S(c).count("wait") >= 1, hints: ["Order: say → wait → say."], praise: "A two-line story! 📖" }
    ], finale: "Blocks run top to bottom — that's called a sequence." };

  M["sc-square"] = { track: "scratch", title: "Square Dance (Loops)", emoji: "🟪", kind: "stage", xpReward: 35, badge: "Loop Master",
    goal: "Draw a square with a repeat loop", setup: { mode: "scratch", blocks: ["flag", "move", "turn", "repeat"], sprite: "🐢", start: { x: -60, y: -60, dir: 90 }, penAlways: true },
    steps: [
      { say: "The turtle draws wherever it walks ✏️. A square is <b>4 × (move, turn)</b>. Tap <b>🔁 repeat</b> first.", highlight: '.sg-palette [data-k="repeat"]', check: (c) => S(c).count("repeat") >= 1, praise: "A loop! Blocks inside it repeat. 🔁" },
      { say: "Now tap <b>move</b> and <b>turn</b> — they go <b>inside</b> the loop. Set move to <b>100</b> and turn to <b>90</b>, then 🏁 Go!", highlight: ".sg-palette",
        check: (c) => ev(c, "done") && S(c).shape().closed && S(c).count("repeat") >= 1,
        react: (c) => { if (!ev(c, "done")) return null; const t = c.ev.turned; if (t !== 360) return "Your turns add up to " + t + "°. A square needs 4 × 90 = 360°. Check the turn number!"; return "Almost — is move set to 100 and both blocks inside the repeat?"; },
        hints: ["Blocks inside the loop are pushed to the right.", "Set the turn block's number to 90 — that's a corner."], demo: async (c) => setScript(S(c), [["flag"], ["repeat", 4], ["move", 100], ["turn", 90], ["end"]]), praise: "A perfect square! 🟪" },
      { say: "Bonus brain: change it to draw a <b>triangle</b> (3 sides). What turn makes it close?", check: (c) => ev(c, "done") && S(c).shape().closed && c.ev.turned === 360 && S(c).script.some((b) => b.k === "repeat" && Number(b.arg) === 3),
        hints: ["Repeat 3 times. All the turns must add up to 360°.", "360 ÷ 3 = 120"], praise: "Triangle! 🔺 You did geometry with code!" }
    ], finale: "Loops save you from writing the same blocks again and again." };

  M["sc-click"] = { track: "scratch", title: "Click the Cat", emoji: "👆", kind: "stage", xpReward: 30, badge: "Event Expert",
    goal: "Use a 'when clicked' event", setup: { mode: "scratch", blocks: ["flag", "click", "say", "costume", "grow", "turn"], sprite: "🐱", costumes: ["🐱", "😺", "😸", "🙀"], start: { x: 0, y: 0, dir: 90 }, rotate: false },
    steps: [
      { say: "Scripts can start in different ways. Swap the hat: tap <b>👆 when this sprite clicked</b>.", highlight: '.sg-palette [data-k="click"]', check: (c) => S(c).script[0].k === "click", praise: "New hat! 🎩" },
      { say: "Add <b>next costume</b> under it, then <b>click the cat</b> on the stage!", highlight: ".sg-stage", check: (c) => ev(c, "done") && c.ev.hat === "click" && S(c).count("costume") >= 1, hints: ["Tap 'next costume', then click right on the cat."], praise: "It changed face! 😺" },
      { say: "Make each click a show: add <b>say</b> and <b>change size</b>, then click again.", check: (c) => ev(c, "done") && c.ev.hat === "click" && S(c).count("say") >= 1 && S(c).count("grow") >= 1, praise: "Interactive! 🎮" }
    ], finale: "Events (like clicks) are how games react to players." };

  M["sc-star"] = { track: "scratch", title: "Catch the Star", emoji: "⭐", kind: "stage", xpReward: 40, badge: "Star Catcher",
    goal: "Plan a path to the star", setup: { mode: "scratch", blocks: ["flag", "move", "turn", "goto", "repeat", "say"], sprite: "🚀", start: { x: -160, y: -110, dir: 90 }, star: { x: 140, y: 100 }, grid: true },
    steps: [
      { say: "Fly the rocket 🚀 to the ⭐! Use <b>move</b> and <b>turn</b> (turn -90 points up!). Press 🏁 to test.", check: (c) => ev(c, "star"), react: (c) => ev(c, "done") ? "Missed! You ended at x=" + Math.round(c.ev.x) + ", y=" + Math.round(c.ev.y) + ". The star is at x=140, y=100." : null,
        hints: ["Move 300 right, turn -90 (to face up), move 210.", "Each grid square is 40 steps."], demo: async (c) => setScript(S(c), [["flag"], ["move", 300], ["turn", -90], ["move", 210]]), praise: "Caught it! ⭐" },
      { say: "Now the shortcut: use <b>go to x y</b> with <b>140 100</b>, and add a <b>say</b> to celebrate!", check: (c) => ev(c, "done") && S(c).starHit && S(c).count("goto") >= 1 && S(c).count("say") >= 1, hints: ["Type 140 100 into the go to block."], praise: "Coordinates master! 📍" }
    ], finale: "x and y are a map for your sprite — just like in real games." };

  // ---------- Scratch Jr ----------
  const JR = (o) => Object.assign({ mode: "jr", sprite: "🐥", start: { x: -160, y: -40, dir: 90 }, grid: true, rotate: false, bg: "#fefce8" }, o);
  M["sj-walk"] = { track: "scratchjr", title: "Chick Walk", emoji: "🐥", kind: "stage", xpReward: 20, badge: "Tiny Coder",
    goal: "Walk to the star", setup: JR({ blocks: ["flag", "move"], star: { x: 0, y: -40 } }),
    steps: [
      { say: "Hi! I'm Byte 🤖. Tap the <b>➡️</b> block!", highlight: '.sg-palette [data-k="move"]', check: (c) => S(c).count("move") >= 1, praise: "Yay! 🎉" },
      { say: "Press <b>🏁 Go</b>!", highlight: '[data-act="go"]', check: (c) => ev(c, "done"), praise: "Walk walk! 🐾" },
      { say: "Get to the ⭐! Tap the <b>1</b> and make it bigger. Then 🏁.", highlight: ".sg-script .sg-in", check: (c) => ev(c, "star"), hints: ["Count the squares to the star: 4!"], demo: async (c) => setScript(S(c), [["flag"], ["move", 4]]), praise: "Got the star! ⭐" }
    ], finale: "You told the chick where to go. That's coding!" };
  M["sj-jump"] = { track: "scratchjr", title: "Up and Over", emoji: "⬆️", kind: "stage", xpReward: 20, badge: "Path Finder",
    goal: "Go up and right to the star", setup: JR({ blocks: ["flag", "move", "up", "down"], sprite: "🐸", star: { x: -40, y: 40 } }),
    steps: [
      { say: "The ⭐ is up high! Use <b>⬆️</b> and <b>➡️</b>. Then 🏁.", check: (c) => ev(c, "star"), react: (c) => ev(c, "done") ? "Almost! Count squares: 2 up, 3 right." : null, hints: ["⬆️ 2, then ➡️ 3"], demo: async (c) => setScript(S(c), [["flag"], ["up", 2], ["move", 3]]), praise: "Hop hop! 🐸" },
      { say: "Come back down! Add <b>⬇️</b> at the end, then 🏁.", check: (c) => ev(c, "done") && S(c).starHit && S(c).count("down") >= 1, praise: "Safe landing! 🪂" }
    ], finale: "Up, down, left, right — you can go anywhere!" };
  M["sj-loop"] = { track: "scratchjr", title: "Magic Repeat", emoji: "🔁", kind: "stage", xpReward: 25, badge: "Loop Starter",
    goal: "Use repeat to walk far", setup: JR({ blocks: ["flag", "move", "say", "repeat"], sprite: "🐢", star: { x: 120, y: -40 } }),
    steps: [
      { say: "The ⭐ is far! Use <b>🔁</b> with just <b>one ➡️ inside</b>. Then 🏁.", check: (c) => ev(c, "star") && S(c).count("repeat") >= 1 && S(c).count("move") === 1, react: (c) => ev(c, "done") ? "Tip: put ONE ➡️ inside 🔁 and make 🔁's number 7." : null,
        hints: ["Tap 🔁 first, then ➡️ (it goes inside).", "Set 🔁 to 7."], demo: async (c) => setScript(S(c), [["flag"], ["repeat", 7], ["move", 1], ["end"]]), praise: "Magic! 🪄" },
      { say: "Add <b>💬</b> at the end so the turtle cheers!", check: (c) => ev(c, "say") && S(c).starHit, praise: "Hooray! 🐢" }
    ], finale: "🔁 does it again and again so you don't have to!" };

  // ---------- Hopscotch ----------
  const HOP = (o) => Object.assign({ mode: "hop", sprite: "🐵", start: { x: -60, y: -60, dir: 90 }, bg: "#fdf2f8" }, o);
  M["hs-draw"] = { track: "hopscotch", title: "Rainbow Trail", emoji: "🌈", kind: "stage", xpReward: 25, badge: "Trail Artist",
    goal: "Draw a shape with a trail", setup: HOP({ blocks: ["flag", "pen", "color", "move", "turn", "repeat"] }),
    steps: [
      { say: "Make the monkey draw! Add <b>✏️ Draw a trail</b>, then <b>Move forward</b> and press 🏁 Go.", check: (c) => ev(c, "done") && S(c).trail.length > 2, praise: "A line! ✏️" },
      { say: "Draw a <b>triangle</b>: 🔁 Repeat 3 times → Move forward 120, Turn 120 degrees.", check: (c) => ev(c, "done") && S(c).shape().closed, react: (c) => ev(c, "done") ? "Turns so far: " + c.ev.turned + "°. A triangle's turns add up to 360°." : null,
        hints: ["Repeat 3 · Move forward 120 · Turn 120"], demo: async (c) => setScript(S(c), [["flag"], ["pen"], ["repeat", 3], ["move", 120], ["turn", 120], ["end"]]), praise: "Triangle! 🔺" },
      { say: "Make it colorful: add <b>🎨 Set trail color</b> (try blue or orange) and Go.", check: (c) => ev(c, "done") && S(c).count("color") >= 1, praise: "Rainbow coder! 🌈" }
    ], finale: "You drew with code like a real Hopscotch artist!" };
  M["hs-tap"] = { track: "hopscotch", title: "Tap to Grow", emoji: "📱", kind: "stage", xpReward: 25, badge: "Tap Master",
    goal: "Make a character react to taps", setup: HOP({ blocks: ["flag", "click", "grow", "turn", "say"], sprite: "🦄", start: { x: 0, y: 0, dir: 90 }, rotate: false }),
    steps: [
      { say: "Swap the start to <b>👆 When tapped</b>.", highlight: '.sg-palette [data-k="click"]', check: (c) => S(c).script[0].k === "click", praise: "Ready for taps! 👆" },
      { say: "Add <b>Grow by</b> and <b>Say</b>, then <b>tap the unicorn</b>!", highlight: ".sg-stage", check: (c) => ev(c, "done") && c.ev.hat === "click" && S(c).count("grow") >= 1, praise: "It grew! 🦄✨" }
    ], finale: "Tap events make apps and games interactive." };

  // ---------- App Inventor ----------
  M["ai-hello"] = { track: "appinventor", title: "My First App", emoji: "📲", kind: "phone", xpReward: 30, badge: "App Maker",
    goal: "Button that changes a label", setup: { comps: [] },
    steps: [
      { say: "Let's build a phone app! In the Designer, add a <b>🔤 Label</b> and a <b>🔘 Button</b>.", highlight: ".ph-pal", check: (c) => S(c).comps.some((x) => x.type === "Label") && S(c).comps.some((x) => x.type === "Button"), praise: "Your screen has parts! 📱" },
      { say: "Apps react to <b>events</b>. Tap the block <b>when Button1.Click</b>.", highlight: ".ph-blocks", check: (c) => S(c).rules.length > 0, praise: "Event block added! 🧩" },
      { say: "Now tap <b>set Label1.Text to “…”</b>, type a message, then <b>tap your button on the phone</b>!", highlight: ".ph-blocks", check: (c) => ev(c, "changed") && c.ev.text !== "", hints: ["After adding the set block, press the Tap me button on the phone."], praise: "Your app works! 🎉" }
    ], finale: "Designer + Blocks = a real App Inventor app!" };
  M["ai-counter"] = { track: "appinventor", title: "Tap Counter", emoji: "🔢", kind: "phone", xpReward: 35, badge: "Variable Wizard",
    goal: "Count taps on a button", setup: { comps: ["Label", "Button"] },
    steps: [
      { say: "Make a counter! Add <b>when Button1.Click</b>, then <b>set Label1.Text to Label1.Text + 1</b>.", highlight: ".ph-blocks", check: (c) => S(c).rules.some((r) => r.acts.some((a) => a.kind === "inc")), praise: "Counter logic! ➕" },
      { say: "Tap your button <b>5 times</b>! 👆👆👆👆👆", highlight: ".ph-screen", check: (c) => ev(c, "changed") && Number(c.ev.text) >= 5, react: null, hints: ["Keep tapping the 'Tap me' button on the phone."], praise: "5 taps counted! 🔢" },
      { say: "Bonus: also set the label's <b>BackgroundColor</b> when tapped.", check: (c) => ev(c, "changed") && !!c.ev.bg, praise: "Colorful counter! 🎨" }
    ], finale: "Your app remembers a number — that's how scoreboards work!" };

  window.MISSIONS = Object.assign(window.MISSIONS || {}, M);
  window.MISSION_TRACKS = Object.assign(window.MISSION_TRACKS || {}, {
    scratch: ["sc-walk", "sc-say", "sc-square", "sc-click", "sc-star"],
    scratchjr: ["sj-walk", "sj-jump", "sj-loop"],
    hopscotch: ["hs-draw", "hs-tap"],
    appinventor: ["ai-hello", "ai-counter"]
  });
})();
