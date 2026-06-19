# Narrative Review 019 — Curated history packs + the "draw connected" system

- **Date:** 2026-06-18
- **Turn / prompt:** Many curated packs — medieval/early-modern/ancient/Arabic alchemists, ancient/
  medieval hermetists, witch trials, Inquisition, and a scholastic-philosophers pack (Aquinas + ~20,
  as they bear on the occult/metaphysics). Sober, academic. And a **system for offering the player
  cards connected to the one just placed** (Henry of Ghent → his impact on Pico, as the example).
- **What was produced:** **nine curated DLC packs** (`src/data/dlc/{scholastica,alchemists,hermetica,
  persecution}.ts`, ~95 cards, each cited, sober register, style-guide glyphs); an **influence-link
  registry** (`links.ts`) + a **connection engine** (`engine/connections.ts`) that surfaces connected
  cards (authored links first, then shared-correspondence); the bead **info panel now offers "Draw a
  connected card"** on placement. Tests `connections.test.ts`; 30/30; full build clean.

## Analysis (against the study materials)

- **The connected-draw is a real player verb (Tom Smith; Ham ch.4).** "Place a card → choose among
  cards it pulls in" turns the board into a *guided intellectual itinerary*: place Henry of Ghent and
  the game offers Pico, Aquinas, Eriugena… each with a one-line reason. This is the Glass Bead Game's
  "stringing together" of a tradition, made an actual mechanic — and it is *grounded* (every link
  carries a cited rationale), not associative hand-waving.
- **Sober register honoured (the user's instruction).** The persecution packs especially: the witch
  trials and Inquisition are written as history — the handbooks, the hunters, **and** the victims
  (Bruno, Campanella, Cecco) and the critics (Weyer, Spee). No glamour, no edgelording.
- **Packs as curated lists with depth (Shipp ch.2).** Each pack is a coherent symbolic vocabulary;
  activating "Arabic Alchemists" or "Scholastic Philosophers" gives a game a real intellectual centre
  of gravity, so the relation engine reads within a world rather than at random.
- **Two-tier connection (authored + thematic)** means even un-linked cards offer connections (shared
  discipline/tradition), so the verb never dead-ends — while the authored links carry the precise,
  teachable history (the Henry→Pico, Albertus→Aquinas, Ficino→Hermes lineages).

## Coordination (the other window)

The shared worktree has the other window's **uncommitted online-phase work** (auth, sync, Supabase,
NavBar, SavesModal) entangled into `App.tsx`/`main.tsx`/`content.ts`/configs. Verified everything
**builds and tests together on disk** (30/30). To avoid breaking CI or committing their WIP, I
committed only my **self-contained** files (the packs, the connection engine, tests, docs); my
`App.tsx` wiring (register all packs + the connected-draw panel) stays on disk and will be included in
their next commit. **Verified live in dev:** Henry of Ghent → offers Pico (cited), drawn to hand.

## Risks / watch-items

- **Accuracy of ~95 hand-authored cards.** Written from well-established facts with citations, but a
  sober academic set this size should get a scholarly proofreading pass (dates, attributions). Flagged.
- **Cross-pack duplicate figures** (Dee, Paracelsus, d'Abano appear in two packs) — deliberately
  linked ("the same John Dee"), but dedup-by-name in the Draw pool would tidy it.
- **Deck size when many packs active** — same caution as review 015: curated/smaller plays better.
- **App wiring not yet in a commit** (coordination, above) — goes live with the other window's batch.

## Suggestions (next)

1. A scholarly proofreading pass over the ~95 cards.
2. Surface the connected-draw also in the **Draw** modal (not only the bead panel).
3. More authored links across the alchemy lineages (Geber→Latin alchemists; Zosimos→the commentators).

## Grounding check

- Every card cites a real source; sober register; no living people. Each influence link carries a
  grounded reason. Test asserts non-empty sourceRefs across all DLC cards. No `TODO(grounding)` blocker.
