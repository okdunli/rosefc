
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const params = { id: ['1', '2'] };





export async function render(closes, children, __props, __slots) {
  
  
  
  
  

  interface Post { title: string; body: string }

  const [id, setId] = state("id", '1');
  const [posts, setPosts] = state("posts", {
    '1': { title: 'Hello Rose Frame Driver', body: 'This is the first post on our revolutionary framework.' },
    '2': { title: 'Zero-hydration magic', body: 'Rose Frame Driver resumes state without replaying events or re-rendering the DOM.' }
  });
  const __seeded_post = isSeeded("post");
const [post, setPost] = state("post", null);
if (!__seeded_post) { const __v_post = await $data(async (): Promise<Post> => posts()[id()] || { title: 'Not found', body: 'This post does not exist.' }); setPost(__v_post); markSeeded("post"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <h1>Blog Post #";
h += textMark(__c, () => (id()));
h += "</h1>\n  <h2>";
h += textMark(__c, () => (post().title));
h += "</h2>\n  <p>";
h += textMark(__c, () => (post().body));
h += "</p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>";
__hd += esc(post().title);
__hd += " - Rose Frame Driver blog</title>\n  <meta name=\"description\" ";
__hd += 'content="' + esc(post().body) + '"';
__hd += ">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
