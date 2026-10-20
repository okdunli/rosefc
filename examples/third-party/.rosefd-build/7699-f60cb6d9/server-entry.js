
import { render as render_0 } from './comp-0.ssr.js';
import { renderMarkdown } from './content-md.ts';
// no route references __rosefdAuth: the node:crypto auth helpers are omitted, keeping the bundle edge-loadable
// no route opens a network listener ($udp/$tcp/$listen): the node:dgram/node:net imports are omitted, keeping the bundle edge-loadable
// no route opens a WebSocket server ($websocket): the node:http/node:crypto imports are omitted, keeping the bundle edge-loadable
import { setState, persistState, clearRequestState, isolateRender, serializeState, resetRequestContext, installContextStore, setRequestQuery, getRequestQuery, isLocale, setLocales, localeList, localeDir, setStoreTransport, applyStorePatch, ActionError, StateDelta, setStateDelta, esc, __startNetwork, __stopNetwork, $udp, $tcp, $listen, $websocket, $mqtt } from './runtime.js';
export { __startNetwork, __stopNetwork };
// no plugin declares a runtime hook, so there is no plugins
// module to import - the runners below stay no-ops and the servers call them
// unconditionally (one code path, no flags to keep in sync).
const __pluginHooks = [];
const __hasRequestHooks = false;
const __hasResponseHooks = false;


export async function runRequestHooks(ctx) {
  for (const p of __pluginHooks) {
    if (!p.onRequest) continue;
    try {
      const r = await p.onRequest(ctx);
      if (r instanceof Response) return r;
    } catch (err) {
      console.error('Rose Frame Driver: plugin', p.name, 'onRequest failed:', err instanceof Error ? err.message : err);
    }
  }
  return null;
}

export async function runResponseHooks(ctx, res) {
  let out = res;
  for (const p of __pluginHooks) {
    if (!p.onResponse) continue;
    try {
      const r = await p.onResponse(ctx, out);
      if (r instanceof Response) out = r;
    } catch (err) {
      console.error('Rose Frame Driver: plugin', p.name, 'onResponse failed:', err instanceof Error ? err.message : err);
    }
  }
  return out;
}


export const hasRequestHooks = __hasRequestHooks;
export const hasResponseHooks = __hasResponseHooks;

// P0-1: the query of the request being rendered, for $query().
export function setQuery(query) {
  setRequestQuery(query || {});
}


setLocales({}, 'en');


// Live store channel: every $store write fans out to the browsers holding an open
// SSE connection AND (when forked) to sibling workers. The client set lives on
// globalThis so a dev hot-re-import (a fresh module instance) keeps serving the
// same live connections. __addStoreClient/__removeStoreClient are called by the
// host (cli serve worker / devWrap) as SSE connections open and close.
const __storeClients: Set<any> = (globalThis as any).__rosefd_storeClients || ((globalThis as any).__rosefd_storeClients = new Set());
function __broadcastStore(name: string, value: unknown): void {
  if (__storeClients.size === 0) return;
  const frame = 'event: store\ndata: ' + JSON.stringify({ name: name, value: value }) + '\n\n';
  for (const res of __storeClients) {
    try { res.write(frame); } catch { __storeClients.delete(res); }
  }
}
setStoreTransport((name, value) => {
  __broadcastStore(name, value);
  if (typeof process !== 'undefined' && typeof process.send === 'function') process.send({ type: 'rosefd:store', name, value });
});
if (typeof process !== 'undefined' && typeof process.send === 'function') {
  process.on('message', (msg) => {
    if (msg && msg.type === 'rosefd:store') {
      applyStorePatch(msg.name, msg.value);
      __broadcastStore(msg.name, msg.value);
    }
  });
}
export function __addStoreClient(res: any): void { __storeClients.add(res); }
export function __removeStoreClient(res: any): void { __storeClients.delete(res); }


// (the cross-machine seam): the cluster relay above covers ONE machine.
export function __installStoreTransport(send: (name: string, value: unknown) => void): void {
  // Wrap, not replace: a cross-machine transport (a plugin's LISTEN/NOTIFY bus)
  // still fans out to this machine's live browsers on every patch.
  setStoreTransport((name, value) => { __broadcastStore(name, value); send(name, value); });
}
export function __deliverStorePatch(name: string, value: unknown): void {
  applyStorePatch(name, value);
  __broadcastStore(name, value);
}

export { localeList };
export const defaultLocale = 'en';

