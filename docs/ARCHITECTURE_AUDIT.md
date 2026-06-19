# Architecture Audit & Code Review — Glass Bead Game

> **What this document is.** A full-system architecture audit and code review of the
> `glassbeadgame` project, written to be read by three different audiences at once (see
> *How to read this*). It places the game inside the wider `C:\Dev` database ecosystem documented in
> `C:\Dev\wiki`, audits the actual code against that ecosystem's own stated principles (the **Deckard
> Boundary**, the three database archetypes, the over-engineering critique), and ends with a prioritized
> findings list that is mirrored into the new ticket system (`docs/tickets/`).
>
> **Date:** 2026-06-18 · **Reviewer:** Magister Ludi (architecture) · **Commit baseline:** `b7cd64c` +
> the unified-ontology "Crystal" layer and DLC-packs work landed this session.

---

## How to read this (Universal Design for Learning)

This audit follows **UDL** — *Universal Design for Learning* (CAST, 2018) — which asks that information
be offered in **multiple means of representation** so it is usable by people who learn differently. Every
major section therefore appears three ways:

| Icon | Representation | For the reader who… |
|---|---|---|
| 🟢 **Plain** | a jargon-free summary | wants the gist, or is new to the codebase |
| 🔵 **Technical** | files, types, data flow | will actually edit the code |
| 🟣 **Picture** | an ASCII diagram or table | thinks spatially / verifies structure at a glance |

> **Glossary (plain language).** Defined terms are collected at the end under *Glossary*. The first use
> of each is **bold**. This mirrors the wiki's own "Glossary for Undergraduates" convention.

UDL also asks for **multiple means of engagement** (why this matters is stated per section) and
**multiple means of action/expression** (each finding is *actionable* — it links to a ticket you can pick
up). The point is not decoration: it is that an audit nobody can act on is a failed audit.

---

## 1. Executive summary

🟢 **Plain.** The Glass Bead Game is healthy and unusually well-grounded. Its rules engine is a clean,
testable core with no UI or AI tangled into it, which is exactly the discipline the rest of your
ecosystem preaches but rarely achieves. The biggest *opportunity* is that the game now sits on top of a
2,470-entity knowledge graph built from four of your databases, and the surface that exposes that graph
to the player is still a single "draw a random card" button — the engine is a cathedral, the door is a
mail-slot. The biggest *risk* is the one your own wiki warns about: letting the data model grow faster
than the play, so the schema becomes the goal instead of the insight.

🔵 **Technical.** Pure-TS reducer (`src/engine/`) + React view (`src/App.tsx`) + a `DataStore` seam
(`src/store/`) + a lazy-loaded unified corpus (`src/data/corpus/`). 41 modules, ~190 KB main bundle, a
3 MB code-split corpus chunk. `npm test` 14/14 green; `npm run build` clean. No runtime network or LLM
dependency — the game is fully playable offline from `localStorage`.

🟣 **Picture.**

```
                         THE DECKARD BOUNDARY (respected ✓)
   build-time / deterministic        │        runtime / deterministic        │   (no LLM at runtime)
 ┌───────────────────────────────┐   │   ┌───────────────────────────────┐   │
 │ tools/ingest/build_corpus.py  │   │   │ src/engine/*  (pure reducer)  │   │
 │  4 study DBs → unified.corpus │ ──┼──▶│  applyMove · computeRelations │◀──┼── player input (React)
 │  .json  (+ manifest)          │   │   │  scoring · always-a-move      │   │
 └───────────────────────────────┘   │   └───────────────────────────────┘   │
        SQLite + JSON sources         │     src/data/corpus/* (derive/observe)│
                                      │     src/store/* (DataStore→localStorage)
```

---

## 2. The game in the ecosystem

🟢 **Plain.** Your wiki sorts every database into one of three kinds: a **Knowledge Portal** (a
searchable scholarly website — the "Cathedral"), a **Procedural Engine** (a database used as the rulebook
for a game — the "Dungeon Master"), and a **Social Megaphone** (mining personal chat logs). The Glass
Bead Game is the first project that is *both* of the first two at once: it is a Procedural Engine whose
ruleset is fed by your Knowledge Portals.

🔵 **Technical.** The corpus ingester (`tools/ingest/build_corpus.py`) reads the SQLite/JSON stores of
four Knowledge-Portal-class databases — AlchemyTimeline, MedievalMagicDB, RenMagDB, TheosophicalAlchemyDB
— and normalizes them to a single Entity/Relation model (`docs/UNIFIED_ONTOLOGY.md`). The game
(Procedural Engine) consumes that model at build time as a static asset. There is no live DB connection;
the portals contribute *content*, not *infrastructure*.

🟣 **Picture — where each database sits** (condensed from the full inventory the Explore pass produced):

| Archetype | Databases | Relation to the game |
|---|---|---|
| **Knowledge Portal** (Cathedral) | RenMagDB, HermeticDB/EmeraldTablet, AtalantaClaudiens, Pico, Neoplatonism, Hypnerotomachia, Shakespeare, QueryPat | **Source corpus** — ingested or ingestible (shared figures/texts/concepts/events schema) |
| **Procedural Engine** (Dungeon Master) | **glassbeadgame**, Digby Game, Dogs Game, Alchemy Timeline Map | The game *is* one of these |
| **Social Megaphone** | Megabase/Dreambase, SocialsDB, VCG | Out of scope (different schema; one portal link only) |

