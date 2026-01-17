import type { BinanceDepth10Message, NormalizedOrderbook } from "../types";
import { normalizeOrderbook } from "../lib/normalizeOrderbook";
import { createBinanceWsClient } from "../lib/createBinanceWsClient";

export type OrderbookStatus = "idle" | "connecting" | "connected" | "error";

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

  const connect = (symbol: string) => {
    if (snapshot.symbol === symbol && currentClient) return;

    disconnect();

    snapshot = {
      ...defaultSnapshot,
      symbol,
      status: "connecting",
    };
    emit();

    currentClient = createClient({
      symbol,
      onMessage: (payload) => {
        latestPayload = payload;
        scheduleEmit();
      },
      onError: (error) => {
        setSnapshot({ status: "error", error: toErrorMessage(error) });
      },
      onClose: () => {
        if (snapshot.symbol === symbol) {
          setSnapshot({ status: "error", error: "Connection closed" });
        }
      },
    });

    currentClient.connect();
  };

  const disconnect = () => {
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
