const LESSONS_LUAU = {
  "l1": {
    "id": "l1",
    "track": "roblox",
    "title": "What is a Script?",
    "steps": [
      {
        "title": "Scripts = instructions",
        "teach": "A <strong>Script</strong> is a little program written in <strong>Luau</strong> (Roblox's language). It tells the game what to do — like 'when touched, change color'.",
        "type": "mcq",
        "prompt": "Luau is…",
        "choices": [
          "Roblox's programming language",
          "A type of Part shape",
          "A toolbar button for Terrain only",
          "A friend status"
        ],
        "answer": 0,
        "why": "Luau is the language Roblox scripts use.",
        "hint": "It's how you write instructions for the game."
      },
      {
        "title": "Where scripts live",
        "teach": "You can insert a Script inside a Part (or in ServerScriptService). For touch effects, putting a Script inside the Part is a friendly start.",
        "type": "mcq",
        "prompt": "A good first place for a 'when touched' Script?",
        "choices": [
          "Inside the Part you care about",
          "Inside the player's lunchbox",
          "Only in Lighting",
          "In the skybox texture"
        ],
        "answer": 0,
        "why": "Scripts parented to a Part can listen to that Part's events.",
        "hint": "Right-click Part → Insert Object → Script (typical flow)."
      },
      {
        "title": "script.Parent",
        "teach": "Inside a Script under a Part, <code>script.Parent</code> means 'the Part that holds this script'.",
        "type": "mcq",
        "prompt": "If a Script is inside FinishPad, script.Parent is…",
        "choices": [
          "FinishPad (the Part)",
          "The whole internet",
          "Lighting",
          "A random player"
        ],
        "answer": 0,
        "why": "Parent = the object containing the Script.",
        "hint": "Parent = container."
      },
      {
        "title": "Fill it in",
        "teach": "Remember: Script → Luau code → makes the game react.",
        "type": "fill",
        "prompt": "Roblox's scripting language is called:",
        "answerText": "luau",
        "accept": [
          "luau",
          "lua",
          "lua u"
        ],
        "why": "Luau (Lua-based) powers Roblox scripts.",
        "hint": "L _ _ _"
      }
    ]
  },
  "l2": {
    "id": "l2",
    "track": "roblox",
    "title": "Variables",
    "steps": [
      {
        "title": "Boxes for values",
        "teach": "A <strong>variable</strong> stores a value with a name. Example: <code>local points = 0</code> or <code>local pad = script.Parent</code>.",
        "type": "mcq",
        "prompt": "What does a variable do?",
        "choices": [
          "Stores a value with a name",
          "Deletes Workspace",
          "Only changes the sky",
          "Locks Anchored forever"
        ],
        "answer": 0,
        "why": "Variables remember numbers, objects, text, and more.",
        "hint": "Like a labeled box."
      },
      {
        "title": "local is common",
        "teach": "In Luau, beginners often write <code>local name = value</code>. <code>local</code> keeps the variable in that script's scope — a good habit.",
        "type": "mcq",
        "prompt": "Which line correctly makes a local variable for a Part?",
        "choices": [
          "local pad = script.Parent",
          "pad local = script.Parent",
          "script.Parent = local pad",
          "local = pad script.Parent"
        ],
        "answer": 0,
        "why": "local name = value is the usual pattern.",
        "hint": "local comes first."
      },
      {
        "title": "Change properties with variables",
        "teach": "Once you have the Part: <code>pad.BrickColor = BrickColor.new(\"Bright green\")</code> or set <code>pad.Transparency</code>.",
        "type": "mcq",
        "prompt": "To recolor a Part from a Script, you usually change a…",
        "choices": [
          "Property (like BrickColor)",
          "The Explorer title bar",
          "The Play button icon",
          "Your Wi-Fi name"
        ],
        "answer": 0,
        "why": "Scripts edit Properties in code.",
        "hint": "Same Properties panel — but from code."
      },
      {
        "title": "Practice",
        "teach": "Variables make scripts readable: name things clearly!",
        "type": "fill",
        "prompt": "Complete: local points = ___  (type the number zero)",
        "answerText": "0",
        "accept": [
          "0",
          "zero"
        ],
        "why": "Starting points at 0 is a classic pattern.",
        "hint": "The digit for none."
      }
    ]
  },
  "l3": {
    "id": "l3",
    "track": "roblox",
    "title": "Touched Event",
    "steps": [
      {
        "title": "Events = something happened",
        "teach": "An <strong>event</strong> fires when something happens. <code>Touched</code> fires when another object bumps your Part — perfect for finish pads & checkpoints!",
        "type": "mcq",
        "prompt": "Touched fires when…",
        "choices": [
          "Something bumps into the Part",
          "You open Properties",
          "You rename the place file",
          "The sun sets in real life"
        ],
        "answer": 0,
        "why": "Touched = collision/contact with the Part.",
        "hint": "Touch → Touched."
      },
      {
        "title": "Connect a function",
        "teach": "Pattern: <code>part.Touched:Connect(function(hit) … end)</code>. The code inside runs each time something touches.",
        "type": "mcq",
        "prompt": "Which piece hooks up a Touched handler?",
        "choices": [
          ":Connect(function(hit) … end)",
          ":Delete(hit)",
          ":Anchored(true)",
          ":Play()"
        ],
        "answer": 0,
        "why": "Connect attaches your function to the event.",
        "hint": "Connect the wires!"
      },
      {
        "title": "hit is the other thing",
        "teach": "The <code>hit</code> argument is usually the Part that touched you. Players' characters have Parts too — later you can check if a Humanoid touched.",
        "type": "mcq",
        "prompt": "In Touched:Connect(function(hit), hit is usually…",
        "choices": [
          "The object that touched your Part",
          "The skybox",
          "Always empty",
          "The Explorer window"
        ],
        "answer": 0,
        "why": "hit = the touching object (often a character limb Part).",
        "hint": "Who bumped me?"
      },
      {
        "title": "Idea → finish pad",
        "teach": "Finish idea: when touched, change the pad's color to green and maybe print 'You win!' in the Output window.",
        "type": "order",
        "prompt": "Order a simple finish-pad script plan:",
        "items": [
          "Get the Part with script.Parent",
          "Connect to Touched",
          "Inside the function, change color / print win",
          "Play-test by touching the pad"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Reference → connect → react → test.",
        "hint": "You need the Part before connecting."
      }
    ]
  },
  "l4": {
    "id": "l4",
    "track": "roblox",
    "title": "Change Properties in Code",
    "steps": [
      {
        "title": "Code paints Parts",
        "teach": "Examples: <code>part.Transparency = 0.5</code> (see-through), <code>part.CanCollide = false</code> (walk-through — careful!), <code>part.Anchored = true</code>.",
        "type": "mcq",
        "prompt": "Setting Transparency = 1 roughly means…",
        "choices": [
          "Fully see-through / invisible",
          "Twice as heavy",
          "Deletes the Script",
          "Locks Move tool"
        ],
        "answer": 0,
        "why": "Transparency 0 = opaque, 1 = invisible.",
        "hint": "1 = fully transparent."
      },
      {
        "title": "Safety first",
        "teach": "Don't turn CanCollide off on every platform or players fall through! Use property changes on purpose.",
        "type": "mcq",
        "prompt": "If players fall through a platform, check…",
        "choices": [
          "CanCollide (and Anchored)",
          "Only the sky color",
          "Friend list",
          "Plugin Manager only"
        ],
        "answer": 0,
        "why": "CanCollide false = no solid collision.",
        "hint": "Collision settings matter."
      },
      {
        "title": "Tiny win script",
        "teach": "A first win: on Touch, set BrickColor to bright green. That's real interactivity!",
        "type": "mcq",
        "prompt": "Best first interactive goal?",
        "choices": [
          "Touch pad → change color (or print You win)",
          "Rewrite all of Roblox",
          "Disable Studio permanently",
          "Remove all Parts"
        ],
        "answer": 0,
        "why": "Small wins teach the full loop.",
        "hint": "Keep the first script tiny."
      },
      {
        "title": "Capstone ready",
        "teach": "You can build platforms AND make a finish react. Head to the Mini-Game Project for a checklist & feedback!",
        "type": "fill",
        "prompt": "Event that runs when something bumps a Part:",
        "answerText": "touched",
        "accept": [
          "touched",
          "touch",
          ".touched"
        ],
        "why": "Touched is the go-to contact event.",
        "hint": "T _ _ _ _ _ _"
      }
    ]
  }
};
