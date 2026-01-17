import type { BinanceDepth10Message } from "../types";
import { FakeWebSocket, emitMessage, emitRaw } from "../test-utils/fakeWebSocket";
import { BINANCE_DEPTH_INTERVAL_MS, BINANCE_DEPTH_LEVELS, BINANCE_WS_BASE_URL } from "./binanceWsConfig";
import { buildBinanceDepthStreamName } from "./buildBinanceDepthStreamName";
import { createBinanceWsClient } from "./createBinanceWsClient";

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
    FakeWebSocket.reset();
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
