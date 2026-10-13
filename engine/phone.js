/* Code Companion — App Inventor-style phone app builder */
(function (global) {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  class Phone {
    constructor(root) {
      this.root = root; this.listeners = [];
      root.innerHTML = `<div class="ph-wrap">
        <div class="ph-col"><div class="ph-h">🎨 Designer — add parts</div><div class="ph-pal">
          <button type="button" class="ph-add" data-c="Button">🔘 Button</button><button type="button" class="ph-add" data-c="Label">🔤 Label</button><button type="button" class="ph-add" data-c="TextBox">⌨️ TextBox</button></div>
          <div class="ph-h">🧩 Blocks</div><div class="ph-blocks"></div><div class="ph-rules"></div></div>
        <div class="ph-device"><div class="ph-notch"></div><div class="ph-screen"></div><div class="ph-cap">Live phone — tap your buttons!</div></div></div>`;
      root.querySelectorAll(".ph-add").forEach((b) => b.onclick = () => this.addComp(b.dataset.c));
      this.comps = []; this.rules = [];
    }
    on(f) { this.listeners.push(f); } off(f) { this.listeners = this.listeners.filter((x) => x !== f); }
    emit(type, d) { const ev = Object.assign({ type }, d || {}); this.listeners.slice().forEach((f) => { try { f(ev); } catch (e) { console.error(e); } }); }
    destroy() { this.listeners = []; this.root.innerHTML = ""; }
    load(cfg) { this.cfg = cfg || {}; this.comps = []; this.rules = []; (this.cfg.comps || []).forEach((c) => this.addComp(c, true)); this.render(); }
    addComp(type, quiet) {
      const n = this.comps.filter((c) => c.type === type).length + 1;
      const c = { type, name: type + n, text: type === "Button" ? "Tap me" : type === "Label" ? "Text for " + type + n : "", bg: null };
      this.comps.push(c); this.render(); if (!quiet) this.emit("addComp", { comp: c }); return c;
    }
    find(n) { return this.comps.find((c) => c.name === n); }
    render() {
      const scr = this.root.querySelector(".ph-screen"); scr.innerHTML = "";
      this.comps.forEach((c) => {
        let el;
        if (c.type === "Button") { el = document.createElement("button"); el.type = "button"; el.className = "ph-c ph-button"; el.textContent = c.text; el.onclick = () => this.fire(c.name + ".Click"); }
        else if (c.type === "Label") { el = document.createElement("div"); el.className = "ph-c ph-label"; el.textContent = c.text; if (c.bg) el.style.background = c.bg; }
        else { el = document.createElement("input"); el.className = "ph-c ph-text"; el.placeholder = "Type here"; el.value = c.text; el.oninput = () => { c.text = el.value; }; }
        el.dataset.name = c.name; scr.appendChild(el);
      });
      if (!this.comps.length) scr.innerHTML = '<p class="ph-empty">Empty screen.<br>Add a part from the Designer 👈</p>';
      // block palette
      const pal = this.root.querySelector(".ph-blocks"); pal.innerHTML = "";
      const btns = this.comps.filter((c) => c.type === "Button"), labels = this.comps.filter((c) => c.type === "Label"), boxes = this.comps.filter((c) => c.type === "TextBox");
      const mk = (html, fn, cls) => { const b = document.createElement("button"); b.type = "button"; b.className = "ph-blk " + (cls || ""); b.innerHTML = html; b.onclick = fn; pal.appendChild(b); };
      btns.forEach((b) => mk("when <b>" + b.name + "</b>.Click", () => this.addRule(b.name + ".Click"), "ev"));
      const cur = this.rules[this.rules.length - 1];
      if (cur) {
        labels.forEach((l) => {
          mk("set <b>" + l.name + "</b>.Text to “…”", () => this.addAct({ set: l.name, kind: "text", val: "Hello!" }));
          mk("set <b>" + l.name + "</b>.Text to " + l.name + ".Text + 1", () => this.addAct({ set: l.name, kind: "inc" }));
          mk("set <b>" + l.name + "</b>.BackgroundColor", () => this.addAct({ set: l.name, kind: "bg", val: "#fde047" }));
          boxes.forEach((t) => mk("set <b>" + l.name + "</b>.Text to <b>" + t.name + "</b>.Text", () => this.addAct({ set: l.name, kind: "copy", from: t.name })));
        });
      }
      if (!btns.length) pal.innerHTML = '<p class="ph-empty">Add a 🔘 Button to get event blocks.</p>';
      const rl = this.root.querySelector(".ph-rules"); rl.innerHTML = "";
      this.rules.forEach((r, ri) => {
        const d = document.createElement("div"); d.className = "ph-rule";
        d.innerHTML = '<div class="ph-when">when ' + esc(r.when) + ' do <button type="button" class="ph-x" aria-label="remove">✖</button></div>' + r.acts.map((a, ai) => '<div class="ph-act">set ' + esc(a.set) + "." + (a.kind === "bg" ? "BackgroundColor" : "Text") + " to " +
          (a.kind === "text" ? '<input data-ai="' + ai + '" value="' + esc(a.val) + '">' : a.kind === "inc" ? esc(a.set) + ".Text + 1" : a.kind === "copy" ? esc(a.from) + ".Text" : '<input type="color" data-ai="' + ai + '" value="' + a.val + '">') + "</div>").join("");
        d.querySelector(".ph-x").onclick = () => { this.rules.splice(ri, 1); this.render(); this.emit("remove"); };
        d.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", () => { r.acts[Number(inp.dataset.ai)].val = inp.value; this.emit("edit"); }));
        rl.appendChild(d);
      });
    }
    addRule(when) { if (!this.rules.some((r) => r.when === when)) this.rules.push({ when, acts: [] }); else { const r = this.rules.find((x) => x.when === when); this.rules = this.rules.filter((x) => x !== r).concat([r]); } this.render(); this.emit("rule", { when }); }
    addAct(a) { const r = this.rules[this.rules.length - 1]; if (!r) return; r.acts.push(a); this.render(); this.emit("act", { act: a }); }
    fire(when) {
      this.emit("tap", { when });
      this.rules.filter((r) => r.when === when).forEach((r) => r.acts.forEach((a) => {
        const l = this.find(a.set); if (!l) return;
        if (a.kind === "text") l.text = a.val; else if (a.kind === "inc") l.text = String((parseInt(l.text, 10) || 0) + 1);
        else if (a.kind === "copy") { const t = this.find(a.from); l.text = t ? t.text : ""; } else if (a.kind === "bg") l.bg = a.val;
        this.emit("changed", { comp: l.name, text: l.text, bg: l.bg });
      }));
      this.render();
    }
  }
  global.Phone = Phone;
})(window);