**Wave-1 ingested (live):** AlchemyTimeline · MedievalMagicDB · RenMagDB · TheosophicalAlchemyDB.
**Wave-2 ready (shared schema, not yet wired):** CROWLEYDB, PicoDB, HermeticDB/EmeraldTablet,
Neoplatonism, ChristianCabalaDB, WitchcraftStudiesDB, AtalantaClaudiens, Hypnerotomachia. → **TICKET-004**.

> **Engagement — why this matters.** Treating the portals as a content *supply chain* means every hour
> you spend improving a portal's data improves the game for free, and vice-versa. That compounding is the
> strategic reason this project is worth more than the sum of its parts.

---

## 3. Layer-by-layer audit

### 3.1 The engine (`src/engine/`) — ★ the strongest layer

🟢 **Plain.** This is the rulebook, written as pure logic with no screen and no AI. You can test it in
isolation, and it can never "forget" what happened because every change goes through one function. This
is the single best architectural decision in the project.

🔵 **Technical.** `engine.ts` exposes a pure reducer `applyMove(state, move) → state`. Types live in
`types.ts`; relation scoring in `relations.ts`; the always-available glyph/occupation banks in
`glyphBank.ts`/`occupations.ts`. No React import anywhere in the folder (verified). The **always-a-move
invariant** (`meditate`/`endTurn` is total and always legal) means the UI can never deadlock. Tests
(`engine.test.ts`, 8) cover the invariant and triad detection.

**Audit findings.**
- ✅ **Purity upheld.** The engine respects the **Deckard Boundary** absolutely: all "judgment" (which
  relation is meaningful, what it means) was pre-authored into data (`RELATION_CORPUS`) or ingested with
  citations — *zero* non-deterministic computation at runtime. This is the discipline
  `critique_database_engineering.md` says the ecosystem keeps failing; here it holds.
- ⚠️ **`computeRelations` is O(beads × neighbours × corpus) per recompute.** Mitigated this session by the
  indexed `matchCorpus` (lookup by attribute value, not a linear scan of thousands), but there is still no
  memoization across moves. Fine at 5×5; revisit if boards grow. → **TICKET-006**.
- ⚠️ **Opposites/affinity vocabulary is hard-coded** (`OPPOSITES` array). Grounded but small; should be
  sourceable from the corpus like the rest. → **TICKET-007**.

### 3.2 The corpus layer (`src/data/corpus/`) — new, sound, under-exposed

🟢 **Plain.** This is the bridge from your databases into the game. It turns a historical figure or text
into a playable card, and — the clever part — turns the *real relationships between them* into the
"situations" that appear when two cards sit side by side. It works and it's tested. What's missing is a
way for the player to *find* the card they want among ~931 of them.

🔵 **Technical.** `types.ts` (model) → `loader.ts` (lazy `import()` + three indexes: by-uid, by-name,
relation-adjacency) → `derive.ts` (`entityToCard`, `correspondencesOf`, `occupationForFigure`) →
`observe.ts` (relation graph → engine `RelationEntry` rows, grounded per-predicate templates) →
`index.ts` (`activateCorpus()` orchestration). Registration seams are minimal and additive
(`registerCorpusRelations`, `registerCorpusCards`). Test: `corpus.test.ts` (6) proves derivation +
that two adjacent corpus beads surface the real cited situation.

**Audit findings.**
- ✅ **Provenance preserved end-to-end** — every card/situation carries `sourceRef`; honours the Grounding
  Rule.
- ✅ **Local-first preserved** — dynamic import means the 3 MB corpus never touches the main bundle and the
  game runs if it fails to load.
- 🔴 **Exposure bottleneck (highest-value finding).** 931 connectable cards reach the player through one
  random-draw button. Per the narrative review (014) and `critique_database_engineering.md`, this turns
  *discovery into lookup* and floods choice. Needs a **scoped seek** surface (by portal/tradition/era/goal)
  and a *seek-by-connection* verb. → **TICKET-001 (epic)**.
- ⚠️ **Silent gloss fallback.** Entities with no summary become a card whose text is "… Awaiting a sourced
  gloss." — acceptable but should be filtered from the curated deck or backfilled. → **TICKET-003**.
- ⚠️ **The meeple⇄figure⇄place hook is specified but unbuilt.** `occupationForFigure` + `participated_in`/
  `located_at` relations are the data for "alchemist on Prague Castle → attach the John Dee card," but no
  function/UI assembles it yet. → **TICKET-002 (epic)**.

### 3.3 The view (`src/App.tsx`) — functional, monolithic, growing fast

🟢 **Plain.** One big file draws everything. It works, but it's getting large and mixes many concerns
(board, hand, packs, corpus, the print shop). Splitting it would make future work safer.

