
import { render as render_0 } from './comp-0.client.js';
import { render as render_1 } from './comp-1.client.js';
import { render as render_2 } from './comp-2.client.js';
import { render as render_3 } from './comp-3.client.js';
import { render as render_5 } from './comp-5.client.js';
import { render as render_6 } from './comp-6.client.js';
import { render as render_14 } from './comp-14.client.js';
import { render as render_15 } from './comp-15.client.js';
import { render as render_16 } from './comp-16.client.js';
import { render as render_17 } from './comp-17.client.js';
import { render as render_18 } from './comp-18.client.js';
import { render as render_19 } from './comp-19.client.js';
import { render as render_20 } from './comp-20.client.js';
import { render as render_21 } from './comp-21.client.js';
import { render as render_22 } from './comp-22.client.js';
import { render as render_23 } from './comp-23.client.js';
import { render as render_24 } from './comp-24.client.js';
import { render as render_25 } from './comp-25.client.js';
import { render as render_26 } from './comp-26.client.js';
import { render as render_27 } from './comp-27.client.js';
import { render as render_28 } from './comp-28.client.js';
import { render as render_29 } from './comp-29.client.js';
import { render as render_30 } from './comp-30.client.js';
import { render as render_31 } from './comp-31.client.js';
import { render as render_32 } from './comp-32.client.js';
import { render as render_33 } from './comp-33.client.js';
import { render as render_34 } from './comp-34.client.js';
import { render as render_35 } from './comp-35.client.js';
import { render as render_36 } from './comp-36.client.js';
import { render as render_37 } from './comp-37.client.js';
import { render as render_38 } from './comp-38.client.js';
import { render as render_39 } from './comp-39.client.js';
import { render as render_40 } from './comp-40.client.js';
import { render as render_41 } from './comp-41.client.js';
import { render as render_42 } from './comp-42.client.js';
import { state, setState, resumeState, clearRequestState, resetEffects, wire, isolateStateAsync, restoreState, setRefreshHook, clearMounts, flushMounts, adoptCleanups, handlers, setActionDispatcher, setLocales, setLocalePacks, ensureLocale, isLocale, localeDir, setPrefetchOverride, serializeState, setFxOwner, resetContainerFx, esc, applyStorePatch } from './runtime.js';


// Live store channel: an app that reads a shared $store() keeps one EventSource to
// /__rosefd_store. A server-side write ($store.set/update from a network listener,
// a job, or an action) is pushed here as an {name,value} patch; applyStorePatch
// writes it into the reactive store box, re-running the wire() effects that render
// {store.get()} / {#each store.get()}. No store in the app - no connection.
if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
  try {
    var __storeEs = new EventSource('/__rosefd_store');
    __storeEs.addEventListener('store', function (m) {
      try { var p = JSON.parse(m.data); applyStorePatch(p.name, p.value); } catch (e) {}
    });
  } catch (e) {}
}

// I18n: the dictionaries baked at build time - the client renders any PRELOADED locale from the bundle.
setLocales({"en":{"about.title":"About, localized","about.heading":"This page speaks your language","about.body":"Every string on this page came from src/locales/en.json. The route picked the dictionary from the URL's language segment, and the switcher below repaints from the inlined bundle - zero requests, no navigation.","about.greeting":"Hello, {name} - this sentence was translated with a variable.","about.current":"Current language","about.switch":"Switch language","about.plural":"{count, plural, =0 {No signatures yet} one {# signature} other {# signatures}} on the guestbook","about.ordinal":"You are visitor number {n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} today","about.role":"Signed in as {who, select, rose {the rose} thorn {the thorn} other {a gardener}}"},"zh":{"about.title":"关于,已本地化","about.heading":"这一页说你的语言","about.body":"这一页上的每一句都来自 src/locales/zh.json。路由从 URL 的语言段选中了这本字典,下面的语言切换器由内联包重绘 - 零请求,不导航。","about.greeting":"你好,{name} - 这句话带变量翻译。","about.current":"当前语言","about.switch":"切换语言","about.plural":"留言簿上有{count, plural, other{# 条签名}}","about.ordinal":"你是今天的第 {n, selectordinal, other{#}} 位访客","about.role":"以{who, select, rose {玫瑰} thorn {荆棘} other {园丁}}身份登录"}}, 'en');
setLocalePacks(["ar"]);
// the default locale, kept beside setLocales' own copy so <html lang> can
// follow a route that carries no [lang] segment (a non-i18n page)
const __defLocale = 'en';

