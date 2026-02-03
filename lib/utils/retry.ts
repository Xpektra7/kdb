/**
 * Retry utility for handling transient failures with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry an async operation with exponential backoff
 * @param operation - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the successful operation
 * @throws The last error if all retries fail
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    onRetry
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }
        
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
}
