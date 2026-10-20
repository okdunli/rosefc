
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The dynamic half, measured: a page whose rows come from a database on
  // EVERY request. Nothing here is baked at build time - getContext() is
  // what makes a route dynamic by construction (never prerendered, never
  // answered from a file on disk), so this document is rendered per
  // request, on demand, on the Node server and the edge adapter alike.
  //
  // Where the rows come from is the interesting part. A page's $data body
  // SHIPS to the browser (it re-runs on client-side navigation), so the
  // database read cannot live in this file - it would land in the client
  // bundle. It lives in pages/_middleware.rose instead, the one module the
  // compiler never sends to the browser, and lands in the request context.
  //
  // So: on the server this $data reads the context (zero extra work, the
  // rows are already in the first response). On a client-side navigation
  // the context is empty, and it fetches the same rows from /api/posts -
  // one request, the honest cost of fresh server data after a SPA
  // navigation (a router round-trip pays an extra payload fetch for the same thing).
  const __seeded_viewer = isSeeded("viewer");
const [viewer, setViewer] = state("viewer", null);
if (!__seeded_viewer) { const __v_viewer = await $data(async () => getContext().user ?? null); setViewer(__v_viewer); markSeeded("viewer"); }
  const __seeded_posts = isSeeded("posts");
const [posts, setPosts] = state("posts", null);
if (!__seeded_posts) { const __v_posts = await $data(async () => getContext().posts ?? (await (await fetch('/api/posts')).json()).posts); setPosts(__v_posts); markSeeded("posts"); }

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Feed</h1>\n<p>";
h += textMark(__c, () => (viewer() ? 'Signed in as ' + viewer().name : 'Reading as a guest'));
h += "</p>\n<ul>\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<li>#";
h += textMark(__c, (__s) => (__s.id), 1, __s);
h += " ";
h += textMark(__c, (__s) => (__s.title), 1, __s);
h += " — ";
h += textMark(__c, (__s) => (__s.author), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (posts()), __b0_0);
h += "\n</ul>\n<p><a href=\"/api/posts\">The same rows as JSON</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Feed - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"A dynamic page that reads the database on every request.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
