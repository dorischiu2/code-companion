/* Code Companion — full path adaptive tutor */
const LESSONS = Object.assign(
  {},
  typeof LESSONS_SCRATCHJR !== "undefined" ? LESSONS_SCRATCHJR : {},
  typeof LESSONS_HOPSCOTCH !== "undefined" ? LESSONS_HOPSCOTCH : {},
  typeof LESSONS_SCRATCH !== "undefined" ? LESSONS_SCRATCH : {},
  typeof LESSONS_APPINVENTOR !== "undefined" ? LESSONS_APPINVENTOR : {},
  typeof LESSONS_ROBLOX !== "undefined" ? LESSONS_ROBLOX : {},
  typeof LESSONS_OBBY !== "undefined" ? LESSONS_OBBY : {},
  typeof LESSONS_LUAU !== "undefined" ? LESSONS_LUAU : {},
  typeof LESSONS_PYTHON !== "undefined" ? LESSONS_PYTHON : {},
  typeof LESSONS_UNITY !== "undefined" ? LESSONS_UNITY : {},
  typeof LESSONS_HTMLCSS !== "undefined" ? LESSONS_HTMLCSS : {},
  typeof LESSONS_JAVASCRIPT !== "undefined" ? LESSONS_JAVASCRIPT : {},
  typeof LESSONS_FULLSTACK !== "undefined" ? LESSONS_FULLSTACK : {},
  typeof LESSONS_CAPA !== "undefined" ? LESSONS_CAPA : {},
  typeof LESSONS_CAPB !== "undefined" ? LESSONS_CAPB : {},
  typeof MISSIONS !== "undefined" ? MISSIONS : {}
);
if (typeof MISSION_TRACKS !== "undefined" && typeof TRACKS !== "undefined") {
  TRACKS.forEach((t) => { if (MISSION_TRACKS[t.id]) t.lessons = MISSION_TRACKS[t.id].slice(); });
}

const DEFAULT_STATE = () => ({
  student: "Alexa",
  age: null,
  completed: {},
  stars: 0,
  xp: 0,
  level: 1,
  badges: [],
  conceptBadges: [],
  bestStreak: 0,
  lastLesson: null,
  lastTrack: null,
  lastActivity: null,
  streakCorrect: 0,
  wrongStreak: {},
  trackCapChecks: {},
  trackCapNotes: {},
  pathIndex: 0,
  currentMission: null
});

const LEVEL_TITLES = [
  { min: 0, title: "Seed Coder", emoji: "🌱" },
  { min: 50, title: "Spark Builder", emoji: "✨" },
  { min: 125, title: "Block Adventurer", emoji: "🧱" },
  { min: 250, title: "Loop Explorer", emoji: "🔁" },
  { min: 400, title: "Script Ranger", emoji: "📜" },
  { min: 600, title: "Game Designer", emoji: "🎮" },
  { min: 850, title: "Stack Captain", emoji: "🧩" },
  { min: 1200, title: "Path Legend", emoji: "🏆" }
];

function levelFromXp(xp) {
  let cur = LEVEL_TITLES[0];
  for (let i = 0; i < LEVEL_TITLES.length; i++) {
    if ((xp || 0) >= LEVEL_TITLES[i].min) cur = LEVEL_TITLES[i];
  }
  const idx = LEVEL_TITLES.indexOf(cur);
  const next = LEVEL_TITLES[idx + 1];
  return { title: cur.title, emoji: cur.emoji, min: cur.min, nextAt: next ? next.min : null, levelNum: idx + 1 };
}

function addXp(amount, reason) {
  state.xp = (state.xp || 0) + amount;
  const info = levelFromXp(state.xp);
  state.level = info.levelNum;
  return info;
}

const LAST_STUDENT_KEY = "codeCompanion_lastStudent_v3";

/** Age → recommended start (Alexa ~10+ → Roblox). */
function getAgeProfile(age) {
  const a = Number(age);
  if (!a || a < 5) {
    return {
      band: "—",
      startTrack: "scratchjr",
      recommended: ["scratchjr", "hopscotch"],
      earlier: [],
      pathLabel: "Pick an age to get a path",
      forward: ["scratchjr", "hopscotch", "scratch", "appinventor", "roblox", "python", "unity", "htmlcss", "javascript", "fullstack", "capA", "capB"]
    };
  }
  if (a <= 7) {
    return {
      band: "5–7",
      startTrack: "scratchjr",
      recommended: ["scratchjr", "hopscotch"],
      earlier: [],
      pathLabel: "Scratch Jr → Hopscotch",
      forward: ["scratchjr", "hopscotch", "scratch", "appinventor", "roblox", "python", "unity", "htmlcss", "javascript", "fullstack", "capA", "capB"]
    };
  }
  if (a <= 9) {
    return {
      band: "8–9",
      startTrack: "scratch",
      recommended: ["scratch", "appinventor"],
      earlier: ["scratchjr", "hopscotch"],
      pathLabel: "Scratch → App Inventor",
      forward: ["scratch", "appinventor", "roblox", "python", "unity", "htmlcss", "javascript", "fullstack", "capA", "capB"]
    };
  }
  if (a <= 11) {
    return {
      band: "10–11",
      startTrack: "roblox",
      recommended: ["roblox", "appinventor"],
      earlier: ["scratchjr", "hopscotch", "scratch"],
      pathLabel: "Roblox (Luau) → (App Inventor optional)",
      forward: ["roblox", "appinventor", "python", "unity", "htmlcss", "javascript", "fullstack", "capA", "capB"]
    };
  }
  if (a <= 13) {
    return {
      band: "12–13",
      startTrack: "python",
      recommended: ["python", "roblox", "unity"],
      earlier: ["scratchjr", "hopscotch", "scratch", "appinventor"],
      pathLabel: "Python / Roblox → Unity (optional)",
      forward: ["python", "roblox", "unity", "htmlcss", "javascript", "fullstack", "capA", "capB"]
    };
  }
  return {
    band: "14+",
    startTrack: "htmlcss",
    recommended: ["htmlcss", "javascript", "fullstack"],
    earlier: ["scratchjr", "hopscotch", "scratch", "appinventor", "python", "unity"],
    pathLabel: "HTML/CSS → JavaScript → Full Stack (Roblox still open)",
    forward: ["htmlcss", "javascript", "fullstack", "roblox", "capA", "capB"]
  };
}

function ageProfile() {
  return getAgeProfile(state.age);
}

function needsOnboarding() {
  return !state.student || state.age === null || state.age === undefined || state.age === "";
}

function rememberLastStudent(name) {
  try { localStorage.setItem(LAST_STUDENT_KEY, name); } catch (e) {}
}

