# EduPrep Frontend — Architectural Refactor Plan

> Generated from the senior architectural audit on 2026-02-22.
> Execute tasks in order. Each task is self-contained with full context.

## Execution Order

| # | Task | Urgency | Estimated Effort | Dependencies |
|---|---|---|---|---|
| 01 | Dead Code Cleanup | 🔴 Critical | 1–2 hours | None |
| 02 | Extract `useTestEngine` Hook | 🔴 Critical | 3–4 hours | 01 |
| 03 | Extract `useProctoring` Hook | 🔴 Critical | 2–3 hours | 02 |
| 04 | Decompose `TestInterface` Shell | 🟠 High | 2–3 hours | 02, 03 |
| 05 | Query Key Factory + TanStack Architecture | 🟠 High | 2–3 hours | None |
| 06 | Mutation Cache Invalidation | 🟠 High | 2 hours | 05 |
| 07 | Data Transformation Layer | 🟡 Medium | 2–3 hours | 05 |
| 08 | Server Component Conversion | 🟠 High | 1–2 hours | None |
| 09 | Eliminate Duplicated Logic | 🟡 Medium | 1–2 hours | 04 |
| 10 | Type System Cleanup | 🟡 Medium | 2–3 hours | 07 |
| 11 | Feature Slice Architecture | 🟡 Medium | 3–4 hours | All above |

## Rules

- Complete each task fully before moving to the next.
- Verify `next build` passes after each task.
- Do not introduce new patterns that conflict with upcoming tasks.
- Mark tasks as `[x]` in this file once complete.

## Progress

- [ ] 01 — Dead Code Cleanup
- [ ] 02 — Extract `useTestEngine` Hook
- [ ] 03 — Extract `useProctoring` Hook
- [ ] 04 — Decompose `TestInterface` Shell
- [ ] 05 — Query Key Factory
- [ ] 06 — Mutation Cache Invalidation
- [ ] 07 — Data Transformation Layer
- [ ] 08 — Server Component Conversion
- [ ] 09 — Eliminate Duplicated Logic
- [ ] 10 — Type System Cleanup
- [ ] 11 — Feature Slice Architecture
