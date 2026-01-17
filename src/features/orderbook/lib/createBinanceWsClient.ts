import type { BinanceDepth10Message } from "../types";
import { BINANCE_WS_BASE_URL } from "./binanceWsConfig";
import { buildBinanceDepthStreamName } from "./buildBinanceDepthStreamName";

type WsMessageEvent = { data: string };

type BinanceWsClientOptions = {
  symbol: string;
  onMessage: (payload: BinanceDepth10Message) => void;
  onError?: (error: unknown) => void;
  onClose?: (event: unknown) => void;
  WebSocketImpl?: typeof WebSocket;
};

type BinanceWsClient = {
  connect: () => void;
  close: () => void;
};

function parseDepth10Message(data: string): BinanceDepth10Message | null {
  try {
    const payload = JSON.parse(data) as Partial<BinanceDepth10Message>;
    if (!Array.isArray(payload?.bids) || !Array.isArray(payload?.asks)) return null;
    if (typeof payload?.lastUpdateId !== "number") return null;

    return payload as BinanceDepth10Message;
  } catch {
    return null;
  }
}

export function createBinanceWsClient({
  symbol,
  onMessage,
  onError,
  onClose,
  WebSocketImpl = WebSocket,
}: BinanceWsClientOptions): BinanceWsClient {
  const streamName = buildBinanceDepthStreamName(symbol);
  const url = `${BINANCE_WS_BASE_URL}/${streamName}`;
  let socket: WebSocket | null = null;

  const connect = () => {
    if (socket) return;

    socket = new WebSocketImpl(url);

    socket.onmessage = (event: WsMessageEvent) => {
      const parsed = parseDepth10Message(event.data);
      if (parsed) onMessage(parsed);
      else onError?.(new Error("Invalid depth10 payload"));
    };

    socket.onerror = (event) => {
      onError?.(event);
    };

    socket.onclose = (event) => {
      onClose?.(event);
    };
  };

  const close = () => {
    if (!socket) return;
    socket.close();
    socket = null;
  };

  return { connect, close };
}

