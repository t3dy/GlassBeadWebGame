# Narrative Review 023 — Patrons DLC (medieval & Renaissance patronage)

- **Date:** 2026-06-27
- **Turn / prompt:** "Continue creating mechanics and assets for our new game modes and genres."
- **What was produced:** `src/data/dlc/patrons.ts` — **30 historically-grounded patron figure cards**
  (al-Ma'mun → Rudolf II), composed into the **five expansion packs** named in the new
  `docs/research/MEDIEVAL_RENAISSANCE_PATRONAGE_SOURCEBOOK.md` (Women of the Courts · Astronomy &
  Instruments · Manuscript Courts · Alchemy & Kunstkammer · Magnificence & Propaganda). Wired into
  `src/data/dlc/index.ts` (`...PATRON_PACKS`). Authored **~24 influence links** in `links.ts` — patrons
  to the figures/places they funded (Cosimo → Ficino, Rudolf II → Maier & Prague, Alfonso X → Toledo,
  Elizabeth I → Dee) and to one another by dynasty/household (the Medici house, the Roman papacy, the
  Valois–Burgundy brothers, Timurid Herat, the Habsburgs). Tests `patrons.test.ts` (7). **50/50;
  build clean.** (Authored by the bead-smith agent from the sourcebook; integrated + tested here.)
- **Coordination:** a second window was live-editing `modes.ts` / `App.tsx` (the mode→genre *mechanic*,
  review 022). This turn stayed entirely in the non-overlapping **asset** lane (DLC data files) to avoid
  clobbering that work — the two halves of "modes & genres" built in parallel without collision.

## Analysis (against the study materials)

- **Knitted vs. layered** (Shipp ch.2): **knitted.** A patron is not flavour pasted on a figure — it is
  a *high-connectivity bead* whose whole reason for being is the relations it enables. The links file
  makes that literal: placing Cosimo de' Medici pulls Ficino toward your hand; placing Rudolf II pulls
  Maier, Dee, and Prague. The theme (patronage = a social technology of dependency) *is* the mechanic
  (connectivity), not a coat of paint.
- **Motivated elements** (Shipp ch.2): **strong.** Every card cites a real source; every link states a
  real historical tie (kinship, court office, translation, commission). Nothing is present that the
  sourcebook can't defend — the glyphs derive from its attribution table, not free choice.
- **Degree of thematic action** (Shipp ch.2): **associated → mechanical.** The patron's effect is
  modelled as *connection* (the draw-connected web), which is one honest step toward simulating
  patronage. It is not yet *simulative* — there is no stipend economy, no commission to satisfy, no
  scandal risk. The sourcebook's Genre Hooks (lab-sim, roguelike, visual-novel) sketch that simulative
  layer; this turn lays the cards it would run on.
- **Conflict / plot** (Shipp ch.4): **latent, not yet active.** Patrons imply contest — rival workshops,
  contested favour, debt, censorship — but the asset layer alone doesn't stage it. The hook is ready
  for the patronage *modes* to make the conflict a verb (see Suggestions).
- **Player verbs** (Tom Smith): the patron cards *amplify the existing verb* (infuse → relate) by giving
  the relate-verb richer, more historically loaded objects to bind. They don't add a verb; they deepen
  one. The patronage genre-modes are where a new verb ("commission", "send a letter", "dedicate") would
  live — and the other window's mode→genre scaffold is the right home for it.
- **Other — diversity & the gendered-erasure note** (sourcebook §Historiographical; Serpa aesthetics):
  the Women of the Courts pack (Isabella d'Este, Margaret of Austria, Gawhar Shad, Catherine de' Medici,
  Elizabeth I, the Florentine regents) deliberately corrects the male-default roster, modelling women as
  patrons, diplomats, and collectors rather than muses — a content choice the sourcebook argues for and
  the cards honour.

## Suggestions

1. **Build the patronage genre-modes** on the other window's mode→genre scaffold (`modes.ts`): a
   "Court Patronage (letters)" visual-novel register, a "Laboratory Commission" lab-sim register, a
   "Courtly Roguelike", and "The Kunstkammer" — each turning the latent conflict (favour, debt, scandal,
   deadline) into a voiced prompt. *I drafted these this turn but withheld them to avoid colliding with
   the live `modes.ts` edit — hand them to whoever owns that file next.* (crucible-engineer / narrative-designer)
2. **A patron as an asymmetric sponsor** (sourcebook Genre Hook A): one favoured glyph + one forbidden
   risk per patron (Rudolf rewards `mercury`+`saturn`+`sulphur` but raises a fraud check). This is the
   step from *associated* to *simulative* thematic action. (crucible-engineer)
3. **Place-aware patron play:** the meeple+role+place hook (alchemist on Prague Castle → attach Rudolf II)
   already imagined in HANDOVER now has 30 real patron cards to attach. (crucible-engineer)
4. **Link the patrons to their named works/artists** as those cards enter the corpus (Galileo's
   *Sidereus Nuncius* → Cosimo II; the *Très Riches Heures* → Jean de Berry). (bead-smith)

## Grounding check

- Player-facing strings introduced this turn: **all grounded.** 30 card glosses, each with a `sourceRef`
  to the sourcebook's Research Appendix; ~24 link reasons, each a documented historical tie. Per
  CARD_STYLE_GUIDE §0, only historical figures are named — no living scholars as card subjects.
- No `TODO(grounding)` opened. One interpretive call logged in the pack: the sourcebook's "Charles V"
  (Manuscript pack) was mapped to **Charles V of France**, the figure actually in the roster table, not
  Emperor Charles V.
