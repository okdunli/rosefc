
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // $data runs per request on the server (never on the client), so it reads
  // the middleware's context: this page greets the viewer the server saw.
  // A static deploy never runs the middleware - the client render then sees
  // no user and shows the public shell, so the wall holds either way.
  const __seeded_user = isSeeded("user");
const [user, setUser] = state("user", null);
if (!__seeded_user) { const __v_user = await $data(async () => getContext().user ?? null); setUser(__v_user); markSeeded("user"); }

  // refresh() re-renders this route in place: $data re-reads the context,
  // zero requests, no navigation. It is also what keeps this route on the
  // streaming path - the demo's dynamic INTERACTIVE page, so the streamed
  // document (shell first, state script + bundle after) has a home now
  // that content routes like /blog/:id compile to zero-JS by themselves
  async function reload() {
    await refresh();
  }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Admin</h1>\n<p>";
h += textMark(__c, () => (user() ? 'Hello, ' + user().name + ' - the thorn garden.' : 'Please sign in.'));
h += "</p>\n<button data-on-click=\"reload\">Refresh</button>\n<p><a href=\"/sign\">Go to the sign page</a></p>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Admin - Rose Frame Driver</title>\n  <meta name=\"description\" content=\"The deep wall: content gated by the request context.\">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
