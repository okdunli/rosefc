
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';





const $setState = (key, value) => setState(key, value);



export async function render(closes, children, __props, __slots) {
  
  
  
  
  // {@const} is a compile-time binding: the name resolves to a value, not a
  // getter, so it never needs () at the use site. This page pins the
  // REACTIVITY contract: a const whose expression reads a signal must
  // re-evaluate when that signal moves - at the top level, inside a block,
  // and when one const builds on another. The Shadowing section pins the
  // SCOPING contract: a const may shadow a state of the same name (the
  // initializer still reads the signal, uses after it read the const), a
  // nested const of the same name builds on the outer one, and the state is
  // back in scope after the block closes. The same contract holds for the
  // bindings a block INTRODUCES: an {#each} item shadows every outer name
  // inside its body (here it shadows both the const and the state), and the
  // outer names are back after {/each}. The In handlers section pins the
  // third scope: a top-level const is hoisted into the render() scope, so an
  // on:click expression can read it (and reads the live value, not a
  // snapshot).
  const [price, setPrice] = state("price", 10);
  const [qty, setQty] = state("qty", 2);
  const [show, setShow] = state("show", true);
  const [stamped, setStamped] = state("stamped", 'none');
  const [rows, setRows] = state("rows", [{ n: 'a', p: 3 }, { n: 'b', p: 5 }]);
  function bump() { setQty(qty() + 1); }
  function toggle() { setShow(!show()); }

  
  
  const __rvct0 = () => (price() * qty());
const __rvct1 = () => ('total: ' + __rvct0());
const __rvct2 = () => (qty() * 1000);

  Object.assign(handlers, { bump, toggle, __h2: () => $setState('stamped', __rvct0()) });
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<h1>Const reactivity</h1>\n\n";
h += "\n";
h += "\n\n<p>direct: ";
h += textMark(__c, () => (price() * qty()));
h += "</p>\n<p>const: ";
h += textMark(__c, () => (__rvct0()));
h += "</p>\n<p ";
h += attrMark(__c, () => (__rvct0()), 'data-total');
h += ">attr: ";
h += textMark(__c, () => (__rvct0()));
h += "</p>\n<p>";
h += textMark(__c, () => (__rvct1()));
h += "</p>\n\n";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p class=\"big\">big total</p>";
 return h; };
h += ifMark(__c, () => (__rvct0() > 100), __b0_0);
const __b0_1 = (__s, __c) => { let h = ''; h += "<p class=\"small\">small total</p>";
 return h; };
h += ifMark(__c, () => (!(__rvct0() > 100)), __b0_1);
h += "\n\n";
const __b0_2 = (__s, __c) => { let h = ''; const __rvct3 = () => ('qty ' + qty());
h += "\n  <p class=\"badge\">";
h += textMark(__c, (__s) => (__rvct3()), 0, __s);
h += "</p>";
 return h; };
h += ifMark(__c, () => (show()), __b0_2);
h += "\n\n<h2>Per item</h2>\n<ul>\n";
const __b0_3 = (__s, __c) => { let h = ''; const __rvct4 = () => (__s.n + '=' + __s.p * qty());
h += "\n  <li>";
h += textMark(__c, (__s) => (__rvct4()), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (rows()), __b0_3);
h += "\n</ul>\n\n<h2>Shadowing</h2>\n";
h += "\n<p>shadow: ";
h += textMark(__c, () => (__rvct2()));
h += "</p>\n";
const __b0_4 = (__s, __c) => { let h = ''; const __rvct5 = () => (__rvct2() * 10);
h += "\n  <p>shadow in block: ";
h += textMark(__c, (__s) => (__rvct5()), 0, __s);
h += "</p>";
 return h; };
h += ifMark(__c, () => (show()), __b0_4);
h += "\n<p>signal after block: ";
h += textMark(__c, () => (qty()));
h += "</p>\n<ul class=\"each-shadow\">\n";
const __b0_5 = (__s, __c) => { let h = ''; const __rvct6 = () => (__s.n + ' x' + __s.p);
h += "\n  <li>";
h += textMark(__c, (__s) => (__rvct6()), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (rows()), __b0_5);
h += "\n</ul>\n<p>signal after each: ";
h += textMark(__c, () => (qty()));
h += "</p>\n\n<p>\n  <button data-on-click=\"bump\">Bump qty</button>\n  <button data-on-click=\"toggle\">Toggle</button>\n</p>\n\n<h2>In handlers</h2>\n<p>stamped: ";
h += textMark(__c, () => (stamped()));
h += "</p>\n<button class=\"stamp\" data-on-click=\"__h2\">Stamp total</button>\n\n<p><a href=\"/\">Back to the gate</a></p>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
