import type { Bead, CellId, GameState } from './types';
import { getCard, getGlyph } from './content';

// PROGRAMMATIC RELATIONS — the system reads the attributes of two adjacent beads and surfaces a
// grounded relationship between them (e.g. a Venus bead beside a Jupiter bead → what Ficino said
// about the benefics against melancholy). Authored, data-driven, cited — no runtime hallucination.
// Extend RELATION_CORPUS to grow the game; this is the seam the portal-ingestion pipeline fills.

export interface RelationEntry {
  id: string;
  a: string; // an attribute value on one bead
  b: string; // an attribute value on the other bead
  title: string;
  text: string;
  points: number;
  sourceRef: string;
  portal?: string;
}

export const RELATION_CORPUS: RelationEntry[] = [
  { id: 'venus-jupiter', a: 'Venus', b: 'Jupiter', title: 'The Benefics against Melancholy',
    text: 'Ficino counsels the melancholic scholar to draw down the concord of Venus and Jupiter — the two benefics — to temper the cold weight of Saturn.',
    points: 3, sourceRef: 'Ficino, De Vita Coelitus Comparanda (Three Books on Life, III)', portal: 'rmdb' },
  { id: 'sun-jupiter', a: 'Sun', b: 'Jupiter', title: 'Solar-Jovial Vitality',
    text: 'The Sun and Jupiter in concord pour out life and fortune; Ficino prescribes their gold and tin to strengthen the spirits.',
    points: 3, sourceRef: 'Ficino, De Vita, III', portal: 'rmdb' },
  { id: 'sun-saturn', a: 'Sun', b: 'Saturn', title: 'Lead into Gold',
    text: 'The extremes of the work: Saturn’s lead, basest of metals, is the very matter that holds the most gold in potential. You cannot transmute gold — only lead.',
    points: 3, sourceRef: 'alchemical tradition' },
  { id: 'sun-moon', a: 'Sun', b: 'Moon', title: 'The Chymical Wedding',
    text: 'Sol and Luna conjoined — the coniunctio of the masculine and feminine principles into the Rebis, the hermaphrodite.',
    points: 4, sourceRef: 'alchemical tradition', portal: 'hermeticdb' },
  { id: 'sulphur-mercury', a: 'Sulphur', b: 'Mercury', title: 'The Alchemical Parents',
    text: 'Sulphur (the soul) and Mercury (the spirit) are the father and mother of every metal; their union begets the Stone.',
    points: 3, sourceRef: 'Paracelsian tria prima', portal: 'hermeticdb' },
  { id: 'mars-venus', a: 'Mars', b: 'Venus', title: 'Discord and Concord',
    text: 'Mars and Venus — strife wedded to love. The myth of the lovers caught in Vulcan’s net; iron and copper temper one another.',
    points: 2, sourceRef: 'classical myth / planetary lore' },
  { id: 'saturn-moon', a: 'Saturn', b: 'Moon', title: 'The Saturnine Nocturne',
    text: 'Saturn (cold and dry) beside the Moon (cold and moist) doubles the melancholic humour — the deep night of the work.',
    points: 2, sourceRef: 'humoral / astrological lore', portal: 'rmdb' },
  { id: 'fire-water', a: 'Fire', b: 'Water', title: 'The War of Contraries',
    text: 'Fire and Water, hot-dry against cold-moist — the contraries whose strife yields steam, and whose reconciliation is the philosopher’s art.',
    points: 2, sourceRef: 'classical elements' },
  { id: 'air-earth', a: 'Air', b: 'Earth', title: 'The Other Contraries',
    text: 'Air and Earth, the light and the heavy, the volatile and the fixed — opposed qualities seeking a mean.',
    points: 2, sourceRef: 'classical elements' },
  { id: 'saturn-calcination', a: 'Saturn', b: 'Calcination', title: 'The Saturnine Fire',
    text: 'Under Saturn’s sign the matter is calcined and blackened — reduction and the nigredo are the same dark threshold.',
    points: 2, sourceRef: 'alchemical tradition' },
  { id: 'sun-fire', a: 'Sun', b: 'Fire', title: 'The Solar Fire',
    text: 'The Sun’s gold and the element Fire share one nature — the radiant heat that perfects and purifies.',
    points: 1, sourceRef: 'alchemical tradition' },
  { id: 'moon-water', a: 'Moon', b: 'Water', title: 'The Lunar Tides',
    text: 'The Moon governs Water — silver, the tides, and the reflective solvent of the albedo.',
    points: 1, sourceRef: 'alchemical tradition' },
];

