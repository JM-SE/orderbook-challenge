# Implementation Tasks

## Context

This folder contains small, executable implementation specifications (spec-driven development).
The goal is that each meaningful code change is backed by a concrete, scoped, reviewable spec.

## Precedence / Source of Truth

- `docs/SPEC.md` is the single source of truth for scope, architecture, and constraints.
- Implementation task specs must not contradict `docs/SPEC.md`.
- If a task requires changing scope/architecture/data source/core assumptions, propose and approve the change in `docs/SPEC.md` first.

## Naming

- Use incremental numbering: `001-...spec.md`, `002-...spec.md`, etc.
- Filenames must be short and scannable.

## Definition of Done (DoD)

A task is considered done when:

- Its acceptance criteria are met.
- Basic tests exist when applicable (per `AGENTS.md`).
- Standard workflows still work (`dev`, `build`, `start`), as defined in `package.json`.
- The Docker evaluation contract remains valid (`docker build` / `docker run`).

## Template

Use `TEMPLATE.md` as the canonical task format.

## Backlog (High Level)

This is a lightweight roadmap. Only the next 1–2 tasks should have full specs at any given time.

Planned tasks (titles may evolve as we implement):

- 001 Remove Next.js Boilerplate
- 002 Orderbook Types + Normalization
- 003 Binance WebSocket Client Wrapper
- 004 Orderbook Store Module (feature-scoped)
- 005 `useOrderbook(symbol)` Hook (public feature API)
- 006 Orderbook UI Components (selector + bids/asks)
- 007 App Integration (route/page wiring)
- 008 Test Harness (WebSocket mocking helpers)

Optional / bonus tasks:

- 009 UI Extras (spread indicator + depth bars)
- 010 Bounded Reconnection Policy
