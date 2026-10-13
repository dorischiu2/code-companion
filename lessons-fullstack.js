const LESSONS_FULLSTACK = {
  "fs1": {
    "id": "fs1",
    "track": "fullstack",
    "title": "Front & Back",
    "badge": "🧩 Stack Scout",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🧩 Mission: Split front vs back!",
        "teach": "Gear up, coder! Today’s quest: <strong>Front & Back</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Full Stack",
        "teach": "Hands-on beats guessing. Do these in <strong>Full Stack</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Name one thing users see (frontend)",
          "Name one thing a server might store (backend)",
          "Say what an API does in one sentence"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Frontend = what you see. Backend = server/data. API connects them.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "fs1",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "Half",
        "teach": "User-facing half is called the…",
        "type": "fill",
        "prompt": "One word:",
        "answerText": "frontend",
        "accept": [
          "frontend",
          "front end",
          "front-end"
        ],
        "why": "Frontend = UI side.",
        "hint": "f _ _ _ _ _ _ _"
      }
    ]
  },
  "fs2": {
    "id": "fs2",
    "track": "fullstack",
    "title": "Tiny App Design",
    "badge": "🗺️ App Architect",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🗺️ Mission: Design a tiny app!",
        "teach": "Gear up, coder! Today’s quest: <strong>Tiny App Design</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Full Stack",
        "teach": "Hands-on beats guessing. Do these in <strong>Full Stack</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Sketch one screen",
          "Decide what to save",
          "Note: no secrets in public frontend code"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Full-stack thinking plans UI + data + safety together.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "fs2",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
      },
      {
        "title": "Design a score app",
        "teach": "",
        "type": "order",
        "prompt": "Order the plan:",
        "items": [
          "Sketch the screen (frontend)",
          "Decide what to save (backend)",
          "Name an API idea like saveScore",
          "Note: don’t put secrets in frontend code"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "UI → data → API → safety.",
        "hint": "Start with the screen."
      }
    ]
  }
};
