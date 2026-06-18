# Progression — Character Sheet, Topic XP, Portals & the Skill Tree

The RPG meta-layer over the [game loop](GAME_LOOP.md). As players play with symbols they **earn
experience in the topics they touch**, recorded on a **character sheet**. XP yields **skill points**;
points develop a **skill tree**; tree nodes (and acquired **portals**) **expand the options** the
correspondence engine offers — *which interactions between symbols you may explore next*. Progression
**persists across games** (meta-progression), per player.

## Two progression axes (they complement, not duplicate)

| Axis | What it measures | Advanced by | Gates |
|---|---|---|---|
| **Circuits 1–8** (Leary) | *Depth* of synthesis — the art of the Game itself | circuit-appropriate resonance ([MECHANICS](MECHANICS.md#the-eight-circuits)) | universal mechanics: which processes, the Tai Gi win-state |
| **Skill tree** (topic mastery) | *Breadth* — which symbolic languages/portals you command | **topic XP → skill points**, spent on nodes | domain options & special moves in story prompts |

Grounding: the **default** initiation ranks read in Castalia's idiom (student → … → *Magister Ludi*).
Players may *optionally* swap in a sourced rank set — e.g. the **A∴A∴ grades** (`grades.json`:
Neophyte/Malkuth → Zelator/Yesod → …) for the Tree-of-Life overlay, or the alchemical
Apprentice→Magus ladder — but no occult rank scheme is imposed by the core.

## The character sheet

```ts
interface CharacterSheet {
  playerId: string;
  ranks: { circuit: number; initiation: string };      // Leary circuit + Castalia/alchemical rank
  topicXp: Record<string, number>;                      // topic id → XP (see "Topics" below)
  skillPoints: number;                                  // unspent
  unlockedNodes: string[];                              // skill-tree node ids
  portals: string[];                                    // acquired knowledge-portal packs (inventory)
  titles?: string[];                                    // earned honorifics (grounded)
}
```

Persisted via `DataStore` ([DATA_MODEL](DATA_MODEL.md)) — localStorage locally, a `characters` row
online. Hot-seat = one sheet per seat; online = one per account.

## Topics & XP

A **topic** is a domain you can gain mastery in. Topics come from two layers:
- **Portals/packs** — CROWLEYDB, MedievalMagicDB, Neoplatonism, … ([CARD_CORPUS](CARD_CORPUS.md)).
- **Great-table axes** — the correspondence axes (the seven planets, four elements, twelve signs, the
  ten sephiroth, the alchemical processes).

**Earning XP** (every move tags the topics of the symbols/cards/correspondences involved):
- play a card → XP in its portal + its correspondence topics;
- a **cross-discipline leap** (interdisciplinary distance) → bonus XP in *both* topics;
- **first discovery** of a correspondence interaction → bonus XP;
- **resolve an opposition / complete a Tai Gi** → large XP in the reconciled topics;
- complete a **magnum-opus stage** → XP across the session's topics.

**Topic XP → skill points:** crossing a topic's level threshold grants **1 skill point** (and may
raise the initiation rank). Points are a single spendable pool.

## Depth vs. breadth (the draft tension)

Topic mastery is shaped by how players **draft** ([DRAFT_AND_GOALS](DRAFT_AND_GOALS.md)): drafting
**deep** into one portal accrues concentrated topic XP and skill-tree depth (coherent deck, strong
affinity) at the cost of a narrow palette; drafting **wide** spreads XP thin but unlocks the
cross-discipline leaps the score prizes. The board conditions which pays off — so progression is
strategic, not a fixed grind. **Private goals** then give targeted *reasons* to develop specific
topics/correspondences.

## Portals as inventory (acquisition modes)

Acquiring a portal **adds it to inventory**, opens its **skill-tree branch**, and lets its cards into
your draw options. Portals are chosen *in play*, via several **modes** (the "situations" that come
up):
- **Attunement choice** — a story prompt offers "Attune to the *[Portal]* of this bead" → claim it.
- **Tai Gi spoils** — reconciling two beads lets you claim the portal of one of them.
- **Quest reward** — completing a prompt chain grants a themed portal.
- **Opening draft** — pick a starting portal (or two) at session/character creation.

## The skill tree

**Topology (default = neutral; occult trees are *optional* overlays).** The core skill tree is a
plain **per-portal / per-topic branch tree** — acquire a portal → open its branch → spend points on
its nodes. No occult diagram is required to play or progress.

*Optional overlay:* a player who wants it may switch the skill-tree **view** to the **Tree of Life**
(reusing CROWLEYDB's `thelemic_tree.json` + `TreeOfLife.tsx` — sephiroth nodes, 22 paths with
letter/astro/tarot/color attributions) and adopt the **A∴A∴ grades** (`grades.json`) as their rank
labels. This is an opt-in lens for players drawn to the Qabalistic frame — one of several possible
overlays, surfaced via the optional [occult diagrams](AESTHETIC.md#occult-diagrams). The underlying
node/point/unlock data is the same; only the *presentation* changes.

**What nodes do — they expand options (the consequence the player feels):**
- **Unlock a process tile** (e.g. gain `alch:sublimates`) → new legal moves.
- **Reveal hidden correspondences** on beads → see interactions you couldn't before.
- **Widen the choice menu** — the correspondence engine offers *+1 story choice* in your topics.
- **Cross-portal moves** — operate between beads from two different portals (advanced synthesis).
- **Economy** — draw/tutor bonuses, lower the cost of bold (opposition) moves.
- **Lens mastery** — unlock a reality-tunnel skin as a re-scoring lens.

So the chain the player experiences:
> **play topics → topic XP → skill points → spend on tree nodes → richer choices when deciding which
> symbol-interaction to explore next.** Progression literally *opens the next move*.

## Engine contract (for crucible-engineer)

- `legalMoves(state, sheet)` and the correspondence engine's **choice generator** both read the
  active player's `unlockedNodes` + `portals` — more unlocks ⇒ more (never fewer) options. The
  **always-a-move/Pass** floor is unchanged ([GAME_LOOP](GAME_LOOP.md#the-always-a-move-invariant-no-deadlock)).
- XP/skill-point/rank changes are pure reductions over applied moves (testable, deterministic).
- Spending points is itself a (non-board) move resolved on the character sheet; never blocks the loop.
- **narrative-designer** authors each node's *story consequence* (the grounded prompt/option it adds);
  **bead-smith** maps portals→topics and topics→correspondence axes.