🔵 **Technical.** `App.tsx` is ~350+ lines and now also hosts the DLC-pack UI and corpus controls. Sub-
components (`Board`, `Tray`, `InfoPanel`, `Log`, `Setup`, editors) live in the same file. State is local
`useState`; persistence via a `useEffect`→`localStore`. Plain CSS (`styles.css`), not Tailwind/Framer yet
(PLAN Phase 4).

**Audit findings.**
- ⚠️ **Single-file growth.** Extract `Board`, `InfoPanel`, the pack modal, and the (coming) corpus-seek
  panel into `src/ui/`. → **TICKET-008**.
- ⚠️ **Stack drift vs. PLAN.** CLAUDE.md commits to Tailwind + Framer Motion; the app is still plain CSS.
  Either schedule the migration or update the doc so the decision record matches reality. → **TICKET-009**.
- ✅ **Accessibility baseline present** — the a11y snapshot shows real button roles and labels; good
  foundation for the Phase 7 keyboard/ARIA work.

### 3.4 Persistence (`src/store/`) — correctly abstracted

🟢 **Plain.** Saving is hidden behind a small interface, so swapping `localStorage` for an online database
later won't touch the game logic.

🔵 **Technical.** `DataStore` interface with `localStore` (key `gbg_save_v1`); homebrew + packs use their
own keys (`gbg_homebrew_v1`, `gbg_packs_v1`). The Supabase implementation (Phase 6) drops in behind the
same interface. ✅ No findings; this is the right shape. The unified corpus is the natural seed for the
future shared "crystal."

---

## 4. Cross-cutting review against the ecosystem's own principles

🟣 **Picture — scorecard.**

| Principle (from `C:\Dev\wiki`) | Verdict | Note |
|---|---|---|
| **Deckard Boundary** (det. code vs LLM judgment) | ✅ Exemplary | No runtime LLM; all judgment pre-authored & cited |
| **Avoid the over-engineering trap** (schema ≠ goal) | ⚠️ Watch | Corpus is rich; *play* surface must catch up (TICKET-001) |
| **Refuse closure / prefer empty over filler** | ⚠️ Watch | "Awaiting a sourced gloss" cards (TICKET-003) |
| **Relational browsing / no dead ends** | ❌ Gap | The game *has* the relation graph but no graph-browse UI (TICKET-002/005) |
| **Grounding Rule** (everything cited) | ✅ Upheld | `sourceRef` flows from DB → card → situation |
| **Always-a-move invariant** | ✅ Upheld | `meditate` total; tested |

🟢 **Plain takeaway.** You are strong exactly where the ecosystem is usually weak (discipline, grounding,
testability) and weak exactly where the ecosystem is usually strong (the relational, no-dead-ends
*reading/playing* surface). Closing that gap is the through-line of the ticket backlog.

---

## 5. Prioritized findings → tickets

All findings are filed in `docs/tickets/` (see `docs/tickets/TICKETS.md`). Summary:

| Ticket | Title | Type | Priority |
|---|---|---|---|
| **TICKET-001** | Scoped "seek" surface for the Crystal (replace random flood) | epic | **P1** |
| **TICKET-002** | Meeple ⇄ figure ⇄ place: attach John Dee to an alchemist on Prague Castle | epic | **P1** |
| **TICKET-003** | Filter/backfill "Awaiting a sourced gloss" corpus cards | bug | P2 |
| **TICKET-004** | Wave-2 corpus ingestion (CROWLEYDB, Pico, Hermetic, …) | feature | P2 |
| **TICKET-005** | Relational browse view (graph of board entities) | feature | P2 |
| **TICKET-006** | Memoize `computeRelations` across moves | perf | P3 |
| **TICKET-007** | Source the opposites/affinity vocabulary from the corpus | refactor | P3 |
| **TICKET-008** | Split `App.tsx` into `src/ui/` components | refactor | P3 |
| **TICKET-009** | Resolve Tailwind/Framer stack drift vs. plain CSS | debt | P3 |

---

## 6. Glossary

- **Deckard Boundary** — the ecosystem rule that deterministic code (Python/TS) does all structure, math,
  and storage, while an LLM does only subjective interpretation; the two never cross. (After the
  *Blade Runner* question of who is human vs machine.)
- **Knowledge Portal / Procedural Engine / Social Megaphone** — the three database archetypes defined in
  `wiki/concept_database_theories.md`.
- **Pure reducer** — a function that computes the next state purely from `(state, action)` with no side
  effects, so it is deterministic and unit-testable.
- **Entity / Relation / triple** — the unified-ontology data shapes: a thing, a typed link between two
  things, and the `(subject, predicate, object)` statement they form.
- **Grounding Rule** — this project's rule that all content must derive from a cited source; no invented
  filler.
- **Always-a-move invariant** — the guarantee that a legal move (at minimum, Pass) always exists, so the
  game can never deadlock.
- **UDL (Universal Design for Learning)** — a framework (CAST) for offering information in multiple
  representations so it serves the widest range of learners.
- **Code-splitting / lazy import** — loading a big module only when needed, in a separate file, so the
  initial page stays small.

---

*This audit is a living document. When a ticket closes, update its row in §5 and note the change in
`HANDOVER_CURRENT.md`.*
