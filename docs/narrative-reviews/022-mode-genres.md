# Narrative Review 022 — Genres (subdividing the game modes) + Video Game mode

- **Date:** 2026-06-19
- **Turn / prompt:** Subdivide game modes by genre (Bong Session → Philosophical; Novel → Science
  Fiction; Video Game → Roguelike); suggest genres for each and build the systems & assets.
- **What was produced:** a `Genre` type + **genres on every mode** (3–5 each, with their own prompt
  copy), a new **Video Game** mode (Roguelike · Visual Novel · Open-World RPG · Soulslike · Puzzle
  Box), genre-aware `composeModePrompt(modeId,a,b,op,genreId)` + `genresOf()`. UI: genre chips at
  setup, mode·genre on the mode bar, genre passed to the live prompt. Tests updated; 43/43; build
  clean; **verified live** (Video Game → Roguelike: "Make {a} a procedurally-placed reward and {b} the
  risk that guards it. Is the gamble fair?").

## Analysis (against the study materials)

- **Mode × Genre is a clean two-axis taxonomy (Tom Smith — systems; Serpa — aesthetics).** Form ×
  flavour multiplies the register of the customized prompt without multiplying the mechanic: ~10 modes
  × ~4 genres ≈ 40 voices over one board. This is the Glass Bead Game's whole premise — one language,
  many disciplines — expressed as a UI affordance.
- **Genres deepen the player verb (Anatomy ch.2).** "Relate two beads" stays the verb, but Roguelike
  asks about risk/permadeath while Gothic asks what crime seeps through the walls — the *same act*
  reframed, which is exactly the reality-tunnel idea (RAW) made selectable.
- **Knitted, not layered (Shipp ch.2):** genre changes the baked-in prompting, not decoration; and the
  "General" option preserves each mode's own voice, so the axis is additive, never lossy.
- **The Magister genres keep the core sacred:** Counterpoint / Fugue / Ascent / Maybe Logic are the
  Hesse-and-Leary techniques themselves — the contemplative mode gains genres without going pop.

## Risks / watch-items

- **Asset volume vs. depth:** ~40 genres × 1–2 prompts is broad but thin; some genres have a single
  template (repetition shows). Grow the high-traffic ones first (Novel, Video Game, Bong Session).
- **Tone guardrails:** Bong Session → Conspiracy and Camp critique are deliberately silly/edgy — kept
  to their genres, never the default; the Magister default stays grave.
- **Combinatorial UI:** the setup now has modes + a genre row; watch that it stays legible (chips, not
  a wall). Fine at current counts.
- **Persistence:** modeId/genreId still React-state only (not in the save) — a one-field engine add
  later, deferred during the online-phase churn.

## Suggestions (next)

1. Give each genre 3–4 prompts and let `{op}`/the relation re-roll within a genre for variety.
2. Let a genre also tilt the **deck** (Video Game → concept cards; Painting → emblem cards).
3. A "surprise me" that rolls a random mode+genre — a Discordian nudge.

## Grounding check

- All prompt copy is original mode/genre-voice writing (questions, not asserted facts); the Magister
  genres name real Hesse/Leary techniques. No invented facts, no `TODO(grounding)` opened.
