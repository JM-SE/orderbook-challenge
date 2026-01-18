import type { BinanceDepth10Message, NormalizedOrderbook } from "../types";
import { normalizeOrderbook } from "../lib/normalizeOrderbook";
import { createBinanceWsClient } from "../lib/createBinanceWsClient";
import { createEmitter } from "./internal/emitter";
import { createRafBatcher } from "./internal/rafBatcher";
import { createRetryScheduler } from "./internal/retryScheduler";
import { createConnectionGuard } from "./internal/connectionGuard";

export type OrderbookStatus = "idle" | "connecting" | "connected" | "error";

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [250, 500, 1000];

export type OrderbookSnapshot = {
  symbol: string | null;
  status: OrderbookStatus;
  bids: NormalizedOrderbook["bids"];
  asks: NormalizedOrderbook["asks"];
  error: string | null;
};

type WsClient = ReturnType<typeof createBinanceWsClient>;

type CreateWsClient = (args: {
  symbol: string;
  onMessage: (payload: BinanceDepth10Message) => void;
  onError: (error: unknown) => void;
  onClose: (event: unknown) => void;
}) => WsClient;

const defaultSnapshot: OrderbookSnapshot = {
  symbol: null,
  status: "idle",
  bids: [],
  asks: [],
  error: null,
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

export function createOrderbookStore(
  createClient: CreateWsClient = createBinanceWsClient,
) {
  let snapshot: OrderbookSnapshot = { ...defaultSnapshot };
  let currentClient: WsClient | null = null;

  const guard = createConnectionGuard();
  const { emit, subscribe: onChange } = createEmitter();

  const setSnapshot = (next: Partial<OrderbookSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    emit();
  };

  const rafBatcher = createRafBatcher((payload: BinanceDepth10Message) => {
    const normalized = normalizeOrderbook(payload);
    setSnapshot({
      bids: normalized.bids,
      asks: normalized.asks,
      status: "connected",
      error: null,
    });
  });

  let pendingSymbol: string | null = null;
  let pendingError: string | null = null;

  const retryScheduler = createRetryScheduler({
    maxRetries: MAX_RETRIES,
    delaysMs: RETRY_DELAYS_MS,
    onRetry: () => {
      if (!pendingSymbol) return;
      connectInternal(pendingSymbol, false, true);
    },
    onFail: () => {
      const reason = pendingError ?? "Unknown error";
      setSnapshot({ status: "error", error: reason });
    },
  });

  const clearRetry = () => {
    pendingSymbol = null;
    pendingError = null;
    retryScheduler.clear();
  };

  const scheduleRetry = (symbol: string, reason: string) => {
    pendingSymbol = symbol;
    pendingError = reason;
    setSnapshot({ status: "connecting", error: null });
    retryScheduler.schedule();
  };

  function disconnect(keepRetryState = false) {
    if (currentClient) {
      currentClient.close();
      currentClient = null;
    }

    rafBatcher.cancel();
    if (!keepRetryState) clearRetry();
  }

  function connectInternal(symbol: string, resetRetry: boolean, keepRetryState = false) {
    if (snapshot.symbol === symbol && currentClient && !keepRetryState) return;

    if (resetRetry) clearRetry();
    disconnect(keepRetryState);

    snapshot = {
      ...defaultSnapshot,
      symbol,
      status: "connecting",
    };
    emit();

    const activeId = guard.next();

    currentClient = createClient({
      symbol,
      onMessage: (payload) => {
        if (!guard.isActive(activeId)) return;
        clearRetry();
        rafBatcher.schedule(payload);
      },
      onError: (error) => {
        if (!guard.isActive(activeId)) return;
        scheduleRetry(symbol, toErrorMessage(error));
      },
      onClose: () => {
        if (!guard.isActive(activeId)) return;
        if (snapshot.symbol === symbol) {
          scheduleRetry(symbol, "Connection closed");
        }
      },
    });

    currentClient.connect();
  }

  const connect = (symbol: string) => {
    connectInternal(symbol, true);
  };

  const getSnapshot = () => snapshot;

  return {
    connect,
    disconnect,
    getSnapshot,
    subscribe: onChange,
  };
}

export type OrderbookStore = ReturnType<typeof createOrderbookStore>;
