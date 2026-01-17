import type { OrderbookLevel } from "../types";

export type SpreadMetrics = {
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
  spreadPct: number | null;
};

export function deriveSpreadMetrics(
  bids: OrderbookLevel[],
  asks: OrderbookLevel[],
): SpreadMetrics {
  const bestBid = bids[0]?.price ?? null;
  const bestAsk = asks[0]?.price ?? null;

  if (bestBid === null || bestAsk === null) {
    return { bestBid, bestAsk, spread: null, spreadPct: null };
  }

  const spread = bestAsk - bestBid;
  const mid = (bestAsk + bestBid) / 2;
  const spreadPct = mid > 0 ? spread / mid : null;

  return { bestBid, bestAsk, spread, spreadPct };
}
