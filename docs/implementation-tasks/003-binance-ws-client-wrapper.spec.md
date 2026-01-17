# 003 Binance WebSocket Client Wrapper Specification

## Context

We need a small, testable WebSocket client wrapper to connect to Binance `depth10@100ms`,
parse incoming messages into typed shapes, and expose events to the rest of the feature.

This wrapper must not own UI state or rendering policies (those belong to the store/module and hook).

## Requirements

- [ ] Provide a function to build the Binance stream name from a symbol:
  - `<symbol>@depth10@100ms` (symbol must be lowercased)
- [ ] Provide a WebSocket client wrapper that:
  - [ ] opens a WebSocket connection
  - [ ] closes and cleans up the connection on demand
  - [ ] parses incoming messages into the raw payload shape (reuse types from task 002)
  - [ ] exposes callbacks/events for:
    - `onMessage(payload)`
    - `onError(error)`
    - `onClose(event)`
- [ ] The wrapper must be usable without React.
- [ ] Unit tests (no real network) validating:
  - URL/stream generation
  - message parsing (valid payload)
  - invalid message handling (does not crash; surfaces an error signal)
  - close behavior (close is idempotent)

## Out of Scope (Task)

- [ ] Do not implement the orderbook store/module.
- [ ] Do not implement React hook(s).
- [ ] Do not implement UI components.
- [ ] Do not implement complex reconnection state machines.
- [ ] Do not introduce a server-side proxy.

## Technical Approach

- Keep it feature-scoped under `src/features/orderbook/lib/`.
- Prefer dependency injection for testability:
  - allow passing a `WebSocket` factory/constructor so tests can run without browser globals
- Keep the API explicit and small.

Suggested module boundaries:
- `src/features/orderbook/lib/buildBinanceDepth10StreamName.ts`
- `src/features/orderbook/lib/createBinanceWsClient.ts`

## Implementation Steps

1. Implement `buildBinanceDepth10StreamName(symbol)`.
2. Implement a client factory that accepts callbacks and a WebSocket implementation.
3. Parse incoming `message.data` as JSON and validate a minimal expected shape.
4. Add unit tests using a fake WebSocket implementation (no network).

## Acceptance Criteria

- [ ] `npm run test` passes.
- [ ] Wrapper can be used without React.
- [ ] No store/hook/UI responsibilities are introduced.
