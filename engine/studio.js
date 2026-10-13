/* Code Companion — Mini Roblox Studio playground */
(function (global) {
  "use strict";
  const W = 32, Y_MIN = -2, Y_MAX = 14, CW = 960, CH = 480, S = CW / W;
  const GRAV = 60, RUN = 6, JUMP = 21;
  const L = global.Luau;

  const SWATCHES = [
    ["Medium stone grey", "#a3a2a5"], ["Really red", "#ff0000"], ["Bright orange", "#da8541"],
    ["New Yeller", "#ffff00"], ["Lime green", "#00ff00"], ["Bright blue", "#0d69ac"],
    ["Toothpaste", "#00ffff"], ["Royal purple", "#6225d1"], ["Hot pink", "#ff66cc"],
    ["Institutional white", "#f8f8f8"], ["Black", "#1b2a35"]
  ];
  const BRICK = {
    "medium stone grey": "#a3a2a5", "really red": "#ff0000", "bright red": "#c4281c", "bright orange": "#da8541",
    "new yeller": "#ffff00", "bright yellow": "#f5cd30", "lime green": "#00ff00", "bright green": "#4b974b",
    "bright blue": "#0d69ac", "really blue": "#0000ff", "toothpaste": "#00ffff", "royal purple": "#6225d1",
    "hot pink": "#ff66cc", "institutional white": "#f8f8f8", "white": "#f2f3f3", "black": "#1b2a35",
    "really black": "#111111", "gold": "#efb838", "neon orange": "#d5733d", "cyan": "#04afec"
  };
  const THEMES = {
    roblox: { explorer: "Explorer", props: "Properties", part: "Part", sphere: "Sphere", anchored: "Anchored", workspace: "Workspace", play: "Play" },
    unity: { explorer: "Hierarchy", props: "Inspector", part: "Cube", sphere: "Sphere", anchored: "Static (no gravity)", workspace: "Scene", play: "Play" }
  };

  function hexToRgb(h) { h = h.replace("#", ""); return { r: parseInt(h.substr(0, 2), 16) / 255, g: parseInt(h.substr(2, 2), 16) / 255, b: parseInt(h.substr(4, 2), 16) / 255 }; }
  function rgbToHex(r, g, b) { const c = (v) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, "0"); return "#" + c(r) + c(g) + c(b); }
  function colorName(hex) {
    const { r, g, b } = hexToRgb(hex);
    if (r > 0.6 && g < 0.45 && b < 0.45) return "red";
    if (b > 0.5 && r < 0.4 && g < 0.6) return "blue";
    if (g > 0.55 && r < 0.45 && b < 0.5) return "green";
    if (r > 0.7 && g > 0.7 && b < 0.4) return "yellow";
    if (r > 0.7 && g > 0.35 && g < 0.7 && b < 0.35) return "orange";
    if (r > 0.6 && b > 0.5 && g < 0.5) return "pink";
    if (r < 0.5 && b > 0.6 && g < 0.4) return "purple";
    if (g > 0.6 && b > 0.6 && r < 0.4) return "cyan";
    if (r > 0.9 && g > 0.9 && b > 0.9) return "white";
    if (r < 0.2 && g < 0.25 && b < 0.3) return "black";
    return "grey";
  }
  const snap = (v) => Math.round(v * 2) / 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let UID = 1;

  function makePart(o) {
    return Object.assign({
      id: "p" + (UID++), name: "Part", x: 14, y: 11, w: 4, h: 1, color: "#a3a2a5", anchored: true,
      canCollide: true, transparency: 0, shape: "block", kind: "part", locked: false, user: true
    }, o || {});
  }
  function bounds(p) { return { l: p.x - p.w / 2, r: p.x + p.w / 2, b: p.y - p.h / 2, t: p.y + p.h / 2 }; }
  function overlap(a, b, pad) { pad = pad || 0; return a.l < b.r + pad && a.r > b.l - pad && a.b < b.t + pad && a.t > b.b - pad; }

  class Studio {
    constructor(container) {
      this.root = container; this.listeners = []; this.parts = []; this.selected = null;
      this.tool = "move"; this.playing = false; this.ghost = null; this.hand = null;
      this.cfg = {}; this.history = []; this.coins = 0; this.points = 0; this.time = 0;
      this.build();
      this.loop = this.loop.bind(this); this.lastT = performance.now();
      this.raf = requestAnimationFrame(this.loop);
    }
    $(sel) { return this.root.querySelector(sel); }
    on(fn) { this.listeners.push(fn); }
    off(fn) { this.listeners = this.listeners.filter((f) => f !== fn); }
    emit(type, data) { const ev = Object.assign({ type, t: performance.now() }, data || {}); this.listeners.slice().forEach((f) => { try { f(ev); } catch (e) { console.error(e); } }); }
    destroy() { cancelAnimationFrame(this.raf); this.stop("leave", true); this.listeners = []; this.root.innerHTML = ""; }

    build() {
      this.root.innerHTML = `
      <div class="st-wrap">
        <div class="st-toolbar" role="toolbar" aria-label="Studio tools">
          <button type="button" class="st-btn" data-act="part">🧱 <span data-lbl="part">Part</span></button>
          <button type="button" class="st-btn" data-act="sphere">⚪ <span data-lbl="sphere">Sphere</span></button>
          <button type="button" class="st-btn" data-act="checkpoint">🚩 Checkpoint</button>
          <span class="st-sep"></span>
          <button type="button" class="st-btn st-tool on" data-tool="move">✋ Move</button>
          <button type="button" class="st-btn st-tool" data-tool="scale">↔️ Scale</button>
          <button type="button" class="st-btn st-tool" data-tool="rotate">🔄 Rotate</button>
          <button type="button" class="st-btn" data-act="delete" aria-label="Delete selected">🗑️</button>
          <span class="st-grow"></span>
          <button type="button" class="st-btn st-play" data-act="play">▶ <span data-lbl="play">Play</span></button>
        </div>
        <div class="st-main">
          <div class="st-explorer"><h4 data-lbl="explorer">Explorer</h4><ul class="st-tree"></ul></div>
          <div class="st-stage">
            <canvas width="${CW}" height="${CH}" aria-label="Game world. Drag parts to move them."></canvas>
            <div class="st-status">✏️ Edit mode</div>
            <div class="st-hud hidden">🪙 <b class="st-coins">0</b></div>
            <div class="st-toast"></div>
          </div>
          <div class="st-props"><h4 data-lbl="props">Properties</h4><div class="st-props-body"><p class="st-empty">Tap a part to see its properties</p></div></div>
        </div>
        <div class="st-code hidden">
          <div class="st-code-head">
            <span class="st-code-title">📜 Script</span>
            <span class="st-script-where"></span>
            <span class="st-grow"></span>
            <button type="button" class="st-btn st-mode on" data-mode="blocks">🧩 Blocks</button>
            <button type="button" class="st-btn st-mode" data-mode="code">⌨️ Luau only</button>
          </div>
          <div class="st-blocks"></div>
          <div class="st-editor"><pre class="st-gutter" aria-hidden="true">1</pre><textarea class="st-ta" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Luau code editor"></textarea></div>
          <div class="st-output" aria-live="polite"></div>
        </div>
        <div class="st-feedback hidden"></div>
      </div>`;
      this.canvas = this.$("canvas"); this.ctx = this.canvas.getContext("2d");
      this.ta = this.$(".st-ta"); this.gutter = this.$(".st-gutter");
      this.root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => this.action(b.dataset.act)));
      this.root.querySelectorAll("[data-tool]").forEach((b) => b.addEventListener("click", () => this.setTool(b.dataset.tool)));
      this.root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => this.setCodeMode(b.dataset.mode)));
      const cv = this.canvas;
      cv.addEventListener("pointerdown", (e) => this.pDown(e));
      cv.addEventListener("pointermove", (e) => this.pMove(e));
      cv.addEventListener("pointerup", (e) => this.pUp(e));
      cv.addEventListener("pointercancel", (e) => this.pUp(e));
      this.ta.addEventListener("input", () => { this.updateGutter(); clearTimeout(this._ct); this._ct = setTimeout(() => this.emit("code", { code: this.ta.value }), 250); });
      this.ta.addEventListener("scroll", () => { this.gutter.scrollTop = this.ta.scrollTop; });
      this.ta.addEventListener("keydown", (e) => {
        if (e.key === "Tab") { e.preventDefault(); this.insertAtCaret("  "); }
      });
      this.root.addEventListener("keydown", (e) => {
        if (e.target === this.ta || (e.target.tagName === "INPUT")) return;
        if (!this.selected || this.playing) return;
        const p = this.selected; if (p.locked) return;
        const d = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, 0.5], ArrowDown: [0, -0.5] }[e.key];
        if (d) { e.preventDefault(); p.x = clamp(p.x + d[0], p.w / 2, W - p.w / 2); p.y = clamp(p.y + d[1], Y_MIN + p.h / 2, Y_MAX - p.h / 2); this.emit("move", { part: p }); this.renderProps(); }
        if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); this.action("delete"); }
      });
      cv.tabIndex = 0;
    }

    /* ---------- setup ---------- */
    load(cfg) {
      this.stop("reset", true);
      this.cfg = cfg = Object.assign({ tools: ["part", "move", "scale", "rotate", "delete"], defaultAnchored: true, theme: "roblox", code: null, blocks: [] }, cfg);
      this.labels = THEMES[cfg.theme] || THEMES.roblox;
      this.root.querySelectorAll("[data-lbl]").forEach((el) => { el.textContent = this.labels[el.dataset.lbl] || el.textContent; });
      this.parts = (cfg.parts || []).map((p) => makePart(Object.assign({ user: false }, p)));
      this.selected = null; this.history = []; this.ghost = null; this.hand = null;
      const all = ["part", "sphere", "checkpoint", "move", "scale", "rotate", "delete"];
      all.forEach((t) => {
        const el = this.root.querySelector('[data-act="' + t + '"],[data-tool="' + t + '"]');
        if (el) el.classList.toggle("hidden", cfg.tools.indexOf(t) === -1);
      });
      this.setTool("move");
      const code = this.$(".st-code");
      if (cfg.code !== null && cfg.code !== undefined) {
        code.classList.remove("hidden");
        this.ta.value = cfg.code; this.updateGutter();
        this.$(".st-script-where").textContent = cfg.scriptParent ? "inside " + cfg.scriptParent : "in " + this.labels.workspace;
        this.renderBlocks();
        this.setCodeMode(cfg.codeMode || "blocks");
      } else code.classList.add("hidden");
      this.$(".st-output").innerHTML = "";
      this.$(".st-feedback").classList.add("hidden");
      this.$(".st-hud").classList.toggle("hidden", !cfg.showCoins);
      this.coins = 0; this.$(".st-coins").textContent = "0";
      this.resetAvatar();
      this.renderTree(); this.renderProps();
    }
    resetAvatar() {
      const sp = this.parts.find((p) => p.kind === "spawn") || { x: 2, y: 3, w: 4, h: 1 };
      this.spawnPt = { x: sp.x - sp.w / 2 + 1, y: sp.y + sp.h / 2 + 1 };
      this.av = { x: this.spawnPt.x, y: this.spawnPt.y, w: 1, h: 2, vx: 0, vy: 0, onGround: true, dead: false, health: 100, speed: RUN, jump: JUMP, dir: 1, anim: 0, win: false };
    }
    userParts() { return this.parts.filter((p) => p.user); }
    find(name) { return this.parts.find((p) => p.name === name) || null; }
    getCode() { return this.ta.value; }
    setGhost(z) { this.ghost = z ? Object.assign({}, z) : null; }
    toast(msg, ms) {
      const t = this.$(".st-toast"); t.textContent = msg; t.classList.add("show");
      clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove("show"), ms || 1800);
    }

    /* ---------- toolbar ---------- */
    setTool(t) {
      this.tool = t;
      this.root.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("on", b.dataset.tool === t));
      this.emit("tool", { tool: t });
    }
    action(a) {
      if (a === "play") { if (this.playing) this.stop("user"); else this.play(); return; }
      if (this.playing) { this.toast("Press ■ Stop first to edit"); return; }
      if (a === "part" || a === "sphere" || a === "checkpoint") { this.insertPart(a); return; }
      if (a === "delete") {
        const p = this.selected;
        if (!p) { this.toast("Tap a part first, then 🗑️"); return; }
        if (p.locked) { this.toast("🔒 That's a mission part — it stays!"); return; }
        this.parts = this.parts.filter((q) => q !== p); this.selected = null;
        this.emit("delete", { part: p }); this.renderTree(); this.renderProps();
      }
    }
    insertPart(kind) {
      let p;
      const n = this.userParts().length;
      const ox = (n % 4) * 1.5;
      if (kind === "sphere") p = makePart({ name: "Ball", shape: "ball", w: 2, h: 2, x: 13 + ox, y: 11 });
      else if (kind === "checkpoint") p = makePart({ name: "Checkpoint", kind: "checkpoint", w: 3, h: 1, x: 13 + ox, y: 11, color: "#4b974b" });
      else p = makePart({ x: 13 + ox, y: 11 });
      p.anchored = this.cfg.defaultAnchored !== false;
      p.user = true;
      this.parts.push(p); this.select(p);
      this.emit("insert", { part: p, kind });
      this.toast("New " + (kind === "sphere" ? this.labels.sphere : kind === "checkpoint" ? "Checkpoint" : this.labels.part) + "! Drag it into place ✋");
      return p;
    }
    select(p) {
      this.selected = p; this.renderTree(); this.renderProps();
      if (p) this.emit("select", { part: p });
    }

    /* ---------- pointer ---------- */
    toWorld(e) {
      const r = this.canvas.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width * CW, cy = (e.clientY - r.top) / r.height * CH;
      return { x: cx / S, y: Y_MAX - cy / S };
    }
    hitTest(pt) {
      for (let i = this.parts.length - 1; i >= 0; i--) {
        const p = this.parts[i];
        if (p.shape === "ball") { if (Math.hypot(pt.x - p.x, pt.y - p.y) <= p.w / 2 + 0.35) return p; continue; }
        const b = bounds(p); const padX = Math.max(0.3, (0.9 - p.w) / 2), padY = Math.max(0.3, (0.9 - p.h) / 2);
        if (pt.x >= b.l - padX && pt.x <= b.r + padX && pt.y >= b.b - padY && pt.y <= b.t + padY) return p;
      }
      return null;
    }
    pDown(e) {
      this.canvas.focus();
      if (this.playing) { this.toast("Playing! Press ■ Stop to edit"); return; }
      const pt = this.toWorld(e); const hit = this.hitTest(pt);
      if (!hit) { this.select(null); return; }
      this.select(hit);
      if (this.tool === "rotate") {
        if (hit.locked) { this.toast("🔒 Mission part"); return; }
        const w = hit.w; hit.w = hit.h; hit.h = w;
        hit.x = clamp(hit.x, hit.w / 2, W - hit.w / 2); hit.y = clamp(hit.y, Y_MIN + hit.h / 2, Y_MAX - hit.h / 2);
        this.emit("rotate", { part: hit }); this.renderProps(); return;
      }
      if (hit.locked) { this.toast("🔒 That's a mission part — it can't move"); return; }
      try { this.canvas.setPointerCapture(e.pointerId); } catch (err) {}
      const b = bounds(hit);
      this.drag = { mode: this.tool, part: hit, ox: pt.x - hit.x, oy: pt.y - hit.y, p0: pt, w0: hit.w, h0: hit.h, l0: b.l, b0: b.b, moved: false };
      e.preventDefault();
    }
    pMove(e) {
      const d = this.drag; if (!d) return;
      const pt = this.toWorld(e); const p = d.part;
      if (d.mode === "scale") {
        if (p.shape === "ball") { const s = clamp(snap(d.w0 + Math.max(pt.x - d.p0.x, pt.y - d.p0.y)), 1, 8); p.w = p.h = s; }
        else { p.w = clamp(snap(d.w0 + (pt.x - d.p0.x)), 1, 24); p.h = clamp(snap(d.h0 + (pt.y - d.p0.y)), 0.5, 10); }
        p.x = clamp(d.l0 + p.w / 2, p.w / 2, W - p.w / 2); p.y = clamp(d.b0 + p.h / 2, Y_MIN + p.h / 2, Y_MAX - p.h / 2);
      } else {
        p.x = clamp(snap(pt.x - d.ox), p.w / 2, W - p.w / 2); p.y = clamp(snap(pt.y - d.oy), Y_MIN + p.h / 2, Y_MAX - p.h / 2);
      }
      d.moved = true;
      if (!this._propT) this._propT = setTimeout(() => { this._propT = null; this.renderProps(); }, 120);
    }
    pUp() {
      const d = this.drag; this.drag = null; if (!d) return;
      if (d.moved) { this.emit(d.mode === "scale" ? "scale" : "move", { part: d.part }); this.renderProps(); }
    }
    animateMoveTo(p, x, y, ms) {
      ms = ms || 1100;
      return new Promise((res) => {
        const x0 = p.x, y0 = p.y, t0 = performance.now();
        this.hand = { x: x0, y: y0 };
        const step = () => {
          const k = Math.min(1, (performance.now() - t0) / ms); const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          p.x = x0 + (x - x0) * e; p.y = y0 + (y - y0) * e; this.hand = { x: p.x, y: p.y };
          if (k < 1) requestAnimationFrame(step); else { p.x = snap(x); p.y = snap(y); this.hand = null; this.emit("move", { part: p, demo: true }); this.renderProps(); res(); }
        };
        requestAnimationFrame(step);
      });
    }

    /* ---------- panels ---------- */
    renderTree() {
      const ul = this.$(".st-tree"); if (!ul) return;
      const icon = (p) => p.kind === "spawn" ? "🟦" : p.kind === "finish" ? "🏁" : p.kind === "checkpoint" ? "🚩" : p.kind === "coin" ? "🪙" : p.shape === "ball" ? "⚪" : "🧱";
      let html = '<li class="st-ws">🌍 ' + this.labels.workspace + "</li>";
      this.parts.forEach((p) => {
        html += '<li><button type="button" class="st-node' + (p === this.selected ? " on" : "") + '" data-id="' + p.id + '">' + icon(p) + " " + esc(p.name) + (p.anchored ? "" : ' <span title="not anchored">🪂</span>') + "</button></li>";
        if (this.cfg.code != null && this.cfg.scriptParent === p.name) html += '<li class="st-sub">📜 Script</li>';
      });
      if (this.cfg.code != null && !this.cfg.scriptParent) html += '<li class="st-sub">📜 Script</li>';
      ul.innerHTML = html;
      ul.querySelectorAll(".st-node").forEach((b) => b.addEventListener("click", () => { if (this.playing) return; this.select(this.parts.find((p) => p.id === b.dataset.id)); }));
    }
    renderProps() {
      const body = this.$(".st-props-body"); const p = this.selected;
      this.renderTree();
      if (!p) { body.innerHTML = '<p class="st-empty">Tap a part to see its properties 👆</p>'; return; }
      const lockMsg = p.locked ? '<p class="st-lock">🔒 Mission part</p>' : "";
      const sw = SWATCHES.map(([n, c]) => '<button type="button" class="st-sw' + (p.color.toLowerCase() === c ? " on" : "") + '" data-c="' + c + '" title="' + n + '" aria-label="' + n + '" style="background:' + c + '"></button>').join("");
      body.innerHTML = lockMsg + `
        <label class="st-row"><span>Name</span><input class="st-name" value="${esc(p.name)}" maxlength="20" ${p.kind === "spawn" || p.kind === "finish" ? "disabled" : ""}></label>
        <div class="st-row st-col" data-prop="color"><span>Color</span><div class="st-sws">${sw}</div></div>
        <label class="st-row st-toggle" data-prop="anchored"><span>⚓ ${this.labels.anchored}</span><input type="checkbox" class="st-anch" ${p.anchored ? "checked" : ""}><i></i></label>
        <label class="st-row st-toggle" data-prop="cancollide"><span>🧱 CanCollide</span><input type="checkbox" class="st-coll" ${p.canCollide ? "checked" : ""}><i></i></label>
        <label class="st-row" data-prop="transparency"><span>👻 Transparency <b class="st-tv">${p.transparency}</b></span><input type="range" class="st-tr" min="0" max="1" step="0.1" value="${p.transparency}"></label>
        <div class="st-row" data-prop="size"><span>📏 Size</span>
          <div class="st-steps">
            <span>W</span><button type="button" data-sz="w-">−</button><b>${p.w}</b><button type="button" data-sz="w+">+</button>
            <span>H</span><button type="button" data-sz="h-">−</button><b>${p.h}</b><button type="button" data-sz="h+">+</button>
          </div></div>
        <div class="st-row st-pos"><span>📍 Position</span><b>${p.x}, ${p.y}</b></div>`;
      const set = (k, v) => { if (this.playing) { this.toast("Press ■ Stop to edit"); this.renderProps(); return; } this.setProp(p, k, v, false); };
      body.querySelector(".st-name").addEventListener("change", (e) => set("Name", e.target.value.trim() || "Part"));
      body.querySelectorAll(".st-sw").forEach((b) => b.addEventListener("click", () => set("Color", b.dataset.c)));
      body.querySelector(".st-anch").addEventListener("change", (e) => set("Anchored", e.target.checked));
      body.querySelector(".st-coll").addEventListener("change", (e) => set("CanCollide", e.target.checked));
      body.querySelector(".st-tr").addEventListener("input", (e) => set("Transparency", Number(e.target.value)));
      body.querySelectorAll("[data-sz]").forEach((b) => b.addEventListener("click", () => {
        if (p.locked) { this.toast("🔒 Mission part"); return; }
        const k = b.dataset.sz; const d = k[1] === "+" ? 1 : -1;
        if (p.shape === "ball") { const s = clamp(p.w + d, 1, 8); p.w = p.h = s; }
        else if (k[0] === "w") { const l = p.x - p.w / 2; p.w = clamp(p.w + d, 1, 24); p.x = clamp(l + p.w / 2, p.w / 2, W - p.w / 2); }
        else { const bt = p.y - p.h / 2; p.h = clamp(p.h + d * 0.5, 0.5, 10); p.y = bt + p.h / 2; }
        this.emit("scale", { part: p }); this.renderProps();
      }));
    }
    setProp(p, key, v, byScript) {
      if (key === "Color") p.color = v;
      else if (key === "Anchored") p.anchored = !!v;
      else if (key === "CanCollide") p.canCollide = !!v;
      else if (key === "Transparency") p.transparency = clamp(Number(v), 0, 1);
      else if (key === "Name") p.name = String(v);
      if (!byScript) this.renderProps();
      this.emit("prop", { part: p, key, value: v, byScript: !!byScript });
    }

    /* ---------- code panel ---------- */
    setCodeMode(m) {
      this.codeMode = m;
      this.root.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
      this.$(".st-blocks").classList.toggle("hidden", m !== "blocks");
    }
    renderBlocks() {
      const el = this.$(".st-blocks");
      const bl = this.cfg.blocks || [];
      el.innerHTML = bl.length ? '<span class="st-bl-tip">Tap a block to add its code ➜</span>' + bl.map((b, i) => '<button type="button" class="st-block" draggable="true" data-i="' + i + '">' + esc(b.label) + "</button>").join("") : "";
      el.querySelectorAll(".st-block").forEach((b) => {
        const blk = bl[Number(b.dataset.i)];
        b.addEventListener("click", () => this.insertCode(blk.code));
        b.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", blk.code + "\n"); });
      });
    }
    insertAtCaret(text) {
      const ta = this.ta; const s = ta.selectionStart, e = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + text + ta.value.slice(e); ta.selectionStart = ta.selectionEnd = s + text.length;
      ta.dispatchEvent(new Event("input"));
    }
    insertCode(code) {
      const ta = this.ta; const lines = ta.value.split("\n");
      const mi = lines.findIndex((l) => l.indexOf("✏️") !== -1);
      if (mi >= 0) {
        const indent = (lines[mi].match(/^\s*/) || [""])[0];
        const add = code.split("\n").map((l) => indent + l);
        lines.splice(mi, 0, ...add);
        ta.value = lines.join("\n");
      } else {
        ta.value = ta.value.replace(/\s*$/, "") + "\n" + code + "\n";
      }
      ta.dispatchEvent(new Event("input"));
      this.flashEditor();
      this.emit("block", { code });
    }
    flashEditor() { const ed = this.$(".st-editor"); ed.classList.remove("flash"); void ed.offsetWidth; ed.classList.add("flash"); }
    updateGutter(errLine) {
      const n = this.ta.value.split("\n").length; let s = "";
      for (let i = 1; i <= n; i++) s += (i === errLine ? "❗" : i) + "\n";
      this.gutter.textContent = s;
    }
    flashLine(line) {
      if (!line) return;
      this.updateGutter(line);
      const lines = this.ta.value.split("\n"); let pos = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) pos += lines[i].length + 1;
      try { this.ta.focus({ preventScroll: true }); this.ta.setSelectionRange(pos, pos + (lines[line - 1] || "").length); } catch (e) {}
    }
    output(msg, kind) {
      const o = this.$(".st-output"); const d = document.createElement("div");
      d.className = "st-out " + (kind || ""); d.textContent = msg; o.appendChild(d);
      while (o.children.length > 40) o.removeChild(o.firstChild);
      o.scrollTop = o.scrollHeight;
    }

    /* ---------- play ---------- */
    play() {
      if (this.playing) return;
      this.snapshot = JSON.parse(JSON.stringify(this.parts));
      this.playing = true; this.result = null; this.time = 0; this.respawns = 0; this.checkpoint = null;
      this.touching = new Set(); this.touchedOnce = new Set(); this.handlers = new Map();
      this.fallStart = new Map(); this.parts.forEach((p) => { p.vy = 0; this.fallStart.set(p.id, p.y); });
      this.coins = 0; this.$(".st-coins").textContent = "0";
      this.resetAvatar(); this.av.wait = 0.5;
      const btn = this.$('[data-act="play"]'); btn.innerHTML = "■ Stop"; btn.classList.add("stop");
      this.$(".st-status").textContent = "▶ Playing…"; this.$(".st-status").classList.add("play");
      this.root.classList.add("is-playing");
      this.updateGutter();
      this.emit("play");
      const code = this.cfg.code != null ? this.ta.value : "";
      if (code.trim()) this.runScript(code);
    }
    stop(reason, silent) {
      if (!this.playing) return;
      this.playing = false;
      if (this.interp) { this.interp.stopped = true; this.interp = null; }
      clearTimeout(this._endT);
      const selId = this.selected && this.selected.id;
      this.parts = (this.snapshot || []).map((p) => Object.assign({}, p));
      this.selected = this.parts.find((p) => p.id === selId) || null;
      this.resetAvatar();
      const btn = this.$('[data-act="play"]'); if (btn) { btn.innerHTML = "▶ " + this.labels.play; btn.classList.remove("stop"); }
      const st = this.$(".st-status"); if (st) { st.textContent = "✏️ Edit mode"; st.classList.remove("play"); }
      this.root.classList.remove("is-playing");
      this.renderTree(); this.renderProps();
      if (!silent) this.emit("stop", { reason, result: this.result });
    }
    endPlay(result, delay) {
      if (this.result) return;
      this.result = result; this.history.push(result);
      clearTimeout(this._endT); this._endT = setTimeout(() => this.stop(result), delay || 1500);
    }

    /* ---------- scripting bridge ---------- */
    runScript(code) {
      const it = new L.Interp(); this.interp = it; const studio = this;
      const err = (e) => {
        if (e === L.STOP || !studio.playing || studio.interp !== it) return;
        const msg = L.friendly(e); studio.output("❌ " + msg, "err"); studio.flashLine(e.line);
        studio.emit("scriptError", { message: e.message || String(e), line: e.line, text: msg });
      };
      this.installEnv(it, err);
      it.run(code).then(() => this.emit("scriptRan")).catch(err);
    }
    installEnv(it, onErr) {
      const studio = this; const LE = L.LuauError;
      const cache = new Map();
      const sleep = (s) => new Promise((res, rej) => {
        const ms = Math.max(0.016, Number(s) || 0.03) * 1000;
        const t0 = performance.now();
        const chk = () => {
          if (it.stopped) return rej(L.STOP);
          if (performance.now() - t0 >= ms) { it.resetOps(); return res(); }
          setTimeout(chk, Math.min(50, ms));
        };
        chk();
      });
      const call = (fn, args) => it.callFunction(fn, args, 0).catch(onErr);
      const signal = (part) => ({
        __type: "RBXScriptSignal",
        __get(k) {
          if (k === "Connect" || k === "connect") return (a) => {
            const fn = a[1];
            if (!fn) throw new LE("Connect needs a function, like :Connect(function(hit) ... end)");
            if (!studio.handlers.has(part.id)) studio.handlers.set(part.id, []);
            const h = { fn, on: true }; studio.handlers.get(part.id).push(h);
            return { __type: "RBXScriptConnection", __get(kk) { if (kk === "Disconnect") return () => { h.on = false; }; return null; } };
          };
          if (k === "Wait") return () => new Promise(() => {});
          throw new LE('A Touched event uses :Connect(...)');
        }
      });
      const humanoid = {
        __type: "Humanoid",
        __get(k) {
          if (k === "Health") return studio.av.health; if (k === "MaxHealth") return 100;
          if (k === "WalkSpeed") return studio.av.speed; if (k === "JumpPower") return studio.av.jump * 2.4;
          if (k === "Name") return "Humanoid"; if (k === "Parent") return character;
          if (k === "TakeDamage") return (a) => { studio.damage(Number(a[1]) || 0); };
          if (k === "IsA") return (a) => a[1] === "Humanoid";
          throw new LE('"' + k + '" isn\'t something a Humanoid has. Try Health, WalkSpeed or JumpPower.');
        },
        __set(k, v) {
          if (k === "Health") { studio.av.health = Number(v); if (studio.av.health <= 0) studio.kill("died"); return; }
          if (k === "WalkSpeed") { studio.av.speed = clamp(Number(v), 0, 16) * (RUN / 16) * 2.2; studio.emit("walkspeed", { value: v }); return; }
          if (k === "JumpPower") { studio.av.jump = clamp(Number(v), 0, 120) / 2.4; return; }
          throw new LE("You can't change " + k + " on a Humanoid here");
        }
      };
      const root = { __type: "Part", __get(k) { if (k === "Parent") return character; if (k === "Name") return "HumanoidRootPart"; if (k === "Position") return L.mkVec(studio.av.x, studio.av.y, 0); if (k === "IsA") return (a) => a[1] === "Part" || a[1] === "BasePart"; if (k === "FindFirstChild") return () => null; return null; }, __set() {} };
      const character = {
        __type: "Model",
        __get(k) {
          if (k === "Name") return studio.studentName || "Player";
          if (k === "Humanoid") return humanoid; if (k === "HumanoidRootPart") return root;
          if (k === "FindFirstChild" || k === "WaitForChild" || k === "FindFirstChildOfClass") return (a) => a[1] === "Humanoid" ? humanoid : a[1] === "HumanoidRootPart" ? root : null;
          if (k === "Parent") return workspace;
          throw new LE('A character doesn\'t have "' + k + '". Try FindFirstChild("Humanoid").');
        }
      };
      const stat = (key) => ({ __type: "IntValue", __get(k) { if (k === "Value") return key === "Coins" ? studio.coins : studio.points; if (k === "Name") return key; return null; },
        __set(k, v) { if (k !== "Value") throw new LE("Use .Value to change a leaderstat"); if (key === "Coins") { studio.coins = Number(v); studio.$(".st-hud").classList.remove("hidden"); studio.$(".st-coins").textContent = String(studio.coins); studio.emit("coins", { value: studio.coins }); } else { studio.points = Number(v); studio.emit("points", { value: v }); } } });
      const coinsStat = stat("Coins"), pointsStat = stat("Points");
      const leaderstats = { __type: "Folder", __get(k) { if (k === "Coins") return coinsStat; if (k === "Points" || k === "Score") return pointsStat; if (k === "FindFirstChild" || k === "WaitForChild") return (a) => a[1] === "Coins" ? coinsStat : (a[1] === "Points" || a[1] === "Score") ? pointsStat : null; if (k === "Name") return "leaderstats"; throw new LE('leaderstats has Coins and Points here, not "' + k + '"'); } };
      const player = { __type: "Player", __get(k) { if (k === "Name" || k === "DisplayName") return studio.studentName || "Player"; if (k === "Character") return character; if (k === "leaderstats") return leaderstats; if (k === "FindFirstChild" || k === "WaitForChild") return (a) => a[1] === "leaderstats" ? leaderstats : null; throw new LE('A Player doesn\'t have "' + k + '"'); } };
      const players = { __type: "Players", __get(k) {
        if (k === "LocalPlayer") return player;
        if (k === "GetPlayerFromCharacter") return (a) => a[1] === character ? player : null;
        if (k === "GetPlayers") return () => L.LuaTable.fromArray([player]);
        if (k === "Name") return "Players";
        throw new LE('Players doesn\'t have "' + k + '"');
      } };
      const wrap = (p) => {
        if (!p) return null;
        if (cache.has(p.id)) return cache.get(p.id);
        const sig = signal(p);
        const inst = {
          __type: "Part", __part: p,
          __get(k, line) {
            switch (k) {
              case "Name": return p.name;
              case "Color": { const c = hexToRgb(p.color); return L.mkColor(c.r, c.g, c.b); }
              case "BrickColor": return { __type: "BrickColor", Name: p.color, __get(kk) { return kk === "Name" ? p.color : null; } };
              case "Anchored": return p.anchored; case "CanCollide": return p.canCollide; case "Transparency": return p.transparency;
              case "Position": return L.mkVec(p.x, p.y, 0); case "Size": return L.mkVec(p.w, p.h, 1);
              case "Parent": return studio.parts.indexOf(p) >= 0 ? workspace : null;
              case "ClassName": return "Part"; case "Shape": return p.shape === "ball" ? "Ball" : "Block";
              case "Touched": return sig;
              case "Destroy": return () => { studio.parts = studio.parts.filter((q) => q !== p); studio.emit("destroy", { part: p, byScript: true }); };
              case "Clone": return () => { const c = makePart(Object.assign({}, p, { id: undefined, user: true })); c.id = "p" + (UID++); return wrap(c); };
              case "IsA": return (a) => ["Part", "BasePart", "Instance"].indexOf(a[1]) >= 0;
              case "FindFirstChild": case "WaitForChild": return () => null;
              case "GetChildren": return () => L.LuaTable.fromArray([]);
            }
            throw new LE('"' + k + '" isn\'t a property of a Part. Try Color, Anchored, Transparency, CanCollide, Position, Size or Name.', line);
          },
          __set(k, v, line) {
            switch (k) {
              case "Color":
                if (!v || v.__type !== "Color3") throw new LE("Color needs a Color3, like Color3.new(1, 0, 0)", line);
                studio.setProp(p, "Color", rgbToHex(v.R, v.G, v.B), true); return;
              case "BrickColor":
                if (!v || v.__type !== "BrickColor") throw new LE('BrickColor needs BrickColor.new("Really red")', line);
                studio.setProp(p, "Color", v.Name, true); return;
              case "Anchored": case "CanCollide":
                if (typeof v !== "boolean") throw new LE(k + " needs true or false", line);
                studio.setProp(p, k, v, true); return;
              case "Transparency":
                if (typeof v !== "number") throw new LE("Transparency needs a number from 0 (solid) to 1 (invisible)", line);
                studio.setProp(p, "Transparency", v, true); return;
              case "Name": studio.setProp(p, "Name", L.toStr(v), true); return;
              case "Position":
                if (!v || v.__type !== "Vector3") throw new LE("Position needs Vector3.new(x, y, z)", line);
                p.x = clamp(v.X, p.w / 2, W - p.w / 2); p.y = clamp(v.Y, Y_MIN - 5, Y_MAX + 5); studio.emit("prop", { part: p, key: "Position", value: v, byScript: true }); return;
              case "Size":
                if (!v || v.__type !== "Vector3") throw new LE("Size needs Vector3.new(x, y, z)", line);
                p.w = clamp(v.X, 0.5, 24); p.h = clamp(v.Y, 0.5, 10); if (p.shape === "ball") p.h = p.w; studio.emit("prop", { part: p, key: "Size", value: v, byScript: true }); return;
              case "Parent":
                if (v === null) { studio.parts = studio.parts.filter((q) => q !== p); return; }
                if (studio.parts.indexOf(p) < 0) { studio.parts.push(p); studio.emit("insert", { part: p, byScript: true }); }
                return;
              case "Shape": p.shape = String(v).toLowerCase().indexOf("ball") >= 0 ? "ball" : "block"; if (p.shape === "ball") p.h = p.w; return;
            }
            throw new LE('You can\'t set "' + k + '" on a Part. Try Color, Anchored, Transparency, CanCollide, Position or Size.', line);
          }
        };
        cache.set(p.id, inst); return inst;
      };
      this.wrapPart = wrap;
      const workspace = {
        __type: "Workspace",
        __get(k, line) {
          if (k === "FindFirstChild" || k === "WaitForChild") return (a) => wrap(studio.parts.find((p) => p.name === a[1]));
          if (k === "GetChildren") return () => L.LuaTable.fromArray(studio.parts.map(wrap));
          if (k === "Name") return "Workspace";
          if (k === "Gravity") return 196.2;
          const p = studio.parts.find((q) => q.name === k);
          if (p) return wrap(p);
          throw new LE('There\'s no part named "' + k + '" in Workspace. Check the Explorer for the exact name (capital letters matter!).', line);
        },
        __set(k) { throw new LE("You can't replace " + k + " in Workspace like that"); }
      };
      const game = { __type: "DataModel", __get(k) {
        if (k === "Workspace") return workspace; if (k === "Players") return players;
        if (k === "GetService") return (a) => { const n = a[1]; if (n === "Players") return players; if (n === "Workspace") return workspace; throw new LE('This mini-Studio only has the "Players" and "Workspace" services'); };
        throw new LE('game doesn\'t have "' + k + '". Try game.Workspace or game:GetService("Players").');
      } };
      const sp = this.cfg.scriptParent ? this.parts.find((p) => p.name === this.cfg.scriptParent) : null;
      const script = { __type: "Script", __get(k) { if (k === "Parent") return sp ? wrap(sp) : workspace; if (k === "Name") return "Script"; return null; } };
      it.define("print", (a) => { const s = a.map(L.toStr).join(" "); studio.output("💬 " + s); studio.emit("print", { text: s }); });
      it.define("warn", (a) => { studio.output("⚠️ " + a.map(L.toStr).join(" "), "warn"); });
      const waitFn = async (a) => { await sleep(a[0]); return Number(a[0]) || 0.03; };
      it.define("wait", waitFn);
      const task = new L.LuaTable();
      task.set("wait", waitFn);
      task.set("spawn", (a) => { call(a[0], a.slice(1)); });
      task.set("delay", (a) => { sleep(a[0]).then(() => call(a[1], a.slice(2))).catch(() => {}); });
      it.define("task", task);
      it.define("spawn", (a) => { call(a[0], []); });
      it.define("delay", (a) => { sleep(a[0]).then(() => call(a[1], [])).catch(() => {}); });
      const C3 = new L.LuaTable();
      C3.set("new", (a) => L.mkColor(clamp(Number(a[0]) || 0, 0, 1), clamp(Number(a[1]) || 0, 0, 1), clamp(Number(a[2]) || 0, 0, 1)));
      C3.set("fromRGB", (a) => L.mkColor(clamp((Number(a[0]) || 0) / 255, 0, 1), clamp((Number(a[1]) || 0) / 255, 0, 1), clamp((Number(a[2]) || 0) / 255, 0, 1)));
      it.define("Color3", C3);
      const BC = new L.LuaTable();
      BC.set("new", (a) => { const nm = String(a[0] || "").toLowerCase(); const hex = BRICK[nm]; if (!hex) throw new LE('I don\'t know the BrickColor "' + a[0] + '". Try "Really red", "Lime green", "Bright blue" or "New Yeller".'); return { __type: "BrickColor", Name: hex, __get(k) { return k === "Name" ? a[0] : null; } }; });
      BC.set("Random", () => { const v = SWATCHES[Math.floor(Math.random() * SWATCHES.length)][1]; return { __type: "BrickColor", Name: v, __get() { return v; } }; });
      it.define("BrickColor", BC);
      const V3 = new L.LuaTable(); V3.set("new", (a) => L.mkVec(Number(a[0]) || 0, Number(a[1]) || 0, Number(a[2]) || 0));
      it.define("Vector3", V3);
      const IN = new L.LuaTable();
      IN.set("new", (a) => {
        if (a[0] !== "Part") throw new LE('In this mini-Studio, Instance.new can make a "Part"');
        const p = makePart({ x: 16, y: 10, w: 2, h: 1, anchored: false, user: true });
        const w = wrap(p); if (a[1]) w.__set("Parent", a[1]); return w;
      });
      it.define("Instance", IN);
      it.define("game", game); it.define("workspace", workspace); it.define("Workspace", workspace); it.define("script", script);
    }
    fireTouched(p) {
      const hs = this.handlers && this.handlers.get(p.id); if (!hs || !this.interp) return;
      const it = this.interp; const hit = this.wrapPart ? null : null;
      const root = { __type: "Part", __get: (k) => { if (k === "Parent") return it.globals.vars.get("game").__get("Players").__get("LocalPlayer").__get("Character"); if (k === "Name") return "HumanoidRootPart"; if (k === "IsA") return (a) => a[1] === "BasePart" || a[1] === "Part"; if (k === "Position") return L.mkVec(this.av.x, this.av.y, 0); if (k === "FindFirstChild") return () => null; return null; }, __set() {} };
      hs.forEach((h) => {
        if (!h.on) return;
        it.callFunction(h.fn, [root], 0).catch((e) => {
          if (e === L.STOP || !this.playing) return;
          const msg = L.friendly(e); this.output("❌ " + msg, "err"); this.flashLine(e.line);
          this.emit("scriptError", { message: e.message || String(e), line: e.line, text: msg });
        });
      });
      void hit;
    }
    damage(n) { this.av.health -= n; if (this.av.health <= 0) this.kill("died"); }
    kill(cause) {
      const a = this.av; if (a.dead || this.result) return;
      a.dead = true; a.deadT = 0; a.cause = cause;
      if (this.checkpoint && this.respawns < 3) {
        this.respawns++;
        setTimeout(() => {
          if (!this.playing || this.result) return;
          const c = this.checkpoint;
          Object.assign(this.av, { x: c.x, y: c.y, vx: 0, vy: 0, dead: false, health: 100, wait: 0.4 });
          this.emit("respawn", { at: "checkpoint", cause });
          this.toast("🚩 Respawned at your checkpoint!");
        }, 800);
        this.emit(cause, { willRespawn: true });
        return;
      }
      this.emit(cause, {});
      this.toast(cause === "fell" ? "💥 Oof! Fell into the void" : "💀 Oof! Health hit 0");
      this.endPlay(cause, 1500);
    }

    solids(except) { return this.parts.filter((p) => p !== except && p.canCollide && p.kind !== "coin"); }
    solidAt(x, y) {
      for (const p of this.parts) {
        if (!p.canCollide || p.kind === "coin") continue; const b = bounds(p);
        if (x >= b.l && x <= b.r && y >= b.b && y <= b.t) return p;
      }
      return null;
    }
    physics(dt) {
      this.time += dt;
      // unanchored parts fall
      for (const p of this.parts) {
        if (p.anchored || p.kind === "spawn" || p.kind === "finish") continue;
        const prevB = p.y - p.h / 2;
        p.vy = (p.vy || 0) - GRAV * dt; p.y += p.vy * dt;
        const pb = bounds(p);
        for (const q of this.parts) {
          if (q === p || !q.canCollide || q.kind === "coin") continue;
          const qb = bounds(q);
          if (overlap(pb, qb) && prevB >= qb.t - 0.05) { p.y = qb.t + p.h / 2; p.vy = 0; break; }
        }
        const start = this.fallStart.get(p.id);
        if (start !== undefined && start - p.y > 1.5 && !p._fellEv) { p._fellEv = true; this.emit("partFell", { part: p }); }
        if (p.y < Y_MIN - 3) { this.parts = this.parts.filter((q) => q !== p); }
      }
      const a = this.av;
      if (a.dead || this.result) { if (this.result === "win") a.anim += dt * 8; return; }
      if (a.wait > 0) { a.wait -= dt; a.vx = 0; } else a.vx = a.speed;
      // auto jump
      if (a.onGround && a.wait <= 0) {
        const foot = a.y - a.h / 2;
        const ahead = this.solidAt(a.x + 0.7 * a.dir, foot - 0.25);
        const wall = this.solidAt(a.x + 0.75 * a.dir, a.y);
        if (!ahead || wall) { a.vy = a.jump; a.onGround = false; }
      }
      a.vy -= GRAV * dt;
      const prev = { l: a.x - a.w / 2, r: a.x + a.w / 2, b: a.y - a.h / 2, t: a.y + a.h / 2 };
      a.x += a.vx * dt;
      let ab = { l: a.x - a.w / 2, r: a.x + a.w / 2, b: a.y - a.h / 2, t: a.y + a.h / 2 };
      for (const p of this.solids()) {
        const b = bounds(p);
        if (overlap(ab, b) && !(prev.b >= b.t - 0.05)) {
          if (prev.r <= b.l + 0.05) a.x = b.l - a.w / 2; else if (prev.l >= b.r - 0.05) a.x = b.r + a.w / 2;
          ab = { l: a.x - a.w / 2, r: a.x + a.w / 2, b: a.y - a.h / 2, t: a.y + a.h / 2 };
        }
      }
      a.y += a.vy * dt; a.onGround = false;
      ab = { l: a.x - a.w / 2, r: a.x + a.w / 2, b: a.y - a.h / 2, t: a.y + a.h / 2 };
      for (const p of this.solids()) {
        const b = bounds(p);
        if (!overlap(ab, b)) continue;
        if (a.vy <= 0 && prev.b >= b.t - 0.3) { a.y = b.t + a.h / 2; a.vy = 0; a.onGround = true; }
        else if (a.vy > 0 && prev.t <= b.b + 0.05) { a.y = b.b - a.h / 2; a.vy = 0; }
        ab = { l: a.x - a.w / 2, r: a.x + a.w / 2, b: a.y - a.h / 2, t: a.y + a.h / 2 };
      }
      if (a.x > W - 0.5) a.x = W - 0.5;
      a.anim += dt * (a.onGround ? 12 : 4);
      // touches
      const now = new Set();
      for (const p of this.parts) {
        const b = bounds(p);
        if (overlap(ab, b, 0.08)) now.add(p.id);
      }
      now.forEach((id) => {
        if (this.touching.has(id)) return;
        const p = this.parts.find((q) => q.id === id); if (!p) return;
        if (!this.touchedOnce.has(id)) { this.touchedOnce.add(id); this.emit("touch", { part: p }); }
        if (p.kind === "checkpoint") { if (!this.checkpoint || this.checkpoint.id !== p.id) { this.checkpoint = { id: p.id, x: p.x, y: p.y + p.h / 2 + 1 }; this.emit("checkpoint", { part: p }); this.toast("🚩 Checkpoint saved!"); } }
        this.fireTouched(p);
        if (p.kind === "finish" && !this.result) { this.emit("win", { time: this.time }); this.toast("🏁 You made it!", 2200); this.endPlay("win", 2200); }
      });
      this.touching = now;
      if (a.y < Y_MIN - 1) this.kill("fell");
      if (this.time > 22 && !this.result) { this.emit("timeout"); this.toast("⏱️ Time's up — tweak your obby!"); this.endPlay("timeout", 800); }
    }

    loop(t) {
      const dt = Math.min(0.05, (t - this.lastT) / 1000); this.lastT = t;
      if (this.playing) { const n = 4; for (let i = 0; i < n; i++) this.physics(dt / n); }
      this.draw(t);
      this.raf = requestAnimationFrame(this.loop);
    }

    /* ---------- drawing ---------- */
    sx(x) { return x * S; } sy(y) { return (Y_MAX - y) * S; }
    draw(t) {
      const c = this.ctx; if (!c) return;
      const sky = c.createLinearGradient(0, 0, 0, CH);
      if (this.cfg.theme === "unity") { sky.addColorStop(0, "#4b5d73"); sky.addColorStop(1, "#9fb3c8"); }
      else { sky.addColorStop(0, "#8fd3ff"); sky.addColorStop(0.75, "#d8f1ff"); sky.addColorStop(1, "#d8f1ff"); }
      c.fillStyle = sky; c.fillRect(0, 0, CW, CH);
      // grid
      c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 1;
      for (let x = 0; x <= W; x += 2) { c.beginPath(); c.moveTo(this.sx(x), 0); c.lineTo(this.sx(x), CH); c.stroke(); }
      for (let y = Y_MIN; y <= Y_MAX; y += 2) { c.beginPath(); c.moveTo(0, this.sy(y)); c.lineTo(CW, this.sy(y)); c.stroke(); }
      // void
      const vg = c.createLinearGradient(0, this.sy(0), 0, CH);
      vg.addColorStop(0, "rgba(40,20,80,0)"); vg.addColorStop(1, "rgba(40,20,80,0.55)");
      c.fillStyle = vg; c.fillRect(0, this.sy(0), CW, CH - this.sy(0));
      c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "bold 14px system-ui"; c.fillText("☁ the void — don't fall!", 10, CH - 10);
      // ghost
      if (this.ghost && !this.playing) {
        const g = this.ghost; const pulse = 0.5 + 0.5 * Math.sin(t / 250);
        c.save(); c.setLineDash([10, 8]); c.lineWidth = 4; c.strokeStyle = "rgba(139,92,246," + (0.5 + 0.5 * pulse) + ")";
        c.fillStyle = "rgba(196,181,253," + (0.25 + 0.2 * pulse) + ")";
        roundRect(c, this.sx(g.x - g.w / 2), this.sy(g.y + g.h / 2), g.w * S, g.h * S, 8); c.fill(); c.stroke();
        c.setLineDash([]); c.fillStyle = "#5b21b6"; c.font = "bold 18px system-ui"; c.textAlign = "center";
        c.fillText(g.label || "Put it here!", this.sx(g.x), this.sy(g.y + g.h / 2) - 14 - 6 * pulse);
        c.font = "26px system-ui"; c.fillText("⬇", this.sx(g.x), this.sy(g.y + g.h / 2) - 36 - 6 * pulse);
        c.restore(); c.textAlign = "left";
      }
      // parts
      for (const p of this.parts) this.drawPart(c, p, t);
      // avatar
      this.drawAvatar(c, t);
      if (this.hand) { c.font = "40px system-ui"; c.fillText("👆", this.sx(this.hand.x) - 12, this.sy(this.hand.y) + 34); }
      if (this.flashMsg) {}
    }
    drawPart(c, p, t) {
      const x = this.sx(p.x - p.w / 2), y = this.sy(p.y + p.h / 2), w = p.w * S, h = p.h * S;
      c.save(); c.globalAlpha = 1 - p.transparency * 0.85;
      if (p.kind === "coin") {
        const bob = Math.sin(t / 300 + p.x) * 3;
        c.fillStyle = "#facc15"; c.strokeStyle = "#a16207"; c.lineWidth = 3;
        c.beginPath(); c.arc(this.sx(p.x), this.sy(p.y) + bob, (p.w / 2) * S, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = "#a16207"; c.font = "bold 16px system-ui"; c.textAlign = "center"; c.fillText("$", this.sx(p.x), this.sy(p.y) + bob + 6); c.textAlign = "left";
        c.restore(); if (p === this.selected) this.drawSel(c, p); return;
      }
      if (p.shape === "ball") {
        const r = (p.w / 2) * S; const gx = this.sx(p.x), gy = this.sy(p.y);
        const g = c.createRadialGradient(gx - r / 3, gy - r / 3, r / 5, gx, gy, r);
        g.addColorStop(0, lighten(p.color, 0.45)); g.addColorStop(1, p.color);
        c.fillStyle = g; c.beginPath(); c.arc(gx, gy, r, 0, Math.PI * 2); c.fill();
        c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 2; c.stroke();
      } else {
        c.fillStyle = p.color; roundRect(c, x, y, w, h, 4); c.fill();
        c.fillStyle = "rgba(255,255,255,0.28)"; c.fillRect(x + 2, y + 2, w - 4, Math.min(6, h / 3));
        c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 2; roundRect(c, x, y, w, h, 4); c.stroke();
        if (p.kind === "finish") {
          const sq = 10;
          for (let i = 0; i * sq < w; i++) for (let j = 0; j * sq < h; j++) if ((i + j) % 2 === 0) { c.fillStyle = "#111"; c.fillRect(x + i * sq, y + j * sq, Math.min(sq, w - i * sq), Math.min(sq, h - j * sq)); }
          c.globalAlpha = 1; c.font = "38px system-ui"; c.fillText("🏁", x + w / 2 - 6, y - 4);
        }
        if (p.kind === "spawn") { c.fillStyle = "rgba(255,255,255,0.9)"; c.font = "bold 13px system-ui"; c.fillText("SPAWN", x + 6, y + h - 7); }
        if (p.kind === "checkpoint") { c.globalAlpha = 1; c.font = "28px system-ui"; c.fillText("🚩", x + w / 2 - 10, y - 2); }
        if (p.name === "Lava" || p.lava) {
          c.fillStyle = "rgba(255,230,80," + (0.4 + 0.3 * Math.sin(t / 200)) + ")";
          for (let i = 0; i < w; i += 18) { c.beginPath(); c.arc(x + i + 9, y + 4, 4 + 2 * Math.sin(t / 150 + i), 0, Math.PI * 2); c.fill(); }
        }
      }
      if (!p.anchored && !this.playing && p.kind !== "spawn" && p.kind !== "finish") { c.globalAlpha = 1; c.font = "16px system-ui"; c.fillText("🪂", x + w - 4, y - 2); }
      c.restore();
      if (p === this.selected && !this.playing) this.drawSel(c, p);
    }
    drawSel(c, p) {
      const x = this.sx(p.x - p.w / 2), y = this.sy(p.y + p.h / 2), w = p.w * S, h = p.h * S;
      c.save(); c.strokeStyle = "#2563eb"; c.lineWidth = 3; c.setLineDash([6, 4]); c.strokeRect(x - 4, y - 4, w + 8, h + 8); c.setLineDash([]);
      if (this.tool === "scale") { c.fillStyle = "#2563eb"; c.fillRect(x + w, y + h / 2 - 7, 12, 14); c.fillRect(x + w / 2 - 7, y - 14, 14, 12); }
      c.restore();
    }
    drawAvatar(c, t) {
      const a = this.av; if (!a) return;
      const cx = this.sx(a.x), base = this.sy(a.y - a.h / 2); const u = S;
      c.save();
      if (a.dead) { c.globalAlpha = 0.6; c.translate(cx, base); c.rotate(Math.PI / 2); c.translate(-cx, -base); }
      const swing = a.onGround && a.vx > 0 ? Math.sin(a.anim) * 6 : (a.onGround ? 0 : 5);
      const jumpy = this.result === "win" ? Math.abs(Math.sin(a.anim)) * 12 : 0;
      const by = base - jumpy;
      c.fillStyle = "#16a34a"; c.fillRect(cx - u * 0.42, by - u * 0.8 + 0, u * 0.38, u * 0.8 + 0); c.fillRect(cx + 0.04 * u, by - u * 0.8, u * 0.38, u * 0.8);
      c.fillStyle = "#2563eb"; c.fillRect(cx - u * 0.45, by - u * 1.55, u * 0.9, u * 0.78);
      c.fillStyle = "#facc15";
      c.save(); c.translate(cx - u * 0.5, by - u * 1.5); c.rotate((swing * Math.PI) / 180); c.fillRect(-u * 0.2, 0, u * 0.22, u * 0.7); c.restore();
      c.save(); c.translate(cx + u * 0.5, by - u * 1.5); c.rotate((-swing * Math.PI) / 180); c.fillRect(-0.02 * u, 0, u * 0.22, u * 0.7); c.restore();
      c.fillRect(cx - u * 0.3, by - u * 2.1, u * 0.6, u * 0.55);
      c.fillStyle = "#111"; c.fillRect(cx - u * 0.15 + 3 * a.dir, by - u * 1.95, 3, 4); c.fillRect(cx + u * 0.08 + 3 * a.dir, by - u * 1.95, 3, 4);
      c.beginPath(); c.arc(cx + 2 * a.dir, by - u * 1.75, 5, 0, Math.PI); c.strokeStyle = "#111"; c.lineWidth = 2; c.stroke();
      c.restore();
      if (this.result === "win") { c.font = "28px system-ui"; c.fillText("🎉", cx - 14, by - u * 2.4); }
      if (this.playing && a.health < 100 && a.health > 0) { c.fillStyle = "#ef4444"; c.fillRect(cx - 15, by - u * 2.4, 30 * a.health / 100, 4); }
    }

    /* ---------- analysis ---------- */
    analyzeGaps() {
      const surf = this.parts.filter((p) => p.canCollide && p.kind !== "coin" && p.y + p.h / 2 > -1).map((p) => ({ p, b: bounds(p) })).sort((a, b) => a.b.l - b.b.l);
      const spawn = surf.find((s) => s.p.kind === "spawn"); const fin = surf.find((s) => s.p.kind === "finish");
      if (!spawn) return { gaps: [], max: 0 };
      const gaps = []; let cur = spawn; let guard = 0;
      while (cur && cur !== fin && guard++ < 30) {
        const cands = surf.filter((s) => s.b.l > cur.b.r - 0.25 && s !== cur && s.b.t - cur.b.t < 4.5);
        if (!cands.length) break;
        cands.sort((a, b) => a.b.l - b.b.l);
        const nx = cands[0];
        gaps.push({ from: cur.p, to: nx.p, dist: Math.max(0, nx.b.l - cur.b.r), up: nx.b.t - cur.b.t });
        cur = nx;
      }
      const max = gaps.reduce((m, g) => Math.max(m, g.dist), 0);
      return { gaps, max, reached: cur === fin };
    }
    feedbackReport() {
      const up = this.userParts(); const code = this.cfg.code != null ? this.ta.value : "";
      const g = this.analyzeGaps(); const wins = this.history.filter((h) => h === "win").length;
      const colors = new Set(up.map((p) => colorName(p.color))); const balls = up.filter((p) => p.shape === "ball").length;
      const unanch = up.filter((p) => !p.anchored).length; const cps = this.parts.filter((p) => p.kind === "checkpoint").length;
      const feats = { touched: /Touched/.test(code), loop: /\b(for|while)\b/.test(code), wait: /wait\s*\(/.test(code), kill: /Health\s*=\s*0/.test(code), vanish: /CanCollide\s*=\s*false/.test(code), coins: /leaderstats/.test(code), color: /Color3|BrickColor/.test(code) };
      const strengths = [], improve = [];
      if (up.length >= 5) strengths.push("You built a real course with " + up.length + " parts — that's a full level!");
      else if (up.length) strengths.push("You placed " + up.length + " part" + (up.length > 1 ? "s" : "") + " — every obby starts like this.");
      if (wins) strengths.push("Your avatar finished the course " + wins + " time" + (wins > 1 ? "s" : "") + " — it's beatable! 🏁");
      if (colors.size >= 3) strengths.push("Great use of color (" + Array.from(colors).slice(0, 4).join(", ") + ") — players can read the path.");
      if (balls) strengths.push("Spheres add fun shapes — nice variety!");
      if (cps) strengths.push("A checkpoint saves players' progress — very kind design.");
      if (feats.kill) strengths.push("A scripted kill brick adds real danger.");
      if (feats.vanish) strengths.push("Vanishing platforms = sneaky surprise! 😈");
      if (feats.coins) strengths.push("A coin counter gives players a goal beyond the finish.");
      if (feats.loop) strengths.push("You used a loop — that's real programming.");
      if (!wins) improve.push("Press ▶ Play until your avatar reaches the 🏁 — a level must be beatable.");
      if (g.max > 4.2) improve.push("One jump is " + g.max.toFixed(1) + " studs wide — the avatar can only jump about 4. Move platforms closer.");
      if (unanch) improve.push(unanch + " part" + (unanch > 1 ? "s are" : " is") + " not Anchored 🪂 — they'll fall when you Play.");
      if (up.length < 5) improve.push("Add a few more platforms (aim for 5+) so the course feels like an adventure.");
      if (colors.size < 2) improve.push("Paint some platforms different colors to guide the player's eye.");
      if (!code.trim() || (!feats.touched && !feats.loop)) improve.push("Add a script: a kill brick, a vanishing platform, or coins.");
      if (g.gaps.length >= 3) {
        const h = Math.floor(g.gaps.length / 2); const a1 = g.gaps.slice(0, h), a2 = g.gaps.slice(h);
        const avg = (arr) => arr.reduce((s, x) => s + x.dist, 0) / arr.length;
        if (avg(a2) > avg(a1) + 0.3) strengths.push("Your jumps get harder as you go — a perfect difficulty curve!");
        else improve.push("Make later jumps a little harder than early ones (a difficulty curve).");
      }
      const nexts = ["Add a moving challenge: a platform that blinks with a while loop.", "Add 3 coins and a counter with leaderstats.", "Add a checkpoint halfway and a harder second half.", "Make a secret shortcut with a see-through (Transparency 0.5) platform."];
      const next = nexts[(up.length + wins) % nexts.length];
      return { strengths: strengths.slice(0, 4), improve: improve.slice(0, 3), next, stats: { parts: up.length, wins, maxGap: g.max, feats, checkpoints: cps } };
    }
    showFeedback(html) { const f = this.$(".st-feedback"); f.innerHTML = html; f.classList.remove("hidden"); }
  }

  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function lighten(hex, k) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r + (1 - r) * k, g + (1 - g) * k, b + (1 - b) * k); }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  global.Studio = Studio;
  global.StudioUtil = { colorName, hexToRgb, bounds, W, Y_MIN, Y_MAX, esc };
})(window);
