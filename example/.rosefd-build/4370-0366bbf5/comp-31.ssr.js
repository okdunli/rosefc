
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const store = { likes: 41 };
export async function like() {
    store.likes += 1;
    return { likes: store.likes };
  }


const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // Server-side store, hoisted to module scope: shared across requests, the
  // action, and the page state below. (A real app would use a database.)
  

  const [count, setCount] = state("count", 0);
  const [name, setName] = state("name", 'Rose Frame Driver');
  const [items, setItems] = state("items", ['Performance', 'Simplicity', 'Zero-hydration']);
  const [showFeatures, setShowFeatures] = state("showFeatures", true);
  const [guests, setGuests] = state("guests", ['🌹 the founder']);
  const [likes, setLikes] = state("likes", store.likes);

  function increment() { setCount(count() + 1); }
  function addItem() { setItems([...items(), 'Item ' + items().length + 1]); }
  function toggleFeatures() { setShowFeatures(!showFeatures()); }
  // Zero-request form: no POST, no fetch - the action runs client-side and
  // fine-grained reactivity repaints only what changed. (HTML-over-the-wire stacks
  // pay one server round-trip per submit.)
  function signGuestbook(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const guest = String(new FormData(form).get('name') || '').trim();
    if (guest) setGuests([guest, ...guests()]);
    form.reset();
  }
  // A widget whose data source is offline. Inside {#boundary} its throw is
  // contained: only this section degrades, the rest of the page renders.
  function weather() {
    throw new Error('weather service unreachable');
  }

  // A named server action, reachable from any event handler:
  // on:click={like} below compiles to $action('like') - one POST, one
  // request, in-place adopt, fine-grained patch. Server-only: this body
  // never ships to the client bundle (only forms work without JS).
  

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div data-rosefd-c=\"index\">\n  <h1>Welcome to ";
h += textMark(__c, () => (name()), 1);
h += " 🌹</h1>\n  <p>Count: <strong>";
h += textMark(__c, () => (count()));
h += "</strong></p>\n  <button data-on-click=\"increment\">Increment</button>\n  <button data-on-click=\"toggleFeatures\">";
h += textMark(__c, () => (showFeatures() ? 'Hide' : 'Show'), 1);
h += " Features</button>\n\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<h2>Features</h2>\n  <ul>\n    ";
const __b1_0 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (items()), __b1_0);
h += "\n  </ul>\n  <button data-on-click=\"addItem\">Add Item</button>";
 return h; };
h += ifMark(__c, () => (showFeatures()), __b0_0);
h += "\n\n  <h2>Guestbook</h2>\n  <form data-on-submit=\"signGuestbook\">\n    <input name=\"name\" placeholder=\"Your name\" aria-label=\"Guestbook name\">\n    <button type=\"submit\">Sign</button>\n  </form>\n  <ul>\n    ";
const __b0_1 = (__s, __c) => { let h = ''; h += "<li>";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (guests()), __b0_1);
h += "\n  </ul>\n\n  <h2>Likes</h2>\n  <div class=\"rcard\">\n    <p>🌹 <strong>";
h += textMark(__c, () => (likes()));
h += "</strong> likes</p>\n    <button data-on-click=\"$action:like\">Like</button>\n  </div>\n\n  ";
const __b0_2 = (__c) => { let h = ''; h += "<section>\n    <h2>Weather</h2>\n    <p>";
h += textMark(__c, () => (weather()));
h += "</p>\n  </section>";
 return h; };
let __bd0_2 = '';
try { __bd0_2 = __b0_2(__c); } catch (e) { $setBoundaryError(e); __bd0_2 = "<p>This section failed to render.</p>"; }
h += __bd0_2;
h += "\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; __hd += "<style id=\"rosefd-style-index\">[data-rosefd-c=\"index\"] .rcard{background:#fff0f5;border-left:4px solid #e91e63;padding:0.75rem 1rem;border-radius:0 6px 6px 0;}</style>"; return __hd; };
__html += headMark(closes, __head);
  return __html;
}
