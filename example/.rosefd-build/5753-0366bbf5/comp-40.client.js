
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const csr = false;
export const headers = {
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    'x-robots-tag': 'noindex',
  };



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The thorn: a page that ships zero JavaScript can also ship a
 // zero-script policy. `csr = false` keeps the bundle
 // and the bootstrap out of this document, and `headers`
  // replaces the framework defaults with a CSP that says exactly that -
  // stricter than any other page in the framework, and it still renders
  // perfectly, because there is nothing left to allow.
  
  

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>The Thorn</h1>\n<p>Every other page in this framework carries a strict CSP hashed over its exact inlined bytes. This one carries <code>default-src 'none'</code> - no scripts, no connections, no frames - and nothing breaks, because <code>csr = false</code> already kept every script out of the document.</p>\n<p>The policy is per route: an app tightens or relaxes the defaults exactly where it needs to, and the servers (Node, edge, and the Go single binary, which reads the same rules from <code>dist/headers.json</code>) all send it.</p>\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>The Thorn - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"A no-JS page with a no-script policy.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
