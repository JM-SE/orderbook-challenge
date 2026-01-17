type OrderbookRowProps = {
  price?: number | null;
  quantity?: number | null;
  tone: "bid" | "ask";
};

function formatValue(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function OrderbookRow({ price, quantity, tone }: OrderbookRowProps) {
  const color = tone === "bid" ? "var(--bid)" : "var(--ask)";

  return (
    <div className="grid grid-cols-2 gap-3 py-1 text-sm font-mono">
      <span style={{ color }}>{formatValue(price)}</span>
      <span className="text-right text-[var(--foreground)]">{formatValue(quantity)}</span>
    </div>
  );
}
