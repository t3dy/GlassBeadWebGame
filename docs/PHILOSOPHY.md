# Philosophy — The Synthesis of Three Streams

This game is a *rhetorical invention*: a working, playable translation of Hesse's deliberately
unplayable metaphor, grounded by Fost's semantic-web prototype and structured by Leary & RAW's
map of consciousness. This document is the conceptual contract. If a mechanic contradicts it,
the mechanic is wrong.

## 1. Hesse — the Game itself

Hesse designed the *Glasperlenspiel* as "purely a symbol of the human imagination" that defies
"any specific imitation in reality." We do **not** claim to have built *the* Game — that would
"miss the point." We build a **practice** that exercises the skills the Game demands:

- **Interdisciplinary synthesis** — "expressing and establishing interrelationships between the
  content and conclusions of nearly all scholarly disciplines." A move that links a Bach fugue to
  an astronomical configuration to a line from Leibniz is worth more than a move within one field.
- **Musical / mathematical structuring** — ideas treated like notes: stated, varied, developed,
  set in counterpoint.
- **Reconciling opposites** — taking two hostile concepts (law/freedom, individual/community) and
  combining them into "the purest possible synthesis." This is our **win-state** (Tai Gi).
- **Reverent play with cultural heritage** — playing "with the total contents and values of our
  culture, like a painter with his palette."
- **Contemplation** — the Game is not a memory display; each symbol invites "silent, formal
  meditation on its content, origin, and meaning." Our UI must leave room to *dwell*, not rush.

**The ambient warning.** Hesse (and Ziolkowski's foreword) frame the Game against a "computerized
society… no longer guided by forces that are in the highest sense humane," where a "dazzling
development of technical intelligence" masks decaying values. Our tech is the *organ*, not the
*music*. Hence the **Living City lifecycle** ([AESTHETIC](AESTHETIC.md)): the interface itself can
decay into moss and swamp when play becomes mechanical or neglected — a built-in *memento*.

## 2. Fost — the concrete apparatus

Joshua Whitman Fost prototyped a real web version. We adopt his primitives directly:

- A **grid board**, Scrabble-like, holding a visual composition.
- **Beads** — small round glyphs (a letter or symbol) standing for a subject/object: a character,
  event, theme, or concept.
- **Tiles** — relational symbols (Fost used **kanji logographs**) standing for the *predicate*
  that connects two beads, visually distinct from the alphabetic/round beads and compact.
- Play proceeds in **bead–tile–bead** triples = **subject–predicate–object** assertions.
- Compositions are formalized as **RDF / JSON-LD** so they can be published and merged into an
  "ever-growing crystal of insights" — the collaborative pool ([DATA_MODEL](DATA_MODEL.md)).
- Symbol sets are open: alchemical, zodiacal, musical, mathematical, I Ching hexagrams, kanji.
  Players "draw from a pool of familiar symbols developed in earlier games."

## 3. Leary & RAW — the map of the player

Hesse describes ascent (apprentice → *Magister Ludi*) but gives no rules for it. Leary & Robert
Anton Wilson's **eight-circuit model of consciousness** supplies the progression spine, and RAW's
**Maybe Logic / reality tunnels** supply the perspective system.

- **The eight circuits = eight tiers of play.** Each circuit unlocks new symbol sets and new
  relation types, moving from literal/survival associations up to non-local, archetypal synthesis.
  Full mapping in [MECHANICS](MECHANICS.md#the-eight-circuits).
- **Reality tunnels = scoring lenses (skins).** The same board scores differently through
  different lenses; no single lens is "true." This is the in-game expression of circuit-6
  metaprogramming and the literary "Mirror of Faldum." See the Mirror Gallery in [AESTHETIC](AESTHETIC.md).
- **Maybe Logic = confidence weighting.** Assertions carry a *maybe* weight, not a true/false
  flag. The game is **model-agnostic**: it never declares a synthesis objectively correct, only
  resonant within a chosen tunnel. This keeps the practice contemplative, not competitive-dogmatic.

**Elegant correspondence we lean on:** the **eight trigrams** of the I Ching map naturally onto
the **eight circuits** — a built-in bridge between Hesse's symbol vocabulary and Leary's ladder.

## The Grounding Rule

> **All default content, placeholders, system copy, tutorial text, symbol glosses, and error
> strings must derive from the source corpus.** No generic filler.

Authorized **sourced** origins (the invariant is *no invented filler*, not a single book):
- **Frame, voice, tutorial, system copy** → Hesse: *The Glass Bead Game* (+ forewords); the tales
  (*The City*, *Faldum*, *Flute Dream*, *The Poet / Han Fook*, *Augustus*, *The Dwarf*, *Ziegler*);
  Fost: *Toward the Glass Bead Game*; Leary & Wilson: the eight-circuit material (*The Game of Life*,
  *Prometheus Rising*, *Exo-/Info-Psychology*).
- **Card content** → the **knowledge-portal corpus** (`C:\Dev\wiki` + the DB viewers). Each card's
  text is the narrative-designer's *summary/interpretation of a real portal index-card + page essay*,
  carrying a `source` citation ([CARD_CORPUS](CARD_CORPUS.md)). Sourced and cited — not invented.

The line that does **not** move: every player-facing string traces to a real source via quote/cite or
a `sourceRef`/`source.citation`. Generated story prompts slot-fill only from sourced card text + the
fixed alchemical grammar. No hallucinated lore, ever.

**Practice:** when you need a string, quote or paraphrase a source and cite it in a code comment
(`// src: GBG foreword` / `// src: 8-circuit C3 semantic`). If no grounded source exists for a
string you need, **do not invent generic copy** — add a `TODO(grounding)` and log it in
[HANDOVER_CURRENT.md](../HANDOVER_CURRENT.md) so a human can supply or approve it. This is enforced
as a phase gate, not a style preference.
