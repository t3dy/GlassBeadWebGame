# Testing & TDD — how we prove the code works

> **Practice:** we work **test-first** (Test-Driven Development). Before writing the code for a behaviour,
> we write a test that *fails*, then make it pass. The test suite is the safety net that lets us change a
> grounded, source-fed game without fear of silently breaking it.

## How to read this (Universal Design for Learning)

- 🟢 **Plain** — the idea in one breath.
- 🔵 **Do** — the exact commands/steps.
- 🟣 **Why** — the reasoning, so you can apply it to a case this page didn't foresee.

---

## 1. The TDD loop: Red → Green → Refactor

🟢 **Plain.** Write a failing test (red), write just enough code to pass it (green), then clean up
(refactor) without changing behaviour. Repeat in small steps.

🟣 **Picture.**

```
   ┌──────────┐     ┌──────────┐     ┌───────────┐
   │  RED     │ ──▶ │  GREEN   │ ──▶ │ REFACTOR  │ ──┐
   │ failing  │     │ passing  │     │ tidy, same│   │
   │ test     │     │ minimal  │     │ behaviour │   │
   └──────────┘     └──────────┘     └───────────┘   │
        ▲                                             │
        └─────────────────────────────────────────────┘
```

🟣 **Why test-first (not test-after).** Writing the test first forces you to (1) define "done" precisely
before you're attached to an implementation, (2) prove the test can actually fail — a test that passes
before you write the code tests nothing, and (3) design for testability, which in this codebase means
keeping logic **pure** and out of the React view (the **Deckard Boundary**: deterministic logic is
testable; UI and judgment are not). Kent Beck, *Test-Driven Development by Example*, ch. 1–2.

## 2. What we test where

| Layer | What | How |
|---|---|---|
| `src/engine/*` | rules: `applyMove`, scoring, `computeRelations`, invariants | `vitest` unit tests (pure) |
| `src/data/corpus/*` | derivation, observation, place/role selectors | `vitest` against small in-memory fixtures |
| `src/App.tsx` & UI | rendering, interactions | preview verification (snapshot/click), noted in the ticket |

🟣 **Why fixtures, not the real 3 MB corpus, in unit tests.** A unit test must be fast and deterministic.
We hand-build a 3–5 entity fixture that exercises the logic (see `corpus.test.ts`, `place.test.ts`) rather
than loading the generated corpus. The real corpus is validated separately by the ingester's manifest.

## 3. Commands

🔵 **Do.**
```bash
npm test            # run the whole suite once (vitest run) — must be green before 'done'
npm run build       # tsc type-check + vite build — must be clean
```
There is no watch script defined; add `vitest` (watch) locally if you like. CI runs `npm test` on push
(see `.github/workflows/deploy.yml`).

## 4. A worked example (this is real — TICKET-002)

The John-Dee-on-Prague-Castle selector was built this way:

🔵 **Step 1 — Red.** `src/data/corpus/place.test.ts` was written first, asserting that
`figuresForPlaceAndRole(idx, 'Prague Castle', 'alchemist')` returns John Dee. Running `npm test` then
failed to even import `place.ts` (module didn't exist) — a legitimate red.

🔵 **Step 2 — Green.** `src/data/corpus/place.ts` was implemented with `placesForEntity` and
`figuresForPlaceAndRole`, reusing the existing relation indexes. `npm test` then passed.

🔵 **Step 3 — Refactor.** Tidied the helpers; behaviour unchanged; suite stayed green.

🟣 **Why this ticket as the demo.** It's the user's headline feature *and* it's pure selection logic — the
ideal TDD shape. The UI that attaches the found card to a meeple is a deliberate follow-up: by testing the
*selection* in isolation we can trust it before any pixels exist (Deckard Boundary again).

## 5. Definition of Done (shared with the ticket system)

A change is not `done` until a test fails without it and passes with it, the build is clean, and any
player-facing string is grounded/cited. See `docs/tickets/README.md` §5.

## 6. Writing a good test here

- **Arrange a minimal fixture** — only the entities/relations the behaviour needs.
- **Assert behaviour, not implementation** — test what `figuresForPlaceAndRole` *returns*, not how.
- **Prove the red** — run the test before the code and confirm it fails for the right reason.
- **One behaviour per `it()`** — names read as sentences: `it('returns figures tied to a place by role')`.
- **Keep player-facing text grounded** — if a test asserts a string, it should be a sourced one.
