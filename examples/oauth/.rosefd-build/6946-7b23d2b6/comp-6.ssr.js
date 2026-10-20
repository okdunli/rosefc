
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The walled page. Without a session the middleware put no user in the
  // context, so this page renders the prompt and the gated content never
  // exists in the response - the same document a static deploy would show.
  const __seeded_user = isSeeded("user");
const [user, setUser] = state("user", null);
if (!__seeded_user) { const __v_user = await $data(async () => getContext().user ?? null); setUser(__v_user); markSeeded("user"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Dashboard</h1>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<div class=\"card\">\n    <p>Welcome back, <strong>";
h += textMark(__c, (__s) => (user()!.name), 0, __s);
h += "</strong>. This page only exists in the response for a signed-in visitor.</p>\n    <p><a class=\"btn btn-ghost\" href=\"/api/auth/logout\">Sign out</a></p>\n  </div>";
 return h; };
h += ifMark(__c, () => (user()), __b0_0);
h += "\n\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<div class=\"card\">\n    <p>This is the gated half of the app. <a class=\"btn\" href=\"/api/auth/login\">Sign in</a> to see it.</p>\n  </div>";
 return h; };
h += ifMark(__c, () => (!user()), __b0_1);
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
