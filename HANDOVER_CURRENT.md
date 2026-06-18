# Handover — Current State

> Live status doc. The Magister Ludi agent updates this as work lands. Read it after
> [CLAUDE.md](CLAUDE.md) to know what exists and what's next.

## Status: **Core built & verified** (Phases 0–1 + the core of Phase 2, optional layers OFF)

The app runs: `npm install` → `npm run dev` (Vite, :5173) → `npm test` (5/5) → `npm run build` (clean).
Verified live: infuse a bead from a card, apply a glyph from the bank, lay a process tile between two
beads → a triad forms ("triads 1"). All **optional layers are bracketed** (scoring, circuits,
correspondence/story engine, draft, goals, progression, board modes, roles, multiplayer, diagrams).

### Code shipped (the four core systems)
- `src/engine/types.ts` — BEAD / CARD / GLYPH / TILE + `Move` (infuse | applyGlyph | layTile | meditate).
- `src/engine/engine.ts` — pure reducer `applyMove`; triad detection; `meditate` (the Pass floor) is
  **total**; `legalMoveKinds` always includes it. `src/engine/engine.test.ts` — 5 passing tests
  incl. the always-a-move invariant.
- `src/engine/glyphBank.ts` — the always-available glyph bank (metals, elements, tria prima).
- `src/engine/tiles.ts` — 8 process tiles (Conjunction … Fixation).
- `src/data/seedDeck.ts` — 14 grounded seed cards (each with `sourceRef`).
- `src/store/dataStore.ts` — `DataStore` + `localStore` (localStorage `gbg_save_v1`).
- `src/App.tsx` + `src/styles.css` — Green-Stone UI: board, hand, glyph bank, tile tray, inspector, log.
- Config: Vite + React + TS; `vite.config.ts` (app) / `vitest.config.ts` (tests, split to avoid a
  nested-Vite type clash); `.claude/launch.json` for preview.

### Run it
`npm install` then `npm run dev` → http://localhost:5173 . `npm test`, `npm run build`.

### Deliberately NOT built yet (next, in priority order)
1. Scoring (coherence / interdisciplinary distance / counterpoint) + a triad readout.
2. The correspondence engine v1 + Tier-A Adventure Starters (signature → grounded story option).
3. Tailwind + Framer Motion polish (currently plain CSS); first Vercel deploy + `git init`.
4. CROWLEYDB card-ingestion pilot.
Optional layers (draft, goals, progression, board modes, roles, online) stay off until the core sings.

### What exists
- `CLAUDE.md` — agent entry point.
- `PLAN.md` — phased roadmap (re-prioritized: **Phase 2 = the turn loop**; Phase 6 = online + ingestion).
- `docs/` — PHILOSOPHY, **GAME_LOOP**, **CARD_CORPUS**, **ADVENTURE_STARTERS**, **DRAFT_AND_GOALS**,
  **PROGRESSION**, **BOARD_MODES**, **ROLES**, MECHANICS, SYMBOL_SETS, AESTHETIC, DATA_MODEL,
  DEPLOYMENT, NARRATIVE_DESIGN, CORPUS_GAME_DESIGN, `narrative-reviews/`.
- `.claude/agents/` — magister-ludi, crucible-engineer, bead-smith, mirror-warden, **narrative-designer**.
- `.claude/settings.local.json` — permission allowlist.

### Per-turn narrative-review protocol (added 2026-06-18)
- `UserPromptSubmit` hook in `.claude/settings.json` (project, committed) reminds every turn to file
  a grounded review artifact in `docs/narrative-reviews/` (TEMPLATE + INDEX; first artifact = 001).
- Permissions stay in `.claude/settings.local.json`. **Note:** hook added mid-session — open `/hooks`
  once or restart to load it into the watcher.
- Glyph palette expanded: element triangles + `substances`/`apparatus` sets + Unicode Alchemical
  Symbols block (U+1F700–U+1F77F) in SYMBOL_SETS.

