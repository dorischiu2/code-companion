const LESSONS_JAVASCRIPT = {
  "js1": {
    "id": "js1",
    "track": "javascript",
    "title": "What is JavaScript?",
    "steps": [
      {
        "title": "JS role",
        "teach": "JavaScript makes web pages interactive in the browser — clicks, messages, animations.",
        "type": "mcq",
        "prompt": "JavaScript’s common home is…",
        "choices": [
          "The web browser",
          "Only Roblox Studio Workspace",
          "Only Unity Hub",
          "Only Scratch Jr tablets"
        ],
        "answer": 0,
        "why": "Browsers run JS.",
        "hint": "Pages that react."
      },
      {
        "title": "script tag",
        "teach": "You can put JS in <script>…</script> or a .js file linked from HTML.",
        "type": "mcq",
        "prompt": "A <script> tag holds…",
        "choices": [
          "JavaScript code",
          "CSS only forever",
          "Python indentation",
          "Luau Parts"
        ],
        "answer": 0,
        "why": "script = JS container.",
        "hint": "Inside HTML or linked."
      },
      {
        "title": "console.log",
        "teach": "console.log(\"hi\") prints to the browser console (DevTools) — like Python print for debugging.",
        "type": "mcq",
        "prompt": "console.log is mainly for…",
        "choices": [
          "Debugging / showing messages in the console",
          "Anchoring Parts",
          "Painting Unity skies",
          "Snapping Hopscotch rules"
        ],
        "answer": 0,
        "why": "Console helps you see values.",
        "hint": "Open DevTools → Console."
      },
      {
        "title": "Name",
        "teach": "The web interactivity language is…",
        "type": "fill",
        "prompt": "One word (JS full name idea ok):",
        "answerText": "javascript",
        "accept": [
          "javascript",
          "js",
          "java script"
        ],
        "why": "JavaScript (often JS).",
        "hint": "J _ _ _ S _ _ _ _ _"
      }
    ]
  },
  "js2": {
    "id": "js2",
    "track": "javascript",
    "title": "Variables & Functions",
    "steps": [
      {
        "title": "let/const",
        "teach": "let score = 0; stores a value. const PI = 3.14 stays fixed.",
        "type": "mcq",
        "prompt": "let score = 0 creates a…",
        "choices": [
          "Variable",
          "Scene",
          "Sprite",
          "Part"
        ],
        "answer": 0,
        "why": "Variables store values.",
        "hint": "Same idea as Python."
      },
      {
        "title": "Functions",
        "teach": "function greet() { … } packages steps you can call later with greet().",
        "type": "mcq",
        "prompt": "A function is…",
        "choices": [
          "A reusable bundle of steps",
          "A CSS color only",
          "A Unity cube mesh",
          "A green flag costume"
        ],
        "answer": 0,
        "why": "Functions organize behavior.",
        "hint": "Name → call."
      },
      {
        "title": "Call it",
        "teach": "Defining a function doesn’t run it until you call it.",
        "type": "mcq",
        "prompt": "After function wave(){…}, you run it by…",
        "choices": [
          "Writing wave()",
          "Deleting HTML",
          "Anchoring it",
          "Buying a new router"
        ],
        "answer": 0,
        "why": "Call with parentheses.",
        "hint": "wave()."
      },
      {
        "title": "Keyword",
        "teach": "Declare a changeable variable with…",
        "type": "fill",
        "prompt": "Three-letter keyword often used:",
        "answerText": "let",
        "accept": [
          "let",
          "var"
        ],
        "why": "let is modern JS for variables.",
        "hint": "l _ _"
      }
    ]
  },
  "js3": {
    "id": "js3",
    "track": "javascript",
    "title": "Talk to the Page",
    "steps": [
      {
        "title": "querySelector",
        "teach": "document.querySelector(\"#msg\") finds an element on the page.",
        "type": "mcq",
        "prompt": "document.querySelector finds…",
        "choices": [
          "A page element",
          "A Roblox Humanoid only",
          "A Unity Scene asset only",
          "A Scratch backpack"
        ],
        "answer": 0,
        "why": "DOM selection grabs elements.",
        "hint": "CSS-style selectors."
      },
      {
        "title": "textContent",
        "teach": "el.textContent = \"You win!\" changes the text you see.",
        "type": "mcq",
        "prompt": "textContent changes…",
        "choices": [
          "Visible text",
          "Your OS password",
          "Python’s indent rules",
          "Hopscotch object IDs only"
        ],
        "answer": 0,
        "why": "Update text in the DOM.",
        "hint": "Hello → You win!"
      },
      {
        "title": "Button plan",
        "teach": "",
        "type": "order",
        "prompt": "Order a click-to-change feature:",
        "items": [
          "Make a button in HTML",
          "Select it in JS",
          "Add a click listener",
          "Change text or color inside the handler"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "HTML → select → listen → change.",
        "hint": "Need the button first."
      },
      {
        "title": "addEventListener",
        "teach": "button.addEventListener(\"click\", handler) runs code on click — like Touched/When/Click events!",
        "type": "mcq",
        "prompt": "addEventListener(\"click\") is similar energy to…",
        "choices": [
          "Scratch/App Inventor click events",
          "Only CSS margins",
          "Only Unity lighting probes",
          "Only Excel charts"
        ],
        "answer": 0,
        "why": "Events everywhere.",
        "hint": "Click → function."
      }
    ]
  },
  "js4": {
    "id": "js4",
    "track": "javascript",
    "title": "Mini Interactive Page",
    "steps": [
      {
        "title": "alert",
        "teach": "alert(\"Hi!\") pops a message — fine for learning, a bit annoying in real apps.",
        "type": "mcq",
        "prompt": "alert shows…",
        "choices": [
          "A popup message",
          "A Roblox Part",
          "A Unity Terrain tile",
          "A Scratch sound automatically"
        ],
        "answer": 0,
        "why": "alert = popup.",
        "hint": "Use sparingly."
      },
      {
        "title": "if in JS",
        "teach": "if (score >= 10) { … } works like Python if — decisions!",
        "type": "mcq",
        "prompt": "if in JS is for…",
        "choices": [
          "Decisions",
          "Only styling fonts",
          "Only meshes",
          "Only Designer components"
        ],
        "answer": 0,
        "why": "Conditions branch code.",
        "hint": "True → run."
      },
      {
        "title": "Project idea",
        "teach": "Button says “Click me” → JS changes a paragraph to “You did it!” — perfect JS capstone starter.",
        "type": "mcq",
        "prompt": "A great first JS project is…",
        "choices": [
          "Click → change something on the page",
          "Rewrite the browser engine",
          "Delete all HTML tags",
          "Compile Unity from JS only"
        ],
        "answer": 0,
        "why": "Tiny interactive wins.",
        "hint": "One button is enough."
      },
      {
        "title": "Event name",
        "teach": "addEventListener first argument for a mouse press is often…",
        "type": "fill",
        "prompt": "Word:",
        "answerText": "click",
        "accept": [
          "click"
        ],
        "why": "click is the common event.",
        "hint": "c _ _ _ _"
      }
    ]
  }
};
