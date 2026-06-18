# Mechanics — Board, Triads, Ascent, Win-State

The engine that realizes [PHILOSOPHY](PHILOSOPHY.md). Keep the rules here in sync with the
implementation; the engine should be **pure TypeScript** (no React) so these rules are unit-testable.

## The board

- An **N×N grid** (start 9×9; configurable). Cells hold either a **bead** or a **tile**.
- A **legal triad** is three orthogonally-adjacent cells in a line: `bead — tile — bead`
  = subject — predicate — object. Diagonals are not triads (keeps the RDF unambiguous).
- A **bead** may participate in many triads (it is a graph node); the board is therefore a
  **graph drawn on a grid**, not just isolated rows. Shared beads = where synthesis compounds.
- A **game** = the full set of triads = an RDF graph, serialized as JSON-LD ([DATA_MODEL](DATA_MODEL.md)).

## Beads and tiles

- **Bead** = `{ id, symbolSet, glyph, label, sourceRef }`. The `label`/`sourceRef` ground it
  (e.g. glyph ☿ / label "Mercurius / quicksilver, the volatile" / src: alchemical set).
- **Tile** = `{ id, glyph, relation, sourceRef }`. `relation` is the predicate URI from the
  ontology (e.g. `gbg:reconciles`, `gbg:varies`, `gbg:contains`, `gbg:resonatesWith`). Glyph is a
  kanji or relational sign (after Fost).
- Available beads/tiles are **gated by circuit** (below) and drawn from [SYMBOL_SETS](SYMBOL_SETS.md).

## Scoring a move

Each committed triad earns a **resonance score** (not a "points to beat an opponent" score — this
is a contemplative practice). Four components:

1. **Coherence** — the triad is a valid assertion under the ontology (the relation's domain/range
   accept those bead types). Invalid triads can't be committed; valid ones get a base value.
2. **Interdisciplinary distance** — *the heart of the game.* The further apart the two beads'
   symbol sets sit on the discipline map, the higher the score. A within-set link (☿→☉, both
   alchemical) scores low; a cross-set leap (a Bach fugue subject → an astronomical configuration
   → a Leibniz proposition) scores high. This operationalizes Hesse's "spanning the gulfs."
3. **Counterpoint / opposition** — if the relation is `gbg:reconciles` (or kin) and the two beads
   are flagged as opposites in the ontology, award the **counterpoint bonus**. Reconciling
   opposites is the most prized move.
4. **Resonance / structure** — fugue-like bonus when a triad's *shape* echoes one already on the
   board (same relation linking an analogous pair). Rewards developing a theme, not scattering.

Every assertion also carries a **maybe-weight** (0–1, RAW's Maybe Logic). Low-confidence moves are
allowed and even encouraged for exploration; they score for *boldness of leap* but contribute less
to the "crystal." The game **never** marks a synthesis objectively true.

## The eight circuits

Progression = ascent through Leary & RAW's eight circuits. Your **current circuit** is the highest
you've unlocked; reaching the next requires accumulating resonance *of the kind that circuit
governs* (not just raw total). Each circuit unlocks symbol sets and relation types.

| # | Circuit | In-game meaning | Unlocks |
|---|---|---|---|
| 1 | **Bio-survival** | Literal forward/avoid associations | Basic beads; `gbg:leadsTo`, `gbg:avoids` |
| 2 | **Emotional-territorial** | Hierarchy, dominance, containment | `gbg:contains`, `gbg:dominates`; territory/scale beads |
| 3 | **Semantic / time-binding** | Definition, symbol, analogy — *the native home of the GBG* | Full kanji tiles; alphabetic + numeric beads; `gbg:means`, `gbg:analogousTo` |
| 4 | **Socio-sexual** | Pairing, dyads, marriage of opposites | Dyad relations; `gbg:pairsWith`, `gbg:counterpoints` |
| 5 | **Neurosomatic** | Aesthetic / sensory resonance, rhythm | Musical set; the **resonance** scoring component goes live |
| 6 | **Metaprogramming** | Reality-tunnel switching | The **Mirror-Gallery skins** become *in-game re-scoring lenses* |
| 7 | **Neurogenetic** | Archetypal / mythic / collective | Tarot + zodiac + archetype beads (Demian/Abraxas, Tai Gi) |
| 8 | **Neuroatomic / quantum** | Non-local synthesis | The **Tai Gi win-state**; collapse two opposites into one synthesis bead |

> The eight **I Ching trigrams** are mapped one-to-one onto these circuits, giving each circuit a
> grounding glyph (see [SYMBOL_SETS](SYMBOL_SETS.md)).

Circuits are the **depth** axis. The complementary **breadth** axis — topic XP, skill points, the
portal-fed **skill tree**, and the character sheet — is in **[PROGRESSION](PROGRESSION.md)**. Circuits
gate universal mechanics; the skill tree gates domain-specific options.

## Reality tunnels (skins as lenses) — circuit 6

A **reality tunnel** is a scoring + theming lens over the *same* triples. Switching tunnels never
mutates the graph (Maybe Logic: the board is what it is; only the reading changes). Three to start,
named from *The Mirror of Faldum* / the brief:

- **RedHair (Vibrant/Maximalist)** — rewards breadth: many symbol sets touched.
- **WhiteHands (Delicate/Refined)** — rewards depth: long counterpoint chains, few but precise links.
- **Dancer (High-velocity)** — rewards tempo/resonance: repeated structural echoes (fugue).

A board that scores poorly in one tunnel may shine in another — the point is that no lens is final.

## The Tai Gi win-state — circuit 8

Pick two beads the ontology marks as **maximally opposed** (e.g. *Helle Welt* / *Dunkle Welt*,
Sol / Luna, law / freedom). Connect them through a `gbg:reconciles` tile and, if the synthesis is
resonant enough, the move **collapses** the pair into a single new **synthesis bead** (e.g.
*Abraxas* — "God and Satan in one," "a power beyond Good and Evil"). This:
- fires the milestone animation (the "glittering children with golden wings, flying in pairs," from *Augustus*);
- mints a new bead that enters the shared pool;
- marks the game as a completed *move* in the larger Game, exportable as RDF/Turtle.

## The turn loop (where moves actually happen)

The minute-to-minute structure — card draw, the **always-a-move / Pass** guarantee, the
**correspondence engine** that turns played symbols into story prompts, and hot-seat vs. online — is
specified in **[GAME_LOOP.md](GAME_LOOP.md)** (the highest-priority system). This file defines *what a
legal triad/score/circuit is*; GAME_LOOP defines *how players take turns placing them and never stall*.

## The session arc (the player journey)

1. **Apprentice (onboarding)** — the *Magister Musicae* voice; a "clean sweep" (*Ablativus
   Absolutus*) clears the board "clear as the sun" to begin.
2. **Quest for the Perfect Word (play)** — iterative: find the connective tissue between given
   source prompts; build the "Palace of Knowledge."
3. **Return Home (end)** — the session "purifies and eternalizes" into a **Glass Bead Chart**
   (the exported graph) — a homecoming.
