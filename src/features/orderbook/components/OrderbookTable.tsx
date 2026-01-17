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
      <div className="mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {title}
        </h3>
      </div>
      <div className="mb-3 grid grid-cols-2 text-[10px] uppercase tracking-wide text-[var(--muted)]">
        <span>Price</span>
        <span className="text-right">Qty</span>
      </div>
      <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.06)]">
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
