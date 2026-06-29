# 030 — Translation orchestrator skill · hybrid Claude seam · per-mode prompt banks · UX experiments

**Date:** 2026-06-29
**Turn focus:** Tooling + content + infra for the all-modes vertical slice. (1) A `translate-portal`
**skill** that turns a portal's *relationship graph* into cards + links + relation entries. (2) Answers
to four creative/technical forks (hybrid Claude, networkx+embeddings, UX experiments, ultracode). (3) A
**hybrid Claude "deepen" seam** (serverless, opt-in, offline-safe) beside the local WebLLM seam. (4)
An **ultracode workflow** that grew every mode's interaction-prompt bank, adversarially verified. (5) A
**networkx + embeddings** relationship miner. (6) Two **UX mockups** (play surface + the Crystal graph).

## What was produced
- `.claude/skills/translate-portal/SKILL.md` — relationship-first ingestion job (predicate→mechanic map).
- `src/engine/claudeDeepen.ts` (+ test) and `api/deepen.ts` — opt-in hosted-Claude rephrasing of an
  already-grounded suggestion; any failure falls back to the deterministic text. 6 tests.
- `src/game/modePrompts.ts` (+ test) — `EXTRA_PROMPTS` for all 11 modes; merged into `composeModePrompt`
  (the single hook every adjacency flows through). 5 modes drafted+verified by the workflow; 6 hand-
  authored to dodge the verifier's paraphrase flags. 6 tests.
- `tools/ingest/relations_miner.py` (+ requirements) — PageRank importance ranking + embedding-based
  latent-link/dupe mining; degrades gracefully without deps.
- Mockups: `gbg_mode_play_surface_vertical_slice`, `gbg_crystal_relation_graph`.

## Audit against the study materials (docs/CORPUS_GAME_DESIGN.md)
- **Knitted vs layered theme (Adams/Rollings; *Theme is not Meaning*).** The prompt banks keep
  content = system *knitted*: each mode/genre's templates are content-neutral slot-fillers, so the
  theme ("one language across disciplines") is enacted by the same board read in many registers, not
  bolted on. The `translate-portal` skill deepens the knit by making *relationships* (not just nodes)
  the unit of translation — the board's adjacency mechanic and the corpus's relation graph become the
  same object.
- **Player verbs (Anthropy; Schell, *The Art of Game Design*, lenses of the verb).** No new player
  verb this turn; the work multiplies the *texture* of the existing "relate two beads" verb (≈40
  mode×genre voices, each now with 5–6 prompts). The hybrid Claude seam adds an optional *deepen*
  affordance — a re-expression, not a new decision. Risk noted below.
- **Motivated elements (Bateman, *Game Writing*).** The adversarial verify stage enforced motivation
  by *rejecting* unmotivated near-duplicates (6 modes flagged for paraphrase). This is the corpus's
  "every element earns its place" applied to copy, automatically.
- **Conflict / dramatic tension (Egri via the design lit).** Still thin: prompts *invite* synthesis
  but rarely *cost* anything. The richest registers (noir, tragic, court-roguelike) imply stakes;
  the engine doesn't yet bind a prompt to a wager or loss.

## Suggestions (carried + new)
1. **Make "deepen with Claude" a verb, not a veneer.** Today it rephrases. Consider letting it
   *propose the interpretive-choice options* (the glyph-XP dilemmas) from the sourced pair, so the LLM
   feeds a real decision rather than decoration — keeps it inside the Deckard Boundary.
2. **Let a genre tilt the deck** (still open from 021/022/028). Video Game → concept cards; Painting →
   emblem/symbol cards. The prompt bank now rewards it.
3. **Run `translate-portal` on one new portal** (e.g. CROWLEYDB or a wiki dataset) end-to-end to prove
   the relationship→link pipeline at the skill's stated scale; use the miner to pick the 20 cards.
4. **Bind a prompt to stakes** in at least one mode to introduce Shipp/Egri conflict (a wager that
   spends Reserve to "commit" a reading), reconciling with PROGRESSION's one-currency goal.

## Grounding & privacy
Templates are content-neutral (guarded by a test banning baked-in proper nouns); the Grounding Rule
stays in the cards. The skill restates §0 privacy (no living people). The hosted seam is told, in the
system prompt, to add no facts. No corpus content was invented this turn.
