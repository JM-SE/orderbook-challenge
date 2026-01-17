# 003 Binance WebSocket Client Wrapper Specification

## Context

We need a small, testable WebSocket client wrapper to connect to Binance `depth10@100ms`,
parse incoming messages into typed shapes, and expose events to the rest of the feature.

This wrapper must not own UI state or rendering policies (those belong to the store/module and hook).

## Requirements

- [x] Provide a function to build the Binance stream name from a symbol:
  - `<symbol>@depth{levels}@{intervalMs}ms` (symbol must be lowercased, defaults to 10/100)
- [x] Expose depth levels and interval defaults via a small config module.
- [x] Provide a WebSocket client wrapper that:
  - [x] opens a WebSocket connection
  - [x] closes and cleans up the connection on demand
  - [x] parses incoming messages into the raw payload shape (reuse types from task 002)
  - [x] exposes callbacks/events for:
    - `onMessage(payload)`
    - `onError(error)`
    - `onClose(event)`
- [x] The wrapper must be usable without React.
- [x] Unit tests (no real network) validating:
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
- `src/features/orderbook/lib/binanceWsConfig.ts`
- `src/features/orderbook/lib/buildBinanceDepthStreamName.ts`
- `src/features/orderbook/lib/createBinanceWsClient.ts`

## Implementation Steps

1. Implement `buildBinanceDepthStreamName(symbol, { levels, intervalMs })`.
2. Implement a client factory that accepts callbacks and a WebSocket implementation.
3. Parse incoming `message.data` as JSON and validate a minimal expected shape.
4. Add unit tests using a fake WebSocket implementation (no network).

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] Wrapper can be used without React.
- [x] No store/hook/UI responsibilities are introduced.
