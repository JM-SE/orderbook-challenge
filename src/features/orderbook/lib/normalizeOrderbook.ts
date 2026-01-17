import type {
  BinanceDepth10Message,
  NormalizedOrderbook,
  OrderbookLevel,
} from "../types";

function toLevel(tuple: [string, string]): OrderbookLevel | null {
  const price = Number(tuple[0]);
  const quantity = Number(tuple[1]);

  if (!Number.isFinite(price) || !Number.isFinite(quantity)) return null;
  if (price < 0 || quantity < 0) return null;

  return { price, quantity };
}

function normalizeSide(
  tuples: [string, string][],
  sortDirection: "asc" | "desc",
  limit: number,
): OrderbookLevel[] {
  const levels = tuples
    .map(toLevel)
    .filter((lvl): lvl is OrderbookLevel => lvl !== null)
    .sort((a, b) => (sortDirection === "asc" ? a.price - b.price : b.price - a.price))
    .slice(0, limit);

  return levels;
}

export function normalizeOrderbook(
  raw: BinanceDepth10Message,
  limit = 10,
): NormalizedOrderbook {
  return {
    bids: normalizeSide(raw.bids, "desc", limit),
    asks: normalizeSide(raw.asks, "asc", limit),
  };
}
