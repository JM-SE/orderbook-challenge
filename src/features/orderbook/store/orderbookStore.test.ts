import type { BinanceDepth10Message } from "../types";
import { createOrderbookStore } from "./orderbookStore";

type WsClientHandlers = {
  onMessage: (payload: BinanceDepth10Message) => void;
  onError: (error: unknown) => void;
  onClose: (event: unknown) => void;
};

type FakeClient = {
  connect: jest.Mock;
  close: jest.Mock;
  handlers: WsClientHandlers;
};

type FakeClientFactory = (args: { symbol: string } & WsClientHandlers) => FakeClient;

type FakeClientFactoryResult = {
  clients: FakeClient[];
  factory: FakeClientFactory;
};

function createFakeClientFactory(): FakeClientFactoryResult {
  const clients: FakeClient[] = [];

  const factory: FakeClientFactory = (args) => {
    const client: FakeClient = {
      connect: jest.fn(),
      close: jest.fn(),
      handlers: {
        onMessage: args.onMessage,
        onError: args.onError,
        onClose: args.onClose,
      },
    };

    clients.push(client);
    return client;
  };

  return { clients, factory };
}

describe("orderbookStore", () => {
  beforeEach(() => {
    (global as { requestAnimationFrame?: (cb: () => void) => number }).requestAnimationFrame =
      (cb) => {
        cb();
        return 1;
      };
    (global as { cancelAnimationFrame?: (id: number) => void }).cancelAnimationFrame = jest.fn();
  });

  it("stores normalized top 10 levels", () => {
    const { clients, factory } = createFakeClientFactory();
    const store = createOrderbookStore(factory);


    store.connect("BTCUSDT");
    store.connect("ETHUSDT");

    expect(clients).toHaveLength(2);
    expect(clients[0].close).toHaveBeenCalledTimes(1);
    expect(clients[1].connect).toHaveBeenCalledTimes(1);
  });

  it("batches updates so latest payload wins", () => {
    const rafQueue: Array<() => void> = [];
    (global as { requestAnimationFrame?: (cb: () => void) => number }).requestAnimationFrame =
      (cb) => {
        rafQueue.push(cb);
        return 1;
      };

    const { clients, factory } = createFakeClientFactory();
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

    rafQueue.forEach((cb) => cb());

    const snapshot = store.getSnapshot();
    expect(snapshot.bids[0].price).toBe(200);
    expect(snapshot.asks[0].price).toBe(201);
  });
});
