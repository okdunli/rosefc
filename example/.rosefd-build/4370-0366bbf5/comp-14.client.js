
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';







export async function render(closes, children, __props, __slots) {
  
  
  
  
  // `{#await}` renders the pending branch on the server; the then/catch
  // branches live in the client bundle and flip when the promise settles.
  // The promise is created once per mount, so which branch a visit lands in
  // is fixed by the request: ?broken=1 hands the block a rejected promise
  // and the catch branch is what the client adopts.
  const broken = $query().broken === '1';

const [__rvAwait1, set__rvAwait1] = state("__rvawait1", { status: 'pending', value: null, error: null });
onMount(function () {
  Promise.resolve((broken ? Promise.reject(new Error('the index is gone')) : Promise.resolve(['Protocol v1', 'Protocol v2', 'Protocol v3']))).then(function (__rvAwaitVal) {
    set__rvAwait1({ status: 'resolved', value: __rvAwaitVal });
  }).catch(function (__rvAwaitErr) {
    set__rvAwait1({ status: 'rejected', error: __rvAwaitErr });
  });
});

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Await</h1>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p>Reading the index…</p>";
 return h; };
h += ifMark(__c, () => (__rvAwait1().status === 'pending'), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<ul>\n    ";
const __b1_0 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (__s), __b1_0);
h += "\n  </ul>";
 return h; };
h += eachMark(__c, () => ((__rvAwait1().status === 'resolved' ? [__rvAwait1().value] : [])), __b0_1);
h += "\n";
const __b0_2 = (__s, __c) => { let h = ''; h += "<p>Failed: ";
h += textMark(__c, (__s) => (__s.message), 0, __s);
h += "</p>";
 return h; };
h += eachMark(__c, () => ((__rvAwait1().status === 'rejected' ? [__rvAwait1().error] : [])), __b0_2);
h += "\n\n\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
