const LESSONS_FULLSTACK = {
  "fs1": {
    "id": "fs1",
    "track": "fullstack",
    "title": "Front & Back",
    "steps": [
      {
        "title": "Frontend",
        "teach": "Frontend is what users see: HTML/CSS/JS in the browser (or a game UI).",
        "type": "mcq",
        "prompt": "Frontend is…",
        "choices": [
          "The part users see and click",
          "Only the secret database vault",
          "Only the Wi-Fi modem firmware",
          "Only the power cable"
        ],
        "answer": 0,
        "why": "Front = user-facing.",
        "hint": "Buttons & pages."
      },
      {
        "title": "Backend",
        "teach": "Backend is the server side: saves scores, checks logins, talks to databases.",
        "type": "mcq",
        "prompt": "Backend often…",
        "choices": [
          "Stores data & makes decisions on a server",
          "Paints CSS shadows only",
          "Replaces the GPU fan",
          "Is only Scratch Jr pages"
        ],
        "answer": 0,
        "why": "Back = server logic/data.",
        "hint": "Behind the scenes."
      },
      {
        "title": "API",
        "teach": "An API is how front and back talk — like asking “save my score” and getting “OK”.",
        "type": "mcq",
        "prompt": "An API is…",
        "choices": [
          "A way for programs to talk",
          "A type of pizza",
          "A Unity skybox",
          "A Hopscotch costume"
        ],
        "answer": 0,
        "why": "API = messenger rules.",
        "hint": "Request → response."
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
    "steps": [
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
      },
      {
        "title": "Secrets",
        "teach": "Passwords and private keys must NOT live in public frontend code.",
        "type": "mcq",
        "prompt": "Where should secret keys NOT go?",
        "choices": [
          "Public frontend JS",
          "A locked server vault (better place)",
          "A parent-managed password manager",
          "An offline paper note in a safe"
        ],
        "answer": 0,
        "why": "Frontend is visible to users.",
        "hint": "Never ship secrets in JS."
      },
      {
        "title": "Full stack kid meaning",
        "teach": "You understand both sides enough to plan a small app end-to-end.",
        "type": "mcq",
        "prompt": "Full stack thinking means…",
        "choices": [
          "Planning front + back together",
          "Only drawing CSS gradients",
          "Only moving Roblox Parts",
          "Only tapping Hopscotch"
        ],
        "answer": 0,
        "why": "Both halves matter.",
        "hint": "See the whole path."
      },
      {
        "title": "Next",
        "teach": "Capstone A: pick one track and ship a real mini project!",
        "type": "mcq",
        "prompt": "Best Capstone A move?",
        "choices": [
          "Finish one small project and share it",
          "Start 20 unfinished projects",
          "Delete all your code",
          "Skip testing forever"
        ],
        "answer": 0,
        "why": "Ship small.",
        "hint": "Done > perfect."
      }
    ]
  }
};
