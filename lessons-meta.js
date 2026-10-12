const TRACKS = [
  {
    "id": "scratchjr",
    "name": "Scratch Jr",
    "emoji": "🐤",
    "desc": "Drag blocks · tell a story",
    "css": "t-sj",
    "color": "#FDE68A",
    "lessons": [
      "sj1",
      "sj2",
      "sj3"
    ],
    "order": 1
  },
  {
    "id": "hopscotch",
    "name": "Hopscotch",
    "emoji": "📱",
    "desc": "Tap code on a tablet",
    "css": "t-hop",
    "color": "#F9A8D4",
    "lessons": [
      "hs1",
      "hs2"
    ],
    "order": 2
  },
  {
    "id": "scratch",
    "name": "Scratch",
    "emoji": "🐱",
    "desc": "Sprites, loops & costumes",
    "css": "t-sc",
    "color": "#FDBA74",
    "lessons": [
      "sc1",
      "sc2",
      "sc3",
      "sc4"
    ],
    "order": 3
  },
  {
    "id": "appinventor",
    "name": "MIT App Inventor",
    "emoji": "📲",
    "desc": "Build a simple phone app",
    "css": "t-ai",
    "color": "#93C5FD",
    "lessons": [
      "ai1",
      "ai2"
    ],
    "order": 4
  },
  {
    "id": "roblox",
    "name": "Roblox (Luau)",
    "emoji": "🧱",
    "desc": "Studio, obby & scripts",
    "css": "t-rb",
    "color": "#86EFAC",
    "lessons": [
      "r1",
      "r2",
      "r3",
      "r4",
      "o1",
      "o2",
      "o3",
      "o4",
      "l1",
      "l2",
      "l3",
      "l4"
    ],
    "order": 5
  },
  {
    "id": "python",
    "name": "Python",
    "emoji": "🐍",
    "desc": "Print, variables & loops",
    "css": "t-py",
    "color": "#A5B4FC",
    "lessons": [
      "py1",
      "py2",
      "py3",
      "py4"
    ],
    "order": 6
  },
  {
    "id": "unity",
    "name": "Unity",
    "emoji": "🕹️",
    "desc": "Scenes, GameObjects, C# taste",
    "css": "t-un",
    "color": "#C4B5FD",
    "lessons": [
      "un1",
      "un2"
    ],
    "order": 7
  },
  {
    "id": "htmlcss",
    "name": "HTML & CSS",
    "emoji": "🌐",
    "desc": "Web pages that look cool",
    "css": "t-web",
    "color": "#7DD3FC",
    "lessons": [
      "hc1",
      "hc2",
      "hc3"
    ],
    "order": 8
  },
  {
    "id": "javascript",
    "name": "JavaScript",
    "emoji": "💛",
    "desc": "Make web pages interactive",
    "css": "t-js",
    "color": "#FDE047",
    "lessons": [
      "js1",
      "js2",
      "js3",
      "js4"
    ],
    "order": 9
  },
  {
    "id": "fullstack",
    "name": "Full Stack",
    "emoji": "🧩",
    "desc": "Front + back working together",
    "css": "t-fs",
    "color": "#FDA4AF",
    "lessons": [
      "fs1",
      "fs2"
    ],
    "order": 10
  },
  {
    "id": "capA",
    "name": "Capstone A",
    "emoji": "🏆",
    "desc": "Build & share a mini project",
    "css": "t-ca",
    "color": "#FBBF24",
    "lessons": [
      "ca1",
      "ca2"
    ],
    "order": 11
  },
  {
    "id": "capB",
    "name": "Capstone B",
    "emoji": "🚀",
    "desc": "Level-up project + polish",
    "css": "t-cb",
    "color": "#F472B6",
    "lessons": [
      "cb1",
      "cb2"
    ],
    "order": 12
  }
];

