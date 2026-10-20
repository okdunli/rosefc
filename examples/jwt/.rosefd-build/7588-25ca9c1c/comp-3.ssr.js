
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The landing page: a working client for the two endpoints. The fetch
  // path is the JS one; the curl lines in the README are the no-JS one -
  // an api is the same api either way.
  const [result, setResult] = state("result", '');
  const [error, setError] = state("error", '');

  async function call(path: string, init?: RequestInit) {
    error('');
    const res = await fetch(path, init);
    const text = await res.text();
    if (res.ok) { result(text); } else { result(''); error(`${res.status} ${text}`); }
  }

  async function signIn(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const res = await fetch('/api/token', { method: 'POST', body: new FormData(form) });
    if (!res.ok) { error(`${res.status} ${await res.text()}`); result(''); return; }
    const body = await res.json();
    (form.querySelector('[name=token]') as HTMLInputElement).value = body.access_token;
    error('');
  }

  async function whoami(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const token = String(new FormData(form).get('token') ?? '');
    await call('/api/me', { headers: { authorization: `Bearer ${token}` } });
  }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<main data-rosefd-c=\"index\">\n  <h1>🌹 JWT, the rosefd shape</h1>\n  <p class=\"lede\">\n    Two endpoints: <code>POST /api/token</code> mints, <code>GET /api/me</code>\n    verifies. HS256 over Web Crypto — no library, no <code>node:</code> import,\n    and the same bundle runs on Node, the edge and a serverless function.\n  </p>\n\n  <form class=\"card\" data-on-submit=\"signIn\">\n    <h2>Mint a token</h2>\n    <input name=\"user\" placeholder=\"user\" aria-label=\"user\" value=\"ada\">\n    <input name=\"pass\" type=\"password\" placeholder=\"pass\" aria-label=\"pass\" value=\"lovelace\">\n    <button class=\"btn\" type=\"submit\">Get a token</button>\n  </form>\n\n  <form class=\"card\" data-on-submit=\"whoami\">\n    <h2>Verify</h2>\n    <input name=\"token\" placeholder=\"paste a token\" aria-label=\"token\">\n    <button class=\"btn btn-ghost\" type=\"submit\">Who am I?</button>\n  </form>\n\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p class=\"error\">";
h += textMark(__c, (__s) => (error()), 0, __s);
h += "</p>";
 return h; };
h += ifMark(__c, () => (error()), __b0_0);
h += "\n  ";
const __b0_1 = (__s, __c) => { let h = ''; h += "<pre>";
h += textMark(__c, (__s) => (result()), 0, __s);
h += "</pre>";
 return h; };
h += ifMark(__c, () => (result()), __b0_1);
h += "\n</main>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>JWT, the rosefd shape</title>\n";

__hd += "<style id=\"rosefd-style-index\">*,*::before,*::after{box-sizing:border-box;}:root{--bg:#faf9f8;--surface:#ffffff;--text:#201d1a;--muted:#6f6a63;--border:#e8e4de;--accent:#d6336c;--accent-strong:#b02a5b;--accent-soft:#fdf2f6;--danger:#c92a2a;--code-bg:#f3f1ee;--shadow:0 1px 2px rgba(28,25,23,.05),0 10px 30px -12px rgba(28,25,23,.12);}@media (prefers-color-scheme: dark){:root{--bg:#171412;--surface:#201c19;--text:#ece8e3;--muted:#a29b91;--border:#322d28;--accent:#ff5c8a;--accent-strong:#ff7ea3;--accent-soft:#2b1a20;--danger:#ff8787;--code-bg:#262220;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px -12px rgba(0,0,0,.5);}}html{-webkit-text-size-adjust:100%;}body{margin:0;padding:2rem 1.25rem 3rem;background:var(--bg);color:var(--text);font:16px/1.65 system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;}main{max-width:44rem;margin:0 auto;}a{color:var(--accent);text-decoration:none;font-weight:inherit;}a:hover{text-decoration:underline;}h1{font-size:1.9rem;line-height:1.25;letter-spacing:-0.02em;margin:0 0 .5rem;}h2{font-size:1.2rem;letter-spacing:-0.01em;margin:0 0 .5rem;}p{margin:.5rem 0;}.lede{color:var(--muted);font-size:1.02rem;margin-bottom:1.5rem;}code{background:var(--code-bg);border:1px solid var(--border);border-radius:5px;padding:.1em .35em;font-size:.875em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}pre{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;padding:.9rem 1rem;overflow-x:auto;font-size:.85rem;line-height:1.55;margin:.75rem 0;}pre code{background:none;border:0;padding:0;}.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);padding:1.4rem 1.5rem;margin:0 0 1.25rem;}.card > :first-child{margin-top:0;}.card > :last-child{margin-bottom:0;}.btn{display:inline-block;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:.55rem 1.1rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;}.btn:hover{background:var(--accent-strong);color:#fff;text-decoration:none;}.btn-ghost{background:transparent;color:var(--accent);border:1px solid var(--border);}.btn-ghost:hover{border-color:var(--accent);background:var(--accent-soft);color:var(--accent);}input{width:100%;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.55rem .75rem;margin:0 0 .8rem;}input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:var(--accent);}.error{color:var(--danger);font-weight:600;}@media (max-width: 560px){h1{font-size:1.5rem;}.card{padding:1.1rem 1.15rem;}}</style>"; return __hd; };
__html += headMark(closes, __head);
  return __html;
}
