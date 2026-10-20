
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';





const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [theme, setTheme] = persistState("theme", 'light');
  function toggle() { setTheme(theme() === 'light' ? 'dark' : 'light'); }

  
  
  
  Object.assign(handlers, { toggle });
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div class=\"persist-demo\">\n  <h1>Persisted state</h1>\n  <p>Theme: ";
h += textMark(__c, () => (theme()));
h += "</p>\n  <button data-on-click=\"toggle\">Toggle theme</button>\n  <p>The theme survives a reload (localStorage-backed $persist).</p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
