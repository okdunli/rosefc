
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // $kv demo: the timestamp is computed once per TTL window — every request
  // in that window sees the same number, then it recomputes.
  const __seeded_stamp = isSeeded("stamp");
const [stamp, setStamp] = state("stamp", null);
if (!__seeded_stamp) { const __v_stamp = await globalThis.__rosefdKvApi.kvMemo("__kvh:kvdemo:stamp", () => Date.now(), 60); setStamp(__v_stamp); markSeeded("stamp"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>$kv demo</h1>\n<p>Stamp: ";
h += textMark(__c, () => (stamp()));
h += "</p>\n<p>Two requests inside the TTL window share one stamp.</p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