// Route params maps, re-exported for the build's prerender step: routePath -> the component's exported params (a static map or a function).


export const routeParams = {
  
};

// Routes whose component reads the request context (getContext()), mutates a shared store ($store()), reads the query ($query(), P0-1)
export const dynamicRoutes = [
  '/'
];

// Routes that the prerender function should skip (not bake into static files).
export const prerenderSkipRoutes = [
  '/'
];

// Which api routes opt into build-time baking (export const prerender = true): routePath -> boolean.


export const apiPrerender = {
  
};


export const revalidate = [
  
];

// Per-request render memo (export const cache = N): a dynamic route's whole renderPage result is memoized for N seconds.
export const routeCaches = [
  
];

// Hot-cache key dimensions (export const hotVary = ['x-locale']): the shared
// server caches key on URL + cookie + accept-language only, so a route whose
// representation is negotiated on its own private header had one client's
// bytes replayed to another for a whole TTL (BUG.md AB) - and the app's only
// exits were a query tag (?l=, ?rv=) or no-store, which switches the cache off
// for the route entirely. Naming the headers here folds them into the key AND
// into the warm render that fills it, so every value gets its own entry and
// the cache keeps working.
export const routeHotVary = [
  
];
export function hotVaryFor(pathname: string): string[] | null {
  for (const r of routeHotVary) if (matchRoute(r.pattern, pathname)) return r.dims;
  return null;
}
const __dynCache = new Map();
export function invalidateRenderCache(): void {
  __dynCache.clear();
}


// Application KV cache primitive (server-side, per-worker in-memory): a zero-dependency store for expensive computations.
const __kvStore = new Map<string, { v: unknown; exp: number }>();
// Content collections: src/content/<coll>/*.md scanned once at build time,
const contentCollections = {};
export const kv = {
  get(key: string): unknown {
    const e = __kvStore.get(key);
    if (!e) return undefined;
    if (e.exp < Date.now()) { __kvStore.delete(key); return undefined; }
    return e.v;
  },
  set(key: string, value: unknown, ttlSeconds = 300): void {
    if (__kvStore.size > 1000) {
      const cutoff = Date.now();
      for (const [k, e] of __kvStore) { if (e.exp < cutoff) __kvStore.delete(k); }
      if (__kvStore.size > 2000) __kvStore.clear(); 
    }
    __kvStore.set(key, { v: value, exp: Date.now() + ttlSeconds * 1000 });
  },
  del(key: string): void { __kvStore.delete(key); },
  has(key: string): boolean {
    const e = __kvStore.get(key);
    return !!e && e.exp >= Date.now();
  },
};
globalThis.__rosefdKvApi = { kv, kvMemo: $kv };
globalThis.__rosefdContent = {
  list: (coll: string, filter?: { tag: string }) => {
    let items = contentCollections[coll] ?? [];
    if (filter?.tag) items = items.filter((e) => ((e.frontmatter.tags as string[] | undefined) ?? []).includes(filter.tag));
    return items.map((e) => ({ slug: e.slug, ...e.frontmatter }));
  },
  rss: (coll: string, opts: { title: string; origin: string; description?: string }) => {
    return buildRss(contentCollections[coll] ?? [], opts);
  },
  get: (coll: string, slug: string, vars?: Record<string, unknown>) => {
    const e = (contentCollections[coll] ?? []).find((x) => x.slug === slug);
    if (!e) return null;
    return { slug: e.slug, ...e.frontmatter, html: renderMarkdown(e.body, vars), toc: e.toc, readingTime: e.readingTime, wordCount: e.wordCount, excerpt: e.excerpt };
  },
};

const v = {
  validate(body: Record<string, unknown>, rules: Record<string, string[]>): { ok: boolean; errors: Record<string, string>; values: Record<string, unknown> } {
    const errors: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    for (const [field, ruleList] of Object.entries(rules)) {
      let val = body[field];
      for (const rule of ruleList) {
        if (val === undefined || val === null || val === "") {
          if (rule === "required") errors[field] = field + " is required";
          else if (rule.startsWith("default:")) val = rule.slice(8);
          continue;
        }
        if (rule === "string") val = String(val);
        else if (rule === "trim") val = String(val).trim();
        else if (rule === "number") {
          const num = Number(val);
          if (Number.isNaN(num)) errors[field] = field + " must be a number";
          else val = num;
        } else if (rule === "email") {
          if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(String(val))) errors[field] = field + " must be a valid email";
        } else if (rule.startsWith("min:")) {
          const min = Number(rule.slice(4));
          if (typeof val === "number" ? val < min : String(val).length < min) errors[field] = field + " must be at least " + min;
        } else if (rule.startsWith("max:")) {
          const max = Number(rule.slice(4));
          if (typeof val === "number" ? val > max : String(val).length > max) errors[field] = field + " must be at most " + max;
        }
      }
      values[field] = val;
    }
    return { ok: Object.keys(errors).length === 0, errors, values };
  },
};

