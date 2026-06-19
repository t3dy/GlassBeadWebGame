import { getCard, libraryCardIds } from './content';
import { LINKS } from '../data/dlc/links';

// CONNECTIONS — "draw a card connected to the one you just placed." Two sources, in priority order:
//   1. authored influence LINKS (teacher→pupil, source→text, translation, influence) — with a reason;
//   2. shared correspondences (same discipline/tradition/field/facet) — a softer thematic link.
// Pure (reads the content layer). Used by the UI to offer connected draws after a bead is placed.

export interface Connection { id: string; name: string; reason: string }

const SHARED_KEYS = ['discipline', 'tradition', 'field', 'facet', 'stage', 'operation'];

/** Cards connected to `cardId`, most-relevant first (authored links, then thematic), capped. */
export function connectedCards(cardId: string, limit = 8): Connection[] {
  const out: Connection[] = [];
  const seen = new Set<string>([cardId]);
  const push = (id: string, reason: string) => {
    if (seen.has(id)) return;
    const c = getCard(id);
    if (!c) return;
    seen.add(id);
    out.push({ id, name: c.name, reason });
  };

  // 1. authored links (bidirectional)
  for (const l of LINKS) {
    if (l.a === cardId) push(l.b, l.reason);
    else if (l.b === cardId) push(l.a, l.reason);
  }

  // 2. thematic links by shared correspondence value
  const self = getCard(cardId);
  if (self) {
    const mine = new Map<string, string>(); // value(lower) -> key
    for (const k of SHARED_KEYS) {
      const v = self.correspondences[k];
      if (typeof v === 'string') mine.set(v.toLowerCase(), k);
    }
    if (mine.size) {
      for (const id of libraryCardIds()) {
        if (out.length >= limit) break;
        if (seen.has(id)) continue;
        const c = getCard(id);
        if (!c) continue;
        for (const k of SHARED_KEYS) {
          const v = c.correspondences[k];
          if (typeof v === 'string' && mine.has(v.toLowerCase())) {
            push(id, `Shares ${mine.get(v.toLowerCase())}: ${v}.`);
            break;
          }
        }
      }
    }
  }

  return out.slice(0, limit);
}
