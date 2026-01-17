interface PairSelectorProps {
  label: string;
  symbol: string;
  options: string[];
  onChange: (symbol: string) => void;
}

export function PairSelector({ label, symbol, options, onChange }: PairSelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-[var(--muted)]">
      <span>{label}</span>
      <select
        className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
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