const jobs = {
  _timers: new Map<string, ReturnType<typeof setInterval>>(),
  every(name: string, seconds: number, fn: () => void | Promise<void>): void {
    if (this._timers.has(name)) return;
    const t = setInterval(() => { Promise.resolve(fn()).catch(() => {}); }, seconds * 1000);
    this._timers.set(name, t as any);
  },
  cancel(name: string): void {
    const t = this._timers.get(name);
    if (t) { clearInterval(t); this._timers.delete(name); }
  },
  cancelAll(): void { for (const t of this._timers.values()) clearInterval(t); this._timers.clear(); }
};

function sse(handler: (send: (event: string, data: unknown) => void) => Promise<void> | void): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode("event: " + event + "\ndata: " + JSON.stringify(data) + "\n\n"));
      };
      try {
        await handler(send);
      } finally {
        closed = true;
        try { controller.close(); } catch {  }
      }
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache", "connection": "keep-alive" },
  });
}


globalThis.__rosefdExtras = { v, jobs, sse, udp: $udp, tcp: $tcp, listen: $listen, websocket: $websocket, mqtt: $mqtt };
// __rosefdAuth helpers omitted: no route references them (keeps the bundle free of node:crypto and edge-loadable)

// Concurrent missers on a cold key share ONE compute through this inflight map - the check-then-set shape alone lets N simultaneous cold readers hammer.
const __kvInflight = new Map<string, Promise<unknown>>();
export async function $kv(key: string, compute: () => unknown | Promise<unknown>, ttlSeconds = 300): Promise<unknown> {
  const hit = kv.get(key);
  if (hit !== undefined) return hit;
  let p = __kvInflight.get(key);
  if (!p) {
    p = (async () => {
      const v = await compute();
      if (v !== undefined) kv.set(key, v, ttlSeconds);
      return v;
    })();
    __kvInflight.set(key, p);
    p.finally(() => { __kvInflight.delete(key); }).catch(() => {});
  }
  return p;
}
export function isCachedRoute(pathname: string): boolean {
  return routeClass(pathname).cache !== null;
}
export function invalidatePath(pathname: string): number {
  let n = 0;
  for (const key of [...__dynCache.keys()]) {
    if (key.startsWith(pathname + '|')) { __dynCache.delete(key); n++; }
  }
  return n;
}
// The render memo is a shared store, so its key has to name the whole
// representation: URL + cookie alone let one visitor's render be replayed to
// another for the entire memo TTL whenever the route negotiates on a request
// header - accept-language first (BUG.md AB), then whatever the route itself
// declared with export const hotVary. dims is the caller-built negotiation
// fingerprint (accept-language plus the declared headers); it folds in here.
function __dynKey(pathname: string, cookieHeader: string, search: string, dims: string): string {
  let h = 0x811c9dc5;
  const c = (cookieHeader || '') + '\u0000' + (dims || '');
  for (let i = 0; i < c.length; i++) {
    h ^= c.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  // The query string is part of the cache key: routes like /search?q= or /archives?year= render different documents per query.
  return pathname + '|' + (search || '') + '|' + h.toString(16);
}
export function peekRenderCache(pathname: string, cookieHeader: string, search = '', dims = ''): ReturnType<typeof renderPage> | null {
  const cfg = routeClass(pathname).cache;
  if (!cfg) return null;
  const hit = __dynCache.get(__dynKey(pathname, cookieHeader, search, dims));
  return hit && hit.expires > Date.now() ? hit.page : null;
}
// NOTE (R74): this memo caches renderPage's RETURN VALUE - pure HTML/state, NO
// set-cookie header (see the { html, state, head, status, ... } object at
// compiler/index.ts:5756). Set-Cookie is read only at the exit layer from the
// full Response (R57 list-header fix) and guarded at fillHot/refetchHot in
// R60, NOT here - there is nothing to guard in this layer. Do NOT add a
// set-cookie guard to this memo.
export async function renderPageCached(pathname: string, cookieHeader: string, search = '', dims = ''): Promise<ReturnType<typeof renderPage>> {
  const cfg = routeClass(pathname).cache;
  if (!cfg) return renderPage(pathname);
  const key = __dynKey(pathname, cookieHeader, search, dims);
  const hit = __dynCache.get(key);
  if (hit && hit.expires > Date.now()) {
    __dynCache.delete(key);
    __dynCache.set(key, hit);
    return hit.page;
  }
  // Stale-while-revalidate: an EXPIRED entry still answers instantly while one background render refreshes it - the TTL boundary never spikes.
  if (hit && !hit.refreshing) {
    hit.refreshing = true;
    // BUG.md A: this refresh runs AFTER the live response returned, so the module-global
    // requestQuery may already belong to a later request. Re-seed it from THIS entry's
    // search and restore the snapshot afterward, so the cached refresh reflects this query.
    const __q: Record<string, string> = {};
    new URLSearchParams(search || '').forEach((v, k) => { __q[k] = v; });
    const __prevQ = getRequestQuery();
    setRequestQuery(__q);
    renderPage(pathname).then((fresh: any) => {
      setRequestQuery(__prevQ);
      if (fresh.status === 200 && !fresh.redirect) {
        __dynCache.set(key, { page: fresh, expires: Date.now() + cfg.seconds * 1000 });
      } else {
        __dynCache.delete(key);
      }
    }).catch(() => { setRequestQuery(__prevQ); __dynCache.delete(key); });
    return hit.page;
  }
  // Miss: render with this request's query. The caller (edge/cli) already seeded
  // requestQuery; re-seed from the key's search so the cached entry stays self-consistent
  // even if a concurrent request overwrote the global during the await.
  const __q0: Record<string, string> = {};
  new URLSearchParams(search || '').forEach((v, k) => { __q0[k] = v; });
  setRequestQuery(__q0);
  const page = await renderPage(pathname);
  if (page.status === 200 && !page.redirect) {
    __dynCache.set(key, { page, expires: Date.now() + cfg.seconds * 1000 });
    if (__dynCache.size > 300) {
      __dynCache.delete(__dynCache.keys().next().value as string);
    }
  }
  return page;
}

// Pages/_middleware.rose: a Web-standard request handler that runs before every render on the server (pages, POSTs, api calls alike).
export const middleware = null;

// Routes whose DOCUMENTS ship without the client bundle ( decided by the compiler since #29): HTML + CSS only - no runtime, no state script.
export const noJsRoutes = [
  
];

export function isNoJs(pathname) {
  return routeClass(pathname).noJs;
}

// P0-2 (bug report): routes that exported "buffer = true".
export function isBuffered(pathname) {
  return routeClass(pathname).buffered;
}


export const routeHeaders = [
  
];

export function headersFor(pathname) {
  return routeClass(pathname).headers;
}


export const cspNonceRoutes = [
  '/'
];

export function cspNonce(pathname) {
  return routeClass(pathname).nonce;
}

// A Web-standard Request from whatever the host provides: the edge adapter passes one already; the Node server passes its IncomingMessage (plus).
function toWebRequest(raw, form) {
  if (raw instanceof Request) return raw;
  const init = { method: raw.method || 'GET', headers: new Headers(raw.headers || {}) };
  if (form) init.body = form;
  let u = raw.url || '/';
  if (u.startsWith('http://') || u.startsWith('https://')) {
    try { const p = new URL(u); u = p.pathname + p.search; } catch { u = '/'; }
  }
  return new Request('http://' + (raw.headers?.host || 'localhost') + u, init);
}


export async function runMiddleware(rawReq, form) {
  resetRequestContext();
  if (!middleware || !rawReq) return null;
  const res = await middleware(toWebRequest(rawReq, form));
  return res || null;
}

const routes = [
  { pattern: '/', path: '/', render: render_0, actions: null }
];

// API routes (pages/api/*.rose): pattern -> HTTP-method handlers. They never render HTML and never reach the client bundle.
const apiRoutes = [
  
];

// Not-found pages, deepest segment first: the root 404.rose ('/') and any
// pages/<seg>/_notfound.rose, each already composed with its layout chain.
// notFoundFor picks the nearest one up the path - an /admin miss answers
// the admin 404, a public miss the site's - and notFoundPage is the whole
// answer (real 404 status, or the built-in plain 404 when the app has none).
const notFoundRoutes = [

];
const notFoundFor = (pathname) => {
  for (const [prefix, render] of notFoundRoutes) {
    if (prefix === '/' || pathname === prefix || pathname.startsWith(prefix + '/')) return render;
  }
  return null;
};

const notFoundFlags = (pathname) => {
  for (const [prefix, render, flags] of notFoundRoutes) {
    if (prefix === '/' || pathname === prefix || pathname.startsWith(prefix + '/')) return flags || null;
  }
  return null;
};
const notFoundPage = async (pathname) => {
  const nf = notFoundFor(pathname);
  if (nf) {
    const flags = notFoundFlags(pathname) || {};
    // A zero-JS not-found document carries no state script (the shell drops it)
    const noJs = flags.csr === false;
    const page = await renderFallback(pathname, nf, noJs);
    // __notFound stamps the document so the client boot paints THIS route instead of re-rendering the matched one: a catch-all whose resolver threw.
    return { ...page, ...flags, status: 404, state: noJs ? '{}' : JSON.stringify({ __notFound: true, ...JSON.parse(page.state) }) };
  }
  return { html: '<h1>404</h1><p>Page not found</p>', state: JSON.stringify({ __route: pathname, __notFound: true }), head: [], status: 404, ...docAttrs(pathname) };
};


const errorPage = null;


export function docAttrs(pathname) {
  const c = routeClass(pathname);
  return { lang: c.lang, dir: c.dir };
}

// Paint a fallback page (404/500) and serialize its state.
async function renderFallback(pathname, render, noJs = false) {
  // Split mode: the not-found entry's render is a loader object — resolve it through getRender (which memoizes the composed function) exactly like.
  let fn = render;
  if (typeof fn !== 'function' && fn && typeof fn.load === 'function') {
    
    fn = (await fn.load()).render;
  }
  const { html, head } = extractHead(await fn([], ''));
  const state = noJs ? '{}' : JSON.stringify({ __route: pathname, ...JSON.parse(serializeState()) });
  return { html, state, head, ...docAttrs(pathname) };
}

export function matchRoute(pattern, pathname) {
  // Q0 (bug report): one canonical URL per route.
  pathname = pathname.replace(/\/+$/, '') || '/';
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  
  const last = patternParts[patternParts.length - 1];
  if (last && (last.startsWith('*') || last.startsWith('**'))) {
    const fixed = patternParts.slice(0, -1);
    if (pathParts.length < fixed.length) return false;
    if (last.startsWith('*') && !last.startsWith('**') && pathParts.length === fixed.length) return false;
    for (let i = 0; i < fixed.length; i++) {
      if (fixed[i].startsWith(':')) continue;
      if (fixed[i] !== pathParts[i]) return false;
    }
    return true;
  }
  if (patternParts.length !== pathParts.length) return false;
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) continue;
    if (patternParts[i] !== pathParts[i]) return false;
  }
  return true;
}

