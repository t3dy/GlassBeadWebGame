import type { Bead } from './types';
import { CARDS } from '../data/seedDeck';
import { GLYPHS } from './glyphBank';

// Minimal but real triad scoring — the first taste of the correspondence engine. The full engine
// (signatures → Adventure Starters, circuits, maybe-weight) is BRACKETED; see docs/MECHANICS.md.

export interface TriadScore {
  points: number;
  labels: string[];
}

// Opposed correspondence values (within an axis) — reconciling these is the prized "counterpoint".
const OPPOSITES: Array<[string, string]> = [
  ['Fire', 'Water'],
  ['Air', 'Earth'],
  ['Sun', 'Moon'],
  ['Sun', 'Saturn'],
  ['sol', 'luna'],
  ['Sulphur', 'Salt'],
];

/** Collect a bead's correspondence values (from its card + applied glyphs) into a flat set. */
function values(bead: Bead): Set<string> {
  const out = new Set<string>();
  const add = (rec?: Record<string, string>) => {
    if (rec) for (const v of Object.values(rec)) out.add(v);
  };
  if (bead.cardId) add(CARDS[bead.cardId]?.correspondences);
  for (const gid of bead.glyphIds) add(GLYPHS[gid]?.correspondences);
  return out;
}

/** Domain-ish tags used to detect an interdisciplinary leap. */
function domains(bead: Bead): Set<string> {
  const out = new Set<string>();
  const keys = ['discipline', 'domain', 'stage', 'archetype', 'technique', 'tale', 'stance'];
  const rec = bead.cardId ? CARDS[bead.cardId]?.correspondences : undefined;
  if (rec) for (const k of keys) if (rec[k]) out.add(rec[k]);
  return out;
}

export function scoreTriad(a: Bead, b: Bead): TriadScore {
  const labels: string[] = [];
  let points = 1; // coherence — a valid statement
  labels.push('coherence +1');

  // Interdisciplinary distance — connecting different fields is the heart of the Game.
  const da = domains(a);
  const db = domains(b);
  const disjoint = [...da].every((x) => !db.has(x)) && da.size > 0 && db.size > 0;
  if (disjoint) {
    points += 2;
    labels.push('interdisciplinary +2');
  }

  // Counterpoint — reconciling opposites.
  const va = values(a);
  const vb = values(b);
  for (const [x, y] of OPPOSITES) {
    if ((va.has(x) && vb.has(y)) || (va.has(y) && vb.has(x))) {
      points += 3;
      labels.push('counterpoint +3');
      break;
    }
  }

  // Resonance — a richly-charged pairing (many glyphs across both beads).
  const glyphCount = a.glyphIds.length + b.glyphIds.length;
  if (glyphCount >= 4) {
    points += 1;
    labels.push('resonance +1');
  }

  return { points, labels };
}
