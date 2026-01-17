import { useEffect, useSyncExternalStore } from "react";
import { createOrderbookStore, OrderbookSnapshot, OrderbookStore } from "../store/orderbookStore";

const defaultStore = createOrderbookStore();

type UseOrderbookResult = Pick<OrderbookSnapshot, "bids" | "asks" | "status" | "error">;

type UseOrderbookOptions = {
  store?: OrderbookStore;
};

export function useOrderbook(symbol: string, options: UseOrderbookOptions = {}): UseOrderbookResult {
  const store = options.store ?? defaultStore;

  useEffect(() => {
    store.connect(symbol);
    return () => {
      store.disconnect();
    };
  }, [store, symbol]);

  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return {
    bids: snapshot.bids,
    asks: snapshot.asks,
    status: snapshot.status,
    error: snapshot.error,
  };
}
