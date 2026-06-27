# Game Modes — Collaborative styles & customized interaction prompts

A **game mode** reframes the same board (beads · glyphs · adjacency relations) as a different
*collaboration* or *conversation style*. A mode does three things:

1. sets **how many moves** each collaborator gets (the move budget — a sonnet's 14, a novel's 30…);
2. names the **verb** of a move (*draft a scene*, *set a line*, *land a barb*, *take a hit & riff*);
3. supplies the system's **customized interaction prompts** — when two beads sit adjacent, the system
   speaks *in the mode's voice*, asking a mode-appropriate question about their synthesis.

Modes subdivide by **genre** — a second axis that refines the prompts (Novel → Science Fiction;
Bong Session → Philosophical; Video Game → Roguelike). A genre supplies its own prompt set that
overrides the mode's base prompts; "General" keeps the mode's own voice.

This is distinct from [BOARD_MODES](BOARD_MODES.md) (divinatory *layouts*). Game modes keep the Free
Grid and change the **register of the prompting**. Data + prompt engine: `src/game/modes.ts`
(pure, tested); UI: a mode picker + genre chips at setup, a mode bar (mode · genre · moves left), and
the prompt under the readout.

## The example modes (shipped)

| Mode | Collaboration | Moves | A move is… |
|---|---|---|---|
| **The Magister's Game** | contemplative synthesis (the classic Game) | 12 | place a bead |
| **Historical Novel** | collaborative long-form fiction | 30 | draft a scene |
| **Short Story** | single-arc fiction | 12 | add a beat |
| **Poem** | lyric composition | 14 | set a line |
| **Painting** | visual composition | 16 | lay a passage |
| **Biography** | a life rendered | 20 | set down a fact |
| **Scholarly Research Article** | academic argument | 18 | advance the argument |
| **Withering Film Critique** | caustic criticism | 10 | land a barb |
| **Dorm-Room Bong-Hit Bull Session** | free-associative riffing | 8 | take a hit & riff |
| **Video Game** | collaborative game design | 16 | design a system |

Each mode carries an **invocation** (its opening voice) and a set of **prompt templates** with slots
`{a}`, `{b}` (the two beads' names) and `{op}` (the relation). `composeModePrompt(modeId, a, b, op,
genreId?)` fills a template, chosen by a stable hash of the pairing (same pairing+genre → same prompt).

## Genres (a few per mode)

| Mode | Example genres |
|---|---|
| The Magister's Game | Counterpoint of Opposites · The Fugue · The Ascent · Maybe Logic |
| The Novel | Historical · Science Fiction · Gothic · Hardboiled Noir · Magical Realism |
| Short Story | Literary · Horror · Fable · Flash Fiction |
| Poem | Sonnet · Haiku · Beat/Howl · Hymn/Psalm |
| Painting | Renaissance Allegory · Surrealism · Abstract · Symbolist |
| Biography | Hagiography · Tell-All · Intellectual Biography · Tragic Arc |
| Scholarly Article | Analytic Philosophy · Critical Theory · History of Science · Close Reading |
| Withering Film Critique | Auteurist · Ideological · Camp · Formalist |
| Bong Session | Philosophical · Conspiracy · Cosmic/Psychedelic · Pop-Culture Deep Dive |
| Video Game | Roguelike · Visual Novel · Open-World RPG · Soulslike · Puzzle Box |

Each genre carries its own prompt copy. Example — *The Green Lion* beside *Maybe Logic* under
**Video Game → Roguelike**: "Make The Green Lion a procedurally-placed reward and Maybe Logic the
risk that guards it. Is the gamble fair?" Add a genre by appending to a mode's `genres` array.

## How the customized prompt is handled

When the inspected bead has an orthogonal neighbour, the system composes the mode's prompt for that
pairing and shows it (e.g. for *The Glass Bead* beside *The Emerald Tablet*):

- **Magister:** "Meditate on The Glass Bead and The Emerald Tablet: in what hidden counterpoint do
  they answer one another?"
- **Historical Novel:** "A scene: The Glass Bead encounters The Emerald Tablet. Whose desire drives
  it, and what stands in the way?"
- **Film Critique:** "…a 'bold choice,' or the laziest beat in the picture? Defend the knife."
- **Bong Session:** "Whoa — what if The Glass Bead and The Emerald Tablet are, like, the *same
  thing*? Run with it."

The prompt is the *invitation to explore the interaction* the user asked for: each collaborator spends
their move budget adding beads or exploring these prompted interactions, in the mode's register.

## Grounding & extension

The Magister mode stays in the Hesse contemplative register; the others are clearly-labelled
collaborative forms. Adding a mode is one entry in `MODES` (name, kind, moveVerb, movesPerPlayer,
invocation, voice, prompts). A future step: let a mode also bias scoring, the deck (a "poem" mode
favouring the musical/symbol sets), or the board size.

*Coordination note:* the mode data + prompt engine + tests are committed; the App wiring (mode picker,
move budget, prompt display) lives in the shared `App.tsx` and rides the parallel online-phase commit.
