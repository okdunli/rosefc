
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const revalidate = 2;
export const renders = { n: 0 };





export async function render(closes, children, __props, __slots) {
  
  
  
  
 // ISR: the build bakes this page once, and the preview
  // server keeps it fresh - serving the baked file for up to `revalidate`
  // seconds, then answering the next request STALE (instant, from disk)
  // while a background pass re-renders and swaps the file. The usual name is
  // this ISR; here it is one exported constant and zero configuration.
     // seconds

  // module-level: one per render pass, so the stamp proves which render
  // produced the document you are reading
  

  const __seeded_stamp = isSeeded("stamp");
const [stamp, setStamp] = state("stamp", null);
if (!__seeded_stamp) { const __v_stamp = await $data(async () => {
    renders.n += 1;
    return 'render #' + renders.n;
  }); setStamp(__v_stamp); markSeeded("stamp"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Fresh</h1>\n<p>this document is ";
h += textMark(__c, () => (stamp()), 1);
h += " - the baked file is at most 2 seconds old</p>\n<p>the stamp advances without a rebuild: stale-while-revalidate</p>\n<p><a href=\"/\">Back to the garden</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
