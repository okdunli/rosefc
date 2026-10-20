// src/runtime/lorawan.ts
var MTYPES = {
  0: "join-request",
  1: "join-accept",
  2: "unconfirmed-data-up",
  3: "unconfirmed-data-down",
  4: "confirmed-data-up",
  5: "confirmed-data-down",
  6: "proprietary",
  7: "proprietary"
};
var HEX = "0123456789ABCDEF";
function hex(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += HEX[bytes[i] >> 4] + HEX[bytes[i] & 15];
  }
  return out;
}
function parseLoRaWAN(frame) {
  if (!frame || frame.length < 5) return null;
  const mhdr = frame[0];
  const mtype = MTYPES[mhdr >> 5 & 7];
  const major = mhdr & 3;
  if (major > 1) return null;
  const body = frame.subarray(1, frame.length - 4);
  const mic = frame.subarray(frame.length - 4);
  if (body.length < 1) return null;
  const dv = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
  if (mtype === "join-request") {
    if (body.length !== 18) return null;
    return {
      kind: "join-request",
      major,
      appEUI: hex(body.subarray(0, 8)),
      devEUI: hex(body.subarray(8, 16)),
      devNonce: dv.getUint16(17, true),
      mic
    };
  }
  if (mtype === "join-accept") {
    if (body.length < 12) return null;
    return {
      kind: "join-accept",
      major,
      appNonce: hex(body.subarray(0, 3)),
      netID: hex(body.subarray(3, 6)),
      devAddr: hex(body.subarray(6, 10)),
      mic
    };
  }
  if (body.length < 7) return null;
  const devAddr = hex(body.subarray(0, 4));
  const fctrlB = body[4];
  const fOptsLen = fctrlB & 15;
  const fCnt = dv.getUint16(6, true);
  let p = 7;
  if (p + fOptsLen > body.length) return null;
  const fOpts = fOptsLen > 0 ? body.subarray(p, p + fOptsLen) : null;
  p += fOptsLen;
  let fPort = null;
  let frmPayload = null;
  if (p < body.length) {
    fPort = body[p];
    p += 1;
    if (p < body.length) frmPayload = body.subarray(p);
  }
  return {
    kind: "data",
    mtype,
    major,
    devAddr,
    fctrl: {
      adr: (fctrlB & 128) !== 0,
      adrAckReq: (fctrlB & 64) !== 0,
      ack: (fctrlB & 32) !== 0,
      classB: (fctrlB & 16) !== 0,
      fOptsLen
    },
    fCnt,
    fOpts,
    fPort,
    frmPayload,
    mic
  };
}

