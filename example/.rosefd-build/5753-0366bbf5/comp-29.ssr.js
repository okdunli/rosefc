
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // Regression guard (bug hunt: xoboe themed 404): a layout that guards its
  // <slot/> with a block emits the page's <head> block INSIDE that block. The
  // nested wire pass must not claim the head markers - only the pass that owns
  // the document <head> may - or every client navigation fell back to the
  // layout's title/meta.
  const [open, setOpen] = state("open", true);

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
const __b0_0 = (__s, __c) => { let h = ''; h += String(children);
 return h; };
h += ifMark(__c, () => (open()), __b0_0);
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Guarded Layout - Rose Frame Driver</title>\n  <meta name=\"x-guard\" content=\"layout\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