// Every predicate the servers ask before a render - canStream, isNoJs, isBuffered, shellOff, cspNonce, headersFor, docAttrs.
function routeClass(pathname) {
  let c = __routeClass.get(pathname);
  if (c) return c;
  let route = null;
  let stream = false;
  let buffered = false;
  let shell = false;
  let lang = defaultLocale;
  let dir = localeDir(defaultLocale);
  let first = true;
  for (const r of routes) {
    if (!matchRoute(r.pattern, pathname)) continue;
    if (route === null) route = r;
    if (r.shell === false) shell = true;
    if (r.buffer || r.signal) buffered = true;
    const langIdx = r.pattern.split('/').indexOf(':lang');
    if (langIdx < 0) {
      stream = true;
    } else if (isLocale(pathname.split('/')[langIdx])) {
      stream = true;
      // docAttrs answers from the FIRST matching route alone: its locale, or
      if (first) {
        const l = pathname.split('/')[langIdx];
        lang = l;
        dir = localeDir(l);
      }
    }
    first = false;
  }
  let noJs = false;
  for (const p of noJsRoutes) if (matchRoute(p, pathname)) { noJs = true; break; }
  let nonce = false;
  for (const p of cspNonceRoutes) if (matchRoute(p, pathname)) { nonce = true; break; }
  let headers = null;
  for (const r of routeHeaders) if (matchRoute(r.pattern, pathname)) { headers = r.headers; break; }
  let cache = null;
  for (const r of routeCaches) if (matchRoute(r.pattern, pathname)) { cache = r; break; }
  c = { route, stream, buffered, shell, noJs, nonce, headers, cache, lang, dir, slice: route ? (route.slice ?? null) : null };
  if (__routeClass.size >= 2000) {
    const oldest = __routeClass.keys().next().value;
    if (oldest !== undefined) __routeClass.delete(oldest);
  }
  __routeClass.set(pathname, c);
  return c;
}
const __routeClass = new Map();

