import { formatOrderbookNumber } from "../lib/formatOrderbookNumber";

interface OrderbookRowProps {
  price?: number | null;
  quantity?: number | null;
  tone: "bid" | "ask";
  barRatio?: number;
}

export function OrderbookRow({ price, quantity, tone, barRatio = 0 }: OrderbookRowProps) {
  const color = tone === "bid" ? "var(--bid)" : "var(--ask)";
  const barColor = tone === "bid" ? "rgba(76, 175, 111, 0.14)" : "rgba(224, 108, 117, 0.14)";

  return (
    <div className="relative">
      <div
        className={`absolute inset-y-0 ${tone === "bid" ? "left-0" : "right-0"}`}
        style={{
          width: `${Math.max(0, Math.min(1, barRatio)) * 100}%`,
          background: barColor,
        }}
      />
      <div className="relative grid grid-cols-2 gap-6 py-2 text-sm font-mono">
        <span style={{ color }}>{formatOrderbookNumber(price, "price")}</span>
        <span className="text-right text-[var(--foreground)]">
          {formatOrderbookNumber(quantity, "quantity")}
        </span>
      </div>
    </div>
  );
}
