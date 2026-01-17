import type { BinanceDepth10Message } from "../types";

export type WsClientHandlers = {
  onMessage: (payload: BinanceDepth10Message) => void;
  onError: (error: unknown) => void;
  onClose: (event: unknown) => void;
};

export type FakeWsClient = {
  connect: jest.Mock;
  close: jest.Mock;
  handlers: WsClientHandlers;
};

export type FakeWsClientFactory = (args: { symbol: string } & WsClientHandlers) => FakeWsClient;

export function createFakeWsClientFactory() {
  const clients: FakeWsClient[] = [];

  const factory: FakeWsClientFactory = (args) => {
    const client: FakeWsClient = {
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
