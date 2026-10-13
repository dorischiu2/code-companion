/* Code Companion — tiny safe Luau interpreter (kid subset) */
(function (global) {
  "use strict";

  class LuauError extends Error {
    constructor(msg, line) { super(msg); this.line = line || 0; this.luau = true; }
  }
  const STOP = { stop: true };
  const BREAK = { brk: true };
  const CONTINUE = { cont: true };
  class ReturnSig { constructor(vals) { this.vals = vals; } }

  const KEYWORDS = new Set(["and","break","do","else","elseif","end","false","for","function","if","in","local","nil","not","or","repeat","return","then","true","until","while","continue"]);

  function tokenize(src) {
    const toks = []; let i = 0, line = 1; const n = src.length;
    const push = (type, value) => toks.push({ type, value, line });
    while (i < n) {
      const c = src[i];
      if (c === "\n") { line++; i++; continue; }
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "-" && src[i + 1] === "-") {
        if (src[i + 2] === "[" && src[i + 3] === "[") {
          const end = src.indexOf("]]", i + 4); const stop = end < 0 ? n : end + 2;
          for (let k = i; k < stop; k++) if (src[k] === "\n") line++;
          i = stop; continue;
        }
        while (i < n && src[i] !== "\n") i++;
        continue;
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        let j = i;
        if (src[j] === "0" && (src[j + 1] === "x" || src[j + 1] === "X")) { j += 2; while (/[0-9a-fA-F]/.test(src[j] || "")) j++; }
        else {
          while (/[0-9_]/.test(src[j] || "")) j++;
          if (src[j] === "." && src[j + 1] !== ".") { j++; while (/[0-9]/.test(src[j] || "")) j++; }
          if (src[j] === "e" || src[j] === "E") { j++; if (src[j] === "+" || src[j] === "-") j++; while (/[0-9]/.test(src[j] || "")) j++; }
        }
        push("num", Number(src.slice(i, j).replace(/_/g, ""))); i = j; continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        let j = i; while (/[A-Za-z0-9_]/.test(src[j] || "")) j++;
        const w = src.slice(i, j); push(KEYWORDS.has(w) ? "kw" : "name", w); i = j; continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        let j = i + 1, s = "";
        while (j < n && src[j] !== c) {
          if (src[j] === "\n") throw new LuauError("Your text is missing its closing quote " + c, line);
          if (src[j] === "\\") { const e = src[j + 1]; s += e === "n" ? "\n" : e === "t" ? "\t" : e; j += 2; }
          else { s += src[j]; j++; }
        }
        if (j >= n) throw new LuauError("Your text is missing its closing quote " + c, line);
        push("str", s); i = j + 1; continue;
      }
      if (c === "[" && src[i + 1] === "[") {
        const end = src.indexOf("]]", i + 2);
        if (end < 0) throw new LuauError("A long string needs ]] at the end", line);
        const s = src.slice(i + 2, end); for (const ch of s) if (ch === "\n") line++;
        push("str", s); i = end + 2; continue;
      }
      const three = src.substr(i, 3);
      if (three === "..." || three === "..=") { push("op", three); i += 3; continue; }
      const two = src.substr(i, 2);
      if (["==","~=","<=",">=","..","+=","-=","*=","/=","//","%=","^=","::","->"].includes(two)) { push("op", two); i += 2; continue; }
      if (two === "!=") throw new LuauError('In Luau, "not equal" is written ~=  (not !=)', line);
      if (two === "&&") throw new LuauError('In Luau, write the word "and" instead of &&', line);
      if (two === "||") throw new LuauError('In Luau, write the word "or" instead of ||', line);
      if ("+-*/%^#<>=(){}[];:,.?|&".includes(c)) { push("op", c); i++; continue; }
      throw new LuauError('I don\'t understand the symbol "' + c + '"', line);
    }
    push("eof", null); toks[toks.length - 1].line = line;
    return toks;
  }

  const BINPRI = {
    "or": [1, 1], "and": [2, 2],
    "<": [3, 3], ">": [3, 3], "<=": [3, 3], ">=": [3, 3], "~=": [3, 3], "==": [3, 3],
    "..": [9, 8], "+": [10, 10], "-": [10, 10],
    "*": [11, 11], "/": [11, 11], "//": [11, 11], "%": [11, 11], "^": [14, 13]
  };
  const UNARY_PRI = 12;

  class Parser {
    constructor(toks) { this.t = toks; this.p = 0; }
    peek(o) { return this.t[this.p + (o || 0)]; }
    next() { return this.t[this.p++]; }
    is(type, value) { const k = this.peek(); return k.type === type && (value === undefined || k.value === value); }
    isOp(v) { return this.is("op", v); }
    accept(type, value) { return this.is(type, value) ? this.next() : null; }
    expect(type, value, msg) {
      if (this.is(type, value)) return this.next();
      const k = this.peek();
      throw new LuauError(msg || ('I expected "' + value + '" here' + (k.type === "eof" ? " but the code ended" : ' but found "' + k.value + '"')), k.line);
    }
    expectName(msg) {
      const k = this.peek();
      if (k.type === "name") { this.next(); return k.value; }
      throw new LuauError(msg || (k.type === "kw" ? '"' + k.value + '" is a special Luau word — pick a different name' : "I expected a name here"), k.line);
    }
    expectEnd(what, line) {
      const k = this.peek();
      if (k.type === "kw" && k.value === "end") { this.next(); return; }
      throw new LuauError('Your "' + what + '" on line ' + line + ' needs an "end" to close it', k.line);
    }
    typeAnn() { // skip simple type annotations like : number / : Part?
      this.next(); while (this.isOp(".") ) { this.next(); this.next(); }
      if (this.isOp("?")) this.next();
    }
    parseChunk() {
      const body = this.block();
      if (!this.is("eof")) { const k = this.peek(); throw new LuauError('Unexpected "' + k.value + '" — maybe an extra "end"?', k.line); }
      return body;
    }
    blockEnd() { const k = this.peek(); return k.type === "eof" || (k.type === "kw" && ["end","else","elseif","until"].includes(k.value)); }
    block() {
      const out = [];
      while (!this.blockEnd()) {
        if (this.accept("op", ";")) continue;
        const s = this.statement(); out.push(s);
        if (s.t === "return") { this.accept("op", ";"); break; }
      }
      return out;
    }
    statement() {
      const k = this.peek(), line = k.line;
      if (k.type === "kw") {
        switch (k.value) {
          case "local": {
            this.next();
            if (this.accept("kw", "function")) {
              const name = this.expectName("A function needs a name");
              return { t: "localfn", name, fn: this.funcBody(line, name, false), line };
            }
            const names = [this.expectName()]; if (this.accept("op", ":")) this.typeAnn();
            while (this.accept("op", ",")) { names.push(this.expectName()); if (this.accept("op", ":")) this.typeAnn(); }
            let exprs = [];
            if (this.accept("op", "=")) exprs = this.exprList();
            return { t: "local", names, exprs, line };
          }
          case "if": return this.ifStat();
          case "while": {
            this.next(); const cond = this.expr();
            this.expect("kw", "do", 'A while loop needs "do" after the condition: while true do');
            const body = this.block(); this.expectEnd("while", line);
            return { t: "while", cond, body, line };
          }
          case "for": return this.forStat();
          case "repeat": {
            this.next(); const body = this.block();
            this.expect("kw", "until", 'A repeat loop needs "until" at the end');
            return { t: "repeat", body, cond: this.expr(), line };
          }
          case "function": {
            this.next();
            let target = { t: "name", name: this.expectName(), line };
            let isMethod = false, fname = target.name;
            while (this.isOp(".") || this.isOp(":")) {
              const op = this.next().value; const key = this.expectName(); fname += op + key;
              target = { t: "index", obj: target, key: { t: "str", v: key }, line };
              if (op === ":") { isMethod = true; break; }
            }
            return { t: "assign", targets: [target], exprs: [this.funcBody(line, fname, isMethod)], line };
          }
          case "return": {
            this.next(); let exprs = [];
            if (!this.blockEnd() && !this.isOp(";")) exprs = this.exprList();
            return { t: "return", exprs, line };
          }
          case "break": this.next(); return { t: "break", line };
          case "continue": this.next(); return { t: "continue", line };
          case "do": { this.next(); const body = this.block(); this.expectEnd("do", line); return { t: "do", body, line }; }
          case "then": throw new LuauError('"then" goes right after an if condition, on the same line as if', line);
          case "end": throw new LuauError('There is an extra "end" here — something already closed', line);
        }
      }
      const e = this.suffixedExpr();
      if (this.isOp("=") || this.isOp(",")) {
        const targets = [e];
        while (this.accept("op", ",")) targets.push(this.suffixedExpr());
        for (const tg of targets) if (tg.t !== "name" && tg.t !== "index") throw new LuauError("You can only put a value into a variable or a property", line);
        this.expect("op", "=");
        return { t: "assign", targets, exprs: this.exprList(), line };
      }
      const k2 = this.peek();
      if (k2.type === "op" && ["+=","-=","*=","/=","..=","%=","^="].includes(k2.value)) {
        this.next();
        if (e.t !== "name" && e.t !== "index") throw new LuauError("You can only change a variable or a property", line);
        return { t: "compound", op: k2.value.slice(0, -1), target: e, expr: this.expr(), line };
      }
      if (e.t !== "call") {
        if (k2.type === "op" && k2.value === "==") throw new LuauError("To SET a value use one = sign.  == is for comparing (inside if).", line);
        throw new LuauError("This line doesn't do anything yet — did you forget = or ( )?", line);
      }
      return { t: "callstat", call: e, line };
    }
    ifStat() {
      const line = this.next().line; const clauses = []; let orelse = null;
      const cond = this.expr();
      this.expect("kw", "then", 'After an if condition, write "then"');
      clauses.push({ cond, body: this.block() });
      for (;;) {
        if (this.accept("kw", "elseif")) {
          const c = this.expr(); this.expect("kw", "then", 'After an elseif condition, write "then"');
          clauses.push({ cond: c, body: this.block() });
        } else if (this.accept("kw", "else")) { orelse = this.block(); this.expectEnd("if", line); break; }
        else { this.expectEnd("if", line); break; }
      }
      return { t: "if", clauses, orelse, line };
    }
    forStat() {
      const line = this.next().line; const n1 = this.expectName("A for loop needs a variable name, like: for i = 1, 10 do");
      if (this.accept("op", "=")) {
        const start = this.expr();
        this.expect("op", ",", "For loops look like:  for i = 1, 10 do");
        const stop = this.expr(); let step = null;
        if (this.accept("op", ",")) step = this.expr();
        this.expect("kw", "do", 'A for loop needs "do":  for i = 1, 10 do');
        const body = this.block(); this.expectEnd("for", line);
        return { t: "numfor", v: n1, start, stop, step, body, line };
      }
      const names = [n1];
      while (this.accept("op", ",")) names.push(this.expectName());
      this.expect("kw", "in", 'Write "in" — like:  for _, part in ipairs(list) do');
      const exprs = this.exprList();
      this.expect("kw", "do", 'A for loop needs "do"');
      const body = this.block(); this.expectEnd("for", line);
      return { t: "genfor", names, exprs, body, line };
    }
    funcBody(line, name, isMethod) {
      this.expect("op", "(", "A function needs ( ) after it");
      const params = isMethod ? ["self"] : []; let vararg = false;
      if (!this.isOp(")")) {
        do {
          if (this.accept("op", "...")) { vararg = true; break; }
          params.push(this.expectName()); if (this.accept("op", ":")) this.typeAnn();
        } while (this.accept("op", ","));
      }
      this.expect("op", ")", "Missing ) after the function's inputs");
      if (this.accept("op", ":")) this.typeAnn();
      const body = this.block(); this.expectEnd("function", line);
      return { t: "func", params, vararg, body, name, line };
    }
    exprList() { const l = [this.expr()]; while (this.accept("op", ",")) l.push(this.expr()); return l; }
    binop() {
      const k = this.peek();
      if (k.type === "op" && BINPRI[k.value]) return k.value;
      if (k.type === "kw" && (k.value === "and" || k.value === "or")) return k.value;
      return null;
    }
    expr(limit) {
      limit = limit || 0; let left; const k = this.peek();
      if ((k.type === "kw" && k.value === "not") || (k.type === "op" && (k.value === "-" || k.value === "#"))) {
        this.next(); left = { t: "unop", op: k.value, e: this.expr(UNARY_PRI), line: k.line };
      } else left = this.simpleExpr();
      for (;;) {
        const op = this.binop(); if (!op) break;
        const pri = BINPRI[op]; if (pri[0] <= limit) break;
        const ln = this.next().line;
        left = { t: "binop", op, l: left, r: this.expr(pri[1]), line: ln };
      }
      return left;
    }
    simpleExpr() {
      const k = this.peek();
      if (k.type === "num") { this.next(); return { t: "num", v: k.value }; }
      if (k.type === "str") { this.next(); return { t: "str", v: k.value }; }
      if (k.type === "kw") {
        if (k.value === "nil") { this.next(); return { t: "nil" }; }
        if (k.value === "true") { this.next(); return { t: "bool", v: true }; }
        if (k.value === "false") { this.next(); return { t: "bool", v: false }; }
        if (k.value === "function") { this.next(); return this.funcBody(k.line, "function", false); }
      }
      if (k.type === "op" && k.value === "{") return this.tableCons();
      if (k.type === "op" && k.value === "...") { this.next(); return { t: "vararg" }; }
      return this.suffixedExpr();
    }
    primaryExpr() {
      const k = this.peek();
      if (k.type === "name") { this.next(); return { t: "name", name: k.value, line: k.line }; }
      if (this.accept("op", "(")) { const e = this.expr(); this.expect("op", ")", "Missing ) to close the brackets"); return { t: "paren", e }; }
      if (k.type === "eof") throw new LuauError("Your code ended too early — something is missing at the end", k.line);
      throw new LuauError('I didn\'t expect "' + k.value + '" here', k.line);
    }
    suffixedExpr() {
      let e = this.primaryExpr();
      for (;;) {
        const k = this.peek();
        if (k.type === "op") {
          if (k.value === ".") { this.next(); e = { t: "index", obj: e, key: { t: "str", v: this.expectName("After a dot . write a name, like part.Color") }, line: k.line }; continue; }
          if (k.value === "[") { this.next(); const key = this.expr(); this.expect("op", "]"); e = { t: "index", obj: e, key, line: k.line }; continue; }
          if (k.value === ":") { this.next(); const name = this.expectName(); e = { t: "call", fn: e, method: name, args: this.callArgs(), line: k.line }; continue; }
          if (k.value === "(" || k.value === "{") { e = { t: "call", fn: e, args: this.callArgs(), line: k.line }; continue; }
        }
        if (k.type === "str") { e = { t: "call", fn: e, args: this.callArgs(), line: k.line }; continue; }
        return e;
      }
    }
    callArgs() {
      const k = this.peek();
      if (k.type === "str") { this.next(); return [{ t: "str", v: k.value }]; }
      if (k.type === "op" && k.value === "{") return [this.tableCons()];
      this.expect("op", "(", "I expected ( here");
      if (this.accept("op", ")")) return [];
      const l = this.exprList();
      this.expect("op", ")", "Missing ) to close the function call");
      return l;
    }
    tableCons() {
      const line = this.next().line; const items = [];
      while (!this.isOp("}")) {
        if (this.isOp("[")) { this.next(); const key = this.expr(); this.expect("op", "]"); this.expect("op", "="); items.push({ key, val: this.expr() }); }
        else if (this.peek().type === "name" && this.peek(1).type === "op" && this.peek(1).value === "=") {
          const key = this.next().value; this.next(); items.push({ key: { t: "str", v: key }, val: this.expr() });
        } else items.push({ val: this.expr() });
        if (!this.accept("op", ",") && !this.accept("op", ";")) break;
      }
      this.expect("op", "}", "Missing } to close the table");
      return { t: "table", items, line };
    }
  }

  class LuaTable {
    constructor() { this.hash = new Map(); this.arr = []; }
    get(k) {
      if (typeof k === "number" && Number.isInteger(k) && k >= 1 && k <= this.arr.length) return this.arr[k - 1];
      const v = this.hash.get(k); return v === undefined ? null : v;
    }
    set(k, v) {
      if (k === null || k === undefined) throw new LuauError("A table key can't be nil");
      if (typeof k === "number" && Number.isInteger(k) && k >= 1) {
        if (k <= this.arr.length) { if (v === null && k === this.arr.length) this.arr.pop(); else this.arr[k - 1] = v; return; }
        if (k === this.arr.length + 1 && v !== null) {
          this.arr.push(v);
          while (this.hash.has(this.arr.length + 1)) { const nk = this.arr.length + 1; this.arr.push(this.hash.get(nk)); this.hash.delete(nk); }
          return;
        }
      }
      if (v === null) this.hash.delete(k); else this.hash.set(k, v);
    }
    length() { return this.arr.length; }
    entries() { const out = this.arr.map((v, i) => [i + 1, v]); this.hash.forEach((v, k) => out.push([k, v])); return out; }
    static fromArray(a) { const t = new LuaTable(); a.forEach((v) => t.arr.push(v)); return t; }
  }

  class LuaFunction { constructor(node, scope, name) { this.node = node; this.scope = scope; this.name = name; } }
  class Scope {
    constructor(parent) { this.vars = new Map(); this.parent = parent; }
    lookup(name) { let s = this; while (s) { if (s.vars.has(name)) return s; s = s.parent; } return null; }
  }

  function truthy(v) { return v !== null && v !== undefined && v !== false; }
  function typeName(v) {
    if (v === null || v === undefined) return "nil";
    if (typeof v === "number") return "number";
    if (typeof v === "string") return "string";
    if (typeof v === "boolean") return "boolean";
    if (v instanceof LuaTable) return "table";
    if (v instanceof LuaFunction || typeof v === "function") return "function";
    return v.__type || "userdata";
  }
  function fmtNum(n) {
    if (Number.isInteger(n)) return String(n);
    if (!isFinite(n)) return n > 0 ? "inf" : (n < 0 ? "-inf" : "nan");
    return String(Math.round(n * 1e10) / 1e10);
  }
  function toStr(v) {
    if (v === null || v === undefined) return "nil";
    if (typeof v === "number") return fmtNum(v);
    if (typeof v === "string") return v;
    if (typeof v === "boolean") return v ? "true" : "false";
    if (v instanceof LuaTable) return "table";
    if (v instanceof LuaFunction || typeof v === "function") return "function";
    if (v.__type === "Color3") return fmtNum(v.R) + ", " + fmtNum(v.G) + ", " + fmtNum(v.B);
    if (v.__type === "Vector3") return fmtNum(v.X) + ", " + fmtNum(v.Y) + ", " + fmtNum(v.Z);
    if (v.__get) { try { return toStr(v.__get("Name")); } catch (e) { return v.__type; } }
    return String(v);
  }
  function exprName(e) {
    if (!e) return "?";
    if (e.t === "name") return e.name;
    if (e.t === "index") return exprName(e.obj) + (e.key.t === "str" ? "." + e.key.v : "[…]");
    if (e.t === "call") return exprName(e.fn) + (e.method ? ":" + e.method : "") + "()";
    if (e.t === "paren") return exprName(e.e);
    return "that";
  }
  function lev(a, b) {
    const m = a.length, n = b.length; const d = [];
    for (let i = 0; i <= m; i++) { d[i] = [i]; }
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  const KNOWN = ["print","wait","task.wait","Color3.new","Color3.fromRGB","BrickColor.new","Vector3.new","Instance.new","math.random","math.floor","tostring","tonumber","ipairs","pairs","game","workspace","script","task.spawn","task.delay"];
  function suggest(nm) {
    for (const k of KNOWN) if (k.toLowerCase() === nm.toLowerCase() && k !== nm) return 'Luau cares about capital letters! Write "' + k + '" instead of "' + nm + '".';
    let best = null, bd = 99;
    for (const k of KNOWN) { const d = lev(k.toLowerCase(), nm.toLowerCase()); if (d < bd) { bd = d; best = k; } }
    if (best && bd <= 2) return 'I don\'t know "' + nm + '". Did you mean "' + best + '"?';
    return 'I don\'t know a function called "' + nm + '" — it is nil (empty). Check the spelling, or make it first.';
  }

  class Interp {
    constructor(opts) {
      opts = opts || {};
      this.globals = new Scope(null); this.ops = 0; this.stopped = false; this.depth = 0;
      this.maxOps = opts.maxOps || 400000;
      this.installStd();
    }
    define(name, val) { this.globals.vars.set(name, val); }
    installStd() {
      const self = this;
      const nat = (fn) => fn;
      this.define("tostring", nat((a) => toStr(a[0])));
      this.define("tonumber", nat((a) => { const n = Number(a[0]); return a[0] === null || isNaN(n) ? null : n; }));
      this.define("type", nat((a) => { const t = typeName(a[0]); return ["nil","number","string","boolean","table","function"].includes(t) ? t : "userdata"; }));
      this.define("typeof", nat((a) => typeName(a[0])));
      this.define("error", nat((a) => { throw new LuauError(toStr(a[0])); }));
      this.define("ipairs", nat((a) => {
        const t = a[0];
        if (!(t instanceof LuaTable)) throw new LuauError("ipairs needs a list (table) — like ipairs(workspace:GetChildren())");
        return { __iter: t.arr.map((v, i) => [i + 1, v]) };
      }));
      this.define("pairs", nat((a) => {
        const t = a[0];
        if (!(t instanceof LuaTable)) throw new LuauError("pairs needs a table");
        return { __iter: t.entries() };
      }));
      const math = new LuaTable();
      math.set("random", nat((a) => {
        if (a.length === 0 || a[0] === null) return Math.random();
        let lo = 1, hi = Number(a[0]); if (a.length >= 2 && a[1] !== null) { lo = Number(a[0]); hi = Number(a[1]); }
        return lo + Math.floor(Math.random() * (hi - lo + 1));
      }));
      math.set("floor", nat((a) => Math.floor(a[0]))); math.set("ceil", nat((a) => Math.ceil(a[0])));
      math.set("abs", nat((a) => Math.abs(a[0]))); math.set("sqrt", nat((a) => Math.sqrt(a[0])));
      math.set("max", nat((a) => Math.max.apply(null, a))); math.set("min", nat((a) => Math.min.apply(null, a)));
      math.set("clamp", nat((a) => Math.min(Math.max(a[0], a[1]), a[2])));
      math.set("sin", nat((a) => Math.sin(a[0]))); math.set("cos", nat((a) => Math.cos(a[0])));
      math.set("round", nat((a) => Math.round(a[0])));
      math.set("pi", Math.PI); math.set("huge", Infinity);
      this.define("math", math);
      const str = new LuaTable();
      str.set("upper", nat((a) => String(a[0]).toUpperCase()));
      str.set("lower", nat((a) => String(a[0]).toLowerCase()));
      str.set("len", nat((a) => String(a[0]).length));
      str.set("rep", nat((a) => String(a[0]).repeat(Math.max(0, a[1] | 0))));
      str.set("sub", nat((a) => { const s = String(a[0]); let i = a[1] || 1, j = a[2] === undefined || a[2] === null ? s.length : a[2]; if (i < 0) i = s.length + i + 1; if (j < 0) j = s.length + j + 1; return s.substring(i - 1, j); }));
      str.set("format", nat((a) => { let i = 1; return String(a[0]).replace(/%[sdif]|%\.\d+f/g, (m) => { const v = a[i++]; if (m === "%d" || m === "%i") return String(Math.floor(v)); if (m.endsWith("f")) { const p = m.length > 2 ? Number(m.slice(2, -1)) : 6; return Number(v).toFixed(p); } return toStr(v); }); }));
      this.stringLib = str;
      this.define("string", str);
      const table = new LuaTable();
      table.set("insert", nat((a) => { const t = a[0]; if (a.length >= 3) t.arr.splice(a[1] - 1, 0, a[2]); else t.set(t.length() + 1, a[1]); }));
      table.set("remove", nat((a) => { const t = a[0]; const i = a.length >= 2 ? a[1] : t.length(); const v = t.arr.splice(i - 1, 1)[0]; return v === undefined ? null : v; }));
      table.set("concat", nat((a) => a[0].arr.map(toStr).join(a[1] === undefined || a[1] === null ? "" : a[1])));
      this.define("table", table);
    }
    async tick(line) {
      if (this.stopped) throw STOP;
      this.ops++;
      if (this.ops > this.maxOps) throw new LuauError("Your code is running forever without resting! Inside loops, add wait() so the game can keep up.", line);
      if (this.ops % 2000 === 0) await new Promise((r) => setTimeout(r, 0));
      if (this.stopped) throw STOP;
    }
    resetOps() { this.ops = 0; }
    parse(src) { return new Parser(tokenize(src)).parseChunk(); }
    async run(src) { const ast = this.parse(src); await this.execBlock(ast, new Scope(this.globals)); }
    async execBlock(stmts, sc) { for (const s of stmts) await this.exec(s, sc); }
    async loopBody(body, sc) {
      try { await this.execBlock(body, sc); }
      catch (e) { if (e === BREAK) return "break"; if (e === CONTINUE) return "cont"; throw e; }
      return null;
    }
    async exec(s, sc) {
      await this.tick(s.line);
      try {
        switch (s.t) {
          case "local": { const vals = await this.evalList(s.exprs, sc); s.names.forEach((nm, i) => sc.vars.set(nm, i < vals.length ? vals[i] : null)); return; }
          case "localfn": { const f = new LuaFunction(s.fn, sc, s.name); sc.vars.set(s.name, f); f.scope = sc; return; }
          case "assign": {
            const vals = await this.evalList(s.exprs, sc);
            for (let i = 0; i < s.targets.length; i++) await this.assignTo(s.targets[i], i < vals.length ? vals[i] : null, sc, s.line);
            return;
          }
          case "compound": {
            const cur = await this.eval(s.target, sc); const r = await this.eval(s.expr, sc);
            await this.assignTo(s.target, this.binop(s.op, cur, r, s.line, s.target, s.expr), sc, s.line); return;
          }
          case "callstat": await this.evalCall(s.call, sc); return;
          case "if": {
            for (const c of s.clauses) if (truthy(await this.eval(c.cond, sc))) { await this.execBlock(c.body, new Scope(sc)); return; }
            if (s.orelse) await this.execBlock(s.orelse, new Scope(sc));
            return;
          }
          case "while": {
            while (truthy(await this.eval(s.cond, sc))) {
              const r = await this.loopBody(s.body, new Scope(sc)); if (r === "break") break;
              await this.tick(s.line);
            }
            return;
          }
          case "repeat": {
            for (;;) {
              const inner = new Scope(sc); const r = await this.loopBody(s.body, inner); if (r === "break") break;
              if (truthy(await this.eval(s.cond, inner))) break;
            }
            return;
          }
          case "numfor": {
            const a = this.toNum(await this.eval(s.start, sc), s.line, "the for loop start");
            const b = this.toNum(await this.eval(s.stop, sc), s.line, "the for loop end");
            const st = s.step ? this.toNum(await this.eval(s.step, sc), s.line, "the for loop step") : 1;
            if (st === 0) throw new LuauError("A for loop step can't be 0", s.line);
            for (let i = a; st > 0 ? i <= b : i >= b; i += st) {
              const inner = new Scope(sc); inner.vars.set(s.v, i);
              const r = await this.loopBody(s.body, inner); if (r === "break") break;
            }
            return;
          }
          case "genfor": {
            const vals = await this.evalList(s.exprs, sc); const it = vals[0]; let seq;
            if (it && it.__iter) seq = it.__iter;
            else if (it instanceof LuaTable) seq = it.entries();
            else throw new LuauError("for ... in needs ipairs(list) or pairs(table)", s.line);
            for (const kv of seq) {
              const inner = new Scope(sc); inner.vars.set(s.names[0], kv[0]); if (s.names[1]) inner.vars.set(s.names[1], kv[1]);
              const r = await this.loopBody(s.body, inner); if (r === "break") break;
            }
            return;
          }
          case "do": await this.execBlock(s.body, new Scope(sc)); return;
          case "return": throw new ReturnSig(await this.evalList(s.exprs, sc));
          case "break": throw BREAK;
          case "continue": throw CONTINUE;
        }
      } catch (e) {
        if (e instanceof LuauError && !e.line) e.line = s.line;
        throw e;
      }
    }
    async assignTo(target, val, sc, line) {
      if (target.t === "name") {
        const s = sc.lookup(target.name); (s || this.globals).vars.set(target.name, val); return;
      }
      const obj = await this.eval(target.obj, sc); const key = await this.eval(target.key, sc);
      if (obj === null || obj === undefined) throw new LuauError('I can\'t find "' + exprName(target.obj) + '" — it is nil. Check the name (capital letters matter!).', line);
      if (obj instanceof LuaTable) { obj.set(key, val); return; }
      if (obj.__set) { obj.__set(key, val, line); return; }
      throw new LuauError("You can't set " + toStr(key) + " on a " + typeName(obj), line);
    }
    index(obj, key, objExpr, line) {
      if (obj === null || obj === undefined) throw new LuauError('I can\'t find "' + exprName(objExpr) + '" — it is nil. Check the name (capital letters matter!).', line);
      if (obj instanceof LuaTable) return obj.get(key);
      if (typeof obj === "string") { const f = this.stringLib.get(key); if (f === null) throw new LuauError("Text doesn't have " + key, line); return f; }
      if (obj.__get) return obj.__get(key, line);
      if (obj.__type === "Color3" || obj.__type === "Vector3") { const v = obj[key]; return v === undefined ? null : v; }
      if (typeof obj === "number" || typeof obj === "boolean") throw new LuauError('"' + exprName(objExpr) + '" is a ' + typeName(obj) + ", so it doesn't have ." + toStr(key), line);
      return null;
    }
    async evalArgs(args, sc) { return this.evalList(args, sc); }
    async evalList(exprs, sc) {
      const out = [];
      for (let i = 0; i < exprs.length; i++) {
        const e = exprs[i];
        if (i === exprs.length - 1 && e.t === "call") { const r = await this.evalCall(e, sc); for (const v of r) out.push(v); }
        else if (i === exprs.length - 1 && e.t === "vararg") { const s = sc.lookup("..."); if (s) for (const v of s.vars.get("...")) out.push(v); }
        else out.push(await this.eval(e, sc));
      }
      return out;
    }
    async evalCall(e, sc) {
      let fn, args;
      if (e.method) {
        const obj = await this.eval(e.fn, sc);
        if (obj === null || obj === undefined) throw new LuauError('I can\'t find "' + exprName(e.fn) + '" to use :' + e.method + "() on. Check the name!", e.line);
        fn = this.index(obj, e.method, e.fn, e.line);
        if (fn === null || fn === undefined) throw new LuauError('"' + exprName(e.fn) + '" doesn\'t have a method called ' + e.method, e.line);
        args = [obj].concat(await this.evalArgs(e.args, sc));
      } else {
        fn = await this.eval(e.fn, sc); args = await this.evalArgs(e.args, sc);
        if (fn === null || fn === undefined) throw new LuauError(suggest(exprName(e.fn)), e.line);
      }
      return this.callFunction(fn, args, e.line);
    }
    async callFunction(fn, args, line) {
      if (fn instanceof LuaFunction) {
        const sc = new Scope(fn.scope);
        fn.node.params.forEach((p, i) => sc.vars.set(p, i < args.length ? args[i] : null));
        if (fn.node.vararg) sc.vars.set("...", args.slice(fn.node.params.length));
        this.depth++;
        if (this.depth > 180) { this.depth--; throw new LuauError("A function keeps calling itself forever!", line); }
        try { await this.execBlock(fn.node.body, sc); return []; }
        catch (err) { if (err instanceof ReturnSig) return err.vals; if (err === BREAK) throw new LuauError('"break" only works inside a loop', line); throw err; }
        finally { this.depth--; }
      }
      if (typeof fn === "function") {
        let r;
        try { r = await fn(args, line, this); }
        catch (err) { if (err instanceof LuauError && !err.line) err.line = line; throw err; }
        if (r === undefined) return [];
        if (r && r.__multi) return r.__multi;
        return [r];
      }
      throw new LuauError("That is a " + typeName(fn) + ", not a function, so it can't be called with ( )", line);
    }
    toNum(v, line, what) {
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
      throw new LuauError("I need a number for " + (what || "this math") + ", but got " + (v === null ? "nil (nothing)" : typeName(v)), line);
    }
    binop(op, l, r, line) {
      switch (op) {
        case "+": case "-": case "*": case "/": case "//": case "%": case "^": {
          if (l && r && l.__type === "Vector3" && r.__type === "Vector3" && (op === "+" || op === "-")) {
            const s = op === "+" ? 1 : -1; return mkVec(l.X + s * r.X, l.Y + s * r.Y, l.Z + s * r.Z);
          }
          if (l && l.__type === "Vector3" && typeof r === "number" && (op === "*" || op === "/")) {
            return op === "*" ? mkVec(l.X * r, l.Y * r, l.Z * r) : mkVec(l.X / r, l.Y / r, l.Z / r);
          }
          if ((typeof l === "string" && isNaN(Number(l))) || (typeof r === "string" && isNaN(Number(r))))
            throw new LuauError(op === "+" ? 'To join text in Luau use .. (two dots), not +' : "You can't do math with text", line);
          const a = this.toNum(l, line, "math"), b = this.toNum(r, line, "math");
          if (op === "+") return a + b; if (op === "-") return a - b; if (op === "*") return a * b;
          if (op === "/") return a / b; if (op === "//") return Math.floor(a / b);
          if (op === "%") return a - Math.floor(a / b) * b; return Math.pow(a, b);
        }
        case "..": {
          const ok = (v) => typeof v === "string" || typeof v === "number";
          if (!ok(l) || !ok(r)) {
            const bad = !ok(l) ? l : r;
            throw new LuauError(bad === null ? "You're joining text with nil (nothing) — is a variable empty?" : "Use tostring() to join a " + typeName(bad) + " with text", line);
          }
          return toStr(l) + toStr(r);
        }
        case "==": return luaEq(l, r);
        case "~=": return !luaEq(l, r);
        case "<": case ">": case "<=": case ">=": {
          if (!((typeof l === "number" && typeof r === "number") || (typeof l === "string" && typeof r === "string")))
            throw new LuauError("I can only compare two numbers (or two texts), but got " + typeName(l) + " and " + typeName(r), line);
          if (op === "<") return l < r; if (op === ">") return l > r; if (op === "<=") return l <= r; return l >= r;
        }
      }
      throw new LuauError("Unknown operator " + op, line);
    }
    async eval(e, sc) {
      switch (e.t) {
        case "num": return e.v; case "str": return e.v; case "nil": return null; case "bool": return e.v;
        case "name": { const s = sc.lookup(e.name); return s ? s.vars.get(e.name) : null; }
        case "paren": return this.eval(e.e, sc);
        case "func": return new LuaFunction(e, sc, e.name);
        case "vararg": { const s = sc.lookup("..."); const v = s ? s.vars.get("...")[0] : null; return v === undefined ? null : v; }
        case "table": {
          const t = new LuaTable(); let n = 1;
          for (const it of e.items) { const v = await this.eval(it.val, sc); if (it.key) t.set(await this.eval(it.key, sc), v); else t.set(n++, v); }
          return t;
        }
        case "index": { const obj = await this.eval(e.obj, sc); const key = await this.eval(e.key, sc); return this.index(obj, key, e.obj, e.line); }
        case "call": { const r = await this.evalCall(e, sc); return r.length ? r[0] : null; }
        case "unop": {
          const v = await this.eval(e.e, sc);
          if (e.op === "not") return !truthy(v);
          if (e.op === "-") { if (v && v.__type === "Vector3") return mkVec(-v.X, -v.Y, -v.Z); return -this.toNum(v, e.line, "-"); }
          if (typeof v === "string") return v.length;
          if (v instanceof LuaTable) return v.length();
          throw new LuauError("# needs a list or text", e.line);
        }
        case "binop": {
          if (e.op === "and") { const l = await this.eval(e.l, sc); return truthy(l) ? this.eval(e.r, sc) : l; }
          if (e.op === "or") { const l = await this.eval(e.l, sc); return truthy(l) ? l : this.eval(e.r, sc); }
          const l = await this.eval(e.l, sc), r = await this.eval(e.r, sc);
          return this.binop(e.op, l, r, e.line);
        }
      }
      throw new LuauError("I don't understand this part of the code", e.line);
    }
  }

  function mkVec(x, y, z) { return { __type: "Vector3", X: x, Y: y, Z: z || 0, Magnitude: Math.sqrt(x * x + y * y + (z || 0) * (z || 0)) }; }
  function mkColor(r, g, b) { return { __type: "Color3", R: r, G: g, B: b }; }
  function luaEq(a, b) {
    if (a === b) return true;
    if (a && b && a.__type === "Color3" && b.__type === "Color3") return Math.abs(a.R - b.R) < 1e-6 && Math.abs(a.G - b.G) < 1e-6 && Math.abs(a.B - b.B) < 1e-6;
    if (a && b && a.__part && b.__part) return a.__part === b.__part;
    if (a && b && a.__type === "BrickColor" && b.__type === "BrickColor") return a.Name === b.Name;
    return false;
  }

  /** Friendly text for an error object */
  function friendly(err) {
    if (!err) return "";
    if (err === STOP) return "";
    const line = err.line ? "Line " + err.line + ": " : "";
    return line + (err.message || String(err));
  }

  global.Luau = { Interp, LuauError, LuaTable, LuaFunction, STOP, toStr, mkVec, mkColor, typeName, truthy, friendly, tokenize, Parser };
})(typeof window !== "undefined" ? window : globalThis);