// Sliced inline: which dist/slices/<key>.js this pathname's document inlines.
// null for a path that matches no route (the 404 document inlines the
// runtime-only core) and for a zero-JS route (no script at all). The CLI and
// the edge adapter ask this instead of re-deriving pattern -> file; the
// export's existence is also how the edge adapter detects sliced mode.
// inline/split mode: no per-route bundle files exist

// Head blocks (one per component in the route chain) are pulled out of the page html: the shell injects them into <head>.
function extractHead(rendered) {
  const head = [];
  const html = rendered.replace(/<!--⟦h:(\d+)⟧-->([\s\S]*?)<!--⟦\/h:\1⟧-->/g, (_, id, content) => {
    head.push(content);
    return '<!--⟦h:' + id + '⟧--><!--⟦/h:' + id + '⟧-->';
  });
  return { html, head };
}

// Form: the submitted FormData of a progressive-enhancement POST.
export async function renderPage(pathname, form) {
  // Renders DO overlap in one process: prod-server warms every route in the background at startup.
  return isolateRender(() => renderPageIsolated(pathname, form));
}

async function renderPageIsolated(pathname, form) {
  clearRequestState();
  // Cold-start readiness gate (Exoboe #8): await the app's published DB-ready promise before any $data() read.
  const appReady = globalThis.__rosefdAppReady;
  if (appReady) await appReady;
  const route = routeClass(pathname).route;
  if (route) {
      const patternParts = route.pattern.split('/');
      const pathParts = pathname.split('/');
      for (let i = 0; i < patternParts.length; i++) {
        const seg = patternParts[i];
        if (seg.startsWith(':')) setState(seg.slice(1), pathParts[i]);
        
        else if (seg.startsWith('*')) setState(seg.replace(/^\*+/, ''), pathParts.slice(i));
      }
 // I18n: a [lang] segment naming no dictionary is a 404 - the URL is the contract.
      const langIdx = patternParts.indexOf(':lang');
      if (langIdx >= 0 && !isLocale(pathParts[langIdx])) {
  
        return await notFoundPage(pathname);
      }
 
      const docLang = langIdx >= 0 ? pathParts[langIdx] : defaultLocale;
 // The action dispatch. The page's guard (exported beforeAction) runs FIRST and vetoes with an ActionError - the action-level permission check.
      let actionStatus = 0;
      if (form && route.actions) {
        const actionName = form.get('__action') || 'action';
        const fn = route.actions[actionName];
        if (fn) {
          try {
            if (route.guard) await route.guard(actionName, form);
            const patch = await fn(form);
            if (patch && typeof patch === 'object') {
              for (const key of Object.keys(patch)) {
                const v = patch[key];
                // An incremental patch is RECORDED, not applied: the render's own state declarations apply.
                if (v instanceof StateDelta) setStateDelta(key, v);
                else setState(key, v);
              }
            }
          } catch (err) {
            if (err instanceof ActionError) {
              setState('actionError', { action: actionName, message: err.message, code: err.code, field: err.field });
              actionStatus = err.code;
            } else if (err && err.__rosefd === 'redirect') {
              
              return { redirect: err.path, status: err.status ?? 303, ...docAttrs(pathname) };
            } else if (err && err.__rosefd === 'notFound') {
  
              return await notFoundPage(pathname);
            } else {
              throw err;
            }
          }
        }
      }
      let rendered;
      try {
        rendered = extractHead(await route.render([], ''));
      } catch (err) {
        // The control-flow pair: redirect() and notFound() are THROWN from inside the render (a $data body resolving a slug that no longer exists).
        const signal = err && err.__rosefd;
        if (signal === 'redirect') {
          return { redirect: err.path, status: err.status ?? 307, ...docAttrs(pathname) };
        }
        if (signal === 'notFound') {
          return await notFoundPage(pathname);
        }
        
        console.error('Rose Frame Driver: render failed for', pathname, err instanceof Error ? err.message : err);
        // F10: in dev the response body carries the real error — message, file:line and the fix hint.
        let devDetail = '';
        if (process.env.ROSEFD_DEV === '1' && err) {
          const msg = esc(err instanceof Error ? err.message : String(err));
          const file = esc(String(err.file || ''));
          const line = err.line != null ? esc(String(err.line)) : '';
          const hint = esc(String(err.hint || ''));
          const stack = esc(err instanceof Error ? (err.stack || '').split('\n').slice(1, 7).join('\n') : '');
          devDetail = '<div style="margin:24px auto;max-width:860px;font:13px/1.6 ui-monospace,monospace;background:#1b1b1f;color:#e6e6ea;border:1px solid #3a3a42;border-radius:10px;padding:20px 24px;text-align:left;white-space:pre-wrap;word-break:break-word">'
            + '<div style="font:600 15px/1.4 system-ui,sans-serif;color:#ff8b8b">Render failed: ' + esc(pathname) + '</div>'
            + '<div style="margin:10px 0 0;color:#ffd479">' + msg + '</div>'
            + (file ? '<div style="margin:6px 0 0;color:#9ad1ff">' + file + (line ? ':' + line : '') + '</div>' : '')
            + (hint ? '<div style="margin:10px 0 0;color:#9fe8b0">Fix: ' + hint + '</div>' : '')
            + (stack ? '<pre style="margin:12px 0 0;color:#8f8f9a">' + stack + '</pre>' : '')
            + '</div>';
        }
        if (errorPage) {
          // ErrorNoJs is a compile-time constant (see the errorNoJs declaration beside errorRender): a zero-JS site's 500 carries no state script.
          const fb = await renderFallback(pathname, errorPage, false);
          return { ...fb, html: fb.html + devDetail, status: 500 };
        }
        return { html: '<h1>500</h1><p>Something went wrong rendering this page.</p>' + devDetail, state: '{}', head: [], status: 500, ...docAttrs(pathname) };
      }
      // __route tells the bootstrap which route this document was rendered for.
    const noJs = route.csr === false;
    let state = '{}';
    if (!noJs || actionStatus !== 0) {
      const s = serializeState();
      state = '{"__route":' + JSON.stringify(pathname) + (s.length > 2 ? ',' + s.slice(1) : '}');
    }
 // Csr ( auto since #29): false when the compiler found nothing in the route's chain that needs the client (or the route asserted csr = false) .
      return { html: rendered.html, state, head: rendered.head, status: actionStatus || 200, csr: route.csr !== false, shell: route.shell !== false, lang: docLang, dir: localeDir(docLang) };
  }
  return await notFoundPage(pathname);
}

