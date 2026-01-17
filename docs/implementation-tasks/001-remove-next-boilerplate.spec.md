# 001 Remove Next.js Boilerplate Specification

## Context

This repository was bootstrapped with `create-next-app` and still contains template content.
Before implementing the orderbook viewer, we want to minimize noise and keep the codebase focused and easy to review.

## Requirements

- [ ] Remove template content that does not contribute to the challenge.
- [ ] Keep the project runnable in local development.
- [ ] Keep the project runnable via Docker (evaluation contract).
- [ ] Keep Next.js App Router + TypeScript intact.
- [ ] Leave a minimal, stable placeholder home page aligned with the challenge.

## Out of Scope (Task)

- [ ] Do not implement the WebSocket client, store, hook, or orderbook UI yet.
- [ ] Do not add new libraries (e.g., Zustand).
- [ ] Do not change decisions in `docs/SPEC.md`.

## Technical Approach

- Replace the home page content with a minimal placeholder (e.g., title + short description).
- Remove references to template assets and demo text that no longer apply.
- Keep the existing `src/` structure and Next.js conventions.

## Implementation Steps

1. Identify template components/styles/assets that are not needed for the challenge.
2. Replace the home page with a minimal placeholder.
3. Remove unused template code and references.
4. Verify `npm run dev`, `npm run build`, and the Docker build/run contract.

## Acceptance Criteria

- [x] `npm run dev` starts without errors and the home page renders minimal content.
- [x] `npm run build` succeeds.
- [x] `docker build -t orderbook-challenge .` succeeds.
- [x] `docker run --rm -p 3000:3000 orderbook-challenge` serves the app on port 3000.
- [x] The main UI no longer contains default Next.js template content.

## Notes for Review

- Manual check: open `http://localhost:3000` and confirm the placeholder is clean.
- Commands: `npm run dev`, `npm run build`, `docker build ...`, `docker run ...`
