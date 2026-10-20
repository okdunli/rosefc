
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const shell = false;





export async function render(closes, children, __props, __slots) {
  
  
  
  
  
  

  const __seeded_d = isSeeded("d");
const [d, setD] = state("d", null);
if (!__seeded_d) { const __v_d = await $data(async () => ({
    skin: '<div class="fix-404"><h1> themed 404 </h1></div>',
    plain: '<div class="fix-404-plain"><h1> plain 404 </h1></div>',
  })); setD(__v_d); markSeeded("d"); }
  function skin() { return d().skin || ""; }
  function plain() { return d().plain || ""; }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
const __b0_0 = (__s, __c) => { let h = ''; h += rawMark(__c, (__s) => (skin()), __s);
 return h; };
h += ifMark(__c, () => (skin()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += rawMark(__c, (__s) => (plain()), __s);
 return h; };
h += ifMark(__c, () => (!skin()), __b0_1);
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>mirror 404 - Rose Frame Driver</title>\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
