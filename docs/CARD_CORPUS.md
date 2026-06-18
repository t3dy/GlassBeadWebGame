# Card Corpus — From Knowledge Portals to a Deck of Beads

The deck is built from the user's **knowledge portals** (`C:\Dev\wiki` and the DB viewers). But a
card is **not a raw copy** of a portal entry. Per the design:

> **Each card is the narrative-designer's interpretation & summary of the portal's index-card + page
> essay, translated into game terms — with its own stats and alchemical glyphs.**

So ingestion is a **two-stage pipeline** (the "Deckard Boundary" pattern from the wiki: deterministic
extraction + qualitative LLM translation), not a bulk dump. Owned by **narrative-designer** (the
translator) + **bead-smith** (schema/glyphs/ontology) + **crucible-engineer** (the pipeline + store).

## Source portals (candidate packs)

Each portal becomes a **pack** the deck can include/exclude. From `C:\Dev\wiki\index.md` and the
project dirs (formats vary — SQLite, site JSON, per-entry JSON):

| Portal | Format (largest data) | Pack theme |
|---|---|---|
| CROWLEYDB | `database/crowley_unified.sqlite`; `frontend/public/data/*.json` | Thelema, Qabalah, Tarot, events |
| MedievalMagicDB | `db/medieval_magic.db`; `site/data.json` | Medieval grimoire magic |
| TheosophicalAlchemyDB | `site/data/prototype_data.json`; citation index | Theosophy / alchemy |
| renaissance magic (RenMagDB) | `db/renmagic.db`; NER/concordance JSON | Renaissance esoterica |
| neoplatonism-portal | `db/neoplatonism.db`; staging essays | Neoplatonism / theurgy |
| WitchcraftStudiesDB | per-entry JSON `data/<type>/<slug>.json` | Demonology / witch-cult studies |
| MagicalLatin | `data/passages.json`, `rituals.json` | Latin magical passages |
| ChristianCabalaDB, MedievalMagicDB, EmeraldTablet (Hermetic), Pico portal, Illuminatus!, Goetia, AtalantaClaudiens | mixed | Cabala, Hermetica, Pico, RAW/occult, Goetic seals, Maier emblems |

*(Each portal entry has an **index card** = short structured record, and a linked **page essay** =
long sourced prose. The pipeline consumes both.)*

## Card schema

```ts
interface Card {
  id: string;                       // stable, namespaced: "<portal>:<slug>"
  class: 'figure' | 'text' | 'symbol' | 'concept' | 'event';  // card class (see taxonomy)
  source: {                         // provenance — the Grounding Rule
    portal: string;                 // e.g. "CROWLEYDB"
    entryId: string;                // the portal's index-card id/slug
    citation: string;               // human cite of the essay/source
  };
  pack: string;                     // deck filter group (≈ portal theme)
  name: string;                     // game-facing title
  glyphs: string[];                 // alchemical/astro glyphs (bead-smith) — see SYMBOL_SETS
  text: string;                     // narrative-designer's SUMMARY of the essay, in game terms
  correspondences: {                // the engine's input (great-table attributes)
    element?: string; planet?: string; zodiac?: string; sephirah?: string;
    number?: number; color?: string; humor?: string; metal?: string; [k: string]: unknown;
  };
  stats: { sulphur: number; salt: number; mercury: number; potency: number };  // tria prima + rank
  opposes?: string[];               // card ids it stands against (counterpoint / Tai Gi)
  affinities?: string[];            // card ids it resonates with
}
```

- **`text`** is a *translation/summary* of the real essay — **grounded, never invented**; cite via
  `source.citation`. This is the narrative-designer's core craft for ingestion.
- **`correspondences`** drive the [correspondence engine](GAME_LOOP.md#the-correspondence-engine-symbols-playing-off-each-other);
  **`stats`** (tria prima) drive scoring + story-prompt thresholds.
- **`glyphs`** come from [SYMBOL_SETS](SYMBOL_SETS.md) (planets/zodiac/Unicode alchemical block).

## Card classes (figures & texts are key classes)

Cards are typed. CROWLEYDB's tables map straight onto them:

| Class | Source (CROWLEYDB) | Plays as | Notes |
|---|---|---|---|
| **`figure`** | `persons.json` (name, motto, role, birth/death, biography) | a bead embodying a **historical figure** | A *key class* — figures carry their correspondences (grade, sephirah, planet) and link to their works & events. |
| **`text`** | `works.json` (title, liber/class, date, summary) | a bead embodying a **work/text** | A *key class* — a text is tied to its author (figure) and its reception events. |
| **`symbol`** | `terms.json`, `symbol_claims.json`, the alchemical sets | a glyph/correspondence bead | The base symbolic vocabulary ([SYMBOL_SETS](SYMBOL_SETS.md)). |
| **`concept`** | `topics.json`, `terms.json` | an abstract concept bead | Themes/ideas. |
| **`event`** | `events.json` (+ `event_topics`, `person_events`) | a **timeline event** surfaced by combinations | Not freely played — *triggered* when the board explores a matching combination ([ADVENTURE_STARTERS](ADVENTURE_STARTERS.md#timeline-events-as-combination-triggered-content)). |

**Figure ↔ text ↔ event links** (from `person_events.json`, `term_works.json`, etc.) become
`affinities` between cards — playing a figure near their text, or near an event they took part in,
is a high-affinity, story-rich move.

## Ingestion pipeline (two stages)

**Stage 1 — Deterministic extract (crucible-engineer).** Per-portal **adapter** reads the source
(SQLite via a query, or JSON), yielding a normalized `SourceEntry { portal, entryId, indexCard,
essayText, citation }`. No interpretation — just pull card + essay + provenance. Adapters live in
`tools/ingest/adapters/<portal>.ts`.

**Stage 2 — Translation (narrative-designer).** For each `SourceEntry`, the narrative-designer
produces a `Card`: summarize the essay into grounded game `text`; assign `correspondences`, `glyphs`,
`stats`, and `opposes`/`affinities` (grounded in the great tables of correspondence + the entry's
content). Unverified glyph/correspondence calls → `TODO(grounding)`. Output: `data/cards/<portal>.json`
packs, merged into the unified store.

**Store.** Unified `cards` table (Supabase) + JSON packs for local play; mirrors into the shared
**pool** so agreed cards accrete ([DATA_MODEL](DATA_MODEL.md#shared-backend-supabase--phase-5)).

## Plan: don't bulk-copy — pilot first

1. **Pilot CROWLEYDB** end-to-end (now the clear choice — it already ships `thelemic_tree.json`,
   `grades.json`, `persons.json`, `works.json`, `events.json` + association tables, so it exercises
   every card class, the Tree-of-Life skill tree, and the events layer). Write its adapter, translate
   ~20–30 cards across classes (figure/text/symbol/event), play-test the loop.
2. **Validate the schema** against real play (do stats/correspondences produce good story prompts?).
3. **Scale** adapter-by-adapter; each portal = one pack; dedupe by `id`.
4. **Cap & curate** per pack so the deck stays motivated, not a dump (cf. narrative review 001).
5. **Attribution:** every card keeps its `source` citation; respect each portal's source licensing.

> Answer to "can we copy them into a big database of cards": **yes — but as translated game cards,
> via this pipeline, starting with a pilot.** A blind copy would ship ungrounded, unbalanced,
> unplayable entries; the translation stage is what makes them cards.
