# 011 Orderbook Store Modularization Specification

## Context

The orderbook store currently handles multiple responsibilities in a single file:
- subscription management
- RAF batching
- retry scheduling
- WebSocket lifecycle + stale event guard

This task modularizes those concerns into small, internal helpers while preserving behavior and public API.

## Requirements

- [ ] Keep the public store API unchanged:
  - `connect(symbol)`
  - `disconnect()`
  - `getSnapshot()`
  - `subscribe(listener)`
- [ ] Extract internal helpers into `src/features/orderbook/store/internal/`:
  - [ ] `emitter.ts` — manages subscribers + emit
  - [ ] `rafBatcher.ts` — manages latest payload + RAF scheduling
  - [ ] `retryScheduler.ts` — manages bounded retries
  - [ ] `connectionGuard.ts` — manages active connection ids
- [ ] Keep behavior identical (no functional change).
- [ ] Tests should remain unchanged and pass.

## Out of Scope (Task)

- [ ] Do not change UI, hook, or WS client behavior.
- [ ] Do not introduce new libraries.
- [ ] Do not change retry policy values.

## Technical Approach

- Implement small, pure helpers in `store/internal/`.
- In `orderbookStore.ts`, wire helpers together to keep logic readable.
- Keep tests as-is; only update imports if necessary.

## Implementation Steps

1. Create `store/internal/emitter.ts` with `createEmitter()`.
2. Create `store/internal/rafBatcher.ts` with `createRafBatcher()`.
3. Create `store/internal/retryScheduler.ts` with bounded retry policy.
4. Create `store/internal/connectionGuard.ts` with active connection id tracking.
5. Refactor `orderbookStore.ts` to use these helpers.
6. Ensure tests still pass without modification.

## Acceptance Criteria

- [ ] `npm run test` passes.
- [ ] `orderbookStore.ts` is smaller and easier to read.
- [ ] Public API and behavior remain unchanged.
