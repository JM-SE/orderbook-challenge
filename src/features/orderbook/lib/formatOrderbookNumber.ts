export type OrderbookNumberFormat = "price" | "quantity";

const PRICE_DECIMALS = 2;
const QTY_DECIMALS_HIGH = 2;
const QTY_DECIMALS_MED = 4;
const QTY_DECIMALS_LOW = 6;
const QTY_DECIMALS_MICRO = 8;

export function formatOrderbookNumber(
  value?: number | null,
  format: OrderbookNumberFormat = "price",
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  const decimals = format === "price" ? PRICE_DECIMALS : resolveQtyDecimals(value);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function resolveQtyDecimals(value: number): number {
  if (value >= 1) return QTY_DECIMALS_HIGH;
  if (value >= 0.1) return QTY_DECIMALS_MED;
  if (value >= 0.01) return QTY_DECIMALS_LOW;
  return QTY_DECIMALS_MICRO;
}
