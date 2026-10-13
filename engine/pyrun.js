/* Code Companion — Python runner (Pyodide, lazy-loaded from CDN) */
(function (global) {
  "use strict";
  const CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let loading = null;
  function loadPy() {
    if (global.__pyodide) return Promise.resolve(global.__pyodide);
    if (loading) return loading;
    loading = new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = CDN + "pyodide.js";
      s.onload = () => global.loadPyodide({ indexURL: CDN }).then((p) => { global.__pyodide = p; res(p); }, rej);
      s.onerror = () => { loading = null; rej(new Error("offline")); };
      document.head.appendChild(s);
    });
    return loading;
  }
  function friendly(err) {
    const lines = String(err).trim().split("\n"); const last = lines[lines.length - 1] || "";
    let ln = null; for (const l of lines) { const m = l.match(/File "<exec>", line (\d+)/); if (m) ln = Number(m[1]); }
    let msg = last;
    let m;
    if ((m = last.match(/NameError: name '(\w+)' is not defined/))) msg = 'Python doesn\'t know "' + m[1] + '". Check the spelling — or did you forget quotes around text?';
    else if (/IndentationError/.test(last)) msg = "The spaces at the start of a line are wrong. Lines inside if/for/def need 4 spaces in.";
    else if (/SyntaxError: unterminated string|EOL while scanning/.test(last)) msg = "A quote \" is missing — text needs quotes at both ends.";
    else if (/SyntaxError: expected ':'/.test(last)) msg = "Add a colon : at the end of the if / for / def line.";
    else if (/SyntaxError/.test(last)) msg = "Python can't read this line. Check brackets ( ), quotes \" and colons :";
    else if ((m = last.match(/TypeError: can only concatenate str \(not "(\w+)"\) to str/))) msg = "You can't + text and a " + m[1] + ". Use str(number) or a comma in print.";
    else if (/TypeError/.test(last)) msg = "Mixing types: " + last.replace("TypeError: ", "");
    else if (/ZeroDivisionError/.test(last)) msg = "You can't divide by zero! 🙃";
    return { text: msg, line: ln, raw: last };
  }
  class PyRun {
    constructor(root) {
      this.root = root; this.listeners = [];
      root.innerHTML = `<div class="code-wrap py">
        <div class="cw-bar"><span class="cw-title">🐍 main.py</span><span class="cw-grow"></span><span class="cw-status">Loading Python…</span><button type="button" class="st-btn st-play cw-run" data-act="run">▶ Run</button></div>
        <div class="st-editor"><pre class="st-gutter" aria-hidden="true">1</pre><textarea class="st-ta" spellcheck="false" autocapitalize="off" aria-label="Python code"></textarea></div>
        <div class="cw-snips"></div>
        <div class="cw-out" aria-live="polite"></div></div>`;
      this.ta = root.querySelector("textarea"); this.gut = root.querySelector(".st-gutter"); this.out = root.querySelector(".cw-out"); this.status = root.querySelector(".cw-status");
      this.ta.addEventListener("input", () => { this.gutter(); clearTimeout(this._t); this._t = setTimeout(() => this.emit("code", { code: this.ta.value }), 250); });
      this.ta.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const s = this.ta.selectionStart; this.ta.setRangeText("    ", s, this.ta.selectionEnd, "end"); } });
      this.ta.addEventListener("scroll", () => { this.gut.scrollTop = this.ta.scrollTop; });
      root.querySelector('[data-act="run"]').onclick = () => this.run();
      loadPy().then(() => { this.ready = true; this.status.textContent = "✅ Python ready"; this.emit("ready"); }, () => { this.status.textContent = "⚠️ Python needs internet the first time"; });
    }
    on(f) { this.listeners.push(f); } off(f) { this.listeners = this.listeners.filter((x) => x !== f); }
    emit(type, d) { const ev = Object.assign({ type }, d || {}); this.listeners.slice().forEach((f) => { try { f(ev); } catch (e) { console.error(e); } }); }
    destroy() { this.listeners = []; this.root.innerHTML = ""; }
    load(cfg) { this.cfg = cfg || {}; this.ta.value = cfg.code || ""; this.gutter(); this.out.innerHTML = ""; this.renderSnips(); }
    getCode() { return this.ta.value; }
    gutter(err) { const n = this.ta.value.split("\n").length; let s = ""; for (let i = 1; i <= n; i++) s += (i === err ? "❗" : i) + "\n"; this.gut.textContent = s; }
    renderSnips() {
      const el = this.root.querySelector(".cw-snips"); const sn = this.cfg.snippets || [];
      el.innerHTML = sn.length ? '<span class="st-bl-tip">Tap to add:</span>' : "";
      sn.forEach((s) => { const b = document.createElement("button"); b.type = "button"; b.className = "st-block"; b.textContent = s.label; b.onclick = () => { this.ta.value = this.ta.value.replace(/\s*$/, "") + "\n" + s.code + "\n"; this.ta.dispatchEvent(new Event("input")); this.emit("block"); }; el.appendChild(b); });
    }
    line(t, cls) { const d = document.createElement("div"); d.className = "st-out " + (cls || ""); d.textContent = t; this.out.appendChild(d); this.out.scrollTop = this.out.scrollHeight; }
    async run() {
      this.out.innerHTML = ""; this.gutter(); this.emit("run");
      let py;
      try { this.status.textContent = "⏳ Starting Python…"; py = await loadPy(); this.status.textContent = "✅ Python ready"; }
      catch (e) { this.line("⚠️ Python couldn't load (no internet?). Connect once and try again.", "err"); this.emit("pyload-failed"); return; }
      let buf = [];
      py.setStdout({ batched: (s) => { buf.push(s); this.line(s); } });
      py.setStderr({ batched: (s) => this.line(s, "warn") });
      const inputs = (this.cfg.inputs || []).slice();
      try {
        const g = py.globals.get("dict")();
        g.set("__cc_inputs", py.toPy(inputs));
        await py.runPythonAsync("import builtins\n_q=list(__cc_inputs)\ndef _inp(p=''):\n    print(str(p)+(_q[0] if _q else ''))\n    return _q.pop(0) if _q else ''\nbuiltins.input=_inp", { globals: g });
        await py.runPythonAsync(this.ta.value, { globals: g });
        const vars = {};
        try { g.toJs().forEach((v, k) => { if (!String(k).startsWith("_") && (typeof v === "number" || typeof v === "string" || typeof v === "boolean")) vars[k] = v; }); } catch (e) {}
        const fns = [];
        const stdout = buf.join("\n");
        this.lastG = g;
        this.emit("ran", { stdout, lines: buf.slice(), vars, fns, code: this.ta.value });
      } catch (err) {
        const f = friendly(err); this.line("❌ " + f.text + (f.line ? " (line " + f.line + ")" : ""), "err"); this.gutter(f.line);
        this.emit("scriptError", { text: f.text, line: f.line, raw: f.raw, stdout: buf.join("\n") });
      }
    }
    callPy(expr) { try { const py = global.__pyodide; return py.runPython(expr, { globals: this.lastG }); } catch (e) { return undefined; } }
  }
  global.PyRun = PyRun; global.PyFriendly = friendly;
})(window);
