
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';









export async function render(closes, children, __props, __slots) {
  
  
  
  
  const [name, setName] = state("name", '');
  const [subscribed, setSubscribed] = state("subscribed", false);
  const [plan, setPlan] = state("plan", 'free');
  const [colors, setColors] = state("colors", []);
  const [lastKey, setLastKey] = state("lastKey", '');
  function clear() { setName(''); }
  // F17: keydown is NOT one of the delegated four (click/input/change/submit),
  // so this handler only runs because wire() binds it directly on the input.
  function noteKey(e: KeyboardEvent) { setLastKey(e.key || ''); }
  // F18: |window moves the binding off the element onto window itself
  // (Escape-to-close, scroll, resize) - keyup so it cannot cross-talk with
  // the keydown assertion above.
  const [winKey, setWinKey] = state("winKey", '');
  function noteWinKey(e: KeyboardEvent) { setWinKey(e.key || ''); }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div class=\"bind-demo\">\n  <h1>Two-way binding demo</h1>\n  <input ";
h += attrMark(__c, () => (name()), 'value');
h += " data-on-input=\"__rvbind_bind_demo_0\" data-on-change=\"__rvbind_bind_demo_0\" placeholder=\"Type your name\">\n  <p>Hello ";
h += textMark(__c, () => (name() || 'stranger'), 1);
h += "!</p>\n  <label>\n    <input type=\"checkbox\" ";
h += boolAttrMark(__c, () => (subscribed()), 'checked');
h += " data-on-change=\"__rvbind_bind_demo_1\">\n    Subscribe\n  </label>\n  <p>";
h += textMark(__c, () => (subscribed() ? 'Subscribed' : 'Not subscribed'));
h += "</p>\n  <fieldset>\n    <legend>Plan</legend>\n    <label><input type=\"radio\" name=\"plan\" value=\"free\" ";
h += boolAttrMark(__c, () => (plan() === "free"), 'checked');
h += " data-on-change=\"__rvbg_bind_demo_0\"> Free</label>\n    <label><input type=\"radio\" name=\"plan\" value=\"pro\" ";
h += boolAttrMark(__c, () => (plan() === "pro"), 'checked');
h += " data-on-change=\"__rvbg_bind_demo_1\"> Pro</label>\n  </fieldset>\n  <p>Plan: ";
h += textMark(__c, () => (plan()));
h += "</p>\n  <fieldset>\n    <legend>Colors</legend>\n    <label><input type=\"checkbox\" value=\"red\" ";
h += boolAttrMark(__c, () => (colors().includes("red")), 'checked');
h += " data-on-change=\"__rvbg_bind_demo_2\"> Red</label>\n    <label><input type=\"checkbox\" value=\"green\" ";
h += boolAttrMark(__c, () => (colors().includes("green")), 'checked');
h += " data-on-change=\"__rvbg_bind_demo_3\"> Green</label>\n  </fieldset>\n  <p>Colors: ";
h += textMark(__c, () => (colors().join(', ') || 'none'));
h += "</p>\n  <select ";
h += attrMark(__c, () => (plan()), 'value');
h += " data-on-input=\"__rvbind_bind_demo_2\" data-on-change=\"__rvbind_bind_demo_2\">\n    <option value=\"free\">Free plan</option>\n    <option value=\"pro\">Pro plan</option>\n  </select>\n  <button data-on-click=\"clear\">Clear</button>\n  <input class=\"key-probe\" data-on-keydown=\"noteKey\" placeholder=\"press a key\">\n  <p>Last key: ";
h += textMark(__c, () => (lastKey() || 'none'));
h += "</p>\n  <div class=\"win-probe\" data-onw-keyup=\"__h2\"></div>\n  <p>Win key: ";
h += textMark(__c, () => (winKey() || 'none'));
h += "</p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
  return __html;
}
