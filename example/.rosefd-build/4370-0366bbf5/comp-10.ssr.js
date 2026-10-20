import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
// Bake the GET body into dist/api/hello.json at build time: the Go single
  // binary serves this read-only API with zero Node. Drop the flag (or return
  // something request-dependent) and the route stays live on Node/edge only.
  export const prerender = true;

  // Handlers receive a Web-standard Request and return a plain object
  // (serialized as JSON), a Response (passed through), or nothing (204).
  // Same code on the Node server, the edge adapter, and the build's bake.
  export function GET() {
    return { hello: 'Rose Frame Driver', framework: 'one request, zero hydration' };
  }

  export async function POST(req: Request) {
    const form = await req.formData();
    const name = String(form.get('name') || 'world').trim();
    return { hello: name };
  }