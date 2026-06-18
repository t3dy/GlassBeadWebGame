# Narrative Review 008 — Roles & worker placement

- **Date:** 2026-06-18
- **Turn / prompt:** A worker-placement mechanic — take a meeple and choose a role (cleric, alchemist,
  necromancer, philosopher, neoplatonist, printer, artisan, scholar, patron, or other roles from our
  cards/concepts) or a historical character.
- **What was produced:** [ROLES](../ROLES.md) — an optional worker-placement layer (role abilities
  table, contention, ties to every other system); `Role`/`Worker` + role-space shapes in
  [DATA_MODEL](../DATA_MODEL.md); loop pointer in [GAME_LOOP](../GAME_LOOP.md); folded into PLAN
  Phase 8 (optional layers); doc map.

## Analysis (against the study materials)

- **Worker placement = contested actions (Fullerton; Ham ch.4 Choices):** Limited role spaces create
  the interaction/tension worker placement is prized for, and give each turn a clear *decision*. Good
  fit for the multiplayer the user prioritized earlier.
- **Roles as identity (Shipp ch.6 Characters; Serpa ch.6 Player):** "I am the Necromancer this turn"
  is strong role-play/expression — it makes the abstract synthesis personal, and *historical-character
  workers* (embody Pico, Crowley) turn figure cards into avatars. Rich, on-theme.
- **Knitted, not bolted-on (Shipp ch.2):** Roles don't replace the core — they *empower the two core
  actions* and *bias which Adventure Starters surface*. So the layer reuses the existing engine
  (signatures, starters, XP) rather than forking it. Consistent with the re-centering (review 006):
  explicitly optional, Free-Grid/role-free play stays default.
- **Extensible from the corpus (Tom Smith ch.7 content):** Deriving roles from concept/figure cards
  means the role list grows with the card DB instead of hardcoding — same lesson as signature-keyed
  starters.
- **Always-a-move:** a generic open **Seeker** role + Pass keep the floor; contested spaces can't
  deadlock. Holds the invariant.

## Risks / watch-items

- **Layer stacking:** roles + board modes + draft + goals + progression is a lot of optional systems.
  Guard against turning the contemplative core into an opaque Euro-engine. Default play should be
  *clean*; each layer is opt-in and independently togglable. (magister-ludi — complexity-brake)
- **Contention vs. tone:** aggressive blocking can clash with the reverent/meditative frame. Default
  collaborative mode should soften contention (uses-per-round, rotation) and reserve hard blocking for
  an explicit competitive mode. (crucible-engineer)
- **Role balance:** privileged actions must be roughly comparable; avoid a dominant role. Tune with
  costs / gating. (crucible-engineer + bead-smith)
- **Necromancer/charged roles:** keep grounded and tasteful — necromancy = the nigredo/putrefaction
  work (death-before-rebirth), not edgelord flavor. (narrative-designer)
- **Onboarding:** introduce roles only after the core is taught; don't front-load a worker board.

## Suggestions

1. **crucible-engineer:** role actions + placement as pure reductions; a `rolesEnabled` toggle so the
   core ships role-free; the Seeker/Pass floor in the property test.
2. **bead-smith + narrative-designer:** derive the starter role set from concept/figure cards with
   grounded abilities; map each role → topic affinity + favored starter classes.
3. **magister-ludi:** run a complexity-brake pass before stacking optional layers — confirm each is
   independently togglable and the default stays minimal.

## Grounding check

- No player-facing strings shipped. Roles grounded in attested traditions/portals (alchemist, cleric,
  neoplatonist, printer, patron…) and figure cards; historical-character workers cite `persons.json`.
  Role flavor flagged for source-grounding at authoring.
