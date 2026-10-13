/* Code Companion — Byte the tutor: guided, adaptive mission runner */
(function (global) {
  "use strict";
  const PRAISE = ["Yes! 🎉", "Nailed it! ⭐", "Awesome! 🙌", "You got it! 💪", "Boom! 💥", "So good! 🌟"];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function speakOn() { try { return localStorage.getItem("cc_speak") === "1"; } catch (e) { return false; } }
  function speak(text) {
    if (!speakOn() || !global.speechSynthesis) return;
    try {
      const clean = String(text).replace(/<[^>]+>/g, " ").replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, "");
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean); u.rate = 1.02; u.pitch = 1.15;
      global.speechSynthesis.speak(u);
    } catch (e) {}
  }

  class Mission {
    constructor(opts) {
      this.o = opts; this.m = opts.mission; this.engine = opts.engine; this.ui = opts.ui;
      this.i = -1; this.log = []; this.hintsUsed = 0; this.totalHints = 0; this.fastRun = 0; this.fails = 0;
      this.t0 = performance.now(); this.done = false; this.data = {};
      this.onEv = this.onEv.bind(this);
      this.engine.on(this.onEv);
      this.wireUi();
      this.timer = setInterval(() => this.tick(), 1000);
      this.goto(0);
    }
    destroy() { clearInterval(this.timer); clearTimeout(this._pendT); if (this.engine.off) this.engine.off(this.onEv); this.clearHighlight(); if (global.speechSynthesis) try { global.speechSynthesis.cancel(); } catch (e) {} }
    ctx(ev) { return { engine: this.engine, ev: ev || null, log: this.log, data: this.data, mission: this, step: this.step, since: this.stepStartIdx }; }
    get step() { return this.m.steps[this.i]; }
    stepLog() { return this.log.slice(this.stepStartIdx); }

    wireUi() {
      const u = this.ui;
      u.hint.onclick = () => this.hint(true);
      u.show.onclick = () => this.showMe();
      u.voice.onclick = () => {
        const on = !speakOn(); try { localStorage.setItem("cc_speak", on ? "1" : "0"); } catch (e) {}
        u.voice.classList.toggle("on", on); u.voice.setAttribute("aria-pressed", on);
        if (on) speak(u.bubble.textContent); else if (global.speechSynthesis) global.speechSynthesis.cancel();
      };
      u.voice.classList.toggle("on", speakOn()); u.voice.setAttribute("aria-pressed", speakOn());
      u.say.onclick = () => { const was = speakOn(); try { localStorage.setItem("cc_speak", "1"); } catch (e) {} speak(u.bubble.textContent); try { localStorage.setItem("cc_speak", was ? "1" : "0"); } catch (e) {} };
    }
    bubble(html, mood) {
      const b = this.ui.bubble; b.innerHTML = html; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
      this.ui.mascot.dataset.mood = mood || "talk"; speak(b.textContent);
    }
    renderDots() {
      const d = this.ui.dots; d.innerHTML = "";
      this.m.steps.forEach((s, k) => { const el = document.createElement("span"); el.className = "dot" + (k < this.i ? " done" : k === this.i ? " now" : ""); d.appendChild(el); });
    }
    goto(k) {
      clearTimeout(this._pendT); this.pending = false;
      this.clearHighlight();
      if (k >= this.m.steps.length) return this.complete();
      this.i = k; this.stepStartIdx = this.log.length; this.stepT0 = performance.now(); this.hintsUsed = 0; this.fails = 0; this.reacted = 0; this.lastActT = performance.now();
      const s = this.step; this.renderDots();
      this.ui.show.classList.toggle("hidden", !s.demo && !s.ghost);
      this.ui.show.classList.remove("pulse");
      if (s.enter) try { s.enter(this.ctx()); } catch (e) { console.error(e); }
      if (this.engine.setGhost) this.engine.setGhost(null);
      const say = typeof s.say === "function" ? s.say(this.ctx()) : s.say;
      this.bubble(say, "talk");
      if (s.mounted) try { s.mounted(this.ctx(), this.ui.bubble); } catch (e) { console.error(e); }
      if (s.highlight) this.highlight(s.highlight, false);
      if (s.check && s.checkOnEnter) setTimeout(() => this.evaluate(null), 50);
    }
    onEv(ev) {
      if (this.done) return;
      this.log.push(ev);
      if (["move", "insert", "scale", "rotate", "prop", "code", "block", "play", "select", "run", "click", "drag"].indexOf(ev.type) >= 0) this.lastActT = performance.now();
      this.evaluate(ev);
    }
    evaluate(ev) {
      const s = this.step; if (!s || this.done || this.pending) return;
      let ok = false;
      try { ok = s.check ? !!s.check(this.ctx(ev)) : false; } catch (e) { console.error(e); }
      if (ok) { this.succeed(); return; }
      if (ev && s.react) {
        let r = null; try { r = s.react(this.ctx(ev)); } catch (e) { console.error(e); }
        if (r) {
          this.reacted++; this.fails++;
          this.bubble(r, "oops");
          if (this.fails >= 2) this.struggle();
        }
      } else if (ev && ev.type === "scriptError") {
        this.fails++;
        this.bubble("Uh-oh, the code got stuck. 🧐 <b>" + esc(ev.text) + "</b>" + (ev.line ? " (line " + ev.line + ")" : ""), "oops");
        if (this.fails >= 2) this.struggle();
      }
    }
    succeed() {
      this.pending = true;
      const s = this.step; const dt = (performance.now() - this.stepT0) / 1000;
      const fast = dt < (s.fastSecs || 14) && this.hintsUsed === 0 && this.fails === 0;
      this.fastRun = fast ? this.fastRun + 1 : 0;
      this.o.onStep && this.o.onStep({ index: this.i, secs: dt, hints: this.hintsUsed, fast });
      let praise = s.praise ? (typeof s.praise === "function" ? s.praise(this.ctx()) : s.praise) : pick(PRAISE);
      this.clearHighlight(); if (this.engine.setGhost) this.engine.setGhost(null);
      this.ui.mascot.dataset.mood = "happy";
      const remaining = this.m.steps.length - this.i - 1;
      if (this.fastRun >= 2 && remaining >= 2 && !this.offeredFly) {
        this.offeredFly = true;
        this.bubble(praise + ' <br><b>You\'re flying! 🚀</b> Want to jump to the big challenge?' +
          '<div class="tb-choices"><button type="button" class="btn btn-sun tb-fly">⏭ Skip to the challenge</button><button type="button" class="btn btn-ghost tb-stay">Keep going step by step</button></div>', "happy");
        this.ui.bubble.querySelector(".tb-fly").onclick = () => { this.skipped = true; this.goto(this.m.steps.length - 1); };
        this.ui.bubble.querySelector(".tb-stay").onclick = () => this.goto(this.i + 1);
        return;
      }
      this.bubble(praise, "happy");
      this._pendT = setTimeout(() => this.goto(this.i + 1), s.pause || 1300);
    }
    tick() {
      if (this.done) return;
      const s = this.step; if (!s) return;
      const idle = (performance.now() - this.stepT0) / 1000;
      if (idle > 20 && this.hintsUsed === 0) this.hint(false);
      else if (idle > 45 && this.hintsUsed === 1) { this.hint(false); this.struggle(); }
      if (s.poll && s.check) this.evaluate({ type: "poll" });
    }
    hint(manual) {
      const s = this.step; if (!s) return;
      const hs = s.hints || [];
      const h = hs[Math.min(this.hintsUsed, hs.length - 1)];
      this.hintsUsed++; this.totalHints++;
      if (h) this.bubble("💡 " + (typeof h === "function" ? h(this.ctx()) : h), "think");
      else this.bubble("💡 " + (typeof s.say === "function" ? s.say(this.ctx()) : s.say), "think");
      if (s.highlight) this.highlight(s.highlight, true);
      if (s.ghost && this.engine.setGhost) this.engine.setGhost(typeof s.ghost === "function" ? s.ghost(this.ctx()) : s.ghost);
      if (!manual && (s.demo || s.ghost)) this.ui.show.classList.add("pulse");
    }
    struggle() {
      const s = this.step; if (!s) return;
      if (s.ghost && this.engine.setGhost) this.engine.setGhost(typeof s.ghost === "function" ? s.ghost(this.ctx()) : s.ghost);
      if (s.highlight) this.highlight(s.highlight, true);
      if (s.demo || s.ghost) this.ui.show.classList.add("pulse");
    }
    async showMe() {
      const s = this.step; if (!s) return;
      this.hintsUsed++; this.totalHints++;
      this.ui.show.classList.remove("pulse");
      if (s.ghost && this.engine.setGhost) this.engine.setGhost(typeof s.ghost === "function" ? s.ghost(this.ctx()) : s.ghost);
      if (s.demo) {
        this.bubble("👀 Watch me do it… then you try the next one!", "think");
        try { await s.demo(this.ctx()); } catch (e) { console.error(e); }
      } else this.bubble("👀 See the purple glow? That's the spot!", "think");
    }
    highlight(sel, strong) {
      this.clearHighlight();
      const el = this.o.root.querySelector(sel); if (!el) return;
      el.classList.add(strong ? "tb-hl-strong" : "tb-hl"); this._hl = el;
    }
    clearHighlight() { if (this._hl) { this._hl.classList.remove("tb-hl", "tb-hl-strong"); this._hl = null; } }
    complete() {
      if (this.done) return; this.done = true; this.renderDots();
      Array.from(this.ui.dots.children).forEach((d) => d.className = "dot done");
      const secs = Math.round((performance.now() - this.t0) / 1000);
      const res = this.o.onComplete ? this.o.onComplete({ secs, hints: this.totalHints, skipped: !!this.skipped }) : {};
      this.bubble(this.m.finale || "Mission complete! 🏆", "happy");
      confetti(this.o.root);
      const ov = document.createElement("div"); ov.className = "tb-win";
      ov.innerHTML = '<div class="tb-win-card"><div class="tb-win-emoji">' + (this.m.emoji || "🏆") + '</div><h2>Mission complete!</h2><p class="tb-win-title">' + esc(this.m.title) + "</p>" +
        (res && res.xp ? '<p class="tb-xp">+' + res.xp + " XP</p>" : '<p class="tb-xp">Replay bonus: practice makes pro! 💪</p>') +
        (res && res.badge ? '<p class="badge-pop">🏅 Badge: <b>' + esc(res.badge) + "</b></p>" : "") +
        (res && res.levelUp ? '<p class="badge-pop">⬆️ Level up! ' + esc(res.levelUp) + "</p>" : "") +
        '<p class="tb-stats">⏱️ ' + secs + "s · 💡 " + this.totalHints + " hint" + (this.totalHints === 1 ? "" : "s") + (this.totalHints === 0 ? " — pro move!" : "") + "</p>" +
        '<div class="tb-win-btns"><button type="button" class="btn btn-big btn-mint tb-next">Next mission →</button><button type="button" class="btn btn-ghost tb-keep">Keep playing here</button></div></div>';
      this.o.root.appendChild(ov);
      ov.querySelector(".tb-next").onclick = () => { ov.remove(); this.o.onNext && this.o.onNext(); };
      ov.querySelector(".tb-keep").onclick = () => { ov.remove(); this.bubble("Free play! Try changing things and press ▶ again. Tap <b>Next mission</b> at the top when you're ready.", "happy"); };
    }
  }

  function confetti(root) {
    const c = document.createElement("div"); c.className = "tb-confetti";
    const cols = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#facc15"];
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("i"); s.style.left = Math.random() * 100 + "%"; s.style.background = cols[i % cols.length];
      s.style.animationDelay = Math.random() * 0.6 + "s"; s.style.animationDuration = 1.6 + Math.random() * 1.4 + "s"; s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      c.appendChild(s);
    }
    root.appendChild(c); setTimeout(() => c.remove(), 3600);
  }

  global.Tutor = { Mission, speak, confetti, esc };
})(window);
