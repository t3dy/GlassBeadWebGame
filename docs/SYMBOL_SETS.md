# Symbol Sets — The Bead & Tile Vocabularies

The game's "language." Each **set** is a namespace of beads (subjects/objects) or tiles
(relations/predicates). Sets are **gated by circuit** ([MECHANICS](MECHANICS.md#the-eight-circuits))
and grounded in the corpus ([PHILOSOPHY](PHILOSOPHY.md#the-grounding-rule)). Implement each set as
a typed data file under `src/data/sets/` exporting bead/tile records; `bead-smith` owns these.

Per the sources, sets are **open and combinable** — Hesse's Game incorporates "mathematical and
astronomical formulas, musical notation, the structural rules of architecture, and ancient Chinese
ideographs," and Magister Thomas famously added "alchemical significance of the signs of the
zodiac." A move *across* sets scores higher than one *within* a set.

## The glyph bank (a core, always-available resource)

The **glyph bank** is the palette of glyphs a player can **apply to beads at any time** — one of the
two core actions ([GAME_LOOP](GAME_LOOP.md#the-two-core-actions-what-the-game-is)), alongside drawing
cards. Unlike cards (drawn, limited), the bank is **persistent and always available**, so applying a
glyph is always a legal move (a floor). It holds the symbol sets below — the alchemical three tiers,
planets, zodiac, elements, the Unicode alchemical block, etc. Some glyphs may be **gated** (unlocked by
circuit/skill), but a generous starter set is always on hand. Applying a glyph attaches its
correspondences to the bead, feeding the correspondence engine. The optional occult diagrams (Rose
Cross lamen, Tree of Life) are just *alternative ways to browse/select* from this same bank — never
required.

## The alchemical system (three tiers) — the flagship vocabulary

Adapted from the **AlchemyBlocks** project (`C:\Dev\AlchemyBlockInvaders\`). The three tiers split
cleanly across the bead/tile grammar — full rationale in
[NARRATIVE_DESIGN](NARRATIVE_DESIGN.md#the-alchemical-glyph-system-refined-from-alchemyblocks).
**Design rule (imported):** *the mechanic must teach the symbol, and the symbol grammars the story.*

- **Tier 1 — Substances → BEADS.** 4 Elements (🔥💧🌬️🌍, *prima materia*) + 7 Planet–Metals
  (☉ Sol/Gold, ☽ Luna/Silver, ☿ Mercury, ♀ Venus/Copper, ♂ Mars/Iron, ♃ Jupiter/Tin, ♄ Saturn/Lead).
- **Tier 2 — Operations → TILES (predicates).** The **12 zodiacal processes are transformative
  verbs** → the primary *motivated* tile set (`alch:calcines`, `alch:conjoins`, …; see Tile sets).
- **Tier 3 — Principles → MODIFIERS.** The tria prima aspect a triad: 🜍 Sulphur (boldness/leap),
  🜔 Salt (permanence/coherence), ☿ Mercury (cross-set bridge). All three on one triad = **Tria
  Prima** (chymical wedding → Tai Gi candidate).
- **Colour stages** (nigredo→albedo→citrinitas→rubedo) drive the magnum-opus session arc.

## Bead sets (subjects / objects — round glyphs)

| Set id | Glyphs | Examples | Circuit | Notes |
|---|---|---|---|---|
| `elements` | 🜂 🜄 🜁 🜃 (or 🔥💧🌬️🌍) | Fire, Water, Air, Earth (*prima materia*) | 1+ | Prefer the **alchemical element triangles** (🜂 fire, 🜄 water, 🜁 air, 🜃 earth) over emoji for register. Base concept-beads. |
| `metals` | ☉ ☽ ☿ ♀ ♂ ♃ ♄ | Sol/Gold, Luna/Silver, Mercury, Venus/Copper, Mars/Iron, Jupiter/Tin, Saturn/Lead | 1+ | Charged, opposable beads (Sol⟷Luna, Mars⟷Venus, Sol⟷Saturn). Hesse's "secret language." |
| `substances` | 🜍 🜔 🜞 🜟 🜢 🜬 … | Sulphur, Salt, Vitriol, Cinnabar, Arsenic, Antimony, *aqua vitae*, *prima materia* (🜀) … | 3+ | Materials/reagents from the Unicode block (below). The *quintessence* 🜀 is a candidate Tai-Gi synthesis bead. |
| `apparatus` | ⚗️ 🝪 🝫 🝬 🝭 ⚖️ | Alembic/still ⚗️, retort, crucible, furnace/athanor, balance/scales ⚖️ | 4+ | The *vessels & instruments*. Double as UI primitives — the **Crucible** workspace and the **Lute** input draw from these (see [AESTHETIC](AESTHETIC.md#input--the-masters-lute--the-crucible)). |
| `zodiac` | ♈–♓ | the twelve signs (each = a process, used as a **tile**) | 2+ | See Tile sets — processes are predicates, not beads. |
| `astronomical` | planets, aspects | conjunction, opposition, configurations | 2+ | "An astronomical configuration" — Hesse's worked example. |
| `iching` | ䷀–䷿ (64) + ☰☷☵☲ (8 trigrams) | hexagrams; the 8 trigrams | 3+ | **The 8 trigrams seed the 8 circuits** (see below). |
| `musical` | ♪ ♫ intervals, fugue subjects | a Bach fugue subject; interval, theme | 5+ | Powers the resonance/counterpoint scoring. |
| `mathematical` | + − × ∫ ∞ logic | a Leibniz proposition; ratio, integral | 3+ | "A philosophical sentence from Leibniz." |
| `archetype` | Jungian / Hessean | Demian, Frau Eva, Abraxas, *Helle/Dunkle Welt*, *Kainszeichen* | 7+ | Mythic layer; supplies Tai Gi opposites. |
| `tarot` | Major Arcana | 22 archetypal images | 7+ | Circuit-7 collective imagery. |
| `circuit` | the 8 Leary circuits | bio-survival … neuroatomic | meta | Used in tutorial + progression UI. |
| `geomantic` | the 16 figures | Via, Populus, Fortuna Major… | mode | Element/planet/zodiac correspondences; powers Geomancy mode ([BOARD_MODES](BOARD_MODES.md)). |
| `kamea` | planetary magic squares | Saturn 3×3 … Moon 9×9 | mode | Cells + glyphs for the Sigil-on-a-Kamea mode; reuses the Goetia sigil work. |

> **The Unicode Alchemical Symbols block (U+1F700–U+1F77F)** is the canonical glyph source for the
> `substances` and `apparatus` sets — ~116 historical sigils for elements, metals, reagents,
> operations, and apparatus (alembic, retort, crucible, furnace/athanor, *aqua vitae*, etc.), plus
> ⚗️ (U+2697) and ⚖️ (U+2696). `bead-smith` must **enumerate exact codepoints + grounded glosses**
> (a sigil's historical meaning), verify glyph rendering in the chosen font, and flag any unconfirmed
> sense as `TODO(grounding)`. Glyphs shown in the tables above are provisional until verified.

## Tile sets (predicates / relations)

Tiles are the **predicate** of the triad. Two registers: the **alchemical processes** (the default,
*motivated* set — the 12 operations are transformative verbs) and **kanji relations** (Fost-style,
for non-alchemical reality tunnels). Each maps to an ontology relation URI ([DATA_MODEL](DATA_MODEL.md)).

### `process` tiles — the 12 zodiacal operations *(lead vocabulary)*

A triad reads *subject → operation → object*. Full narrative glosses in
[NARRATIVE_DESIGN](NARRATIVE_DESIGN.md#tier-2--operations--tiles-verbs--predicates).

| Relation URI | Sign | Operation | Circuit |
|---|---|---|---|
| `alch:calcines` | ♈ | Calcination — reduce to essence | 1 |
| `alch:dissolves` | ♉ | Dissolution — loosen/open | 1 |
| `alch:separates` | ♊ | Separation — distinguish (analysis) | 3 |
| `alch:conjoins` | ♋ | **Conjunction — the marriage** (≈ reconciles) | 4 |
| `alch:ferments` | ♌ | Fermentation — quicken over time | 5 |
| `alch:distills` | ♍ | Distillation — refine/purify | 5 |
| `alch:coagulates` | ♎ | Coagulation — balance into a body | 4 |
| `alch:putrefies` | ♏ | Putrefaction — death before rebirth | 7 |
| `alch:exalts` | ♐ | Exaltation — raise/spiritualize | 6 |
| `alch:fixes` | ♑ | Fixation — make permanent | 2 |
| `alch:multiplies` | ♒ | Multiplication — amplify/propagate | 8 |
| `alch:projects` | ♓ | Projection — transmute/complete | 8 |

### `kanji` tiles — relational signs (other reality tunnels)

| Relation URI | Suggested glyph | Gloss | Circuit |
|---|---|---|---|
| `gbg:leadsTo` | 道 | leads to / becomes | 1 |
| `gbg:avoids` | 避 | flees / avoids | 1 |
| `gbg:contains` | 含 | contains / encloses | 2 |
| `gbg:dominates` | 王 | rules / dominates | 2 |
| `gbg:means` | 意 | signifies / means | 3 |
| `gbg:analogousTo` | 似 | is analogous to | 3 |
| `gbg:pairsWith` | 対 | pairs / corresponds | 4 |
| `gbg:counterpoints` | 韻 | sets in counterpoint | 4 |
| `gbg:resonatesWith` | 響 | resonates with | 5 |
| `gbg:reconciles` | 合 | reconciles (→ Tai Gi) | 7–8 |

> Glyph choices above are **provisional** — `bead-smith` must verify each kanji's sense against a
> source or flag `TODO(grounding)`. Do not ship unverified glosses.

## The trigram ↔ circuit bridge

A deliberate structural rhyme between Hesse's vocabulary and Leary's ladder. One trigram anchors
each circuit, giving the progression UI a grounded glyph:

| Circuit | Trigram | Name | Resonance |
|---|---|---|---|
| 1 Bio-survival | ☷ | K'un / Earth | receptive ground, body |
| 2 Emotional-territorial | ☶ | Kên / Mountain | boundary, territory |
| 3 Semantic | ☲ | Li / Fire | clarity, the symbol that illuminates |
| 4 Socio-sexual | ☱ | Tui / Lake | joining, the pair |
| 5 Neurosomatic | ☵ | K'an / Water | flow, sensation, rhythm |
| 6 Metaprogramming | ☴ | Sun / Wind | the shifting lens |
| 7 Neurogenetic | ☳ | Chên / Thunder | the archetypal arousal |
| 8 Neuroatomic | ☰ | Ch'ien / Heaven | the non-local creative |

*(Assignment is interpretive; treat as a design seed, refine with a source if challenged.)*

## Opposites table (for counterpoint & Tai Gi)

The ontology must flag opposite pairs so the engine can award the counterpoint bonus and enable
Tai Gi collapse. Seed pairs from the corpus:

- Sol ⟷ Luna · Sulphur ⟷ Mercurius (alchemical)
- *Helle Welt* ⟷ *Dunkle Welt* · Demian ⟷ Frau Eva (Yang/Yin) (archetype, → **Abraxas**)
- law ⟷ freedom · individual ⟷ community (Hesse's named examples)

Adding a new set: define beads/tiles + `sourceRef`, register namespace + relation domains/ranges
in the ontology, declare any opposite pairs, and set the unlock circuit.
