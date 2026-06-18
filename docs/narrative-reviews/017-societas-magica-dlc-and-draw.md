# Narrative Review 017 — Societas Magica DLC + the Draw panel (filter / redraw / pick)

- **Date:** 2026-06-18
- **Turn / prompt:** Provide a Societas Magica DLC as two packs (**Historical Figures** + **Contemporary
  Scholars**) playable either/both, drawable or on the board. Make draws **redrawable** (five random
  from the database) with the option to **filter** the types drawn — narrow as much as wanted — or just
  **search up and draw a specific card**. (Also: coordinate with the other window's uncommitted work.)
- **What was produced:** **built-in DLC infrastructure** (`content.ts`: `registerDlc`, `isBuiltinPack`;
  built-in packs surface in the Packs modal as activatable/exportable DLC, no edit/delete); the
  **Societas Magica** data (`src/data/dlc/societasMagica.ts`) — 12 historical figures + 10 contemporary
  scholars, each cited; a **🎲 Draw modal** (search + type filter → pool count → *Draw 5 random* /
  *Redraw hand* / click a card to draw it). Test `content.test.ts`; 20/20 tests; build clean.

## Analysis (against the study materials)

- **This is the Knowledge-Portal → game bridge made *curatorial* (Fost; ecosystem theory).** A
  scholarly society's reading list becomes a playable, citable deck. Figures carry planetary/
  disciplinary attributes so they're *live* in the relation engine (Ficino beside a Venus bead still
  surfaces his benefic remedy) — content and mechanic are one.
- **Figures + Scholars as parallel packs is a genuinely good idea (Shipp ch.6 characters).** Playing a
  *contemporary scholar* beside the *figure they study* (Fanger beside the Ars Notoria; Kieckhefer
  beside necromancy) is a meta-move — the history of scholarship as a layer of the Game. The
  either/both toggle lets a player run a pure-source game, a pure-historiography game, or the dialogue
  between them.
- **The Draw panel restores agency (answers review 014 directly).** Review 014 warned the 931-card
  Crystal could flood the hand and erase scarcity/choice. DLC packs gated the *pool*; the Draw panel
  now gives the *verb*: filter → draw-5 / redraw / pick. "Narrow as much as you want, or pick exactly"
  is a clean expression of player control (Ham ch.4 choices) without abandoning serendipity.

## Risks / watch-items

- **Living-scholar accuracy (Grounding Rule, sharpened).** Cards about living academics must be
  factually safe — I kept each to a one-line contribution + a real signature work, and labelled the
  set a *starter the user will refine*. Treat as provisional until the user supplies the definitive list.
- **Draw can bypass the deck economy.** "Draw 5 / pick any" sidesteps end-turn draws and scoring
  pacing; fine as a sandbox/most-creative-tool, but in a competitive game it needs a cost or a toggle.
- **Name collisions:** some Societas figures (Dee, Kieckhefer) also exist in the Crystal corpus — the
  Draw pool shows both. Harmless, but dedup-by-name could tidy it later.
- **Shared worktree:** committed only my own files; left the other window's tickets/TDD docs untouched.

## Suggestions (next)

1. Let the user **replace the starter Societas list** via import (the pack export/import already
   supports this) — or ingest their provided CSV/list into `societasMagica.ts`.
2. **Scholar↔figure relations:** author a few corpus relations so playing a scholar next to their
   subject surfaces a cited "X studies Y" situation.
3. A small **draw cost / per-turn cap** option so the Draw verb coexists with competitive pacing.

## Grounding check

- Every DLC card carries a `sourceRef` (a real work); figures link to portals where apt
  (Paracelsus/Hermes → hermeticdb, Ficino/Agrippa → rmdb). Test asserts non-empty sourceRefs. Living
  scholars flagged provisional. No `TODO(grounding)` blocker opened.
