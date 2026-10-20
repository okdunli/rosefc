
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export function render(closes, children, __props, __slots) {
  const __p = __props || {};
  
  const fact = __p.fact ?? ('a fact about Rose Frame Driver');
  
 // A reusable component: a prop with a default and nothing
  // else - the cheapest shape that is still a real component instead of a
  // copy-pasted <li>. about.rose imports it by relative path and renders one
  // per fact; the compiler compiles it into the same module space as the
  // pages, so there is no component runtime to ship and no wrapper node the
  // DOM has to adopt.
  

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<li class=\"fact\">🌹 ";
h += textMark(__c, () => (fact));
h += "</li>";
 return h; };
  let __html = __root(closes, children);
  return __html;
}
