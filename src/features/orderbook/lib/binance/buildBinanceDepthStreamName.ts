import { BINANCE_DEPTH_INTERVAL_MS, BINANCE_DEPTH_LEVELS } from "./binanceWsConfig";

type BuildDepthStreamParams = {
  levels?: number;
  intervalMs?: number;
};

export function buildBinanceDepthStreamName(
  symbol: string,
  { levels = BINANCE_DEPTH_LEVELS, intervalMs = BINANCE_DEPTH_INTERVAL_MS }: BuildDepthStreamParams = {},
): string {
  return `${symbol.toLowerCase()}@depth${levels}@${intervalMs}ms`;
}
