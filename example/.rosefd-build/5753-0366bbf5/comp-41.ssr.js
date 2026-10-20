
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The plain wall: the gate lives entirely in pages/_middleware.rose -
  // this page never touches the request context, so the build sees a
  // cookie-less request as walled and never bakes it (no gated content in
  // the static deploy). Contrast /admin, the deep wall: its content IS the
  // secret, so it reads the context and renders per request even on the
  // Go binary.
  const [thorn, setThorn] = state("thorn", 'sharp');

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>The Vault</h1>\n<p>The gate is the middleware - the page itself carries no auth code.</p>\n<p>Every rose has its thorn: ";
h += textMark(__c, () => (thorn()));
h += "</p>\n<p><a href=\"/\">Back to the garden</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
