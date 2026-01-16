# SPEC.md

## 1. Purpose

This project implements a real-time orderbook viewer using Binance public market data.

The primary goal is to demonstrate clear frontend architecture, sensible client-side state management, and stable UI behavior under frequent updates (no flicker / layout shifts), rather than exhaustive market accuracy or trading functionality.

**Stack (pinned):** Next.js 14 (App Router) + React 18 + TypeScript.

---

## 2. Scope

### Included

- Trading pair selector (minimum 5 symbols) with a default selection on load
- Real-time orderbook visualization (bids + asks)
- Price and quantity displayed for each level
- Top 10 bid and ask levels
- Visual distinction between bids and asks (e.g., color coding)
- Stable UI updates without flicker or layout shifts
- Explicit UI states: loading/connecting, error, empty/unavailable data

### Explicitly Out of Scope

- Trading or order placement
- Authentication
- Persistent storage
- Full depth orderbook synchronization / snapshot + delta reconciliation
- Advanced animations or visual effects
- Server-side WebSocket proxies or backend ingestion

---

## 3. Challenge Alignment (WebSocket-first)

The original take-home prompt proposes REST polling (every 1–2 seconds) as the baseline approach, and lists “WebSocket connection instead of polling” as an optional bonus.

This repository intentionally implements the **WebSocket-first** approach to better match real-time trading-style UIs.

**Trade-off:** REST polling is not implemented to keep scope focused and avoid introducing two competing real-time strategies.

---

## 4. Data Source & Update Strategy

- Data source: Binance public WebSocket API
- Stream used: `<symbol>@depth10@100ms`
- The application does not use REST polling for orderbook updates.

### Message shape (expected)

The `depth10` stream provides a bounded snapshot-like payload suitable for rendering:

```json
{
  "lastUpdateId": 1027024,
  "bids": [["price", "quantity"]],
  "asks": [["price", "quantity"]]
}
```

### Rationale

- WebSockets provide push-based updates with lower latency than polling
- `depth10` delivers a bounded dataset suitable for UI rendering
- This avoids the complexity of full orderbook synchronization while maintaining real-time behavior

---

## 5. Application Architecture

The application follows a simple, explicit data flow:

Binance WebSocket
↓
WebSocket Client
↓
Orderbook Store
↓
UI Components

### Responsibilities

- **WebSocket Client**
  - Handles connection lifecycle and message parsing
  - Enforces a single active connection at any time (per selected symbol)

- **Orderbook Store**
  - Maintains normalized orderbook state for the current symbol
  - Holds only the top 10 bids and asks
  - Applies a bounded update policy (avoid render storms)

- **UI Components**
  - Presentation only
  - No data-fetching logic

### WebSocket lifecycle rules

- Only one active WebSocket connection exists at any time.
- Previous connections must be closed when the symbol changes.
- Connections must be cleaned up on component unmount.

Market data is treated as display-only information; no guarantees of trading accuracy are provided.

---

## 6. State Management Strategy

- Orderbook data is managed in a centralized client-side store/module
- UI components subscribe only to derived state (top 10 bids/asks + connection state)
- No server-side state or persistence is used

This approach prioritizes clarity and UI stability over exhaustive data completeness.

---

## 7. Update Policy (UI Stability)

The UI must remain stable under frequent updates.

Guidelines for implementation (keep it simple and bounded):
- Always keep the latest received snapshot in the store (“latest wins”)
- Bound UI update frequency (e.g., at most once per animation frame)
- Keep the DOM structure stable (e.g., fixed rows/slots for 10 levels)

---

## 8. UI States & Error Handling

The UI explicitly handles:

- Initial loading / connecting state (before first snapshot)
- WebSocket connection errors (visible; not silent)
- Trading pair switching
- Empty or unavailable data states

---

## 9. Testing Expectations

Each feature must include at least basic tests validating core behavior.

Minimum test plan:
- Rendering: loading/connecting → data state
- Switching: changing symbol closes previous connection and shows the new symbol’s data
- Data handling: parsing/normalization preserves the top 10 bids/asks shape
- Error handling: connection errors surface visibly

Tests should focus on user-visible behavior rather than internal implementation details.

---

## 10. Docker & Submission Contract

The repository must include:

- A `Dockerfile` that builds and runs the app
- The app must listen on port `3000`

A reviewer should be able to run:

- `docker build -t orderbook-challenge .`
- `docker run -p 3000:3000 orderbook-challenge`

---

## 11. Assumptions

- Binance WebSocket streams are publicly accessible and stable
- Network latency and minor data inconsistencies are acceptable for UI purposes
- Only one trading pair is actively viewed at a time
- The trading pair selector is populated from a predefined list of commonly traded symbols

---

## 12. Trade-offs & Non-Goals

- Full incremental orderbook synchronization is not implemented
- Orderbook accuracy is limited to the provided top levels
- Reconnection logic is intentionally minimal and bounded
- Coverage is intentionally lightweight, but core behaviors are tested

These decisions are deliberate and aligned with the scope of a take-home challenge.

---

## 13. Future Improvements

With additional time or expanded scope, the following could be explored:

- Full orderbook synchronization
- Backend ingestion/proxy for buffering, normalization, and fan-out (explicitly out of scope for this challenge)
- Spread indicator (best ask - best bid)
- Depth visualization (relative volume bars)
