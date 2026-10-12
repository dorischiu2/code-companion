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
  typeof LESSONS_CAPB !== "undefined" ? LESSONS_CAPB : {}
);

const DEFAULT_STATE = () => ({
  student: "Alexa",
  completed: {},
  stars: 0,
  badges: [],
  lastLesson: null,
  lastTrack: null,
  lastActivity: null,
  streakCorrect: 0,
  wrongStreak: {},
  trackCapChecks: {},
  trackCapNotes: {},
  pathIndex: 0
});

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
  ["home", "track", "lesson", "capstone", "trackcap", "parent"].forEach((v) => {
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
  $("studentName").value = state.student || "Alexa";
  const done = completedCount();
  const total = totalLessons();
  const pct = Math.round((done / Math.max(total, 1)) * 100);
  $("homeProgress").textContent = "⭐ " + (state.stars || 0) + " stars · " + done + "/" + total + " lessons (" + pct + "%)";
  renderStars($("homeStars"), state.stars || 0);
  const badges = $("homeBadges");
  badges.innerHTML = "";
  const list = state.badges && state.badges.length ? state.badges : ["🌱 Starter"];
  list.forEach((b) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    badges.appendChild(span);
  });
  renderPath();
  renderTracks();
}

function renderPath() {
  const path = $("learningPath");
  if (!path) return;
  path.innerHTML = "";
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  ordered.forEach((t, i) => {
    const done = trackDoneCount(t);
    const full = trackComplete(t);
    const node = document.createElement("button");
    node.type = "button";
    node.className = "path-node" + (full ? " done" : done ? " progress" : "");
    node.title = t.name;
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
  grid.innerHTML = "";
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  ordered.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-card " + (t.css || "");
    const done = trackDoneCount(t);
    const meta = done + "/" + t.lessons.length + " lessons" + (trackComplete(t) ? " ✓" : "");
    btn.innerHTML =
      '<div class="track-icon">' + t.emoji + "</div>" +
      "<h3>" + t.name + "</h3>" +
      "<p>" + t.desc + "</p>" +
      '<div class="track-meta">' + meta + "</div>";
    btn.addEventListener("click", () => openTrack(t.id));
    grid.appendChild(btn);
  });
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
      '<div class="lesson-sub">' + lesson.steps.length + " steps · " +
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
  currentLessonId = lessonId;
  stepIndex = 0;
  selectedChoice = null;
  answeredCorrect = false;
  hardMode = (state.streakCorrect || 0) >= 2;
  skipOffered = false;
  state.lastLesson = lessonId;
  saveState(state);
  $("btnNext").textContent = "Next →";
  $("btnNext").onclick = nextStep;
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
  $("stepPill").textContent = "Step " + (stepIndex + 1) + " of " + total + " · " + lesson.title;
  $("lessonBar").style.width = (100 * stepIndex) / total + "%";
  $("stepTitle").textContent = step.title;
  let teach = step.teach;
  if (hardMode && step.type === "mcq") {
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

  const prompt = document.createElement("p");
  prompt.style.fontWeight = "800";
  prompt.style.fontSize = "1.15rem";
  prompt.style.marginBottom = "8px";
  prompt.textContent = step.prompt;
  q.appendChild(prompt);

  if (step.type === "mcq") {
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
    "<p>🚀 <strong>You’re flying!</strong> Skip the rest of this lesson?</p>" +
    '<div class="nav-row">' +
    '<button type="button" class="btn btn-mint" id="btnSkipYes">Skip to finish ⭐</button>' +
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
  }

  if (correct) {
    answeredCorrect = true;
    state.wrongStreak[key] = 0;
    state.streakCorrect = (state.streakCorrect || 0) + 1;
    hardMode = state.streakCorrect >= 2;
    showFeedback("good", "🎉 Yes! " + step.why);
    $("btnCheck").classList.add("hidden");
    $("btnNext").classList.remove("hidden");
    if (step.type === "mcq") {
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
  const wasNew = !state.completed[currentLessonId];
  state.completed[currentLessonId] = true;
  if (wasNew) {
    state.stars = (state.stars || 0) + 1;
    maybeBadge();
  }
  saveState(state);
  updateHome();

  const skipNote = skipped
    ? "<p>You skipped ahead because you were on fire — lesson marked done!</p>"
    : "";
  $("stepTitle").textContent = "You finished this lesson! 🌟";
  $("stepBody").innerHTML =
    '<div class="celebrate">🎉</div>' +
    (wasNew
      ? "<p>You earned a star! Total: <strong>" + state.stars + "</strong></p>"
      : "<p>Nice review! Stars stay at <strong>" + state.stars + "</strong>.</p>") +
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
  $("btnNext").textContent = "Back to lessons →";
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
  $("parentStats").innerHTML =
    '<div class="stat"><div class="num">' + pct + '%</div><div class="lbl">Progress</div></div>' +
    '<div class="stat"><div class="num">' + done + '</div><div class="lbl">Lessons done</div></div>' +
    '<div class="stat"><div class="num">' + (state.stars || 0) + '</div><div class="lbl">Stars</div></div>' +
    '<div class="stat"><div class="num" style="font-size:1rem;padding-top:8px">' + last + '</div><div class="lbl">Last activity</div></div>';
  const pt = $("parentTracks");
  pt.innerHTML = "";
  TRACKS.slice().sort((a, b) => a.order - b.order).forEach((t) => {
    const d = trackDoneCount(t);
    const div = document.createElement("div");
    div.style.marginBottom = "10px";
    div.innerHTML =
      "<strong>" + t.emoji + " " + t.name + "</strong> — " + d + "/" + t.lessons.length +
      '<div class="bar"><span style="width:' + (100 * d) / Math.max(t.lessons.length, 1) + '%"></span></div>';
    pt.appendChild(div);
  });
}

function continueLearning() {
  if (state.lastLesson && LESSONS[state.lastLesson] && !state.completed[state.lastLesson]) {
    startLesson(state.lastLesson);
    return;
  }
  const ordered = TRACKS.slice().sort((a, b) => a.order - b.order);
  if (state.lastTrack) {
    const t = TRACKS.find((x) => x.id === state.lastTrack);
    if (t) {
      const next = t.lessons.find((id) => !state.completed[id]);
      if (next) {
        startLesson(next);
        return;
      }
    }
  }
  for (let i = 0; i < ordered.length; i++) {
    const t = ordered[i];
    const next = t.lessons.find((id) => LESSONS[id] && !state.completed[id]);
    if (next) {
      startLesson(next);
      return;
    }
  }
  openTrack("scratchjr");
}

function init() {
  state = loadState($("studentName").value || "Alexa");
  updateHome();

  $("studentName").addEventListener("change", () => {
    let name = $("studentName").value.trim() || "Alexa";
    if (name.length > 24) name = name.slice(0, 24);
    state = loadState(name);
    state.student = name;
    saveState(state);
    updateHome();
  });

  $("btnHome").addEventListener("click", () => {
    updateHome();
    showView("home");
  });
  $("btnBackHome").addEventListener("click", () => {
    updateHome();
    showView("home");
  });
  $("btnContinue").addEventListener("click", continueLearning);
  $("btnCapstone").addEventListener("click", () => openTrackCapstone(state.lastTrack || "roblox"));
  $("btnParent").addEventListener("click", () => {
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
      localStorage.removeItem(storageKey(name));
      state = DEFAULT_STATE();
      state.student = name;
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

  showView("home");
}

document.addEventListener("DOMContentLoaded", init);
