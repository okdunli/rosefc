
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // Content collections consume through the global bridge — zero imports.
  const posts = globalThis.__rosefdContent.list('posts');
  const docListE = () => globalThis.__rosefdContent.list("posts");
  const post = globalThis.__rosefdContent.get('posts', 'hello');

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Content demo</h1>\n<p>List: ";
h += textMark(__c, () => (posts.length), 1);
h += " post(s)";
h += textMark(__c, () => (posts.length ? ' — first: ' + posts[0].title : ''));
h += "</p>\n<p>Get hello: ";
h += textMark(__c, () => (post ? post.title + ' (' + post.date + ')' : 'missing'));
h += "</p>\n<div>";
h += rawMark(__c, () => (post.html));
h += "</div>\n<ul>\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s.title), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (docListE()), __b0_0);
h += "\n</ul>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
