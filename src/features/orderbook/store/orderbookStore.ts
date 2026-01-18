import type { BinanceDepth10Message, NormalizedOrderbook } from "../types";
import { normalizeOrderbook } from "../lib/normalizeOrderbook";
import { createBinanceWsClient } from "../lib/createBinanceWsClient";

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

type Subscriber = () => void;

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
  const subscribers = new Set<Subscriber>();
  let scheduled = false;
  let latestPayload: BinanceDepth10Message | null = null;
  let rafId: number | null = null;
  let retryCount = 0;
  let retryTimeoutId: number | null = null;
  let pendingSymbol: string | null = null;
  let connectionId = 0;

  const emit = () => {
    subscribers.forEach((listener) => listener());
  };

  const scheduleEmit = () => {
    if (scheduled) return;
    scheduled = true;

    const schedule = typeof requestAnimationFrame === "function"
      ? requestAnimationFrame
      : (cb: () => void) => setTimeout(cb, 0) as unknown as number;

    rafId = schedule(() => {
      scheduled = false;
      rafId = null;

      if (latestPayload) {
        const normalized = normalizeOrderbook(latestPayload);
        snapshot = {
          ...snapshot,
          bids: normalized.bids,
          asks: normalized.asks,
          status: "connected",
          error: null,
        };
        latestPayload = null;
      }

      emit();
    });
  };

  const setSnapshot = (next: Partial<OrderbookSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    emit();
  };

  const clearRetry = () => {
    retryCount = 0;
    pendingSymbol = null;
    if (retryTimeoutId !== null) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }
  };

  const scheduleRetry = (symbol: string, reason: string) => {
    if (retryCount >= MAX_RETRIES) {
      setSnapshot({ status: "error", error: reason });
      return;
    }

    const delay = RETRY_DELAYS_MS[retryCount] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
    retryCount += 1;
    pendingSymbol = symbol;

    setSnapshot({ status: "connecting", error: null });

    retryTimeoutId = setTimeout(() => {
      retryTimeoutId = null;
      if (pendingSymbol) connectInternal(pendingSymbol, false, true);
    }, delay) as unknown as number;
  };

  const connectInternal = (symbol: string, resetRetry: boolean, keepRetryState = false) => {
    if (snapshot.symbol === symbol && currentClient && !keepRetryState) return;

    if (resetRetry) clearRetry();
    disconnect(keepRetryState);

    snapshot = {
      ...defaultSnapshot,
      symbol,
      status: "connecting",
    };
    emit();

    connectionId += 1;
    const activeId = connectionId;

    currentClient = createClient({
      symbol,
      onMessage: (payload) => {
        if (activeId !== connectionId) return;
        latestPayload = payload;
        clearRetry();
        scheduleEmit();
      },
      onError: (error) => {
        if (activeId !== connectionId) return;
        scheduleRetry(symbol, toErrorMessage(error));
      },
      onClose: () => {
        if (activeId !== connectionId) return;
        if (snapshot.symbol === symbol) {
          scheduleRetry(symbol, "Connection closed");
        }
      },
    });

    currentClient.connect();
  };

  const connect = (symbol: string) => {
    connectInternal(symbol, true);
  };

  const disconnect = (keepRetryState = false) => {
    if (currentClient) {
      currentClient.close();
      currentClient = null;
    }

    if (rafId !== null) {
      const cancel = typeof cancelAnimationFrame === "function"
        ? cancelAnimationFrame
        : (id: number) => clearTimeout(id);

      cancel(rafId);
      rafId = null;
      scheduled = false;
    }

    latestPayload = null;
    if (!keepRetryState) clearRetry();
  };

  const getSnapshot = () => snapshot;

  const subscribe = (listener: Subscriber) => {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  };

  return {
    connect,
    disconnect,
    getSnapshot,
    subscribe,
  };
}

export type OrderbookStore = ReturnType<typeof createOrderbookStore>;
