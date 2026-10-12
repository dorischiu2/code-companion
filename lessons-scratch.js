const LESSONS_SCRATCH = {
  "sc1": {
    "id": "sc1",
    "track": "scratch",
    "title": "Meet Scratch",
    "steps": [
      {
        "title": "Scratch stage",
        "teach": "Scratch is a free coding site/app from MIT. You snap blocks to make sprites act on the Stage.",
        "type": "mcq",
        "prompt": "Scratch programs are mostly built with…",
        "choices": [
          "Blocks you snap together",
          "Only secret Morse code",
          "Only paper origami",
          "Only robot oil"
        ],
        "answer": 0,
        "why": "Scratch is block-based.",
        "hint": "Puzzle-piece code."
      },
      {
        "title": "Sprites",
        "teach": "A sprite is a character or object. The cat is the famous default sprite!",
        "type": "mcq",
        "prompt": "The cat on the Stage is a…",
        "choices": [
          "Sprite",
          "Database",
          "Router",
          "Battery"
        ],
        "answer": 0,
        "why": "Sprites are the actors.",
        "hint": "Hello, Scratch Cat!"
      },
      {
        "title": "Green flag",
        "teach": "The green flag starts scripts that begin with “when green flag clicked”.",
        "type": "mcq",
        "prompt": "Green flag means…",
        "choices": [
          "Start the project",
          "Delete the sprite",
          "Publish your school grades",
          "Format the disk"
        ],
        "answer": 0,
        "why": "Flag = go!",
        "hint": "Same idea as Scratch Jr."
      },
      {
        "title": "Word",
        "teach": "Actors on the Scratch Stage are called…",
        "type": "fill",
        "prompt": "One word:",
        "answerText": "sprite",
        "accept": [
          "sprite",
          "sprites"
        ],
        "why": "Sprite = character/object.",
        "hint": "S _ _ _ _ _"
      }
    ]
  },
  "sc2": {
    "id": "sc2",
    "track": "scratch",
    "title": "Motion & Events",
    "steps": [
      {
        "title": "Motion blocks",
        "teach": "Blue Motion blocks move and turn sprites: move 10 steps, turn 15 degrees…",
        "type": "mcq",
        "prompt": "Which block category moves a sprite?",
        "choices": [
          "Motion",
          "Operators only",
          "Extensions only",
          "Cloud variables only"
        ],
        "answer": 0,
        "why": "Motion = movement.",
        "hint": "Blue often means motion."
      },
      {
        "title": "Events",
        "teach": "Events wait for something: green flag, key pressed, sprite clicked.",
        "type": "mcq",
        "prompt": "“When space key pressed” is an…",
        "choices": [
          "Event",
          "Costume photo only",
          "Paint fill only",
          "Error on purpose"
        ],
        "answer": 0,
        "why": "Events start scripts.",
        "hint": "When → then."
      },
      {
        "title": "Make it walk",
        "teach": "Classic first Scratch project.",
        "type": "order",
        "prompt": "Order the steps:",
        "items": [
          "Choose a sprite",
          "Add when green flag clicked",
          "Add move / forever move blocks",
          "Click the green flag to test"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Sprite → event → motion → test.",
        "hint": "Need a sprite first."
      },
      {
        "title": "Forever",
        "teach": "A forever loop repeats blocks until you stop. Great for ongoing motion!",
        "type": "mcq",
        "prompt": "forever is a kind of…",
        "choices": [
          "Loop",
          "Paintbrush",
          "Microphone",
          "Backdrop eraser"
        ],
        "answer": 0,
        "why": "Loops repeat.",
        "hint": "Again and again…"
      }
    ]
  },
  "sc3": {
    "id": "sc3",
    "track": "scratch",
    "title": "Looks, Loops & Costumes",
    "steps": [
      {
        "title": "Looks",
        "teach": "Looks blocks change what you see: say Hello!, switch costume, change size.",
        "type": "mcq",
        "prompt": "“Say Hello! for 2 seconds” is a…",
        "choices": [
          "Looks block",
          "Motion block only",
          "Wi-Fi block",
          "Lunch block"
        ],
        "answer": 0,
        "why": "Looks changes appearance/speech.",
        "hint": "Speech bubbles live in Looks."
      },
      {
        "title": "Costumes",
        "teach": "Costumes are different outfits/frames for one sprite. Switching them can animate a walk!",
        "type": "mcq",
        "prompt": "Switching costumes helps you…",
        "choices": [
          "Animate or change look",
          "Delete Scratch accounts worldwide",
          "Cook pasta",
          "Charge phones"
        ],
        "answer": 0,
        "why": "Costumes = frames/looks.",
        "hint": "Like flip-book frames."
      },
      {
        "title": "Repeat",
        "teach": "repeat 10 runs the inner blocks 10 times — a counted loop.",
        "type": "mcq",
        "prompt": "repeat 10 is best when you…",
        "choices": [
          "Know how many times to loop",
          "Want infinite chaos only",
          "Never want motion",
          "Hate the green flag"
        ],
        "answer": 0,
        "why": "Counted loops use repeat.",
        "hint": "10 times exactly."
      },
      {
        "title": "Loop word",
        "teach": "Type the block that runs forever until stop:",
        "type": "fill",
        "prompt": "Block name:",
        "answerText": "forever",
        "accept": [
          "forever"
        ],
        "why": "forever = infinite loop until stop.",
        "hint": "f _ _ _ _ _ _"
      }
    ]
  },
  "sc4": {
    "id": "sc4",
    "track": "scratch",
    "title": "Your First Mini Game Idea",
    "steps": [
      {
        "title": "Keys",
        "teach": "Use “when arrow key pressed” with move blocks so players control the sprite.",
        "type": "mcq",
        "prompt": "Arrow keys are great for…",
        "choices": [
          "Player control",
          "Deleting the Stage permanently",
          "Turning off the sun",
          "Formatting homework"
        ],
        "answer": 0,
        "why": "Keys → player input.",
        "hint": "Control the cat!"
      },
      {
        "title": "Sensing touch",
        "teach": "Touching colors or sprites lets you collect coins or win.",
        "type": "mcq",
        "prompt": "“touching sprite?” helps you detect…",
        "choices": [
          "Collisions / collecting",
          "The weather on Mars only",
          "Your Wi-Fi password",
          "School lunch menus"
        ],
        "answer": 0,
        "why": "Sensing detects contact.",
        "hint": "Collect that apple!"
      },
      {
        "title": "Mini plan",
        "teach": "Design before polish.",
        "type": "order",
        "prompt": "Order a tiny collect game plan:",
        "items": [
          "Player sprite moves with keys",
          "Add a coin sprite",
          "Detect touching coin",
          "Show a win message / score idea"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Move → coin → touch → win.",
        "hint": "Player first."
      },
      {
        "title": "Share",
        "teach": "Scratch lets you share projects with the community (with a parent’s OK).",
        "type": "mcq",
        "prompt": "After it works, a great next step is…",
        "choices": [
          "Show / share your project",
          "Delete all costumes forever",
          "Never press the flag again",
          "Hide the Stage"
        ],
        "answer": 0,
        "why": "Sharing celebrates learning.",
        "hint": "Demo day!"
      }
    ]
  }
};