const OPPOSITES: Array<[string, string]> = [
  ['Fire', 'Water'], ['Air', 'Earth'], ['Sun', 'Moon'], ['Sun', 'Saturn'], ['sol', 'luna'], ['Sulphur', 'Salt'],
];

/** All attribute VALUES a bead carries (from its card + applied glyphs). */
export function attributesOf(bead: Bead): Set<string> {
  const out = new Set<string>();
  const add = (rec?: Record<string, string>) => { if (rec) for (const v of Object.values(rec)) out.add(v); };
  if (bead.cardId) add(getCard(bead.cardId)?.correspondences);
  for (const gid of bead.glyphIds) add(getGlyph(gid)?.correspondences);
  return out;
}

export interface Relation {
  id: string;
  cells: [CellId, CellId];
  title: string;
  text: string;
  points: number;
  sourceRef: string;
  portal?: string;
  kind: 'corpus' | 'affinity' | 'opposition';
}

const cellKey = (a: CellId, b: CellId) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/** Compute every relation currently realized between orthogonally-adjacent beads on the board. */
export function computeRelations(state: GameState): Relation[] {
  const out: Relation[] = [];
  const seenAffinity = new Set<string>();
  const cells = Object.keys(state.beads);
  for (const cell of cells) {
    const [r, c] = cell.split(',').map(Number);
    for (const [nr, nc] of [[r, c + 1], [r + 1, c]] as Array<[number, number]>) {
      const ncell = `${nr},${nc}`;
      if (!state.beads[ncell]) continue;
      const A = attributesOf(state.beads[cell]);
      const B = attributesOf(state.beads[ncell]);
      const pairKey = cellKey(cell, ncell);
      let scoredThisPair = false;
      // grounded corpus matches
      for (const e of RELATION_CORPUS) {
        if ((A.has(e.a) && B.has(e.b)) || (A.has(e.b) && B.has(e.a))) {
          out.push({ id: `${pairKey}#${e.id}`, cells: [cell, ncell], title: e.title, text: e.text, points: e.points, sourceRef: e.sourceRef, portal: e.portal, kind: 'corpus' });
          scoredThisPair = true;
        }
      }
      // generic opposition (counterpoint)
      for (const [x, y] of OPPOSITES) {
        if ((A.has(x) && B.has(y)) || (A.has(y) && B.has(x))) {
          out.push({ id: `${pairKey}#opp:${x}-${y}`, cells: [cell, ncell], title: 'Counterpoint of Opposites', text: `${x} set against ${y} — opposites held in tension, the seed of synthesis.`, points: 2, sourceRef: 'the reconciliation of opposites', kind: 'opposition' });
          scoredThisPair = true;
        }
      }
      // generic affinity (shared attribute) — only if nothing richer fired
      if (!scoredThisPair) {
        for (const v of A) {
          if (B.has(v) && !seenAffinity.has(pairKey)) {
            out.push({ id: `${pairKey}#aff:${v}`, cells: [cell, ncell], title: 'Resonance', text: `Both beads share ${v} — a quiet resonance.`, points: 1, sourceRef: 'sympathetic correspondence', kind: 'affinity' });
            seenAffinity.add(pairKey);
            break;
          }
        }
      }
    }
  }
  return out;
}
