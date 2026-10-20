import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
// The query reaches an api handler two ways, and they agree: the Request's
  // own URL (`new URL(request.url).searchParams`) and the framework's
  // $query() - the same object a page render reads. Handlers receive a
  // Web-standard Request and return a plain object (serialized as JSON), a
  // Response (passed through), or nothing (204). Same code on the Node
  // server, the edge adapter, and the build's bake.
  export function GET(request: Request) {
    const url = new URL(request.url);
    return { said: url.searchParams.get('say') ?? '', viaQuery: $query().say ?? '' };
  }