function readLastStudent() {
  try { return localStorage.getItem(LAST_STUDENT_KEY) || ""; } catch (e) { return ""; }
}

function storageKey(name) {
  return "codeCompanion_v2_" + (name || "Alexa").trim().toLowerCase();
}

function loadState(name) {
  try {
    const raw = localStorage.getItem(storageKey(name));
    if (!raw) {
      // migrate v1 roblox progress if present
      const old = localStorage.getItem("codeCompanion_v1_" + (name || "Alexa").trim().toLowerCase());
      if (old) {
        const parsed = JSON.parse(old);
        return Object.assign(DEFAULT_STATE(), parsed, { student: name || "Alexa" });
      }
      return Object.assign(DEFAULT_STATE(), { student: name || "Alexa" });
    }
    return Object.assign(DEFAULT_STATE(), JSON.parse(raw), { student: name || "Alexa" });
  } catch (e) {
    return Object.assign(DEFAULT_STATE(), { student: name || "Alexa" });
  }
}

function saveState(state) {
  state.lastActivity = new Date().toISOString();
  localStorage.setItem(storageKey(state.student), JSON.stringify(state));
  rememberLastStudent(state.student);
}

let state = loadState("Alexa");
let currentTrackId = null;
let currentLessonId = null;
let stepIndex = 0;
let selectedChoice = null;
let answeredCorrect = false;
let hardMode = false;
let skipOffered = false;

const $ = (id) => document.getElementById(id);

