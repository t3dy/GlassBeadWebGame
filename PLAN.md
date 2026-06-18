# Glass Bead Game — Master Plan

A phased roadmap from empty repo to a playable, groundable, shareable *Glasperlenspiel*.
Each phase has a **hard acceptance gate** — do not advance until it is met (see the
`phase-gate` skill). The Magister Ludi agent owns this file and updates
[HANDOVER_CURRENT.md](HANDOVER_CURRENT.md) as phases close.

## Design north star

> Place beads, connect them with tiles into subject–predicate–object triads, and be rewarded
> for **interdisciplinary leaps** and the **reconciliation of opposites**. Progress is ascent
> through the **eight circuits**; perception is filtered through swappable **reality tunnels**;
> the finished composition is a graph that joins a shared **crystal of insights**.

Three pillars, three owning concerns:
1. **The Board** (Fost grid + RDF triads) → *crucible-engineer*.
2. **The Ascent** (8 circuits, scoring, win-state) → *crucible-engineer* + *bead-smith*.
3. **The Mirror** (Green-Stone aesthetic, skins, lifecycle) → *mirror-warden*.

---

## Phase 0 — Scaffold & spine *(infrastructure)*

**Build:** Vite + React + TS project; Tailwind + Framer Motion installed; folder structure;
Supabase client stub behind a `DataStore` interface (localStorage impl first); CI-free `npm run
dev` working; a blank board renders.

**Build (deploy spine):** add `vercel.json` (SPA rewrite) and do a first **Vercel** deploy to
confirm push → build → live URL ([DEPLOYMENT](docs/DEPLOYMENT.md)).

**Gate:** `npm run dev` serves a page that draws an empty NxN grid with the Green-Stone palette;
`DataStore` round-trips a save to localStorage; `npm run build` passes type-check; the empty grid
is **live on a Vercel URL**.

## Phase 1 — One legal move, end to end *(vertical slice)*

**Build:** Place a single **bead–tile–bead** triad on the grid (from a small seed deck of hand-made
cards): pick/place a bead, lay a tile, place a second bead; commit it as one RDF statement; render
it. Serialize to JSON-LD and reload.

**Gate:** A user can lay one grounded triad, see it on the board, reload the page, and the triad
persists. The triad validates against the ontology ([DATA_MODEL](docs/DATA_MODEL.md)).

## Phase 2 — The turn loop, cards & always-a-move *(the highest-priority spine)*

