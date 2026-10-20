
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <h1>🌹 500</h1>\n  <p>This rose pricked itself - the page failed to render, but the garden is fine.</p>\n  <p><a href=\"/\">Back to the garden</a></p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>500 - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"This page failed to render.\">\n  <meta name=\"robots\" content=\"noindex\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
