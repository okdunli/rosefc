
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // A deliberately broken page: its $data source throws, so the whole route
  // render fails. The route-level error boundary (pages/500.rose) renders
  // instead - HTTP 500 on the server, the same page on the client router -
  // and every other route keeps working.
  const __seeded_post = isSeeded("post");
const [post, setPost] = state("post", null);
if (!__seeded_post) { const __v_post = await $data(async () => {
    throw new Error('data source is down');
  }); setPost(__v_post); markSeeded("post"); }

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "\n  <div>\n    <h1>Broken page</h1>\n    <p>";
h += textMark(__c, () => (post().title));
h += "</p>\n  </div>\n";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