// Would renderPageStream handle this path? (matched route = stream, anything
export function canStream(pathname) {
  return routeClass(pathname).stream;
}


export function shellOff(pathname) {
  return routeClass(pathname).shell;
}

// === API routes === The /api namespace answers JSON, never HTML: an API client that hits an unknown path must not receive the SPA shell.
export function isApi(pathname) {
  return pathname === '/api' || pathname.startsWith('/api/');
}

function toResponse(out) {
  if (out instanceof Response) return out;
  if (out === undefined || out === null) return new Response(null, { status: 204 });
  return new Response(JSON.stringify(out), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

export async function handleApi(method, pathname, request) {
  for (const route of apiRoutes) {
    if (matchRoute(route.pattern, pathname)) {
      const fn = route.handlers[method];
      if (!fn) {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
          status: 405,
          headers: { 'content-type': 'application/json', allow: Object.keys(route.handlers).join(', ') },
        });
      }
      try {
        return toResponse(await fn(request));
      } catch (err) {
        
        const signal = err && err.__rosefd;
        if (signal === 'redirect') {
          return new Response(JSON.stringify({ error: 'redirect', location: err.path }), {
            status: err.status ?? 307,
            headers: { 'content-type': 'application/json', location: err.path },
          });
        }
        if (signal === 'notFound') {
          return new Response(JSON.stringify({ error: 'not found' }), {
            status: 404,
            headers: { 'content-type': 'application/json' },
          });
        }
        throw err;
      }
    }
  }
  return new Response(JSON.stringify({ error: 'not found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  });
}

// === Streaming SSR === The static shell (doctype, <head>, body + container open) flushes BEFORE the - possibly slow - render completes: the first byte.
export async function renderPageStream(pathname, write, shellOpen, clientTag) {
  // Isolated for the same reason as renderPage: a streaming render awaits inside route.render()
  return isolateRender(() => renderPageStreamIsolated(pathname, write, shellOpen, clientTag));
}

async function renderPageStreamIsolated(pathname, write, shellOpen, clientTag) {
  clearRequestState();
  // Cold-start readiness gate (Exoboe #8): same contract as renderPage — await the app's published DB-ready promise before streaming the shell.
  const appReady = globalThis.__rosefdAppReady;
  if (appReady) await appReady;
  const route = routeClass(pathname).route;
  if (route) {
      const patternParts = route.pattern.split('/');
      const pathParts = pathname.split('/');
      for (let i = 0; i < patternParts.length; i++) {
        const seg = patternParts[i];
        if (seg.startsWith(':')) setState(seg.slice(1), pathParts[i]);
        
        else if (seg.startsWith('*')) setState(seg.replace(/^\*+/, ''), pathParts.slice(i));
      }
      // i18n: an unknown locale must 404 BEFORE the shell flushes - a
      const langIdx = patternParts.indexOf(':lang');
      if (langIdx >= 0 && !isLocale(pathParts[langIdx])) return 404;
      write(shellOpen);
      let html;
      try {
        // nonce routes: an un-nonced inline <style> would be CSP-blocked, so strip to markers (applyHead re-injects under the nonce). Otherwise keep the head content in the streamed body so page/layout <style> applies on first paint (no FOUC) and no-JS routes stay styled.
        html = routeClass(pathname).nonce ? extractHead(await route.render([], '')).html : await route.render([], '');
      } catch (err) {
        console.error('Rose Frame Driver: render failed for', pathname, err instanceof Error ? err.message : err);
        // F10: dev carries the real error in the body here too — the shell
        let devDetail = '';
        if (process.env.ROSEFD_DEV === '1' && err) {
          const msg = esc(err instanceof Error ? err.message : String(err));
          const file = esc(String(err.file || ''));
          const line = err.line != null ? esc(String(err.line)) : '';
          const hint = esc(String(err.hint || ''));
          const stack = esc(err instanceof Error ? (err.stack || '').split('\n').slice(1, 7).join('\n') : '');
          devDetail = '<div style="margin:24px auto;max-width:860px;font:13px/1.6 ui-monospace,monospace;background:#1b1b1f;color:#e6e6ea;border:1px solid #3a3a42;border-radius:10px;padding:20px 24px;text-align:left;white-space:pre-wrap;word-break:break-word">'
            + '<div style="font:600 15px/1.4 system-ui,sans-serif;color:#ff8b8b">Render failed: ' + esc(pathname) + '</div>'
            + '<div style="margin:10px 0 0;color:#ffd479">' + msg + '</div>'
            + (file ? '<div style="margin:6px 0 0;color:#9ad1ff">' + file + (line ? ':' + line : '') + '</div>' : '')
            + (hint ? '<div style="margin:10px 0 0;color:#9fe8b0">Fix: ' + hint + '</div>' : '')
            + (stack ? '<pre style="margin:12px 0 0;color:#8f8f9a">' + stack + '</pre>' : '')
            + '</div>';
        }
        html = errorPage ? (routeClass(pathname).nonce ? extractHead(await errorPage([], '')).html : await errorPage([], '')) + devDetail : '<h1>500</h1><p>Something went wrong rendering this page.</p>' + devDetail;
      }
      write(html);
 // Csr: false ( auto since #29): a no-JS route's document ends here - no state script, no inlined bundle.
      if (route.csr === false) {
        write('</div>\n</body>\n</html>');
        return 200;
      }
      const state = JSON.stringify({ __route: pathname, ...JSON.parse(serializeState()) });
      // P1-6 (bug report): the JSON data block is embedded in the document.
      const stateSafe = state.replace(/</g, '\\u003c');
      write('</div>\n  <script type="application/json" id="__rosefd_state">' + stateSafe + '</script>\n  ' + clientTag + '\n</body>\n</html>');
      return 200;
  }
  return 404;
}
// Prevent tree-shaking of invalidateRenderCache (called from prod-server.ts / edge.ts on non-GET writes).
void invalidateRenderCache;

// Same reason, for the per-request context store: prod-server.ts installs an AsyncLocalStorage adapter.
export { installContextStore };
