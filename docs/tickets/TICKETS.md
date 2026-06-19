# Tickets — the board

> The single source of truth for what's wrong and what's next. See `README.md` for the workflow,
> `TEMPLATE.md` for a blank ticket. Seeded 2026-06-18 from `docs/ARCHITECTURE_AUDIT.md`.

## Status board

| # | Title | Type | Pri | Status |
|---|---|---|---|---|
| 001 | Scoped "seek" surface for the Crystal | epic | P1 | backlog |
| 002 | Meeple ⇄ figure ⇄ place (John Dee on Prague Castle) | epic | P1 | **in-review** |
| 003 | Filter/backfill "Awaiting a sourced gloss" cards | bug | P2 | backlog |
| 004 | Wave-2 corpus ingestion | feature | P2 | backlog |
| 005 | Relational browse view (board entity graph) | feature | P2 | backlog |
| 006 | Memoize `computeRelations` across moves | perf | P3 | backlog |
| 007 | Source opposites/affinity vocabulary from corpus | refactor | P3 | backlog |
| 008 | Split `App.tsx` into `src/ui/` | refactor | P3 | backlog |
| 009 | Resolve Tailwind/Framer stack drift | debt | P3 | backlog |
| 010 | Turn the place/figure reveal into a wager (player choice) | feature | P2 | backlog |

---

### TICKET-001 · Scoped "seek" surface for the Crystal

- **status:** backlog
- **type:** epic · **priority:** P1 · **owner:** —
- **opened:** 2026-06-18 · **closed:** —
- **links:** `src/data/corpus/`, `src/App.tsx` (drawFromCrystal), narrative-review 014, `docs/ARCHITECTURE_AUDIT.md` §3.2

**Problem / intent.** 931 connectable corpus cards reach the player through one *random* "Draw from the
Crystal" button. That turns *discovery into lookup* and floods choice (Shipp, conflict erosion; the
ecosystem's own over-engineering critique). **DLC Packs (landed this session) partially address this** by
letting players pre-curate topical decks — but that is deck-*building*, not in-the-moment *seeking*. We
still want a scoped, in-play way to find the card that connects to what's on the board.

**Approach.** Add a *seek* verb: "find a bead that connects to this one." Given a bead's entity, query the
relation index for connected entities, scoped by active portal / tradition / era / private goal, and
offer a small ranked set instead of a random one. Reuse `observeBetween`/`relsByEntity`. Test the pure
selector first.

**Acceptance.**
- [ ] a pure `seekConnections(idx, fromEntityUid, opts)` returns ranked connected entities (tested first)
- [ ] the UI offers ≤ a handful of scoped choices, not a random draw
- [ ] scope filters (tradition/era/portal) demonstrably narrow the set
- [ ] strings grounded; build clean; HANDOVER updated

---

### TICKET-002 · Meeple ⇄ figure ⇄ place (John Dee on Prague Castle)

- **status:** in-review
- **type:** epic · **priority:** P1 · **owner:** magister-ludi (TDD demo)
- **opened:** 2026-06-18 · **closed:** —
- **links:** `src/data/corpus/derive.ts` (occupationForFigure), `src/data/corpus/place.ts` (new), `src/data/corpus/place.test.ts` (new), `docs/UNIFIED_ONTOLOGY.md` §game-projections

**Problem / intent.** The user's headline scenario: *"a meeple with the alchemist role on the Prague
Castle tile — I'd like to add the John Dee card to the meeple."* The data exists (`occupationForFigure`
maps a figure's vocation to an occupation; `participated_in`/`located_at` relations tie figures to places)
but nothing assembles "which figure cards are apt for occupation X at place Y."

**Approach (TDD demo — see `docs/TESTING.md`).** Build a **pure** selector, test-first:
`figuresForРlaceAndRole(idx, placeName, occupationId)` → figure entities who (a) are tied to that place
via `located_at`/`participated_in`→event→location, and (b) whose `occupationForFigure` matches the role.
Wrote the failing test (`place.test.ts`) first (red), then implemented `place.ts` (green). UI attach-to-
meeple is a follow-up sub-task once the selector is trusted.