function showView(id) {
  if (id !== "play") teardownPlay();
  ["welcome", "home", "track", "lesson", "capstone", "trackcap", "parent", "play"].forEach((v) => {
    const el = $("view-" + v);
    if (el) el.classList.toggle("hidden", v !== id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function totalLessons() {
  return Object.keys(LESSONS).length;
}

function completedCount() {
  return Object.keys(state.completed).filter((k) => state.completed[k]).length;
}

function trackDoneCount(t) {
  return t.lessons.filter((id) => state.completed[id]).length;
}

function trackComplete(t) {
  return t.lessons.length > 0 && t.lessons.every((id) => state.completed[id]);
}

function isTrackUnlocked(t) {
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((x) => x.id === t.id);
  if (idx <= 0) return true;
  // unlock if previous track has at least 1 lesson done OR previous fully complete OR any later progress
  const prev = ordered[idx - 1];
  if (trackDoneCount(prev) >= 1 || trackComplete(prev)) return true;
  // also unlock if user already has progress in this track
  if (trackDoneCount(t) > 0) return true;
  // soft unlock: allow browsing all tracks (kid-friendly) — still mark locked style lightly
  return true; // playable intros: all open, path shows order
}

function renderStars(el, n) {
  const max = 12;
  el.innerHTML = "";
  const show = Math.min(Math.max(n, 0), max);
  for (let i = 0; i < max; i++) {
    const s = document.createElement("span");
    s.className = "star" + (i < show ? " on" : "");
    s.textContent = "⭐";
    s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  }
}

function updateHome() {
  $("helloName").textContent = state.student || "Friend";
  if ($("studentName")) $("studentName").value = state.student || "Alexa";
  const profile = ageProfile();
  const chip = $("homeAgeChip");
  if (chip) {
    chip.textContent = "🎂 Age " + (state.age || "?") + " · Start: " + (
      (TRACKS.find((t) => t.id === profile.startTrack) || {}).emoji || ""
    ) + " " + ((TRACKS.find((t) => t.id === profile.startTrack) || {}).name || profile.startTrack);
  }
  const tag = $("homeTagline");
  if (tag) tag.textContent = "Path for ages " + profile.band + ": " + profile.pathLabel;
  const done = completedCount();
  const total = totalLessons();
  const pct = Math.round((done / Math.max(total, 1)) * 100);
  const lv = levelFromXp(state.xp || 0);
  const missionTrack = state.lastTrack || ageProfile().startTrack;
  const mt = TRACKS.find((t) => t.id === missionTrack);
  const missionLesson = state.lastLesson && LESSONS[state.lastLesson] ? LESSONS[state.lastLesson].title : (mt ? mt.name + " adventure" : "Your next mission");
  if ($("homeXp")) {
    $("homeXp").textContent = "⚡ " + (state.xp || 0) + " XP · " + lv.emoji + " " + lv.title + " (Lv " + lv.levelNum + ")";
  }
  if ($("homeStreak")) {
    const st = state.streakCorrect || 0;
    $("homeStreak").textContent = st > 0 ? ("🔥 Streak x" + st) : "🔥 Streak ready";
    $("homeStreak").classList.toggle("streak-hot", st >= 2);
  }
  if ($("homeMission")) {
    $("homeMission").textContent = "🗺️ Current mission: " + missionLesson;
  }
  $("homeProgress").textContent = "⭐ " + (state.stars || 0) + " stars · " + done + "/" + total + " missions (" + pct + "%)";
  renderStars($("homeStars"), state.stars || 0);
  const badges = $("homeBadges");
  badges.innerHTML = "";
  const concept = state.conceptBadges || [];
  const list = concept.length ? concept.slice(-8) : (state.badges && state.badges.length ? state.badges : ["🌱 Starter"]);
  list.forEach((b) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    badges.appendChild(span);
  });
  renderPath();
  renderTracks();
}

function makeTrackCard(t, extraClass) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "track-card " + (t.css || "") + (extraClass ? " " + extraClass : "");
  const done = trackDoneCount(t);
  const meta = done + "/" + t.lessons.length + " lessons" + (trackComplete(t) ? " ✓" : "");
  btn.innerHTML =
    '<div class="track-icon">' + t.emoji + "</div>" +
    "<h3>" + t.name + "</h3>" +
    "<p>" + t.desc + "</p>" +
    '<div class="track-meta">' + meta + "</div>";
  btn.addEventListener("click", () => openTrack(t.id));
  return btn;
}

function renderPath() {
  const path = $("learningPath");
  if (!path) return;
  path.innerHTML = "";
  const profile = ageProfile();
  const earlierSet = {};
  (profile.earlier || []).forEach((id) => { earlierSet[id] = true; });
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  ordered.forEach((t, i) => {
    const done = trackDoneCount(t);
    const full = trackComplete(t);
    const node = document.createElement("button");
    node.type = "button";
    let cls = "path-node";
    if (full) cls += " done";
    else if (done) cls += " progress";
    if (t.id === profile.startTrack) cls += " start-here";
    if (earlierSet[t.id]) cls += " muted";
    node.className = cls;
    node.title = t.name + (t.id === profile.startTrack ? " (your start)" : "");
    node.innerHTML =
      '<span class="path-emoji">' + t.emoji + "</span>" +
      '<span class="path-label">' + t.name + "</span>" +
      '<span class="path-count">' + done + "/" + t.lessons.length + "</span>";
    node.addEventListener("click", () => openTrack(t.id));
    path.appendChild(node);
    if (i < ordered.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "path-arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      path.appendChild(arrow);
    }
  });
}

function renderTracks() {
  const grid = $("trackGrid");
  const earlierGrid = $("earlierTracks");
  const earlierTitle = $("earlierTitle");
  if (!grid) return;
  grid.innerHTML = "";
  if (earlierGrid) earlierGrid.innerHTML = "";
  const profile = ageProfile();
  const earlierSet = {};
  (profile.earlier || []).forEach((id) => { earlierSet[id] = true; });
  const recSet = {};
  (profile.recommended || []).forEach((id) => { recSet[id] = true; });

  // Recommended + forward (not in earlier)
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  const shown = {};
  ordered.forEach((t) => {
    if (earlierSet[t.id]) return;
    // Prefer showing recommended first visually: still sorted by order among non-earlier
    const glow = recSet[t.id] || t.id === profile.startTrack;
    grid.appendChild(makeTrackCard(t, glow ? "recommended-glow" : ""));
    shown[t.id] = true;
  });

  // Earlier levels (optional)
  let earlierCount = 0;
  ordered.forEach((t) => {
    if (!earlierSet[t.id]) return;
    if (earlierGrid) earlierGrid.appendChild(makeTrackCard(t, ""));
    earlierCount++;
  });
  if (earlierTitle) {
    earlierTitle.classList.toggle("hidden", earlierCount === 0);
  }
  if (earlierGrid) {
    earlierGrid.classList.toggle("hidden", earlierCount === 0);
  }
}

function openTrack(trackId) {
  currentTrackId = trackId;
  const t = TRACKS.find((x) => x.id === trackId);
  $("trackTitle").textContent = t.emoji + " " + t.name;
  $("trackDesc").textContent = t.desc;
  const done = trackDoneCount(t);
  $("trackBar").style.width = (100 * done) / Math.max(t.lessons.length, 1) + "%";
  const list = $("lessonList");
  list.innerHTML = "";
  t.lessons.forEach((lid, i) => {
    const lesson = LESSONS[lid];
    if (!lesson) return;
    const isDone = !!state.completed[lid];
    const prevDone = i === 0 || state.completed[t.lessons[i - 1]];
    const locked = !prevDone && !isDone;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lesson-btn" + (isDone ? " done" : "") + (locked ? " locked" : "");
    b.innerHTML =
      '<div class="lesson-num">' + (isDone ? "✓" : String(i + 1)) + "</div>" +
      "<div><div class=\"lesson-title\">" + lesson.title + "</div>" +
      '<div class="lesson-sub">' + (lesson.kind ? (lesson.emoji || "🎮") + " " + (lesson.goal || "Play mission") : lesson.steps.length + " steps") + " · " +
      (isDone ? "Done!" : locked ? "Finish the one above first" : "Tap to start") +
      "</div></div><div>" + (isDone ? "⭐" : "▶️") + "</div>";
    if (!locked) b.addEventListener("click", () => startLesson(lid));
    list.appendChild(b);
  });

  // Track project button
  const capWrap = $("trackCapWrap");
  if (capWrap) {
    capWrap.innerHTML = "";
    const capBtn = document.createElement("button");
    capBtn.type = "button";
    capBtn.className = "btn btn-big btn-sun";
    capBtn.textContent = "🏆 " + (CAPSTONES[trackId] ? CAPSTONES[trackId].title : "Track Project");
    capBtn.addEventListener("click", () => openTrackCapstone(trackId));
    capWrap.appendChild(capBtn);
  }

  state.lastTrack = trackId;
  saveState(state);
  showView("track");
}

function startLesson(lessonId) {
  if (LESSONS[lessonId] && LESSONS[lessonId].kind) { startMission(lessonId); return; }
  currentLessonId = lessonId;
  stepIndex = 0;
  selectedChoice = null;
  answeredCorrect = false;
  hardMode = (state.streakCorrect || 0) >= 2;
  skipOffered = false;
  state.lastLesson = lessonId;
  state.currentMission = LESSONS[lessonId].title;
  saveState(state);
  $("btnNext").textContent = "Next →";
  $("btnNext").onclick = nextStep;
  $("btnCheck").onclick = checkAnswer;
  const skipBox = $("skipBox");
  if (skipBox) {
    skipBox.classList.add("hidden");
    skipBox.innerHTML = "";
  }
  renderStep();
  showView("lesson");
}

function stepKey() {
  return currentLessonId + "_" + stepIndex;
}

function renderStep() {
  const lesson = LESSONS[currentLessonId];
  const step = lesson.steps[stepIndex];
  const total = lesson.steps.length;
  const typeLabel = ({
    mission: "Mission",
    tryit: "Try it",
    concept: "Concept",
    mcq: "Check",
    fill: "Check",
    order: "Check",
    match: "Check",
    scenario: "Check",
    done: "Done"
  })[step.type] || "Step";
  $("stepPill").textContent = typeLabel + " · " + (stepIndex + 1) + "/" + total + " · " + lesson.title;
  $("lessonBar").style.width = (100 * stepIndex) / total + "%";
  $("stepTitle").textContent = step.title;
  let teach = step.teach || "";
  if (hardMode && (step.type === "mcq" || step.type === "scenario") ) {
    teach += " <em>(⭐ Challenge mode — answers may be shuffled!)</em>";
  }
  $("stepBody").innerHTML = teach;

  const q = $("questionArea");
  q.innerHTML = "";
  selectedChoice = null;
  answeredCorrect = false;
  $("feedbackBox").className = "feedback";
  $("feedbackBox").textContent = "";
  $("btnCheck").classList.remove("hidden");
  $("btnCheck").disabled = false;
  $("btnNext").classList.add("hidden");

  // Mission / concept: continue without a hard quiz
  if (step.type === "mission" || step.type === "concept") {
    $("btnCheck").textContent = step.type === "mission" ? "🚀 Let’s go!" : "💡 Got it — next";
    $("btnCheck").onclick = function () {
      answeredCorrect = true;
      showFeedback("good", step.type === "mission"
        ? "Awesome — mission accepted! Time to try it for real."
        : "Concept unlocked in your brain 🧠✨");
      $("btnCheck").classList.add("hidden");
      $("btnNext").classList.remove("hidden");
    };
    if (step.prompt) {
      const prompt = document.createElement("p");
      prompt.className = "step-prompt";
      prompt.textContent = step.prompt;
      q.appendChild(prompt);
    }
    return;
  }

  // Try-it checklist
  if (step.type === "tryit") {
    $("btnCheck").textContent = "✅ I tried it!";
    const prompt = document.createElement("p");
    prompt.className = "step-prompt";
    prompt.textContent = step.prompt || "Check boxes as you try things:";
    q.appendChild(prompt);
    const ul = document.createElement("ul");
    ul.className = "tryit-list";
    (step.checklist || []).forEach((item, i) => {
      const li = document.createElement("li");
      const id = "try_" + stepIndex + "_" + i;
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = id;
      const lab = document.createElement("label");
      lab.htmlFor = id;
      lab.textContent = item;
      li.appendChild(cb);
      li.appendChild(lab);
      ul.appendChild(li);
    });
    q.appendChild(ul);
    $("btnCheck").onclick = function () {
      const boxes = ul.querySelectorAll("input[type=checkbox]");
      const checked = Array.prototype.filter.call(boxes, (b) => b.checked).length;
      if (checked === 0) {
        showFeedback("hint", "Try at least one box in the real app — then check it! 🛠️");
        return;
      }
      answeredCorrect = true;
      const bonus = checked >= (step.checklist || []).length;
      if (bonus) addXp(5, "full try-it");
      showFeedback("good", bonus
        ? "🔥 Full try-it streak! +5 XP — you actually built something!"
        : "Nice effort! Trying in the real app is how concepts stick. (+ partial credit)");
      $("btnCheck").classList.add("hidden");
      $("btnNext").classList.remove("hidden");
    };
    return;
  }

  // Done step
  if (step.type === "done") {
    $("btnCheck").textContent = "🎉 Done!";
    const prompt = document.createElement("p");
    prompt.className = "step-prompt";
    prompt.textContent = step.prompt || "Tap Done when you’re ready.";
    q.appendChild(prompt);
    $("btnCheck").onclick = function () {
      answeredCorrect = true;
      showFeedback("good", step.why || "You showed up — that’s real coding!");
      $("btnCheck").classList.add("hidden");
      $("btnNext").classList.remove("hidden");
    };
    return;
  }

  // Restore quiz check handler for interactive checks
  $("btnCheck").textContent = "✅ Check Answer";
  $("btnCheck").onclick = checkAnswer;

  const prompt = document.createElement("p");
  prompt.className = "step-prompt";
  prompt.style.fontWeight = "800";
  prompt.style.fontSize = "1.15rem";
  prompt.style.marginBottom = "8px";
  prompt.textContent = step.prompt;
  q.appendChild(prompt);

  if (step.type === "mcq" || step.type === "scenario") {
    const wrap = document.createElement("div");
    wrap.className = "choices";
    let choices = step.choices.map((c, i) => ({ c: c, i: i }));
    if (hardMode) {
      for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = choices[i];
        choices[i] = choices[j];
        choices[j] = tmp;
      }
    }
    choices.forEach((item) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = item.c;
      b.dataset.index = String(item.i);
      b.addEventListener("click", () => {
        if (answeredCorrect) return;
        selectedChoice = item.i;
        wrap.querySelectorAll(".choice").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
      });
      wrap.appendChild(b);
    });
    q.appendChild(wrap);
  } else if (step.type === "fill") {
    const input = document.createElement("input");
    input.className = "fill-input";
    input.id = "fillAnswer";
    input.type = "text";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Your answer");
    q.appendChild(input);
  } else if (step.type === "order") {
    const wrap = document.createElement("div");
    wrap.className = "order-list";
    wrap.id = "orderList";
    step.items.forEach((text, i) => {
      const row = document.createElement("div");
      row.className = "order-item";
      const sel = document.createElement("select");
      sel.dataset.item = String(i);
      sel.setAttribute("aria-label", "Order for: " + text);
      for (let n = 1; n <= step.items.length; n++) {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        if (n === i + 1) opt.selected = true;
        sel.appendChild(opt);
      }
      const label = document.createElement("span");
      label.textContent = text;
      row.appendChild(sel);
      row.appendChild(label);
      wrap.appendChild(row);
    });
    q.appendChild(wrap);
  } else if (step.type === "match") {
    const wrap = document.createElement("div");
    wrap.className = "match-list";
    wrap.id = "matchList";
    (step.pairs || []).forEach((pair, i) => {
      const row = document.createElement("div");
      row.className = "order-item";
      const lab = document.createElement("span");
      lab.textContent = pair.left;
      lab.style.flex = "1";
      const sel = document.createElement("select");
      sel.dataset.idx = String(i);
      const opts = step.pairs.map((p) => p.right);
      const shuffled = opts.slice();
      for (let a = shuffled.length - 1; a > 0; a--) {
        const b = Math.floor(Math.random() * (a + 1));
        const t = shuffled[a]; shuffled[a] = shuffled[b]; shuffled[b] = t;
      }
      shuffled.forEach((r) => {
        const o = document.createElement("option");
        o.value = r;
        o.textContent = r;
        sel.appendChild(o);
      });
      row.appendChild(lab);
      row.appendChild(sel);
      wrap.appendChild(row);
    });
    q.appendChild(wrap);
  }
}

