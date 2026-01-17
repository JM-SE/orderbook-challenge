export function formatSpreadPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "";

  const percent = value * 100;
  const decimals = resolvePercentDecimals(percent);

  return `${percent.toFixed(decimals)}%`;
}

function resolvePercentDecimals(value: number): number {
  if (value >= 0.1) return 3;
  if (value >= 0.01) return 4;
  if (value >= 0.001) return 5;
  return 6;
}
