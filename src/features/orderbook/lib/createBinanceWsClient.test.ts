import type { BinanceDepth10Message } from "../types";
import { BINANCE_DEPTH_INTERVAL_MS, BINANCE_DEPTH_LEVELS, BINANCE_WS_BASE_URL } from "./binanceWsConfig";
import { buildBinanceDepthStreamName } from "./buildBinanceDepthStreamName";
import { createBinanceWsClient } from "./createBinanceWsClient";

type MessageHandler = (event: { data: string }) => void;

type FakeSocket = {
  onmessage: MessageHandler | null;
  onerror: ((event: unknown) => void) | null;
  onclose: ((event: unknown) => void) | null;
  close: jest.Mock;
};

class FakeWebSocket {
  static lastUrl: string | null = null;
  static instances: FakeSocket[] = [];

  onmessage: MessageHandler | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onclose: ((event: unknown) => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    FakeWebSocket.lastUrl = url;
    FakeWebSocket.instances.push(this);
  }
}

function emitMessage(socket: FakeSocket, payload: unknown) {
  socket.onmessage?.({ data: JSON.stringify(payload) });
}

function emitRaw(socket: FakeSocket, raw: string) {
  socket.onmessage?.({ data: raw });
}

describe("buildBinanceDepthStreamName", () => {
  it("lowercases the symbol", () => {
    expect(buildBinanceDepthStreamName("BTCUSDT")).toBe("btcusdt@depth10@100ms");
  });

  it("uses configured defaults", () => {
    expect(buildBinanceDepthStreamName("ETHUSDT")).toBe(
      `ethusdt@depth${BINANCE_DEPTH_LEVELS}@${BINANCE_DEPTH_INTERVAL_MS}ms`,
    );
  });
});

describe("createBinanceWsClient", () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    FakeWebSocket.lastUrl = null;
  });

  it("builds the correct WebSocket URL", () => {
    const client = createBinanceWsClient({
      symbol: "BTCUSDT",
      onMessage: jest.fn(),
      WebSocketImpl: FakeWebSocket as unknown as typeof WebSocket,
    });

    client.connect();

    expect(FakeWebSocket.lastUrl).toBe(
      `${BINANCE_WS_BASE_URL}/btcusdt@depth${BINANCE_DEPTH_LEVELS}@${BINANCE_DEPTH_INTERVAL_MS}ms`,
    );
  });

  it("parses valid depth10 payloads", () => {
    const onMessage = jest.fn();
    const onError = jest.fn();

    const client = createBinanceWsClient({
      symbol: "ETHUSDT",
      onMessage,
      onError,
      WebSocketImpl: FakeWebSocket as unknown as typeof WebSocket,
    });

    client.connect();

    const socket = FakeWebSocket.instances[0];
    const payload: BinanceDepth10Message = {
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "2"]],
    };

    emitMessage(socket, payload);

    expect(onMessage).toHaveBeenCalledWith(payload);
    expect(onError).not.toHaveBeenCalled();
  });

  it("reports invalid payloads", () => {
    const onMessage = jest.fn();
    const onError = jest.fn();

    const client = createBinanceWsClient({
      symbol: "ETHUSDT",
      onMessage,
      onError,
      WebSocketImpl: FakeWebSocket as unknown as typeof WebSocket,
    });

    client.connect();

    const socket = FakeWebSocket.instances[0];

    emitMessage(socket, { foo: "bar" });

    expect(onMessage).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("reports invalid JSON safely", () => {
    const onError = jest.fn();

    const client = createBinanceWsClient({
      symbol: "ETHUSDT",
      onMessage: jest.fn(),
      onError,
      WebSocketImpl: FakeWebSocket as unknown as typeof WebSocket,
    });

    client.connect();

    const socket = FakeWebSocket.instances[0];

    emitRaw(socket, "not-json");

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("closes idempotently", () => {
    const client = createBinanceWsClient({
      symbol: "ETHUSDT",
      onMessage: jest.fn(),
      WebSocketImpl: FakeWebSocket as unknown as typeof WebSocket,
    });

    client.connect();

    const socket = FakeWebSocket.instances[0];

    client.close();
    client.close();

    expect(socket.close).toHaveBeenCalledTimes(1);
  });
});
