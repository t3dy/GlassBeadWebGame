# Narrative Design — Tools for Telling Glass Bead Game Stories

The output of the **narrative-designer module** ([agent](../.claude/agents/narrative-designer.md)). It
(a) studies the game-design literature in `E:\pdf\Game Design` (indexed in
[CORPUS_GAME_DESIGN](CORPUS_GAME_DESIGN.md)), (b) audits our design choices against it, and (c)
specifies how the player's storytelling tools work — especially the **alchemical glyph system**,
refined from the AlchemyBlocks project.

## Two corpora, do not conflate

| Corpus | Role | Rule |
|---|---|---|
| **Hesse / Fost / Leary / RAW** | **Player-facing content** — every bead gloss, tile name, tutorial line | The **Grounding Rule** ([PHILOSOPHY](PHILOSOPHY.md#the-grounding-rule)) — quote/cite or `TODO(grounding)` |
| **`E:\pdf\Game Design`** | **Design-method reference** — informs *our* decisions, never shipped as player text | Cite by author/chapter in design docs & commit messages; never paste into the game UI |

The game-design books tell us *how to build the storytelling tools well*; the Hesse/Leary/RAW
corpus is *what the tools are made of*. Mixing them is a grounding violation.

## What "a story" is in this game

The player is **not** given a plot to advance. A **move** is the player's authored synthesis — a
composition of bead–tile–bead triads ([MECHANICS](MECHANICS.md)). The "story" is the argument /
meditation they build: Hesse's act of "stating, varying, developing themes" and "reconciling
opposites." So the storytelling tools are not branching dialogue — they are an **expressive
grammar**. We must give the player:

1. **A vocabulary of substances** (beads = nouns).
2. **A vocabulary of operations** (tiles = verbs) — *this is where the alchemy lives.*
3. **A minimal narrative beat** — the triad: *substance → operation → substance* = a transformation.
4. **A composition surface** — the board/graph as the finished "essay" or fugue.
5. **Re-reading** — reality-tunnel lenses that let the same composition be re-narrated.
6. **Accretion** — the Tome / shared crystal where novel syntheses become lore.

## Audit of our choices against the literature

Grounded in **Sarah Shipp, *Thematic Integration in Board Game Design*** (read: ch.2, ch.4) and
**Tom Smith, *Anatomy of Game Design*** (player *verbs*; *meaning*).

- **Knitted, not layered (Shipp ch.2).** A theme is *knitted* when mechanics and theme share many
  connection points; *layered* ("pasted-on") when theme decorates generic mechanics. Our risk: if
  alchemical glyphs are mere skins over a generic "connect two nodes" mechanic, the theme is
  layered and players will call it "not thematic." **Fix:** make the *relation itself* an alchemical
  operation (below) so the mechanic embodies the theme.
- **Motivated elements (Shipp ch.2).** A motivated element has an in-world reason to exist; it adds
  resonance/worldbuilding. A generic arrow predicate is *unmotivated*; the operation **Conjunction
  ♋** ("the alchemical marriage") is *motivated*. **Adopt motivated (alchemical) tiles as default.**
- **Five degrees of thematic action (Shipp ch.2):** mechanical → associated → metaphoric →
  simulative → literal. A glyph that merely *labels* a generic link is only *associated*. Our
  place-tile action should be **metaphoric/simulative**: Conjunction visibly *merges* two beads;
  Calcination visibly *reduces* one. The verb does what its symbol means.
- **Conflict = plot (Shipp ch.4).** GBG is **Player vs. Self** (expression; the tension between
  creativity and optimal scoring that Shipp flags in engine-builders) plus **Player vs. Game** (the
  puzzle of finding "connective tissue"). The **Tai Gi** synthesis is literally *narrative
  conflict-resolution* — reconciling opposites — so it should be staged as the dramatic climax.
- **Verbs are the tools (Tom Smith).** A game's expressive power is its player verbs. Our verbs:
  *select · place · operate-upon (process) · reconcile · re-read (lens)*. Keep this set small and
  deep; every verb should be alchemically meaningful.

## The alchemical glyph system (refined from AlchemyBlocks)

Importing the three-tier structure from `C:\Dev\AlchemyBlockInvaders\ALCHEMICAL_DATA.md` and its
**core design rule**:

> **A glyph's mechanic should embody its alchemical nature so precisely that the player can derive
> the alchemical meaning from the mechanic alone.** *(AlchemyBlocks, "Recommended Unified
> Framework")* — In our game: **the mechanic teaches the symbol, and the symbol grammars the story.**

The decisive move: the three tiers split cleanly across beads and tiles.

### Tier 1 — Substances → **BEADS** (nouns)
- **4 Elements** (Fire 🔥 / Water 💧 / Air 🌬️ / Earth 🌍) = *prima materia* — base, generic concept-beads.
- **7 Planet–Metals** = charged concept-beads with rich, opposable meaning:
  ☉ Sol/Gold (perfection, goal), ☽ Luna/Silver (reflection, feminine), ☿ Mercury/Quicksilver
  (mediation, trickster), ♀ Venus/Copper (love, union), ♂ Mars/Iron (force, severance),
  ♃ Jupiter/Tin (expansion, fortune), ♄ Saturn/Lead (limitation, death/nigredo).
- Built-in **opposites** for counterpoint & Tai Gi: Sol⟷Luna, Mars⟷Venus, Sol⟷Saturn (Gold/Lead).

### Tier 2 — Operations → **TILES** (verbs / predicates)
The **12 zodiacal processes are inherently transformative verbs** — which is exactly what a
predicate is. They become the primary, *motivated* tile vocabulary. Each maps to an ontology
relation and a narrative function (a triad reads *subject → operation → object*):

| Process (sign) | Relation URI | Narrative beat: "X …→ Y" |
|---|---|---|
| Calcination ♈ | `alch:calcines` | X reduced to its essence by Y (burn away the inessential) |
| Dissolution ♉ | `alch:dissolves` | X loosened/opened into Y |
| Separation ♊ | `alch:separates` | X distinguished from Y (analysis) |
| **Conjunction ♋** | `alch:conjoins` | X **wedded** to Y — *the alchemical marriage* (≈ `gbg:reconciles`, the Tai Gi tile) |
| Fermentation ♌ | `alch:ferments` | X quickened / given new life by Y over time |
| Distillation ♍ | `alch:distills` | the pure essence of X drawn through Y |
| Coagulation ♎ | `alch:coagulates` | X brought into stable balance with Y |
| Putrefaction ♏ | `alch:putrefies` | X mortified / decomposed by Y (death before rebirth) |
| Exaltation ♐ | `alch:exalts` | X raised / spiritualized through Y (the second, ascending ferment) |
| Fixation ♑ | `alch:fixes` | X made permanent by Y |
| Multiplication ♒ | `alch:multiplies` | X amplified / propagated by Y |
| Projection ♓ | `alch:projects` | X transmuted / completed via Y (the Stone cast on base matter) |

*(Wheel follows AlchemyBlocks' "Zodiacal Year." Kanji tiles from [SYMBOL_SETS](SYMBOL_SETS.md) remain
available for **non-alchemical reality tunnels**; the alchemical lens leads with these processes.)*

### Tier 3 — Principles → **MODIFIERS** (the tria prima, aspecting a triad)
The three Paracelsian principles modify *how* a triad reads and scores — they are the affective
charge, not nouns or verbs:
- **☉/🜍 Sulphur** (soul, hot/active, volatile) → boldness; raises the *interdisciplinary-distance*
  reward and the RAW *maybe-weight* (a daring leap).
- **🜔 Salt** (body, cold/fixed) → permanence; raises *coherence*/structure and the triad's weight
  in the shared crystal.
- **☿ Mercury** (spirit, mediating) → the bridge; *enables and rewards cross-set links* (the
  messenger between disciplines).
- A single triad carrying **all three** = the **Tria Prima** — the rarest, complete synthesis; a
  Tai Gi candidate that mints a new bead (AlchemyBlocks' 5000-point combo, re-cast as the *chymical
  wedding*).

### The magnum opus arc (dramatic structure — Shipp ch.5)
The colour stages give a *game/session* a beginning-middle-end and align with the **circuit ascent**
and the **Living City lifecycle**:
**Nigredo** (black / Saturn / Putrefaction — the clean-sweep void) → **Albedo** (white / Luna /
washing — first clarities) → **Citrinitas** (yellow / dawn — connections cohere) → **Rubedo** (red /
Sol / Projection — the completed Tai Gi). A finished "Glass Bead Chart" is a rubedo.

## Worked example (the grammar in one move)

`☽ Luna` —[**Conjunction ♋**]→ `☉ Sol`  ·  *aspected by* **☿ Mercury**
> "The silver feminine, wedded by the mediating spirit to the golden masculine." → reconciles a
> flagged opposite pair → high counterpoint + Mercury cross-bridge bonus → if resonant, **collapses
> into a synthesis bead** (the *Rebis*), Hesse's Tai Gi and RAW's union of opposites. The animation
> *shows* two beads merging — the mechanic teaches "Conjunction."

## Recommendations (gaps to close — for magister-ludi & bead-smith)

1. **Adopt processes-as-tiles** as the default (motivated, knitted) predicate set for the alchemical
   lens; keep kanji tiles for other reality tunnels. → update [SYMBOL_SETS](SYMBOL_SETS.md). *(done)*
2. **Stage the place-tile verb as metaphoric/simulative**, not associated — operation animations
   that enact the symbol (mirror AlchemyBlocks' per-glyph mechanics). → mirror-warden.
3. **Build the Tome / crystal accretion** (from AlchemyBlocks' cascade/Tome): a novel triad unlocks
   a *grounded* lore fragment — the opt-in narrative layer done right, sitting atop a knitted core.
4. **Map the magnum opus colour arc** onto the session + circuit ascent so each game has narrative
   structure (nigredo→rubedo), not just a rising score. → crucible-engineer + mirror-warden.
5. **Foreground the conflict**: surface the Player-vs-Self expression tension and present Tai Gi as
   the climax (Shipp ch.4). → mechanics copy + UI.
6. **Authoring scaffold — "Quest for the Perfect Word":** give the player 2–3 seed beads and ask for
   the connective tissue (a generated prompt, cf. PCG corpus). This is the storytelling on-ramp.
7. **Run a narrative-design audit each content phase** (knitted? motivated? which degree of thematic
   action?) as a soft gate. → narrative-designer agent.
