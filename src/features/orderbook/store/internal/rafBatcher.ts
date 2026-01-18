import type { BinanceDepth10Message } from "../../types";

export function createRafBatcher(onFlush: (payload: BinanceDepth10Message) => void) {
  let scheduled = false;
  let rafId: number | null = null;
  let latest: BinanceDepth10Message | null = null;

  const schedule = (payload: BinanceDepth10Message) => {
    latest = payload;
    if (scheduled) return;
    scheduled = true;

    const scheduleFn = typeof requestAnimationFrame === "function"
      ? requestAnimationFrame
      : (cb: () => void) => setTimeout(cb, 0) as unknown as number;

    rafId = scheduleFn(() => {
      scheduled = false;
      rafId = null;
      if (latest) {
        onFlush(latest);
        latest = null;
      }
    });
  };

  const cancel = () => {
    if (rafId !== null) {
      const cancelFn = typeof cancelAnimationFrame === "function"
        ? cancelAnimationFrame
        : (id: number) => clearTimeout(id);
      cancelFn(rafId);
      rafId = null;
      scheduled = false;
    }
    latest = null;
  };

  return { schedule, cancel };
}
