
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';





const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // Nesting stress: {#each} -> {#if} -> {#each} -> {#if}, all driven by one
  // signal pair. Every level's adopt must tear down exactly its own range -
  // a stray node or a double-run effect shows up as duplicated rows or a
  // leftover branch after the flips settle.
  const [groups, setGroups] = state("groups", [
    { id: 'a', label: 'Group A', on: true, items: ['a1', 'a2'] },
    { id: 'b', label: 'Group B', on: false, items: ['b1'] },
  ]);
  const [showOff, setShowOff] = state("showOff", true);

  function flipAll() {
    setGroups((gs: { on: boolean }[]) => gs.map((g) => ({ ...g, on: !g.on })));
  }
  function addItem() {
    setGroups((gs: { items: string[] }[]) => gs.map((g, i) => (i === 0 ? { ...g, items: [...g.items, 'a' + (g.items.length + 1)] } : g)));
  }
  function hideOff() { setShowOff(!showOff()); }

  
  
  
  Object.assign(handlers, { flipAll, addItem, hideOff });
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Nesting</h1>\n<p>\n  <button data-on-click=\"flipAll\">Flip all</button>\n  <button data-on-click=\"addItem\">Add item</button>\n  <button data-on-click=\"hideOff\">Toggle off-groups</button>\n</p>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<section>\n    <h2>";
h += textMark(__c, (__s) => (__s.label), 0, __s);
h += "</h2>\n    ";
const __b1_0 = (__s, __c) => { let h = ''; h += "<p class=\"on\">on</p>\n      ";
const __b2_0 = (__s, __c) => { let h = ''; h += "<span class=\"item\">";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</span>";
 return h; };
h += eachMark(__c, () => (__s.items), __b2_0);
 return h; };
h += ifMark(__c, () => (__s.on), __b1_0, __s);
const __b1_1 = (__s, __c) => { let h = ''; const __b2_0 = (__s, __c) => { let h = ''; h += "<p class=\"off\">off</p>";
 return h; };
h += ifMark(__c, () => (showOff()), __b2_0, __s);
 return h; };
h += ifMark(__c, () => (!(__s.on)), __b1_1, __s);
h += "\n  </section>";
 return h; };
h += eachMark(__c, () => (groups()), __b0_0);
h += "\n\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
