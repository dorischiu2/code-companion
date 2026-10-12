# Code Companion 🌟

Kid-friendly adaptive coding tutor — progressive path from **Scratch Jr → Capstone B**.

Built for Alexa (and friends) with big buttons, stars, badges, warm feedback, and per-language projects.

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
