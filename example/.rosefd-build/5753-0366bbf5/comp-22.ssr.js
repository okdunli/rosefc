
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // `{#defer}` is the streaming primitive: the server flushes a loading
  // placeholder in place of the block and the real content arrives later.
  // On the client the same block is one {#if} flipped by a timer, so the
  // adopt path has to line the two up - the placeholder leaves, the content
  // takes its place, and nothing else on the page moves.
const [__rvDefer1, set__rvDefer1] = state("__rvdefer1", false);
onMount(function () { setTimeout(function () { set__rvDefer1(true); }, 50); });

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Defer</h1>\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p>延迟渲染：大块内容</p>";
 return h; };
h += ifMark(__c, () => (__rvDefer1()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<div class=\"rv-defer-loading\"></div>";
 return h; };
h += ifMark(__c, () => (!__rvDefer1()), __b0_1);
h += "\n<p>页面尾部</p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