### Narrative-designer module (added 2026-06-18)
- Studies `E:\pdf\Game Design` (≈30 books, already chapter-Markdown'd; indexed in CORPUS_GAME_DESIGN).
- First audit landed in NARRATIVE_DESIGN.md, grounded in **Shipp** (knitted/layered theme, motivated
  elements, 5 degrees of thematic action, conflict=plot) and **Tom Smith** (verbs).
- **Alchemical glyph system refined from `C:\Dev\AlchemyBlockInvaders\`**: substances (elements +
  planet-metals) → **beads**; 12 zodiacal processes → **tiles** (`alch:*`); tria prima → **modifiers**;
  magnum-opus colours → session arc. SYMBOL_SETS.md updated accordingly.

### Decisions locked (2026-06-18)
- Stack: **React + Vite + TypeScript + Tailwind + Framer Motion**.
- Persistence: **local-first behind a `DataStore` interface + shared Supabase backend** (backend
  planned from the start, implemented in Phase 5).
- Hosting: **Vercel (Hobby)** static SPA + **Supabase (free)** backend, browser→Supabase directly
  (anon key + RLS, no serverless functions). Account `tedhand-2181s-projects`. See
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Highest-priority system: the turn loop (added 2026-06-18)
- [GAME_LOOP](docs/GAME_LOOP.md): card-driven turns; **always-a-move invariant** (Pass is total —
  refills hand, reshuffles discard, never deadlocks); the **correspondence engine** classifies triads
  (affinity/opposition/transformation) and emits grounded **story prompts** whose choices draw cards
  / change the board. Same pure-TS reducer for **hot-seat** and **online-collaborative**.
- Cards = narrative-designer **translations** of `C:\Dev\wiki` portal entries (index-card + essay)
  into game terms — grounded `text` + `correspondences` + `glyphs` + tria-prima `stats`
  ([CARD_CORPUS](docs/CARD_CORPUS.md)). Ingestion = two stages (engineer extract → designer translate);
  **pilot one portal first, don't bulk-copy.**
- **Grounding Rule broadened:** the knowledge-portal corpus is now an authorized *sourced* origin for
  card content (invariant "no invented filler; everything cited" preserved).

### Optional roles / worker placement (added 2026-06-18)
- [ROLES](docs/ROLES.md): optional meeple-into-role layer (Alchemist, Cleric, Necromancer, Philosopher,
  Neoplatonist, Printer, Artisan, Scholar, Patron, **historical-character** figure cards). A role
  **empowers/flavors the two core actions** and biases which Adventure Starters surface; **contested
  role spaces** in competitive play. Roles **derive from concept/figure cards** (extensible, not
  hardcoded); gated by skill tree / portal; grant topic XP.
- Optional + togglable (`rolesEnabled`); a generic **Seeker** role + Pass keep the always-a-move floor.
  PLAN Phase 8 (with board modes). **Watch layer-stacking** — run complexity-brake before combining
  optional layers; keep default play clean (review 008).

### Optional board modes (added 2026-06-18)
- [BOARD_MODES](docs/BOARD_MODES.md): a `BoardMode` abstraction (layout / generate / read) over the
  **Free-Grid core**. Four optional divinatory layouts — **Tarot Spread, Geomancy, I Ching,
  Sigil-on-a-Kamea** — each emits **signatures** into the existing correspondence/Adventure-Starter
  pipeline, so they reuse coverage, goals, and progression rather than forking the game.
- **Optional, post-core** (PLAN Phase 8, incremental; Tarot Spread first). Free Grid stays default;
  both core actions + Pass work in every mode. I Ching reuses the 8-trigram↔8-circuit bridge; Kamea
  reuses the wiki Goetia sigil analysis; Tarot reuses CROWLEYDB.

### Core re-centering (2026-06-18) — read this before the CROWLEYDB note below
- **The core of the game = two actions:** (1) **draw cards to infuse beads with significance**,
  (2) **apply glyphs from the always-available glyph bank** ([SYMBOL_SETS](docs/SYMBOL_SETS.md#the-glyph-bank),
  [GAME_LOOP](docs/GAME_LOOP.md#the-two-core-actions-what-the-game-is)). The glyph bank is a second
  always-legal floor beside Pass.
- **Occult diagrams (Tree of Life, Rose Cross lamen) are OPTIONAL tools**, not the center. Skill-tree
  **default = plain per-portal branch tree**; default ranks = Castalian. The Tree-of-Life view + A∴A∴
  grades are an **opt-in overlay** for players who want the Qabalistic frame. Build core palette +
  branch-tree first; diagrams later.
- So the CROWLEYDB Tree/grades work below is **retained but scoped to the optional overlay** (and as a
  *source of correspondence values*), not the default topology.

### CROWLEYDB grounding: Tree of Life (now OPTIONAL overlay), card classes, events (added 2026-06-18)
- **Skill-tree topology = Tree of Life**, seeded from `C:\Dev\CROWLEYDB\frontend\public\data\thelemic_tree.json`
  (10 sephiroth + 22 paths w/ letter, astro, Thoth/GD tarot, color scales, god/archangel/choir);
  reuse `frontend/src/pages/TreeOfLife.tsx`. **Ranks = A∴A∴ grades** (`grades.json`). → closes the
  topology + rank-name TODOs.
- **Card classes:** `figure` (`persons.json`), `text` (`works.json`), `symbol`, `concept`, `event`.
  Figures + texts are *key classes*; figure↔text↔event links (`person_events`, `term_works`) = affinities.
- **Timeline events** (`events.json` + `event_topics` + `person_events`) surface as Adventure-Starter
  options when a board combination matches an event's associations — grounded in the real cited entry.
- **Pilot portal = CROWLEYDB** (it has the full structure: tree, grades, figures, works, events).
- **Occult diagrams:** port TreeOfLife.tsx (skill-tree view) + build a Rose Cross lamen (glyph selector).
- Correspondence-vocabulary TODO (reviews 002–004) can now be filled from `thelemic_tree.json` values.

### Combinatorial story system + draft/goals (added 2026-06-18)
- [ADVENTURE_STARTERS](docs/ADVENTURE_STARTERS.md): prewritten starters keyed to the combination
  **signature** (class × operation × axis), **not** card pairs — ~250 backbone templates cover **every**
  combination (coverage guaranteed by a class fallback + a unit test); slot-filled with sourced card
  text; Tier-B overlays inflect by the player's portals. Resolver = most-specific-wins, seeded.
- [DRAFT_AND_GOALS](docs/DRAFT_AND_GOALS.md): **draft phases** (deep/wide/open from a chosen portal,
  rewards conditioned on board state → depth-vs-breadth dilemma) + **private goals** (discovered hidden
  objectives rewarding specific glyph/correspondence placements → players' *reasons* to steer the board).
- Both preserve the always-a-move floor (draft *skip*; goals = motivation, not obligation).
- **Author a vertical slice first** (one operation × one axis of Tier-A + a few goals) before scaling.

### Progression meta-layer (added 2026-06-18)
- [PROGRESSION](docs/PROGRESSION.md): **two axes** — Leary **circuits** (depth) + a **skill tree**
  (breadth). **Topic XP** (earned by playing topics) → **skill points** → spent on tree nodes whose
  consequence is *more story-prompt options* (which symbol-interaction to explore next). **Portals**
  are acquired in-play (several modes) into **inventory**, opening tree branches + their cards.
- **Character sheet** persists across games (meta-progression); per seat (hot-seat) / per account
  (online). Engine: XP/points/rank are pure reductions; spend/acquire resolve on the sheet and never
  block the board's always-a-move floor. Folded into **PLAN Phase 3**.
- Proposed skill-tree topology: the **Tree of Life** (sephiroth nodes / 22 paths) — grounded, fits the
  occult portals; per-portal branches are the fallback.

### Immediate next step
Core is in (see Status above). Next: triad **scoring** + a **correspondence readout** on the formed
triad, then the **Adventure-Starter** Tier-A backbone. Then `git init` + first Vercel deploy. Keep
optional layers off until the core is fun. See [PLAN.md](PLAN.md).

### Open questions / `TODO(grounding)` log
*(Add any string/symbol you couldn't ground here, per the Grounding Rule.)*
- [ ] Verify each starter **kanji tile** gloss against a source ([SYMBOL_SETS](docs/SYMBOL_SETS.md#tile-sets-predicates--relations--kanji--relational-signs)).
- [ ] Confirm trigram↔circuit assignments are defensible or label them clearly interpretive.
- [ ] Decide board size default (9×9 proposed) and whether grid is fixed or growable.
- [ ] Define the `correspondences` controlled vocabulary — **now sourceable from CROWLEYDB
      `thelemic_tree.json`** (sephirah/planet/element/tarot/color axes). (bead-smith) — reviews 002, 005.
- [ ] Give **Pass** a mild opportunity cost so it's a floor, not a strategy. (review 002)
- [ ] Add skill-tree **branch exclusivity** to avoid late-game option bloat. (review 003)
- [x] ~~Pilot portal~~ → **CROWLEYDB** (review 005).
- [x] ~~Skill-tree topology~~ → **default = plain branch tree**; Tree of Life is an *optional overlay*
      (review 006 revised 005). Rank default = Castalian; A∴A∴/alchemical = optional.
- [ ] Specify the **glyph bank** contents (starter vs. gated) and balance free glyphs vs. drawn cards
      so neither trivializes the other. (bead-smith + crucible-engineer) — review 006.
- [ ] **Complexity guard:** optional layers now = board modes + roles + draft + goals + progression +
      lenses. Before combining, run `complexity-brake`; ensure each is independently togglable and the
      **default core stays clean**. (magister-ludi) — review 008.
- [ ] Ensure figure/text/event card classes **generalize beyond Crowley** (Pico, Neoplatonism, …);
      cap event-match surfacing to top-k. (review 005)
- [ ] Enumerate exact Unicode codepoints + grounded glosses for the `substances`/`apparatus` glyph
      sets (U+1F700–U+1F77F); cap the starter palette (~12–16 substances, ~6 apparatus) so it stays
      motivated, not an icon dump; verify font rendering. (bead-smith) — see review 001.
- [ ] Verify the 12 process→zodiac→relation mappings against an alchemical source. Note: Sagittarius
      is `alch:exalts` here (AlchemyBlocks labeled it "Fermentation Continuation"); confirm the
      operation name and the Libra/Capricorn coagulation-vs-fixation split. (narrative-designer + bead-smith)
