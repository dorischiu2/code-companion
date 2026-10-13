const LESSONS_PYTHON = {
  "py1": {
    "id": "py1",
    "track": "python",
    "title": "Hello Python",
    "badge": "🖨️ Print Pilot",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🐍 Mission: Say hello in Python!",
        "teach": "Gear up, coder! Today’s quest: <strong>Hello Python</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Python",
        "teach": "Hands-on beats guessing. Do these in <strong>Python</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Open a Python editor",
          "Type print(\"Hi\")",
          "Run it and see the output"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "print() shows text. Strings use quotes.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "py1",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "Command",
        "teach": "The command that shows text is…",
        "type": "fill",
        "prompt": "Type it:",
        "answerText": "print",
        "accept": [
          "print"
        ],
        "why": "print displays output.",
        "hint": "p _ _ _ _"
      }
    ]
  },
  "py2": {
    "id": "py2",
    "track": "python",
    "title": "Variables",
    "badge": "🏷️ Name Ninja",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "📦 Mission: Name a value!",
        "teach": "Gear up, coder! Today’s quest: <strong>Variables</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Python",
        "teach": "Hands-on beats guessing. Do these in <strong>Python</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Write name = \"Alexa\"",
          "print(name)",
          "Try score = 0"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Variables store values you can reuse.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "py2",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "Assign",
        "teach": "To store 5 in x you write: x = ___",
        "type": "fill",
        "prompt": "Type the number:",
        "answerText": "5",
        "accept": [
          "5"
        ],
        "why": "x = 5 assigns five.",
        "hint": "Digit five."
      }
    ]
  },
  "py3": {
    "id": "py3",
    "track": "python",
    "title": "If & Input",
    "badge": "🔀 Branch Boss",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🔀 Mission: Make a decision!",
        "teach": "Gear up, coder! Today’s quest: <strong>If & Input</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Python",
        "teach": "Hands-on beats guessing. Do these in <strong>Python</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Try an if line with indentation",
          "Try input(\"Your name? \") if you can"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "if = decisions. Indentation shows which lines belong together.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "py3",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "Tiny quiz program",
        "teach": "Put the flow in order:",
        "type": "order",
        "prompt": "Order:",
        "items": [
          "Ask for a number with input",
          "Convert/use it in a variable",
          "if check if it’s big enough",
          "print a message"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Ask → store → if → print.",
        "hint": "Ask first."
      }
    ]
  },
  "py4": {
    "id": "py4",
    "track": "python",
    "title": "Loops",
    "badge": "🔁 Loop Legend",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🔁 Mission: Loop three cheers!",
        "teach": "Gear up, coder! Today’s quest: <strong>Loops</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Python",
        "teach": "Hands-on beats guessing. Do these in <strong>Python</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Write for i in range(3):",
          "print a cheer inside (indented)",
          "Run it"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Loops repeat. for + range counts; while needs an end condition.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "py4",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "range",
        "teach": "for i in range(___):  for three times use…",
        "type": "fill",
        "prompt": "Number:",
        "answerText": "3",
        "accept": [
          "3"
        ],
        "why": "range(3) → 0,1,2.",
        "hint": "Three."
      }
    ]
  }
};
