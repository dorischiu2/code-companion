/* Code Companion — live web editor (HTML / CSS / JS) with preview */
(function (global) {
  "use strict";
  const PRELUDE = `<script>(function(){var P=parent;window.__logs=[];var ol=console.log;console.log=function(){var a=[].slice.call(arguments).map(function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(' ');__logs.push(a);P.postMessage({cc:'log',t:a},'*');ol.apply(console,arguments)};window.onerror=function(m,s,l){P.postMessage({cc:'err',t:String(m),l:l},'*');return true};
var db={jokes:[{id:1,text:'Why did the robot cross the road? It was programmed to!'},{id:2,text:'What do computers eat? Microchips!'},{id:3,text:'Why was the JavaScript sad? It did not Node how to express itself.'}],todos:[{id:1,text:'Learn fetch',done:false}],scores:[{name:'Byte',score:42}]};
window.fetch=function(url,opt){opt=opt||{};var m=(opt.method||'GET').toUpperCase();var path=String(url).replace(/^https?:\\/\\/[^/]+/,'');var mm=path.match(/^\\/api\\/(\\w+)/);P.postMessage({cc:'fetch',m:m,u:path},'*');
return new Promise(function(res){setTimeout(function(){var st=200,body;if(!mm||!db[mm[1]]){st=404;body={error:'No route '+path+' — try /api/jokes, /api/todos or /api/scores'}}else if(m==='POST'){var it={};try{it=JSON.parse(opt.body||'{}')}catch(e){}it.id=db[mm[1]].length+1;db[mm[1]].push(it);st=201;body=it}else body=db[mm[1]];
res({ok:st<300,status:st,json:function(){return Promise.resolve(JSON.parse(JSON.stringify(body)))},text:function(){return Promise.resolve(JSON.stringify(body))}})},120)})};})();<\/script>`;
  class Web {
    constructor(root) {
      this.root = root; this.listeners = [];
      root.innerHTML = `<div class="code-wrap web">
        <div class="cw-left">
          <div class="cw-tabs"></div>
          <div class="st-editor"><pre class="st-gutter" aria-hidden="true">1</pre><textarea class="st-ta" spellcheck="false" autocapitalize="off" aria-label="Code editor"></textarea></div>
          <div class="cw-snips"></div>
          <div class="cw-out" aria-live="polite"></div>
        </div>
        <div class="cw-right"><div class="cw-bar"><span class="cw-title">👀 Live preview</span><span class="cw-grow"></span><button type="button" class="st-btn" data-act="refresh">🔄 Run</button></div><iframe class="cw-frame" title="Preview"></iframe></div></div>`;
      this.ta = root.querySelector("textarea"); this.gut = root.querySelector(".st-gutter"); this.frame = root.querySelector("iframe"); this.out = root.querySelector(".cw-out");
      this.ta.addEventListener("input", () => { this.files[this.tab] = this.ta.value; this.gutter(); clearTimeout(this._t); this._t = setTimeout(() => { this.render(); this.emit("code", { tab: this.tab }); }, 450); });
      this.ta.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const s = this.ta.selectionStart; this.ta.setRangeText("  ", s, this.ta.selectionEnd, "end"); } });
      this.ta.addEventListener("scroll", () => { this.gut.scrollTop = this.ta.scrollTop; });
      root.querySelector('[data-act="refresh"]').onclick = () => { this.render(); this.emit("run"); };
      this.onMsg = (e) => { if (!e.data || !e.data.cc || e.source !== this.frame.contentWindow) return;
        if (e.data.cc === "log") { this.line("💬 " + e.data.t); this.emit("log", { text: e.data.t }); }
        if (e.data.cc === "err") { const t = friendlyJs(e.data.t); this.line("❌ " + t + (e.data.l ? " (line ~" + e.data.l + ")" : ""), "err"); this.emit("scriptError", { text: t, raw: e.data.t }); }
        if (e.data.cc === "fetch") { this.line("🌐 " + e.data.m + " " + e.data.u, "net"); this.emit("fetch", { method: e.data.m, url: e.data.u }); } };
      global.addEventListener("message", this.onMsg);
    }
    on(f) { this.listeners.push(f); } off(f) { this.listeners = this.listeners.filter((x) => x !== f); }
    emit(type, d) { const ev = Object.assign({ type }, d || {}); this.listeners.slice().forEach((f) => { try { f(ev); } catch (e) { console.error(e); } }); }
    destroy() { global.removeEventListener("message", this.onMsg); this.listeners = []; this.root.innerHTML = ""; }
    load(cfg) {
      this.cfg = cfg; this.files = Object.assign({ html: "", css: "", js: "" }, cfg.files);
      this.tabs = cfg.tabs || ["html", "css", "js"];
      const tb = this.root.querySelector(".cw-tabs"); tb.innerHTML = "";
      const names = { html: "📄 HTML", css: "🎨 CSS", js: "⚡ JS" };
      this.tabs.forEach((t) => { const b = document.createElement("button"); b.type = "button"; b.className = "cw-tab"; b.dataset.tab = t; b.textContent = names[t]; b.onclick = () => this.setTab(t); tb.appendChild(b); });
      this.setTab(cfg.startTab || this.tabs[0]); this.renderSnips(); this.render();
    }
    setTab(t) { this.tab = t; this.ta.value = this.files[t]; this.gutter(); this.root.querySelectorAll(".cw-tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === t)); this.renderSnips(); this.emit("tab", { tab: t }); }
    renderSnips() {
      const el = this.root.querySelector(".cw-snips"); const sn = (this.cfg.snippets || []).filter((s) => !s.tab || s.tab === this.tab);
      el.innerHTML = sn.length ? '<span class="st-bl-tip">Tap to add:</span>' : "";
      sn.forEach((s) => { const b = document.createElement("button"); b.type = "button"; b.className = "st-block"; b.textContent = s.label; b.onclick = () => this.insert(s.code); el.appendChild(b); });
    }
    insert(code) {
      const v = this.ta.value; const mi = v.indexOf("✏️");
      if (mi >= 0) { const ls = v.lastIndexOf("\n", mi) + 1; const ind = (v.slice(ls).match(/^\s*/) || [""])[0]; this.ta.value = v.slice(0, ls) + code.split("\n").map((l) => ind + l).join("\n") + "\n" + v.slice(ls); }
      else this.ta.value = v.replace(/\s*$/, "") + "\n" + code + "\n";
      this.ta.dispatchEvent(new Event("input")); this.emit("block");
    }
    gutter() { const n = this.ta.value.split("\n").length; let s = ""; for (let i = 1; i <= n; i++) s += i + "\n"; this.gut.textContent = s; }
    getCode(t) { return this.files[t || this.tab]; }
    line(t, cls) { const d = document.createElement("div"); d.className = "st-out " + (cls || ""); d.textContent = t; this.out.appendChild(d); while (this.out.children.length > 30) this.out.removeChild(this.out.firstChild); this.out.scrollTop = this.out.scrollHeight; }
    render() {
      this.out.innerHTML = "";
      const html = "<!DOCTYPE html><html><head><meta charset='utf-8'>" + PRELUDE + "<style>body{font-family:system-ui,sans-serif;padding:12px}" + "</style><style>" + this.files.css + "</style></head><body>" + this.files.html + "<script>" + this.files.js.replace(/<\/script/gi, "<\\/script") + "<\/script></body></html>";
      this.frame.onload = () => setTimeout(() => this.emit("render"), 60);
      this.frame.srcdoc = html;
    }
    doc() { try { return this.frame.contentDocument; } catch (e) { return null; } }
    win() { try { return this.frame.contentWindow; } catch (e) { return null; } }
  }
  function friendlyJs(m) {
    let x;
    if ((x = m.match(/(\w+) is not defined/))) return 'JavaScript doesn\'t know "' + x[1] + '". Check spelling and capitals.';
    if (/Cannot read propert(y|ies) of null/.test(m)) return "querySelector found nothing — check the id or class name matches your HTML (# for id, . for class).";
    if (/Unexpected token|Unexpected end of input|missing \)/.test(m)) return "A bracket or quote is missing. Every ( { [ needs a partner ) } ].";
    if (/is not a function/.test(m)) return m.replace("Uncaught TypeError: ", "") + " — check the spelling of the function.";
    return m.replace(/^Uncaught /, "");
  }
  global.WebEditor = Web;
})(window);
