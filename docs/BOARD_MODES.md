# Board Modes — Divinatory Layouts over the Core

**Optional** alternative board structures. The **default** board is the **Free Grid** (Fost-style) and
the core never changes — you still *infuse beads with cards* and *apply glyphs from the glyph bank*
([GAME_LOOP](GAME_LOOP.md#the-two-core-actions-what-the-game-is)). A board mode just changes the
**layout, how beads arrive, and how positions are read** — and each divination system is itself a
correspondence engine, so it maps cleanly onto our signature → Adventure-Starter pipeline
([ADVENTURE_STARTERS](ADVENTURE_STARTERS.md)). Modes are opt-in, never required.

## The `BoardMode` abstraction (one engine, many layouts)

```ts
interface BoardMode {
  id: 'freegrid'|'tarot'|'geomancy'|'iching'|'kamea';
  name: string;
  layout: Position[];                 // positions with meanings + coords
  generate?(seed: string): Placement[]; // procedural modes (geomancy, iching) seed from intent/cast
  read(state): Signature[];           // positional/structural relations → signatures for the engine
  sourceRef: string;
}
interface Position { id: string; label: string; meaning: string; x: number; y: number;
  accepts: 'bead'|'line'|'figure'|'pathcell' }
```

Every mode reduces to the same primitives: **positions receive beads** (infused by cards, qualified by
glyphs), and **structural relations between positions become signatures** → grounded story options.
**Pass** stays available in every mode; generation modes auto-produce a readable starting state.

## The modes

### Free Grid *(default, core)*
The open grid; orthogonal `bead–tile–bead` triads ([MECHANICS](MECHANICS.md)). Everything else is optional.

### Tarot Spread
Pick a spread (Three-Card, Celtic Cross, …). Each **position carries a meaning** (e.g. *Self,
Crossing, Crown, Foundation, Past, Future*). Placing a card-bead in a position **infuses it with that
positional significance**; structurally paired positions (Self × Crossing, Querent × Outcome) emit
**opposition/affinity signatures**. Reading = card × position × neighbor. *(CROWLEYDB Thoth tarot
attributions feed this.)*

### Geomancy
**Generate** four **Mothers** (binary dot-rows seeded from the player's intent / a cast), derive the
**Daughters, Nieces, two Witnesses,** and the **Judge** by the geomantic combination rule — the 16
figures, each with element/planet/zodiac correspondences (glyph bank). Lay them on the **Shield Chart**
(or the astrological **House Chart**). Witnesses → **Judge** is a literal **conjunction/synthesis**
signature; houses give positional meaning. A whole reading is generated procedurally, then explored.

### I Ching
**Cast six lines** (yin/yang, with **moving lines**) → a primary **hexagram**; moving lines transform
it into a second hexagram. Trigram pairs + the primary→transformed shift feed the engine as a
**transformation-class** signature. Ties directly to our **8 trigrams ↔ 8 circuits** mapping
([SYMBOL_SETS](SYMBOL_SETS.md#the-trigram--circuit-bridge)) — the I Ching mode is the circuit ladder
made tactile.

### Sigil on a Magic Square (Kamea)
Choose a planetary **kamea** (Saturn 3×3, Jupiter 4×4, … up to Moon 9×9). Spell an **intent/word**,
convert letters to numbers (gematria / AIQ BKR), and **trace a path** across the kamea cells → a
**sigil** (a polyline). The cells the path crosses connect their beads/glyphs into one multi-bead
combination; the planetary square sets the governing correspondence. Reuses the **Goetia sigil
analysis** work (`C:\Dev\wiki\goetia_sigil_analysis.md` — the kamea-path construction hypothesis) for
grounded tracing + glyphs.

## How modes feed the existing systems

- **Correspondence engine / Adventure Starters:** `mode.read(state)` yields signatures exactly like
  the Free Grid's triads — so starters, the coverage guarantee, and slot-fill all work unchanged. A
  mode may add a few **mode-specific Tier-A starters** (e.g. "Witnesses → Judge", "moving line").
- **Glyph bank:** geomantic figures, hexagrams/trigrams, and kamea glyphs are **glyph sets** in the
  bank ([SYMBOL_SETS](SYMBOL_SETS.md#the-glyph-bank)).
- **Cards / portals:** cards still infuse the positions; mode + portal compose (a Tarot spread of
  CROWLEYDB figures; a geomancy of medieval-magic concepts).
- **Goals & progression:** private goals can target mode structures ("complete a Judge of Fire");
  modes can be **unlockable** via the skill tree (an optional mastery), but the Free Grid is always open.

## Ownership & build order

- **crucible-engineer:** the `BoardMode` interface + the Free Grid first; then `generate`/`read` per
  mode (geomancy & I Ching need procedural generation; tarot & kamea need layout + tracing).
- **bead-smith:** the figure/hexagram/kamea glyph sets + their correspondences.
- **narrative-designer:** mode-specific starter sets + grounded position meanings.
- **mirror-warden:** the layout views (spread shapes, Shield Chart, hexagram, magic square).
- **Phasing:** modes are **post-core** ([PLAN.md](../PLAN.md)) — ship Free Grid in the core phases;
  add modes one at a time later. Recommended first optional mode: **Tarot Spread** (closest to the
  grid; reuses CROWLEYDB tarot data).
