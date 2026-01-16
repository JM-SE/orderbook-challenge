# Frontend Architecture

This document defines the **frontend architectural approach** for the project.

It explains how the codebase should be structured, which patterns are preferred, and which approaches are intentionally avoided.

This file complements `SPEC.md` and serves as a technical guide for both humans and AI agents.

Document precedence (spec-driven):
- `docs/SPEC.md` is the single source of truth for scope and architecture.
- `docs/ARCHITECTURE.md` provides implementation guidance and code organization rules.
- `docs/TECH-OVERVIEW.md` provides rationale and context.
- If any conflict exists, `docs/SPEC.md` wins.

---

## Architectural goals

The architecture prioritizes:

- clarity over abstraction
- explicit data flow
- predictable behavior
- ease of reasoning
- alignment with real-time UI requirements

The project is a **frontend technical challenge**, not a long-lived production system.  
Architecture choices reflect that context.

---

## Chosen architectural style

### Feature-based architecture (primary)

The codebase is organized by **features**, not by technical layers.

Each feature encapsulates:
- UI components
- local state
- hooks
- types
- tests

This allows the structure of the project to **reflect what the application does**, not which frameworks it uses.

This approach is inspired by *screaming architecture* principles.

Suggested minimal feature layout (example):
- `src/features/orderbook/`
  - `components/` (presentation components)
  - `hooks/` (required feature hook: React adapter)
  - `lib/` (ws client wrapper, parsing helpers)
  - `store/` (orderbook store/module)
  - `types.ts`
  - `__tests__/`

This layout is guidance, not a strict constraint, but boundaries must remain explicit.

---

## Why not Clean Architecture

Clean Architecture introduces multiple abstraction layers designed to protect complex business rules.

In this project:
- there is no rich domain logic
- there are no complex invariants
- there is no backend-driven business layer

Applying Clean Architecture would add indirection without meaningful benefits.

---

## UI composition strategy

Atomic Design is **not** applied as a strict methodology.

Instead:
- components are grouped pragmatically
- reusable UI elements may exist where duplication is obvious
- no formal atom/molecule taxonomy is enforced

The goal is to avoid over-structuring the UI layer.

---

## State management principles

- Local state is preferred by default
- State is lifted only when shared by multiple UI components within the same feature
- Global state (app-wide) is avoided unless clearly justified

Real-time orderbook data is **feature-scoped** (orderbook feature), but implemented as a **single store/module** for that feature.
This keeps a single source of truth and makes it easier to enforce:
- one active WebSocket connection per selected symbol
- bounded update policy (UI stability)

---

## Real-time data handling

Real-time logic is implemented using a **WebSocket Client** + **Orderbook Store** as defined in `docs/SPEC.md`,
and exposed to React via a **mandatory custom hook** (React-friendly adapter).

### Required modules (normative)

- **WebSocket Client**
  - owns connection lifecycle (connect/close) and message parsing
  - enforces one active connection (per selected symbol)

- **Orderbook Store**
  - owns normalized state (top 10 bids/asks + connection state)
  - applies a bounded update policy (“latest wins”, avoid render storms)

- **Custom Hook (required)**
  - provides the public React API for the feature (e.g., `useOrderbook(...)`)
  - subscribes components to derived store state
  - coordinates symbol switching at the feature boundary

### Non-responsibilities (to keep boundaries explicit)

- UI components must not handle WebSocket URLs, protocol details, or cleanup logic.
- The custom hook should not contain complex parsing/normalization logic (that belongs to the client/store).
- Do not introduce complex reconnection state machines unless required by `docs/SPEC.md`.

Feature contract (recommended):
- The orderbook feature exposes a single React entrypoint: `useOrderbook(symbol)`.
- The hook returns derived, UI-ready state only:
  - `bids` (top 10), `asks` (top 10)
  - `status` (connecting | connected | error)
  - `error` (optional message)
- The hook does not expose raw WebSocket messages.

Update policy guidance:
- Prefer batching UI updates via `requestAnimationFrame` when receiving frequent messages (e.g., `@100ms`).
- “Latest wins”: if multiple messages arrive before the next render, only apply the latest snapshot.

---

## Client vs server responsibilities

Next.js is used as a **frontend framework**, not as a data-processing layer.

Server-side capabilities may be used for:
- layout composition
- metadata
- SEO
- static or structural rendering

Real-time market data is handled **exclusively on the client**.

Server-side WebSocket proxies are intentionally avoided.

---

## Testing approach

Tests are written **per feature**.

Each feature must include basic tests validating:
- correct rendering
- correct handling of incoming data
- visible behavior from the user's perspective

The focus is confidence and correctness, not exhaustive coverage.

WebSocket test seam:
- WebSocket interactions should go through a small client wrapper (module), so tests can mock the wrapper without relying on a real network connection.
- Avoid mocking deep browser internals in every test; mock at the feature boundary where possible.

---

## Explicit non-goals

The architecture intentionally avoids:

- backend-style layering
- domain-driven modeling
- centralized event buses
- complex state machines
- infrastructure-heavy patterns

These concerns are outside the scope of this project.

---

## Summary

This architecture is designed to:

- make intent obvious
- keep real-time logic contained
- support incremental development
- remain easy to evaluate and reason about

The structure should help the codebase **explain itself** without requiring additional documentation.

---

End of `ARCHITECTURE.md`
