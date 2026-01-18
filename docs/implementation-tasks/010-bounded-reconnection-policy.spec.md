# 010 Bounded Reconnection Policy Specification

## Context

WebSocket connections can fail due to network issues, backgrounding, or intermittent exchange outages.
A simple, bounded reconnection policy improves UX without adding complex reliability logic.

This must remain **simple and bounded** per `AGENTS.md`.

## Requirements

- [x] Implement a bounded reconnection policy:
  - [x] Retry a small, fixed number of times (e.g., 3 attempts).
  - [x] Use a simple backoff (e.g., 250ms → 500ms → 1000ms).
  - [x] Stop retrying after the limit and surface `status: error`.
- [x] Reset retry state when:
  - [x] the user switches symbol
  - [x] a connection succeeds
- [x] The UI should indicate retrying (reuse `Connecting` or add `Reconnecting` if minimal).
- [x] No state machines or complex reliability logic.

## Out of Scope (Task)

- [ ] Do not implement infinite retries.
- [ ] Do not add external retry libraries.
- [ ] Do not add server-side proxies.

## Technical Approach

- Implement in the **store** (preferred) or WS client wrapper if simpler.
- Keep retry counters/timeouts internal and feature-scoped.
- Use `setTimeout` for backoff scheduling.
- Use the existing test harness (`test-utils`) to test retries deterministically.

Suggested constants:
- `MAX_RETRIES = 3`
- `RETRY_DELAYS_MS = [250, 500, 1000]`

## Implementation Steps

1. Add retry state (counter + pending timeout) to the store.
2. On `onClose` / `onError`, schedule a retry if under limit.
3. On successful message after reconnect, reset retry counter.
4. On symbol change, clear pending retry + reset counter.
5. Add tests using fake WS client + fake timers:
   - retries happen up to limit
   - error after limit reached
   - reset on symbol change

## Acceptance Criteria

- [x] `npm run test` passes.
- [x] Retry attempts are bounded and stop at the limit.
- [x] Retry state resets on symbol change or successful reconnect.
- [x] UI shows a connecting state during retries.