// Lazy hydration: when the app opts in (export const lazyHydration = true in
// the root _layout.rose), the bootstrap defers the initial wire() to
// requestIdleCallback. The flag is set here (module eval runs before the
// bootstrap's start() call) so the bootstrap can read it without a second channel.
if (typeof window !== 'undefined') window.__rosefdLazy = false;
// The two pack doors, re-exported for an app that wants to warm a language before its visitor asks for it (ensureLocale) or to feed a dictionary.
export { ensureLocale, loadLocale } from './runtime.js';



const routes = [
  { pattern: '/about', render: (async (closes, children) => await render_3(closes, await (render_5)(closes, children))) },
  { pattern: '/admin', render: (async (closes, children) => await render_3(closes, await (render_6)(closes, children))) },
  { pattern: '/await-demo', render: (async (closes, children) => await render_3(closes, await (render_14)(closes, children))) },
  { pattern: '/bare', render: (async (closes, children) => await render_3(closes, await (render_15)(closes, children))) },
  { pattern: '/bind-demo', render: (async (closes, children) => await render_3(closes, await (render_16)(closes, children))) },
  { pattern: '/broken', render: (async (closes, children) => await render_3(closes, await (render_18)(closes, children))) },
  { pattern: '/buffered', render: (async (closes, children) => await render_3(closes, await (render_19)(closes, children))) },
  { pattern: '/const-demo', render: (async (closes, children) => await render_3(closes, await (render_20)(closes, children))) },
  { pattern: '/content-demo', render: (async (closes, children) => await render_3(closes, await (render_21)(closes, children))) },
  { pattern: '/defer-demo', render: (async (closes, children) => await render_3(closes, await (render_22)(closes, children))) },
  { pattern: '/deftest', render: (async (closes, children) => await render_3(closes, await (render_23)(closes, children))) },
  { pattern: '/docs', render: (async (closes, children) => await render_3(closes, await (render_24)(closes, children))) },
  { pattern: '/else-demo', render: (async (closes, children) => await render_3(closes, await (render_25)(closes, children))) },
  { pattern: '/feed', render: (async (closes, children) => await render_3(closes, await (render_26)(closes, children))) },
  { pattern: '/fresh', render: (async (closes, children) => await render_3(closes, await (render_27)(closes, children))) },
  { pattern: '/garden', render: (async (closes, children) => await render_3(closes, await (render_28)(closes, children))) },
  { pattern: '/guarded', render: (async (closes, children) => await render_3(closes, await ((async (closes, children) => await render_29(closes, await (render_30)(closes, children))))(closes, children))) },
  { pattern: '/', render: (async (closes, children) => await render_3(closes, await (render_31)(closes, children))) },
  { pattern: '/island-demo', render: (async (closes, children) => await render_3(closes, await (render_32)(closes, children))) },
  { pattern: '/key-demo', render: (async (closes, children) => await render_3(closes, await (render_33)(closes, children))) },
  { pattern: '/kvdemo', render: (async (closes, children) => await render_3(closes, await (render_34)(closes, children))) },
  { pattern: '/mirror404', render: (async (closes, children) => await render_3(closes, await (render_35)(closes, children))) },
  { pattern: '/nest-demo', render: (async (closes, children) => await render_3(closes, await (render_36)(closes, children))) },
  { pattern: '/persist-demo', render: (async (closes, children) => await render_3(closes, await (render_37)(closes, children))) },
  { pattern: '/search', render: (async (closes, children) => await render_3(closes, await (render_38)(closes, children))) },
  { pattern: '/sign', render: (async (closes, children) => await render_3(closes, await (render_39)(closes, children))) },
  { pattern: '/thorn', render: (async (closes, children) => await render_3(closes, await (render_40)(closes, children))) },
  { pattern: '/vault', render: (async (closes, children) => await render_3(closes, await (render_41)(closes, children))) },
  { pattern: '/:lang/about', render: (async (closes, children) => await render_3(closes, await (render_2)(closes, children))) },
  { pattern: '/blog/:id', render: (async (closes, children) => await render_3(closes, await (render_17)(closes, children))) }
];

