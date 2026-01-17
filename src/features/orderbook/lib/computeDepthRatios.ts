import type { OrderbookLevel } from "../types";

export type DepthRow = OrderbookLevel & {
  barRatio: number;
};

export function computeDepthRatios(levels: OrderbookLevel[], rowCount = 10): DepthRow[] {
  const visible = levels.slice(0, rowCount);
  const maxQty = visible.reduce((max, l) => Math.max(max, l.quantity), 0);

  return visible.map((l) => ({
    ...l,
    barRatio: maxQty > 0 ? l.quantity / maxQty : 0,
  }));
}
