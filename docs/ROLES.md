# Roles & Worker Placement

An **optional turn-structure layer**. A player places a **meeple** to take a **role** — *cleric,
alchemist, necromancer, philosopher, neoplatonist, printer, artisan, scholar, patron,* or a
**historical character** (a figure card) — and that role **colors and empowers the two core actions**
(infuse beads with cards / apply glyphs) for the turn. Roles are **limited spaces**: in competitive
multiplayer they're contested, creating the classic worker-placement tension. The core game works
without roles; this is a layer you turn on for strategic depth.

## How it fits the core (not a replacement)

A role never changes *what* the game is — you still infuse beads and apply glyphs
([GAME_LOOP](GAME_LOOP.md#the-two-core-actions-what-the-game-is)). A role changes *how*: it grants a
privileged action, a topic affinity, and which **Adventure-Starter** options surface. Roles are drawn
from our **concept and figure cards**, so the role list is **extensible from the corpus**
([CARD_CORPUS](CARD_CORPUS.md)) — not a fixed hardcode.

## Role abilities (starter set)

Each role = `{ primaryAction, topicAffinity, resource }`. Grounded in the portals/traditions.

| Role | Primary action (privileged) | Affinity / favors | Grounding |
|---|---|---|---|
| **Alchemist** | Operate **process tiles** (transformations) at reduced cost | the 12 operations; tria-prima stats | the alchemical portals |
| **Cleric** | **Consecrate** a bead (add divine-name/angel correspondence); clear decay | sephirah, god-names, angels | CROWLEYDB tree attributions |
| **Necromancer** | **Raise** a card from the discard; work **Putrefaction/nigredo** | Saturn, death, the discard | the nigredo stage |
| **Philosopher** | **Separation/analogy** moves; reveal a hidden correspondence | concept cards, analogy relations | Neoplatonism / scholastic portals |
| **Neoplatonist** | **Ascend** an emanation (advance a circuit / climb the tree) | the One, emanations, circuits | neoplatonism-portal |
| **Printer** | **Reproduce/Multiply** a card (copy to hand); "publish" a bead to the pool | multiplication; the press | Book-History pipelines; Hesse's projecting stylus |
| **Artisan** | **Craft** a glyph/sigil; build a diagram element | the glyph bank; kamea/lamen | the maker traditions |
| **Scholar** | **Research** — draw + topic XP; consult the archive | any topic (breadth) | the universal archive |
| **Patron** | **Fund** — pay to acquire a portal / extra draws for self or another | economy, portals | Renaissance patronage |
| **Historical character** | embody a **figure card** → that figure's signature ability | the figure's topics/works | `persons.json` etc. |
| **(other)** | derived from any concept/figure card at authoring time | per card | the corpus |

## Worker placement & contention

- Each player has 1+ **meeples**. On their turn (or in a placement phase each round) they place a
  meeple onto an open **role space** and take that role's action.
- **Limited spaces** (configurable): in competitive multiplayer a taken role may be **blocked** or
  cost more to follow into — the contention that makes worker placement strategic. In
  collaborative/solo, roles have **uses-per-round** or rotate.
- **Always-a-move preserved:** there is always an open generic role (a **Seeker/Wanderer** that just
  performs a plain core action) and **Pass** remains. Contested spaces never deadlock the loop
  ([GAME_LOOP](GAME_LOOP.md#the-always-a-move-invariant-no-deadlock)).

## Ties to the other systems

- **Progression:** a role grants bonus **topic XP** in its affinity; advanced roles can be **gated**
  by the skill tree / circuit, and **historical-character** roles unlock by acquiring that figure's
  portal ([PROGRESSION](PROGRESSION.md)). Roles are an expression of mastery, not a requirement.
- **Draft & goals:** drafting **deep** into a portal pairs naturally with its role; private goals may
  reward acting in a given role ([DRAFT_AND_GOALS](DRAFT_AND_GOALS.md)).
- **Correspondence engine / starters:** the active role biases which **Adventure-Starter** options
  appear (the Necromancer surfaces putrefaction branches; the Cleric, consecration branches).
- **Board modes:** roles compose with modes — a role is *how you operate* within a Tarot spread,
  geomancy chart, etc. ([BOARD_MODES](BOARD_MODES.md)).

## Data shapes (see [DATA_MODEL](DATA_MODEL.md))

```ts
interface Role {
  id: string; name: string; source?: { portal: string; entryId: string };  // concept/figure-derived
  primaryAction: string; topicAffinity: string[]; resource?: Effect[];
  gatedBy?: { circuit?: number; node?: string; portal?: string };
  sourceRef: string;
}
interface Worker { playerId: string; roleId?: string; cell?: string }       // a placed meeple
// Game gains: roleSpaces: { roleId: string; takenBy?: string; cost: number }[]
```
Placement, contention, and role actions are **pure reductions** over moves (deterministic, testable);
taking a role is a move that never blocks the board. **Optional layer** — togglable per game.

## Ownership
- **crucible-engineer** — worker-placement state machine, contention rules, role actions as reductions.
- **bead-smith / narrative-designer** — derive roles from concept/figure cards; ground each role's
  ability + flavor; author role-biased starter options.
- **mirror-warden** — the meeple/role-board UI; role spaces, contention affordances, accessibility.
