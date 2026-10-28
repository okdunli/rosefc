/** One dead keep-alive socket must cost one request, not the run.
 *
 *  Under load Windows can reset an idle keep-alive socket. Go's stdlib client
 *  silently retries an idempotent GET when its pooled connection dies; Node's
 *  `http.Agent` does not - one reset would reject the benchmark's Promise.all
 *  and kill the whole run. All of benchmark.ts's measured sections go through
 *  this helper. Both error surfaces matter and are the CALLER's job to wire:
 *  `req.on('error')` for a pre-response reset, `res.on('error')` for a
 *  mid-response close (the latter crashes the process outright without the
 *  listener); this helper only decides whether to try again.
 *
 *  Falsified by tests/test-resilience.ts: pre- and mid-response resets are
 *  survived, an always-resetting server still rejects after exactly 3
 *  attempts, non-retryable codes reject on the first attempt.
 */

const RETRYABLE = new Set(['ECONNRESET', 'EPIPE', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN']);

export const withResetRetry = <T>(fn: () => Promise<T>, attempt = 0): Promise<T> =>
  fn().catch((err: NodeJS.ErrnoException) => {
    if (attempt < 2 && RETRYABLE.has(err.code || '')) return withResetRetry(fn, attempt + 1);
    throw err;
  });
