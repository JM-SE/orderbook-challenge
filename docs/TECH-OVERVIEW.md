# Trading UI – Technical Overview

This project is a frontend technical challenge focused on building a real-time orderbook viewer using **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **WebSockets**.

The goal is to demonstrate **frontend architectural judgment**, real-time data handling, and clear technical decision-making — not to build a production-grade trading platform.

For the normative requirements and acceptance criteria, see `SPEC.md`.

---

## High-level approach

The application consumes **real-time market data via WebSockets** and renders it directly in the browser.

- No backend services or intermediate proxies are introduced.
- The frontend connects directly to the public Binance WebSocket API.

This decision is intentional and contextual to the challenge.

---

## Challenge alignment (why WebSocket-first)

The original take-home prompt suggests REST polling as the baseline, and lists a WebSocket connection as an optional bonus.

This repository intentionally implements the **WebSocket-first** approach because it:
- better matches real-time trading-style UIs
- reduces staleness vs polling
- provides a cleaner end-to-end real-time data flow for frontend evaluation

Trade-off:
- We do not implement REST polling to keep scope focused and avoid maintaining two competing update strategies.

---

## Why WebSockets instead of polling

Market prices can change multiple times per second.

Polling an HTTP endpoint would:
- introduce unnecessary latency
- waste network resources
- provide stale data
- complicate synchronization

WebSockets provide:
- push-based updates
- lower latency
- simpler real-time semantics
- better alignment with trading-style UIs

---

## Data correctness and consistency model

The application displays **informational market data** sourced directly from the exchange.

- Data is real and comes from official Binance streams
- The UI does **not** attempt to reconstruct or guarantee exchange-level consistency
- Data is treated as **eventually consistent**, suitable for visualization purposes

This application does **not**:
- execute trades
- manage orders
- reconstruct full order books
- provide financial guarantees

In a real trading platform, these responsibilities would belong to a dedicated backend system.

---

## Why there is no backend or WebSocket proxy

In production trading systems, frontend clients typically do **not** connect directly to exchanges.

A real architecture would include:
- backend market data ingestion
- snapshot + delta reconciliation
- fan-out streaming infrastructure
- normalization and buffering layers

For this challenge, introducing such infrastructure would:
- add significant complexity
- distract from frontend evaluation
- provide little additional signal

The direct WebSocket approach keeps the focus on **frontend real-time handling**, which is the core objective here.

---

## Role of Next.js in this project

Next.js is used as a **frontend framework**, not as a trading engine.

Its responsibilities are limited to:
- application structure and routing
- layout and UI composition
- client-side rendering
- optional server-side rendering for static content and metadata

Real-time market data is handled **exclusively on the client**.

---

## WebSocket lifecycle management

WebSocket connections are explicitly managed to ensure predictable behavior:

- one active connection per trading pair
- connections are closed when the symbol changes
- connections are cleaned up when components unmount

This avoids:
- duplicated streams
- memory leaks
- mixed or stale data

---

## UI stability (bounded updates)

Because updates arrive frequently (`@100ms`), the UI must avoid render storms.

The intended model is:
- keep the latest snapshot (“latest wins”)
- bound UI update frequency (e.g., once per animation frame)
- keep the DOM structure stable (10 fixed rows per side)

The exact policy is defined in `SPEC.md`.

---

## Testing strategy

Each feature includes **basic tests** validating its core behavior.

Tests focus on:
- correct rendering
- data handling
- user-visible behavior

The goal is confidence and clarity, not exhaustive coverage.

---

## Containerized execution

The application is designed to run in a **Dockerized environment**.

This ensures:
- reproducible execution
- no dependency on local machine setup
- simple evaluation by reviewers

Docker is used as an execution contract, not as production infrastructure.

---

## Scope boundaries

This project intentionally avoids:

- backend services
- authentication
- private APIs
- order execution
- advanced trading mechanics
- high-frequency or low-latency optimizations

Those concerns are outside the scope of a frontend-focused technical challenge.

---

## Summary

This implementation reflects a conscious trade-off:

- Real-time data handling on the client
- Clear architectural boundaries
- Simplicity over over-engineering
- Correctness and clarity over feature volume

In a production trading platform, the architecture would differ significantly.
For this challenge, the chosen approach maximizes signal while remaining honest and technically sound.

---

For detailed requirements and constraints, see:
- `SPEC.md`
- `AGENTS.md`
