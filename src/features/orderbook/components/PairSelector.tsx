interface PairSelectorProps {
  label: string;
  symbol: string;
  options: string[];
  onChange: (symbol: string) => void;
}

export function PairSelector({ label, symbol, options, onChange }: PairSelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</span>
      <select
        className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] shadow-[0_0_0_1px_rgba(0,0,0,0.2)] focus:border-[var(--bid)] focus:outline-none focus:ring-2 focus:ring-[rgba(76,175,111,0.25)]"
        value={symbol}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((pair) => (
          <option key={pair} value={pair}>
            {pair}
          </option>
        ))}
      </select>
    </label>
  );
}