function normalize(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function showFeedback(kind, text) {
  const box = $("feedbackBox");
  box.className = "feedback show " + kind;
  box.textContent = text;
}

function offerSkipAhead() {
  if (skipOffered) return;
  const lesson = LESSONS[currentLessonId];
  if (stepIndex >= lesson.steps.length - 1) return;
  skipOffered = true;
  const box = $("skipBox");
  if (!box) return;
  box.classList.remove("hidden");
  box.innerHTML =
    '<div class="skip-card">' +
    "<p>🚀 <strong>You’re flying!</strong> Concept check crushed — skip to claim XP?</p>" +
    '<div class="nav-row">' +
    '<button type="button" class="btn btn-mint" id="btnSkipYes">Skip to mastery ⭐</button>' +
    '<button type="button" class="btn btn-ghost" id="btnSkipNo">Keep going</button>' +
    "</div></div>";
  $("btnSkipYes").addEventListener("click", () => {
    box.classList.add("hidden");
    finishLesson(true);
  });
  $("btnSkipNo").addEventListener("click", () => {
    box.classList.add("hidden");
  });
}

function checkAnswer() {
  const lesson = LESSONS[currentLessonId];
  const step = lesson.steps[stepIndex];
  const key = stepKey();
  let correct = false;

  if (step.type === "mcq") {
    if (selectedChoice === null) {
      showFeedback("hint", "Pick an answer first! 👆");
      return;
    }
    correct = selectedChoice === step.answer;
    $("questionArea").querySelectorAll(".choice").forEach((btn) => {
      const idx = Number(btn.dataset.index);
      btn.classList.remove("selected", "correct", "wrong");
      if (idx === selectedChoice && !correct) btn.classList.add("wrong");
      if (correct && idx === step.answer) btn.classList.add("correct");
    });
  } else if (step.type === "fill") {
    const val = normalize($("fillAnswer").value);
    if (!val) {
      showFeedback("hint", "Type your answer in the box!");
      return;
    }
    const accept = (step.accept || [step.answerText]).map(normalize);
    correct = accept.indexOf(val) !== -1;
  } else if (step.type === "order") {
    const sels = Array.prototype.slice.call($("orderList").querySelectorAll("select"));
    const picked = sels.map((s) => Number(s.value));
    correct = step.items.every(function (_, i) {
      return picked[i] === step.answerOrder.indexOf(i) + 1;
    });
    if (new Set(picked).size !== picked.length) correct = false;
  } else if (step.type === "match") {
    const sels = Array.prototype.slice.call($("matchList").querySelectorAll("select"));
    correct = sels.every((sel, i) => sel.value === step.pairs[i].right);
  }

  if (correct) {
    answeredCorrect = true;
    state.wrongStreak[key] = 0;
    state.streakCorrect = (state.streakCorrect || 0) + 1;
    if (state.streakCorrect > (state.bestStreak || 0)) state.bestStreak = state.streakCorrect;
    hardMode = state.streakCorrect >= 2;
    addXp(8, "check");
    showFeedback("good", "🎉 Yes! +" + 8 + " XP — " + step.why);
    $("btnCheck").classList.add("hidden");
    $("btnNext").classList.remove("hidden");
    if (step.type === "mcq" || step.type === "scenario") {
      $("questionArea").querySelectorAll(".choice").forEach((btn) => {
        if (Number(btn.dataset.index) === step.answer) btn.classList.add("correct");
      });
    }
    if (state.streakCorrect >= 3) offerSkipAhead();
    saveState(state);
  } else {
    state.streakCorrect = 0;
    hardMode = false;
    skipOffered = false;
    const skipBox = $("skipBox");
    if (skipBox) {
      skipBox.classList.add("hidden");
      skipBox.innerHTML = "";
    }
    state.wrongStreak[key] = (state.wrongStreak[key] || 0) + 1;
    const w = state.wrongStreak[key];
    if (w >= 2) {
      showFeedback("hint", "💡 Hint: " + step.hint + " — " + step.why);
    } else {
      showFeedback("bad", "Not quite — try again! " + (step.hint ? "Hint: " + step.hint : ""));
    }
    saveState(state);
  }
}

function nextStep() {
  const lesson = LESSONS[currentLessonId];
  if (stepIndex < lesson.steps.length - 1) {
    stepIndex++;
    hardMode = (state.streakCorrect || 0) >= 2;
    renderStep();
  } else {
    finishLesson(false);
  }
}

function maybeBadge() {
  const n = completedCount();
  function add(b) {
    if (state.badges.indexOf(b) === -1) state.badges.push(b);
  }
  if (n >= 1) add("🌱 First Lesson");
  if (n >= 5) add("🐤 Block Starter");
  if (n >= 12) add("🧱 Roblox Explorer");
  if (n >= 20) add("🐍 Text Coder");
  if (n >= 30) add("🌐 Web Builder");
  if (trackComplete(TRACKS.find((t) => t.id === "scratchjr") || { lessons: [] })) add("🐤 Scratch Jr Star");
  if (trackComplete(TRACKS.find((t) => t.id === "roblox") || { lessons: [] })) add("🎓 Roblox Graduate");
  if (trackComplete(TRACKS.find((t) => t.id === "python") || { lessons: [] })) add("🐍 Python Pal");
  if (trackComplete(TRACKS.find((t) => t.id === "javascript") || { lessons: [] })) add("💛 JS Spark");
  if (trackComplete(TRACKS.find((t) => t.id === "capB") || { lessons: [] })) add("🚀 Path Champion");
}

function finishLesson(skipped) {
  const lesson = LESSONS[currentLessonId];
  const wasNew = !state.completed[currentLessonId];
  state.completed[currentLessonId] = true;
  state.currentMission = lesson.title;
  let xpGain = 0;
  let badgeMsg = "";
  if (wasNew) {
    state.stars = (state.stars || 0) + 1;
    xpGain = lesson.xpReward || 25;
    if (skipped) xpGain = Math.max(15, Math.floor(xpGain * 0.75));
    addXp(xpGain, "mission");
    if (lesson.badge) {
      if (!state.conceptBadges) state.conceptBadges = [];
      if (state.conceptBadges.indexOf(lesson.badge) === -1) {
        state.conceptBadges.push(lesson.badge);
        badgeMsg = '<p class="badge-pop">Badge unlocked: <strong>' + lesson.badge + '</strong></p>';
      }
    }
    maybeBadge();
  }
  saveState(state);
  updateHome();

  const lv = levelFromXp(state.xp || 0);
  const skipNote = skipped
    ? "<p>🚀 Fast grasp! You skipped ahead — mission still counts.</p>"
    : "";
  $("stepTitle").textContent = "Concept mastered! 🌟";
  $("stepBody").innerHTML =
    '<div class="celebrate">🎉</div>' +
    "<p>You guided yourself through the idea — not just clicked answers.</p>" +
    (wasNew
      ? "<p>+" + xpGain + " XP · Total <strong>" + (state.xp || 0) + " XP</strong> · " + lv.emoji + " <strong>" + lv.title + "</strong></p>"
      : "<p>Nice review! XP stays at <strong>" + (state.xp || 0) + "</strong>.</p>") +
    badgeMsg +
    skipNote;
  $("questionArea").innerHTML = "";
  $("feedbackBox").className = "feedback";
  const skipBox = $("skipBox");
  if (skipBox) {
    skipBox.classList.add("hidden");
    skipBox.innerHTML = "";
  }
  $("btnCheck").classList.add("hidden");
  $("btnNext").classList.remove("hidden");
  $("btnNext").textContent = "Back to missions →";
  $("btnNext").onclick = function () {
    $("btnNext").textContent = "Next →";
    $("btnNext").onclick = nextStep;
    openTrack(LESSONS[currentLessonId].track);
  };
}

/* Per-track capstone */
function openTrackCapstone(trackId) {
  currentTrackId = trackId;
  const cap = CAPSTONES[trackId];
  if (!cap) return;
  $("tcTitle").textContent = "🏆 " + cap.title;
  $("tcBlurb").textContent = cap.blurb;
  if (!state.trackCapChecks[trackId]) state.trackCapChecks[trackId] = {};
  const ul = $("tcChecklist");
  ul.innerHTML = "";
  cap.items.forEach((text, i) => {
    const id = trackId + "_tc_" + i;
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.checked = !!state.trackCapChecks[trackId][id];
    cb.addEventListener("change", () => {
      state.trackCapChecks[trackId][id] = cb.checked;
      saveState(state);
      updateTcBar(trackId);
    });
    const lab = document.createElement("label");
    lab.htmlFor = id;
    lab.textContent = text;
    li.appendChild(cb);
    li.appendChild(lab);
    ul.appendChild(li);
  });
  $("tcNotes").value = (state.trackCapNotes && state.trackCapNotes[trackId]) || "";
  updateTcBar(trackId);
  $("tcReport").classList.remove("show");
  $("tcReport").innerHTML = "";
  showView("trackcap");
}

function updateTcBar(trackId) {
  const cap = CAPSTONES[trackId];
  const checks = state.trackCapChecks[trackId] || {};
  const total = cap.items.length;
  let done = 0;
  for (let i = 0; i < total; i++) {
    if (checks[trackId + "_tc_" + i]) done++;
  }
  const pct = Math.round((100 * done) / total);
  $("tcBar").style.width = pct + "%";
  $("tcPct").textContent = pct + "% done · " + done + "/" + total + " checks";
}

function generateTrackFeedback() {
  const trackId = currentTrackId;
  const cap = CAPSTONES[trackId];
  const notes = ($("tcNotes").value || "").trim();
  if (!state.trackCapNotes) state.trackCapNotes = {};
  state.trackCapNotes[trackId] = notes;
  saveState(state);
  const checks = state.trackCapChecks[trackId] || {};
  let done = 0;
  for (let i = 0; i < cap.items.length; i++) {
    if (checks[trackId + "_tc_" + i]) done++;
  }
  const notesL = notes.toLowerCase();
  const strengths = [];
  if (done >= Math.ceil(cap.items.length / 2)) strengths.push("You’re checking real builder habits — love it!");
  (cap.keywords_strength || []).forEach((kw) => {
    if (notesL.indexOf(kw) !== -1) strengths.push("You mentioned “" + kw + "” — that shows you understand the craft.");
  });
  if (done === cap.items.length) strengths.push("Checklist complete — that’s a shipped mini project mindset!");
  if (!strengths.length) strengths.push("You opened the project page — every great build starts with showing up.");

  const improvements = [];
  for (let i = 0; i < cap.items.length; i++) {
    if (!checks[trackId + "_tc_" + i] && improvements.length < 3) {
      improvements.push("Try this next: " + cap.items[i]);
    }
  }
  if (notes.length < 20) improvements.push("Write a bit more about what you built so feedback can be specific.");
  while (improvements.length < 2) improvements.push("Play-test once more and note one thing to make clearer for a friend.");

  const report = $("tcReport");
  report.innerHTML =
    '<div class="celebrate">🌟</div><h2>Feedback for ' + state.student + "</h2>" +
    "<p><strong>Checklist:</strong> " + done + "/" + cap.items.length + "</p>" +
    "<h3>💪 Strengths</h3><ul>" + strengths.slice(0, 4).map((s) => "<li>" + s + "</li>").join("") + "</ul>" +
    "<h3>🛠️ Improvements</h3><ul>" + improvements.slice(0, 3).map((s) => "<li>" + s + "</li>").join("") + "</ul>" +
    "<h3>🚀 Next</h3><p>" + (cap.next || "Keep going on the learning path!") + "</p>";
  report.classList.add("show");
}

/* Legacy global capstone = Roblox project shortcut */
function renderCapstone() {
  openTrackCapstone("roblox");
}

function renderParent() {
  $("parentStudent").textContent = state.student;
  const profile = ageProfile();
  if ($("parentAgeLine")) {
    $("parentAgeLine").textContent = "Age: " + (state.age != null ? state.age : "—") + " (band " + profile.band + ")";
  }
  if ($("parentPath")) {
    const start = TRACKS.find((t) => t.id === profile.startTrack);
    $("parentPath").textContent =
      "Recommended path: " + profile.pathLabel +
      " · Default start: " + (start ? start.emoji + " " + start.name : profile.startTrack);
  }
  const done = completedCount();
  const total = totalLessons();
  const pct = Math.round((100 * done) / Math.max(total, 1));
  let last = "—";
  if (state.lastActivity) {
    try {
      last = new Date(state.lastActivity).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      last = state.lastActivity;
    }
  }
  const lv = levelFromXp(state.xp || 0);
  $("parentStats").innerHTML =
    '<div class="stat"><div class="num">' + pct + '%</div><div class="lbl">Progress</div></div>' +
    '<div class="stat"><div class="num">' + done + '</div><div class="lbl">Missions</div></div>' +
    '<div class="stat"><div class="num">' + (state.xp || 0) + '</div><div class="lbl">XP · ' + lv.title + '</div></div>' +
    '<div class="stat"><div class="num">' + (state.bestStreak || 0) + '</div><div class="lbl">Best streak</div></div>' +
    '<div class="stat"><div class="num" style="font-size:1rem;padding-top:8px">' + last + '</div><div class="lbl">Last activity</div></div>';
  if ($("parentMission")) {
    $("parentMission").textContent = "Current mission: " + (state.currentMission || state.lastLesson || "—");
  }
  if ($("parentBadges")) {
    const cbs = state.conceptBadges || [];
    $("parentBadges").textContent = cbs.length ? ("Concept badges: " + cbs.join(" · ")) : "Concept badges: none yet";
  }
  const pt = $("parentTracks");
  pt.innerHTML = "";
  TRACKS.slice().sort((a, b) => a.order - b.order).forEach((t) => {
    const d = trackDoneCount(t);
    const div = document.createElement("div");
    div.style.marginBottom = "10px";
    const mark = (profile.recommended || []).indexOf(t.id) !== -1 ? " ⭐" : ((profile.earlier || []).indexOf(t.id) !== -1 ? " (earlier)" : "");
    div.innerHTML =
      "<strong>" + t.emoji + " " + t.name + "</strong>" + mark + " — " + d + "/" + t.lessons.length +
      '<div class="bar"><span style="width:' + (100 * d) / Math.max(t.lessons.length, 1) + '%"></span></div>';
    pt.appendChild(div);
  });
}

function continueLearning() {
  if (needsOnboarding()) {
    showWelcome();
    return;
  }
  const profile = ageProfile();
  const earlierSet = {};
  (profile.earlier || []).forEach((id) => { earlierSet[id] = true; });

  // Resume unfinished lesson if it's not an "earlier" track (unless that's all they have)
  if (state.lastLesson && LESSONS[state.lastLesson] && !state.completed[state.lastLesson]) {
    const tr = LESSONS[state.lastLesson].track;
    if (!earlierSet[tr] || state.lastTrack === tr) {
      startLesson(state.lastLesson);
      return;
    }
  }

  // Continue last track if age-appropriate (not earlier-only)
  if (state.lastTrack && !earlierSet[state.lastTrack]) {
    const t = TRACKS.find((x) => x.id === state.lastTrack);
    if (t) {
      const next = t.lessons.find((id) => LESSONS[id] && !state.completed[id]);
      if (next) {
        startLesson(next);
        return;
      }
    }
  }

  // Start / continue from age default track, then forward recommended path
  const forward = profile.forward || [profile.startTrack];
  for (let i = 0; i < forward.length; i++) {
    const t = TRACKS.find((x) => x.id === forward[i]);
    if (!t) continue;
    const next = t.lessons.find((id) => LESSONS[id] && !state.completed[id]);
    if (next) {
      startLesson(next);
      return;
    }
  }

  // Fallback: open start track
  openTrack(profile.startTrack);
}

let welcomeSelectedAge = null;

function updateWelcomeHint() {
  const hint = $("welcomeHint");
  const btn = $("btnStartAdventure");
  if (!hint || !btn) return;
  const age = welcomeSelectedAge || Number(($("welcomeAgeNum") && $("welcomeAgeNum").value) || 0);
  if (!age || age < 5 || age > 18) {
    hint.textContent = "Pick an age to see your starting track ✨";
    btn.disabled = true;
    return;
  }
  const profile = getAgeProfile(age);
  const start = TRACKS.find((t) => t.id === profile.startTrack);
  hint.textContent =
    "Ages " + profile.band + " → start at " + (start ? start.emoji + " " + start.name : profile.startTrack) +
    " · " + profile.pathLabel;
  btn.disabled = false;
}

function buildAgeGrid() {
  const grid = $("ageGrid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let a = 5; a <= 16; a++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "age-btn";
    b.textContent = String(a);
    b.setAttribute("aria-label", "Age " + a);
    b.addEventListener("click", () => {
      welcomeSelectedAge = a;
      grid.querySelectorAll(".age-btn").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      if ($("welcomeAgeNum")) $("welcomeAgeNum").value = String(a);
      updateWelcomeHint();
    });
    grid.appendChild(b);
  }
  const plus = document.createElement("button");
  plus.type = "button";
  plus.className = "age-btn";
  plus.textContent = "17+";
  plus.setAttribute("aria-label", "Age 17 or older");
  plus.addEventListener("click", () => {
    welcomeSelectedAge = 17;
    grid.querySelectorAll(".age-btn").forEach((x) => x.classList.remove("selected"));
    plus.classList.add("selected");
    if ($("welcomeAgeNum")) $("welcomeAgeNum").value = "17";
    updateWelcomeHint();
  });
  grid.appendChild(plus);
}

function showWelcome(prefill) {
  buildAgeGrid();
  welcomeSelectedAge = null;
  if ($("welcomeName")) {
    $("welcomeName").value = (prefill && prefill.name) || state.student || "";
  }
  if ($("welcomeAgeNum")) {
    $("welcomeAgeNum").value = (prefill && prefill.age) || state.age || "";
    if (state.age) welcomeSelectedAge = Number(state.age);
  }
  if (welcomeSelectedAge) {
    const grid = $("ageGrid");
    if (grid) {
      grid.querySelectorAll(".age-btn").forEach((btn) => {
        const label = btn.textContent.replace("+", "");
        if (Number(label) === welcomeSelectedAge || (welcomeSelectedAge >= 17 && btn.textContent === "17+")) {
          btn.classList.add("selected");
        }
      });
    }
  }
  updateWelcomeHint();
  showView("welcome");
}

function finishOnboarding() {
  let name = (($("welcomeName") && $("welcomeName").value) || "").trim() || "Friend";
  if (name.length > 24) name = name.slice(0, 24);
  let age = welcomeSelectedAge || Number(($("welcomeAgeNum") && $("welcomeAgeNum").value) || 0);
  if (!age || age < 5) {
    updateWelcomeHint();
    return;
  }
  if (age > 18) age = 18;
  const existing = loadState(name);
  state = existing;
  state.student = name;
  state.age = age;
  // If no lastTrack yet, seed to age start
  const profile = getAgeProfile(age);
  if (!state.lastTrack) state.lastTrack = profile.startTrack;
  rememberLastStudent(name);
  saveState(state);
  if ($("studentName")) $("studentName").value = name;
  updateHome();
  showView("home");
}

function init() {
  const last = readLastStudent();
  const nameGuess = last || (($("studentName") && $("studentName").value) || "Alexa");
  state = loadState(nameGuess);
  if (last) state.student = last;

  buildAgeGrid();

  if ($("welcomeAgeNum")) {
    $("welcomeAgeNum").addEventListener("input", () => {
      const v = Number($("welcomeAgeNum").value);
      welcomeSelectedAge = v || null;
      const grid = $("ageGrid");
      if (grid) {
        grid.querySelectorAll(".age-btn").forEach((btn) => btn.classList.remove("selected"));
        grid.querySelectorAll(".age-btn").forEach((btn) => {
          const n = Number(btn.textContent);
          if (n === v || (v >= 17 && btn.textContent === "17+")) btn.classList.add("selected");
        });
      }
      updateWelcomeHint();
    });
  }
  if ($("btnStartAdventure")) {
    $("btnStartAdventure").addEventListener("click", finishOnboarding);
  }
  if ($("btnChangeAge")) {
    $("btnChangeAge").addEventListener("click", () => showWelcome({ name: state.student, age: state.age }));
  }

  if ($("studentName")) {
    $("studentName").addEventListener("change", () => {
      let name = $("studentName").value.trim() || "Alexa";
      if (name.length > 24) name = name.slice(0, 24);
      const prevAge = state.age;
      state = loadState(name);
      state.student = name;
      if (state.age == null && prevAge != null) state.age = prevAge;
      rememberLastStudent(name);
      saveState(state);
      if (needsOnboarding()) showWelcome({ name: name, age: state.age });
      else updateHome();
    });
  }

  $("btnHome").addEventListener("click", () => {
    if (needsOnboarding()) { showWelcome(); return; }
    updateHome();
    showView("home");
  });
  $("btnBackHome").addEventListener("click", () => {
    if (needsOnboarding()) { showWelcome(); return; }
    updateHome();
    showView("home");
  });
  $("btnContinue").addEventListener("click", continueLearning);
  $("btnCapstone").addEventListener("click", () => {
    const profile = ageProfile();
    openTrackCapstone(state.lastTrack || profile.startTrack);
  });
  $("btnParent").addEventListener("click", () => {
    if (needsOnboarding()) { showWelcome(); return; }
    renderParent();
    showView("parent");
  });
  $("btnParentBack").addEventListener("click", () => {
    updateHome();
    showView("home");
  });
  $("btnReset").addEventListener("click", () => {
    if (confirm("Reset progress for " + state.student + " on this device?")) {
      const name = state.student;
      const age = state.age;
      localStorage.removeItem(storageKey(name));
      state = DEFAULT_STATE();
      state.student = name;
      state.age = age;
      saveState(state);
      updateHome();
      renderParent();
    }
  });

  $("btnBackTrack").addEventListener("click", () => {
    if (currentLessonId && LESSONS[currentLessonId]) openTrack(LESSONS[currentLessonId].track);
    else showView("home");
  });
  $("btnCheck").addEventListener("click", checkAnswer);
  $("btnNext").addEventListener("click", nextStep);

  $("btnTcBack").addEventListener("click", () => {
    if (currentTrackId) openTrack(currentTrackId);
    else showView("home");
  });
  $("btnTcFeedback").addEventListener("click", generateTrackFeedback);
  $("tcNotes").addEventListener("change", () => {
    if (!state.trackCapNotes) state.trackCapNotes = {};
    state.trackCapNotes[currentTrackId] = $("tcNotes").value;
    saveState(state);
  });

  if (needsOnboarding()) showWelcome({ name: state.student, age: state.age });
  else {
    updateHome();
    showView("home");
  }
}

document.addEventListener("DOMContentLoaded", init);


/* ===== Interactive missions (play view) ===== */
const CC_ENGINES = window.CC_ENGINES = window.CC_ENGINES || {};
CC_ENGINES.studio = function (mount, m) {
  const st = new Studio(mount);
  st.studentName = state.student;
  st.load(Object.assign({ theme: m.theme || "roblox" }, m.setup));
  return st;
};
CC_ENGINES.stage = function (mount, m) { const e = new Stage(mount); e.load(m.setup); return e; };
CC_ENGINES.phone = function (mount, m) { const e = new Phone(mount); e.load(m.setup); return e; };
CC_ENGINES.python = function (mount, m) { const e = new PyRun(mount); e.load(m.setup); return e; };
CC_ENGINES.web = function (mount, m) { const e = new WebEditor(mount); e.load(m.setup); return e; };
let playEngine = null, playRunner = null;
function teardownPlay() {
  if (playRunner) { playRunner.destroy(); playRunner = null; }
  if (playEngine) { try { playEngine.destroy(); } catch (e) { console.error(e); } playEngine = null; }
  const mt = $("playMount"); if (mt) mt.innerHTML = "";
  document.querySelectorAll(".tb-win,.tb-confetti").forEach((e) => e.remove());
}
function nextMissionId(id) {
  const m = LESSONS[id]; const t = TRACKS.find((x) => x.id === m.track); if (!t) return null;
  const i = t.lessons.indexOf(id); return i >= 0 && i < t.lessons.length - 1 ? t.lessons[i + 1] : null;
}
function startMission(id) {
  const m = LESSONS[id];
  showView("play");
  teardownPlay();
  currentLessonId = id; currentTrackId = m.track;
  state.lastLesson = id; state.lastTrack = m.track; state.currentMission = m.title; saveState(state);
  $("playTitle").textContent = m.title; $("playEmoji").textContent = m.emoji || "🎮"; $("playGoal").textContent = m.goal || "";
  const nx = nextMissionId(id);
  $("btnPlayNext").classList.toggle("hidden", !(nx && state.completed[id]));
  $("btnPlayNext").onclick = () => nx ? startMission(nx) : openTrack(m.track);
  const view = $("view-play"); view.dataset.kind = m.kind;
  const mount = $("playMount");
  const make = CC_ENGINES[m.kind];
  if (!make) { mount.innerHTML = "<p>This mission type is coming soon.</p>"; return; }
  playEngine = make(mount, m);
  playRunner = new Tutor.Mission({
    mission: m, engine: playEngine, root: view,
    ui: { bubble: $("bubble"), mascot: $("mascot"), dots: $("playDots"), hint: $("btnHint"), show: $("btnShowMe"), voice: $("btnVoice"), say: $("btnSay") },
    onStep: (info) => { state.missionStats = state.missionStats || {}; const k = id; const ms = state.missionStats[k] || { steps: 0, secs: 0, hints: 0, fast: 0 }; ms.steps++; ms.secs += Math.round(info.secs); ms.hints += info.hints; if (info.fast) ms.fast++; state.missionStats[k] = ms; saveState(state); },
    onComplete: (r) => ccMissionComplete(id, r),
    onNext: () => { const n = nextMissionId(id); if (n) startMission(n); else openTrack(m.track); }
  });
}
function ccMissionComplete(id, r) {
  const m = LESSONS[id]; const wasNew = !state.completed[id];
  const before = levelFromXp(state.xp || 0).title;
  let xp = 0, badge = null;
  state.completed[id] = true;
  if (wasNew) {
    state.stars = (state.stars || 0) + 1;
    xp = m.xpReward || 30;
    if (r && r.hints === 0) xp += 10;
    addXp(xp, "mission");
    if (m.badge) { state.conceptBadges = state.conceptBadges || []; if (state.conceptBadges.indexOf(m.badge) === -1) { state.conceptBadges.push(m.badge); badge = m.badge; } }
    maybeBadge();
  }
  state.streakCorrect = (state.streakCorrect || 0) + 1;
  state.bestStreak = Math.max(state.bestStreak || 0, state.streakCorrect);
  saveState(state); updateHome();
  const after = levelFromXp(state.xp || 0);
  const nx = nextMissionId(id); $("btnPlayNext").classList.toggle("hidden", !nx);
  return { xp, badge, levelUp: after.title !== before ? after.emoji + " " + after.title : null };
}
window.ccMissionComplete = ccMissionComplete;
document.addEventListener("DOMContentLoaded", () => {
  const b = $("btnPlayBack"); if (b) b.addEventListener("click", () => { const m = LESSONS[currentLessonId]; if (m) openTrack(m.track); else showView("home"); });
});
window.ccDebug = { engine: () => playEngine, runner: () => playRunner };
