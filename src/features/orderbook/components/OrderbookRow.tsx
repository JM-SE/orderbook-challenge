interface OrderbookRowProps {
  price?: number | null;
  quantity?: number | null;
  tone: "bid" | "ask";
}

import { formatOrderbookNumber } from "../lib/formatOrderbookNumber";

export function OrderbookRow({ price, quantity, tone }: OrderbookRowProps) {
  const color = tone === "bid" ? "var(--bid)" : "var(--ask)";

  return (
    <div className="grid grid-cols-2 gap-3 py-1 text-sm font-mono">
      <span style={{ color }}>{formatOrderbookNumber(price)}</span>
      <span className="text-right text-[var(--foreground)]">
        {formatOrderbookNumber(quantity)}
      </span>
    </div>
  );
}
