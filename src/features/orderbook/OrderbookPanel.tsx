"use client";

import { useMemo, useState } from "react";
import { OrderbookTable } from "./components/OrderbookTable";
import { PairSelector } from "./components/PairSelector";
import { useOrderbook } from "./hooks/useOrderbook";
import { deriveSpreadMetrics } from "./lib/deriveSpreadMetrics";
import { formatOrderbookStatus } from "./lib/formatOrderbookStatus";
import { formatSpread } from "./lib/formatSpread";
import { formatSpreadPercent } from "./lib/formatSpreadPercent";
import { DEFAULT_SYMBOL, ORDERBOOK_SYMBOLS } from "./orderbookConfig";

export function OrderbookPanel() {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const { bids, asks, status, error } = useOrderbook(symbol);
  const statusLabel = useMemo(() => formatOrderbookStatus(status), [status]);
  const spread = useMemo(() => deriveSpreadMetrics(bids, asks), [bids, asks]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Orderbook Viewer</h1>
          <p className="text-sm text-[var(--muted)]">WebSocket-first Binance depth stream</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
          <div className="flex items-center gap-2">
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

          <div className="hidden h-4 w-px bg-[var(--border)] sm:block" />

          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--muted)]">
            <span>Spread</span>
            <span className="font-mono text-[var(--foreground)]">
              {formatSpread(spread.spread)}
            </span>
            <span className="font-mono text-[var(--muted)]">
              {formatSpreadPercent(spread.spreadPct) ? `(${formatSpreadPercent(spread.spreadPct)})` : ""}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col items-start justify-end gap-1 text-xs uppercase tracking-wide text-[var(--muted)]">
          <span className="text-[var(--foreground)]">{symbol}</span>
          <span>Depth {ORDERBOOK_SYMBOLS.length >= 5 ? "10" : "10"} • 100ms</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrderbookTable title="Bids" tone="bid" levels={bids} />
        <OrderbookTable title="Asks" tone="ask" levels={asks} />
      </div>
    </section>
  );
}