// === Mode B: lazy route chunks === Split mode's registry entries arrive without a render function: loadChain loads the route's module graph (the page).
const loadChain = async (loaders) => {
  const mods = await Promise.all(loaders.map((load) => load()));
  let expr = (closes, children) => mods[0].render(closes, children);
  for (let k = 1; k < mods.length; k++) {
    const inner = expr;
    const outer = mods[k].render;
    expr = async (closes, children) => await outer(closes, await inner(closes, children));
  }
  return { render: expr };
};
const getRender = async (route) => {
  if (typeof route === 'function') return route; 
  // inline mode: the render itself
  return (route.render ??= (await route.load()).render);
};

// Not-found pages, deepest segment first (the server's table, client half): the root 404.rose ('/') and any pages/<seg>/_notfound.rose.
const notFoundRoutes = [
  ['/', (async (closes, children) => await render_3(closes, await (render_0)(closes, children))), { shell: false }],
];
const notFoundFor = (pathname) => {
  for (const [prefix, render] of notFoundRoutes) {
    if (prefix === '/' || pathname === prefix || pathname.startsWith(prefix + '/')) return render;
  }
  return null;
};

// whose render throws degrades to this instead of failing the response.
const errorPage = (async (closes, children) => await render_3(closes, await (render_1)(closes, children)));

// Paint a fallback page (404/500) into the container, wired like any render.
async function paintFallback(container, page, builtin, keepState = false) {
  if (!keepState) __navReset(container);
  clearMounts(); 
  // a failed render leaves stale mounts behind
  const render = page ? await getRender(page) : null;
  if (render) {
        // a packed locale's dictionary lands before the render
    const closes = [];
    await __withOwner(container, async () => {
        
      const html = await render(closes, '');
      container.innerHTML = html;
      wire(container, closes);
      bindEvents(container);
      flushMounts();
    });
        
    return;
  }
  container.innerHTML = builtin;
}


