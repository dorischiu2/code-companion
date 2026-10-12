const LESSONS_UNITY = {
  "un1": {
    "id": "un1",
    "track": "unity",
    "title": "Scenes & GameObjects",
    "steps": [
      {
        "title": "What is Unity?",
        "teach": "Unity is a game engine for 2D/3D games. You build Scenes filled with GameObjects.",
        "type": "mcq",
        "prompt": "Unity is mainly a…",
        "choices": [
          "Game engine",
          "Sandwich recipe",
          "Wi-Fi router brand",
          "Scratch costume pack only"
        ],
        "answer": 0,
        "why": "Unity powers many games.",
        "hint": "Engine = build games."
      },
      {
        "title": "Scene",
        "teach": "A Scene is one level/screen layout — like a page of your game world.",
        "type": "mcq",
        "prompt": "A Scene is like…",
        "choices": [
          "A level / screen layout",
          "A Python print statement only",
          "A single HTML color",
          "A phone Button click only"
        ],
        "answer": 0,
        "why": "Scenes hold the world.",
        "hint": "Level = scene."
      },
      {
        "title": "GameObject",
        "teach": "Cubes, cameras, lights, and characters are GameObjects in the Hierarchy.",
        "type": "mcq",
        "prompt": "A cube you add to the Scene is a…",
        "choices": [
          "GameObject",
          "print() call",
          "Scratch block",
          "CSS class only"
        ],
        "answer": 0,
        "why": "Almost everything is a GameObject.",
        "hint": "Hierarchy lists them."
      },
      {
        "title": "Word",
        "teach": "Levels in Unity are called…",
        "type": "fill",
        "prompt": "One word:",
        "answerText": "scenes",
        "accept": [
          "scene",
          "scenes"
        ],
        "why": "Scene = level/layout.",
        "hint": "S _ _ _ _ _"
      }
    ]
  },
  "un2": {
    "id": "un2",
    "track": "unity",
    "title": "Inspector & Play",
    "steps": [
      {
        "title": "Inspector",
        "teach": "Select a GameObject — the Inspector shows Transform (position/rotation/scale) and components.",
        "type": "mcq",
        "prompt": "Where do you tweak a cube’s position numbers?",
        "choices": [
          "Inspector",
          "App Store reviews",
          "Scratch backpack only",
          "Python zipfile"
        ],
        "answer": 0,
        "why": "Inspector edits properties.",
        "hint": "Select → Inspector."
      },
      {
        "title": "Play mode",
        "teach": "Press Play to test. Stop before making lasting edits (like Roblox Stop!).",
        "type": "mcq",
        "prompt": "Best time to permanently edit objects?",
        "choices": [
          "When stopped (not in Play)",
          "Only while Play is running forever",
          "Never",
          "Only after deleting the Scene"
        ],
        "answer": 0,
        "why": "Edit outside Play for lasting changes.",
        "hint": "Same lesson as Roblox."
      },
      {
        "title": "First cube",
        "teach": "",
        "type": "order",
        "prompt": "Order a Unity hello:",
        "items": [
          "Open a Scene",
          "Add a 3D cube GameObject",
          "Tweak Transform in Inspector",
          "Press Play to view"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Scene → cube → tweak → Play.",
        "hint": "Open scene first."
      },
      {
        "title": "C# taste",
        "teach": "Scripts in Unity are often C#. Later you can make a cube spin — similar energy to Luau/JS!",
        "type": "mcq",
        "prompt": "Unity gameplay scripts are commonly…",
        "choices": [
          "C#",
          "Only Scratch blocks",
          "Only Hopscotch When rules",
          "Only Excel macros"
        ],
        "answer": 0,
        "why": "C# is the common Unity language.",
        "hint": "Text scripts again."
      }
    ]
  }
};
