import { state, setState, persistState, $data, hasState, isSeeded, markSeeded, esc, refresh, onMount, onCleanup, $effect, getContext, $query, $t, bestLocale, localeDir, ensureLocale, loadLocale, handlers, directives, $cookies, $sessionCookie, $store, $udp, $tcp, $listen, $websocket, $mqtt, parseLoRaWAN, ActionError, $actionError, $actionErrorOrThrow, $actionPending, $boundaryFallback, $setBoundaryError, $boundaryError, $append, $prepend, $merge, applyStateDeltas, textMark, attrMark, boolAttrMark, ifMark, eachMark, headMark, rawMark, slotBlockMark, redirect, notFound, aggregate, loader, encodeSdui, decodeSdui } from './runtime.js';
// One post as JSON. The pool rides the request context (the middleware
  // opened it); an unknown id is a JSON 404, never the HTML page.
  interface PostRow { id: number; title: string; body: string; author: string }

  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

  export async function GET(req: Request) {
    const id = Number(new URL(req.url).pathname.split('/').pop());
    if (!id) return json({ error: 'id is required' }, 400);
    const db = await getContext().db();
    const post = await db.get<PostRow>('SELECT id, title, body, author FROM posts WHERE id = $1', [id]);
    if (!post) return json({ error: 'no post with that id' }, 404);
    return { post };
  }