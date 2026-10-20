
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [mode, setMode] = state("mode", 'list');
  const [count, setCount] = state("count", 3);

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div class=\"else-demo\">\n  <h1>Branch demo</h1>\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<ul>\n    <li>alpha</li>\n    <li>beta</li>\n  </ul>";
 return h; };
h += ifMark(__c, () => (mode() === 'list'), __b0_0);
const __b0_1 = (__s, __c) => { let h = ''; const __b1_0 = (__s, __c) => { let h = ''; h += "<p class=\"grid-view\">grid view</p>";
 return h; };
h += ifMark(__c, () => (mode() === 'grid'), __b1_0, __s);
const __b1_1 = (__s, __c) => { let h = ''; h += "<p class=\"no-view\">nothing selected</p>";
 return h; };
h += ifMark(__c, () => (!(mode() === 'grid')), __b1_1, __s);
 return h; };
h += ifMark(__c, () => (!(mode() === 'list')), __b0_1);
h += "\n  <p>count guard: ";
const __b0_2 = (__s, __c) => { let h = ''; h += "plenty";
 return h; };
h += ifMark(__c, () => (count() > 2), __b0_2);
const __b0_3 = (__s, __c) => { let h = ''; h += "few";
 return h; };
h += ifMark(__c, () => (!(count() > 2)), __b0_3);
h += "</p>\n  <button data-on-click=\"__h0\">grid</button>\n  <button data-on-click=\"__h1\">none</button>\n  <button data-on-click=\"__h2\">fewer</button>\n</div>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
