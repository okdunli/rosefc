
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';





const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The write page. Two forms, both progressive-enhancement honest:
  //
  //   with JS    - the submit handler fetch-POSTs to the api route and
  //                refresh()es the page in place: one request, no reload
  //   without JS - the form posts natively to the same api route; the
  //                cookie is set / the row is written, and the next visit
  //                shows the result
  //
  // The wall itself is NOT here: without a session the middleware loads
  // no posts and the api refuses writes, so this page renders its login
  // form and nothing else. `signedIn` below is UX only - it remembers in
  // this tab that the login fetch succeeded, because an HttpOnly cookie
  // is deliberately unreadable from JavaScript.
  interface Post { id: number; title: string; body: string; author: string }

  const [signedIn, setSignedIn] = state("signedIn", false);
  const [error, setError] = state("error", '');

  // Server render: the middleware's context. Client-side navigation: the
  // same rows from the api (the honest cost of fresh server data after a
  // SPA navigation - one request, exactly like the demo's /feed). The
  // fetch is client-only: Node's fetch rejects a relative URL, and on the
  // server the context is the answer.
  const __seeded_user = isSeeded("user");
const [user, setUser] = state("user", null);
if (!__seeded_user) { const __v_user = await $data(async () => getContext().user ?? null); setUser(__v_user); markSeeded("user"); }
  const __seeded_posts = isSeeded("posts");
const [posts, setPosts] = state("posts", null);
if (!__seeded_posts) { const __v_posts = await $data(async (): Promise<Post[] | null> =>
    getContext().posts ?? (signedIn() && typeof location !== 'undefined' ? (await (await fetch('/api/posts')).json()).posts : null)); setPosts(__v_posts); markSeeded("posts"); }

  async function login(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const res = await fetch('/api/login', { method: 'POST', body: new FormData(form) });
    if (res.ok) {
      signedIn(true);
      error('');
    } else {
      error('wrong user or password');
    }
  }

  async function publish(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const res = await fetch('/api/posts', { method: 'POST', body: new FormData(form) });
    if (res.ok) {
      error('');
      form.reset();
      await refresh();
    } else {
      error(await res.text());
    }
  }

  
  
  
  Object.assign(handlers, { publish, login });
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Write</h1>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p class=\"lede\">Signed in. A new post is live the moment it is written — no rebuild.</p>\n  ";
const __b1_0 = (__s, __c) => { let h = ''; h += "<p class=\"error\">";
h += textMark(__c, (__s) => (error()), 0, __s);
h += "</p>";
 return h; };
h += ifMark(__c, () => (error()), __b1_0, __s);
h += "\n  <form class=\"card\" data-on-submit=\"publish\">\n    <input name=\"title\" placeholder=\"Title\" aria-label=\"Title\" required>\n    <textarea name=\"body\" placeholder=\"Body\" aria-label=\"Body\" rows=\"4\" required></textarea>\n    <button class=\"btn\" type=\"submit\">Publish</button>\n  </form>\n  <h2>Published</h2>\n  <div class=\"cards\">\n    ";
const __b1_1 = (__s, __c) => { let h = ''; h += "<a class=\"card\" ";
h += attrMark(__c, (__s) => ('/__s/' + __s.id), 'href', __s);
h += ">\n        <h2>";
h += textMark(__c, (__s) => (__s.title), 0, __s);
h += "</h2>\n      </a>";
 return h; };
h += eachMark(__c, () => (posts() ?? []), __b1_1);
h += "\n  </div>";
 return h; };
h += ifMark(__c, () => (signedIn() || user()), __b0_0);
h += "\n\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<p class=\"lede\">Sign in to write. The demo account is <code>ada</code> / <code>lovelace</code>.</p>\n  ";
const __b1_0 = (__s, __c) => { let h = ''; h += "<p class=\"error\">";
h += textMark(__c, (__s) => (error()), 0, __s);
h += "</p>";
 return h; };
h += ifMark(__c, () => (error()), __b1_0, __s);
h += "\n  <form class=\"card\" method=\"POST\" action=\"/api/login\" data-on-submit=\"login\">\n    <input name=\"user\" placeholder=\"User\" aria-label=\"User\" required>\n    <input name=\"pass\" type=\"password\" placeholder=\"Password\" aria-label=\"Password\" required>\n    <button class=\"btn\" type=\"submit\">Sign in</button>\n  </form>";
 return h; };
h += ifMark(__c, () => (!signedIn() && !user()), __b0_1);
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
