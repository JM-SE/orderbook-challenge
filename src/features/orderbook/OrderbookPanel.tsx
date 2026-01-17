"use client";

import { useMemo, useState } from "react";
import { OrderbookTable } from "./components/OrderbookTable";
import { PairSelector } from "./components/PairSelector";
import { useOrderbook } from "./hooks/useOrderbook";
import { formatOrderbookStatus } from "./lib/formatOrderbookStatus";
import { DEFAULT_SYMBOL, ORDERBOOK_SYMBOLS } from "./orderbookConfig";

export function OrderbookPanel() {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const { bids, asks, status, error } = useOrderbook(symbol);
  const statusLabel = useMemo(() => formatOrderbookStatus(status), [status]);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Orderbook Viewer</h1>
          <p className="text-sm text-[var(--muted)]">WebSocket-first Binance depth stream</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Status</span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              status === "connected"
                ? "border-[var(--bid)] text-[var(--bid)]"
                : status === "error"
                  ? "border-[var(--ask)] text-[var(--ask)]"
                  : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <PairSelector
          label="Trading pair"
          symbol={symbol}
          options={[...ORDERBOOK_SYMBOLS]}
          onChange={setSymbol}
        />
        {status === "error" && (
          <p className="text-sm text-[var(--ask)]">{error ?? "Connection error"}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OrderbookTable title="Bids" tone="bid" levels={bids} />
        <OrderbookTable title="Asks" tone="ask" levels={asks} />
      </div>
    </section>
  );
}
