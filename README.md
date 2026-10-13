# Code Companion 🌟

Kid-friendly adaptive coding tutor — progressive path from **Scratch Jr → Capstone B**.

Built for Alexa (and friends) with big buttons, stars, badges, warm feedback, and per-language projects.



## Concept-first missions (not quiz stacks)

Each lesson is a **mission**:
1. **Story / quest** — why this concept matters  
2. **Try it** — checklist in the real tool (Roblox Studio, Scratch, Python…)  
3. **Concept card** — one clear idea  
4. **One check** — fill / order / scenario (not four MCQs in a row)

### Gamification
- **XP + level titles** (Seed Coder → Path Legend)
- **Streak flame** for correct checks
- **Concept badges** (Part Pro, Loop Legend, …)
- Mission map on Home · Parent view shows XP, streak, badges, current mission

## Age-based start

On first visit, students enter **name + age**. Code Companion picks a starting track (no baby programs for older kids). Earlier tracks stay under **Earlier levels**.

| Age band | Default start | Recommended path |
|----------|---------------|------------------|
| 5–7 | Scratch Jr | Scratch Jr → Hopscotch |
| 8–9 | Scratch | Scratch → App Inventor |
| 10–11 | **Roblox (Luau)** | Roblox → App Inventor optional |
| 12–13 | Python | Python / Roblox → Unity optional |
| 14+ | HTML & CSS | HTML/CSS → JavaScript → Full Stack (Roblox still open) |

**Keep Learning** continues from the age-appropriate track (or in-progress lesson), not Scratch Jr by default.

Age is saved in `localStorage` with the student name. Parent view shows age + recommended path.

Live site: https://dorischiu2.github.io/code-companion/


## Open Code Companion

### Kid link (recommended)

```bash
cd /workspace/programming-tutor
python3 -m http.server 8765
```

Then open:

### **http://127.0.0.1:8765/**

Or open the file: `/workspace/programming-tutor/index.html`

Demo archive: `/workspace/Code-Companion-demo.tar.gz`

## Learning path (playable)

| # | Track | Lessons | Capstone |
|---|--------|---------|----------|
| 1 | Scratch Jr | 3 | Story project |
| 2 | Hopscotch | 2 | Tap-to-move project |
| 3 | Scratch | 4 | Mini game project |
| 4 | MIT App Inventor | 2 | Button app project |
| 5 | Roblox (Luau) | 12 | Obby mini-game |
| 6 | Python | 4 | Greeter / loop program |
| 7 | Unity | 2 | Scene + GameObject |
| 8 | HTML & CSS | 3 | Profile page |
| 9 | JavaScript | 4 | Click-to-change page |
| 10 | Full Stack | 2 | Front/back plan |
| 11 | Capstone A | 2 | Ship a mini project |
| 12 | Capstone B | 2 | Level-up + polish |

**42 micro-lessons** · **168 steps** · every track has a guided project with checklist + rule-based feedback.

## Features

- **Progressive path UI** — horizontal map on Home
- **Adaptive** — 2 wrongs → stronger hints; 2 correct → harder shuffled MCQs
- **Fast-grasp skip** — 3 correct in a row → “You’re flying! Skip to next lesson?”
- **Stars & badges** · progress in `localStorage` (per student name)
- **Parent view** — % complete, lessons, stars, last activity
- **No login · no CDN · works offline**

## Files

- `index.html` — UI shell
- `styles.css` — kid-friendly look
- `app.js` — tutor engine
- `lessons-meta.js` — tracks + capstones
- `lessons-*.js` — lesson content packs

## Extend a lesson (Doris)

1. Edit the matching `lessons-*.js`
2. Copy a lesson object; new id (e.g. `py5`)
3. Add id to that track’s `lessons` array in `lessons-meta.js`
4. Each step needs `title`, `teach`, `type` (`mcq`|`fill`|`order`), `prompt`, answers, `why`, `hint`

## Limitations

- Feedback is rule-based (no AI API) — great offline
- Progress is per browser/device
- Thinner tracks (Hopscotch, App Inventor, Unity, Full Stack) are intros — still playable with projects
- Not a live Studio/Unity/Scratch plugin — teaches concepts while kids build in the real tools

## For Alexa

1. Open **http://127.0.0.1:8765/**
2. Name = **Alexa**
3. Tap **Keep Learning** or a path node
4. Earn ⭐ · try **Track Project** when ready

## 🎮 Interactive guided missions (v4)

Every lesson is now a **play mission**, not a quiz. **Byte 🤖** (the tutor) gives one short instruction at a time in a speech bubble, watches what the student actually does, and reacts:

- **💡 Hint** / **👀 Show me**: hints appear on their own after 20 s and 45 s. Show me plays a ghost demo or shows a glowing target zone.
- **🔊 / 🗣️ Auto**: read-aloud using the browser's Web Speech.
- **Adaptive**:
  - finishing two steps fast with no hints brings up *"You're flying! 🚀"* with an offer to skip ahead;
  - repeated mistakes bring specific feedback ("that jump is 5.2 studs, your avatar jumps about 4"), UI highlights and a pulsing Show me.
- **On completion**: confetti, XP (+10 for no hints) and a badge. Time and hints per step are saved for the parent view.

| Track | Engine | What's interactive |
|---|---|---|
| Roblox (Luau) | `engine/studio.js` + `engine/luau.js` | **Mini-Studio**: insert, drag, Scale and Rotate parts, plus Explorer and Properties (Color, Anchored, CanCollide, Transparency, Size). **▶ Play** runs an avatar with gravity: unanchored parts fall and big gaps kill you. Scripts run in a **safe Luau interpreter** with Touched, wait, loops, leaderstats, Color3 and Humanoid, and errors are explained kindly. A blocks palette writes the Luau for you. 10 missions plus a capstone that **reviews your real build**. |
| Scratch / Scratch Jr / Hopscotch | `engine/stage.js` | Tap-to-snap blocks (move, turn, say, repeat, events, pen) that animate on a stage. Missions check the sprite's real path, for example whether a closed square was drawn. |
| App Inventor | `engine/phone.js` | Designer (Button, Label, TextBox) plus event blocks on a live phone mock-up. |
| Python | `engine/pyrun.js` | Real Python through **Pyodide**, loaded from a CDN on first run, with friendly tracebacks. Missions are checked against stdout and variables. |
| HTML/CSS · JS · Full Stack | `engine/web.js` | Live editor and preview. Checks inspect the real preview DOM, computed CSS and clicks. Full Stack uses a mock `/api` for fetch GET and POST. |
| Unity | studio (Unity theme) | Hierarchy, Inspector, Static or Rigidbody gravity. |
| Capstone A / B | web / studio | Free build followed by a Byte review. |

### Tests
```bash
python3 -m http.server 8765 &
CHROME=/usr/bin/google-chrome PW_PATH=<path to playwright> EXTRA=$PWD/tests/all.mjs node tests/smoke.mjs
```
`tests/smoke.mjs` runs onboarding, the first Roblox mission (place a part, press Play, win), a Luau colour change, a friendly error and a console-error check. `tests/roblox-all.mjs` and `tests/tracks.mjs` solve every mission automatically.
