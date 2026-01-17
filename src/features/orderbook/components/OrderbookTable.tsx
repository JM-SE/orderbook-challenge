import type { OrderbookLevel } from "../types";
import { OrderbookRow } from "./OrderbookRow";

interface OrderbookTableProps {
  title: string;
  tone: "bid" | "ask";
  levels: OrderbookLevel[];
  rowCount?: number;
}

const emptyLevels = Array.from({ length: 10 }, () => ({ price: null, quantity: null }));

export function OrderbookTable({ title, tone, levels, rowCount = 10 }: OrderbookTableProps) {
  const rows = [...levels, ...emptyLevels].slice(0, rowCount);

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {title}
        </h3>
        <span className="text-xs text-[var(--muted)]">Price / Qty</span>
      </div>
      <div className="flex flex-col">
        {rows.map((row, index) => (
          <OrderbookRow
            key={`${title}-${index}`}
            price={row.price}
            quantity={row.quantity}
            tone={tone}
          />
        ))}
      </div>
    </div>
  );
}
