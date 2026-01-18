import type { BinanceDepth10Message } from "../types";
import { createFakeWsClientFactory } from "../test-utils/fakeWsClientFactory";
import { stubRafQueue } from "../test-utils/raf";
import { createOrderbookStore } from "./orderbookStore";

function withFakeTimers<T>(fn: () => T) {
  jest.useFakeTimers();
  try {
    return fn();
  } finally {
    jest.useRealTimers();
  }
}

describe("orderbookStore", () => {
  it("stores normalized top 10 levels", () => {
    const { flush } = stubRafQueue();
    const { clients, factory } = createFakeWsClientFactory();
    const store = createOrderbookStore(factory);

    store.connect("BTCUSDT");

    const payload: BinanceDepth10Message = {
      lastUpdateId: 1,
      bids: [
        ["100", "1"],
        ["101", "2"],
      ],
      asks: [
        ["102", "1"],
        ["103", "2"],
      ],
    };

    clients[0].handlers.onMessage(payload);
    flush();

    const snapshot = store.getSnapshot();
    expect(snapshot.bids).toHaveLength(2);
    expect(snapshot.asks).toHaveLength(2);
    expect(snapshot.bids[0].price).toBe(101);
    expect(snapshot.asks[0].price).toBe(102);
    expect(snapshot.status).toBe("connected");
  });

  it("closes previous connection when switching symbols", () => {
    stubRafQueue();
    const { clients, factory } = createFakeWsClientFactory();
    const store = createOrderbookStore(factory);

    store.connect("BTCUSDT");
    store.connect("ETHUSDT");

    expect(clients).toHaveLength(2);
    expect(clients[0].close).toHaveBeenCalledTimes(1);
    expect(clients[1].connect).toHaveBeenCalledTimes(1);
  });

  it("batches updates so latest payload wins", () => {
    const { flush } = stubRafQueue();
    const { clients, factory } = createFakeWsClientFactory();
    const store = createOrderbookStore(factory);

    store.connect("BTCUSDT");

    const first: BinanceDepth10Message = {
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "1"]],
    };

    const second: BinanceDepth10Message = {
      lastUpdateId: 2,
      bids: [["200", "2"]],
      asks: [["201", "2"]],
    };

    clients[0].handlers.onMessage(first);
    clients[0].handlers.onMessage(second);

    flush();

    const snapshot = store.getSnapshot();
    expect(snapshot.bids[0].price).toBe(200);
    expect(snapshot.asks[0].price).toBe(201);
  });

  it("retries on error up to the limit", () => {
    withFakeTimers(() => {
      stubRafQueue();
      const { clients, factory } = createFakeWsClientFactory();
      const store = createOrderbookStore(factory);

      store.connect("BTCUSDT");

      clients[0].handlers.onError(new Error("boom"));
      jest.advanceTimersByTime(1000);

      expect(clients).toHaveLength(2);
      expect(clients[1].connect).toHaveBeenCalledTimes(1);

      clients[1].handlers.onError(new Error("boom2"));
      jest.advanceTimersByTime(1000);

      expect(clients).toHaveLength(3);

      clients[2].handlers.onError(new Error("boom3"));
      jest.advanceTimersByTime(1000);

      expect(clients).toHaveLength(4);

      clients[3].handlers.onError(new Error("boom4"));
      jest.advanceTimersByTime(1000);

      expect(clients).toHaveLength(4);
      expect(store.getSnapshot().status).toBe("error");
    });
  });

  it("resets retries on symbol change", () => {
    withFakeTimers(() => {
      stubRafQueue();
      const { clients, factory } = createFakeWsClientFactory();
      const store = createOrderbookStore(factory);

      store.connect("BTCUSDT");

      clients[0].handlers.onError(new Error("boom"));
      store.connect("ETHUSDT");

      expect(clients).toHaveLength(2);
      expect(clients[1].connect).toHaveBeenCalledTimes(1);

      clients[0].handlers.onClose({ code: 1000 });
      expect(store.getSnapshot().status).toBe("connecting");
    });
  });

  it("clears retry on successful message", () => {
    withFakeTimers(() => {
      const { flush } = stubRafQueue();
      const { clients, factory } = createFakeWsClientFactory();
      const store = createOrderbookStore(factory);

      store.connect("BTCUSDT");

      clients[0].handlers.onError(new Error("boom"));
      jest.runOnlyPendingTimers();

      expect(clients).toHaveLength(2);

      clients[1].handlers.onMessage({
        lastUpdateId: 1,
        bids: [["100", "1"]],
        asks: [["101", "1"]],
      });
      flush();

      clients[1].handlers.onError(new Error("boom2"));
      jest.runOnlyPendingTimers();
      expect(clients).toHaveLength(3);
    });
  });
});
