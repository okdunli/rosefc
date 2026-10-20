
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [links, setLinks] = state("links", [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/en/about', label: 'About (i18n)' },
    { href: '/blog/1', label: 'Blog 1' },
    { href: '/blog/2', label: 'Blog 2' },
    { href: '/thorn', label: 'Thorn' },
    { href: '/search', label: 'Search' },
    { href: '/sign', label: 'Sign' }
  ]);

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <header class=\"rh\">\n    <strong class=\"rb\">🌹 Rose Frame Driver</strong>\n    <nav class=\"rn\">\n      ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<a ";
h += attrMark(__c, (__s) => (__s.href), 'href', __s);
h += ">";
h += textMark(__c, (__s) => (__s.label), 0, __s);
h += "</a>";
 return h; };
h += eachMark(__c, () => (links()), __b0_0);
h += "\n    </nav>\n  </header>\n  <main>\n    ";
h += String(children);
h += "\n  </main>\n  <footer class=\"rf\">\n    Rose Frame Driver — zero-hydration, compile-time reactivity\n  </footer>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Rose Frame Driver</title>\n  <meta name=\"generator\" content=\"Rose Frame Driver\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
