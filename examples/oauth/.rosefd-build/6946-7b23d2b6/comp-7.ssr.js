
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The public home. The sign-in link is a plain <a> to the api route that
  // starts the OAuth dance - it works with JavaScript disabled, because
  // the dance is a sequence of ordinary HTTP redirects.
  const __seeded_user = isSeeded("user");
const [user, setUser] = state("user", null);
if (!__seeded_user) { const __v_user = await $data(async () => getContext().user ?? null); setUser(__v_user); markSeeded("user"); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>🌹 OAuth, the rosefd shape</h1>\n<p class=\"lede\">\n  This app signs people in with any OAuth 2.0 provider — GitHub, Google, an\n  OIDC server, or the fake one the test suite runs locally. One link, two\n  redirects, one cookie.\n</p>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<div class=\"card\">\n    <p>Signed in as <strong>";
h += textMark(__c, (__s) => (user()!.name), 0, __s);
h += "</strong>.</p>\n    <p><a class=\"btn\" href=\"/dashboard\">Go to the dashboard</a></p>\n  </div>";
 return h; };
h += ifMark(__c, () => (user()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<div class=\"card\">\n    <p><a class=\"btn\" href=\"/api/auth/login\">Sign in</a></p>\n    <p class=\"meta\">Or open the <a href=\"/dashboard\">dashboard</a> to see the wall.</p>\n  </div>";
 return h; };
h += ifMark(__c, () => (!user()), __b0_1);
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
