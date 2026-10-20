
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // A single post. The server render gets the row from the middleware's
  // context; a client-side navigation fetches it from the api by the
  // same id the router put in the URL. `id` is the route's param state -
  // the router fills it from the pathname before this $data runs.
  //
  // The api fallback is CLIENT-only: Node's fetch rejects a relative URL,
  // and on the server the context (or null -> the not-found branch) is
  // already the answer.
  //
  // Because the row is per-request data (it changes the moment someone
  // writes a post), the compiler keeps this route dynamic: never baked,
  // always rendered live.
  interface Post { id: number; title: string; body: string; author: string }

  const [id, setId] = state("id", '1');
  const __seeded_post = isSeeded("post");
const [post, setPost] = state("post", null);
if (!__seeded_post) { const __v_post = await $data(async (): Promise<Post | null> =>
    getContext().post ?? (typeof location === 'undefined' ? null : (await (await fetch('/api/posts/' + id())).json()).post ?? null)); setPost(__v_post); markSeeded("post"); }

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
const __b0_0 = (__s, __c) => { let h = ''; h += "<article class=\"card\">\n    <h1>";
h += textMark(__c, (__s) => (post()!.title), 0, __s);
h += "</h1>\n    <p>";
h += textMark(__c, (__s) => (post()!.body), 0, __s);
h += "</p>\n    <p class=\"meta\">by ";
h += textMark(__c, (__s) => (post()!.author), 0, __s);
h += "</p>\n  </article>";
 return h; };
h += ifMark(__c, () => (post()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<div class=\"card\">\n    <h1>Not found</h1>\n    <p>No post with that id.</p>\n  </div>";
 return h; };
h += ifMark(__c, () => (!post()), __b0_1);
h += "\n<p><a href=\"/\">← Back to all posts</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>";
__hd += esc(post() ? post()!.title : 'Not found');
__hd += " - Rosevine</title>\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
