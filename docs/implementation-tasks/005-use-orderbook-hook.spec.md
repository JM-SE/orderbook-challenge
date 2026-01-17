# 005 useOrderbook Hook Specification

## Context

We need a mandatory React hook that serves as the public API of the orderbook feature.
It connects the feature-scoped store (task 004) to React and exposes UI-ready derived state.

The hook must not implement UI components; it only provides data/state to the UI.

## Requirements

- [x] Implement `useOrderbook(symbol)` as the single React entrypoint for the orderbook feature.
- [x] The hook must:
  - [x] call the orderbook store `connect(symbol)` when mounted and whenever `symbol` changes
  - [x] call `disconnect()` on unmount (cleanup)
  - [x] subscribe to store updates and re-render when the snapshot changes
  - [x] return derived, UI-ready state only:
    - [x] `bids` (top 10)
    - [x] `asks` (top 10)
    - [x] `status` (`idle` | `connecting` | `connected` | `error`)
    - [x] `error` (string | null)
- [x] No WebSocket logic in the hook (the store owns WS client lifecycle).
- [x] Unit tests (no network) validating:
  - [x] initial state reflects store snapshot
  - [x] symbol change triggers store connect and closes previous connection (via store behavior)
  - [x] unmount triggers disconnect
  - [x] hook updates when store snapshot changes

## Out of Scope (Task)

- [ ] Do not implement UI components (task 006).
- [ ] Do not add global state libraries (e.g., Zustand).
- [ ] Do not introduce complex reconnection state machines.
- [ ] Do not add server-side proxies.

## Technical Approach

- Put the hook under `src/features/orderbook/hooks/`.
- Prefer `useSyncExternalStore` to subscribe to the store:
  - store provides `subscribe(listener)` and `getSnapshot()`
  - hook becomes a thin adapter between React and the store
- The hook should not depend on Next.js server components.
- Tests should use React Testing Library and mock/inject a store instance (no real WS).

Suggested module boundaries:
- `src/features/orderbook/hooks/useOrderbook.ts`
- `src/features/orderbook/hooks/useOrderbook.test.tsx`

## Implementation Steps

1. Create a default store instance (feature-scoped) or accept an injected store for testing.
2. Implement `useOrderbook(symbol)`:
   - `useEffect` for `connect(symbol)` + cleanup `disconnect()`
   - `useSyncExternalStore` for subscribing to `getSnapshot()`
3. Return `{ bids, asks, status, error }` from the hook.
4. Add tests covering mount, update on store change, symbol switching, and unmount cleanup.

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] Hook does not import or depend on WebSocket modules directly.
- [x] Hook cleans up connections on unmount and symbol changes via the store.
- [x] Hook returns only UI-ready state (no raw WS payloads).
