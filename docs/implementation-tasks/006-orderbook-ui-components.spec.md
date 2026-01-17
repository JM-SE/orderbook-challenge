# 006 Orderbook UI Components Specification

## Context

We now implement the visible UI for the orderbook viewer.
This task focuses on UX clarity and a lightweight, intentional visual system.

## UX Decisions

- Layout stability:
  - Always render 10 rows per side (fill missing rows with placeholders).
  - Fixed column widths and monospace numbers for consistent alignment.
- Status visibility:
  - Show a clear status label: `Connecting`, `Live`, `Error`.
  - On error, show a short message and keep the layout stable.
- Symbol switching:
  - When symbol changes, show `Connecting` immediately and reset the table to placeholders.
- Accessibility:
  - Label the selector (`Trading pair`).
  - Do not rely on color alone: include headings "Bids" and "Asks".

## Visual System (Lightweight)

- Theme: **dark mode** using dark grays (not pure black).
- Background: dark neutral (#0f1115–#151821 range).
- Surface: slightly lighter panel for the orderbook.
- Text: high-contrast gray/white for readability.
- Bids: muted green (not neon).
- Asks: muted red (not neon).
- Numbers: monospace for price/quantity columns.
- Borders: subtle separators to keep the grid readable.

## Requirements

- [x] Trading pair selector (>= 5 symbols) with label.
- [x] Orderbook table with two columns per side:
  - price
  - quantity
- [x] Display top 10 bids and top 10 asks (fixed rows, placeholders if needed).
- [x] Visual distinction between bids and asks (color + heading).
- [x] Status display: connecting / live / error.
- [x] UI uses the orderbook hook as its only data source.
- [x] No layout shift or flicker on updates.

## Out of Scope (Task)

- [ ] Do not add new charting libraries.
- [ ] Do not add complex animations or micro-interactions.
- [ ] Do not implement spread indicator or depth bars (optional later tasks).

## Technical Approach

- Keep presentational UI components under `src/features/orderbook/components/`.
- Expose a single feature entrypoint at `src/features/orderbook/OrderbookPanel.tsx`.
- Only the feature entrypoint may call `useOrderbook` or manage local state (symbol).
- Use Tailwind (already configured) for layout, spacing, and colors.
- Create a small set of reusable UI pieces only if duplication is obvious.

Suggested module boundaries:
- `src/features/orderbook/OrderbookPanel.tsx` (container / feature entrypoint)
- `src/features/orderbook/components/OrderbookTable.tsx` (presentational)
- `src/features/orderbook/components/OrderbookRow.tsx` (presentational)
- `src/features/orderbook/components/PairSelector.tsx` (presentational)

## Implementation Steps

1. Define a dark theme baseline in CSS/Tailwind classes.
2. Build the selector with a label and a fixed symbol list.
3. Build the orderbook table with fixed rows and placeholder cells.
4. Connect UI to `useOrderbook` and show status + error message.
5. Ensure no layout shift on updates.
6. Add minimal UI tests for rendering and states.

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] UI renders a dark theme with clear contrast.
- [x] 10 rows per side render consistently (placeholders when empty).
- [x] Status label updates based on hook state.
- [x] Selector changes symbol and updates the view.
- [x] No visual flicker or layout shift during updates.
