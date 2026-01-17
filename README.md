# Orderbook Viewer (WebSocket-first)

Frontend take-home style challenge: a real-time orderbook viewer built with **Next.js 14 (App Router)**, **React 18**, and **TypeScript**, consuming **Binance public WebSocket market data**.

This repository intentionally implements the **WebSocket-first** approach (listed as an optional bonus in the original prompt) to better match real-time trading-style UIs.

## Features

- Trading pair selector with a predefined list of **>= 5 symbols**
- Top **10 bids** and **10 asks** (price + quantity)
- Clear visual distinction between bids and asks
- Live updates via Binance WebSocket stream (`<symbol>@depth10@100ms`)
- Explicit UI states: loading/connecting, error, empty/unavailable data

## Running (Docker)

This is the evaluation contract.

```bash
docker build -t orderbook-challenge .
docker run -p 3000:3000 orderbook-challenge
```

Then open `http://localhost:3000`.

## Running (Local)

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` – run the dev server
- `npm run build` – build the production bundle
- `npm run start` – run the production server (standalone output)
- `npm run lint` – run lint checks

## Design Decisions / Trade-offs

- **WebSocket-first (no polling):** the original prompt suggests REST polling as a baseline, but also lists WebSockets as an optional bonus. This repo implements the WebSocket path to reduce staleness and better model trading-style UIs.
- **Single-route UI:** the experience lives on `/` to avoid extra screens that add little evaluation signal for this challenge.
- **Display-only correctness:** market data is treated as informational and eventually consistent. The UI does not attempt full orderbook reconstruction (snapshot + deltas).
- **Scope boundaries:** no auth, no trading actions, no persistence, no backend proxy.
- **UI stability over perfect accuracy:** updates are bounded to avoid flicker/layout shifts and render storms.

For the normative requirements and acceptance criteria, see:
- `docs/SPEC.md`
- `docs/TECH-OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `AGENTS.md`

For incremental, spec-driven implementation work, see:
- `docs/implementation-tasks/`

## Testing

Basic tests should validate core behavior:
- loading/connecting → data state
- switching symbols closes the previous connection
- parsing/normalization keeps the top-10 shape
- error state is visible

(Testing setup may be added/expanded as the project evolves.)

## Dependency Audit Note

`npm audit` may report vulnerabilities in transitive **dev tooling** dependencies.
This repo intentionally avoids `npm audit fix --force` because it can introduce breaking upgrades (e.g., major framework/tooling changes) that are out of scope for this take-home.

## What I’d improve with more time

- Full orderbook synchronization (snapshot + deltas)
- Spread indicator (best ask - best bid)
- Depth visualization (relative volume bars)
- More robust (but still bounded) reconnection policy
- Expanded test coverage
