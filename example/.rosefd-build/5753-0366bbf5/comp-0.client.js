
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const shell = false;



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The not-found page is a real document too - and an app's themed 404
  // (its own CSS, its own markup) needs the same escape the bare route
  // takes: `shell = false` keeps the bundle (client-side navigation onto an
  // unknown path still paints this page) while the served HTML drops the
  // #app wrapper and the demo styles.
  

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <h1>🌹 404</h1>\n  <p>This rose has no petals here - the route does not exist.</p>\n  <p><a href=\"/\">Back to the garden</a></p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>404 - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"This route does not exist.\">\n  <meta name=\"robots\" content=\"noindex\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
