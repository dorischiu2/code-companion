/* Code Companion — block stage (Scratch / Scratch Jr / Hopscotch) */
(function (global) {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Block catalog. arg: default value. cat: color class.
  const CAT = {
    flag: { cat: "ev", hat: true, label: { scratch: "🏁 when green flag clicked", jr: "🏁", hop: "▶ When play starts" } },
    click: { cat: "ev", hat: true, label: { scratch: "👆 when this sprite clicked", jr: "👆", hop: "👆 When tapped" } },
    move: { cat: "mo", arg: 10, label: { scratch: "move [n] steps", jr: "➡️ [n]", hop: "Move forward [n]" } },
    back: { cat: "mo", arg: 1, label: { jr: "⬅️ [n]" } },
    up: { cat: "mo", arg: 1, label: { jr: "⬆️ [n]" } },
    down: { cat: "mo", arg: 1, label: { jr: "⬇️ [n]" } },
    turn: { cat: "mo", arg: 15, label: { scratch: "turn ↻ [n] degrees", jr: "↻ [n]", hop: "Turn [n] degrees" } },
    goto: { cat: "mo", arg: "0 0", label: { scratch: "go to x y [n]", hop: "Set position [n]" } },
    say: { cat: "lo", arg: "Hello!", label: { scratch: "say [n]", jr: "💬 [n]", hop: "💬 Say [n]" } },
    grow: { cat: "lo", arg: 20, label: { scratch: "change size by [n]", jr: "🔍 [n]", hop: "Grow by [n]" } },
    costume: { cat: "lo", label: { scratch: "next costume", jr: "🎭", hop: "Next costume" } },
    color: { cat: "lo", arg: "red", label: { hop: "🎨 Set trail color [n]" } },
    pen: { cat: "pe", label: { scratch: "✏️ pen down", hop: "✏️ Draw a trail" } },
    wait: { cat: "co", arg: 1, label: { scratch: "wait [n] seconds", jr: "⏱️ [n]", hop: "Wait [n] seconds" } },
    repeat: { cat: "co", arg: 4, label: { scratch: "repeat [n]", jr: "🔁 [n]", hop: "🔁 Repeat [n] times" } },
    end: { cat: "co", label: { scratch: "end repeat", jr: "end 🔁", hop: "end repeat" } }
  };
  const STEP_JR = 40;
  class Stage {
    constructor(root) {
      this.root = root; this.listeners = []; this.running = false; this.cursor = 0;
      root.innerHTML = `<div class="sg-wrap">
        <div class="sg-left">
          <div class="sg-stagebar"><button type="button" class="sg-btn sg-go" data-act="go">🏁 Go</button><button type="button" class="sg-btn" data-act="stopbtn">⏹</button><button type="button" class="sg-btn" data-act="reset">↺ Reset</button></div>
          <div class="sg-stage"><canvas width="480" height="360" aria-label="Stage"></canvas></div>
        </div>
        <div class="sg-right">
          <div class="sg-pal-h">🧩 Blocks — tap to add</div><div class="sg-palette"></div>
          <div class="sg-pal-h">📜 Your script <span class="sg-tip">(tap ✖ to remove · tap a gap ▸ to add there)</span></div><div class="sg-script"></div>
        </div></div>`;
      this.cv = root.querySelector("canvas"); this.ctx = this.cv.getContext("2d");
      root.querySelector('[data-act="go"]').onclick = () => this.run("flag");
      root.querySelector('[data-act="stopbtn"]').onclick = () => this.halt();
      root.querySelector('[data-act="reset"]').onclick = () => { this.halt(); this.resetSprite(); this.emit("reset"); };
      this.cv.addEventListener("pointerdown", (e) => {
        const r = this.cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 480 - 240, y = 180 - (e.clientY - r.top) / r.height * 360;
        const s = this.sp; if (Math.hypot(x - s.x, y - s.y) < 40 * s.size / 100 + 10) { this.emit("click"); this.run("click"); }
      });
      this.raf = requestAnimationFrame(this.loop = () => { this.draw(); this.raf = requestAnimationFrame(this.loop); });
    }
    on(f) { this.listeners.push(f); } off(f) { this.listeners = this.listeners.filter((x) => x !== f); }
    emit(type, d) { const ev = Object.assign({ type }, d || {}); this.listeners.slice().forEach((f) => { try { f(ev); } catch (e) { console.error(e); } }); }
    destroy() { cancelAnimationFrame(this.raf); this.halt(); this.listeners = []; this.root.innerHTML = ""; }
    load(cfg) {
      this.cfg = cfg = Object.assign({ mode: "scratch", blocks: ["flag", "move", "turn", "say", "wait", "repeat"], sprite: "🐱", costumes: null, start: { x: -150, y: 0, dir: 90 }, star: null, bg: "#ffffff" }, cfg);
      this.root.querySelector(".sg-wrap").dataset.mode = cfg.mode;
      this.script = (cfg.script || ["flag"]).map((k) => this.mk(k));
      this.cursor = this.script.length;
      this.resetSprite(); this.renderPalette(); this.renderScript();
    }
    mk(k, arg) { const d = CAT[k]; return { k, arg: arg !== undefined ? arg : d.arg }; }
    label(b) { const d = CAT[b.k]; const m = this.cfg.mode; return d.label[m] || d.label.scratch || d.label.jr; }
    resetSprite() {
      const s = this.cfg.start; this.sp = { x: s.x, y: s.y, dir: s.dir || 90, size: 100, costume: 0, say: null, pen: !!this.cfg.penAlways, penColor: "#7c3aed" };
      this.trail = []; this.turned = 0; this.moved = 0; this.starHit = false;
    }
    renderPalette() {
      const p = this.root.querySelector(".sg-palette"); p.innerHTML = "";
      this.cfg.blocks.forEach((k) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "sg-blk c-" + CAT[k].cat + (CAT[k].hat ? " hat" : ""); b.dataset.k = k;
        b.innerHTML = esc(this.label(this.mk(k))).replace("[n]", '<span class="sg-arg">' + esc(CAT[k].arg !== undefined ? CAT[k].arg : "") + "</span>");
        b.onclick = () => this.add(k);
        p.appendChild(b);
      });
    }
    add(k) {
      if (this.running) this.halt();
      if (CAT[k].hat) { this.script[0] = this.mk(k); this.emit("hat", { k }); }
      else {
        const at = Math.max(1, Math.min(this.cursor, this.script.length));
        if (k === "repeat") { this.script.splice(at, 0, this.mk("repeat"), this.mk("end")); this.cursor = at + 1; }
        else { this.script.splice(at, 0, this.mk(k)); this.cursor = at + 1; }
      }
      this.renderScript(); this.emit("block", { k });
    }
    renderScript() {
      const el = this.root.querySelector(".sg-script"); el.innerHTML = ""; let depth = 0;
      this.script.forEach((b, i) => {
        if (b.k === "end") depth = Math.max(0, depth - 1);
        if (i > 0) { const g = document.createElement("button"); g.type = "button"; g.className = "sg-gap" + (this.cursor === i ? " on" : ""); g.style.marginLeft = depth * 26 + "px"; g.textContent = this.cursor === i ? "▸ new blocks go here" : "▸"; g.onclick = () => { this.cursor = i; this.renderScript(); }; el.appendChild(g); }
        const row = document.createElement("div"); row.className = "sg-row"; row.style.marginLeft = depth * 26 + "px";
        const d = CAT[b.k];
        row.innerHTML = '<div class="sg-blk c-' + d.cat + (d.hat ? " hat" : "") + '" data-i="' + i + '">' +
          esc(this.label(b)).replace("[n]", '<input class="sg-in" aria-label="value" value="' + esc(b.arg) + '" size="' + Math.max(2, String(b.arg).length) + '">') + "</div>" +
          (i > 0 ? '<button type="button" class="sg-x" aria-label="remove">✖</button>' : "");
        const inp = row.querySelector(".sg-in");
        if (inp) inp.addEventListener("change", () => { b.arg = typeof d.arg === "number" ? Number(inp.value) || 0 : inp.value; inp.size = Math.max(2, inp.value.length); this.emit("edit", { k: b.k, arg: b.arg }); });
        const x = row.querySelector(".sg-x");
        if (x) x.onclick = () => { this.remove(i); };
        el.appendChild(row);
        if (b.k === "repeat") depth++;
      });
      const g = document.createElement("button"); g.type = "button"; g.className = "sg-gap" + (this.cursor >= this.script.length ? " on" : ""); g.textContent = this.cursor >= this.script.length ? "▸ new blocks go here" : "▸"; g.onclick = () => { this.cursor = this.script.length; this.renderScript(); }; el.appendChild(g);
    }
    remove(i) {
      const b = this.script[i];
      if (b.k === "repeat" || b.k === "end") { const pair = this.pairOf(i); this.script = this.script.filter((_, j) => j !== i && j !== pair); }
      else this.script.splice(i, 1);
      this.cursor = Math.min(this.cursor, this.script.length); this.renderScript(); this.emit("remove", { k: b.k });
    }
    pairOf(i) {
      if (this.script[i].k === "repeat") { let d = 0; for (let j = i; j < this.script.length; j++) { if (this.script[j].k === "repeat") d++; if (this.script[j].k === "end") { d--; if (d === 0) return j; } } }
      else { let d = 0; for (let j = i; j >= 0; j--) { if (this.script[j].k === "end") d++; if (this.script[j].k === "repeat") { d--; if (d === 0) return j; } } }
      return -1;
    }
    count(k) { return this.script.filter((b) => b.k === k).length; }
    halt() { this.runId = (this.runId || 0) + 1; this.running = false; this.root.querySelector(".sg-wrap").classList.remove("running"); }
    async run(hat) {
      if (this.script[0].k !== hat) { if (hat === "flag" && this.script[0].k === "click") this.emit("hint", { text: "Your script starts with 'when clicked' — click the sprite!" }); return; }
      this.halt(); const id = this.runId; this.running = true;
      if (hat === "flag") this.resetSprite();
      this.root.querySelector(".sg-wrap").classList.add("running");
      this.emit("run", { hat });
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const live = () => this.runId === id;
      const delay = this.cfg.mode === "scratch" ? 220 : 330;
      const exec = async (from, to) => {
        for (let i = from; i < to; i++) {
          if (!live()) return;
          const b = this.script[i]; this.hl = i; this.markRow(i);
          if (b.k === "repeat") { const e = this.pairOf(i); const n = Math.max(0, Math.min(50, Number(b.arg) || 0)); for (let r = 0; r < n; r++) await exec(i + 1, e < 0 ? to : e); i = e < 0 ? to : e; continue; }
          await this.doBlock(b, sleep, live);
          await sleep(delay);
        }
      };
      await exec(1, this.script.length);
      if (!live()) return;
      this.running = false; this.hl = -1; this.markRow(-1); this.root.querySelector(".sg-wrap").classList.remove("running");
      this.emit("done", { hat, x: this.sp.x, y: this.sp.y, turned: this.turned, moved: this.moved });
    }
    markRow(i) { this.root.querySelectorAll(".sg-script .sg-blk").forEach((el) => el.classList.toggle("now", Number(el.dataset.i) === i)); }
    async doBlock(b, sleep, live) {
      const s = this.sp; const a = b.arg;
      const glide = async (dx, dy) => {
        const n = 10; const x0 = s.x, y0 = s.y;
        for (let k = 1; k <= n; k++) { if (!live()) return; s.x = Math.max(-240, Math.min(240, x0 + dx * k / n)); s.y = Math.max(-180, Math.min(180, y0 + dy * k / n)); if (s.pen) this.trail.push([s.x, s.y, s.penColor]); this.checkStar(); await sleep(16); }
        this.moved += Math.hypot(dx, dy); this.emit("move", { x: s.x, y: s.y });
      };
      const jr = this.cfg.mode === "jr";
      switch (b.k) {
        case "move": { const d = (Number(a) || 0) * (jr ? STEP_JR : 1); const r = (90 - s.dir) * Math.PI / 180; if (s.pen && !this.trail.length) this.trail.push([s.x, s.y, s.penColor]); await glide(Math.cos(r) * d, Math.sin(r) * d); break; }
        case "back": await glide(-(Number(a) || 0) * STEP_JR, 0); break;
        case "up": await glide(0, (Number(a) || 0) * STEP_JR); break;
        case "down": await glide(0, -(Number(a) || 0) * STEP_JR); break;
        case "turn": { const d = jr ? (Number(a) || 0) * 90 : Number(a) || 0; for (let k = 1; k <= 6; k++) { s.dir += d / 6; await sleep(16); } this.turned += d; this.emit("turn", { dir: s.dir }); break; }
        case "goto": { const m = String(a).match(/-?\d+(\.\d+)?/g) || ["0", "0"]; await glide(Number(m[0]) - s.x, Number(m[1] || 0) - s.y); break; }
        case "say": s.say = String(a); this.emit("say", { text: s.say }); await sleep(900); if (live()) s.say = null; break;
        case "grow": s.size = Math.max(20, Math.min(300, s.size + (Number(a) || 0) * (jr ? 20 : 1))); this.emit("grow", { size: s.size }); break;
        case "costume": s.costume++; this.emit("costume", { n: s.costume }); break;
        case "color": s.penColor = String(a); s.pen = true; this.emit("color", { c: a }); break;
        case "pen": s.pen = true; this.trail.push([s.x, s.y, s.penColor]); this.emit("pen"); break;
        case "wait": await sleep(Math.max(0, Math.min(5, Number(a) || 0)) * 1000); break;
      }
    }
    checkStar() {
      const st = this.cfg.star; if (!st || this.starHit) return;
      if (Math.hypot(this.sp.x - st.x, this.sp.y - st.y) < (st.r || 34)) { this.starHit = true; this.emit("star"); }
    }
    draw() {
      const c = this.ctx; const s = this.sp; if (!s) return;
      c.fillStyle = this.cfg.bg; c.fillRect(0, 0, 480, 360);
      if (this.cfg.grid) { c.strokeStyle = "rgba(0,0,0,.07)"; for (let x = 0; x <= 480; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 360); c.stroke(); } for (let y = 0; y <= 360; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(480, y); c.stroke(); } }
      if (this.cfg.scenery) { c.font = "40px system-ui"; this.cfg.scenery.forEach(([e, x, y]) => c.fillText(e, 240 + x - 20, 180 - y + 14)); }
      const st = this.cfg.star;
      if (st) { c.font = (this.starHit ? 64 : 48) + "px system-ui"; c.textAlign = "center"; c.fillText(this.starHit ? "🎉" : st.emoji || "⭐", 240 + st.x, 180 - st.y + 16); c.textAlign = "left"; }
      if (this.trail.length > 1) { c.lineWidth = 5; c.lineCap = "round"; for (let i = 1; i < this.trail.length; i++) { const [x0, y0] = this.trail[i - 1], [x1, y1, col] = this.trail[i]; c.strokeStyle = col; c.beginPath(); c.moveTo(240 + x0, 180 - y0); c.lineTo(240 + x1, 180 - y1); c.stroke(); } }
      const cos = this.cfg.costumes || [this.cfg.sprite];
      const em = cos[s.costume % cos.length];
      c.save(); c.translate(240 + s.x, 180 - s.y);
      if (this.cfg.rotate !== false) c.rotate((s.dir - 90) * Math.PI / 180);
      const fs = 64 * s.size / 100; c.font = fs + "px system-ui"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(em, 0, 0); c.restore();
      if (s.say) {
        const tx = 240 + s.x + 20, ty = 180 - s.y - 60 * s.size / 100; c.font = "bold 18px system-ui"; const w = c.measureText(s.say).width + 24;
        c.fillStyle = "#fff"; c.strokeStyle = "#6b7280"; c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(tx, ty - 30, w, 36, 12) : c.rect(tx, ty - 30, w, 36); c.fill(); c.stroke();
        c.fillStyle = "#111"; c.textBaseline = "middle"; c.fillText(s.say, tx + 12, ty - 12); c.textBaseline = "alphabetic";
      }
    }
    // closed-shape check for square/triangle missions
    shape() {
      if (this.trail.length < 3) return { closed: false, turned: this.turned };
      const [x0, y0] = this.trail[0], [x1, y1] = this.trail[this.trail.length - 1];
      return { closed: Math.hypot(x1 - x0, y1 - y0) < 12 && this.moved > 150, turned: this.turned, moved: this.moved };
    }
  }
  global.Stage = Stage;
})(window);
