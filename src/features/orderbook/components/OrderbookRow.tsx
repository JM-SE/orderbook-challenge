import { formatOrderbookNumber } from "../lib/formatOrderbookNumber";

interface OrderbookRowProps {
  price?: number | null;
  quantity?: number | null;
  tone: "bid" | "ask";
}

export function OrderbookRow({ price, quantity, tone }: OrderbookRowProps) {
  const color = tone === "bid" ? "var(--bid)" : "var(--ask)";

  return (
    <div className="grid grid-cols-2 gap-6 py-2 text-sm font-mono">
      <span style={{ color }}>{formatOrderbookNumber(price, "price")}</span>
      <span className="text-right text-[var(--foreground)]">
        {formatOrderbookNumber(quantity, "quantity")}
      </span>
    </div>
  );
}
