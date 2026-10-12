const LESSONS_ROBLOX = {
  "r1": {
    "id": "r1",
    "track": "roblox",
    "title": "What is a Part?",
    "steps": [
      {
        "title": "Parts are building blocks",
        "teach": "In Roblox Studio, a <strong>Part</strong> is a 3D shape you can place in your world — like a brick, a platform, or a ball. Most games start by adding Parts!",
        "type": "mcq",
        "prompt": "What is a Part in Roblox Studio?",
        "choices": [
          "A 3D shape you place in your world",
          "A music song",
          "A player's username",
          "A type of virus"
        ],
        "answer": 0,
        "why": "Parts are the basic 3D shapes (blocks, spheres, wedges…) you build with.",
        "hint": "Think of LEGO bricks — Parts are like those bricks in 3D."
      },
      {
        "title": "Add a Part",
        "teach": "Look at the top toolbar. Click the <strong>Part</strong> button (often under Home). A new block appears in your world!",
        "type": "mcq",
        "prompt": "Where do you usually click to add a new Part?",
        "choices": [
          "The Home toolbar → Part button",
          "The trash can",
          "The Play button only",
          "File → Quit"
        ],
        "answer": 0,
        "why": "The Part button on the Home tab inserts a new block into the workspace.",
        "hint": "It's on the top ribbon, near other building tools."
      },
      {
        "title": "Explorer shows Parts",
        "teach": "The <strong>Explorer</strong> panel lists everything in your game. When you add a Part, you should see it under Workspace.",
        "type": "mcq",
        "prompt": "Where do new Parts usually show up in Explorer?",
        "choices": [
          "Under Workspace",
          "Under Lighting only",
          "Under Players",
          "Under StarterGui only"
        ],
        "answer": 0,
        "why": "Workspace holds the 3D objects players see and touch.",
        "hint": "Explorer is the list on the side — look for Workspace."
      },
      {
        "title": "Quick check",
        "teach": "You're ready to place your first platform!",
        "type": "fill",
        "prompt": "Type the word for a 3D building block in Roblox (one word):",
        "answerText": "part",
        "accept": [
          "part",
          "parts"
        ],
        "why": "A Part is Roblox's basic 3D object.",
        "hint": "P _ _ _"
      }
    ]
  },
  "r2": {
    "id": "r2",
    "track": "roblox",
    "title": "Move, Scale & Rotate",
    "steps": [
      {
        "title": "Three magic tools",
        "teach": "Use <strong>Move</strong> (arrows) to slide a Part, <strong>Scale</strong> to resize it, and <strong>Rotate</strong> to spin it.",
        "type": "mcq",
        "prompt": "Which tool makes a Part bigger or smaller?",
        "choices": [
          "Scale",
          "Move",
          "Play",
          "Terrain"
        ],
        "answer": 0,
        "why": "Scale changes size. Move changes position. Rotate changes angle.",
        "hint": "Bigger/smaller = scale, like scaling a drawing."
      },
      {
        "title": "Move for platforms",
        "teach": "For an obby, Move your platforms so players can jump from one to the next — leave small gaps!",
        "type": "order",
        "prompt": "Put these steps in order to place a floating platform:",
        "items": [
          "Click Part to add a block",
          "Use Move to lift it into the air",
          "Use Scale to make it a flat platform",
          "Press Play to test jumping on it"
        ],
        "answerOrder": [
          0,
          2,
          1,
          3
        ],
        "why": "Add → shape → place → test is a solid building loop.",
        "hint": "You can't Move it before it exists!"
      },
      {
        "title": "What would you click?",
        "teach": "Imagine your platform is too thick — like a cube instead of a flat step.",
        "type": "mcq",
        "prompt": "What would you click/use to flatten it?",
        "choices": [
          "Scale tool",
          "Play button",
          "Delete everything",
          "Camera only"
        ],
        "answer": 0,
        "why": "Scale the height down to make a thin platform.",
        "hint": "You need to change the Part's size."
      },
      {
        "title": "Rotate carefully",
        "teach": "Rotate is great for ramps and angled steps — but tiny mistakes can make jumps unfair. Rotate a little, then Play-test!",
        "type": "mcq",
        "prompt": "Best habit after rotating a platform?",
        "choices": [
          "Press Play and test the jump",
          "Never test",
          "Close Studio",
          "Delete the Part"
        ],
        "answer": 0,
        "why": "Play-testing catches unfair jumps early.",
        "hint": "Builders always try their own levels."
      }
    ]
  },
  "r3": {
    "id": "r3",
    "track": "roblox",
    "title": "Play Test!",
    "steps": [
      {
        "title": "Play means try it",
        "teach": "The <strong>Play</strong> button runs your game so you become a player. You can jump on Parts and see if your obby works!",
        "type": "mcq",
        "prompt": "What does the Play button do?",
        "choices": [
          "Lets you test your game as a player",
          "Uploads your homework",
          "Deletes all Parts",
          "Turns off your computer"
        ],
        "answer": 0,
        "why": "Play starts a test session inside Studio.",
        "hint": "It looks like a triangle — like play on a video."
      },
      {
        "title": "Stop when done",
        "teach": "Click <strong>Stop</strong> to leave Play mode and go back to editing. Edit while Stopped so changes stick!",
        "type": "mcq",
        "prompt": "When should you edit Parts (Move/Scale)?",
        "choices": [
          "While Stopped (edit mode)",
          "Only while Playing",
          "Never",
          "Only at midnight"
        ],
        "answer": 0,
        "why": "Edit in Stop mode so your changes save to the place.",
        "hint": "Stop first, then build."
      },
      {
        "title": "Falling is feedback",
        "teach": "If you fall between platforms, the gap is too big or the platform is too small. That's not failure — it's a clue!",
        "type": "mcq",
        "prompt": "You fall between two platforms. What's a smart fix?",
        "choices": [
          "Move them closer or Scale them bigger",
          "Delete Roblox",
          "Add 100 invisible walls randomly",
          "Never Play again"
        ],
        "answer": 0,
        "why": "Adjust spacing and size until jumps feel fair.",
        "hint": "Obbies should be challenge — not impossible."
      },
      {
        "title": "Fill blank",
        "teach": "Remember the loop: Build → Play → Fix → Play again.",
        "type": "fill",
        "prompt": "What button lets you try your game? (one word)",
        "answerText": "play",
        "accept": [
          "play",
          "playtest",
          "play test"
        ],
        "why": "Play (playtest) is how you feel your level as a player.",
        "hint": "P _ _ _"
      }
    ]
  },
  "r4": {
    "id": "r4",
    "track": "roblox",
    "title": "Explorer & Properties",
    "steps": [
      {
        "title": "Two helpful panels",
        "teach": "<strong>Explorer</strong> = list of objects. <strong>Properties</strong> = settings for the selected object (Color, Material, Name, Anchored…).",
        "type": "mcq",
        "prompt": "Which panel lets you change a Part's Color?",
        "choices": [
          "Properties",
          "Toolbox only",
          "Output",
          "Plugins only"
        ],
        "answer": 0,
        "why": "Select a Part, then edit Color in Properties.",
        "hint": "Properties shows details of what's selected."
      },
      {
        "title": "Anchored matters",
        "teach": "If <strong>Anchored</strong> is off, a Part can fall with gravity when you Play. Platforms should usually be <strong>Anchored = on</strong> so they stay floating!",
        "type": "mcq",
        "prompt": "Your floating platform falls when you Play. Likely fix?",
        "choices": [
          "Turn Anchored on in Properties",
          "Make it invisible",
          "Rename it to Floor",
          "Change the sky color"
        ],
        "answer": 0,
        "why": "Anchored locks the Part in place in the world.",
        "hint": "Gravity pulls unanchored Parts down."
      },
      {
        "title": "Name your Parts",
        "teach": "In Properties, set a clear Name like <em>Platform1</em> or <em>FinishSphere</em>. Names help when you start scripting later!",
        "type": "mcq",
        "prompt": "Why name Parts clearly?",
        "choices": [
          "So scripts (and you) can find them easily",
          "Names make Parts heavier",
          "Roblox requires emoji names",
          "It deletes the Part"
        ],
        "answer": 0,
        "why": "Good names = easier building and scripting.",
        "hint": "FinishPad is clearer than Part37."
      },
      {
        "title": "Color the finish",
        "teach": "Make the finish stand out — bright green or gold helps players know where to go.",
        "type": "mcq",
        "prompt": "Best place to change a Part to bright green?",
        "choices": [
          "Properties → Color / BrickColor",
          "Play → Chat",
          "Explorer → Lighting only",
          "File → Save As only"
        ],
        "answer": 0,
        "why": "Color lives in the Properties panel.",
        "hint": "Select the Part first."
      }
    ]
  }
};
