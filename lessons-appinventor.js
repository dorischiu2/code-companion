const LESSONS_APPINVENTOR = {
  "ai1": {
    "id": "ai1",
    "track": "appinventor",
    "title": "Designer View",
    "steps": [
      {
        "title": "What is App Inventor?",
        "teach": "MIT App Inventor lets you build phone apps with a Designer (layout) and Blocks (logic).",
        "type": "mcq",
        "prompt": "App Inventor has two main views…",
        "choices": [
          "Designer and Blocks",
          "Only Spreadsheet and Email",
          "Only Camera and Flashlight hardware menus",
          "Only Roblox and Unity"
        ],
        "answer": 0,
        "why": "Designer = look, Blocks = behavior.",
        "hint": "Two sides of one app."
      },
      {
        "title": "Components",
        "teach": "Drag components like Button, Label, TextBox onto the viewer.",
        "type": "mcq",
        "prompt": "A Button in the Designer is a…",
        "choices": [
          "Component / UI piece",
          "Python virus",
          "Roblox Part",
          "Unity Scene only"
        ],
        "answer": 0,
        "why": "UI pieces are components.",
        "hint": "Buttons live in Designer."
      },
      {
        "title": "Label",
        "teach": "Labels show text to the user. Buttons are for tapping.",
        "type": "mcq",
        "prompt": "To show the words “Hello”, you’d often use a…",
        "choices": [
          "Label",
          "Invisible Wi-Fi antenna",
          "Random GPS satellite",
          "School bell only"
        ],
        "answer": 0,
        "why": "Labels display text.",
        "hint": "Hello on screen."
      },
      {
        "title": "View name",
        "teach": "Layout happens in the _____ view.",
        "type": "fill",
        "prompt": "One word:",
        "answerText": "designer",
        "accept": [
          "designer",
          "design"
        ],
        "why": "Designer = layout.",
        "hint": "D _ _ _ _ _ _ _"
      }
    ]
  },
  "ai2": {
    "id": "ai2",
    "track": "appinventor",
    "title": "Blocks View",
    "steps": [
      {
        "title": "When Button.Click",
        "teach": "In Blocks, snap: when Button1.Click → set Label1.Text to \"Hi!\"",
        "type": "mcq",
        "prompt": "Button.Click is an…",
        "choices": [
          "Event",
          "Paint color only",
          "App Store review",
          "Battery percent"
        ],
        "answer": 0,
        "why": "Click is an event.",
        "hint": "When clicked → …"
      },
      {
        "title": "First app",
        "teach": "Tiny hello app.",
        "type": "order",
        "prompt": "Order the build:",
        "items": [
          "Add Button + Label in Designer",
          "Open Blocks view",
          "Add when Button.Click",
          "Set Label.Text and test"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "UI → Blocks → event → test.",
        "hint": "Designer first."
      },
      {
        "title": "Emulator",
        "teach": "Test with an emulator or MIT AI2 Companion on a device.",
        "type": "mcq",
        "prompt": "Before sharing an app, you should…",
        "choices": [
          "Test it (emulator/device)",
          "Delete the Button forever",
          "Never open Blocks",
          "Remove all Labels"
        ],
        "answer": 0,
        "why": "Always test.",
        "hint": "Companion/emulator helps."
      },
      {
        "title": "Transfer",
        "teach": "Events + actions here feel like Scratch — you’re ready for bigger coding!",
        "type": "mcq",
        "prompt": "App Inventor skills connect to…",
        "choices": [
          "Event-driven coding everywhere",
          "Only underwater basket weaving",
          "Only paper maps",
          "Only toaster firmware"
        ],
        "answer": 0,
        "why": "Events transfer across tools.",
        "hint": "When → then, again."
      }
    ]
  }
};