export async function startNotFound(container, pathname) {
  const el = document.getElementById('__rosefd_state');
  if (el) resumeState(el.textContent);
  await paintFallback(container, notFoundFor(pathname), '<h1>404</h1><p>Page not found</p>', true);
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

// === Link prefetch === Hover / focus / touch an internal link and the target route renders NOW - $data included - against a throwaway signal map.
let prefetchMode = "all";
export function setPrefetchMode(mode) { prefetchMode = mode; }
const PREFETCH_BUDGET = 8;
const PREFETCH_MAX_CACHED = 4;
const prefetchCache = new Map(); 

let prefetchQueue = Promise.resolve();
let prefetchPending = 0;


async function applyParams(route, pathname) {
  const patternParts = route.pattern.split('/');
  const pathParts = pathname.split('/');
  for (let i = 0; i < patternParts.length; i++) {
    const seg = patternParts[i];
    if (seg.startsWith(':')) setState(seg.slice(1), pathParts[i]);
        
    else if (seg.startsWith('*')) setState(seg.replace(/^\*+/, ''), pathParts.slice(i));
  }
      // streamed response cannot change its status afterwards
  const langIdx = patternParts.indexOf(':lang');
  if (langIdx >= 0) await ensureLocale(pathParts[langIdx]);
}


function __netOk() {
  const c = navigator.connection;
  if (!c) return true;
  if (c.saveData) return false;
  const t = c.effectiveType;
  return t !== 'slow-2g' && t !== '2g';
}

export function prefetch(pathname, source = 'hover') {
  if (prefetchMode === 'off') return;
  if (prefetchMode === 'hover' && source !== 'hover') return;
  if (prefetchMode === 'viewport' && source !== 'viewport') return;
  if (!__netOk()) return; 
  // save-data / 2g: no bytes before the click
  if (prefetchCache.has(pathname)) return;
  if (pathname === location.pathname) return; 
  
  const route = routes.find((r) => matchRoute(r.pattern, pathname));
  if (!route) return;
  if (prefetchPending >= PREFETCH_BUDGET) return; 
  // Budget spent: drop it, a later hover retries P0-1: the link may carry a query (/search?q=cats).
  const qi = pathname.indexOf('?');
  const qOverride = qi >= 0 ? Object.fromEntries(new URLSearchParams(pathname.slice(qi))) : null;
  const p = prefetchQueue.then(async () => {
    try {
      setPrefetchOverride(qOverride);
      // The isolated render also captures the onMount callbacks the route queued and the onCleanup disposers it registered: the paint that consumes.
      const { result, state, mounts, cleanups } = await isolateStateAsync(async () => {
        await applyParams(route, pathname); 
        const closes = [];
        const render = await getRender(route); 
        const html = await render(closes, '');
        return { html, closes };
      });
      const entry = { ...result, state, mounts, cleanups };
      prefetchCache.set(pathname, entry); 
      // Promise -> result evict oldest-first; in-flight promises are never evicted (evicting one would only force a duplicate render)
      while (prefetchCache.size > PREFETCH_MAX_CACHED) {
        const oldest = prefetchCache.keys().next().value;
        if (prefetchCache.get(oldest) instanceof Promise) break;
        prefetchCache.delete(oldest);
      }
      return entry;
    } catch {
      prefetchCache.delete(pathname); 
      return null;
    } finally {
      setPrefetchOverride(null);
      prefetchPending--;
    }
  });
  prefetchPending++;
  prefetchCache.set(pathname, p);
  prefetchQueue = p;
}

export function prefetchStats() {
  return { cached: prefetchCache.size, pending: prefetchPending, mode: prefetchMode, network: __netOk() };
}

// One delegated listener per event type on the app container: survives DOM swaps and cloned blocks, so handlers never need re-binding.
const DELEGATED = ['click', 'input', 'change', 'submit'];
function bindEvents(container) {
  if (container.__rosefd_bound) return;
  container.__rosefd_bound = true;
  for (const ev of DELEGATED) {
    container.addEventListener(ev, (e) => {
      const el = e.target.closest('[data-on-' + ev + ']');
      if (!el || !container.contains(el)) return;
      const fn = el.getAttribute('data-on-' + ev);
      if (fn.startsWith('$action:')) return $action(fn.slice(8), e);
      const h = handlers[fn];
      if (h) h(e);
    });
  }
}

// === Server actions from any event === POST the body to the current route and adopt the response in place: the server runs the selected action.
async function postForm(body, container, pathname) {
 
  const box = container || document.getElementById('app');
  const route = pathname || location.pathname;
  const res = await fetch(route, { method: 'POST', body });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const next = doc.getElementById('app');
  const st = doc.getElementById('__rosefd_state');
  const paint = () => {
    adopt(box, next ? next.innerHTML : '', st ? st.textContent : '{}', route);
  };
  if (document.startViewTransition) document.startViewTransition(paint);
  else paint();
}

// Call a page's server action by name from any event handler: <button on:click={like}> compiles to $action('like').
export async function $action(name, e) {
  if (e && e.preventDefault) e.preventDefault();
  // F34: the pending flag is ordinary signal state - {#if $actionPending()}
  const [__rvPending, __rvSetPending] = state('actionPending', false);
  __rvSetPending(true);
  const body = new FormData();
  body.append('__action', name);
 // An event inside a mount belongs to that mount - the attribute is kept in step with what is currently mounted.
  const box = e && e.target && e.target.closest ? e.target.closest('[data-rosefd]') : null;
  try {
    return await postForm(body, box || undefined, box ? box.getAttribute('data-rosefd') : undefined);
  } finally {
    __rvSetPending(false);
  }
}
// F17: hand the dispatcher to the runtime, so wire() can serve a server action bound to a non-delegated event (on:keydown="$action:save") the same way.
setActionDispatcher($action);

export { postForm };

// The live signal graph as JSON - the same serializeState the zero-hydration resume uses.
export { serializeState };


// Initial=true: adopt the SSR DOM (zero hydration) - wire reactive markers to the existing nodes and bind events.
function __ownsDoc(container) {
  return container === document.getElementById('app');
}
function __navReset(container) {
  if (__ownsDoc(container)) {
    resetEffects();
    clearRequestState();
  } else {
    resetContainerFx(container);
  }
}
// Attribute everything a render creates (state keys, effects, onCleanups) to
async function __withOwner(container, fn) {
  if (__ownsDoc(container)) return fn();
  setFxOwner(container);
  try {
    return await fn();
  } finally {
    setFxOwner(null);
  }
}
// View Transition on SPA swaps (B9): the DOM swap rides one cross-fade when the browser supports it; reduced-motion users and environments without.
async function __swap(container, html) {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof document.startViewTransition === 'function' && !reduce) {
    const vt = document.startViewTransition(() => { container.innerHTML = html; });
    await vt.updateCallbackDone.catch(() => {});
  } else {
    container.innerHTML = html;
  }
}

