# Narrative Review 020 — Accounts, cloud sync & the navigation shell

- **Date:** 2026-06-18
- **Turn / prompt:** "Let users log in and auto-save everything they create (cards, tiles, glyphs,
  packs, board states) with minimal friction; build the front-end for sign-up/login, navigation, and
  the controls a user expects." Decisions: **username + password, email optional**; **full stack,
  user provisions Supabase**.
- **What was produced:** Supabase client (guest-mode-safe) · `authClient` (username→synthetic email,
  pure helpers) · `AuthContext` · `AuthModal` · `sync.ts` (pull-on-login, debounced push, saved-games
  API) · `content.ts` cloud seam (`onContentChange`/`exportUserLibrary`/`importUserLibrary`) ·
  `NavBar` · `SavesModal` · SQL migration (RLS) · `.env.example` · 7 new tests (37/37, build clean,
  verified live in guest mode).

## Analysis (against the study materials)

- **Knitted vs. layered** (Shipp ch.2): The system is *infrastructure*, which usually lands as
  **layered** (theme painted over plumbing). It is knitted **at the copy layer**: login is framed as
  "Enter Castalia / Join the Order" (Hesse's Castalia and the Order of players), saved boards as
  "spaces in memory", and the sync target as "the shared crystal" (the crystal of insights). The
  *mechanism* (auth, debounced upsert) stays non-diegetic — acceptable for plumbing, but the knit is
  cosmetic, not structural.
- **Motivated elements** (Shipp ch.2): Mostly motivated — a profile = enrollment in the Order; "Save
  as…" = branching a contemplative space. The **sync chip** is pure system feedback (unmotivated, but
  that's correct for a status affordance).
- **Degree of thematic action** — mechanical→associated→metaphoric→simulative→literal (Shipp ch.2):
  Sits at **associated** (signing in is *associated with* joining the Order). It is not a play verb,
  so this is expected; the opportunity is to push the *act of saving/publishing* toward **metaphoric**
  ("crystallizing" an insight) rather than a generic disk-save.
- **Conflict / plot** (Shipp ch.4): None — and rightly so. Identity/persistence should be frictionless,
  not a site of conflict. The friction budget belongs on the board.
- **Player verbs** (Tom Smith): Adds healthy *meta* verbs — sign in, name, save, branch, reopen,
  discard. These are navigation/agency verbs (the user explicitly asked for "controls a user expects"),
  distinct from board verbs (infuse/apply). No verb collision.
- **Other (UDL / accessibility):** `AuthModal` uses real `<label>`s + autocomplete hints; nav controls
  are buttons (keyboard-reachable). Gaps: the sync chip has no `aria-live`, and the modals lack a
  focus trap / Esc-to-close.

## Suggestions

1. **mirror-warden** — Make saving diegetic: frame "Save as…" as *crystallizing* a board into the
   crystal (a brief lifecycle shimmer reusing the Green-Stone system), lifting the save verb from
   *associated* to *metaphoric* thematic action (Shipp ch.2). Reserve the word "publish" for the
   future shared-crystal act so private "spaces" and the public crystal stay distinct.
2. **mirror-warden** — A11y pass on the new shell: `aria-live="polite"` on the sync chip, focus-trap +
   Esc-close on `AuthModal`/`SavesModal`, and a visible focus ring on nav buttons (UDL multiple-means
   principle; consistent with Phase 7 a11y goals).
3. **crucible-engineer** — When the profile/account page lands, keep its copy grounded (Castalian rank
   names already specified in PROGRESSION) and add the optional recovery-email flow that the schema
   already accommodates.
4. **bead-smith** — Provide grounded microcopy for the empty/await states (no saved games, sync error)
   so error strings stay on-corpus rather than generic.

## Grounding check

- Player-facing strings introduced this turn — all grounded in Hesse/Leary/RAW:
  - "Enter Castalia", "Join the Order" → Hesse's pedagogical province + the Order of Glass Bead Game
    players.
  - "carry your beads, cards, and games across devices", "Choose a name for the play", "saves to the
    shared crystal" → "the play" = *das Glasperlenspiel*; "crystal" = the crystal-of-insights win-state
    (CLAUDE.md).
  - "Each game is its own space in memory", "branch a copy you can return to" → contemplative framing,
    consistent with the meditative tone.
- The synthetic auth domain `gbg.local` is **internal**, never shown to players (login is by username).
- No `TODO(grounding)` opened this turn.
