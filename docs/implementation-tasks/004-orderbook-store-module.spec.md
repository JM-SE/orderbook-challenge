# 004 Orderbook Store Module Specification

## Context

We need a feature-scoped store/module to hold the current orderbook state and connection status.
It sits between the WebSocket client wrapper and React UI.

This store is responsible for:
- a single source of truth for top-10 bids/asks
- bounded update policy (avoid render storms)
- exposing a stable subscription API for the hook/UI

## Requirements

- [x] Implement an orderbook store/module (feature-scoped):
  - [x] Holds current `symbol`
  - [x] Holds connection `status` (connecting | connected | error)
  - [x] Holds `bids` and `asks` as normalized top 10 levels
  - [x] Holds `error` (optional)
- [x] Integrate with `createBinanceWsClient`:
  - [x] Start/stop the WS client based on symbol
  - [x] Ensure only one active connection per symbol selection (close previous on change)
- [x] Apply bounded update policy:
  - [x] “Latest wins” (no backlog accumulation)
  - [x] Batch UI-facing updates (e.g., at most once per animation frame)
- [x] Expose a subscription API suitable for React:
  - [x] `getSnapshot()` (returns derived UI state)
  - [x] `subscribe(listener)` (returns unsubscribe)
- [x] Unit tests (no real network):
  - [x] updates normalize and store top 10
  - [x] symbol switch closes previous connection
  - [x] bounded updates (batching works as intended)

## Out of Scope (Task)

- [ ] Do not implement React hook yet (task 005).
- [ ] Do not implement UI components (task 006).
- [ ] Do not add global state libraries (e.g., Zustand).
- [ ] Do not implement complex reconnection state machines.

## Technical Approach

- Keep it under `src/features/orderbook/store/`.
- Use plain TypeScript module state (or a small class) with explicit methods.
- Use `normalizeOrderbook` from task 002.
- Use dependency injection for the WS client to keep tests simple.

Suggested module boundaries:
- `src/features/orderbook/store/orderbookStore.ts`
- `src/features/orderbook/store/orderbookStore.test.ts`

## Implementation Steps

1. Define the store state shape and public API.
2. Implement subscription mechanism (`subscribe` / `getSnapshot`).
3. Wire WS client:
   - on connect: set status
   - on message: normalize + store latest snapshot
   - on error/close: set error/status
4. Implement batching policy (RAF).
5. Add unit tests with a fake WS client.

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] Store exposes `subscribe` and `getSnapshot`.
- [x] Symbol switching closes previous connection and resets state appropriately.
- [x] Updates are bounded (no unbounded re-render style update loops).
- [x] No React code and no UI code is introduced in this task.
