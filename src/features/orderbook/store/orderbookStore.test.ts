import type { BinanceDepth10Message } from "../types";
import { createFakeWsClientFactory } from "../test-utils/fakeWsClientFactory";
import { stubRafQueue } from "../test-utils/raf";
import { createOrderbookStore } from "./orderbookStore";

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

  it("sets error state on client error", () => {
    stubRafQueue();
    const { clients, factory } = createFakeWsClientFactory();
    const store = createOrderbookStore(factory);

    store.connect("BTCUSDT");

    clients[0].handlers.onError(new Error("boom"));

    const snapshot = store.getSnapshot();
    expect(snapshot.status).toBe("error");
    expect(snapshot.error).toBe("boom");
  });

  it("sets error state on client close", () => {
    stubRafQueue();
    const { clients, factory } = createFakeWsClientFactory();
    const store = createOrderbookStore(factory);

    store.connect("BTCUSDT");

    clients[0].handlers.onClose({ code: 1000 });

    const snapshot = store.getSnapshot();
    expect(snapshot.status).toBe("error");
    expect(snapshot.error).toBe("Connection closed");
  });
});
