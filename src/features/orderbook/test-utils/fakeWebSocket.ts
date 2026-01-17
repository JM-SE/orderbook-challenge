export type MessageHandler = (event: { data: string }) => void;

export type FakeSocket = {
  onmessage: MessageHandler | null;
  onerror: ((event: unknown) => void) | null;
  onclose: ((event: unknown) => void) | null;
  close: jest.Mock;
};

export class FakeWebSocket {
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

  static reset() {
    FakeWebSocket.instances = [];
    FakeWebSocket.lastUrl = null;
  }
}

export function emitMessage(socket: FakeSocket, payload: unknown) {
  socket.onmessage?.({ data: JSON.stringify(payload) });
}

export function emitRaw(socket: FakeSocket, raw: string) {
  socket.onmessage?.({ data: raw });
}

export function emitError(socket: FakeSocket, event: unknown = new Error("ws error")) {
  socket.onerror?.(event);
}

export function emitClose(socket: FakeSocket, event: unknown = { code: 1000 }) {
  socket.onclose?.(event);
}
