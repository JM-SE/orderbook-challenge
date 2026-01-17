# 008 Test Harness + Critical Tests Specification

## Context

The project already has basic tests, but test utilities/mocks are currently duplicated across files.
This task introduces a reusable test harness for real-time (WebSocket/store) behavior and adds a small set of critical missing tests.

The goal is to keep tests non-flaky, readable, and easy to extend for optional tasks.

## Requirements

### Test harness (reusable utilities)

- [x] Create feature-scoped test utilities under `src/features/orderbook/test-utils/`.
- [x] Provide a reusable `FakeWebSocket` (or equivalent) to test the WS client wrapper:
  - [x] capture created URLs
  - [x] helpers to emit `message`, `error`, `close`
- [x] Provide a reusable fake WS client factory for store tests:
  - [x] capture handlers (`onMessage`, `onError`, `onClose`)
  - [x] expose `connect`/`close` mocks
- [x] Provide a small RAF/batching helper:
  - [x] stub `requestAnimationFrame`
  - [x] ability to flush queued callbacks deterministically

### Refactor existing tests to use harness

- [x] Update tests in tasks 003/004 to reuse the harness utilities where it improves clarity.

### Add critical missing tests (high value)

- [x] UI tests for `OrderbookPanel`:
  - [x] renders `Error` state with message when hook returns `status: error`
  - [x] renders at least one bid/ask row when hook returns data
- [x] Formatter tests:
  - [x] quantity formatting does not render `0.00` for small non-zero values
  - [x] price formatting remains stable (2 decimals)
- [x] Store error path tests:
  - [x] when client triggers `onError`, store snapshot becomes `status: error` with message
  - [x] when client triggers `onClose`, store snapshot becomes `status: error`

## Out of Scope (Task)

- [ ] Do not add E2E tests.
- [ ] Do not introduce Playwright.
- [ ] Do not chase 100% coverage.

## Technical Approach

- Keep harness feature-scoped:
  - `src/features/orderbook/test-utils/fakeWebSocket.ts`
  - `src/features/orderbook/test-utils/fakeWsClientFactory.ts`
  - `src/features/orderbook/test-utils/raf.ts`
- Keep tests behavior-focused (avoid implementation detail assertions).

## Implementation Steps

1. Create `test-utils/` harness modules.
2. Refactor WS client tests and store tests to use harness.
3. Add missing UI tests (error + data rendering).
4. Add formatter tests.
5. Add store error-path tests.
6. Verify `npm test`, `npm run build`, and Docker build.

## Acceptance Criteria

- [x] `npm test` passes.
- [x] Tests do not rely on network calls.
- [x] Harness utilities are reused in multiple test files.
- [x] Critical missing behaviors are covered by tests.
