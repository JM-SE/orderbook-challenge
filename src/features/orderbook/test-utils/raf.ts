export function stubRafQueue() {
  const rafQueue: Array<() => void> = [];

  (global as { requestAnimationFrame?: (cb: () => void) => number }).requestAnimationFrame = (cb) => {
    rafQueue.push(cb);
    return 1;
  };

  (global as { cancelAnimationFrame?: (id: number) => void }).cancelAnimationFrame = jest.fn();

  return {
    flush: () => {
      rafQueue.splice(0).forEach((cb) => cb());
    },
  };
}
