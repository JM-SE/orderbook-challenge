import { renderHook, act } from "@testing-library/react";
import type { OrderbookSnapshot, OrderbookStore } from "../store/orderbookStore";
import { useOrderbook } from "./useOrderbook";

type StoreOverrides = Partial<OrderbookSnapshot>;

type FakeStore = OrderbookStore & {
  setSnapshot: (next: StoreOverrides) => void;
};

function createFakeStore(initial: OrderbookSnapshot): FakeStore {
  let snapshot = initial;
  const listeners = new Set<() => void>();

  const store: FakeStore = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setSnapshot: (next) => {
      snapshot = { ...snapshot, ...next };
      listeners.forEach((listener) => listener());
    },
  };

  return store;
}

const baseSnapshot: OrderbookSnapshot = {
  symbol: "BTCUSDT",
  status: "connecting",
  bids: [],
  asks: [],
  error: null,
};

describe("useOrderbook", () => {
  it("returns the current snapshot", () => {
    const store = createFakeStore(baseSnapshot);

    const { result } = renderHook(() => useOrderbook("BTCUSDT", { store }));

    expect(result.current.status).toBe("connecting");
    expect(result.current.bids).toEqual([]);
    expect(result.current.asks).toEqual([]);
  });

  it("connects on mount and disconnects on unmount", () => {
    const store = createFakeStore(baseSnapshot);

    const { unmount } = renderHook(() => useOrderbook("BTCUSDT", { store }));

    expect(store.connect).toHaveBeenCalledWith("BTCUSDT");

    unmount();

    expect(store.disconnect).toHaveBeenCalledTimes(1);
  });

  it("reconnects when symbol changes", () => {
    const store = createFakeStore(baseSnapshot);

    const { rerender } = renderHook(
      ({ symbol }) => useOrderbook(symbol, { store }),
      { initialProps: { symbol: "BTCUSDT" } },
    );

    expect(store.connect).toHaveBeenCalledWith("BTCUSDT");

    rerender({ symbol: "ETHUSDT" });

    expect(store.connect).toHaveBeenCalledWith("ETHUSDT");
    expect(store.disconnect).toHaveBeenCalledTimes(1);
  });

  it("updates when the store snapshot changes", () => {
    const store = createFakeStore(baseSnapshot);

    const { result } = renderHook(() => useOrderbook("BTCUSDT", { store }));

    act(() => {
      store.setSnapshot({
        status: "connected",
        bids: [{ price: 100, quantity: 1 }],
        asks: [{ price: 101, quantity: 2 }],
      });
    });

    expect(result.current.status).toBe("connected");
    expect(result.current.bids[0].price).toBe(100);
    expect(result.current.asks[0].price).toBe(101);
  });
});