**Acceptance.**
- [x] `place.test.ts` written first and failed (red) — selector + place-figure resolution
- [x] `figuresForPlaceAndRole` implemented; test passes (green)
- [x] `placesForEntity` helper (a figure's associated locations) tested
- [ ] UI: clicking a meeple on a place tile offers the apt figure cards (follow-up sub-ticket)
- [x] `npm run build` clean; `npm test` green
- [ ] HANDOVER updated when the UI lands

**Notes / log.**
- 2026-06-18 — pure selector layer done via TDD (red→green). UI hook deferred to a follow-up so this
  ticket's *logic* can be trusted/tested independently of the view (Deckard Boundary: logic ≠ view).

---

### TICKET-003 · Filter/backfill "Awaiting a sourced gloss" cards

- **status:** backlog · **type:** bug · **priority:** P2 · **owner:** —
- **opened:** 2026-06-18 · **links:** `src/data/corpus/derive.ts` (entityToCard fallback), narrative-review 014

**Problem / intent.** Entities with no `summary` derive a card whose face reads "… Awaiting a sourced
gloss." This is honest but thin; the Grounding Rule prefers *empty over filler*.

**Approach.** Either exclude summary-less entities from the curated deck (`curatedCards`) or backfill
glosses from the source DBs' longer fields. Decide via a count first.

**Acceptance.**
- [ ] count of fallback cards reported; decision recorded
- [ ] no "Awaiting a sourced gloss" card appears in the default curated deck
- [ ] test asserts `curatedCards` contains no fallback-text cards · build clean

---

### TICKET-004 · Wave-2 corpus ingestion

- **status:** backlog · **type:** feature · **priority:** P2 · **owner:** —
- **opened:** 2026-06-18 · **links:** `tools/ingest/build_corpus.py`, `docs/UNIFIED_ONTOLOGY.md`

**Problem / intent.** Eight more Knowledge-Portal DBs share the figures/texts/concepts/events schema and
are ingestible: CROWLEYDB, PicoDB, HermeticDB/EmeraldTablet, Neoplatonism, ChristianCabalaDB,
WitchcraftStudiesDB, AtalantaClaudiens, Hypnerotomachia. Pilot one (CROWLEYDB) before bulk.

**Acceptance.**
- [ ] CROWLEYDB adapter added; manifest reports its counts
- [ ] cross-DB `sameAs` links connect overlapping figures (Dee, Ficino…)
- [ ] ingester re-runs deterministically; corpus + manifest regenerate · build clean

---

### TICKET-005 · Relational browse view (board entity graph)

- **status:** backlog · **type:** feature · **priority:** P2 · **owner:** —
- **opened:** 2026-06-18 · **links:** `src/data/corpus/loader.ts` (relsByEntity), wiki `architecture_frontend_patterns.md` (relational browsing / no dead ends)

**Problem / intent.** The game holds a rich relation graph but offers no way to *browse* it — violating
the ecosystem's "no dead ends" principle. A small graph/side-panel of an entity's connections would let
players explore tangents.

**Acceptance.**
- [ ] clicking a corpus bead shows its connected entities + predicate labels
- [ ] each connection is cited and navigable · no dead-end panels · build clean

---

### TICKET-006 · Memoize `computeRelations` across moves

- **status:** backlog · **type:** perf · **priority:** P3 · **owner:** —
- **links:** `src/engine/relations.ts`

**Problem / intent.** Relations recompute from scratch each move. Fine at 5×5; could matter on big boards
or with the full corpus registered.

**Acceptance.**
- [ ] relations cached/invalidated per changed cell · identical output (test) · no UI regression

---

### TICKET-007 · Source opposites/affinity vocabulary from corpus

- **status:** backlog · **type:** refactor · **priority:** P3 · **owner:** —
- **links:** `src/engine/relations.ts` (OPPOSITES)

**Problem / intent.** The opposites list is hard-coded. It should be sourced like the rest of the
grounded data so it can grow without code edits.

**Acceptance.**
- [ ] opposites/affinities read from a data source · existing relation tests still pass

---

### TICKET-008 · Split `App.tsx` into `src/ui/`

- **status:** backlog · **type:** refactor · **priority:** P3 · **owner:** —
- **links:** `src/App.tsx`

**Problem / intent.** One ~350+ line file mixes board, hand, packs, corpus, print-shop, editors. Extract
components for safer change.

**Acceptance.**
- [ ] `Board`, `InfoPanel`, pack modal, (future) seek panel live in `src/ui/` · behaviour unchanged ·
  build + tests green

---

### TICKET-010 · Turn the place/figure reveal into a wager (player choice)

- **status:** backlog · **type:** feature · **priority:** P2 · **owner:** —
- **opened:** 2026-06-18 · **links:** `src/data/corpus/place.ts`, TICKET-002, narrative-review 016

**Problem / intent.** The place/figure selector (TICKET-002) is well-knitted to theme but currently
*auto-resolves*: place + role deterministically reveals the apt figures. Per review 016 (Shipp ch.4 on
conflict; Ham's three conditions for a real choice — cost, alternatives-under-pressure, uncertainty),
that's a database *lookup*, not a *decision*. The history should **gate** the choice, not **make** it.

**Approach (owners: mirror-warden + crucible-engineer).**
- When the selector returns **>1** figure: the player spends the placement to **claim one**, locking the
  others out for the round (claimable by an opponent in hot-seat) — a wager with cost + alternatives.
- When it returns **exactly 1**: keep a deliberate **commit** beat, not an auto-attach.
- When it returns **0**: surface grounded info ("no one of your vocation stood here — place elsewhere"),
  not a dead end.

**Acceptance.**
- [ ] selecting at a multi-figure place forces a claim that excludes the others that round (tested)
- [ ] zero-result places give grounded guidance, not a dead end
- [ ] strings grounded (history + Hesse/Leary/RAW voice) · build + tests green

---

### TICKET-009 · Resolve Tailwind/Framer stack drift

- **status:** backlog · **type:** debt · **priority:** P3 · **owner:** —
- **links:** `CLAUDE.md` (stack decision), `src/styles.css`

**Problem / intent.** CLAUDE.md commits to Tailwind + Framer Motion; the app ships plain CSS. The
decision record and reality disagree.

**Acceptance.**
- [ ] either Tailwind/Framer adopted, or the docs updated to record "plain CSS for now" with rationale