// src/runtime/index.ts
function shared(key, init) {
  const g = globalThis;
  return g[key] ??= init();
}
function sharedCell(key, initial) {
  const g = globalThis;
  return g[key] ??= { value: initial };
}
var currentEffect = null;
var trackingDeps = null;
function untrack(fn) {
  const prevEffect = currentEffect;
  const prevTracking = trackingDeps;
  currentEffect = null;
  trackingDeps = null;
  try {
    return fn();
  } finally {
    currentEffect = prevEffect;
    trackingDeps = prevTracking;
  }
}
var signalMap = shared("__rosefd_signalMap", () => /* @__PURE__ */ new Map());
function entry(key, initial) {
  const map = renderMaps().signals;
  const e = map.get(key) ?? { value: initial, subs: /* @__PURE__ */ new Set() };
  map.set(key, e);
  return e;
}
function state(key, initial) {
  ownerKeys()?.add(key);
  const e = entry(key, initial);
  const getter = () => {
    if (currentEffect) {
      e.subs.add(currentEffect);
      if (trackingDeps) trackingDeps.add(e);
    }
    return e.value;
  };
  const setter = (v) => {
    const next = typeof v === "function" ? v(e.value) : v;
    if (Object.is(next, e.value)) return;
    e.value = next;
    const prevEffect = currentEffect;
    const prevTracking = trackingDeps;
    currentEffect = null;
    trackingDeps = null;
    for (const fn of [...e.subs]) fn();
    currentEffect = prevEffect;
    trackingDeps = prevTracking;
    if (persistedKeys.has(key)) writeStorage(key, next);
  };
  return [getter, setter];
}
function hasState(key) {
  return renderMaps().signals.has(key);
}
var seededKeys = shared("__rosefd_seededKeys", () => /* @__PURE__ */ new Set());
function isSeeded(key) {
  return renderMaps().seeded.has(key);
}
function markSeeded(key) {
  renderMaps().seeded.add(key);
}
function setState(key, value) {
  const e = entry(key, value);
  if (Object.is(value, e.value)) return;
  e.value = value;
  const prevEffect = currentEffect;
  const prevTracking = trackingDeps;
  currentEffect = null;
  trackingDeps = null;
  for (const fn of [...e.subs]) fn();
  currentEffect = prevEffect;
  trackingDeps = prevTracking;
  if (persistedKeys.has(key)) writeStorage(key, value);
}
var persistedKeys = shared("__rosefd_persistedKeys", () => /* @__PURE__ */ new Set());
function writeStorage(key, v) {
  try {
    globalThis.localStorage?.setItem("rosefd:" + key, JSON.stringify(v));
  } catch {
  }
}
function persistState(key, initial) {
  persistedKeys.add(key);
  let seeded = initial;
  let hasStored = false;
  try {
    const raw = globalThis.localStorage?.getItem("rosefd:" + key);
    if (raw != null) {
      seeded = JSON.parse(raw);
      hasStored = true;
    }
  } catch {
  }
  const [get, set] = state(key, seeded);
  if (hasStored) set(seeded);
  return [get, set];
}
var lastBoundaryError = sharedCell("__rosefd_lastBoundaryError", null);
function $setBoundaryError(e) {
  lastBoundaryError.value = e instanceof Error ? e : new Error(String(e));
}
function $boundaryError() {
  return lastBoundaryError.value;
}
var cleanups = shared("__rosefd_cleanups", () => /* @__PURE__ */ new Set());
var fxOwner = null;
var fxByOwner = shared("__rosefd_fxByOwner", () => /* @__PURE__ */ new WeakMap());
var keysByOwner = shared("__rosefd_keysByOwner", () => /* @__PURE__ */ new WeakMap());
var fxSet = () => {
  if (!fxOwner) return cleanups;
  let s = fxByOwner.get(fxOwner);
  if (!s) {
    s = /* @__PURE__ */ new Set();
    fxByOwner.set(fxOwner, s);
  }
  return s;
};
var ownerKeys = () => {
  if (!fxOwner) return null;
  let s = keysByOwner.get(fxOwner);
  if (!s) {
    s = /* @__PURE__ */ new Set();
    keysByOwner.set(fxOwner, s);
  }
  return s;
};
function setFxOwner(container) {
  fxOwner = container;
}
function resetContainerFx(container) {
  const set = fxByOwner.get(container);
  if (set) {
    set.forEach((fn) => fn());
    fxByOwner.delete(container);
  }
  const keys = keysByOwner.get(container);
  if (keys) {
    keys.forEach((k) => renderMaps().signals.delete(k));
    keysByOwner.delete(container);
  }
  renderMaps().data.clear();
  pendingDeltas.clear();
}
function effect(fn) {
  const wrapped = () => {
    try {
      fn();
    } catch {
    }
  };
  const prev = currentEffect;
  currentEffect = wrapped;
  fn();
  currentEffect = prev;
  const cleanup = () => {
    renderMaps().signals.forEach((e) => e.subs.delete(wrapped));
    STORES.forEach((e) => e.subs.delete(wrapped));
    fxSet().delete(cleanup);
  };
  fxSet().add(cleanup);
  return cleanup;
}
function $effect(fn) {
  if (typeof document === "undefined") return () => {
  };
  const deps = /* @__PURE__ */ new Set();
  let cleanup;
  let scheduled = false;
  let disposed = false;
  const detach = () => {
    deps.forEach((e) => e.subs.delete(wrapped));
    deps.clear();
  };
  const run = () => {
    if (disposed) return;
    scheduled = true;
    detach();
    if (typeof cleanup === "function") {
      try {
        cleanup();
      } catch {
      }
    }
    const prevEffect = currentEffect;
    const prevTracking = trackingDeps;
    currentEffect = wrapped;
    trackingDeps = deps;
    try {
      const ret = fn();
      cleanup = typeof ret === "function" ? ret : void 0;
    } catch {
    }
    currentEffect = prevEffect;
    trackingDeps = prevTracking;
    scheduled = false;
  };
  const wrapped = () => {
    if (scheduled || disposed) return;
    scheduled = true;
    queueMicrotask(run);
  };
  const owner = fxSet();
  const dispose = () => {
    disposed = true;
    detach();
    if (typeof cleanup === "function") {
      try {
        cleanup();
      } catch {
      }
    }
    owner.delete(dispose);
  };
  owner.add(dispose);
  queueMicrotask(run);
  return dispose;
}
var ESC_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
}
function textMark(closes, fn, pair, arg) {
  const i = closes.push(fn) - 1;
  return `<!--\u27E6m:${i}\u27E7-->` + esc(fn(arg)) + (pair ? `<!--\u27E6/m:${i}\u27E7-->` : "");
}
function attrValueString(name, v) {
  if (v == null) return "";
  if (typeof v === "object") {
    if (name === "class") {
      return Object.entries(v).filter(([, x]) => x).map(([k]) => k).join(" ");
    }
    if (name === "style") {
      return Object.entries(v).filter(([, x]) => x != null && x !== false && x !== "").map(([k, x]) => `${k}: ${x}`).join("; ");
    }
    return JSON.stringify(v);
  }
  return String(v);
}
function attrMark(closes, fn, name, arg) {
  const i = closes.push(fn) - 1;
  return `${name}="${esc(attrValueString(name, fn(arg)))}" data-b${i}="${name}"`;
}
function boolAttrMark(closes, fn, name, arg) {
  const i = closes.push(fn) - 1;
  return (fn(arg) ? ` ${name}=""` : "") + ` data-b${i}="!${name}"`;
}
function ifMark(closes, cond, fn, scope) {
  let snap = null;
  const i = closes.push(() => {
    if (!cond()) {
      snap = null;
      return null;
    }
    if (!snap) {
      const html = String(untrack(() => fn(scope, closes)));
      snap = html.includes("\u27E6") ? null : { html, closes };
      return { html, closes };
    }
    return snap;
  }) - 1;
  const r = closes[i]();
  return `<!--\u27E6i:${i}\u27E7-->` + (r ? r.html : "") + `<!--\u27E6/i:${i}\u27E7-->`;
}
var EACH_REUSE_FORBID = /data-(?:on|use|bind-this|transition|animate)|data-rosefd-c|data-rv-island/;
var EACH_HTML_NORM = (h) => h.replace(/\u27e6\/?[a-z]+:\d+\u27e7/g, "").replace(/data-b\d+/g, "data-b");
var normHtml = (row) => row.norm ??= EACH_HTML_NORM(row.html);
function eachMark(closes, items, fn, key) {
  const i = closes.push(() => {
    const list = items();
    return untrack(() => list.map((v, vi) => {
      return { html: String(fn(v, closes, vi)), closes, scope: v, keyed: !!key, key: key ? String(key(v, vi)) : void 0 };
    }));
  }) - 1;
  let h = `<!--\u27E6l:${i}\u27E7-->`;
  for (const r of closes[i]()) h += r.html;
  return h + `<!--\u27E6/l:${i}\u27E7-->`;
}
function headMark(closes, fn) {
  const i = closes.push(fn) - 1;
  return `<!--\u27E6h:${i}\u27E7-->` + fn() + `<!--\u27E6/h:${i}\u27E7-->`;
}
function rawMark(closes, fn, arg) {
  const i = closes.push((s) => ({ html: String(fn(s) ?? ""), closes })) - 1;
  const r = closes[i](arg);
  return `<!--\u27E6i:${i}\u27E7-->` + r.html + `<!--\u27E6/i:${i}\u27E7-->`;
}
function slotBlockMark(closes, hit) {
  if (!hit) return "";
  const i = closes.push(() => {
    if (!hit) return null;
    return { html: String(untrack(() => hit.fn(hit.o, closes))), closes, scope: hit.o };
  }) - 1;
  return `<!--\u27E6i:${i}\u27E7-->` + String(untrack(() => hit.fn(hit.o, closes))) + `<!--\u27E6/i:${i}\u27E7-->`;
}
var MARK_RE = /^\u27e6([milh]):(\d+)\u27e7$/;
var END_RE = /^\u27e6\/([milh]):(\d+)\u27e7$/;
var wired = shared("__rosefd_wired", () => /* @__PURE__ */ new WeakSet());
var pendingIslandObservers = shared("__rosefd_pendingIslandObservers", () => /* @__PURE__ */ new Set());
var TPL_CACHE_MAX = 512;
var tplCache = shared("__rosefd_tplCache", () => /* @__PURE__ */ new Map());
function tpl(html) {
  let t = tplCache.get(html);
  if (!t) {
    t = document.createElement("template");
    t.innerHTML = html;
    if (tplCache.size >= TPL_CACHE_MAX) {
      const oldest = tplCache.keys().next().value;
      if (oldest !== void 0) tplCache.delete(oldest);
    }
    tplCache.set(html, t);
  }
  return t.content.cloneNode(true);
}
var HEAD_ATTR = "data-rosefd-head";
var handlers = globalThis.__rosefd_handlers ??= {};
var actionDispatchCell = sharedCell("__rosefd_actionDispatch", null);
function setActionDispatcher(fn) {
  actionDispatchCell.value = fn;
}
var directBound = shared("__rosefd_directBound", () => /* @__PURE__ */ new WeakMap());
var directives = globalThis.__rosefd_directives ??= {};
var actionRecords = shared("__rosefd_actionRecords", () => /* @__PURE__ */ new WeakMap());
function applyHead(html) {
  const seen = /* @__PURE__ */ new Set();
  const positional = /* @__PURE__ */ new Map();
  const frag = tpl(html);
  const title = frag.querySelector("title");
  if (title) {
    let cur = document.head.querySelector("title");
    if (!cur) {
      cur = document.createElement("title");
      document.head.appendChild(cur);
    }
    cur.textContent = title.textContent ?? "";
  }
  for (const el of Array.from(document.head.querySelectorAll(`[${HEAD_ATTR}]`))) el.remove();
  for (const el of Array.from(frag.children)) {
    if (el.tagName === "TITLE") continue;
    const tag = el.tagName.toLowerCase();
    const name = el.getAttribute("name");
    const property = el.getAttribute("property");
    const rel = el.getAttribute("rel");
    const charset = el.getAttribute("charset");
    let identity;
    if (name !== null) identity = name;
    else if (property !== null) identity = property;
    else if (rel !== null) identity = rel + linkIdentitySuffix(rel, el);
    else identity = charset;
    let managed;
    if (identity) managed = `${tag}:${identity}`.replace(/"/g, "");
    else if (el.id) managed = `${tag}:${el.id}`;
    else {
      const n = positional.get(tag) ?? 0;
      positional.set(tag, n + 1);
      managed = `${tag}:#${n}`;
    }
    if (seen.has(managed)) continue;
    seen.add(managed);
    el.setAttribute(HEAD_ATTR, managed);
    document.head.appendChild(el);
  }
}
function linkIdentitySuffix(rel, el) {
  if (/(^|\s)canonical(\s|$)/i.test(rel)) return "";
  return `@${el.getAttribute("href") ?? el.getAttribute("type") ?? el.getAttribute("as") ?? ""}`;
}
function clearHead() {
  document.head.querySelectorAll(`[${HEAD_ATTR}]`).forEach((el) => el.remove());
}
var TRANSITION_POSES = {
  fade: { opacity: "0" },
  slide: { transform: "translateY(20px)", opacity: "0" },
  fly: { transform: "translateX(-30px) rotate(-5deg)", opacity: "0" },
  zoom: { transform: "scale(0.8)", opacity: "0" },
  "slide-up": { transform: "translateY(30px)", opacity: "0" },
  "slide-down": { transform: "translateY(-30px)", opacity: "0" },
  "slide-left": { transform: "translateX(30px)", opacity: "0" },
  "slide-right": { transform: "translateX(-30px)", opacity: "0" },
  scale: { transform: "scale(0.7)", opacity: "0" },
  spin: { transform: "rotate(-90deg)", opacity: "0" },
  blur: { filter: "blur(8px)", opacity: "0" },
  stagger: { transform: "translateY(10px)", opacity: "0" }
};
function parseTransitionParams(pstr) {
  const out = {};
  if (!pstr) return out;
  const trimmed = pstr.trim();
  if (/^\d+$/.test(trimmed)) {
    out.duration = Number(trimmed);
    return out;
  }
  const dM = /duration\s*:\s*(\d+)/.exec(pstr);
  if (dM) out.duration = Number(dM[1]);
  const dlM = /delay\s*:\s*(\d+)/.exec(pstr);
  if (dlM) out.delay = Number(dlM[1]);
  const eM = /easing\s*:\s*(['"])(.*?)\1/.exec(pstr);
  if (eM) out.easing = eM[2];
  return out;
}
function wire(root, closes, scope) {
  let holder = root;
  if (root.nodeType === 11) {
    const div = document.createElement("div");
    div.appendChild(root);
    holder = div;
  }
  const created = [];
  const weff = (fn) => created.push(effect(fn));
  const comments = [];
  const walker = document.createTreeWalker(holder, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) comments.push(walker.currentNode);
  const nested = /* @__PURE__ */ new Set();
  const headPair = /* @__PURE__ */ new Set();
  const open = [];
  for (let i = 0; i < comments.length; i++) {
    const m = (comments[i].nodeValue ?? "").match(MARK_RE);
    if (m && (m[1] === "i" || m[1] === "l" || m[1] === "h")) {
      open.push(i);
      continue;
    }
    const em = (comments[i].nodeValue ?? "").match(END_RE);
    if (!em) continue;
    const key = em[1] + em[2];
    let at = -1;
    for (let k = open.length - 1; k >= 0; k--) {
      const om2 = (comments[open[k]].nodeValue ?? "").match(MARK_RE);
      if (om2[1] + om2[2] === key) {
        at = k;
        break;
      }
    }
    if (at < 0) continue;
    const om = (comments[open[at]].nodeValue ?? "").match(MARK_RE);
    if (om[1] === "h") {
      headPair.add(comments[open[at]]);
      headPair.add(comments[i]);
    }
    for (let k = open[at] + 1; k < i; k++) nested.add(comments[k]);
    open.length = at;
  }
  for (const c of headPair) nested.delete(c);
  const ends = /* @__PURE__ */ new Map();
  for (const c of comments) {
    if (nested.has(c)) continue;
    const m = (c.nodeValue ?? "").match(END_RE);
    if (m) ends.set(+m[2], c);
  }
  const headBlocks = [];
  const ownsHead = root === document.getElementById("app");
  let islandSkip = false;
  if (ownsHead) {
    const islandEls = Array.from(
      holder.querySelectorAll("[data-rv-island]")
    ).filter((el) => !(el.parentElement && el.parentElement.closest("[data-rv-island]")));
    islandSkip = islandEls.length > 0;
    for (const isl of islandEls) {
      const fire = () => wire(isl, closes, scope);
      const mode = isl.getAttribute("data-rv-island-hydrate");
      if (mode === "visible" && typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver((entries) => {
          if (entries.some((en) => en.isIntersecting)) {
            io.disconnect();
            pendingIslandObservers.delete(io);
            fire();
          }
        });
        io.observe(isl);
        pendingIslandObservers.add(io);
      } else if (mode === "idle" && typeof globalThis.requestIdleCallback === "function") {
        globalThis.requestIdleCallback(() => fire());
      } else {
        fire();
      }
    }
  }
  for (const c of comments) {
    if (nested.has(c) || wired.has(c) || !c.parentNode) continue;
    const m = (c.nodeValue ?? "").match(MARK_RE);
    if (!m) continue;
    const kind = m[1];
    const idx = +m[2];
    if (islandSkip && kind !== "h" && c.parentNode.closest?.("[data-rv-island]")) continue;
    if (kind === "h" && !ownsHead) continue;
    wired.add(c);
    if (kind === "h") {
      const end = ends.get(idx);
      if (!end) continue;
      const nodes = [];
      let n = c.nextSibling;
      while (n && n !== end) {
        const nx = n.nextSibling;
        nodes.push(n);
        n = nx;
      }
      headBlocks.push({ idx, start: c, end, nodes });
    } else if (kind === "m") {
      let target = c.nextSibling;
      if (!target || target.nodeType !== 3) {
        target = document.createTextNode("");
        c.parentNode.insertBefore(target, c.nextSibling);
      }
      const tn = target;
      const end = ends.get(idx);
      if (end) {
        let n = tn.nextSibling;
        while (n && n !== end) {
          const nx = n.nextSibling;
          n.remove();
          n = nx;
        }
      }
      weff(() => {
        tn.nodeValue = String(closes[idx](scope));
      });
    } else if (kind === "i") {
      const anchor = c;
      const end = ends.get(idx);
      if (!end) continue;
      const st = anchor;
      weff(() => {
        if (st.__st) {
          let n = anchor.nextSibling;
          while (n && n !== end) {
            const nx = n.nextSibling;
            n.remove();
            n = nx;
          }
          st.__st.disp();
          st.__st = void 0;
        }
        const r = closes[idx](scope);
        if (!r) {
          if (!st.__ever) {
            st.__ever = true;
            let n = anchor.nextSibling;
            while (n && n !== end) {
              const nx = n.nextSibling;
              n.remove();
              n = nx;
            }
          }
          return;
        }
        let frag;
        if (st.__ever) {
          frag = tpl(r.html);
        } else {
          st.__ever = true;
          frag = document.createDocumentFragment();
          let n = anchor.nextSibling;
          while (n && n !== end) {
            const nx = n.nextSibling;
            frag.appendChild(n);
            n = nx;
          }
        }
        const disp = wire(frag, r.closes, r.scope ?? scope);
        const nodes = Array.from(frag.childNodes);
        const parent = anchor.parentNode;
        for (const nd of nodes) parent.insertBefore(nd, end);
        st.__st = { nodes, disp };
      });
    } else {
      const start = c;
      const end = ends.get(idx);
      if (!end) continue;
      const st = start;
      weff(() => {
        if (st.__disp) {
          st.__disp();
          st.__disp = void 0;
        }
        const items = closes[idx](scope);
        const parent = start.parentNode;
        const keyed = items.length > 0 && items.every((r) => r.keyed);
        if (keyed) {
          const prev = st.__kmap ?? /* @__PURE__ */ new Map();
          const counts = /* @__PURE__ */ new Map();
          for (const r of items) counts.set(r.key, (counts.get(r.key) ?? 0) + 1);
          const keep = /* @__PURE__ */ new Set();
          const nextMap = /* @__PURE__ */ new Map();
          const used = /* @__PURE__ */ new Set();
          const decisions = [];
          for (const r of items) {
            const k = r.key;
            let keepRow;
            if (counts.get(k) === 1 && !used.has(k)) {
              const cand = prev.get(k);
              if (cand && normHtml(cand) === normHtml(r) && !EACH_REUSE_FORBID.test(r.html)) {
                keepRow = cand;
                used.add(k);
              }
            }
            decisions.push({ row: r, keepRow });
            if (keepRow) for (const nd of keepRow.nodes ?? []) keep.add(nd);
          }
          let n2 = start.nextSibling;
          while (n2 && n2 !== end) {
            const nx = n2.nextSibling;
            if (!keep.has(n2)) n2.remove();
            n2 = nx;
          }
          const disps2 = [];
          for (const d of decisions) {
            if (d.keepRow) {
              disps2.push(d.keepRow.disp);
              nextMap.set(d.row.key, d.keepRow);
              for (const nd of d.keepRow.nodes ?? []) parent.insertBefore(nd, end);
            } else {
              const frag = tpl(d.row.html);
              const disp = wire(frag, d.row.closes, d.row.scope);
              disps2.push(disp);
              const nodes = Array.from(frag.childNodes);
              for (const nd of nodes) parent.insertBefore(nd, end);
              if (counts.get(d.row.key) === 1) nextMap.set(d.row.key, { ...d.row, nodes, disp });
            }
          }
          st.__kmap = nextMap;
          st.__disp = () => disps2.forEach((d) => d());
          return;
        }
        st.__kmap = void 0;
        let n = start.nextSibling;
        while (n && n !== end) {
          const nx = n.nextSibling;
          n.remove();
          n = nx;
        }
        const disps = [];
        for (const r of items) {
          const frag = tpl(r.html);
          disps.push(wire(frag, r.closes, r.scope));
          for (const nd of Array.from(frag.childNodes)) parent.insertBefore(nd, end);
        }
        st.__disp = () => disps.forEach((d) => d());
      });
    }
  }
  if (root === document.getElementById("app")) {
    if (headBlocks.length > 0) {
      const blocks = headBlocks;
      weff(() => {
        let html = "";
        for (const b of blocks) html += String(closes[b.idx](scope));
        applyHead(html);
      });
      for (const b of blocks) {
        b.nodes.forEach((nd) => nd.remove());
        b.start.remove();
        b.end.remove();
      }
    } else if (root.nodeType !== 11) clearHead();
  }
  const all = holder.querySelectorAll("*");
  all.forEach((el) => {
    if (islandSkip && el.closest("[data-rv-island]")) return;
    for (const an of el.getAttributeNames()) {
      if (!an.startsWith("data-b")) continue;
      const idx = Number(an.slice(6));
      if (!Number.isFinite(idx)) continue;
      const attr = el.getAttribute(an);
      el.removeAttribute(an);
      const effect2 = () => String(closes[idx](scope));
      if (attr === "data-use-param") {
        weff(() => {
          const raw = effect2();
          let p = raw;
          try {
            p = JSON.parse(raw);
          } catch {
          }
          actionRecords.get(el)?.update?.(p);
        });
        continue;
      }
      if (attr === "value") {
        weff(() => {
          const v = effect2();
          const out = v == null ? "" : v;
          const inp = el;
          if (inp.value !== out) inp.value = out;
        });
      } else if (attr === "data-selmulti") {
        weff(() => {
          const vals = effect2().split(",");
          for (const o of Array.from(el.options)) {
            o.selected = vals.includes(o.value);
          }
        });
      } else if (attr.startsWith("!")) {
        const name = attr.slice(1);
        weff(() => {
          const v = closes[idx](scope);
          const live = !(v === false || v == null || v === "" || v === "false" || v === 0);
          const target = el;
          if (target[name] !== live) target[name] = live;
          if (live) el.setAttribute(name, "");
          else el.removeAttribute(name);
        });
      } else {
        weff(() => {
          const out = attrValueString(attr, closes[idx](scope));
          if (el.getAttribute(attr) !== out) el.setAttribute(attr, out);
        });
      }
    }
  });
  const uses = holder.querySelectorAll("[data-use]");
  uses.forEach((el) => {
    if (islandSkip && el.closest("[data-rv-island]")) return;
    const name = el.getAttribute("data-use");
    const fn = directives[name];
    if (!fn) return;
    const rawParam = el.getAttribute("data-use-param");
    let initial = rawParam ?? void 0;
    if (typeof initial === "string") {
      try {
        initial = JSON.parse(initial);
      } catch {
      }
    }
    const ret = fn(el, initial);
    if (typeof ret === "function") created.push(ret);
    else if (ret && typeof ret === "object") {
      actionRecords.set(el, { update: ret.update, destroy: ret.destroy });
      if (ret.destroy) created.push(ret.destroy);
    }
  });
  const refs = holder.querySelectorAll("[data-bind-this]");
  refs.forEach((el) => {
    if (islandSkip && el.closest("[data-rv-island]")) return;
    const key = el.getAttribute("data-bind-this");
    setState(key, el);
    created.push(() => setState(key, null));
  });
  const trans = holder.querySelectorAll("[data-transition]");
  if (trans.length > 0) {
    trans.forEach((el) => {
      if (islandSkip && el.closest("[data-rv-island]")) return;
      const transAttr = el.getAttribute("data-transition");
      const parts = transAttr.split("|");
      for (const part of parts) {
        const segs = part.split(":");
        const dir = segs[0] === "in" || segs[0] === "out" ? segs[0] : "";
        const name = (dir ? segs[1] : segs[0]) ?? "";
        const pstr = (dir ? segs.slice(2) : segs.slice(1)).join(":");
        const params = parseTransitionParams(pstr);
        const duration = params.duration != null ? Number(params.duration) : 300;
        if (dir === "out") {
          const pose2 = TRANSITION_POSES[name];
          if (pose2) {
            const parent = el.parentElement;
            const idx = parent ? Math.max(0, Array.from(parent.children).indexOf(el)) : 0;
            const vDelay = params.delay != null ? Number(params.delay) : null;
            const delay = name === "stagger" ? vDelay != null ? Math.max(0, vDelay) : idx * (duration / 10) : vDelay != null ? vDelay : 0;
            const easing = params.easing || "ease";
            created.push(() => {
              const parts2 = [pose2.transform ? `transform ${duration}ms ${easing} ${delay}ms` : "", pose2.filter ? `filter ${duration}ms ${easing} ${delay}ms` : "", `opacity ${duration}ms ${easing} ${delay}ms`].filter(Boolean);
              el.style.transition = parts2.join(", ");
              if (pose2.transform) el.style.transform = pose2.transform;
              if (pose2.filter) el.style.filter = pose2.filter;
              el.style.opacity = pose2.opacity;
              setTimeout(() => {
                el.style.transform = "";
                el.style.filter = "";
                el.style.opacity = "";
                el.style.transition = "";
              }, duration + delay);
            });
          } else {
            const custom = globalThis.__rosefdTransitions?.[name];
            if (custom) {
              const ret = custom(el, duration, "out");
              if (typeof ret === "function") created.push(ret);
            }
          }
          continue;
        }
        const exitStart = created.length;
        const pose = TRANSITION_POSES[name];
        if (pose) {
          const parent = el.parentElement;
          const idx = parent ? Math.max(0, Array.from(parent.children).indexOf(el)) : 0;
          const vDelay = params.delay != null ? Number(params.delay) : null;
          const delay = name === "stagger" ? vDelay != null ? Math.max(0, vDelay) : idx * (duration / 10) : vDelay != null ? vDelay : 0;
          const easing = params.easing || "ease";
          const cssParts = [];
          if (pose.transform) cssParts.push(`transform ${duration}ms ${easing} ${delay}ms`);
          if (pose.filter) cssParts.push(`filter ${duration}ms ${easing} ${delay}ms`);
          cssParts.push(`opacity ${duration}ms ${easing} ${delay}ms`);
          const tcss = cssParts.join(", ");
          el.style.opacity = "0";
          if (pose.transform) el.style.transform = pose.transform;
          if (pose.filter) el.style.filter = pose.filter;
          el.style.transition = tcss;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.filter = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.opacity = "0";
            if (pose.transform) el.style.transform = pose.transform;
            if (pose.filter) el.style.filter = pose.filter;
            setTimeout(() => {
              el.style.opacity = "";
              el.style.transform = "";
              el.style.filter = "";
              el.style.transition = "";
            }, duration + delay);
          });
        } else {
          const custom = globalThis.__rosefdTransitions?.[name];
          if (custom) {
            const ret = custom(el, duration, dir || "both");
            if (typeof ret === "function") created.push(ret);
          }
        }
        if (dir === "in") created.length = exitStart;
      }
    });
  }
  const anim = holder.querySelectorAll("[data-animate]");
  if (anim.length > 0) {
    anim.forEach((el) => {
      if (islandSkip && el.closest("[data-rv-island]")) return;
      const animAttr = el.getAttribute("data-animate");
      const parts = animAttr.split("|");
      for (const part of parts) {
        const [name] = part.split(":");
        const rest = part.slice(name.length + 1);
        const duration = Number((/(\d+)\s*\}?\s*$/.exec(rest) ?? [])[1]) || 300;
        if (name === "flip") {
          const firstRect = el.getBoundingClientRect();
          const firstTop = firstRect.top;
          const firstLeft = firstRect.left;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const lastRect = el.getBoundingClientRect();
              const deltaTop = lastRect.top - firstTop;
              const deltaLeft = lastRect.left - firstLeft;
              if (Math.abs(deltaTop) < 0.5 && Math.abs(deltaLeft) < 0.5) return;
              el.style.transform = `translate(${-deltaLeft}px, ${-deltaTop}px)`;
              el.style.transition = "none";
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.transition = `transform ${duration}ms ease`;
                  el.style.transform = "";
                });
              });
            });
          });
        } else if (name === "pulse") {
          el.style.transform = "scale(1)";
          el.style.transition = `transform ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "scale(1.1)";
              setTimeout(() => {
                el.style.transform = "scale(1)";
              }, duration);
            });
          });
        } else if (name === "bounce") {
          el.style.transform = "translateY(0)";
          el.style.transition = `transform ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "translateY(-15px)";
              setTimeout(() => {
                el.style.transform = "translateY(0)";
              }, duration);
            });
          });
        } else if (name === "shake") {
          el.style.transform = "translateX(0)";
          el.style.transition = `transform ${duration / 4}ms ease-in-out`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "translateX(-8px)";
              setTimeout(() => {
                el.style.transform = "translateX(8px)";
                setTimeout(() => {
                  el.style.transform = "translateX(-8px)";
                  setTimeout(() => {
                    el.style.transform = "translateX(8px)";
                    setTimeout(() => {
                      el.style.transform = "translateX(0)";
                      el.style.transition = "";
                    }, duration / 4);
                  }, duration / 4);
                }, duration / 4);
              }, duration / 4);
            }, duration / 4);
          });
        } else if (name === "scale") {
          el.style.transform = "scale(0.5)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "scale(0.5)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "rotate") {
          el.style.transform = "rotate(-180deg)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "rotate(-180deg)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "fade-in") {
          el.style.opacity = "0";
          el.style.transition = `opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "fade-out") {
          el.style.opacity = "1";
          el.style.transition = `opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = "0";
            });
          });
          created.push(() => {
            el.style.opacity = "1";
            setTimeout(() => {
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "stagger") {
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(el);
            const delay = index * (duration / 10);
            el.style.opacity = "0";
            el.style.transform = "translateY(10px)";
            el.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.style.opacity = "1";
                el.style.transform = "";
              });
            });
            created.push(() => {
              el.style.opacity = "0";
              el.style.transform = "translateY(10px)";
              setTimeout(() => {
                el.style.opacity = "";
                el.style.transform = "";
                el.style.transition = "";
              }, duration + delay);
            });
          }
        } else if (name === "zoom-in") {
          el.style.transform = "scale(0)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "scale(0)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "zoom-out") {
          el.style.transform = "scale(1)";
          el.style.opacity = "1";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "scale(0)";
              el.style.opacity = "0";
            });
          });
          created.push(() => {
            el.style.transform = "scale(1)";
            el.style.opacity = "1";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "slide-up-fade") {
          el.style.transform = "translateY(30px)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "translateY(30px)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "slide-down-fade") {
          el.style.transform = "translateY(-30px)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "translateY(-30px)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "flip-x") {
          el.style.transform = "rotateX(90deg)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "rotateX(90deg)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "flip-y") {
          el.style.transform = "rotateY(90deg)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "rotateY(90deg)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "spin") {
          el.style.transform = "rotate(-360deg)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "";
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.transform = "rotate(-360deg)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "pop") {
          el.style.transform = "scale(0.3)";
          el.style.opacity = "0";
          el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "scale(1.1)";
              setTimeout(() => {
                el.style.transform = "";
              }, duration / 3);
            });
          });
          created.push(() => {
            el.style.transform = "scale(0.3)";
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        } else if (name === "blink") {
          el.style.opacity = "0";
          el.style.transition = `opacity ${duration}ms ease`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = "1";
            });
          });
          created.push(() => {
            el.style.opacity = "0";
            setTimeout(() => {
              el.style.opacity = "";
              el.style.transition = "";
            }, duration);
          });
        }
      }
    });
  }
  const DELEGATED_SET = /* @__PURE__ */ new Set(["click", "input", "change", "submit"]);
  const evRoot = holder;
  const evTargets = [evRoot, ...Array.from(evRoot.querySelectorAll("*"))];
  for (const el of evTargets) {
    if (!el.getAttributeNames) continue;
    if (islandSkip && el.closest && el.closest("[data-rv-island]")) continue;
    for (const an of el.getAttributeNames()) {
      const mm = /^data-on(w|d)?-(.+)$/.exec(an);
      if (!mm) continue;
      const ev = mm[2];
      if (!mm[1] && DELEGATED_SET.has(ev)) continue;
      const g = globalThis;
      const win = g.window ?? g.document?.defaultView;
      const target = mm[1] === "w" ? win : mm[1] === "d" ? g.document : el;
      if (!target) continue;
      let seen = directBound.get(el);
      if (!seen) directBound.set(el, seen = /* @__PURE__ */ new Set());
      if (seen.has(ev)) continue;
      seen.add(ev);
      const spec = el.getAttribute(an);
      const listener = (e) => {
        if (!el.hasAttribute(an)) return;
        if (spec.startsWith("$action:")) {
          if (actionDispatchCell.value) actionDispatchCell.value(spec.slice("$action:".length), e);
          return;
        }
        const h = handlers[spec];
        if (h) h(e);
      };
      target.addEventListener(ev, listener, ev === "scroll" ? { passive: true } : void 0);
      created.push(() => {
        target.removeEventListener(ev, listener);
        const s = directBound.get(el);
        if (s) s.delete(ev);
      });
    }
  }
  if (holder !== root) {
    while (holder.firstChild) root.appendChild(holder.firstChild);
  }
  return () => created.forEach((fn) => fn());
}
function resetEffects() {
  cleanups.forEach((fn) => fn());
  cleanups.clear();
  pendingIslandObservers.forEach((io) => io.disconnect());
  pendingIslandObservers.clear();
}
function $data(fn) {
  const cache = renderMaps().data;
  const key = fn.toString();
  let p = cache.get(key);
  if (!p) {
    p = Promise.resolve(fn());
    cache.set(key, p);
  }
  return p;
}
var bffCache = shared("__rosefd_bffCache", () => /* @__PURE__ */ new Map());
function loader(key, fn) {
  let p = bffCache.get(key);
  if (!p) {
    p = fn().catch((e) => {
      bffCache.delete(key);
      throw e;
    });
    bffCache.set(key, p);
  }
  return p;
}
async function aggregate(loaders) {
  const keys = Object.keys(loaders);
  const results = await Promise.all(keys.map((k) => loaders[k]()));
  const out = {};
  keys.forEach((k, i) => {
    out[k] = results[i];
  });
  return out;
}
function clearRequestState() {
  renderMaps().signals.clear();
  renderMaps().data.clear();
  pendingDeltas.clear();
  renderMaps().seeded.clear();
  bffCache.clear();
}
async function isolateRender(fn) {
  if (contextStore) {
    const maps = renderMaps();
    const savedSignals = maps.signals;
    const savedSeeded = maps.seeded;
    maps.signals = /* @__PURE__ */ new Map();
    maps.seeded = /* @__PURE__ */ new Set();
    maps.data.clear();
    try {
      return await fn();
    } finally {
      maps.signals = savedSignals;
      maps.seeded = savedSeeded;
    }
  }
  const prev = renderMutexCell.value;
  let release;
  renderMutexCell.value = new Promise((r) => {
    release = r;
  });
  await prev;
  try {
    const maps = renderMaps();
    const savedSignals = maps.signals;
    const savedSeeded = maps.seeded;
    maps.signals = /* @__PURE__ */ new Map();
    maps.seeded = /* @__PURE__ */ new Set();
    maps.data.clear();
    try {
      return await fn();
    } finally {
      maps.signals = savedSignals;
      maps.seeded = savedSeeded;
    }
  } finally {
    release();
  }
}
var renderMutexCell = sharedCell("__rosefd_renderMutex", Promise.resolve());
var requestQuery = {};
var prefetchOverride = null;
function $query() {
  if (prefetchOverride) return prefetchOverride;
  if (typeof location === "undefined") return requestQuery;
  const q = {};
  new URLSearchParams(location.search).forEach((v, k) => {
    q[k] = v;
  });
  return q;
}
function setRequestQuery(q) {
  requestQuery = q;
}
function getRequestQuery() {
  return requestQuery;
}
function setPrefetchOverride(q) {
  prefetchOverride = q;
}
var requestContext = {};
var contextStore = null;
var RENDER_MAPS = Symbol("renderMaps");
var fallbackRenderMaps = shared("__rosefd_fallbackRenderMaps", () => ({ data: /* @__PURE__ */ new Map(), signals: signalMap, seeded: seededKeys }));
function renderMaps() {
  const scoped = contextStore?.getStore();
  if (!scoped) return fallbackRenderMaps;
  let m = scoped[RENDER_MAPS];
  if (!m) {
    m = { data: /* @__PURE__ */ new Map(), signals: /* @__PURE__ */ new Map(), seeded: /* @__PURE__ */ new Set() };
    scoped[RENDER_MAPS] = m;
  }
  return m;
}
function installContextStore(store) {
  contextStore = store;
}
function getContext() {
  const scoped = contextStore?.getStore();
  return scoped ?? requestContext;
}
function resetRequestContext() {
  if (contextStore) {
    const scoped = contextStore.getStore();
    if (scoped) {
      for (const k of Object.keys(scoped)) delete scoped[k];
      return;
    }
  }
  requestContext = {};
}
function runWithContext(fn) {
  if (contextStore) return contextStore.run({}, fn);
  const saved = requestContext;
  requestContext = {};
  try {
    return fn();
  } finally {
    requestContext = saved;
  }
}
async function isolateStateAsync(fn) {
  const maps = renderMaps();
  const savedSignals = maps.signals;
  const savedSeeded = maps.seeded;
  const savedDeltas = new Map(pendingDeltas);
  pendingDeltas.clear();
  const savedMounts = mountQueue.splice(0, mountQueue.length);
  const savedCleanups = new Set(cleanups);
  cleanups.clear();
  maps.signals = /* @__PURE__ */ new Map();
  maps.seeded = /* @__PURE__ */ new Set();
  maps.data.clear();
  try {
    const result = await fn();
    return {
      result,
      state: maps.signals,
      mounts: mountQueue.splice(0, mountQueue.length),
      cleanups: new Set(cleanups)
    };
  } finally {
    maps.signals = savedSignals;
    maps.seeded = savedSeeded;
    pendingDeltas.clear();
    savedDeltas.forEach((d, k) => pendingDeltas.set(k, d));
    mountQueue.splice(0, 0, ...savedMounts);
    cleanups.clear();
    savedCleanups.forEach((fn2) => cleanups.add(fn2));
  }
}
function restoreState(entries) {
  const map = renderMaps().signals;
  map.clear();
  entries.forEach((e, k) => map.set(k, e));
}
function serializeState() {
  const obj = {};
  renderMaps().signals.forEach((v, k) => {
    obj[k] = v.value;
  });
  return JSON.stringify(obj);
}
function resumeState(json) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      const [keys, values] = parsed;
      for (let i = 0; i < keys.length; i++) {
        entry(keys[i], values[i]).value = values[i];
        renderMaps().seeded.add(keys[i]);
      }
    } else if (parsed && typeof parsed === "object") {
      Object.entries(parsed).forEach(([k, v]) => {
        entry(k, v).value = v;
        renderMaps().seeded.add(k);
      });
    }
  } catch {
  }
}
var SDUI_TAGS = ["div", "span", "a", "p", "img", "ul", "li", "button", "input", "section", "h1", "h2", "h3", "nav", "header", "footer", "form", "label", "strong", "em", "table", "tr", "td", "code", "pre", "article", "main", "aside"];
var sduiTagToId = shared("__rosefd_sduiTagToId", () => new Map(SDUI_TAGS.map((t, i) => [t, i])));
var sduiIdToTag = shared("__rosefd_sduiIdToTag", () => new Map(SDUI_TAGS.map((t, i) => [i, t])));
function encodeSdui(node) {
  const enc = (n) => [
    sduiTagToId.get(n.t) ?? n.t,
    n.p ?? {},
    (n.c ?? []).map(enc)
  ];
  return JSON.stringify(enc(node));
}
function decodeSdui(json) {
  const dec = (a) => {
    const arr = a;
    const raw = arr[0];
    const t = typeof raw === "number" ? sduiIdToTag.get(raw) ?? String(raw) : String(raw);
    return { t, p: arr[1], c: (arr[2] ?? []).map(dec) };
  };
  return dec(JSON.parse(json));
}
var refreshHookCell = sharedCell("__rosefd_refreshHook", null);
function setRefreshHook(fn) {
  refreshHookCell.value = fn;
}
function refresh() {
  const hook = refreshHookCell.value;
  return hook ? hook() : Promise.resolve();
}
var mountQueue = shared("__rosefd_mountQueue", () => []);
function onMount(fn) {
  if (typeof document === "undefined") return;
  mountQueue.push(fn);
}
function clearMounts() {
  mountQueue.length = 0;
}
function flushMounts() {
  const q = mountQueue.splice(0, mountQueue.length);
  for (const fn of q) fn();
}
function onCleanup(fn) {
  fxSet().add(fn);
}
function adoptCleanups(fns) {
  for (const fn of fns) cleanups.add(fn);
}
var localeCell = sharedCell("__rosefd_localeCell", { dicts: {}, def: "en", packs: [] });
function setLocales(dicts, def) {
  const c = localeCell.value;
  c.dicts = { ...c.dicts, ...dicts };
  if (def) c.def = def;
}
function setLocalePacks(langs) {
  const c = localeCell.value;
  for (const l of langs) if (!c.packs.includes(l)) c.packs.push(l);
}
function loadLocale(lang, dict) {
  const c = localeCell.value;
  c.dicts[lang] = { ...c.dicts[lang], ...dict };
}
async function ensureLocale(lang) {
  const c = localeCell.value;
  if (c.dicts[lang] || !c.packs.includes(lang)) return;
  try {
    const res = await fetch(`/locales/${encodeURIComponent(lang)}.json`);
    if (res.ok) loadLocale(lang, await res.json());
  } catch {
  }
}
function localeList() {
  return Object.keys(localeCell.value.dicts);
}
function isLocale(lang) {
  const c = localeCell.value;
  return Object.hasOwn(c.dicts, lang) || c.packs.includes(lang);
}
function bestLocale(header) {
  for (const part of (header || "").split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (!tag || tag === "*") continue;
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
var RoseRedirect = class extends Error {
  constructor(path, status = 307) {
    super(`redirect to ${path}`);
    this.path = path;
    this.status = status;
  }
  __rosefd = "redirect";
};
var RoseNotFound = class extends Error {
  __rosefd = "notFound";
  constructor() {
    super("notFound()");
  }
};
function redirect(path, status = 307) {
  throw new RoseRedirect(path, status);
}
function notFound() {
  throw new RoseNotFound();
}
var RTL_RE = /^(ar|fa|he|ur|ps|sd|ug|yi|ckb|dv|ks|prs|haz|mzn|nqo)/;
function localeDir(lang) {
  return RTL_RE.test(lang) ? "rtl" : "";
}
var ICU_RE = /\{([\w$]+),\s*(plural|selectordinal|select),\s*((?:\s*[=\w]+\s*\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g;
var BRANCH_RE = /([=\w]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g;
var PLURAL_RULES = shared("__rosefd_pluralRules", () => /* @__PURE__ */ new Map());
function pluralCategory(locale, ordinal, n) {
  try {
    const key = ordinal ? locale + "\0ord" : locale;
    let rules = PLURAL_RULES.get(key);
    if (!rules) {
      rules = new Intl.PluralRules(locale, ordinal ? { type: "ordinal" } : void 0);
      PLURAL_RULES.set(key, rules);
    }
    return rules.select(n);
  } catch {
    return null;
  }
}
function expandIcu(msg, vars, locale) {
  return msg.replace(ICU_RE, (whole, arg, kind, branchText) => {
    const branches = {};
    for (const m of branchText.matchAll(BRANCH_RE)) branches[m[1]] = m[2];
    if (!branches.other) return whole;
    const v = vars?.[arg];
    if (kind === "select") return branches[typeof v === "string" && branches[v] ? v : "other"];
    const num = typeof v === "number" ? v : Number(v);
    const cat = isFinite(num) ? branches["=" + num] ? "=" + num : pluralCategory(locale, kind === "selectordinal", num) ?? "other" : "other";
    return (branches[cat] ?? branches.other).replace(/#/g, String(v));
  });
}
function $t(key, vars) {
  const c = localeCell.value;
  const [lang] = state("lang", c.def);
  const dict = c.dicts[lang()] ?? c.dicts[c.def] ?? {};
  const msg = dict[key];
  let out = expandIcu(typeof msg === "string" ? msg : key, vars, lang());
  if (vars) for (const k in vars) out = out.split(`{${k}}`).join(String(vars[k]));
  return out;
}
var STORES = shared("__rosefd_stores", () => /* @__PURE__ */ new Map());
var storeTransportCell = sharedCell("__rosefd_storeTransport", null);
function notifyStoreSubs(box) {
  if (box.subs.size === 0) return;
  const prevEffect = currentEffect;
  const prevTracking = trackingDeps;
  currentEffect = null;
  trackingDeps = null;
  for (const fn of [...box.subs]) fn();
  currentEffect = prevEffect;
  trackingDeps = prevTracking;
}
function setStoreTransport(fn) {
  storeTransportCell.value = fn;
}
function applyStorePatch(name, value) {
  const entry2 = STORES.get(name);
  if (!entry2) return;
  entry2.value = value;
  notifyStoreSubs(entry2);
}
function $store(name, initial) {
  let entry2 = STORES.get(name);
  if (!entry2) {
    entry2 = { value: initial, subs: /* @__PURE__ */ new Set() };
    STORES.set(name, entry2);
  }
  const box = entry2;
  return {
    get: () => {
      if (currentEffect) {
        box.subs.add(currentEffect);
        if (trackingDeps) trackingDeps.add(box);
      }
      return box.value;
    },
    set: (v) => {
      box.value = v;
      notifyStoreSubs(box);
      storeTransportCell.value?.(name, v);
    },
    update: (fn) => {
      box.value = fn(box.value);
      notifyStoreSubs(box);
      storeTransportCell.value?.(name, box.value);
    }
  };
}
var __netSpecs = globalThis.__rosefd_netSpecs || (globalThis.__rosefd_netSpecs = []);
var __netHandles = globalThis.__rosefd_netHandles || (globalThis.__rosefd_netHandles = []);
var __netBound = globalThis.__rosefd_netBound || (globalThis.__rosefd_netBound = /* @__PURE__ */ new Map());
function __netBind(spec) {
  const key = spec.kind + ":" + spec.port + ":" + (spec.host || "");
  const prev = __netBound.get(key);
  if (prev) {
    prev.opts = spec.opts || {};
    return;
  }
  const o = spec.opts || {};
  if (spec.kind === "udp") {
    const dg = globalThis.__rosefd_dgram;
    if (!dg) return;
    const handle = { opts: o, sock: null };
    const sock = dg.createSocket("udp4");
    handle.sock = sock;
    sock.on("message", (msg, rinfo) => handle.opts.onMessage?.(msg, rinfo));
    sock.on("error", (err) => {
      if (handle.opts.onError) handle.opts.onError(err);
      else console.error("[rosefd] UDP error:", err);
    });
    sock.bind(spec.port, spec.host || "0.0.0.0");
    __netHandles.push(sock);
    __netBound.set(key, handle);
  } else if (spec.kind === "tcp") {
    const nt = globalThis.__rosefd_net;
    if (!nt) return;
    const handle = { opts: o, srv: null };
    const idleMs = (o.idleTimeout ?? 0) * 1e3;
    const srv = nt.createServer((socket) => {
      handle.opts.onConnection?.(socket);
      if (idleMs > 0) {
        socket.setTimeout(idleMs);
        socket.on("timeout", () => {
          handle.opts.onIdle?.(socket);
          socket.destroy();
        });
      }
      socket.on("data", (data) => {
        if (idleMs > 0) socket.setTimeout(idleMs);
        handle.opts.onData?.(socket, data);
      });
      socket.on("error", () => {
      });
    });
    handle.srv = srv;
    srv.on("error", (err) => console.error("[rosefd] TCP server error:", err));
    srv.listen(spec.port, spec.host || "0.0.0.0");
    __netHandles.push(srv);
    __netBound.set(key, handle);
  } else if (spec.kind === "ws") {
    const http = globalThis.__rosefd_http;
    const cryptoMod = globalThis.__rosefd_crypto;
    if (!http || !cryptoMod) return;
    const clients = /* @__PURE__ */ new Set();
    const handle = {
      opts: o,
      clients: () => Array.from(clients),
      broadcast: (data) => {
        for (const c of clients) c.send(data);
      },
      close: () => {
        for (const c of Array.from(clients)) c.close();
        if (handle.__pingTimer) {
          clearInterval(handle.__pingTimer);
          handle.__pingTimer = null;
        }
        try {
          srv.close();
        } catch {
        }
      },
      __pingTimer: null
    };
    const srv = http.createServer((_req, res) => {
      res.writeHead(426, { "content-type": "text/plain" });
      res.end("Upgrade Required");
    });
    srv.on("upgrade", (req, socket) => {
      const opts = handle.opts;
      if (String(req.headers.upgrade || "").toLowerCase() !== "websocket" || !req.headers["sec-websocket-key"]) {
        socket.destroy();
        return;
      }
      const path = String(req.url || "/").split("?")[0];
      if (opts.path && path !== opts.path) {
        socket.destroy();
        return;
      }
      const accept = cryptoMod.createHash("sha1").update(String(req.headers["sec-websocket-key"]) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
      try {
        socket.write("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + accept + "\r\n\r\n");
      } catch {
        socket.destroy();
        return;
      }
      socket.setNoDelay(true);
      socket.setTimeout(0);
      const wrapped = __wsWrap(socket, clients, handle);
      clients.add(wrapped);
      opts.onConnection?.(wrapped);
    });
    srv.on("error", (err) => {
      if (handle.opts.onError) handle.opts.onError(err);
      else console.error("[rosefd] WebSocket server error:", err);
    });
    srv.listen(spec.port, spec.host || "0.0.0.0");
    const pingInterval = o.pingInterval ?? 30;
    if (pingInterval > 0) {
      handle.__pingTimer = setInterval(() => {
        for (const c of Array.from(clients)) {
          const sock = c.__sock;
          if (!sock || sock.destroyed) {
            clients.delete(c);
            continue;
          }
          if (c.__alive === false) {
            try {
              sock.destroy();
            } catch {
            }
            clients.delete(c);
            continue;
          }
          c.__alive = false;
          try {
            sock.write(__wsEncodeFrame(9, Buffer.alloc(0)));
          } catch {
          }
        }
      }, Math.max(1e3, pingInterval * 1e3));
    }
    __netHandles.push(handle);
    __netBound.set(key, handle);
  } else if (spec.kind === "mqtt") {
    const nt = globalThis.__rosefd_net;
    if (!nt) return;
    const client = __mqttConnect(nt, spec.port, spec.host || "localhost", o);
    __netHandles.push(client);
    __netBound.set(key, client);
  }
}
function __netReg(kind, port, host, opts) {
  const spec = { kind, port, host, opts };
  __netSpecs.push(spec);
  if (globalThis.__rosefd_netStarted === true) __netBind(spec);
}
function __netUnreg(kind, port, host) {
  const key = kind + ":" + port + ":" + (host || "");
  const h = __netBound.get(key);
  if (h) {
    const live = h;
    try {
      (live.close || live.sock?.close || live.srv?.close)?.call(live);
    } catch {
    }
    __netBound.delete(key);
  }
  for (let i = __netSpecs.length - 1; i >= 0; i--) {
    const s = __netSpecs[i];
    if (s.kind === kind && s.port === port && (s.host || "") === (host || "")) __netSpecs.splice(i, 1);
  }
}
function __startNetwork() {
  globalThis.__rosefd_netStarted = true;
  for (const spec of __netSpecs) __netBind(spec);
}
function __stopNetwork() {
  for (const h of __netHandles) {
    const live = h;
    try {
      live.close?.();
    } catch {
    }
  }
  __netHandles.length = 0;
  __netBound.clear();
}
function __wsParseFrames(buf) {
  const frames = [];
  let off = 0;
  while (off + 2 <= buf.length) {
    const b0 = buf[off];
    const b1 = buf[off + 1];
    const fin = (b0 & 128) !== 0;
    const opcode = b0 & 15;
    const masked = (b1 & 128) !== 0;
    let len = b1 & 127;
    let p = off + 2;
    if (len === 126) {
      if (off + 4 > buf.length) break;
      len = buf.readUInt16BE(p);
      p += 2;
    } else if (len === 127) {
      if (off + 10 > buf.length) break;
      len = buf.readUInt32BE(p) * 4294967296 + buf.readUInt32BE(p + 4);
      p += 8;
    }
    const maskLen = masked ? 4 : 0;
    if (p + maskLen + len > buf.length) break;
    let payload = buf.slice(p + maskLen, p + maskLen + len);
    if (masked) {
      const mask = buf.slice(p, p + 4);
      const out = Buffer.allocUnsafe(len);
      for (let i = 0; i < len; i++) out[i] = payload[i] ^ mask[i & 3];
      payload = out;
    }
    frames.push({ fin, opcode, payload });
    off = p + maskLen + len;
  }
  return { frames, rest: off > 0 ? buf.slice(off) : buf };
}
function __wsEncodeFrame(opcode, payload) {
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([128 | opcode, len]);
  } else if (len < 65536) {
    header = Buffer.allocUnsafe(4);
    header[0] = 128 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.allocUnsafe(10);
    header[0] = 128 | opcode;
    header[1] = 127;
    header.writeUInt32BE(0, 2);
    header.writeUInt32BE(len, 6);
  }
  return Buffer.concat([header, payload]);
}
function __wsWrap(socket, clients, handle) {
  const listeners = {};
  const emit = (ev, arg) => {
    for (const fn of listeners[ev] || []) fn(arg);
  };
  let msgOpcode = 0;
  let parts = [];
  const wrapped = {
    __sock: socket,
    __alive: true,
    // flipped false by each keepalive ping; any inbound frame (pong or data) proves the peer is there
    remoteAddress: socket.remoteAddress,
    send: (data) => {
      if (socket.destroyed) return;
      let opcode = 1;
      let payload;
      if (typeof data === "string") {
        opcode = 1;
        payload = Buffer.from(data, "utf8");
      } else if (Buffer.isBuffer(data)) {
        opcode = 2;
        payload = data;
      } else {
        opcode = 1;
        payload = Buffer.from(String(data), "utf8");
      }
      socket.write(__wsEncodeFrame(opcode, payload));
    },
    close: () => {
      if (socket.destroyed) return;
      try {
        socket.write(__wsEncodeFrame(8, Buffer.from([3, 232])));
      } catch {
      }
      socket.end();
    },
    on: (ev, fn) => {
      (listeners[ev] || (listeners[ev] = [])).push(fn);
    }
  };
  socket.__wsBuf = Buffer.alloc(0);
  socket.on("data", (chunk) => {
    const sock = socket;
    sock.__wsBuf = sock.__wsBuf.length ? Buffer.concat([sock.__wsBuf, chunk]) : chunk;
    const { frames, rest } = __wsParseFrames(sock.__wsBuf);
    sock.__wsBuf = rest;
    for (const f of frames) {
      if (f.opcode === 8) {
        wrapped.close();
      } else if (f.opcode === 9) {
        wrapped.__alive = true;
        try {
          socket.write(__wsEncodeFrame(10, f.payload));
        } catch {
        }
      } else if (f.opcode === 10) {
        wrapped.__alive = true;
      } else if (f.opcode === 1 || f.opcode === 2) {
        wrapped.__alive = true;
        if (msgOpcode !== 0) {
          socket.destroy();
          return;
        }
        msgOpcode = f.opcode;
        parts = [f.payload];
        if (f.fin) {
          const msg = Buffer.concat(parts);
          const op = msgOpcode;
          msgOpcode = 0;
          parts = [];
          emit("message", op === 1 ? msg.toString("utf8") : msg);
          handle.opts.onMessage?.(wrapped, op === 1 ? msg.toString("utf8") : msg);
        }
      } else if (f.opcode === 0) {
        if (msgOpcode === 0) {
          socket.destroy();
          return;
        }
        parts.push(f.payload);
        if (f.fin) {
          const msg = Buffer.concat(parts);
          const op = msgOpcode;
          msgOpcode = 0;
          parts = [];
          emit("message", op === 1 ? msg.toString("utf8") : msg);
          handle.opts.onMessage?.(wrapped, op === 1 ? msg.toString("utf8") : msg);
        }
      }
    }
  });
  socket.on("close", () => {
    clients.delete(wrapped);
    emit("close", null);
    handle.opts.onClose?.(wrapped);
  });
  socket.on("error", (e) => emit("error", e));
  return wrapped;
}
var __NOOP_NET = {
  send: () => {
  },
  close: () => {
  },
  write: () => {
  },
  end: () => {
  },
  destroy: () => {
  },
  on: () => {
  },
  joinMulticast: () => {
  },
  leaveMulticast: () => {
  },
  address: () => ({ port: 0, host: "localhost", family: "IPv4" })
};
var __NOOP_WS = (port, host) => ({
  close: () => {
  },
  clients: () => [],
  broadcast: () => {
  },
  address: () => ({ port, host: host || "0.0.0.0" })
});
function $udp(port, opts = {}) {
  if (typeof document === "undefined") __netReg("udp", port, opts.host, opts);
  return { ...__NOOP_NET, address: () => ({ port, host: opts.host || "0.0.0.0", family: "IPv4" }) };
}
function $tcp(portOrHost, opts = {}) {
  if (typeof document !== "undefined") return { ...__NOOP_NET };
  const isServer = typeof portOrHost === "number" || opts.onConnection !== void 0 || opts.port !== void 0 && opts.host !== void 0 && opts.onConnect === void 0;
  if (isServer) {
    const port = typeof portOrHost === "number" ? portOrHost : opts.port;
    __netReg("tcp", port, opts.host, opts);
    return { ...__NOOP_NET, address: () => ({ port, host: opts.host || "0.0.0.0" }) };
  }
  const nt = globalThis.__rosefd_net;
  if (!nt) return { ...__NOOP_NET };
  const host = typeof portOrHost === "string" ? portOrHost : opts.host;
  const sock = nt.createConnection({ host, port: opts.port });
  sock.on("connect", () => opts.onConnect?.());
  sock.on("data", (d) => opts.onData?.(sock, d));
  sock.on("close", () => opts.onClose?.());
  sock.on("error", (e) => opts.onError?.(e));
  __netHandles.push(sock);
  return sock;
}
function $listen(port, opts = {}) {
  if (typeof document !== "undefined") return { ...__NOOP_NET, address: () => ({ port, host: opts.host || "localhost" }) };
  const protocol = opts.protocol || "http";
  if (protocol === "udp") $udp(port, { host: opts.host, onMessage: opts.onData, onError: opts.onError });
  else if (protocol === "tcp") $tcp(port, { host: opts.host, onConnection: opts.onConnection, onData: opts.onData });
  else if (protocol === "websocket") $websocket(port, { host: opts.host, path: opts.path, onConnection: opts.onConnection });
  return { close: () => {
  }, address: () => ({ port, host: opts.host || "0.0.0.0" }) };
}
function $websocket(port, opts = {}) {
  const host = opts.host;
  if (typeof document !== "undefined") return __NOOP_WS(port, host);
  __netReg("ws", port, host, opts);
  return {
    close: () => __netUnreg("ws", port, host),
    clients: () => {
      const h = __netBound.get("ws:" + port + ":" + (host || ""));
      return h ? h.clients() : [];
    },
    broadcast: (data) => {
      const h = __netBound.get("ws:" + port + ":" + (host || ""));
      if (h) h.broadcast(data);
    },
    address: () => ({ port, host: host || "0.0.0.0" })
  };
}
function $mqtt(broker, opts = {}) {
  const host = opts.host || __mqttHostOf(broker);
  const port = opts.port ?? __mqttPortOf(broker);
  if (typeof document !== "undefined") return __NOOP_MQTT;
  __netReg("mqtt", port, host, opts);
  const key = "mqtt:" + port + ":" + host;
  const bound = () => __netBound.get(key);
  return {
    connect: () => {
      const h = bound();
      if (h) return h.connect();
      __netBind({ kind: "mqtt", port, host, opts });
      const h2 = bound();
      return h2 ? h2.connect() : Promise.reject(new Error("[rosefd] MQTT client unavailable (node:net not injected)"));
    },
    disconnect: () => {
      bound()?.disconnect?.();
    },
    subscribe: (topic, sopts = {}) => {
      bound()?.subscribe?.(topic, sopts);
    },
    unsubscribe: (topic) => {
      bound()?.unsubscribe?.(topic);
    },
    publish: (topic, message, popts = {}) => {
      bound()?.publish?.(topic, message, popts);
    },
    get connected() {
      return bound()?.connected === true;
    }
  };
}
var __NOOP_MQTT = {
  connect: () => Promise.resolve(),
  disconnect: () => {
  },
  subscribe: () => {
  },
  unsubscribe: () => {
  },
  publish: () => {
  },
  connected: false
};
function __mqttHostOf(broker) {
  return String(broker).replace(/^\w+:\/\//, "").split(":")[0] || "localhost";
}
function __mqttPortOf(broker) {
  const m = String(broker).match(/:(\d+)/);
  return m ? Number(m[1]) : 1883;
}
function __mqttStr(s) {
  const b = Buffer.from(s, "utf8");
  const out = Buffer.allocUnsafe(2 + b.length);
  out.writeUInt16BE(b.length, 0);
  b.copy(out, 2);
  return out;
}
function __mqttRemainingLen(len) {
  const out = [];
  do {
    let b = len % 128;
    len = Math.floor(len / 128);
    if (len > 0) b |= 128;
    out.push(b);
  } while (len > 0);
  return Buffer.from(out);
}
function __mqttPacket(type, flags, body) {
  return Buffer.concat([Buffer.from([type << 4 | flags]), __mqttRemainingLen(body.length), body]);
}
function __mqttParsePackets(buf) {
  const packets = [];
  let off = 0;
  for (; ; ) {
    if (off >= buf.length) break;
    const type = buf[off] >> 4 & 15;
    const flags = buf[off] & 15;
    let mult = 1;
    let len = 0;
    let p = off + 1;
    for (; ; ) {
      if (p >= buf.length) return { packets, rest: buf.slice(off) };
      const b = buf[p++];
      len += (b & 127) * mult;
      if ((b & 128) === 0) break;
      mult *= 128;
    }
    if (p + len > buf.length) return { packets, rest: buf.slice(off) };
    packets.push({ type, flags, body: buf.slice(p, p + len) });
    off = p + len;
  }
  return { packets, rest: Buffer.alloc(0) };
}
function __mqttTopicMatch(filter, topic) {
  const f = filter.split("/");
  const t = topic.split("/");
  for (let i = 0; i < f.length; i++) {
    if (f[i] === "#") return true;
    if (i >= t.length) return false;
    if (f[i] === "+") continue;
    if (f[i] !== t[i]) return false;
  }
  return f.length === t.length;
}
function __mqttU16(id) {
  const b = Buffer.allocUnsafe(2);
  b.writeUInt16BE(id & 65535, 0);
  return b;
}
function __mqttConnect(nt, port, host, o) {
  const client = {
    opts: o,
    connected: false,
    subs: /* @__PURE__ */ new Map(),
    outbox: [],
    nextId: 1,
    connAck: null,
    __keepalive: null,
    __sock: null,
    __closed: false,
    __retry: null,
    __attempt: 0,
    __send: (buf) => {
      const s = client.__sock;
      if (client.connected && s && !s.destroyed) {
        try {
          s.write(buf);
        } catch {
        }
      } else client.outbox.push(buf);
    },
    connect: () => {
      if (client.connected) return Promise.resolve();
      if (client.__closed) {
        client.__closed = false;
        dial();
        return client.connAck;
      }
      const s = client.__sock;
      if (!s || s.destroyed) {
        if (client.__retry) {
          clearTimeout(client.__retry);
          client.__retry = null;
        }
        dial();
      }
      return client.connAck;
    },
    close: () => client.disconnect(),
    disconnect: () => {
      client.__closed = true;
      if (client.__retry) {
        clearTimeout(client.__retry);
        client.__retry = null;
      }
      try {
        client.__sock?.write(__mqttPacket(14, 0, Buffer.alloc(0)));
      } catch {
      }
      try {
        client.__sock?.end();
      } catch {
      }
    },
    subscribe: (topic, sopts = {}) => {
      client.subs.set(topic, sopts.qos || 0);
      client.__send(__mqttPacket(8, 2, Buffer.concat([__mqttU16(client.nextId++), __mqttStr(topic), Buffer.from([sopts.qos || 0])])));
    },
    unsubscribe: (topic) => {
      client.subs.delete(topic);
      client.__send(__mqttPacket(10, 2, Buffer.concat([__mqttU16(client.nextId++), __mqttStr(topic)])));
    },
    publish: (topic, message, popts = {}) => {
      const qos = popts.qos || 0;
      let head = __mqttStr(topic);
      if (qos > 0) head = Buffer.concat([head, __mqttU16(client.nextId++)]);
      const payload = typeof message === "string" ? Buffer.from(message, "utf8") : Buffer.isBuffer(message) ? message : Buffer.from(String(message), "utf8");
      client.__send(__mqttPacket(3, qos << 1 | (popts.retain ? 1 : 0), Buffer.concat([head, payload])));
    }
  };
  const scheduleReconnect = () => {
    if (client.__closed || client.__retry) return;
    if (client.opts.reconnect === false) return;
    const base = client.opts.reconnectDelay ?? 500;
    const cap = client.opts.reconnectMax ?? 3e4;
    const delay = Math.min(base * 2 ** client.__attempt, cap);
    client.__attempt++;
    client.__retry = setTimeout(() => {
      client.__retry = null;
      dial();
    }, delay);
  };
  const dial = () => {
    if (client.__closed) return;
    let resolveAck = () => {
    };
    let rejectAck = () => {
    };
    client.connAck = new Promise((res, rej) => {
      resolveAck = res;
      rejectAck = rej;
    });
    client.connAck.catch(() => {
    });
    const s = nt.createConnection({ host, port });
    client.__sock = s;
    s.__mqttBuf = Buffer.alloc(0);
    s.on("connect", () => {
      const opts = client.opts;
      let flags = opts.clean !== false ? 2 : 0;
      const username = opts.username;
      const password = opts.password;
      if (username) flags |= 128;
      if (password) flags |= 64;
      const parts = [__mqttStr("MQTT"), Buffer.from([4]), Buffer.from([flags]), __mqttU16(opts.keepalive ?? 60), __mqttStr(opts.clientId || "rosefd_" + Math.random().toString(16).slice(2, 10))];
      if (username) parts.push(__mqttStr(username));
      if (password) parts.push(__mqttStr(password));
      s.write(__mqttPacket(1, 0, Buffer.concat(parts)));
      if (client.__keepalive) {
        clearInterval(client.__keepalive);
        client.__keepalive = null;
      }
      const ka = opts.keepalive ?? 60;
      if (ka > 0) client.__keepalive = setInterval(() => {
        try {
          s.write(__mqttPacket(12, 0, Buffer.alloc(0)));
        } catch {
        }
      }, Math.max(250, ka * 500));
    });
    s.on("data", (chunk) => {
      const buf = s.__mqttBuf;
      s.__mqttBuf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
      const { packets, rest } = __mqttParsePackets(s.__mqttBuf);
      s.__mqttBuf = rest;
      for (const pkt of packets) {
        if (pkt.type === 2) {
          if (pkt.body.length >= 2 && pkt.body[1] === 0) {
            client.connected = true;
            client.__attempt = 0;
            for (const q of client.outbox) {
              try {
                s.write(q);
              } catch {
              }
            }
            client.outbox.length = 0;
            for (const [topic, qos] of client.subs) {
              try {
                s.write(__mqttPacket(8, 2, Buffer.concat([__mqttU16(client.nextId++), __mqttStr(topic), Buffer.from([qos])])));
              } catch {
              }
            }
            resolveAck();
            client.opts.onConnect?.();
          } else {
            const err = new Error("[rosefd] MQTT broker refused the connection (code " + (pkt.body[1] ?? "?") + ")");
            rejectAck(err);
            client.opts.onError?.(err);
          }
        } else if (pkt.type === 3) {
          if (pkt.body.length < 2) continue;
          const tlen = pkt.body.readUInt16BE(0);
          const topic = pkt.body.slice(2, 2 + tlen).toString("utf8");
          let p = 2 + tlen;
          const qos = pkt.flags >> 1 & 3;
          let pid = 0;
          if (qos > 0 && pkt.body.length >= p + 2) {
            pid = pkt.body.readUInt16BE(p);
            p += 2;
          }
          const payload = pkt.body.slice(p);
          for (const filter of client.subs.keys()) {
            if (__mqttTopicMatch(filter, topic)) {
              client.opts.onMessage?.(topic, payload);
              break;
            }
          }
          if (qos === 1 && pid) client.__send(__mqttPacket(4, 0, __mqttU16(pid)));
        }
      }
    });
    s.on("close", () => {
      if (s !== client.__sock) return;
      client.connected = false;
      if (client.__keepalive) {
        clearInterval(client.__keepalive);
        client.__keepalive = null;
      }
      if (client.__closed) return;
      rejectAck(new Error("[rosefd] MQTT connection closed before CONNACK"));
      scheduleReconnect();
    });
    s.on("error", (err) => {
      if (s !== client.__sock) return;
      client.opts.onError?.(err);
      if (!client.connected) rejectAck(err);
    });
  };
  dial();
  return client;
}
var ActionError = class extends Error {
  /** the HTTP status the response carries (400/401/403/409/422/...) */
  code;
  /** the form field the failure belongs to, when it belongs to one */
  field;
  constructor(message, code = 400, field) {
    super(message);
    this.name = "ActionError";
    this.code = code;
    this.field = field;
  }
};
function $actionPending() {
  const entry2 = renderMaps().signals.get("actionPending");
  return entry2 ? entry2.value === true : false;
}
function $actionError() {
  const e = renderMaps().signals.get("actionError");
  if (!e) return null;
  if (currentEffect) {
    e.subs.add(currentEffect);
    if (trackingDeps) trackingDeps.add(e);
  }
  return e.value ?? null;
}
function $actionErrorOrThrow() {
  const info = $actionError();
  if (info) throw new ActionError(info.message, info.code, info.field);
}
function $boundaryFallback(err) {
  if (err instanceof ActionError) return `<p class="rosefd-action-error">${esc(err.message)}</p>`;
  return "<p>This section failed to render.</p>";
}
var StateDelta = class {
  constructor(op, value) {
    this.op = op;
    this.value = value;
  }
};
var $append = (value) => new StateDelta("a", value);
var $prepend = (value) => new StateDelta("p", value);
var $merge = (value) => new StateDelta("m", value);
var pendingDeltas = shared("__rosefd_pendingDeltas", () => /* @__PURE__ */ new Map());
function setStateDelta(key, delta) {
  pendingDeltas.set(key, delta);
}
function applyStateDeltas() {
  if (pendingDeltas.size === 0) return;
  for (const [key, delta] of [...pendingDeltas]) {
    pendingDeltas.delete(key);
    applyStateDelta(key, delta);
  }
}
function applyStateDelta(key, delta) {
  const cur = renderMaps().signals.get(key)?.value;
  if (delta.op === "m") {
    setState(key, { ...cur, ...delta.value });
    return;
  }
  const list = (v) => v == null ? [] : Array.isArray(v) ? v : [v];
  const merged = delta.op === "a" ? [...list(cur), ...list(delta.value)] : [...list(delta.value), ...list(cur)];
  setState(key, merged);
}
function $cookies(request) {
  const raw = request ? request.headers.get("cookie") : typeof document !== "undefined" ? document.cookie : "";
  const out = {};
  for (const part of (raw || "").split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    if (k) out[k] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}
function $sessionCookie(name, value, opts = {}) {
  const { path = "/", maxAge = 60 * 60 * 24 * 7, sameSite = "Lax", secure = false, httpOnly = true } = opts;
  return [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
    httpOnly ? "HttpOnly" : "",
    secure || sameSite === "None" ? "Secure" : ""
  ].filter(Boolean).join("; ");
}
function reportVitals() {
  if (typeof window === "undefined" || typeof performance === "undefined") return;
  const live = {};
  window.__rosefd_vitals = live;
  const send = (name, value) => {
    live[name] = value;
    window.dispatchEvent(new CustomEvent("rosefd:vitals", { detail: { name, value, route: location.pathname } }));
  };
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  if (nav) send("ttfb", Math.round(nav.responseStart));
  const paints = performance.getEntriesByType?.("paint") ?? [];
  const fcp = paints.find((p) => p.name === "first-contentful-paint");
  if (fcp) send("fcp", Math.round(fcp.startTime));
  const PO = window.PerformanceObserver;
  if (!PO) return;
  let cls = 0;
  let inp = 0;
  const flush = () => {
    if (cls) send("cls", Math.round(cls * 1e3) / 1e3);
    if (inp) send("inp", Math.round(inp));
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  new PO((list) => {
    for (const e of list.getEntries()) {
      if (e.entryType === "layout-shift" && !e.hadRecentInput) cls += e.value ?? 0;
      if (e.entryType === "event" && e.interactionId) inp = Math.max(inp, e.duration ?? 0);
      if (e.entryType === "largest-contentful-paint") send("lcp", Math.round(e.startTime));
    }
  }).observe({ entryTypes: ["layout-shift", "event", "largest-contentful-paint"] });
}
export {
  $actionError,
  $actionErrorOrThrow,
  $actionPending,
  $append,
  $boundaryError,
  $boundaryFallback,
  $cookies,
  $data,
  $effect,
  $listen,
  $merge,
  $mqtt,
  $prepend,
  $query,
  $sessionCookie,
  $setBoundaryError,
  $store,
  $t,
  $tcp,
  $udp,
  $websocket,
  ActionError,
  RoseNotFound,
  RoseRedirect,
  StateDelta,
  __startNetwork,
  __stopNetwork,
  adoptCleanups,
  aggregate,
  applyHead,
  applyStateDelta,
  applyStateDeltas,
  applyStorePatch,
  attrMark,
  attrValueString,
  bestLocale,
  boolAttrMark,
  clearHead,
  clearMounts,
  clearRequestState,
  decodeSdui,
  directives,
  eachMark,
  effect,
  encodeSdui,
  ensureLocale,
  esc,
  flushMounts,
  getContext,
  getRequestQuery,
  handlers,
  hasState,
  headMark,
  ifMark,
  installContextStore,
  isLocale,
  isSeeded,
  isolateRender,
  isolateStateAsync,
  loadLocale,
  loader,
  localeDir,
  localeList,
  markSeeded,
  notFound,
  onCleanup,
  onMount,
  parseLoRaWAN,
  persistState,
  rawMark,
  redirect,
  refresh,
  reportVitals,
  resetContainerFx,
  resetEffects,
  resetRequestContext,
  restoreState,
  resumeState,
  runWithContext,
  serializeState,
  setActionDispatcher,
  setFxOwner,
  setLocalePacks,
  setLocales,
  setPrefetchOverride,
  setRefreshHook,
  setRequestQuery,
  setState,
  setStateDelta,
  setStoreTransport,
  slotBlockMark,
  state,
  textMark,
  tpl,
  wire
};
