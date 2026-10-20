
import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';



export const params = { lang: ['en', 'zh', 'ar'] };





export async function render(closes, children, __props, __slots) {
  
  
  
  
  // The [lang] segment IS the locale: it arrives as state before the render
  // (the same param seeding as blog/[id]), and $t reads it reactively - a
  // locale switch re-runs the markers, so only the translated text repaints.
  const [lang, setLang] = state("lang", 'en');

  // Both dictionaries bake at build time, so the Go single binary serves
  // /en/about and /zh/about as plain static files; Node and edge render any
  // LISTED locale live, and a segment naming no dictionary answers 404 (the
  // URL is the contract - no duplicate content under a bogus language).
  // ar is a runtime pack (i18n.preload in rosefd.config.js): the server
  // bakes and renders it like any locale, and the CLIENT fetches its
  // dictionary the first time it paints /ar/about - one request, once.
  

  // {name} interpolation (the template parser has no nested braces, so the
  // call lives in a function: the marker closure runs it per repaint)
  function greeting() {
    return $t('about.greeting', { name: 'Rose Frame Driver' });
  }

 // ICU MessageFormat: a plural with an exact =0 arm, an ordinal,
  // and a select - each rendered for the locale's own plural categories
  // (Intl.PluralRules), so Arabic's zero/one/two/few/many/other arms all
  // resolve and # formats with the locale's digits.
  function plural(n: number) {
    return $t('about.plural', { count: n });
  }
  function ordinal() {
    return $t('about.ordinal', { n: 3 });
  }
  function role() {
    return $t('about.role', { who: 'rose' });
  }

  
  
  

  applyStateDeltas();
  const __root = (__c, children) => { let h = ''; const __snip = {};
h += "<div>\n  <h1>";
h += textMark(__c, () => ($t('about.heading')));
h += "</h1>\n  <p>";
h += textMark(__c, () => ($t('about.body')));
h += "</p>\n  <p>";
h += textMark(__c, () => (greeting()));
h += "</p>\n  <p>";
h += textMark(__c, () => ($t('about.current')), 1);
h += ": ";
h += textMark(__c, () => (lang()));
h += "</p>\n  <p>\n    ";
h += textMark(__c, () => ($t('about.switch')), 1);
h += ":\n    <a href=\"/en/about\">English</a>\n    <a href=\"/zh/about\">中文</a>\n    <a href=\"/ar/about\">العربية</a>\n  </p>\n  <h2>ICU MessageFormat</h2>\n  <p>";
h += textMark(__c, () => (plural(0)));
h += "</p>\n  <p>";
h += textMark(__c, () => (plural(1)));
h += "</p>\n  <p>";
h += textMark(__c, () => (plural(7)));
h += "</p>\n  <p>";
h += textMark(__c, () => (ordinal()));
h += "</p>\n  <p>";
h += textMark(__c, () => (role()));
h += "</p>\n  <p><a href=\"/about\">Back to the plain About page</a></p>\n</div>";
 return h; };
  let __html = await __root(closes, children);
const __head = () => { let __hd = ''; const __snip = {};
__hd += "\n  <title>";
__hd += esc($t('about.title'));
__hd += " - Rose Frame Driver</title>\n  <meta name=\"description\" ";
__hd += 'content="' + esc($t('about.heading')) + '"';
__hd += ">\n";
 return __hd; };
__html += headMark(closes, __head);
  return __html;
}
