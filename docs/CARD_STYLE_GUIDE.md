# Card Style Guide

How to write a card that (a) faithfully summarizes a real entity and (b) works as a **game piece** —
i.e. carries the right **glyph attributions** so it connects in the relation engine. This guide drives
both hand-authored cards (`src/data/dlc/…`, `src/data/seedDeck.ts`) and the programmatic derivation of
corpus cards (`src/engine/glyphAttribution.ts`; `src/data/corpus/derive.ts`).

## 0. The privacy rule (non-negotiable)

Cards name only **historical figures, concepts, texts, and places**. **Never name living scholars** —
use the *subjects they study*, not the students of them. (Per the user's instruction.) The academic
field is the *frame*, not a roster of people.

## 1. The Grounding Rule

Every card carries a real `sourceRef`. The `text` summarizes a sourced fact; it invents nothing. If a
gloss can't be grounded, leave a `TODO(grounding)` rather than confabulate. Living people: omit (see §0).

## 2. Voice & length

- **Register:** the contemplative-scholarly *Magister* voice — calm, concrete, present tense.
- **Length:** one or two sentences, ~20–45 words. A card is a *focus*, not an article.
- **Content:** say *what it is* and *why it matters to the Work / to magic* — the hook a player can
  build a synthesis from. Prefer the vivid specific ("draw down the concord of Venus and Jupiter")
  over the abstract ("an important concept").
- **No hype, no second person, no game-jargon** in the `text` (that goes in glyph/relation data).

## 3. The CardDef shape

```ts
{ id, cls, name, text, glyphs: string[], correspondences: Record<string,string>, sourceRef, portal? }
```
- **`cls`:** `figure` (a person), `text` (a work), `concept` (an idea — also used for places, tagged
  `kind:'place'`), `symbol` (an emblem/sigil).
- **`correspondences`:** the structured attributes the relation engine matches on — keep VALUES in the
  canonical vocabulary below so cards interoperate (e.g. `planet:'Venus'`, not `planet:'the morning star'`).
- **`glyphs`:** 1–3 (max 4) glyph ids — the bead's visible sigils and its attributes. See §4.
- **`portal`:** link to a live knowledge portal where apt (Ficino→`rmdb`, Hermetica→`hermeticdb`).

## 4. Glyph attribution — the canonical table

Attribute **only what is defensible** from the entity's real nature. Prefer the most specific 1–3.
The programmatic floor (`attributeGlyphs`) derives these from `correspondences`; hand-authored cards
should set `glyphs` precisely (and may exceed what the floor can infer).

| If the entity is governed by… | correspondence value | glyph id |
|---|---|---|
| an **operation** | Calcination · Dissolution · Separation · Conjunction · Fermentation · Distillation · Coagulation · Putrefaction · Exaltation/Sublimation · Fixation · Multiplication · Projection | `aries` `taurus` `gemini` `cancer` `leo` `virgo` `libra` `scorpio` `sagittarius` `capricorn` `aquarius` `pisces` |
| a **planet / metal** | Sun/Gold · Moon/Silver · Mercury/Quicksilver · Venus/Copper · Mars/Iron · Jupiter/Tin · Saturn/Lead | `sol` `luna` `mercury` `venus` `mars` `jupiter` `saturn` |
| an **element** | Fire · Water · Air · Earth | `fire` `water` `air` `earth` |
| a **principle** | Sulphur · Salt · (Mercury the spirit) | `sulphur` `salt` `mercury-spirit` |
| a **colour stage** | nigredo · albedo · citrinitas · rubedo | `saturn` `luna` `sol` `sol` |

**Discipline defaults** (when no operation/planet is explicit, attribute by character):
- Hermetic / philosophical / mediating → `mercury-spirit`
- Solar / Neoplatonic / perfective → `sol`
- Saturnine / necromantic / nigredo → `saturn`
- Venusian / love- or medical-magic → `venus`
- Lunar / angelic / reflective → `luna`

**Rules of thumb:** ≤3 glyphs; a figure of broad scope (Agrippa) takes its *signature* note, not all of
them; never attribute a glyph the source can't justify. The bead is a focus, not a soup.

## 5. Correspondence vocabulary (use these keys/values)

- `planet`: Sun · Moon · Mercury · Venus · Mars · Jupiter · Saturn
- `element`: Fire · Water · Air · Earth · `principle`: Sulphur · Salt · Mercury
- `operation`: the twelve operations (title-cased) · `stage`: nigredo/albedo/citrinitas/rubedo
- `discipline`: a short field tag (e.g. "Renaissance magic", "natural magic", "Kabbalah", "alchemy")
- `kind`: `place` for locations · `field`: the curation theme (e.g. "learned magic")
- `entity`: the canonical name (corpus cards) — **not** used for glyph attribution (avoids false hits)

## 6. Selecting which entities become cards (importance)

The corpus holds thousands of entities; not all should be cards. Prefer entities that are:
1. **Connectable** — they participate in relations (so a bead does something), and
2. **Canonical** — central to their tradition / frequently studied, and
3. **Well-sourced** — a real summary + citation exists.
Cap per database to its most important entities; favour breadth of *kinds* (figures, concepts, texts,
places) over piling up near-duplicates. A good deck is curated, not exhaustive — see the DLC packs and
DLC Packs feature (players curate the rest).

## 7. Worked examples

- **Figure:** *Marsilio Ficino* — `glyphs:['sol','jupiter','venus']`, `{planet:'Sun', discipline:'Renaissance magic'}`, cite *De Vita* (1489), `portal:'rmdb'`.
- **Concept:** *Nigredo* — `glyphs:['saturn']`, `{stage:'nigredo', operation:'Putrefaction'}`.
- **Place:** *Prague* — `cls:'concept'`, `glyphs:['mercury','saturn']`, `{kind:'place', discipline:'alchemy'}`.
