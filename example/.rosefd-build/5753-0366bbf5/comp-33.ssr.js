
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // `{#key expr}` compiles to a one-element `{#each [expr]}`. Switching the
  // key tears the body down and builds it again (fresh nodes - an <input>
  // loses whatever was typed into it); re-rendering with the SAME key leaves
  // the nodes untouched, so typed text survives. That is the whole contract.
  const [tab, setTab] = state("tab", 'first');

  function first() { setTab('first'); }
  function second() { setTab('second'); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Key</h1>\n<p>\n  <button data-on-click=\"first\">First tab</button>\n  <button data-on-click=\"second\">Second tab</button>\n</p>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p>Showing the ";
h += textMark(__c, (__s) => (tab()), 1, __s);
h += " tab</p>\n  <input class=\"scratch\" value=\"\">";
 return h; };
h += eachMark(__c, () => ([tab()]), __b0_0);
h += "\n\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
