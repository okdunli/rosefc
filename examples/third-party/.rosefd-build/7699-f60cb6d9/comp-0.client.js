
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const csp = { nonce: true };

const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
 // This route opts into a NONCE policy instead of the hashed one.
  // The default policy is a sha256 over the exact bytes of the framework's
  // own bundle - perfect for a self-contained page, and useless the moment
  // the page needs to run someone else's script: the hash cannot name code
  // the app does not ship. A nonce is minted per response, the header and
  // every inline script in the document carry the same value, and
  // 'strict-dynamic' lets those trusted scripts pull in more.
  

  // The page itself is still an ordinary rosefd page: state, events, the
  // one-request contract. The third-party machinery lives entirely in the
  // <head> below.
  const [clicks, setClicks] = state("clicks", 0);

  
  
  
  Object.assign(handlers, { __h0: () => $setState('clicks', clicks() + 1) });
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<main data-rosefd-c=\"index\">\n<div class=\"card\">\n  <h1>🌹 Third-party scripts, the rosefd shape</h1>\n  <p>\n    This page runs a strict CSP with no <code>unsafe-inline</code> — and still\n    loads a third-party analytics library, off the main thread, through\n    Partytown. The route's own code is ordinary rosefd: one request, zero\n    hydration, the same single document.\n  </p>\n  <p>App interactions still work: <button class=\"btn\" data-on-click=\"__h0\">click</button> <strong>";
h += textMark(__c, () => (clicks()));
h += "</strong></p>\n  <p class=\"meta\">\n    View source: every inline <code>&lt;script&gt;</code> in the head carries the\n    same <code>nonce</code> as the <code>Content-Security-Policy</code> header —\n    that is the whole mechanism.\n  </p>\n</div>\n</main>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>Third-party scripts, the rosefd shape</title>\n\n  \n  ";
__hd += "<script>";
__hd += "\n    window.partytown = {\n      lib: '/_partytown/',           // where the lib is served from\n      forward: ['dataLayer.push'],   // which calls move to the worker\n    };\n  </script>";
__hd += "<script src=\"/vendor/partytown.js\">";
__hd += "</script>";
__hd += "<script type=\"text/partytown\" src=\"https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT-ID\">";
__hd += "</script>";
__hd += "<script type=\"text/partytown\">";
__hd += "\n    window.dataLayer = window.dataLayer || [];\n    function gtag(){ dataLayer.push(arguments); }\n    gtag('js', new Date());\n    gtag('config', 'G-MEASUREMENT-ID');\n  </script>";

__hd += "<style id=\"rosefd-style-index\">*,*::before,*::after{box-sizing:border-box;}:root{--bg:#faf9f8;--surface:#ffffff;--text:#201d1a;--muted:#6f6a63;--border:#e8e4de;--accent:#d6336c;--accent-strong:#b02a5b;--code-bg:#f3f1ee;--shadow:0 1px 2px rgba(28,25,23,.05),0 10px 30px -12px rgba(28,25,23,.12);}@media (prefers-color-scheme: dark){:root{--bg:#171412;--surface:#201c19;--text:#ece8e3;--muted:#a29b91;--border:#322d28;--accent:#ff5c8a;--accent-strong:#ff7ea3;--code-bg:#262220;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px -12px rgba(0,0,0,.5);}}html{-webkit-text-size-adjust:100%;}body{margin:0;padding:2rem 1.25rem 3rem;background:var(--bg);color:var(--text);font:16px/1.65 system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;}main{max-width:44rem;margin:0 auto;}a{color:var(--accent);text-decoration:none;font-weight:inherit;}a:hover{text-decoration:underline;}h1{font-size:1.9rem;line-height:1.25;letter-spacing:-0.02em;margin:0 0 .5rem;}p{margin:.5rem 0;}.meta{color:var(--muted);font-size:.85rem;}code{background:var(--code-bg);border:1px solid var(--border);border-radius:5px;padding:.1em .35em;font-size:.875em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);padding:1.4rem 1.5rem;margin:0 0 1.25rem;}.card > :first-child{margin-top:0;}.card > :last-child{margin-bottom:0;}.btn{display:inline-block;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:.55rem 1.1rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;}.btn:hover{background:var(--accent-strong);color:#fff;text-decoration:none;}</style>"; return __hd; };
__html += headMark(closes, __head);
  return __html;
}
