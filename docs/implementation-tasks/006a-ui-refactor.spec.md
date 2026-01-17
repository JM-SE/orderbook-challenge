# 006a UI Refactor (Props + Config + Formatters) Specification

## Context

After implementing the UI, we want a small refactor to improve clarity and scalability:
- use `interface` for component props
- move symbols/config out of `OrderbookPanel`
- move formatting helpers out of presentational components

This is a lightweight cleanup to make intent clearer for reviewers.

## Requirements

- [x] Replace `type` props with `interface` for UI components:
  - [x] `PairSelectorProps`
  - [x] `OrderbookTableProps`
  - [x] `OrderbookRowProps`
- [x] Move symbol list into a config module:
  - [x] Create `src/features/orderbook/orderbookConfig.ts`
  - [x] Export `ORDERBOOK_SYMBOLS` and `DEFAULT_SYMBOL`
  - [x] Update `OrderbookPanel` to import these
- [x] Move status formatting to a helper:
  - [x] Create `src/features/orderbook/lib/formatOrderbookStatus.ts`
  - [x] Use `OrderbookStatus` type from `store/orderbookStore.ts`
- [x] Move numeric formatting to a helper:
  - [x] Create `src/features/orderbook/lib/formatOrderbookNumber.ts`
  - [x] Use it in `OrderbookRow`
- [x] Update any tests impacted by these changes.

## Out of Scope (Task)

- [ ] Do not change UI layout or styling.
- [ ] Do not change business logic or data flow.
- [ ] Do not introduce new libraries.

## Technical Approach

- Keep config and formatters small, single-purpose modules.
- Preserve existing behavior and labels.

Suggested module boundaries:
- `src/features/orderbook/orderbookConfig.ts`
- `src/features/orderbook/lib/formatOrderbookStatus.ts`
- `src/features/orderbook/lib/formatOrderbookNumber.ts`

## Implementation Steps

1. Convert props from `type` to `interface` in the three presentational components.
2. Create `orderbookConfig.ts` and move symbol constants there.
3. Create `formatOrderbookStatus.ts` and replace `formatStatus` in `OrderbookPanel`.
4. Create `formatOrderbookNumber.ts` and replace `formatValue` in `OrderbookRow`.
5. Update imports and tests.

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] `npm run build` passes.
- [x] UI behavior remains unchanged.
- [x] `OrderbookPanel` no longer defines `SYMBOLS` or `formatStatus` inline.
- [x] `OrderbookRow` no longer defines `formatValue` inline.