export async function start(container, pathname, initial) {
  clearMounts(); 
  // stale mounts from a failed render never fire
  if (initial) {
    const el = document.getElementById('__rosefd_state');
    if (el) resumeState(el.textContent);
  }
  for (const route of routes) {
    if (matchRoute(route.pattern, pathname)) {
      // I18n: an unknown locale paints the 404 page, same as the server (before the prefetch check: a cached entry for a bogus locale is discarded).
      const langIdx = route.pattern.split('/').indexOf(':lang');
      
      
      
      
      
 
      // (dist/mount.js) renders into a foreign page, whose language and
      
      const seg = langIdx >= 0 ? pathname.split('/')[langIdx] : '';
      const known = !seg || isLocale(seg);
      if (container === document.getElementById('app')) {
        const docLang = known && seg ? seg : __defLocale;
        document.documentElement.lang = docLang;
        const docDir = localeDir(docLang);
        if (docDir) document.documentElement.setAttribute('dir', docDir);
        else document.documentElement.removeAttribute('dir');
      }
      if (!known) {
        
        await paintFallback(container, notFoundFor(pathname), '<h1>404</h1><p>Page not found</p>');
          
        return;
      }
      // Prefetched on hover/focus/touch: the render already ran, so paint its HTML and adopt its signal entries - events then patch the very nodes we.
      let hit = initial ? undefined : prefetchCache.get(pathname);
      if (hit && typeof hit.then === 'function') hit = await hit; 
      // in-flight: land it first
      if (hit) {
        prefetchCache.delete(pathname); 
        
        __navReset(container);
        restoreState(hit.state);
        await __swap(container, hit.html);
        await __withOwner(container, () => {
          wire(container, hit.closes);
          bindEvents(container);
          hit.mounts.forEach((fn) => fn()); 
          adoptCleanups(hit.cleanups); 
        });
          
        return;
      }
      if (!initial) __navReset(container);
      let broken = false;
      let signal = null;
      await __withOwner(container, async () => {
        await applyParams(route, pathname);
        const closes = [];
        let html;
        try {
          const render = await getRender(route); 
          
          html = await render(closes, '');
        } catch (err) {
          
          if (err && err.__rosefd === 'notFound') { signal = 'notFound'; return; }
          if (err && err.__rosefd === 'redirect') { signal = err.path; return; }
          
          console.error('Rose Frame Driver: client render failed for', pathname, err instanceof Error ? err.message : err);
          broken = true;
          return;
        }
        if (!initial) await __swap(container, html);
        wire(container, closes);
        bindEvents(container);
        flushMounts();
      });
      if (signal === 'notFound') {
        if (!initial) { try { location.assign(pathname); return; } catch {  } }
        await paintFallback(container, notFoundFor(pathname), '<h1>404</h1><p>Page not found</p>');
        return;
      }
      if (signal) {
        location.href = signal; 
        return;
      }
      if (broken) {
        await paintFallback(container, errorPage, '<h1>500</h1><p>Something went wrong rendering this page.</p>');
      }
      return;
    }
  }
  // Unmatched route: the nearest not-found page renders (with its head + interactivity) - a segment's _notfound.rose or the root 404.rose - else //.
 // the same app-root gate as above - a mount never touches the
  // host document's language or direction.
  if (container === document.getElementById('app')) {
    document.documentElement.lang = __defLocale;
    document.documentElement.removeAttribute('dir');
  }
  await paintFallback(container, notFoundFor(pathname), '<h1>404</h1><p>Page not found</p>');
}

// Adopt a server-rendered response in place - the JS-enabled half of progressive-enhancement forms: the bootstrap POSTs a <form method="POST">.
export async function adopt(container, html, stateJson, pathname) {
 
  const route0 = pathname || location.pathname;
  __navReset(container);
  clearMounts(); 
  // stale mounts from a failed render never fire
  resumeState(stateJson);
  container.innerHTML = html;
  
  const st = document.getElementById('__rosefd_state');
  if (st) st.textContent = stateJson;
  for (const route of routes) {
    if (matchRoute(route.pattern, route0)) {
      await __withOwner(container, async () => {
        await applyParams(route, route0);
        const closes = [];
        try {
          const render = await getRender(route); 
          
          await render(closes, '');
        } catch {
          return;
        }
        wire(container, closes);
        bindEvents(container);
        flushMounts();
      });
      return;
    }
  }
}
// === refresh() implementation === Re-render the current route in place: the client half of router.refresh() (a router refresh) / (a full invalidation).
setRefreshHook(async () => {
  prefetchCache.delete(location.pathname);
  await start(document.getElementById('app'), location.pathname, false);
});
