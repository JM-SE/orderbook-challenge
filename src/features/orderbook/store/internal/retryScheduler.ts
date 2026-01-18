type RetrySchedulerOptions = {
  maxRetries: number;
  delaysMs: number[];
  onRetry: (attempt: number) => void;
  onFail: () => void;
};

export function createRetryScheduler({
  maxRetries,
  delaysMs,
  onRetry,
  onFail,
}: RetrySchedulerOptions) {
  let retryCount = 0;
  let timeoutId: number | null = null;

  const clear = () => {
    retryCount = 0;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const schedule = () => {
    if (retryCount >= maxRetries) {
      onFail();
      return;
    }

    const delay = delaysMs[retryCount] ?? delaysMs[delaysMs.length - 1];
    retryCount += 1;

    timeoutId = setTimeout(() => {
      timeoutId = null;
      onRetry(retryCount);
    }, delay) as unknown as number;
  };

  return { clear, schedule, getCount: () => retryCount };
}
