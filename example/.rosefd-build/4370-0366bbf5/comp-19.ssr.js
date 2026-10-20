
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const buffer = true;





export async function render(closes, children, __props, __slots) {
  
  
  
  
  // P0-2: `export const buffer = true` renders this route BUFFERED - the whole
  // document is assembled before the first byte goes out. The default streams:
  // the shell flushes immediately and the rest follows, which is the fastest
  // possible TTFB but hands an onResponse hook a Response whose body is
  // already consumed. A route that a plugin must rewrite (a CSP nonce a CDN
  // can see, an injected banner, an A/B variant) opts into buffering here.
  // Everything else about the route is identical: same render, same head,
  // same zero-JS document.
  

  const __seeded_body = isSeeded("body");
const [body, setBody] = state("body", null);
if (!__seeded_body) { const __v_body = await $data(async () => 'buffered body'); setBody(__v_body); markSeeded("body"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Buffered</h1>\n<p>";
h += textMark(__c, () => (body()), 1);
h += " - rendered whole, then sent, so a hook can read and replace it.</p>\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
