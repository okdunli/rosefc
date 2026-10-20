
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [who, setWho] = state("who", 'World');
  const [count, setCount] = state("count", 0);
  function inc() { setCount(count() + 1); }
  function reset() { setCount(0); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div class=\"island-demo\">\n  <h1>Islands (T3)</h1>\n  <p>This paragraph is <strong>outside</strong> any <code>&#123;#island&#125;</code>: it ships as static HTML with no reactive markers, so it needs zero client JS and never hydrates.</p>\n\n  ";
h += "<div data-rv-island=\"counter\">";
h += "<div class=\"counter\">\n      <p>Hello ";
h += textMark(__c, () => (who()), 1);
h += "!</p>\n      <p>Count: ";
h += textMark(__c, () => (count()));
h += "</p>\n      <button data-on-click=\"inc\">Increment</button>\n      <button data-on-click=\"reset\">Reset</button>\n    </div>";
h += '</div>';
h += "\n\n  <p>This paragraph is <strong>also outside</strong> the island: still static, still hydration-free. The two buttons above are the only interactive region on the page.</p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Islands Demo - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"Partial hydration via islands: static HTML ships zero client JS, only the interactive region hydrates.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
