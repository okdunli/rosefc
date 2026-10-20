
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The page whose <head> block the guarded layout wraps: navigating here
  // client-side must apply THIS title, not the layout's.

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Guarded</h1>\n<p>The slot opens, so this page shows.</p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Guarded Page - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"A page head inside a guarded slot.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