const CAPSTONES = {
  "scratchjr": {
    "title": "Scratch Jr Story Capstone",
    "blurb": "Make a 3-page story with a character that moves!",
    "items": [
      "I opened Scratch Jr and started a new project",
      "I added a character (sprite)",
      "My character moves on at least one page",
      "I used a Start on Green Flag (or tap) block",
      "I have at least 2 pages / scenes",
      "I showed my story to someone"
    ],
    "keywords_strength": [
      "move",
      "page",
      "character",
      "story",
      "flag",
      "sprite"
    ],
    "next": "Try Hopscotch next — same idea, more on a tablet!"
  },
  "hopscotch": {
    "title": "Hopscotch Mini Capstone",
    "blurb": "Make an object move when you tap the screen.",
    "items": [
      "I opened Hopscotch and made a new project",
      "I added an object/character",
      "I used a When rule (like When iPad is tapped)",
      "Something moves or changes when I tap",
      "I Play-tested my project"
    ],
    "keywords_strength": [
      "tap",
      "when",
      "move",
      "play",
      "object"
    ],
    "next": "Ready for Scratch on a computer — sprites & loops!"
  },
  "scratch": {
    "title": "Scratch Game Capstone",
    "blurb": "Make a sprite move with arrows and collect something (or say hi).",
    "items": [
      "I have a sprite and a backdrop",
      "I use event blocks (green flag)",
      "My sprite moves with keys or mouse",
      "I used a loop (forever or repeat)",
      "I used a costume change OR a sound",
      "I shared or showed my project"
    ],
    "keywords_strength": [
      "sprite",
      "loop",
      "forever",
      "key",
      "costume",
      "backdrop",
      "flag"
    ],
    "next": "Try MIT App Inventor — drag blocks for a phone app!"
  },
  "appinventor": {
    "title": "App Inventor Capstone",
    "blurb": "Make a tiny app with a button that does something.",
    "items": [
      "I opened MIT App Inventor (Designer view)",
      "I added a Button (and maybe a Label)",
      "I switched to Blocks view",
      "When Button.Click does something (text / sound / color)",
      "I used the emulator or a device to test"
    ],
    "keywords_strength": [
      "button",
      "click",
      "label",
      "blocks",
      "designer"
    ],
    "next": "Roblox Studio time — build in 3D with Parts & Luau!"
  },
  "roblox": {
    "title": "Roblox Mini-Game Capstone",
    "blurb": "Build a tiny obby with a clear finish (optional Touched script).",
    "items": [
      "I opened Roblox Studio and made a place",
      "I added at least 3 platform Parts",
      "I used Move / Scale (and maybe Rotate)",
      "Platforms are Anchored",
      "I Play-tested my jumps",
      "I have a clear finish Part",
      "I named important Parts",
      "Bonus: I tried a Script or Touched idea"
    ],
    "keywords_strength": [
      "platform",
      "part",
      "sphere",
      "obby",
      "jump",
      "script",
      "touch",
      "anchored"
    ],
    "next": "Python next — text coding that works everywhere!"
  },
  "python": {
    "title": "Python Capstone",
    "blurb": "Write a tiny program that greets you and counts or loops.",
    "items": [
      "I can run Python (editor, Replit, or terminal)",
      "I used print() to show a message",
      "I stored something in a variable",
      "I used an if statement OR a for/while loop",
      "My program runs without errors",
      "I showed someone the output"
    ],
    "keywords_strength": [
      "print",
      "variable",
      "loop",
      "if",
      "for",
      "while",
      "input"
    ],
    "next": "Peek at Unity — how big games organize scenes!"
  },
  "unity": {
    "title": "Unity Capstone",
    "blurb": "Make a scene with a GameObject that you can see in Play mode.",
    "items": [
      "I opened Unity Hub / a starter project",
      "I know what a Scene is",
      "I added a GameObject (cube / sprite)",
      "I used the Inspector to change something",
      "I pressed Play to test"
    ],
    "keywords_strength": [
      "scene",
      "gameobject",
      "inspector",
      "play",
      "cube"
    ],
    "next": "HTML & CSS — build pages you can open in a browser!"
  },
  "htmlcss": {
    "title": "HTML/CSS Capstone",
    "blurb": "Make a one-page profile: heading, paragraph, and a styled color.",
    "items": [
      "I created an .html file",
      "I used h1 and p tags",
      "I added a little CSS (color or background)",
      "I opened it in a browser",
      "It looks neat enough to show a friend"
    ],
    "keywords_strength": [
      "html",
      "css",
      "h1",
      "color",
      "page",
      "browser"
    ],
    "next": "JavaScript — make that page interactive!"
  },
  "javascript": {
    "title": "JavaScript Capstone",
    "blurb": "Make a button that changes text or color on a page.",
    "items": [
      "I have an HTML page with a button",
      "I wrote a <script> or a .js file",
      "I used document.querySelector or getElementById",
      "A click changes something on the page",
      "I tested in the browser"
    ],
    "keywords_strength": [
      "button",
      "click",
      "function",
      "queryselector",
      "document",
      "alert"
    ],
    "next": "Full Stack intro — how front and back talk!"
  },
  "fullstack": {
    "title": "Full Stack Capstone",
    "blurb": "Explain (or sketch) a tiny app with a front and a back.",
    "items": [
      "I can say what the frontend shows",
      "I can say what the backend stores or decides",
      "I named one API idea (like save score)",
      "I drew or listed 3 screens/pages",
      "I know where user data should NOT be secret on the frontend"
    ],
    "keywords_strength": [
      "frontend",
      "backend",
      "api",
      "server",
      "database"
    ],
    "next": "Capstone A — pick a stack and ship a mini project!"
  },
  "capA": {
    "title": "Capstone A — Ship It",
    "blurb": "Finish one mini project from any earlier track and share it.",
    "items": [
      "I picked ONE project idea",
      "I finished a playable / runnable version",
      "I Play-tested (or ran) it myself",
      "I wrote 3 sentences about how it works",
      "I showed a parent or friend",
      "I listed 2 things I'd improve next"
    ],
    "keywords_strength": [
      "project",
      "test",
      "share",
      "improve",
      "finish"
    ],
    "next": "Capstone B — polish and level-up!"
  },
  "capB": {
    "title": "Capstone B — Level Up",
    "blurb": "Improve Capstone A with one new feature and nicer polish.",
    "items": [
      "I improved Capstone A (or started a stronger remake)",
      "I added ONE new feature",
      "I fixed at least one bug or unfair bit",
      "I improved looks or instructions for players",
      "I demoed the before → after",
      "I wrote what I learned on the whole path"
    ],
    "keywords_strength": [
      "feature",
      "polish",
      "bug",
      "demo",
      "learn"
    ],
    "next": "You're a Code Companion graduate — keep building!"
  }
};


const CAP_ITEMS = (CAPSTONES.roblox.items || []).map((text, i) => ({ id: "c" + (i+1), text }));
