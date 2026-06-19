# Glass Bead Game — Agent Guide

> **A web-based *Glassperlenspiel*.** Players place **beads** (concepts drawn from symbol
> sets — alchemical, astrological, I Ching, musical, mathematical) and connect them with
> **tiles** (relations) into **bead–tile–bead triads** = subject–predicate–object statements
> on a grid board (after Joshua Fost's prototype). The act of play is **interdisciplinary
> synthesis** — Hesse's "reconciling of opposites." Mastery is structured as ascent through
> **Timothy Leary & Robert Anton Wilson's eight circuits of consciousness**, and perspective
> is governed by RAW's **reality tunnels** ("Maybe Logic"). Each completed game crystallizes
> into a shareable graph that joins an "ever-growing crystal of insights."

This file is the entry point for any agent working in this repo. Read it first, then the doc
it points you to for your task.

## The three source streams (and how they fuse)

| Source | Contributes | Where it lives in the game |
|---|---|---|
| **Hesse, *Das Glasperlenspiel*** | Bead/tile synthesis, counterpoint of opposites, contemplative tone, the *Magister Ludi* ceremony, "crystal of insights" | Core board mechanic + win-state ([MECHANICS](docs/MECHANICS.md)) |
| **Fost, *Toward the Glass Bead Game*** | Concrete grid UI; beads = round glyphs, tiles = kanji predicates; RDF/JSON-LD grounding | Data model + board ([DATA_MODEL](docs/DATA_MODEL.md)) |
| **Leary & RAW, *The Game of Life* / 8-circuit model** | 8-tier progression, reality-tunnel lenses, model-agnostic "maybe" weighting | Leveling + scoring + skins ([MECHANICS](docs/MECHANICS.md)) |

## Documentation map

- **[PLAN.md](PLAN.md)** — phased roadmap and acceptance gates. *Start here for "what do I build next."*
- **[docs/PHILOSOPHY.md](docs/PHILOSOPHY.md)** — the conceptual synthesis and the **Grounding Rule**.
- **[docs/GAME_LOOP.md](docs/GAME_LOOP.md)** — ⭐ *highest priority* — turns, cards, the always-a-move/Pass guarantee, the correspondence→story-prompt engine, hot-seat & online.
- **[docs/CARD_CORPUS.md](docs/CARD_CORPUS.md)** — cards = narrative-designer translations of `C:\Dev\wiki` portal entries (index-card + essay) into game terms (stats + glyphs); the ingestion pipeline.
- **[docs/ADVENTURE_STARTERS.md](docs/ADVENTURE_STARTERS.md)** — prewritten story seeds keyed to the combination *signature* (covers every pair, not N²); the resolver.
- **[docs/DRAFT_AND_GOALS.md](docs/DRAFT_AND_GOALS.md)** — draft phases (deep/wide, board-conditioned) and private goals (hidden objectives steering symbol choices).
- **[docs/BOARD_MODES.md](docs/BOARD_MODES.md)** — *optional* divinatory layouts (Tarot spread, geomancy, I Ching, sigil-on-kamea) over the core; default is the Free Grid.
- **[docs/ROLES.md](docs/ROLES.md)** — *optional* worker-placement layer: take a meeple into a role (alchemist, cleric, scholar, … or a historical character) that empowers the core actions.
- **[docs/MECHANICS.md](docs/MECHANICS.md)** — board, triads, scoring, the 8 circuits, reality tunnels, win-state.
- **[docs/PROGRESSION.md](docs/PROGRESSION.md)** — character sheet, topic XP → skill points → skill tree, portals-as-inventory; how mastery expands move options.
- **[docs/SYMBOL_SETS.md](docs/SYMBOL_SETS.md)** — the bead/tile vocabularies (alchemical three-tier, I Ching, musical, kanji…).
- **[docs/NARRATIVE_DESIGN.md](docs/NARRATIVE_DESIGN.md)** — the player's storytelling tools; alchemical glyph grammar; audit vs. the game-design literature.
- **[docs/CORPUS_GAME_DESIGN.md](docs/CORPUS_GAME_DESIGN.md)** — index of the `E:\pdf\Game Design` reference library (design-method only, never player content).
- **[docs/AESTHETIC.md](docs/AESTHETIC.md)** — the "Green Stone" visual system, palette, lifecycle animations, the three views.
- **[docs/DATA_MODEL.md](docs/DATA_MODEL.md)** — JSON-LD triple model, save format, the shared-backend schema.
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Vercel (Hobby) + Supabase (free) hosting, build settings, env vars.
- **[HANDOVER_CURRENT.md](HANDOVER_CURRENT.md)** — live state: what exists, what's in flight, what's next.

## Specialist agents

Delegate to these (`.claude/agents/`) by their domain; the Magister Ludi orchestrates.

- **magister-ludi** — lead architect / orchestrator. Owns the plan, phase gates, and the Grounding Rule.
- **crucible-engineer** — React game engine: board state, triad validation, scoring, circuit progression, data layer.
- **bead-smith** — symbol-set vocabularies, the RDF ontology, and Hesse-grounded placeholder content.
- **mirror-warden** — UI/UX: Tailwind + Framer Motion, the Mirror-Gallery skins, lifecycle animation, accessibility.
- **narrative-designer** — the player's storytelling grammar; audits choices against the game-design literature; stewards the alchemical glyph system. Owns [NARRATIVE_DESIGN](docs/NARRATIVE_DESIGN.md).

## Stack & run

- **React + Vite + TypeScript**, **Tailwind CSS**, **Framer Motion**. (Decided 2026-06-18.)
- **Backend:** Supabase (Postgres + auth + realtime) as the shared "crystal" / triple store; the data
  layer is abstracted behind an interface so local-only play works with no network.
- **Dev:** `npm run dev` (Vite). **Saves:** localStorage mirror (`gbg_save_v1`) + optional cloud sync.
- **Hosting:** **Vercel** (Hobby) serves the static SPA; **Supabase** (free) is the shared backend
  the browser talks to directly (anon key + RLS). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- Scaffolding has **not** been generated yet — see [PLAN.md](PLAN.md) Phase 0.

## Per-turn narrative review (standing protocol)

Every turn produces a grounded **narrative-design review artifact** in
[docs/narrative-reviews/](docs/narrative-reviews/INDEX.md) — the narrative-designer analyzes the
turn's output and offers suggestions from the study materials ([CORPUS_GAME_DESIGN](docs/CORPUS_GAME_DESIGN.md)).
A `UserPromptSubmit` hook in `.claude/settings.json` injects the reminder. Keep it **proportional**
(a short note for trivial turns; a full audit for mechanic/content changes). *(If the hook doesn't
fire, it was added mid-session — open `/hooks` once or restart to load it.)*

## The Golden Rule (non-negotiable)

**Absolute grounding.** All default content, placeholders, system copy, tutorial voice, symbol
glosses, and error strings **must derive from the source corpus** — Hesse's novel and tales, the
Fost essay, and the Leary/RAW eight-circuit material. **No non-source filler.** When you need a
string and have no grounded source, flag it in [HANDOVER_CURRENT.md](HANDOVER_CURRENT.md) rather
than inventing generic copy. See [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md#the-grounding-rule).

## Working disciplines (standing process — read before you build)

- **Tickets.** Track all bugs, features, debt, and ideas in [docs/tickets/](docs/tickets/TICKETS.md). On
  any non-trivial task: **check the board first**; claim a matching ticket or open one (`TEMPLATE.md`).
  When you find a problem you won't fix now, file a `backlog` ticket — don't bury a TODO in code. The
  board is the single source of truth for "what's wrong / what's next." Workflow: [tickets/README.md](docs/tickets/README.md).
- **Test-Driven Development.** Work **test-first**: write a failing test (red), make it pass (green),
  refactor. A change is not *done* until a test fails without it and passes with it, **and** `npm run
  build` is clean (the type-check gate catches what runtime tests miss). See [docs/TESTING.md](docs/TESTING.md).
  Keep logic **pure** and out of the React view so it stays testable (the **Deckard Boundary**).
- **Architecture.** The living audit is [docs/ARCHITECTURE_AUDIT.md](docs/ARCHITECTURE_AUDIT.md); update
  its findings table as tickets close. The game is a *Procedural Engine* fed by *Knowledge Portals* — see
  the ecosystem theory in `C:\Dev\wiki\concept_database_theories.md`.
- **Explain with Universal Design for Learning.** When documenting, offer multiple representations
  (plain-language + technical + a diagram/table) and a glossary, so docs serve every reader. The wiki's
  "Glossary for Undergraduates" blocks are the model.

## House conventions (workspace-wide)

- Prioritize **clarity, logical structure, and accessibility** in every interaction (the *Magister Ludi* ethos).
- Keep modules small and single-purpose; the engine is framework-agnostic where it can be (pure TS),
  React is the view layer only.
- This sits in the `C:\Dev` workspace — when you ingest or finish a milestone, the LLM-Wiki
  (`C:\Dev\wiki\`) may be updated per the workspace memory protocol.
