# Corpus Index — `E:\pdf\Game Design`

A map of the game-design reference library so the **narrative-designer** (and any agent) can find
the right text without re-scanning ~30 books. Each title is already converted to per-chapter
Markdown under `E:\pdf\Game Design\Markdown\<Book Title>\NN - Chapter ….md` (the `.py` converter
and a `.pyc` live in the same root). **Reference only — never shipped as player content**
([NARRATIVE_DESIGN](NARRATIVE_DESIGN.md#two-corpora-do-not-conflate)). Cite as *(author, ch.N)*.

## Tier 1 — Narrative, theme, meaning *(highest relevance)*

| Book | Use for |
|---|---|
| **Sarah Shipp — Thematic Integration in Board Game Design** | The core lens. Knitted vs. layered theme (ch.2), motivated elements, five degrees of thematic action (ch.2), conflict=plot (ch.4), narrative structure (ch.5), editing for **resonance** (ch.11). Our primary audit framework. |
| **Tom Smith — Anatomy of Game Design** | Player **verbs** (ch.2), dynamics (ch.4), **systems** (ch.6), **content** via MTG (ch.7), **meaning** via Papers Please (ch.9). Verbs = our storytelling tools. |
| **Yvens Serpa — The Cores of Game Design (Mechanics/Economics/Narrative/Aesthetics)** | Story (ch.12), **moral choices** (ch.13), UI/UX (ch.16), aesthetics (ch.15). MDA-style cores. |
| **Ethan Ham — Learning Video Game Design on the Tabletop** | **Choices** (ch.4), **Stories** (ch.5), structure (ch.7), economies (ch.10). |
| **Julialicia Case et al — Story Mode: …Narrative Video Game Design** | Creative-writer's craft for game narrative; environmental/embedded story. |
| **merritt kopas — Videogames for Humans (Twine)** | Expressive, personal, non-plot storytelling — close to our "authored synthesis" model. |
| **Devon Allcoat & Chris Evans — Meaningful Game Design (psychology of tabletop)** | Why mechanics feel meaningful; player psychology. |

## Tier 2 — Systems, components, symbols, heritage

| Book | Use for |
|---|---|
| **Tracy Fullerton — Game Design Workshop** | Formal & dramatic elements; playtesting; the playcentric loop. |
| **Scott Rogers — Your Turn (tabletop)** | Practical tabletop systems, rules writing, components. |
| **Joshua Bycer — Game Design Deep Dive: Trading/Collectible Card Games** | **Designing cards** (ch.6) — symbol-on-token legibility, keyword grammar (relevant to bead/tile design). |
| **Foreword Volko Ruhnke — Paper Time Machines: Critical & Historical Board Games** | "Playing with cultural heritage"; representing ideas/history in systems — kin to Hesse's premise. |
| **Glenn Ford & Mike Hutchinson — Fundamentals of Tabletop Miniatures Game Design** | Systems balance; spatial play. |

## Tier 3 — Implementation, PCG, engines *(lower relevance to our React stack)*

| Book | Use for |
|---|---|
| **Noor Shaker et al — Procedural Content Generation in Games** | Generating seed prompts / bead-pairs for the "Quest for the Perfect Word" scaffold. |
| **Ryan Watkins — PCG for Unity** | PCG patterns (engine-agnostic ideas only). |
| **Andre Garzia — Roguelike Development with JavaScript** | JS patterns; closest stack match. |
| **Anna Anthropy — Make Your Own Twine Games**; **Brian Mayer — Create Interactive Stories in Twine**; **Robert Ciesla — Ren'Py/TyranoBuilder/Twine** | Hypertext/VN narrative tooling (for the Tome/lore layer). |
| Alexia Mandeville (For Dummies), Andy Sandham (Teaching), Mohov (Unity/Playmaker), Perez (RPG Maker MV), Tyers (GameMaker RPGs), Goldstone (Unity Essentials), Jim Adams (DirectX RPG), Publishing Punky (Beginner's guide), Nathan Daniels (RTOR) | General/engine-specific; consult only for targeted technique. |

## How to query the corpus

- Find a topic: `Grep` the `Markdown/` tree (e.g. pattern `theme|resonance|verb|choice`).
- Read a chapter: open the specific `NN - Chapter ….md` (each notes its source PDF + page range).
- Prefer Tier 1 for any narrative/theme question; cite the chapter in the design doc you update.
