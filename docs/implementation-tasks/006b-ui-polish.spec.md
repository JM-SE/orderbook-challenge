# 006b UI Polish (Layout + Readability) Specification

## Context

The UI works functionally but looks rough. We need a visual polish pass to improve readability, hierarchy, and layout stability while keeping the existing data flow intact.

This task is a UI-only refinement: no changes to WebSocket/store logic.

## Goals

- Improve layout hierarchy and spacing.
- Fix contrast issues in dark theme controls (selector, labels).
- Make the orderbook grid easier to scan.
- Keep the UI stable (no flicker or layout shifts).

## UX + Layout Changes

- Use a structured layout with a clear header + control bar + table section.
- Place bids and asks in a **single row** (two columns) rather than stacked vertical blocks.
- Ensure status label and value are clearly separated (no "StatusLive" effect).
- Improve selector readability (dark background + light text + clear focus state).
- Add column headers for `Price` and `Quantity` with fixed alignment.
- Add subtle separators between rows or zebra-style contrast (very subtle).

## Visual System Updates

- Maintain dark gray theme, but improve contrast:
  - Inputs and panels must use the same surface background.
  - Text should be legible at a glance.
- Use monospace for numbers only.
- Use muted badges for status (clear spacing, rounded pill).

## Requirements

- [x] Header: title + subtitle on left, status badge on right.
- [x] Control bar: trading pair selector with label, improved contrast.
- [x] Orderbook table:
  - [x] Two columns within one row (Bids | Asks).
  - [x] Each side has column headers (`Price`, `Qty`).
  - [x] Fixed 10 rows per side (placeholders when empty).
- [x] Ensure spacing and alignment are consistent (no cramped text).
- [x] Qty formatting uses dynamic precision (more decimals for small values; never rounds to 0.00 unless truly zero).
- [x] No change to data flow, store, or hook logic.

## Out of Scope (Task)

- [ ] Do not add new UI libraries or charting tools.
- [ ] Do not add animations beyond subtle hover/focus states.
- [ ] Do not add spread or depth bars (optional later tasks).

## Technical Approach

- Update only UI components and styles.
- Keep structure in `OrderbookPanel` and presentational components.
- Prefer Tailwind utilities and existing CSS variables.

## Implementation Steps

1. Update `OrderbookPanel` layout to a cleaner header + control bar + grid.
2. Restyle `PairSelector` for dark theme readability.
3. Update `OrderbookTable` to include column headers and stronger spacing.
4. Ensure rows render with fixed heights and subtle separators.
5. Update or add UI tests if selectors/labels change.

## Acceptance Criteria

- [x] UI is visually clearer and better spaced.
- [x] Status badge is readable and clearly separated.
- [x] Selector is legible in dark theme.
- [x] Bids/asks rendered in two columns side-by-side.
- [x] 10 rows per side remain stable.
- [x] Small quantities never render as `0.00` (dynamic precision for qty).
- [x] `npm run test` passes.
- [x] `npm run build` passes.
