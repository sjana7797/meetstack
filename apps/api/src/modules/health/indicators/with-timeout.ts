/**
 * Ceiling on a single dependency probe.
 *
 * The dangerous failure is not a refused connection — that rejects in
 * microseconds — but a pool or socket that accepts and never answers. Unbounded,
 * the health request hangs with it, and the platform records a *probe timeout*
 * rather than a clean `down`. Those read very differently: one says "the API is
 * broken", the other says "Postgres is broken".
 *
 * Three seconds sits under the usual 5s probe timeout with room for the response
 * to get back out.
 */
export const HEALTH_CHECK_TIMEOUT_MS = 3_000;

/** Rejects with a timeout error if `operation` has not settled in time. */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number = HEALTH_CHECK_TIMEOUT_MS,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const expiry = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([operation, expiry]);
  } finally {
    // Without this the timer keeps the event loop alive for its full duration
    // on every successful check.
    clearTimeout(timer);
  }
}
