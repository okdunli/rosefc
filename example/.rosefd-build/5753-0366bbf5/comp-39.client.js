
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const csp = { nonce: true };
export const csr = true;
export const store = $store('guests', ['Ada Lovelace', 'Grace Hopper']);



export async function render(closes, children, __props, __slots) {
  
  
  
  
 // This route asks for a NONCE policy instead of the hashed one. The
  // hash is rosefd's default and its strongest form, but it only holds while
  // the document the browser parses is byte-for-byte the document this server
  // wrote - and a CDN, WAF or A/B injector in between does not promise that.
  // One injected byte and the sha256 no longer matches, so the browser blocks
  // this page's own bundle. A nonce survives the rewrite, because the header
  // and the <script nonce> are minted together per response.
  //
  // The price is real, which is why it is opt-in per route: a nonce cannot
  // ride a baked file, so this route is never prerendered (the compiler puts
  // it in dynamicRoutes) and the Go single binary - which serves only baked
  // files - has nothing to serve for it. Everything else keeps the hash.
  //
  // Behind a rewriting proxy, the route ALSO wants 'strict-dynamic' (the
  // policy carries it) so a third-party loader this page pulls in may load
  // more scripts - the usual reason a deployment reaches for a nonce at all.
  

  // P1-3 (bug report): a bare <form method="POST"> no longer forces the
  // bundle - the compiler now knows the native submit works without one (the
  // action runs on the server, the response re-renders the page), so a page
  // whose form is the only interactive thing ships zero JS by default. This
  // page PROMISES the visitor "with JavaScript it submits without a page
  // reload", so it opts back in explicitly: csr = true is the statement that
  // the in-place adopt is wanted here, not an accident of the heuristic.
  

  // Server-side store. A real app would read/write a database here; $store
  // is what makes it shared across requests AND across cluster workers
 //: the write broadcasts to every worker, reads stay local, and
  // the action below and the page state see the same box. A plain
  // module-scope object would live in exactly one worker - signatures
  // would appear and vanish depending on which core answered.
  // (exported: the action is hoisted to module scope, so the store must
  // live there too - both sides of the component share this one box.)
  

 // The action GUARD - `beforeAction(name, form)` runs before every
  // action of this page, with the selected action's name and the submitted
  // FormData. Vetoing is an ActionError: the response carries its status
  // (403 here) and the page renders with the failure visible, instead of a
  // 500 or a silent no-op. A redirect stays the middleware's job - it
  // already runs for POSTs too. A real app checks the session here
  // (getContext().user, filled by pages/_middleware.rose); the demo's rule
  // is a capacity limit, so the failure is one click away in the browser.
  

  // Server action for the form below. Progressive enhancement:
  //   no JS  -> the browser POSTs natively, this runs on the server and the
  //             response re-renders the page (Server Actions elsewhere need JS)
  //   with JS-> the bootstrap intercepts the submit, POSTs via fetch, and
  //             adopts the response in place: one request, no reload.
  

  // The page renders from state; the store's snapshot seeds it per request.
  const [guests, setGuests] = state("guests", store.get());

  
  
  
  
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "\n  <div>\n    <h1>Guestbook 🌹</h1>\n    <p>Sign the book. This form works with JavaScript disabled - and with\n       JavaScript it submits without a page reload.</p>\n    ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p><strong>";
h += textMark(__c, (__s) => ($actionError().message), 0, __s);
h += "</strong></p>";
 return h; };
h += ifMark(__c, () => ($actionError()), __b0_0);
h += "\n    <form method=\"POST\">\n      <input name=\"name\" placeholder=\"Your name\" aria-label=\"Guestbook name\" required>\n      <button type=\"submit\">Sign</button>\n    </form>\n    <h2>Signatures</h2>\n    <ul>\n      ";
const __b0_1 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (guests()), __b0_1);
h += "\n    </ul>\n    <p><a href=\"/\">Back to the garden</a></p>\n  </div>\n";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
