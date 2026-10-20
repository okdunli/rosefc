import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
// GET /api/me - the walled half. The middleware already verified the
  // token; this route answers with the claims or refuses. A token that was
  // tampered with, signed with another secret, or expired never reaches
  // here with a user - the middleware's verification is the gate, and this
  // route is only the door.
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

  export function GET() {
    if (!process.env.JWT_SECRET) return json({ error: 'JWT_SECRET is not set - the server cannot verify tokens' }, 500);
    const user = getContext().user;
    if (!user) {
      const why = getContext().authError ?? 'no token presented';
      return json({ error: why }, 401);
    }
    return { sub: user.sub, name: user.name };
  }