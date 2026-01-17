# 007 App Integration + Contracts Specification

## Context

The core feature is implemented. This task focuses on app-level integration polish:
- consistent app shell (layout)
- metadata completeness
- minimal error boundary
- explicit client-only contract
- run contract verification
- a README note explaining why we keep a single route (`/`)

## Requirements

- [x] App shell:
  - [x] Move global layout chrome (background, padding, max width) into `src/app/layout.tsx`
  - [x] Keep `src/app/page.tsx` minimal (render `OrderbookPanel` only)
- [x] Metadata:
  - [x] Update `title` + `description` to final values (no template wording)
- [x] Error boundary:
  - [x] Add `src/app/error.tsx` with a minimal recovery UI
- [x] Client-only contract:
  - [x] Document in `docs/ARCHITECTURE.md` and/or `README.md` that `OrderbookPanel` is the client-only entrypoint
  - [x] Ensure no server component imports WebSocket/store modules
- [x] Run contract polish:
  - [x] Verify `npm run build` + `npm run start` work
  - [x] Docker build/run remains the evaluation contract (port 3000)
- [x] README decision:
  - [x] Note that the app stays on `/` to avoid extra screens with low evaluation signal

## Out of Scope (Task)

- [ ] Do not add new routes or navigation.
- [ ] Do not change feature-level logic (WS/store/hook).
- [ ] Do not introduce new UI libraries.

## Technical Approach

- Use `layout.tsx` as the global shell for consistent styling.
- Keep error boundary simple and non-distracting.
- Add a short README note for routing decision.

## Implementation Steps

1. Update `src/app/layout.tsx` with the shell and final metadata.
2. Simplify `src/app/page.tsx` to render only the feature entrypoint.
3. Add `src/app/error.tsx` with minimal recovery UI.
4. Add client-only contract note in docs/README.
5. Verify `npm run build`, `npm run start`, and Docker build/run.

## Acceptance Criteria

- [x] `npm run build` and `npm run start` work.
- [x] `docker build -t orderbook-challenge .` works.
- [x] `docker run -p 3000:3000 orderbook-challenge` serves the app.
- [x] `OrderbookPanel` is the single client entrypoint and documented as such.
- [x] README mentions the single-route decision.
