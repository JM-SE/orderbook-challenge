# AGENTS.md

This file defines how AI agents should collaborate on this project.

It does **not** restate product requirements or architectural decisions — those are defined in `SPEC.md`.
Agents are expected to **follow the spec strictly** and avoid introducing assumptions or scope changes without explicit instruction.

---

## 1. Source of truth

- `SPEC.md` is the single source of truth for:
  - scope
  - architecture
  - data flow
  - trade-offs
- If a conflict arises between code and spec, the **spec takes precedence**.
- Agents must not “improve”, reinterpret, or optimize the spec unless explicitly instructed.

---

## 2. Project intent

This project is a **frontend technical challenge**, not a production trading platform.

Agents must:
- prioritize clarity over completeness
- favor explicitness over clever abstractions
- avoid unnecessary complexity
- avoid over-engineering

The goal is to demonstrate **frontend judgment and architectural reasoning**, not feature volume.

Stack note (version pin):
- This repository targets **Next.js 14 (App Router) + React 18**.
- Agents must avoid introducing patterns that require Next.js 15 or React 19 unless `SPEC.md` explicitly upgrades the stack.

---

## 3. Allowed assumptions

Agents may assume:
- Binance WebSocket APIs are publicly accessible
- Market data is considered informational and eventually consistent, sourced directly from the exchange
- A single trading pair is actively viewed at a time

Agents must **not** assume:
- authentication or user accounts
- private or authenticated APIs
- order execution or trading actions
- backend-controlled infrastructure

---

## 4. WebSocket usage rules

- WebSockets are the primary and only source of real-time market data
- Polling must not be introduced
- WebSocket subscriptions must be explicitly managed:
  - a single active connection per trading pair
  - previous connections must be closed when the symbol changes
  - connections must be cleaned up on component unmount

If uncertain, agents should favor **simple and predictable lifecycle management** over complex or “perfect” handling.

Reconnection policy (keep it simple):
- If reconnection is implemented, it must be **simple and bounded** (e.g., small retry count and/or basic backoff).
- Do not introduce complex state machines or “perfect reliability” logic unless required by `SPEC.md`.

---

## 5. Frontend architecture constraints

Agents should:
- respect the chosen stack (React + Next.js App Router)
- keep state local where possible
- avoid global state unless clearly justified
- introduce new libraries only if they solve a concrete problem

Agents must not:
- introduce server-side WebSocket proxies between the client and Binance
- route real-time market data through Next.js server-side logic
- add backend-style responsibilities to the frontend
- add unnecessary infrastructure layers

Server-side rendering may be used for:
- layout and structural UI
- metadata and SEO
- initial page composition

Real-time market data must be handled **exclusively on the client**.

---

## 6. Code quality and testing expectations

Generated code should:
- be readable without external explanation
- use descriptive and consistent naming
- include minimal but meaningful comments
- avoid premature optimization

Each feature must include **at least basic tests** validating its core behavior.

Tests should focus on:
- correct rendering
- data handling
- user-visible behavior

Extensive coverage is not required, but **no feature should be delivered without tests**.

Testing tooling consistency:
- Prefer a single, consistent test stack across the repo (e.g., **React Testing Library** for UI + **Jest** for runner), as defined in `SPEC.md`.
- Tests should validate behavior (render + interactions + data handling) rather than internal implementation details.

---

## 7. Docker and environment awareness

- The project is expected to run in a containerized environment
- Agents must not assume local-only execution
- No hardcoded environment-specific paths or values
- Default application port is `3000`

All instructions and code must be compatible with Docker-based execution.

Dev/test command expectations:
- Changes must keep the standard workflows working (e.g., `dev`, `build`, `test`) as defined in `package.json`.
- Do not add steps that require non-standard global tooling or machine-specific setup.

---

## 8. What agents should NOT do

Agents must not:
- expand scope beyond what is defined in `SPEC.md`
- add features “because it’s easy” or “nice to have”
- chase edge cases not mentioned in the spec
- optimize for scale, high-frequency trading, or production-grade guarantees

Correctness and clarity take precedence over impressiveness.

---

## 9. Communication style between agents

Agents should:
- be explicit about decisions and reasoning
- prefer explanation over assertion
- clearly state uncertainty when present
- avoid hallucinating API capabilities or requirements

When in doubt, agents should **ask for clarification rather than guessing**.

---

## 10. Change management

If a change to any of the following is required:
- scope
- architecture
- data source
- core assumptions

The agent must:
1. describe the conflict clearly
2. explain why the change is necessary
3. wait for explicit approval before proceeding

---

End of `AGENTS.md`
