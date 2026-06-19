# Narrative Review 020 — The Robert Anton Wilson / Illuminatus pack

- **Date:** 2026-06-19
- **Turn / prompt:** A pack of cards on RAW's novels and magic theories, especially the Illuminatus!
  Trilogy.
- **What was produced:** `src/data/dlc/raw.ts` — a 25-card pack (authors, works, Illuminatus
  characters & factions, and the magic/consciousness theories), adapted from the RAW/Illuminatus
  knowledge portal in `C:\Dev\wiki` (ontology_raw_illuminatus, illuminatus_concept_cards, raw_book_*);
  registered in `index.ts`; a rich set of influence **links** (the conspiratorial web) that also
  reach the **base seed's RAW/Leary cards**. Test added; 38/38; build clean.

## Analysis (against the study materials)

- **RAW is the keystone the whole game was already built around.** The eight-circuit model, reality
  tunnels, and Maybe Logic / model agnosticism were in the design from day one (PHILOSOPHY.md) and in
  the seed deck (`leary:circuit`, `raw:maybe`, `raw:abraxas`). This pack makes that lineage *playable*
  and explicit — and the connection links literally tie the pack back to those seed cards (verified
  live: placing **Maybe Logic** offers **Robert Anton Wilson**).
- **The connected-draw is *perfect* for RAW (Tom Smith — meaning; Ham — choices).** RAW's whole method
  is the web of associations that the reader must decide to believe or doubt; "place a card → choose
  among the cards it pulls in, each with a cited reason" *is* guerrilla ontology as a game verb.
  Hagbard → the JAMs → Eris → Discordianism → the Principia is an initiation path you walk by drawing.
- **Grounded, not credulous (the portal's own discipline).** The wiki concept cards are written with
  careful "model agnosticism" — Discordianism as "interpretive trap," Chapel Perilous flagged for
  source-confirmation. I kept that register: the cards describe how RAW *uses* the occult, without
  asserting the conspiracies are real.

## Risks / watch-items

- **Id namespace:** the pack uses `rawd:` to avoid colliding with the seed deck's `raw:` ids
  (`raw:maybe`, `raw:abraxas`) — links deliberately reference both, bridging pack and base.
- **Fictional vs. historical:** RAW (1932–2007) and Thornley are historical; Hagbard, Eris, the fnords
  are fictional/mythic — labelled as such in the text, not presented as fact.
- **App wiring (coordination):** as in reviews 015/019, the shared worktree's `App.tsx` (which
  registers `ALL_DLC_PACKS`) carries the other window's uncommitted online-phase work; I committed only
  my self-contained data/engine files. The RAW pack goes live with the next `App.tsx` commit (it shows
  in dev now).

## Suggestions (next)

- Author a `concept`-class **Cosmic Trigger / Sirius** correspondence relation so two RAW beads
  adjacent surface a cited situation (not just a connected draw).
- A "Discordianism" thematic that lightly **shuffles** (Eris/chaos) — a playful pack property, the
  "other properties as the user chooses" hook.

## Grounding check

- Every card cites a real work or the wiki portal; fictional entities labelled; the careful
  model-agnostic register preserved. Test asserts non-empty sourceRefs across all DLC. No blocker.
