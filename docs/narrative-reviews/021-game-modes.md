# Narrative Review 021 — Game modes (collaborative styles & customized interaction prompts)

- **Date:** 2026-06-19
- **Turn / prompt:** Different "game modes" themed around conversation styles / collaborative project
  types (novel, short story, poem, painting, biography, scholarly article, withering film critique,
  dorm-room bong-hit session, …), each giving collaborators a number of moves to add beads or explore
  interactions "based on custom prompting from the system." Build the modes with detailed copy.
- **What was produced:** `src/game/modes.ts` — 9 modes, each with a move budget, a move-verb, an
  invocation, a described voice, and **5–6 customized interaction-prompt templates**; a pure
  `composeModePrompt()` (stable per pairing). UI: a **mode picker** at setup, a **mode bar** (moves
  left), and the **mode-voiced prompt** shown when an inspected bead has a neighbour. Tests
  `modes.test.ts`; 42/42; build clean; **verified live** (Film Critique: "…a 'bold choice,' or the
  laziest beat in the picture? Defend the knife.").

## Analysis (against the study materials)

- **Modes are the strongest expression yet of the player verb (Tom Smith — verbs; Anatomy ch.2).** The
  same two board verbs (infuse / relate) acquire a *register*: to "draft a scene" vs "land a barb" vs
  "take a hit & riff" is the same mechanic experienced as a different act. This is exactly Hesse's
  Game as "a highly developed language" that can speak across forms.
- **The customized prompt is the motivation engine (Shipp ch.4 — conflict/goal; Ham ch.4 — choices).**
  A bare adjacency was previously inert unless it scored; now *every* adjacency invites a concrete,
  voiced task ("Whose desire drives it, and what stands in the way?"). That converts the board into a
  guided collaboration — the move budget gives it shape and an ending.
- **Knitted, not layered (Shipp ch.2):** the mode changes the *baked-in* prompting and the move
  economy, not just flavour text — switching mode genuinely changes how it feels to play. And the
  Magister mode preserves the contemplative core, so the esoteric register isn't lost.
- **Tone range as design (Serpa — aesthetics):** the modes span reverent → caustic → stoned, which
  models RAW's "reality tunnels" at the level of *the whole session* — the same beads read through a
  chosen lens. On-theme, and genuinely fun.

## Risks / watch-items

- **Prompts are templates, not generation.** Deliberately grounded (no runtime hallucination), but a
  given pairing draws one fixed prompt per mode; with few templates, repetition can show. Mitigate by
  growing the prompt sets and/or rolling on the relation as well as the names.
- **Move budget is soft** (UI-tracked, not engine-enforced) to avoid coupling to the other window's
  engine work; "out of moves" nudges Conclude rather than blocking. Fine for a prototype; an engine
  field would make it persistent and authoritative.
- **Bong-session register** is intentionally silly — kept clearly bracketed as one mode so it doesn't
  bleed into the contemplative default.
- **modeId isn't persisted** across reload yet (React-state only) — see coordination note.

## Suggestions (next)

1. Grow each mode's prompt set (and let `{op}` re-roll the template) for variety.
2. Let a mode bias the **deck/board** (poem → musical/symbol sets; article → texts; painting → emblems).
3. Persist `modeId` (a one-field engine addition) once the online-phase churn settles.

## Grounding check

- Player-facing copy is original mode-voice writing; the Magister mode quotes the Hesse register; no
  invented *facts* (the prompts ask questions, they don't assert). No `TODO(grounding)` opened.
