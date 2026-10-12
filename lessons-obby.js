const LESSONS_OBBY = {
  "o1": {
    "id": "o1",
    "track": "roblox",
    "title": "What is an Obby?",
    "steps": [
      {
        "title": "Obstacle course!",
        "teach": "An <strong>obby</strong> is a Roblox obstacle course — jump across platforms, avoid falling, reach the end. Floating platforms & spheres are classic obby pieces!",
        "type": "mcq",
        "prompt": "An obby is mainly…",
        "choices": [
          "A jumping obstacle course",
          "A cooking recipe",
          "A chat filter",
          "A type of friend request"
        ],
        "answer": 0,
        "why": "Obby = obstacle course (parkour-style levels).",
        "hint": "Jump… jump… don't fall!"
      },
      {
        "title": "Start → Middle → End",
        "teach": "Good obbies have a clear <strong>start</strong>, a path of challenges, and a clear <strong>finish</strong> (often a special Part or sphere).",
        "type": "order",
        "prompt": "Order a simple obby plan:",
        "items": [
          "Place a starting platform",
          "Add a few jumping platforms",
          "Add a bright finish Part",
          "Play-test the whole path"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Start → challenges → finish → test.",
        "hint": "You need somewhere to begin!"
      },
      {
        "title": "Spheres are fun",
        "teach": "Sphere Parts make cool stepping stones or decorations. They're still Parts — just a different shape from the Part menu.",
        "type": "mcq",
        "prompt": "A sphere in your obby is still a…",
        "choices": [
          "Part (different shape)",
          "Script",
          "Player",
          "Sound only"
        ],
        "answer": 0,
        "why": "Sphere is a Part shape option.",
        "hint": "Same family as Block Parts."
      },
      {
        "title": "Name it",
        "teach": "If Alexa can jump it after 1–2 tries, the gap is fair. If nobody can, move platforms closer.",
        "type": "fill",
        "prompt": "Type the nickname for a Roblox obstacle course:",
        "answerText": "obby",
        "accept": [
          "obby",
          "obbie",
          "obstacle course"
        ],
        "why": "Players say 'obby' for obstacle course.",
        "hint": "O _ _ _"
      }
    ]
  },
  "o2": {
    "id": "o2",
    "track": "roblox",
    "title": "Layout & Spacing",
    "steps": [
      {
        "title": "Path you can read",
        "teach": "Players should 'see' where to go next. Line platforms up, use colors, or make the next platform slightly brighter.",
        "type": "mcq",
        "prompt": "What helps players know where to jump next?",
        "choices": [
          "Clear layout and colors that guide the eye",
          "Hiding all platforms",
          "Random tiny Parts everywhere",
          "Turning Anchored off on everything"
        ],
        "answer": 0,
        "why": "Readable paths feel fun, not confusing.",
        "hint": "Guide the eye like arrows made of color."
      },
      {
        "title": "Difficulty ramp",
        "teach": "Start easy. Make later jumps a bit harder. Sudden impossible jumps frustrate everyone!",
        "type": "mcq",
        "prompt": "Best difficulty pattern?",
        "choices": [
          "Easy at first, harder later",
          "Impossible first jump",
          "No finish line",
          "Same tiny gap forever with no change"
        ],
        "answer": 0,
        "why": "Warm up, then challenge.",
        "hint": "Like levels in a video game."
      },
      {
        "title": "Keep v1 simple",
        "teach": "Some obbies use red 'lava' Parts that reset you. For v1, falling off into the void is enough!",
        "type": "mcq",
        "prompt": "For a first mini-obby, what's enough as a fail?",
        "choices": [
          "Falling off the platforms",
          "Needing 50 scripts on day one",
          "Deleting Workspace",
          "Disabling Play"
        ],
        "answer": 0,
        "why": "Falling is simple and clear feedback.",
        "hint": "Keep version 1 simple."
      },
      {
        "title": "Spacing check",
        "teach": "After placing 3–5 platforms, Play and try every jump yourself.",
        "type": "mcq",
        "prompt": "You just placed five platforms. Next best step?",
        "choices": [
          "Play-test each jump",
          "Publish without testing",
          "Close Studio",
          "Add 200 Parts instantly"
        ],
        "answer": 0,
        "why": "Test early and often.",
        "hint": "Build → Play → Fix."
      }
    ]
  },
  "o3": {
    "id": "o3",
    "track": "roblox",
    "title": "Checkpoints (Idea)",
    "steps": [
      {
        "title": "What is a checkpoint?",
        "teach": "A <strong>checkpoint</strong> remembers how far you got. If you fall, you respawn there — not all the way at the start. (Later you'll script this!)",
        "type": "mcq",
        "prompt": "A checkpoint mainly helps by…",
        "choices": [
          "Saving progress so falls hurt less",
          "Making Parts invisible",
          "Changing your username",
          "Removing the finish"
        ],
        "answer": 0,
        "why": "Checkpoints reduce frustration on longer courses.",
        "hint": "Like a save point in a game."
      },
      {
        "title": "Mark it visually",
        "teach": "Even before scripting, place a special colored Part or sphere and name it <em>Checkpoint1</em> so you remember where saves will go.",
        "type": "mcq",
        "prompt": "Smart pre-script habit?",
        "choices": [
          "Name and color special Parts clearly",
          "Use random names like Part99102",
          "Never use Explorer",
          "Hide the finish forever"
        ],
        "answer": 0,
        "why": "Clear names make scripting easier later.",
        "hint": "Future-you will thank present-you."
      },
      {
        "title": "Where to put them",
        "teach": "Put checkpoints after tough sections — not every single jump.",
        "type": "mcq",
        "prompt": "Best place for a checkpoint?",
        "choices": [
          "After a hard section",
          "Inside the void below the map",
          "On every tiny decoration Part",
          "Only in Lighting"
        ],
        "answer": 0,
        "why": "Reward progress past hard parts.",
        "hint": "After the spicy jump, not before."
      },
      {
        "title": "Concept check",
        "teach": "You'll learn the Touched event later to detect when a player steps on a checkpoint Part.",
        "type": "fill",
        "prompt": "What do we call a save-point Part in an obby? (one word)",
        "answerText": "checkpoint",
        "accept": [
          "checkpoint",
          "checkpoints",
          "check point"
        ],
        "why": "Checkpoint = progress save spot.",
        "hint": "Check _ _ _ _ _"
      }
    ]
  },
  "o4": {
    "id": "o4",
    "track": "roblox",
    "title": "Goals & Polish",
    "steps": [
      {
        "title": "A clear win",
        "teach": "Players need a goal: reach the gold sphere, touch the green pad, or stand on the trophy Part.",
        "type": "mcq",
        "prompt": "What makes an obby feel complete?",
        "choices": [
          "A clear finish players can reach",
          "Infinite identical platforms with no end",
          "No Parts at all",
          "Only a skybox"
        ],
        "answer": 0,
        "why": "A finish gives meaning to the jumps.",
        "hint": "Celebrations need a finish line!"
      },
      {
        "title": "Polish checklist",
        "teach": "Anchored platforms ✓ · Fair gaps ✓ · Bright finish ✓ · Named Parts ✓ · Play-tested ✓",
        "type": "order",
        "prompt": "Order a polish pass:",
        "items": [
          "Check Anchored on platforms",
          "Fix unfair gaps in Play mode",
          "Color & name the finish Part",
          "Do one full successful run"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Stable Parts → fair jumps → clear finish → victory run.",
        "hint": "Don't celebrate before Parts stay put!"
      },
      {
        "title": "Share the fun",
        "teach": "When the course works, show a parent or friend — or describe it in the Mini-Game Project page for feedback!",
        "type": "mcq",
        "prompt": "After your mini-obby works, a great next step is…",
        "choices": [
          "Show someone / get feedback",
          "Delete it immediately",
          "Never Play again",
          "Turn Anchored off on purpose"
        ],
        "answer": 0,
        "why": "Sharing builds confidence and ideas.",
        "hint": "Code Companion's project page can help!"
      },
      {
        "title": "You did it!",
        "teach": "Building + testing is real game design. Next track: Luau scripts to make Parts react!",
        "type": "mcq",
        "prompt": "Luau scripts will help you…",
        "choices": [
          "Make Parts react (touch, change color, checkpoints)",
          "Cook pasta",
          "Replace Explorer forever",
          "Remove the need to Play-test"
        ],
        "answer": 0,
        "why": "Scripts add behavior to your builds.",
        "hint": "Touched events are coming soon…"
      }
    ]
  }
};