**Build:** The full turn loop ([GAME_LOOP](docs/GAME_LOOP.md)) built on the **two core actions** —
*draw cards to infuse beads with significance* and *apply glyphs from the always-available **glyph
bank*** ([SYMBOL_SETS](docs/SYMBOL_SETS.md#the-glyph-bank)) — plus lay tile / resolve prompt / **Pass**.
The **always-a-move invariant** (Pass is total; applying a glyph from the bank is always legal too;
refills hand, reshuffles discard, never deadlocks). The
**correspondence engine** v1: build a combination **signature** and resolve it to an **Adventure
Starter** ([ADVENTURE_STARTERS](docs/ADVENTURE_STARTERS.md)) — ship the **Tier-A backbone + fallback**
so *every* combination yields a grounded starter — with choices that **draw cards / change the board**.
**Hot-seat** multiplayer (turn rotation + hide-hands interstitial). A first **draft phase**
(deep/wide/open) and **private goals** v1 ([DRAFT_AND_GOALS](docs/DRAFT_AND_GOALS.md)).

**Gate:** 2 players play a full hot-seat session start to finish; every reachable state offers a
non-blocking move (Pass / draft-skip); **every** placed triad resolves to a grounded Adventure Starter
(coverage test passes) whose choices visibly draw cards / alter the board; a player drafts from a
chosen portal and completes a discovered private goal.

## Phase 3 — Scoring, circuits & the progression spine *(the game becomes a game)*

**Build:** Triad/graph scoring — coherence, **interdisciplinary distance**, counterpoint, tria-prima
**stats**. Circuit gating 1–3 (bio-survival → emotional-territorial → semantic). Session score +
visible "current circuit." **Progression v1** ([PROGRESSION](docs/PROGRESSION.md)): the **character
sheet**, **topic XP** (tagged per move), **skill points**, a first **skill tree** with a few nodes
that **add story-prompt options**, and **portal acquisition** (≥1 mode). The skill tree defaults to a
plain **per-portal branch tree**; the Tree-of-Life view + A∴A∴ ranks are an *optional later overlay*
([PROGRESSION](docs/PROGRESSION.md)). Persist the sheet across games via `DataStore`. Tutorial in the
*Magister Musicae* voice.

**Gate:** Playing advances circuit 1→3 *and* accrues topic XP → a skill point the player spends on a
node that visibly **adds an option** to a later story prompt; a portal can be acquired into inventory;
the sheet persists across two sessions; the score rewards cross-discipline leaps; copy is grounded.

## Phase 4 — The Mirror Gallery & the Living City *(aesthetic identity)*

**Build:** Reality-tunnel **skins** (RedHair / WhiteHands / Dancer) that re-theme *and* re-score
the same board (circuit 6 mechanic). The three views (Mountain / Palace / Bamboo Hut). The
decay/growth lifecycle (idle → moss/swamp overlay; activity → polished brass / bloom). *(Optional, if
time:* the opt-in **occult diagrams** — Rose Cross lamen glyph selector, Tree-of-Life skill view ported
from CROWLEYDB — [AESTHETIC](docs/AESTHETIC.md#occult-diagrams-optional-tools-not-the-core); the core
glyph palette + branch-tree ship first.*)*

**Gate:** Switching a skin visibly re-themes the board and changes the scoring lens without
mutating the underlying triples; idleness triggers decay; the three views are reachable.

## Phase 5 — The full Ascent & the Tai Gi win-state *(depth)*

**Build:** Circuits 4–8 with their unlocked symbol sets (dyads, resonance scoring, archetype/tarot
sets, the non-local synthesis). The **Tai Gi** win-condition: reconcile two maximally-opposed
beads into one synthesis bead. Milestone animation (the "glittering children / golden wings").

**Gate:** A player can reach circuit 8 and complete a Tai Gi synthesis; the win animation fires;
the completed game exports as RDF/Turtle.

## Phase 6 — Online play, the shared crystal & the card corpus *(collaboration + content)*

**Build:** Supabase live ([DEPLOYMENT](docs/DEPLOYMENT.md)): **online-collaborative** play (shared
board/deck, per-player private hands via RLS, turn lock + realtime move broadcast); publish finished
games to the shared triple store + **pool/crystal**. **Card-corpus ingestion** ([CARD_CORPUS](docs/CARD_CORPUS.md)):
build the Stage-1 adapters + Stage-2 narrative-designer translation; **pilot CROWLEYDB** (~20–30
cards across the **figure / text / symbol / event** classes), validate, then scale pack-by-pack. Wire
the **timeline-events layer** (events surface as starter options when matching combinations are
explored). With each portal, author its **Tier-B Adventure-Starter overlays** and portal-aligned
private goals. Set the two `VITE_` env vars in Vercel.

**Gate (events):** exploring a combination whose signature/cards match a CROWLEYDB event surfaces that
event as a grounded, cited story option.

**Gate:** Two accounts play one online-collaborative game (turns enforced, hands private); a finished
game publishes to the crystal; the pilot portal yields playable, grounded, cited cards usable in the
deck.

## Phase 7 — Polish, accessibility, ceremony

**Build:** Full keyboard play, ARIA, reduced-motion honoring; the *Magister Ludi* "luminous golden
stylus" presentation mode; export to image/Turtle; onboarding refinement.

**Gate:** Keyboard-only and screen-reader play of a full move; reduced-motion disables lifecycle
animation; WCAG AA contrast across all skins.

## Phase 8 — Optional layers: board modes & roles *(backlog, incremental, opt-in)*

**Board modes.** The `BoardMode` abstraction ([BOARD_MODES](docs/BOARD_MODES.md)) over the Free Grid,
then modes **one at a time**: **Tarot Spread** (first — closest to the grid, reuses CROWLEYDB tarot) →
**I Ching** (ties to the 8-circuit/trigram bridge) → **Geomancy** (procedural Shield/House chart) →
**Sigil-on-a-Kamea** (reuses the Goetia sigil work). Each adds its glyph set + a few mode-specific
Tier-A starters.

**Roles / worker placement** ([ROLES](docs/ROLES.md)): the optional meeple-into-role layer (Alchemist,
Cleric, Necromancer, Philosopher, Neoplatonist, Printer, Artisan, Scholar, Patron, historical
characters), with contested role spaces in competitive play. Roles derive from concept/figure cards;
each grants a privileged core-action + topic affinity + role-biased starters.

**Gate (per layer):** with the layer on, a player can use it end-to-end (enter a mode and read a
generated layout into grounded starters / place a meeple in a role and act through it); the **two core
actions + Pass** work throughout; the Free Grid + role-free play remain the always-available default.

---

## Narrative-design pass (runs within each content phase)

The **narrative-designer** agent audits each content/mechanic increment against the game-design
literature ([NARRATIVE_DESIGN](docs/NARRATIVE_DESIGN.md), [CORPUS_GAME_DESIGN](docs/CORPUS_GAME_DESIGN.md))
as a **soft gate**: Is the theme *knitted* (mechanic embodies meaning) not *layered*? Are beads/tiles
*motivated*? Does the place-tile verb sit at *metaphoric/simulative* (not merely *associated*)? The
alchemical grammar (substances→beads, 12 processes→tiles, tria prima→modifiers) lands across
Phases 1–4; the **Tome/crystal** lore-accretion and the **magnum-opus colour arc** are scheduled
into Phases 4–5.

## Working agreements

- **Grounding Rule is a gate, not a guideline** — content review at every phase ([PHILOSOPHY](docs/PHILOSOPHY.md#the-grounding-rule)).
- Keep the **engine pure** (TS, no React imports) so scoring/validation is unit-testable.
- Prefer a **vertical slice** over horizontal layers — every phase ends playable.
- When unsure of a string's source, **flag don't fill**.
