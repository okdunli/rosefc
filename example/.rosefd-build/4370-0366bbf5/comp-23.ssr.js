
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [n, setN] = state("n", 2);
  const sq = () => (n() * n());
  function bump() { setN(n() + 1); }
  const [m, setM] = state("m", 10);
  // F36: functional update - the setter receives the current value.
  function fnBump() { setM((x: number) => x + 5); }
  const [numv, setNumv] = state("numv", 5);
  // F43: $effect - mirrors n*7 into state; the returned cleanup counts disposals.
  const [mirror, setMirror] = state("mirror", 0);
  // F43: $effect - mirrors n*7 into state; the returned cleanup counts
  // disposals on a GLOBAL so the client smoke test can observe them across
  // navigations (a local counter dies with the route's module scope).
  $effect(() => {
    setMirror(n() * 7);
    return () => { (globalThis as any).__effCleanup = ((globalThis as any).__effCleanup || 0) + 1; };
  });
  const [keyedItems, setKeyedItems] = state("keyedItems", [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]);
  function shuffle() {
    const xs = keyedItems();
    setKeyedItems([xs[2], xs[0], xs[1]]);
  }
  const [selm, setSelm] = state("selm", []);
  const [dopen, setDopen] = state("dopen", true);
  globalThis.__rosefdTransitions = globalThis.__rosefdTransitions || {};
  globalThis.__rosefdTransitions.pulse = function (el: HTMLElement, d: number) {
    el.style.opacity = '0.4';
    const id = setTimeout(function () { el.style.opacity = ''; }, d);
    return function () { clearTimeout(id); };
  };
const [__rvDefer1, set__rvDefer1] = state("__rvdefer1", false);
onMount(function () { setTimeout(function () { set__rvDefer1(true); }, 400); });

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <p>骨架之后的内容</p>\n  ";
const __b0_0 = (__s, __c) => { let h = ''; h += "<p>延迟渲染：大块内容</p>";
 return h; };
h += ifMark(__c, () => (__rvDefer1()), __b0_0);
h += "\n";
const __b0_1 = (__s, __c) => { let h = ''; h += "<div class=\"rv-defer-loading\"></div>";
 return h; };
h += ifMark(__c, () => (!__rvDefer1()), __b0_1);
h += "\n  <p>页面尾部</p>\n  <ul class=\"deftest-list\">\n    ";
const __b0_2 = (__s, __c) => { let h = ''; h += "<li data-transition=\"stagger\" class=\"deftest-item\">";
h += textMark(__c, (__s) => (__s), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (['One', 'Two', 'Three', 'Four']), __b0_2);
h += "\n  </ul>\n  <p data-transition=\"in:fade\" class=\"trans-in\">in only</p>\n  <p data-transition=\"out:fade\" class=\"trans-out\">out only</p>\n  <p data-transition=\"fade\" class=\"trans-both\">both</p>\n  <button class=\"derived-btn\" data-on-click=\"bump\">bump</button>\n  <p class=\"derived-out\">";
h += textMark(__c, () => (sq()));
h += "</p>\n  ";
__snip.chip = (__s, __c,label,tone) => { let h = ''; h += "<span ";
h += attrMark(__c, (__s) => ("chip chip-" + (tone)), 'class', __s);
h += ">";
h += textMark(__c, (__s) => (label), 0, __s);
h += "</span>";
 return h; };
h += "\n  <div class=\"snip-out\">";
h += ((__snip && __snip.chip) ? __snip.chip(null, __c, 'hello', 'ok') : '');
h += ((__snip && __snip.chip) ? __snip.chip(null, __c, sq(), 'n') : '');
h += "</div>\n  <ul class=\"keyed-list\">\n    ";
const __b0_4 = (__s, __c) => { let h = ''; h += "<li class=\"keyed-item\">";
h += textMark(__c, (__s) => (__s.label), 0, __s);
h += "</li>";
 return h; };
h += eachMark(__c, () => (keyedItems()), __b0_4, (__s, __i) => (__s.id));
h += "\n  </ul>\n  <button class=\"keyed-shuffle\" data-on-click=\"shuffle\">shuffle</button>\n  <select class=\"selm\" multiple ";
h += attrMark(__c, () => (selm().join(',')), 'data-selmulti');
h += " data-on-change=\"__rvbind_deftest_0\">\n    <option value=\"x\">X</option>\n    <option value=\"y\">Y</option>\n  </select>\n  <p class=\"selm-out\">";
h += textMark(__c, () => (selm().join('|')));
h += "</p>\n  <p data-transition=\"pulse\" class=\"pulse-demo\">pulse</p>\n  <p data-transition=\"in:spin\" class=\"spin-demo\">spin</p>\n  <p class=\"ap-out\">";
h += textMark(__c, () => ($actionPending()));
h += "</p>\n  <p data-transition=\"fade:duration: 200\" class=\"p30\">p30</p>\n  <p data-transition=\"fade:duration: 500, delay: 100, easing: 'ease-in-out'\" class=\"f41-trans\">f41</p>\n  <details class=\"dt\" ";
h += boolAttrMark(__c, () => (dopen()), 'open');
h += " data-on-toggle=\"__rvbind_deftest_1\"><summary>s</summary><p>body</p></details>\n  <p class=\"dt-out\">";
h += textMark(__c, () => (dopen() ? 'open' : 'closed'));
h += "</p>\n  <p ";
h += attrMark(__c, () => (((v) => v == null ? "cls-obj" : typeof v === 'object' ? ({ "cls-obj": true, ...v }) : ("cls-obj" + ' ' + v))({ a: true, b: false, c: 1 })), 'class');
h += ">x</p>\n  <p class=\"sty-obj\" ";
h += attrMark(__c, () => ({ color: 'red', margin: 0 }), 'style');
h += ">y</p>\n  <button class=\"fn-up\" data-on-click=\"fnBump\">fn +5</button>\n  <p class=\"fn-out\">";
h += textMark(__c, () => (m()));
h += "</p>\n  <input class=\"num-in\" type=\"number\" ";
h += attrMark(__c, () => (numv()), 'value');
h += " data-on-input=\"__rvbind_deftest_2\" data-on-change=\"__rvbind_deftest_2\" />\n  <p class=\"num-out\">";
h += textMark(__c, () => (numv() ?? 'empty'));
h += "</p>\n  <p class=\"eff-mirror\">";
h += textMark(__c, () => (mirror()));
h += "</p>\n  <p data-animate=\"flip:duration: 400\" class=\"anim-demo\">anim</p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "<title>Deftest</title>";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
