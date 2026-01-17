import type { OrderbookStatus } from "../store/orderbookStore";

const STATUS_LABELS: Record<OrderbookStatus, string> = {
  idle: "Idle",
  connecting: "Connecting",
  connected: "Live",
  error: "Error",
};

export function formatOrderbookStatus(status: OrderbookStatus): string {
  return STATUS_LABELS[status];
}
