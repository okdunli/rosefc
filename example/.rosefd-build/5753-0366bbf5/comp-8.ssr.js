import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
export async function POST(request: Request) {
    const body = await request.json();
    const result = globalThis.__rosefdExtras.v.validate(body, {
      email: ["required", "email"],
      age: ["required", "number", "min:1", "max:120"],
      name: ["trim", "min:2"],
    });
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 422,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }