# Game Loop — Turns, the Always-a-Move Guarantee, and the Correspondence Engine

**The highest-priority system.** Players (hot-seat or online-collaborative) take turns playing
**cards** onto the board. Placed symbols **play off each other**: the **correspondence engine**
reads the structured attributes of interacting beads and **programmatically generates story
prompts** from their resonances and oppositions. Story prompts offer **choices** that draw more
cards or change the board. The loop **guarantees every player always has a legal move** — options
multiply as the board grows, and **Pass** is always available so play never deadlocks.

The engine is a **pure-TS reducer** — `applyMove(state, move) → state'` — identical for hot-seat and
online; only transport differs ([DATA_MODEL](DATA_MODEL.md)).

## Pieces

- **Deck** — the shared draw pile, built from the card corpus ([CARD_CORPUS](CARD_CORPUS.md)),
  optionally filtered to chosen "packs" (symbol sets / portals).
- **Hand** — each player's private cards (default size 5). In hot-seat, hidden between turns.
- **Board** — the grid of placed **beads** (a card becomes a bead) and **tiles** (process relations).
- **Discard** — spent/cycled cards; reshuffled into the deck when it empties.
- **Pool / Crystal** — minted synthesis beads (Tai Gi results) that join the shared crystal.

Each **card** carries grounded text + **stats** + **correspondences** + **glyphs**
([CARD_CORPUS](CARD_CORPUS.md#card-schema)). Stats use the **tria prima** axes — **Sulphur**
(volatile/bold), **Salt** (fixed/coherent), **Mercury** (mediating/cross-domain) — plus a **potency**
rank; these feed scoring and story-prompt thresholds.

## The two core actions (what the game *is*)

Everything else is optional scaffolding around these two ways to give a glass bead significance:

1. **Draw cards to infuse beads with significance.** A drawn **card** (a figure, text, concept, or
   symbol from the portals — [CARD_CORPUS](CARD_CORPUS.md)) is played onto a bead, infusing it with
   meaning, lore, and correspondences.
2. **Apply glyphs from the glyph bank.** The **glyph bank** is an always-available palette of
   alchemical/planetary/zodiacal/element glyphs ([SYMBOL_SETS](SYMBOL_SETS.md#the-glyph-bank)); a
   player applies a glyph to a bead to qualify its significance — no draw required.

A bead's significance = (cards infused into it) + (glyphs applied to it). Beads so charged are then
related through process tiles (the [correspondence engine](#the-correspondence-engine-symbols-playing-off-each-other)).
The glyph bank being always-available is also a **floor**: you can always apply a glyph even with an
empty hand. *Optional* tools (the Tree of Life, the Rose Cross lamen, reality-tunnel lenses) are
things a player may bring in — never required to play.

**Board modes (optional layouts).** The default board is the **Free Grid**. A player may instead enter
an optional **board mode** — Tarot Spread, Geomancy, I Ching, or Sigil-on-a-Kamea — which changes the
layout and how positions are read, but uses the *same two core actions* and feeds the same
correspondence engine ([BOARD_MODES](BOARD_MODES.md)).

**Roles / worker placement (optional turn structure).** A player may place a **meeple** into a **role**
(Alchemist, Cleric, Necromancer, Philosopher, Neoplatonist, Printer, Artisan, Scholar, Patron, or a
historical-character figure card) that empowers and flavors the two core actions for the turn; roles
are limited/contested in competitive play ([ROLES](ROLES.md)). A generic open role + Pass keep the
always-a-move floor intact.

## A turn (the loop)

1. **Resolve pending story prompt** (if one is open from the prior placement): the active player
   picks a choice; its effects apply (draw, mint, shift lens, clear decay, free tile, …).
2. **Main action — choose exactly one:**
   - **Infuse a bead with a card** (core action 1) — lay a hand card on a cell, giving that bead its
     significance (a figure/text/concept/symbol from the portals); or
   - **Apply a glyph from the glyph bank** (core action 2) — attach a glyph/correspondence from the
     always-available bank to a bead, qualifying its significance (no card needed); or
   - **Lay a tile** — place a process tile between two adjacent beads, forming a **triad**
     (subject → operation → object). This is what triggers the correspondence engine.
   - **Pass / Meditate** — *always available, never fails* (see invariant below).
3. **Resolution:** if a triad formed, score it ([MECHANICS](MECHANICS.md#scoring-a-move)) and run the
   **correspondence engine** → it may emit a **story prompt** (next player resolves it at their step 1,
   or the active player if it's self-targeted).
4. **Cleanup:** draw back up to hand size (deck → hand); pass turn to the next player.

## The always-a-move invariant (no deadlock)

> The action menu **always** contains **Pass / Meditate**, and Pass can never fail.

- **Pass / Meditate** is the guaranteed floor move: the player takes the contemplative action
  ("silent, formal meditation," grounded in Hesse) — **draw up to hand size**, and may **cycle one
  card** (discard 1, draw 1). It advances the turn no matter the board or hand state.
- If the **deck is empty**, Pass reshuffles the discard into the deck first; if discard is *also*
  empty, Pass simply yields the turn (still legal, still advances). **The loop cannot stall.**
- **Options only grow above the floor.** Early game: few beads → few placements. As beads accrue,
  legal tile placements, triads, and story choices multiply — but the player may always decline the
  complexity and Pass. (Shipp ch.4: this is the *Player-vs-Self* expression tension — engine-builder
  style — not a fail state.)
- A player **never "runs out of moves"**: empty hand → Pass refills it; no legal placement → Pass.

## The correspondence engine (symbols playing off each other)

This is the generative heart. Every bead carries `correspondences` — a typed attribute map from the
great tables (element, planet, zodiac, sephirah, number, color, humor, metal, …) plus the tria-prima
stats. When a triad forms (or beads become adjacent), the engine compares the two beads through the
lens of the connecting **process tile**:

1. **Affinity** — shared correspondences (both ruled by Mars; both Fire) → *resonance*. Rewards
   theme-development; raises the resonance score.
2. **Opposition** — contrary correspondences (Sol⟷Luna, Fire⟷Water, fixed⟷volatile) → *tension*.
   Flags a **counterpoint** and a possible **Tai Gi** (reconciliation) target.
3. **Transformation** — the process tile *acts* on the correspondences: Calcination reduces B toward
   its essence, Conjunction merges A+B, Separation splits, etc. ([SYMBOL_SETS](SYMBOL_SETS.md#process-tiles)).

From the tuple `(beadA.correspondences, process, beadB.correspondences)` the engine builds a
**combination signature** and resolves it to a prewritten **Adventure Starter**
([ADVENTURE_STARTERS](ADVENTURE_STARTERS.md)) — starters are keyed to the signature *class × operation
× axis* (not to specific card pairs), so a few hundred templates **cover every possible combination**,
then **slot-fill** with the beads' grounded text. Output is **grounded**: every slot comes from sourced
card text + the fixed alchemical grammar — *no invented prose* ([PHILOSOPHY](PHILOSOPHY.md#the-grounding-rule)).
Starters matching the player's **acquired portals** are preferred, so the tale speaks in the symbolic
languages they've chosen.

### Story prompts → choices → board changes

A story prompt presents 2–3 **choices**; each has a mechanical effect, gated by stats/board state so
the menu deepens as the game does. Example effect palette:

- **Draw +N** / **tutor** a card of a named correspondence ("draw a card ruled by Saturn").
- **Mint** a synthesis bead (Conjunction of opposites → Tai Gi → a new pooled bead).
- **Shift the lens** (reality tunnel) — re-reads the board, opening new legal moves.
- **Clear decay** (reverse the Living City moss) or **bloom** a region.
- **Lay a free tile** / **reposition** a bead / **recycle** the discard.
- **Branch the tale** — open a follow-on prompt next turn (chained narrative).

Choices that grant draws/changes are how "running low" self-heals: a good synthesis literally
refills your options. High-stat or opposition-resolving moves unlock the richer choices.

**Skill-gated options.** The choice generator also reads the active player's **character sheet**
([PROGRESSION](PROGRESSION.md)) — acquired **portals** and unlocked **skill-tree nodes** add options
(extra choices, cross-portal moves, revealed correspondences, new process tiles). Certain prompts are
**portal-acquisition** modes ("Attune to the *[Portal]* of this bead" → add it to inventory). More
mastery ⇒ more ways to explore the next symbol-interaction — never fewer, and never below the Pass floor.

## Hot-seat vs. online-collaborative

Same reducer, same rules; only **who submits the move** and **where state lives** differ:

- **Hot-seat:** one client, players rotate; a "pass device" interstitial hides hands between turns.
  State in memory + `LocalDataStore`.
- **Online-collaborative:** turn order enforced by a server lock; moves broadcast via Supabase
  realtime; the board + deck are shared, hands are per-player private (RLS). State via
  `SupabaseDataStore` ([DATA_MODEL](DATA_MODEL.md#shared-backend-supabase--phase-5)). Collaboration
  can be **co-authorship** (building one crystal together) or turn-based call-and-response.

## Draft phases & private goals

Play interleaves **draft phases** (build your deck from a portal of choice; depth-vs-breadth
consequences conditioned on the board) with **play turns**, and each player pursues **private goals**
(hidden objectives that reward placing certain glyphs/correspondences — the player's *reasons* to
steer which interactions to explore). Both are specified in **[DRAFT_AND_GOALS](DRAFT_AND_GOALS.md)**
and feed [progression](PROGRESSION.md). Neither breaks the always-a-move floor (draft has *skip*;
goals are motivation, not obligation).

## Move types (engine contract)

`type Move = PlaceBead | ApplySymbol | LayTile | ResolvePrompt | Draft | SpendSkillPoint | AcquirePortal | Pass`
Every reducer branch returns valid state; `Pass` (and a draft *skip*) is total (defined for all
states). Unit-test the invariant: *for every reachable state, `legalMoves(state)` includes a
non-blocking move.* Off-board moves (draft pick, skill spend, portal acquire) resolve without stalling
the board.
