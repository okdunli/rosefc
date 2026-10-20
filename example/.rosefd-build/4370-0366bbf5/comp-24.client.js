
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  const docEntry = globalThis.__rosefdContent.get("docs", "getting-started");
  const docList = () => globalThis.__rosefdContent.list("docs");

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Docs</h1>\n<ul>\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s.title), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (docList()), __b0_0);
h += "\n</ul>\n<p>Reading time: ";
h += textMark(__c, () => (docEntry.readingTime), 1);
h += " min · ";
h += textMark(__c, () => (docEntry.wordCount), 1);
h += " words</p>\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<a ";
h += attrMark(__c, (__s) => ("#" + __s.id), 'href', __s);
h += ">";
h += textMark(__c, (__s) => (__s.text), 0, __s);
h += "</a>";
 return h; };
h += eachMark(__c, () => (docEntry.toc), __b0_1);
h += "\n<div>";
h += rawMark(__c, () => (globalThis.__rosefdContent.get("docs", "getting-started", { siteName: "Rose Frame Driver", version: "0.4.8" }).html));
h += "</div>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
