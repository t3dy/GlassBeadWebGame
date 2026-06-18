# Adventure Starters — Combinatorial Story Generation

The authored content layer the [correspondence engine](GAME_LOOP.md#the-correspondence-engine-symbols-playing-off-each-other)
draws on. When the system combines **any two symbols**, it must offer the player **grounded story
options inspired by the portals and cards they've chosen** — and **every** possible combination must
yield a starter (never a blank). This doc says how that's covered without an impossible amount of
writing.

## The combinatorial problem (and the solution)

**Don't prewrite per card-pair.** With ~500 cards that's ~125,000 unordered pairs × 12 operations ≈
**1.5M** — unauthorable, and most would be near-duplicates.

**Prewrite per *signature*.** Any pairing reduces to a small structured **signature** — its
correspondence relationship, not the card identities. Starters key to the signature, then **slot-fill**
with the two cards' grounded text. A few hundred templates → **100% pair coverage**, and each play
still reads bespoke because the fill text comes from the specific cards + the player's portals.

## The combination signature

For beads A and B joined by operation `op`, the engine computes:

```ts
interface Signature {
  class: 'affinity' | 'opposition' | 'transformation';  // how A & B relate
  operation: string;          // the process tile, e.g. 'alch:conjoins'
  axis: string;               // dominant correspondence axis: 'planet'|'element'|'sephirah'|…
  pole?: string;              // the specific pole/pair, e.g. 'sol-luna', 'fire-water'
  portals: string[];          // portals of the two cards (for inflection + personalization)
  topics: string[];           // great-table topics touched
}
```

- **class** comes from comparing A/B correspondences: shared → *affinity*; contrary → *opposition*;
  the tile transforming one toward the other → *transformation* ([SYMBOL_SETS](SYMBOL_SETS.md)).
- Because **every** pair has *some* axis-relationship + operation, every pair has a signature — and
  therefore at least one matching starter (the class fallback). **Coverage is total by construction.**

## The Adventure Starter library (tiered by specificity)

```ts
interface AdventureStarter {
  id: string;
  match: {                    // which signatures this answers (any omitted field = wildcard)
    class: 'affinity'|'opposition'|'transformation';
    operation?: string; axis?: string; pole?: string;
    portals?: string[];       // Tier-B inflection
    pair?: [string, string];  // Tier-C specific cards
    minCircuit?: number;
  };
  template: string;           // grounded prose with slots: {a} {b} {op} {aText} {bText} {pole}
  choices: { text: string; effects: Effect[] }[];   // feed the loop: draw, mint, branch, shift lens…
  sourceRefs: string[];       // grounding (Hesse/Leary grammar + card citations)
}
```

| Tier | Keyed to | Count (order of) | Role |
|---|---|---|---|
| **A — Backbone** | class × operation × axis (± pole) | ~250 | The guarantee. Covers every signature. |
| **B — Portal overlays** | + `portals` | per pack, dozens | *Inflection* — the same structural starter reads Thelemic (CROWLEYDB) vs. Neoplatonic, etc. |
| **C — Set pieces** | specific `pair` | a curated few | Bespoke marquee pairings (e.g. *Demian × Frau Eva → Abraxas*). |
| **Fallback** | class only | 3 | Last-resort; ensures non-blank. |

> Tier-A math: 3 classes × 12 operations × ~7 primary axes ≈ **~250** backbone templates — fully
> authorable. Poles (sol-luna, fire-water…) and Tier-B/C add richness, not combinatorial blowup.

## The resolver (most-specific-wins, deterministic)

```
resolveStarter(sig, sheet) →
  candidates = all starters whose match ⊆ sig (every set field agrees; wildcards match anything)
  prefer:  Tier C (pair)  >  Tier B matching the player's acquired portals (sheet)  >  Tier B  >  Tier A (most fields matched)  >  fallback
  ties → seeded pick (seed = move index, NOT Math.random) for variety without nondeterminism
  return slotFill(chosen, A, B, op)
```

- **Personalization** (the user's "inspired by the portals they've chosen"): Tier-B overlays matching
  the player's **acquired portals** ([PROGRESSION](PROGRESSION.md)) outrank generic ones — the tale
  speaks in the symbolic languages that player has mastered.
- **Skill-gated choices:** the chosen starter's `choices` are filtered/extended by the player's
  unlocked skill nodes (more mastery ⇒ more options), never below the **Pass** floor.
- **Coverage test:** *∀ (A, B, op), `resolveStarter` returns a starter* (the class fallback always
  matches). Unit-tested; a blank is a bug.

## Grounding (non-negotiable)

Every starter is **authored, not hallucinated at runtime**. Templates use the fixed alchemical grammar
+ Hesse/Leary voice; slots fill from sourced card `text`/citations ([PHILOSOPHY](PHILOSOPHY.md#the-grounding-rule)).
The runtime path is deterministic slot-fill — no live free-text generation by default.

*Optional LLM assist (clearly bounded):* (1) **authoring-time** — draft candidate Tier-A/B templates
from the corpus for the **narrative-designer to curate** (never shipped unreviewed); (2) **opt-in
online enrichment** — an online mode may rephrase a *chosen* starter, constrained to the slot text +
citations, with the deterministic starter as fallback. Default play needs neither.

## Timeline events as combination-triggered content

**Timeline events** (`events.json` + `event_topics.json` + `person_events.json` in CROWLEYDB) are a
second content source the resolver can surface — not freely played, but **triggered when the board
explores a combination that matches an event's associations**.

- Each event carries **associations**: its **topics** (`event_topics`), **figures** (`person_events`),
  and **works** — i.e. a *set of correspondences/cards the event is "about."*
- When a placed combination's **signature** (or the beads' card ids) overlaps an event's associations,
  that event becomes an available **Adventure-Starter option** — a story branch drawn from real
  history ("Reception of *Liber AL vel Legis*", "The Abramelin Working").
- So the *same* combination can yield: the generic signature starter **+** any matching event
  starters → the player chooses which thread to explore. Events are higher-specificity than Tier-A,
  so when one matches it tends to surface as a featured option.

```ts
interface TimelineEvent {
  id: string; title: string; dateStart: string; dateEnd?: string; description: string;
  topics: string[]; figures: string[]; works: string[];   // associations → match keys
  starter: AdventureStarter;        // the branch it offers when triggered
  sourceRef: string;
}
```

The resolver, given a signature **and the cards on the board**, also gathers `events` whose
associations intersect the combination, and offers their starters alongside the signature starter.
Completing an event branch can grant XP in its topics + a portal-aligned reward
([PROGRESSION](PROGRESSION.md), [DRAFT_AND_GOALS](DRAFT_AND_GOALS.md)). Grounding is automatic — the
event text is the portal's real, cited entry.

## Storage & authoring workflow

- Packs: `data/starters/A-backbone.json`, `data/starters/B-<portal>.json`, `data/starters/C-setpieces.json`.
- **narrative-designer** authors A first (backbone + fallback), then B per **pilot portal**
  ([CARD_CORPUS](CARD_CORPUS.md)), then C set pieces. **bead-smith** defines the axes/poles so
  signatures are deterministic. **crucible-engineer** builds the resolver + coverage test.
- Build order in [PLAN.md](../PLAN.md): Tier-A + fallback land with the **correspondence engine v1
  (Phase 2)**; Tier-B overlays land with **card ingestion (Phase 6)** per pilot portal.
