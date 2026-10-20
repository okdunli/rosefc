
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div class=\"shell\" data-rosefd-c=\"_layout\">\n  <header class=\"site-header\">\n    <a class=\"brand\" href=\"/\">🌹 OAuth</a>\n    <nav>\n      <a href=\"/\">Home</a>\n      <a href=\"/dashboard\">Dashboard</a>\n    </nav>\n  </header>\n  <main>\n    ";
h += String(children);
h += "\n  </main>\n  <footer class=\"site-footer\">\n    One link, two redirects, one cookie — no OAuth library.\n  </footer>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>OAuth, the rosefd shape</title>\n";

__hd += "<style id=\"rosefd-style-_layout\">*,*::before,*::after{box-sizing:border-box;}:root{--bg:#faf9f8;--surface:#ffffff;--text:#201d1a;--muted:#6f6a63;--border:#e8e4de;--accent:#d6336c;--accent-strong:#b02a5b;--accent-soft:#fdf2f6;--danger:#c92a2a;--code-bg:#f3f1ee;--shadow:0 1px 2px rgba(28,25,23,.05),0 10px 30px -12px rgba(28,25,23,.12);}@media (prefers-color-scheme: dark){:root{--bg:#171412;--surface:#201c19;--text:#ece8e3;--muted:#a29b91;--border:#322d28;--accent:#ff5c8a;--accent-strong:#ff7ea3;--accent-soft:#2b1a20;--danger:#ff8787;--code-bg:#262220;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px -12px rgba(0,0,0,.5);}}html{-webkit-text-size-adjust:100%;}body{margin:0;padding:0;background:var(--bg);color:var(--text);font:16px/1.65 system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;}a{color:var(--accent);text-decoration:none;font-weight:inherit;}a:hover{text-decoration:underline;}h1{font-size:1.9rem;line-height:1.25;letter-spacing:-0.02em;margin:0 0 .5rem;}h2{font-size:1.2rem;letter-spacing:-0.01em;margin:0 0 .5rem;}p{margin:.5rem 0;}.lede{color:var(--muted);font-size:1.02rem;margin-bottom:1.5rem;}.meta{color:var(--muted);font-size:.85rem;}code{background:var(--code-bg);border:1px solid var(--border);border-radius:5px;padding:.1em .35em;font-size:.875em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}pre{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;padding:.9rem 1rem;overflow-x:auto;font-size:.85rem;line-height:1.55;margin:.75rem 0;}pre code{background:none;border:0;padding:0;}.shell{max-width:44rem;margin:0 auto;padding:0 1.25rem 3rem;}.site-header{display:flex;align-items:baseline;justify-content:space-between;padding:1.4rem 0 2.2rem;}.brand{font-weight:700;font-size:1.1rem;color:var(--text);letter-spacing:-0.01em;}.brand:hover{text-decoration:none;}.site-header nav a{margin-left:1.1rem;color:var(--muted);font-size:.95rem;}.site-header nav a:hover{color:var(--accent);text-decoration:none;}.site-footer{margin-top:3.5rem;padding-top:1.2rem;border-top:1px solid var(--border);color:var(--muted);font-size:.85rem;}.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);padding:1.4rem 1.5rem;margin:0 0 1.25rem;}.card > :first-child{margin-top:0;}.card > :last-child{margin-bottom:0;}.btn{display:inline-block;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:.55rem 1.1rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;}.btn:hover{background:var(--accent-strong);color:#fff;text-decoration:none;}.btn-ghost{background:transparent;color:var(--accent);border:1px solid var(--border);}.btn-ghost:hover{border-color:var(--accent);background:var(--accent-soft);color:var(--accent);}</style>"; return __hd; };
__html += headMark(closes, __head);
  return __html;
}
