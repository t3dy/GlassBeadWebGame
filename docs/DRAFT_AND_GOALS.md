# Draft Phases & Private Goals

Two systems that give the turn loop **strategic shape** and **personal direction**:
- **Draft phases** — players build their deck by drafting from a portal of their choice, with
  depth-vs-breadth consequences conditioned on the board.
- **Private goals** — discovered, hidden objectives that reward placing certain glyphs/correspondences,
  giving players *reasons* to steer which symbol-interactions they explore.

Both sit on the [game loop](GAME_LOOP.md) and feed [progression](PROGRESSION.md); neither breaks the
**always-a-move/Pass** floor.

## Draft phases

Play interleaves **draft phases** with **play turns**: at session start and at milestones (circuit-up,
magnum-opus stage, certain story choices), play pauses and each player **drafts cards** into their
deck/hand from a **knowledge portal of their choice** ([CARD_CORPUS](CARD_CORPUS.md)).

**Draft modes (a strategic choice):**
- **Deep draft** — commit to *one* portal, take several of its cards. Rewards **topic XP** and
  skill-tree depth ([PROGRESSION](PROGRESSION.md)), yields a coherent deck and strong same-topic
  affinities — *but* a narrower correspondence palette (fewer of the cross-discipline leaps the score
  prizes).
- **Wide draft** — spread picks across portals. Broad palette → more interdisciplinary-distance and
  more Adventure-Starter variety — *but* thinner per-topic mastery and weaker affinity resonance.
- **Open draft** — take from a neutral shared pool (the always-available, low-commitment option).

**Board conditions change the consequences** (the depth/breadth payoff is not fixed):
- A board **saturated in one topic** (e.g. mostly Fire) makes *drafting its opposite* attractive
  (Coagulation/balance scoring, decay relief) while *doubling down* compounds resonance but risks the
  **Living City decay** overlay ([AESTHETIC](AESTHETIC.md#the-living-city-lifecycle)).
- Open **oppositions** on the board reward drafting cards that can **reconcile** them (Tai Gi).
- The draft **offers + reward weights are computed from board state**, so "go deep vs. cast wide" is a
  live read, not a rote choice.

**Floor preserved:** a draft phase always includes **take any / skip** — it can't stall the game.

## Private goals

Each player holds **private goals** — hidden objectives that reward arranging the board a certain way.
They are the player's personal *Seelenbiografie* / "quest for the perfect word": a private thread of
meaning inside the shared crystal (grounded in Hesse's defense of the individual path).

- **Discovery:** goals are *discovered* through play (revealed by story prompts, drawn at draft, or
  granted on circuit-up) — not all dealt up front. Discovery itself is a story beat.
- **Condition:** a goal targets **glyphs/correspondences in relation**, e.g. "place a **Sol** bead in
  **Conjunction** with a **Luna** bead," "form a triad wholly within the **Saturn** topic," "reconcile
  two opposites drawn from **different portals**." This is what *gives the player reasons* to choose
  particular symbol-interactions as their next move — directly steering the
  [correspondence engine](GAME_LOOP.md#the-correspondence-engine-symbols-playing-off-each-other).
- **Reward on completion:** XP/skill points, draws, a minted bead, or a *new* goal (chaining). Goals
  are tiered (minor / major), and goals aligned to the player's **acquired portals** surface more
  often (personalization).
- **Secrecy & mode:** private by default — hot-seat hides them on the pass-device interstitial; online
  keeps them RLS-private. They add quiet **Player-vs-Player** tension in competitive play and personal
  **direction** in collaborative play (your own motif within the joint composition).

**Floor preserved:** goals are *motivation*, never *obligation* — ignoring all goals and playing
freely (or Passing) is always legal.

## Data shapes (see [DATA_MODEL](DATA_MODEL.md))

```ts
interface Goal {
  id: string; text: string; secret: boolean; tier: 'minor'|'major';
  condition: GoalCondition;        // a board pattern over glyphs/correspondences/relations
  reward: Effect[]; sourceRef: string;
}
type GoalCondition =
  | { kind: 'placeRelation'; a: AxisRef; op: string; b: AxisRef }   // Sol –Conjunction→ Luna
  | { kind: 'topicTriad'; topic: string }                           // a triad within one topic
  | { kind: 'reconcileAcrossPortals'; portals?: [string, string] }  // Tai Gi across portals
  | { kind: 'collectCorrespondence'; axis: string; pole: string; count: number };
interface DraftState {
  mode: 'deep'|'wide'|'open'; portal?: string;
  offers: string[][]; picksRemaining: number;     // board-conditioned offers
}
```
`PlayerState.goals: string[]` (held, private). Goal evaluation + draft offers are **pure reductions**
over board state (deterministic, testable); the engine checks goals after each move and fires rewards.

## Ownership

- **crucible-engineer** — draft-phase state machine, board-conditioned offer/reward weighting, goal
  evaluation, all as pure reductions; preserve the Pass/skip floor + a property test.
- **narrative-designer** — authors the goal library (grounded text + conditions) and the depth/breadth
  *story* framing; ties goals to portals.
- **bead-smith** — the correspondence axes/poles goals reference, and portal→topic maps.
