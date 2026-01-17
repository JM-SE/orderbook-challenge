export function formatSpread(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";

  const decimals = resolveSpreadDecimals(value);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function resolveSpreadDecimals(value: number): number {
  if (value >= 1) return 2;
  if (value >= 0.1) return 4;
  if (value >= 0.01) return 6;
  return 8;
}
