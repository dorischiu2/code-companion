/* Code missions: Python, HTML/CSS, JavaScript, Full Stack, Unity, Capstones */
(function () {
  const ev = (c, t) => c.ev && c.ev.type === t;
  const E = (c) => c.engine;
  const doc = (c) => E(c).doc();
  const ran = (c) => ev(c, "ran") ? c.ev : null;
  const out = (c) => (ran(c) || {}).stdout || "";
  const M = {};
  const pyReact = (c) => ev(c, "pyload-failed") ? "Python needs the internet the first time it loads. Connect and press ▶ Run again." : null;

  // ---------- Python ----------
  M["py-print"] = { track: "python", title: "Python Says Hi", emoji: "🐍", kind: "python", xpReward: 30, badge: "Pythonista",
    goal: "Print messages with Python", setup: { code: 'print("Hello, Python!")\n', snippets: [{ label: "💬 print", code: 'print("I love coding")' }] },
    steps: [
      { say: "Real Python! 🐍 Press <b>▶ Run</b> to run this line.", highlight: ".cw-run", check: (c) => /Hello, Python!/.test(out(c)), react: pyReact, praise: "Python spoke! 🗣️" },
      { say: "Change the words in the quotes to <b>your name</b> and Run.", highlight: ".st-editor", check: (c) => ran(c) && out(c).trim() && !/Hello, Python!/.test(out(c)), hints: ['Keep the quotes: print("Alexa")'], praise: "Nice to meet you! 👋" },
      { say: "Print <b>3 lines</b>: add two more <code>print(...)</code> lines and Run.", check: (c) => ran(c) && c.ev.lines.length >= 3, hints: ["Each print goes on its own line."], praise: "Three lines! 📜" }
    ], finale: "print() is how programs talk to you." };
  M["py-vars"] = { track: "python", title: "Variables Backpack", emoji: "🎒", kind: "python", xpReward: 35, badge: "Variable Wizard",
    goal: "Store and change values", setup: { code: 'name = "Alexa"\ncoins = 5\nprint(name, "has", coins, "coins")\n' },
    steps: [
      { say: "A <b>variable</b> is a labeled box. Run this code!", highlight: ".cw-run", check: (c) => /has 5 coins/.test(out(c)), react: pyReact, praise: "📦 Two variables!" },
      { say: "Before the print, add <code>coins = coins + 10</code>. What will it say? Run it!", highlight: ".st-editor", check: (c) => /has 15 coins/.test(out(c)), react: (c) => ran(c) ? "It printed: “" + out(c).trim() + "”. Put the coins line ABOVE print." : null, hints: ["Line order matters — Python reads top to bottom."], praise: "5 + 10 = 15! 🪙" },
      { say: "Make a new variable <code>level = 3</code> and print it too.", check: (c) => ran(c) && c.ev.vars.level !== undefined && /\b3\b/.test(out(c)), hints: ['print("Level", level)'], praise: "Level up! ⬆️" }
    ], finale: "Variables remember things so your program can use them later." };
  M["py-if"] = { track: "python", title: "Secret Door", emoji: "🚪", kind: "python", xpReward: 35, badge: "Decision Maker",
    goal: "Use if / else to make decisions", setup: { code: 'password = "dragon"\n\nif password == "dragon":\n    print("Door opens! 🚪")\nelse:\n    print("Wrong password!")\n' },
    steps: [
      { say: "<b>if</b> checks something is True. Run it!", highlight: ".cw-run", check: (c) => /Door opens/.test(out(c)), react: pyReact, praise: "Open sesame! ✨" },
      { say: "Change the first line to <code>password = \"cat\"</code> and Run. What happens?", check: (c) => /Wrong password/.test(out(c)), praise: "The else part ran! 🔒" },
      { say: "Your turn: make a variable <code>age</code> and print <b>\"Teen!\"</b> if age is 13 or more, else <b>\"Kid!\"</b>.", check: (c) => ran(c) && c.ev.vars.age !== undefined && ((c.ev.vars.age >= 13 && /Teen!/.test(out(c))) || (c.ev.vars.age < 13 && /Kid!/.test(out(c)))),
        hints: ["if age >= 13:", "Don't forget the colon : and 4 spaces before print."], praise: "Smart program! 🧠" }
    ], finale: "if/else lets programs choose — like a game deciding if you win." };
  M["py-loop"] = { track: "python", title: "Loop Rocket", emoji: "🚀", kind: "python", xpReward: 40, badge: "Loop Master",
    goal: "Count down with a for loop", setup: { code: "for i in range(3):\n    print(\"Hip hip hooray!\")\n" },
    steps: [
      { say: "A <b>for loop</b> repeats. Run it!", highlight: ".cw-run", check: (c) => ran(c) && c.ev.lines.filter((l) => /hooray/i.test(l)).length === 3, react: pyReact, praise: "3 cheers! 🎉" },
      { say: "Make a <b>countdown</b>: print 10, 9, 8 … 1, then <b>Liftoff!</b> Tip: <code>range(10, 0, -1)</code>.", check: (c) => { const o = out(c); return ran(c) && /^10\b/.test(o.trim()) && /\b1\s*\n?\s*Liftoff/i.test(o); },
        hints: ["for n in range(10, 0, -1):\n    print(n)", "Put print(\"Liftoff!\") after the loop with NO spaces in front."], praise: "🚀 LIFTOFF!" }
    ], finale: "Loops let a computer do boring repeats super fast." };
  M["py-func"] = { track: "python", title: "Function Factory", emoji: "🏭", kind: "python", xpReward: 45, badge: "Function Builder",
    goal: "Write your own function", setup: { code: "def greet(name):\n    print(\"Hi\", name)\n\ngreet(\"Byte\")\n" },
    steps: [
      { say: "<b>def</b> makes a function — a reusable mini-program. Run it, then call <code>greet</code> one more time with a friend's name.", check: (c) => ran(c) && c.ev.lines.filter((l) => /^Hi /.test(l)).length >= 2, react: pyReact, praise: "Reusable! ♻️" },
      { say: "Write <code>def double(n):</code> that <b>returns</b> n * 2, then <code>print(double(21))</code>.", check: (c) => ran(c) && /\b42\b/.test(out(c)) && /return/.test(c.ev.code), hints: ["def double(n):\n    return n * 2"], praise: "42! The answer to everything. 🌌" }
    ], finale: "Functions are how pros keep code tidy." };

  // ---------- HTML & CSS ----------
  const page0 = "<h1>My Page</h1>\n<p>Welcome to my site.</p>\n";
  M["hc-tags"] = { track: "htmlcss", title: "Tag, You're It!", emoji: "📄", kind: "web", xpReward: 30, badge: "Web Weaver",
    goal: "Edit HTML and see it live", setup: { tabs: ["html"], files: { html: page0 }, snippets: [{ label: "➕ paragraph", code: "<p>I love games!</p>", tab: "html" }, { label: "➕ list", code: "<ul>\n  <li>Roblox</li>\n  <li>Pizza</li>\n  <li>Cats</li>\n</ul>", tab: "html" }] },
    steps: [
      { say: "This is <b>HTML</b>. Change the text between <code>&lt;h1&gt;</code> and <code>&lt;/h1&gt;</code> to <b>your name</b>. Watch the preview! 👀", highlight: ".st-editor", check: (c) => { const d = doc(c); const h = d && d.querySelector("h1"); return h && h.textContent.trim() && h.textContent.trim() !== "My Page"; }, poll: true, praise: "That's your page! 🌐" },
      { say: "Add a <b>list</b> of 3 favourite things with <code>&lt;ul&gt;</code> and <code>&lt;li&gt;</code>.", highlight: ".cw-snips", check: (c) => { const d = doc(c); return d && d.querySelectorAll("ul li").length >= 3; }, poll: true, hints: ["Tap ➕ list, then change the words."], praise: "A list! 📋" },
      { say: "Add a <b>button</b>: <code>&lt;button&gt;Click me&lt;/button&gt;</code>", check: (c) => { const d = doc(c); return d && d.querySelector("button"); }, poll: true, praise: "Button ready (we'll make it work in JavaScript!)" }
    ], finale: "HTML is the skeleton of every website." };
  M["hc-style"] = { track: "htmlcss", title: "Style Studio", emoji: "🎨", kind: "web", xpReward: 35, badge: "Style Star",
    goal: "Use CSS to color and shape", setup: { tabs: ["css", "html"], files: { html: '<div class="card">\n  <h1>Alexa\'s Page</h1>\n  <p>I build games.</p>\n</div>\n', css: "h1 {\n  color: black;\n}\n" },
      snippets: [{ label: "🟣 purple text", code: "h1 { color: purple; }", tab: "css" }, { label: "🃏 card style", code: ".card {\n  background: lightyellow;\n  padding: 20px;\n  border-radius: 20px;\n}", tab: "css" }] },
    steps: [
      { say: "<b>CSS</b> styles HTML. Change <code>color: black</code> to <code>color: purple</code>.", highlight: ".st-editor", check: (c) => { const d = doc(c); const h = d && d.querySelector("h1"); return h && d.defaultView.getComputedStyle(h).color !== "rgb(0, 0, 0)"; }, poll: true, praise: "Colorful! 🌈" },
      { say: "Style the <b>.card</b>: give it a background, padding and <code>border-radius</code>.", highlight: ".cw-snips", check: (c) => { const d = doc(c); const k = d && d.querySelector(".card"); if (!k) return false; const s = d.defaultView.getComputedStyle(k); return parseFloat(s.borderTopLeftRadius) > 0 && s.backgroundColor !== "rgba(0, 0, 0, 0)"; }, poll: true, hints: ["Tap 🃏 card style."], praise: "So stylish! 💅" },
      { say: "Make the heading <b>big</b>: add <code>font-size: 48px;</code> inside the h1 rule.", check: (c) => { const d = doc(c); const h = d && d.querySelector("h1"); return h && parseFloat(d.defaultView.getComputedStyle(h).fontSize) >= 40; }, poll: true, praise: "BIG! 🔠" }
    ], finale: "HTML = what's there. CSS = how it looks." };
  M["hc-layout"] = { track: "htmlcss", title: "Flex Gallery", emoji: "🖼️", kind: "web", xpReward: 40, badge: "Layout Pro",
    goal: "Lay out boxes in a row with flexbox", setup: { tabs: ["css", "html"], files: { html: '<div class="row">\n  <div class="box">🐱</div>\n  <div class="box">🐶</div>\n  <div class="box">🦄</div>\n</div>\n', css: ".box {\n  font-size: 48px;\n  background: #e0f2fe;\n  padding: 16px;\n}\n" }, snippets: [{ label: "↔️ flex row", code: ".row {\n  display: flex;\n  gap: 12px;\n}", tab: "css" }] },
    steps: [
      { say: "The boxes stack up. Put them in a <b>row</b>: give <code>.row</code> <code>display: flex;</code>", check: (c) => { const d = doc(c); const r = d && d.querySelector(".row"); return r && d.defaultView.getComputedStyle(r).display === "flex"; }, poll: true, hints: ["Tap ↔️ flex row."], praise: "Side by side! ↔️" },
      { say: "Center them: add <code>justify-content: center;</code> to .row", check: (c) => { const d = doc(c); const r = d && d.querySelector(".row"); return r && d.defaultView.getComputedStyle(r).justifyContent === "center"; }, poll: true, praise: "Perfectly centered! 🎯" }
    ], finale: "Flexbox is how real sites line things up." };

  // ---------- JavaScript ----------
  M["js-click"] = { track: "javascript", title: "Button Magic", emoji: "⚡", kind: "web", xpReward: 35, badge: "Event Expert",
    goal: "Make a button do something", setup: { tabs: ["js", "html"], files: { html: '<button id="btn">Click me!</button>\n<p id="msg">...</p>\n', js: 'const btn = document.querySelector("#btn");\nconst msg = document.querySelector("#msg");\n\nbtn.addEventListener("click", () => {\n  // ✏️ your code\n});\n' }, snippets: [{ label: "✍️ change text", code: 'msg.textContent = "You clicked! 🎉";', tab: "js" }, { label: "🎨 change color", code: 'document.body.style.background = "pink";', tab: "js" }] },
    steps: [
      { say: "JavaScript makes pages <b>do</b> things. Inside the click function, set <code>msg.textContent</code>. Then click the button in the preview!", highlight: ".cw-snips", check: (c) => { const d = doc(c); const m = d && d.querySelector("#msg"); return ev(c, "render") || ev(c, "poll") ? (m && m.textContent !== "..." ) : false; }, poll: true, hints: ["Tap ✍️ change text, then click 'Click me!' on the right."], praise: "It reacted! ⚡" },
      { say: "Also change the page <b>background</b> on click. Click to test!", check: (c) => { const d = doc(c); return d && d.body.style.background !== ""; }, poll: true, praise: "Party mode! 🎉" }
    ], finale: "addEventListener = 'when this happens, do that'." };
  M["js-counter"] = { track: "javascript", title: "Clicker Game", emoji: "🖱️", kind: "web", xpReward: 40, badge: "Variable Wizard",
    goal: "Count clicks with a variable", setup: { tabs: ["js", "html"], files: { html: '<h1 id="score">0</h1>\n<button id="tap">+1</button>\n', js: 'let score = 0;\nconst label = document.querySelector("#score");\n\ndocument.querySelector("#tap").addEventListener("click", () => {\n  // ✏️ add 1 and show it\n});\n' }, snippets: [{ label: "➕ score++", code: "score = score + 1;", tab: "js" }, { label: "🖥️ show score", code: "label.textContent = score;", tab: "js" }] },
    steps: [
      { say: "Make a clicker! In the function: add 1 to <b>score</b>, then show it. Click <b>+1</b> five times!", check: (c) => { const d = doc(c); const s = d && d.querySelector("#score"); return s && Number(s.textContent) >= 5; }, poll: true, hints: ["Use both blocks: ➕ score++ then 🖥️ show score.", "Order matters: add first, then show."], praise: "5 points! 🖱️" },
      { say: "Add a win message: <code>if (score >= 10) { label.textContent = \"You win! 🏆\"; }</code> — then click to 10.", check: (c) => { const d = doc(c); const s = d && d.querySelector("#score"); return s && /win/i.test(s.textContent); }, poll: true, hints: ["Put the if AFTER the show-score line."], praise: "Winner! 🏆" }
    ], finale: "Variables + events + if = a real game loop." };
  M["js-loop"] = { track: "javascript", title: "Emoji Factory", emoji: "🏭", kind: "web", xpReward: 40, badge: "Loop Master",
    goal: "Use a for loop to build the page", setup: { tabs: ["js", "html"], files: { html: '<ul id="list"></ul>\n', js: 'const list = document.querySelector("#list");\n\nfor (let i = 1; i <= 3; i++) {\n  const li = document.createElement("li");\n  li.textContent = "Star " + i + " ⭐";\n  list.appendChild(li);\n}\n' } },
    steps: [
      { say: "This loop made 3 list items! Change it to make <b>10</b>.", highlight: ".st-editor", check: (c) => { const d = doc(c); return d && d.querySelectorAll("#list li").length === 10; }, poll: true, hints: ["Change the 3 in i <= 3."], praise: "10 stars! ⭐" },
      { say: "Use <code>console.log(i)</code> inside the loop to print each number below.", check: (c) => c.log.slice(c.since).filter((e) => e.type === "log").length >= 5, praise: "You can see inside your code! 🔍" }
    ], finale: "Loops build lots of things with little code." };
  M["js-if"] = { track: "javascript", title: "Password Checker", emoji: "🔐", kind: "web", xpReward: 45, badge: "Decision Maker",
    goal: "Use if/else on what the user types", setup: { tabs: ["js", "html"], files: { html: '<input id="pw" placeholder="Make a password">\n<button id="check">Check</button>\n<p id="result"></p>\n', js: 'document.querySelector("#check").addEventListener("click", () => {\n  const pw = document.querySelector("#pw").value;\n  const result = document.querySelector("#result");\n  // ✏️ if pw.length >= 8 say Strong, else Too short\n});\n' }, snippets: [{ label: "🔀 if / else", code: 'if (pw.length >= 8) {\n  result.textContent = "Strong 💪";\n} else {\n  result.textContent = "Too short";\n}', tab: "js" }] },
    steps: [
      { say: "Write an <b>if / else</b>: 8+ letters → <b>Strong</b>, otherwise <b>Too short</b>. I'll test it for you when you're done!", highlight: ".cw-snips",
        check: (c) => { const d = doc(c); if (!d) return false; const i = d.querySelector("#pw"), b = d.querySelector("#check"), r = d.querySelector("#result"); if (!i || !b || !r) return false; i.value = "abc"; b.click(); const a = r.textContent; i.value = "superlongpass"; b.click(); const z = r.textContent; i.value = ""; return /short/i.test(a) && /strong/i.test(z); },
        poll: true, hints: ["Tap 🔀 if / else.", "pw.length is how many letters were typed."], praise: "I tested 'abc' and 'superlongpass' — both correct! ✅" }
    ], finale: "Your code made a decision based on what a person typed!" };

  // ---------- Full stack ----------
  M["fs-fetch"] = { track: "fullstack", title: "Joke Machine (fetch)", emoji: "🌐", kind: "web", xpReward: 45, badge: "API Explorer",
    goal: "Load data from a server API", setup: { tabs: ["js", "html"], files: { html: '<button id="go">Get jokes</button>\n<ul id="jokes"></ul>\n', js: 'document.querySelector("#go").addEventListener("click", async () => {\n  const res = await fetch("/api/jokes");\n  const jokes = await res.json();\n  console.log(jokes.length + " jokes arrived!");\n  // ✏️ show each joke in the list\n});\n' }, snippets: [{ label: "🔁 show jokes", code: 'for (const j of jokes) {\n  const li = document.createElement("li");\n  li.textContent = j.text;\n  document.querySelector("#jokes").appendChild(li);\n}', tab: "js" }] },
    steps: [
      { say: "Front end ↔ back end! Click <b>Get jokes</b> in the preview — the page asks the <b>server</b> (<code>/api/jokes</code>) for data.", check: (c) => ev(c, "fetch"), praise: "Request sent! 🌐 Look at the Output log." },
      { say: "Data arrived, but it's invisible. Loop over <code>jokes</code> and add each one to the list. Click again!", highlight: ".cw-snips", check: (c) => { const d = doc(c); return d && d.querySelectorAll("#jokes li").length >= 3; }, poll: true, hints: ["Tap 🔁 show jokes, then click the button again."], praise: "Jokes on screen! 😂" }
    ], finale: "fetch() is how apps talk to servers — like Roblox loading your avatar." };
  M["fs-post"] = { track: "fullstack", title: "To-Do Saver (POST)", emoji: "📝", kind: "web", xpReward: 50, badge: "Full Stacker",
    goal: "Send data to a server and show it", setup: { tabs: ["js", "html"], files: { html: '<input id="task" placeholder="New task">\n<button id="add">Add</button>\n<ul id="list"></ul>\n', js: 'async function load() {\n  const res = await fetch("/api/todos");\n  const todos = await res.json();\n  const list = document.querySelector("#list");\n  list.innerHTML = "";\n  todos.forEach((t) => {\n    const li = document.createElement("li");\n    li.textContent = t.text;\n    list.appendChild(li);\n  });\n}\nload();\n\ndocument.querySelector("#add").addEventListener("click", async () => {\n  const text = document.querySelector("#task").value;\n  // ✏️ POST the task, then load() again\n});\n' },
      snippets: [{ label: "📮 POST task", code: 'await fetch("/api/todos", {\n  method: "POST",\n  body: JSON.stringify({ text: text })\n});\nload();', tab: "js" }] },
    steps: [
      { say: "This app <b>GETs</b> to-dos from the server. Now make <b>Add</b> send a <b>POST</b>. Type a task in the preview and click Add!", highlight: ".cw-snips", check: (c) => c.log.slice(c.since).some((e) => e.type === "fetch" && e.method === "POST"), hints: ["Tap 📮 POST task."], praise: "Saved to the server! 📮" },
      { say: "Check it appears in the list. (The server keeps it until you refresh.)", check: (c) => { const d = doc(c); return d && d.querySelectorAll("#list li").length >= 2; }, poll: true, checkOnEnter: true, praise: "Full stack: front end + back end working together! 🧩" }
    ], finale: "GET reads data, POST saves it. That's the heart of every app." };

  // ---------- Unity (studio, Unity theme) ----------
  const SP = { kind: "spawn", name: "Player Start", x: 3, y: 3, w: 6, h: 1, color: "#5b8def", locked: true };
  M["un-scene"] = { track: "unity", title: "Build a Scene", emoji: "🎮", kind: "studio", theme: "unity", xpReward: 35, badge: "Scene Builder",
    goal: "Place Cubes as GameObjects and press Play", setup: { theme: "unity", parts: [SP, { kind: "finish", name: "Goal", x: 22, y: 5, w: 6, h: 1, color: "#fff", locked: true }], tools: ["part", "move", "scale"], defaultAnchored: true },
    steps: [
      { say: "In Unity everything is a <b>GameObject</b>. Add a <b>Cube</b> from the toolbar.", highlight: '[data-act="part"]', check: (c) => ev(c, "insert"), praise: "Cube in the Hierarchy! 🧊" },
      { say: "Build a path with Cubes to the Goal, then press <b>▶ Play</b>.", highlight: '[data-act="play"]', check: (c) => ev(c, "win"), react: (c) => ev(c, "fell") ? "Fell! Jumps must be less than 4 units. Move the Cubes closer." : null, ghost: { x: 12, y: 4, w: 4, h: 1 }, praise: "Scene works! 🎬" }
    ], finale: "Hierarchy, Inspector, Play — the Unity workflow!" };
  M["un-physics"] = { track: "unity", title: "Rigidbody Gravity", emoji: "🍎", kind: "studio", theme: "unity", xpReward: 40, badge: "Physics Fan",
    goal: "Use gravity to drop a crate into place", setup: { theme: "unity", parts: [SP, { name: "Crate", x: 11.5, y: 10, w: 4, h: 1, color: "#b45309" }, { name: "Pillar", x: 11.5, y: -1, w: 4, h: 3, color: "#6b7280", locked: true }, { kind: "finish", name: "Goal", x: 20, y: 3, w: 6, h: 1, color: "#fff", locked: true }], tools: ["move"] },
    steps: [
      { say: "The Crate floats because it's <b>Static</b>. Tap it and turn <b>Static OFF</b> in the Inspector — so a Rigidbody's gravity pulls it. Then ▶ Play!", highlight: '[data-prop="anchored"]', check: (c) => ev(c, "win"), react: (c) => ev(c, "fell") ? "Fell! Did the crate drop onto the pillar first? Turn Static OFF." : null, hints: ["Tap the brown Crate, then uncheck ⚓ Static."], praise: "Gravity built your bridge! 🍎" }
    ], finale: "Physics in Unity: Rigidbodies fall, static objects stay." };

  // ---------- Capstones ----------
  M["ca-ship"] = { track: "capA", title: "Ship It: My Arcade Page", emoji: "🚢", kind: "web", xpReward: 80, badge: "Capstone A",
    goal: "Build an interactive page — Byte reviews it", setup: { tabs: ["html", "css", "js"], files: { html: "<h1>My Arcade</h1>\n<!-- ✏️ add a button with id=\"play\" and a <p id=\"out\"> -->\n", css: "body { background: #f0f9ff; }\n", js: "// ✏️ make your button do something fun\n" } },
    steps: [
      { say: "🏆 Build your own mini arcade page: a heading, a <b>button</b>, some <b>CSS</b>, and <b>JavaScript</b> that changes the page on click. Then tap Review.<div class=\"tb-choices\"><button type=\"button\" class=\"btn btn-sun tb-review\">📝 Review my page</button></div>",
        mounted: (c, bub) => { bub.querySelector(".tb-review").onclick = () => {
          const d = doc(c); const f = E(c).files; const r = { s: [], i: [] };
          const btn = d && d.querySelector("button"); const before = d ? d.body.innerHTML : "";
          if (btn) { btn.click(); } const after = d ? d.body.innerHTML : "";
          if (d && d.querySelector("h1")) r.s.push("Clear heading — visitors know where they are."); else r.i.push("Add an <h1> title.");
          if (btn) r.s.push("You have a button to play with."); else r.i.push("Add a <button> so visitors can interact.");
          if (before !== after || /style\./.test(f.js)) r.s.push("Your JavaScript changes the page — it's interactive! ⚡"); else r.i.push("Make the button change something (text, color, a score).");
          if (f.css.split("{").length > 2) r.s.push("Nice styling with several CSS rules."); else r.i.push("Add more CSS: colors, padding, border-radius.");
          if (/if\s*\(/.test(f.js)) r.s.push("You used if — your page makes decisions."); else r.i.push("Add an if (like a win message at 10 points).");
          const html = "<h3>📝 Byte's Review</h3><h4>🌟 Strengths</h4><ul>" + r.s.map((x) => "<li>" + x + "</li>").join("") + "</ul><h4>🔧 Try next</h4><ul>" + (r.i.length ? r.i : ["Share it! Copy your files into a free site like GitHub Pages (with a grown-up)."]).slice(0, 3).map((x) => "<li>" + Tutor.esc(x) + "</li>").join("") + "</ul>";
          E(c).line("Review ready ⬆️"); const box = document.createElement("div"); box.className = "st-feedback"; box.innerHTML = html; E(c).root.querySelector(".cw-left").appendChild(box);
          E(c).emit("feedback", { score: r.s.length });
        }; },
        check: (c) => ev(c, "feedback") && c.ev.score >= 3, react: (c) => ev(c, "feedback") ? "Read my notes! Fix a couple of 🔧 things, then tap Review again." : null }
    ], finale: "You shipped a real interactive web page!" };
  M["cb-level"] = Object.assign({}, window.MISSIONS && window.MISSIONS.rbcap ? {} : {}, { track: "capB", title: "Level Up: Pro Obby", emoji: "🚀", kind: "studio", xpReward: 100, badge: "Capstone B",
    goal: "8+ parts, a checkpoint and a script — then a review", setup: null, steps: null });

  window.MISSIONS = Object.assign(window.MISSIONS || {}, M);
  // Capstone B reuses the Roblox capstone sandbox with a tougher goal
  const base = window.MISSIONS.rbcap;
  if (base) {
    const cb = window.MISSIONS["cb-level"];
    cb.setup = base.setup; cb.steps = [Object.assign({}, base.steps[0], {
      say: "🚀 <b>Level Up!</b> Build a pro obby: <b>8+ parts</b>, a <b>🚩 checkpoint</b> and at least one <b>script</b> (kill brick, vanish or color). Then beat it!",
      check: (c) => c.ev && c.ev.type === "win" && c.engine.userParts().length >= 8 && c.engine.parts.some((p) => p.kind === "checkpoint") && /\w+\.\w+\s*=/.test(c.engine.getCode()),
      react: (c) => c.ev && c.ev.type === "win" ? "Beatable! Now check the list: 8+ parts, a 🚩 checkpoint, and a script line." : null
    }), base.steps[1]];
  }
  window.MISSION_TRACKS = Object.assign(window.MISSION_TRACKS || {}, {
    python: ["py-print", "py-vars", "py-if", "py-loop", "py-func"],
    htmlcss: ["hc-tags", "hc-style", "hc-layout"],
    javascript: ["js-click", "js-counter", "js-loop", "js-if"],
    fullstack: ["fs-fetch", "fs-post"],
    unity: ["un-scene", "un-physics"],
    capA: ["ca-ship"], capB: ["cb-level"]
  });
})();
