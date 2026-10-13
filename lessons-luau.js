const LESSONS_LUAU = {
  "l1": {
    "id": "l1",
    "track": "roblox",
    "title": "What is a Script?",
    "badge": "📜 Script Scout",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "📜 Mission: Meet Luau scripts!",
        "teach": "Gear up, coder! Today’s quest: <strong>What is a Script?</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Roblox Studio",
        "teach": "Hands-on beats guessing. Do these in <strong>Roblox Studio</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Right-click a Part → Insert Script (or similar)",
          "Open the Script",
          "Find script.Parent in your mind"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Luau scripts are instructions. script.Parent = the Part holding the script.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "l1",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
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
    "badge": "📦 Variable Voyager",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "📦 Mission: Store values in variables!",
        "teach": "Gear up, coder! Today’s quest: <strong>Variables</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Roblox Studio",
        "teach": "Hands-on beats guessing. Do these in <strong>Roblox Studio</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Write local pad = script.Parent in a Script (or read an example)",
          "Think of a score variable = 0"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Variables are named boxes for values (numbers, Parts, text).",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "l2",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
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
    "badge": "👋 Touch Titan",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "👋 Mission: Detect a Touch!",
        "teach": "Gear up, coder! Today’s quest: <strong>Touched Event</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Roblox Studio",
        "teach": "Hands-on beats guessing. Do these in <strong>Roblox Studio</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Plan: Part.Touched:Connect(…)",
          "Imagine changing color on touch",
          "Play-test by touching the Part"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Touched is an event — it fires when something bumps the Part.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "l3",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
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
    "badge": "🪄 Code Painter",
    "xpReward": 25,
    "steps": [
      {
        "type": "mission",
        "title": "🎨 Mission: Change Properties in code!",
        "teach": "Gear up, coder! Today’s quest: <strong>Change Properties in Code</strong>. Complete the mission steps to unlock XP and a concept badge.",
        "prompt": "Ready for the mission?",
        "why": "Missions make learning feel like a game!",
        "hint": "Tap Let’s go!"
      },
      {
        "type": "tryit",
        "title": "🛠️ Try this in Roblox Studio",
        "teach": "Hands-on beats guessing. Do these in <strong>Roblox Studio</strong>, then tap <strong>I tried it!</strong>",
        "checklist": [
          "Set Transparency or BrickColor in a Script idea",
          "Keep CanCollide on for platforms",
          "Test a tiny win: touch → green"
        ],
        "prompt": "Check each box as you go — then continue.",
        "why": "Doing it in the real app builds muscle memory.",
        "hint": "It’s OK if it’s messy — trying counts!"
      },
      {
        "type": "concept",
        "title": "💡 Concept card",
        "teach": "Scripts edit the same Properties you see in the panel.",
        "prompt": "Read it once more — then continue.",
        "conceptKey": "l4",
        "why": "Short cards stick better than long lectures.",
        "hint": "Say the idea out loud!"
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
