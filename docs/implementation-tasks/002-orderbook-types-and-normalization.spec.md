# 002 Orderbook Types + Normalization Specification

## Context

The orderbook UI consumes frequent updates from Binance.
Before building the WebSocket client, store, and hook, we want a small, well-typed foundation for representing and normalizing orderbook data.

This task defines the core TypeScript types and normalization utilities that later layers can reuse.

## Requirements

- [ ] Define TypeScript types for:
  - raw Binance orderbook payload (`bids`/`asks` as string tuples)
  - normalized orderbook levels (price/quantity as numbers)
  - derived UI-ready structure (top 10 bids/asks)
- [ ] Implement normalization utilities:
  - convert strings to numbers
  - drop invalid levels (non-finite numbers, negative values)
  - sort bids/asks in the correct direction
  - keep only the top 10 levels per side
- [ ] Add unit tests validating normalization behavior.

## Out of Scope (Task)

- [ ] Do not add a state management library (e.g., Zustand).
- [ ] Do not implement WebSocket connection logic.
- [ ] Do not implement the orderbook store/module.
- [ ] Do not implement UI components.

## Technical Approach

- Keep types and utilities feature-scoped under `src/features/orderbook/`.
- Use a small number of pure functions that are easy to unit test.
- Prefer explicit naming and readable code over micro-optimizations.

Suggested module boundaries:
- `src/features/orderbook/types.ts`
- `src/features/orderbook/lib/normalizeOrderbook.ts`

## Implementation Steps

1. Define raw and normalized types for bids/asks.
2. Implement `normalizeOrderbook(raw)` returning a UI-ready structure.
3. Add unit tests for:
   - basic happy path
   - sorting direction
   - trimming to top 10
   - filtering invalid values

## Acceptance Criteria

- [ ] Types are explicit and used by the normalization function.
- [ ] `normalizeOrderbook` is pure and deterministic.
- [ ] Unit tests cover the core behavior and pass locally.

## Notes for Review

- Focus on correctness and readability.
- Tests should not rely on network calls.
