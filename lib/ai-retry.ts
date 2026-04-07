/**
 * Exponential backoff 2s -> 4s -> 8s (max 3 retries)
 * Optimized for AI generation and rate limits (429)
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Retry only for network errors or rate limit errors (429)
    const isRetryable =
      error.status === 429 || 
      error.message?.includes("fetch") || 
      error.message?.includes("network") ||
      error.message?.includes("timeout");

    if (retries > 0 && isRetryable) {
      console.warn(`[Retry System] Retrying in ${delay / 1000}s... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    
    // Non-retryable error or no retries left
    throw error;
  }
}
