
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const csr = false;





export async function render(closes, children, __props, __slots) {
  
  
  
  
  // Pure content: no $state, no events, no lifecycle - and the document
 // proves it. `csr = false` keeps the client bundle OUT
  // of this document entirely: no runtime, no state script, zero
  // JavaScript for whoever lands here. The route's render function still
  // rides in the bundle, so a client-side navigation from an interactive
  // page paints it instantly and a static deploy's SPA fallback can
  // render it too - only the DOCUMENT is JS-free.
  

  // $data is server-side: it resolves during the render, on the baked and
  // the on-demand path alike, with no client code involved.
  const __seeded_bloomed = isSeeded("bloomed");
const [bloomed, setBloomed] = state("bloomed", null);
if (!__seeded_bloomed) { const __v_bloomed = await $data(async () => 'in full bloom'); setBloomed(__v_bloomed); markSeeded("bloomed"); }
  // The `🌹` token is rewritten by the demo plugin (example/rosefd.config.js)
  // before compilation - the source on disk keeps the token.
  const __seeded_mark = isSeeded("mark");
const [mark, setMark] = state("mark", null);
if (!__seeded_mark) { const __v_mark = await $data(async () => '🌹'); setMark(__v_mark); markSeeded("mark"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>The Garden</h1>\n<p>This page is ";
h += textMark(__c, () => (bloomed()), 1);
h += " ";
h += textMark(__c, () => (mark()), 1);
h += " - and it shipped without a single byte of JavaScript.</p>\n<p>No bundle, no state script, no hydration: the document is the whole cost, the way a static site would be - with the framework's data, layouts and head blocks still behind it.</p>\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>The Garden - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"A pure content page that ships zero JavaScript.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
