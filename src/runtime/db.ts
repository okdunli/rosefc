// src/runtime/db.ts - the database helper tier for pages/api/*.rose handlers.
//
// Rose ships no database driver: pg, mysql2 and node:sqlite are three
// incompatible shapes, and none of them belongs in a runtime whose entire
// published dependency list is esbuild. So the app supplies ONE object that
// can run a query - the `Driver` below - and every handler talks to the typed
// helpers in this file. Swapping SQLite for Postgres is then a one-file
// change (the driver), not a rewrite of twenty routes.
//
// WIRING (once, at boot, in a server-only place - src/pages/_middleware.rose,
// or a module that file imports; never a page: a page script ships to the
// browser). Register there, and handlers call q()/q1()/tx() with no driver
// import at all.
//
//   // Postgres. connect() is what makes tx() correct: a pool hands out a
//   // different connection per query, so BEGIN/COMMIT on `pool.query` would
//   // run on different sockets. One connection for the whole transaction.
//   import { Pool } from 'pg';
//   import { registerDb } from '../../src/runtime/db';   // flat-build-relative
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//   registerDb({
//     query: (sql, params) => pool.query(sql, params as any[]),
//     async connect() {
//       const c = await pool.connect();
//       return { query: (sql, params) => c.query(sql, params as any[]), release: () => c.release() };
//     },
//   });
//
//   // mysql2/promise is the same two lines over `pool.execute`.
//
//   // SQLite via node:sqlite: no connect() - one connection IS the pool, so
//   // tx() sends BEGIN/COMMIT/ROLLBACK through query() on it.
//   const sqlite = new DatabaseSync('blog.db');
//   registerDb({ query: async (sql, params) => ({ rows: sqlite.prepare(sql).all(...(params ?? [])) }) });
//
// Then, in any handler:
//
//   const posts = await q<PostRow>('SELECT * FROM posts ORDER BY id DESC');
//   const post  = await q1<PostRow>('SELECT * FROM posts WHERE id = ?', [id]);   // null when absent
//   await tx(async (t) => {                                                     // all or nothing
//     await t.q1('INSERT INTO posts (title) VALUES (?) RETURNING id', [title]);
//     await t.q('UPDATE counters SET n = n + 1 WHERE k = ?', ['posts']);
//   });
//
// A handler that returns q()'s rows is enough on its own: an exported API
// function's plain object return value is serialized as JSON.
//
// The driver lives on globalThis, not in a module-level `let`, because the
// runtime is bundled once per page (sliced and per-page inline bundles each
// carry their own copy of this module) - a module-level variable would be
// per-copy, so a route would see "no driver registered" from a different
// bundle's registration. Same reason the rest of the server runtime publishes
// itself through __rosezmAuth / __rosezmKvApi / __rosezmExtras.
//
// Zero dependencies: no import statement in this file at all.

/** The one thing an app must supply. `query` is async even for a sync driver. */
export interface Driver {
  query(sql: string, params?: readonly unknown[]): Promise<{ rows: any[] }>;
  /**
   * Optional: a dedicated connection for a transaction, released when tx()
   * ends. Required for a POOL (pg, mysql2) - without it tx() runs BEGIN and
   * COMMIT through query() and two different sockets would each hold half a
   * transaction.
   */
  connect?(): Promise<Conn>;
}

/** What connect() returns: the connection, plus the release that returns it. */
export interface Conn extends Driver {
  release(): void | Promise<void>;
}

/** The query helpers. What tx() hands its callback, so it cannot nest. */
export interface Queries {
  /** Every matching row. `[]` when none match. */
  q<T = any>(sql: string, params?: readonly unknown[]): Promise<T[]>;
  /** The first matching row, or null. Rows are untyped - you name the shape. */
  q1<T = any>(sql: string, params?: readonly unknown[]): Promise<T | null>;
}

/** The registered database: the query helpers plus transactions. */
export interface Db extends Queries {
  tx<T>(fn: (t: Queries) => Promise<T> | T): Promise<T>;
}

const KEY = '__rosezmDb';

const slot = () => globalThis as unknown as Record<string, Driver | undefined>;

/**
 * Publish the app's driver. Call once at boot, before the first request;
 * calling again (a dev hot reload) simply replaces it.
 */
export function registerDb(driver: Driver): void {
  slot()[KEY] = driver;
}

function requireDriver(): Driver {
  const driver = slot()[KEY];
  if (!driver) {
    throw new Error(
      'rosezm/db: no database driver registered - call registerDb({ query }) once at boot ' +
      '(src/pages/_middleware.rose, or a module it imports) before any handler queries',
    );
  }
  return driver;
}

const on = (run: Driver): Queries => ({
  q: async <T>(sql: string, params?: readonly unknown[]): Promise<T[]> => (await run.query(sql, params)).rows as T[],
  q1: async <T>(sql: string, params?: readonly unknown[]): Promise<T | null> => {
    const { rows } = await run.query(sql, params);
    return (rows[0] ?? null) as T | null;
  },
});

// q/q1 are `async` rather than plain `Promise`-returning wrappers so a missing
// driver surfaces as a REJECTED promise: a handler written `export function
// GET()` (not async) can still await/.catch it instead of crashing at call
// time on a synchronous throw.
/** Every matching row, on the registered driver. */
export async function q<T = any>(sql: string, params?: readonly unknown[]): Promise<T[]> {
  return on(requireDriver()).q<T>(sql, params);
}

/** The first matching row, or null, on the registered driver. */
export async function q1<T = any>(sql: string, params?: readonly unknown[]): Promise<T | null> {
  return on(requireDriver()).q1<T>(sql, params);
}

/**
 * Run `fn` inside one transaction: BEGIN, then COMMIT on success, ROLLBACK and
 * rethrow on failure. The callback's handle is connection-scoped (queries go
 * to the same connection the BEGIN went to) and deliberately has no tx(), so a
 * nested transaction cannot deadlock two connections against each other.
 */
export async function tx<T>(fn: (t: Queries) => Promise<T> | T): Promise<T> {
  const driver = requireDriver();
  const conn = driver.connect ? await driver.connect() : null;
  const run = conn ?? driver;
  try {
    await run.query('BEGIN');
    const out = await fn(on(run));
    await run.query('COMMIT');
    return out;
  } catch (err) {
    // The original failure is the one worth reporting; a rollback that also
    // fails (a dropped socket) must not replace it.
    try {
      await run.query('ROLLBACK');
    } catch { /* the error thrown below is the truth */ }
    throw err;
  } finally {
    if (conn) await conn.release();
  }
}

/** The registered database, for handlers that would rather hold an object. */
export function db(): Db {
  return {
    q: (sql, params) => q(sql, params),
    q1: (sql, params) => q1(sql, params),
    tx: (fn) => tx(fn),
  };
}
