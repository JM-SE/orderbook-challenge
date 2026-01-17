# 009 UI Extras (Spread + Depth Bars) Specification

## Context

This task adds two optional "trading terminal" UI extras without changing the core real-time architecture:
- Spread indicator (best ask - best bid) + spread percentage
- Depth visualization bars (variant A: per-level relative volume)

No changes to WebSocket/store/hook logic are required.

## Requirements

### Spread

- [x] Add a derived spread display using only current top-of-book data:
  - [x] `bestBid = bids[0]?.price`
  - [x] `bestAsk = asks[0]?.price`
  - [x] `spread = bestAsk - bestBid`
  - [x] `mid = (bestAsk + bestBid) / 2`
  - [x] `spreadPct = spread / mid`
- [x] UI:
  - [x] Show `Spread` (absolute) and `Spread %` in the header/control area.
  - [x] If data is missing on either side, show placeholders (`—`) without layout shift.

### Depth Bars (Variant A)

- [x] For each side independently (bids, asks):
  - [x] compute `maxQty` among the 10 visible levels
  - [x] for each row compute `barRatio = qty / maxQty` (0..1)
- [x] UI:
  - [x] Render a subtle background bar per row based on `barRatio`
  - [x] Bids bars grow from the left; Asks bars grow from the right
  - [x] Bars must not affect layout (no width/height changes to text layout)

## Out of Scope (Task)

- [ ] Do not implement cumulative depth.
- [ ] Do not add charting libraries.
- [ ] Do not modify WS/store/hook behavior.

## Technical Approach

- Add a small helper for spread metrics:
  - `src/features/orderbook/lib/deriveSpreadMetrics.ts`
- Keep depth ratio computation as a pure helper (either in `lib/` or locally in table):
  - suggested: `src/features/orderbook/lib/computeDepthRatios.ts`
- Update presentational components only:
  - `OrderbookPanel` renders spread metrics
  - `OrderbookTable` computes ratios and passes to `OrderbookRow`
  - `OrderbookRow` renders a bar background layer

## Implementation Steps

1. Create `deriveSpreadMetrics(bids, asks)` (pure function).
2. Create `computeDepthRatios(levels)` (pure function).
3. Update `OrderbookPanel` to display Spread and Spread %.
4. Update `OrderbookRow` to render a subtle bar based on `barRatio`.
5. Update `OrderbookTable` to pass `barRatio` and bar alignment.
6. Add minimal tests:
   - spread metrics when data present / missing
   - depth ratio computation

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] Spread renders as `—` when best bid/ask missing.
- [x] Spread renders absolute and percent when data present.
- [x] Depth bars render without layout shift.
- [x] Bars follow side orientation (bids left, asks right).
