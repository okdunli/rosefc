
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // P0-1: the query string is a first-class citizen. Routing matches the
  // PATHNAME (`/search?q=rose` is the route `/search`), and the query rides
  // along to the render through $query() - no URL parsing, no `location`
  // guard, the same object on the server and in the client render. Reading
  // it is what makes this route dynamic: the answer depends on the request,
  // so there is nothing to bake at build time.
  //
  // P1-2: `{@html expr}` emits TRUSTED markup verbatim (esc() is skipped on
  // purpose). The use case is content you own - a CMS body, a sanitized
  // fragment - and the honest rule: never point it at user input.
  //
  // P1-3: the form below is a plain native form. No on: handler, no $action
  // dispatch - the browser submits it and the server re-renders this page,
  // so the route ships ZERO JavaScript (see the build's zero-JS report).
  // The bundle is the enhancement, never the price of entry.
  interface Hit { title: string; body: string }

  // The query is state: reading $query() at declaration time is what makes
  // this route dynamic (per-request), and the resolver below can then read
  // it like any other signal.
  const [q, setQ] = state("q", $query().q ?? '');

  // The corpus lives INSIDE the resolver: a $data body runs while the state
  // declarations above it are still initializing, so a value it reads must
  // either be a state key or local to the resolver itself.
  const __seeded_hits = isSeeded("hits");
const [hits, setHits] = state("hits", null);
if (!__seeded_hits) { const __v_hits = await $data(async (): Promise<Hit[]> => {
    const posts: Hit[] = [
      { title: 'Hello Rose Frame Driver', body: 'This is the <strong>first post</strong> on our revolutionary framework.' },
      { title: 'Zero-hydration magic', body: 'Rose Frame Driver resumes <em>state</em> without replaying events or re-rendering the DOM.' },
      { title: 'The thorn in every stack', body: 'A page with <a href="/thorn">no script</a> at all, and no apology for it.' },
    ];
    const term = q().trim().toLowerCase();
    if (!term) return [];
    return posts.filter((p) => p.title.toLowerCase().includes(term) || p.body.toLowerCase().includes(term));
  }); setHits(__v_hits); markSeeded("hits"); }

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Search</h1>\n<form method=\"GET\" action=\"/search\">\n  <input name=\"q\" placeholder=\"Search posts\" aria-label=\"Search term\" ";
h += attrMark(__c, () => (q()), 'value');
h += ">\n  <button type=\"submit\">Search</button>\n</form>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p>";
h += textMark(__c, (__s) => (hits().length), 1, __s);
h += " result(s) for <strong>";
h += textMark(__c, (__s) => (q()), 0, __s);
h += "</strong></p>\n";
const __b1_0 = (__s, __c) => { let h = ''; h += "<article>\n  <h2>";
h += textMark(__c, (__s) => (__s.title), 0, __s);
h += "</h2>\n  <p>";
h += rawMark(__c, (__s) => (__s.body), __s);
h += "</p>\n</article>";
 return h; };
h += eachMark(__c, () => (hits()), __b1_0);
 return h; };
h += ifMark(__c, () => (q().trim()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<p>Type a word - try <code>rose</code> or <code>hydration</code>.</p>";
 return h; };
h += ifMark(__c, () => (!q().trim()), __b0_1);
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>";
__hd += esc(q() ? `Search: ${q()}` : 'Search');
__hd += " - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"Search the demo blog - a zero-JS native form and $query().\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
