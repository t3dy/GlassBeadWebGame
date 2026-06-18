# Aesthetic — The "Green Stone" Visual System

Owned by **mirror-warden**. The look serves the philosophy: a contemplative, living surface whose
state *is* visible in its form. Implemented with Tailwind (tokens below as CSS variables) and
Framer Motion (lifecycle + milestone animation). Honor `prefers-reduced-motion` everywhere.

## Palette

| Token | Value | Use |
|---|---|---|
| `--stone-green` | `#228B22` | Primary containers ("Bright Green Stone") |
| `--brocade-gold` | `#FFD700` | High-level borders/headers ("Byzantine Gold Brocade", *The Dwarf*) |
| `--violet-robe` | `#9400D3` | Active / selected states ("Violet Robes", *Master of the Perfect Word*) |
| `--rosy-haze-a/b` | gradient | Background ("Rosy Haze") |
| `--brass` | polished warm | Healthy/active default surface (*The Dwarf*) |
| `--moss` / `--swamp` | desaturated green-brown | Decay overlay (*The City*) |

Define as CSS custom properties in `:root`; Tailwind reads them via theme `extend`. **Every skin
must keep WCAG AA contrast** (phase-6 gate).

## The three views (layout modes)

- **The Mountain** — vertical hierarchy for global navigation / directory of games (*The Beautiful
  Dream*'s "Mountain of Knowledge"). The information architecture.
- **The Palace** — isolated **Focus Mode** for deep work on one board (Haberland's solitary palace).
- **The Bamboo Hut** — minimalist, low-distraction view for pure composition (*The Poet / Han Fook*).

## The Mirror Gallery (skins = reality tunnels)

Skins are both **visual themes** and **scoring lenses** (circuit-6 mechanic, see
[MECHANICS](MECHANICS.md#reality-tunnels-skins-as-lenses--circuit-6)). Switching a skin re-themes
and re-scores the *same* triples — it never edits the graph.

- **RedHair** — vibrant / maximalist palette; rewards breadth.
- **WhiteHands** — delicate / refined; rewards depth & precision.
- **Dancer** — high-velocity / performance-tuned; rewards rhythmic resonance.

Implement as a `SkinProvider` (theme context) + a pluggable `scoreLens` — one switch flips both.

## The Living City lifecycle

A CSS/Framer animation system expressing Hesse's entropy/growth theme as honest feedback:

- **Default / active:** surfaces sit at **polished brass / stone-green bloom**.
- **Idle / stagnant:** after an idle threshold, a **moss → swamp** overlay creeps in (*The City*'s
  "laws of development and progress" as entropic decay). It recedes the moment play resumes.
- **Growth:** committing resonant triads makes the local board region "bloom" (saturation +
  subtle motion).
- Tie the lifecycle to real session state, not decoration — it is a built-in *memento* against
  mechanical, neglectful play (the Hesse/Ziolkowski warning).

## Occult diagrams (optional tools, not the core)

These are **opt-in tools a player may bring in** — *not* central UI. The core game (drawing cards to
infuse beads, applying glyphs from the glyph bank) works fully without them. Offer them as alternative
ways to browse glyphs or view progression, for players who want that frame:
- **Rose Cross Lamen** — an optional **glyph-bank selector**: the Golden Dawn lamen (Hebrew-letter
  petals, central rose, arm colors) as a beautiful way to pick glyphs. A plain glyph palette is the
  default; the lamen is an alternate skin of the same bank.
- **Tree of Life** — an optional **skill-tree view** (port CROWLEYDB `TreeOfLife.tsx`, fed by
  `thelemic_tree.json`) for players who adopt the Qabalistic overlay ([PROGRESSION](PROGRESSION.md#the-skill-tree)).
  The default skill-tree view is a plain branch tree.
- Both are React + SVG, Green-Stone-themed, keyboard-navigable + labeled. Build the **core glyph
  palette and branch-tree views first**; these diagrams are later, optional enhancements.

## Milestone animation

On a Tai Gi synthesis or circuit ascent: the **"glittering children with golden wings, flying in
pairs and circles"** (*Augustus*) sweep the board, and the new synthesis bead settles in gold.
Gate behind `prefers-reduced-motion` (fall back to a static gold bloom).

## Input — the Master's Lute & the Crucible

- **The Lute (input):** placing beads/tiles is a gesture of "stringing together" nodes (Han
  Fook's apprenticeship) into a "resonant output." Drag-to-connect or keyboard place-and-link.
- **The Crucible (merge workspace):** a drag-and-drop area to merge source context points into new
  shareable beads/"theorems" (Ziegler's vinegar/mortar/test-tubes as UI primitives).
- **The Night Sky (dashboard):** high-contrast dark global view of activity / the shared crystal.

## Tone & copy

All copy grounded (the *Magister Musicae* / *Magister Ludi* register): calm, formal, contemplative.
The public-game flourish — a "luminous golden stylus" inscribing a tablet projected "enlarged a
hundredfold" — is the model for the optional presentation/ceremony mode.
