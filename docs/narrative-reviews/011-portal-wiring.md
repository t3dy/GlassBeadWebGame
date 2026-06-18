# Narrative Review 011 — Wiring cards to the live knowledge portals

- **Date:** 2026-06-18
- **Turn / prompt:** "Wire it to the websites from my knowledge portals — see dev\\wiki."
- **What was produced:** a portal registry (`src/data/portals.ts`) of the 8 live DH sites from
  `wiki/index.html` (the DBCatalog network); an optional `portal` field on cards; cards mapped/added
  so each portal is represented; a clickable **"Explore the source ↗"** link in the bead inspector;
  a header **hub link** (→ DBCatalog) and a footer **portal bar** linking all 8 portals.

## Analysis (against the study materials)

- **Provenance made tangible (Grounding Rule):** a card no longer just *cites* a source in text — it
  **links to the living archive** it came from. This is the strongest possible expression of the
  Grounding Rule: the player can walk from a bead straight into the scholarship.
- **Honest scope:** the full two-stage ingestion (translating every portal entry into cards) is still
  bracketed; this wires the *deck we have* to the *sites that exist*, plus a handful of new
  portal-derived cards (Emerald Tablet, Agrippa, a Goetic seal, Poliphilo, VALIS, the Dark Lady) so
  every live portal is reachable from play. Truthful, not over-claimed.
- **Network effect (Tom Smith ch.8 audience):** positioning the game as "part of the DBCatalog
  portal network" ties it into an existing body of work and gives curious players somewhere to go —
  the "ever-growing crystal" made literal across real sites.

## Verification

- Live (dev preview, via DOM eval): infusing **The Rebis** → inspector shows *"Explore the source ·
  HermeticDB — the Emerald Tablet ↗"* → `https://t3dy.github.io/HermeticDB/`. Hub link →
  `https://t3dy.github.io/DBCatalog/`. Portal bar renders all 8 links. 6/6 tests pass; build clean.
  (Screenshot tool was intermittently hanging; verified by DOM query instead — exact hrefs confirmed.)

## Risks / watch-items

- **Link rot:** portal URLs are hard-coded; if a portal is renamed/un-deployed the link 404s. Keep the
  registry as the single source of truth; revisit when ingestion lands.
- **CROWLEYDB / Neoplatonism / others aren't deployed** as public sites — so they're not in the bar
  yet (only the 8 live GitHub Pages portals are). Note for when more go live.
- **Portal voice vs. game tone:** outbound links leave the contemplative frame; that's fine (opt-in,
  new tab), but keep the in-game copy in the Hesse register.

## Suggestions

1. **bead-smith + narrative-designer:** when CROWLEYDB et al. deploy, add them to the registry and
   begin the real per-entry ingestion (figures/texts/events) — the portal field is already in place.
2. **mirror-warden:** a small ↗ marker on hand cards that carry a portal, so players know a source awaits.

## Grounding check

- All new cards carry `sourceRef` + a `portal` to a real site. No invented filler. URLs verified
  against `wiki/index.html`.
