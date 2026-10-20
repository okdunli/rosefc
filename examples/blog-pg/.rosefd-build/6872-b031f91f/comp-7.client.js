
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The list page. $data runs per request on the server and reads the
  // rows the middleware already loaded - so the page itself imports
  // nothing, and the first response carries the data.
  //
  // The page has no event wiring, no form and no lifecycle: the compiler
 // decides this route is zero-JS . The list ships as
  // pure HTML - no state script, no bundle, zero script tags.
  //
  // On a client-side navigation the context is empty (it is a
  // per-request, server-side bag), so the same $data falls back to the
  // api: one request for fresh rows, the honest cost of server data
  // after a SPA navigation. The fallback is CLIENT-only on purpose -
  // Node's fetch rejects a relative URL, and on the server the context
  // (or an empty list) is already the answer.
  interface Post { id: number; title: string; body: string; author: string }

  const __seeded_posts = isSeeded("posts");
const [posts, setPosts] = state("posts", null);
if (!__seeded_posts) { const __v_posts = await $data(async (): Promise<Post[]> =>
    getContext().posts ?? (typeof location === 'undefined' ? [] : (await (await fetch('/api/posts')).json()).posts)); setPosts(__v_posts); markSeeded("posts"); }

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Posts</h1>\n<p class=\"lede\">Every row below arrived in the first response — one request, no JavaScript.</p>\n<div class=\"cards\">\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<a class=\"card\" ";
h += attrMark(__c, (__s) => ('/__s/' + __s.id), 'href', __s);
h += ">\n      <h2>";
h += textMark(__c, (__s) => (__s.title), 0, __s);
h += "</h2>\n      <p class=\"clamp\">";
h += textMark(__c, (__s) => (__s.body), 0, __s);
h += "</p>\n      <span class=\"meta\">by ";
h += textMark(__c, (__s) => (__s.author), 0, __s);
h += "</span>\n    </a>";
 return h; };
h += eachMark(__c, () => (posts()), __b0_0);
h += "\n</div>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
