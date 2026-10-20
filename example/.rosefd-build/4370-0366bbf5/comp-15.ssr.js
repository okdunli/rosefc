
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const shell = false;





export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The bare route: `shell = false` keeps the client bundle (this page still
  // needs it - the counter below is wired, client-side navigation from here
  // still works) but drops the shell's demo dressing: the #app wrapper and
  // the STYLES_MIN block (body padding, pink links). A real app ships its
  // own theme CSS, and the scaffold's equal-specificity rules outrank it -
  // so an app whose markup must sit directly under <body> declares this and
  // keeps everything else. The bundle's bootstrap wraps the SSR content into
  // #app at boot, so the router model is unchanged.
  

  const [taps, setTaps] = state("taps", 0);

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>The Bare Route</h1>\n<p>This document carries the whole client bundle and no demo styles: no <code>#app</code> wrapper in the served HTML, no <code>body</code> padding, no pink links. The page's own CSS owns the document from the first byte.</p>\n<p>Taps: <b>";
h += textMark(__c, () => (taps()));
h += "</b></p>\n<button data-on-click=\"__h0\">tap</button>\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>The Bare Route - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"An interactive document without the shell's demo dressing.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
