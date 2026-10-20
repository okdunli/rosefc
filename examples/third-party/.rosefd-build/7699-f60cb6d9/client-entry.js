
import { render as render_0 } from './comp-0.client.js';
import { state, setState, resumeState, clearRequestState, resetEffects, wire, isolateStateAsync, restoreState, setRefreshHook, clearMounts, flushMounts, adoptCleanups, handlers, setActionDispatcher, setLocales, setLocalePacks, ensureLocale, isLocale, localeDir, setPrefetchOverride, serializeState, setFxOwner, resetContainerFx, esc, applyStorePatch } from './runtime.js';



// I18n: the dictionaries baked at build time - the client renders any PRELOADED locale from the bundle.
setLocales({}, 'en');
setLocalePacks([]);


// Lazy hydration: when the app opts in (export const lazyHydration = true in
// the root _layout.rose), the bootstrap defers the initial wire() to
// requestIdleCallback. The flag is set here (module eval runs before the
// bootstrap's start() call) so the bootstrap can read it without a second channel.
if (typeof window !== 'undefined') window.__rosefdLazy = false;
// The two pack doors, re-exported for an app that wants to warm a language before its visitor asks for it (ensureLocale) or to feed a dictionary.
export { ensureLocale, loadLocale } from './runtime.js';



const routes = [
  { pattern: '/', render: render_0 }
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

];
const notFoundFor = (pathname) => {
  for (const [prefix, render] of notFoundRoutes) {
    if (prefix === '/' || pathname === prefix || pathname.startsWith(prefix + '/')) return render;
  }
  return null;
};

// whose render throws degrades to this instead of failing the response.
const errorPage = null;

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
      if (langIdx >= 0 && !isLocale(pathname.split('/')[langIdx])) {
        
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
