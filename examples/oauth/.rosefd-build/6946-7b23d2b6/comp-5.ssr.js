import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
// Sign out: expire the session cookie and go home. A GET, because it
  // must be reachable from a plain link - and the CSRF guard on
  // `rosefd serve` only refuses cross-site WRITES, which this is not.
  export function GET() {
    const res = new Response(null, { status: 302, headers: { location: '/' } });
    res.headers.append('set-cookie', $sessionCookie('session', '', { maxAge: 0 }));
    return res;
  }