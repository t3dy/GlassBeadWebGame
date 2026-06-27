import { describe, it, expect } from 'vitest';
import { registerDlc } from '../../engine/content';
import { connectedCards } from '../../engine/connections';
import { ALL_DLC_PACKS } from './index';
import { PATRON_PACKS } from './patrons';
import { LINKS } from './links';

// The Patrons DLC — assets translated from docs/research/MEDIEVAL_RENAISSANCE_PATRONAGE_SOURCEBOOK.md.
// We test the pack's shape, its grounding (Golden Rule), and that patrons join the "draw connected"
// web — both to the figures/places they funded (cross-pack) and to one another (dynastic networks).

describe('Patrons DLC pack', () => {
  const cards = PATRON_PACKS.flatMap((p) => p.cards);

  it('ships five named packs', () => {
    expect(PATRON_PACKS).toHaveLength(5);
    expect(PATRON_PACKS.map((p) => p.id)).toEqual(
      expect.arrayContaining(['patron:women', 'patron:astronomy', 'patron:manuscript', 'patron:alchemy', 'patron:magnificence']),
    );
  });

  it('covers the full roster as figure cards (≈30 unique)', () => {
    const unique = new Set(cards.map((c) => c.id));
    expect(unique.size).toBeGreaterThanOrEqual(28);
    expect(cards.every((c) => c.cls === 'figure')).toBe(true);
    expect(cards.every((c) => c.id.startsWith('patron:'))).toBe(true);
  });

  it('every card is grounded — a sourceRef and ≥1 glyph (Golden Rule)', () => {
    for (const c of cards) {
      expect(c.sourceRef.length).toBeGreaterThan(0);
      expect(c.glyphs.length).toBeGreaterThan(0);
      expect(c.glyphs.length).toBeLessThanOrEqual(3); // sourcebook caps glyphs at 3
    }
  });

  it('recurring patrons keep a stable id across packs (same const, e.g. Rudolf II)', () => {
    const inAstronomy = ASTRONOMY_HAS('patron:rudolf-ii');
    const inAlchemy = ALCHEMY_HAS('patron:rudolf-ii');
    expect(inAstronomy && inAlchemy).toBe(true);
  });

  it('patrons join the connected-draw web — to whom they funded (cross-pack)', () => {
    registerDlc(ALL_DLC_PACKS);
    // Rudolf II → Michael Maier, his court physician (cross-pack: patron → ema alchemist)
    const rudolf = connectedCards('patron:rudolf-ii');
    expect(rudolf.some((c) => c.id === 'ema:maier')).toBe(true);
    // Cosimo de' Medici → Ficino, whom he set to translate Plato (cross-pack: patron → sm figure)
    const cosimo = connectedCards('patron:cosimo-de-medici');
    expect(cosimo.some((c) => c.id === 'sm:ficino')).toBe(true);
  });

  it('patrons link to one another by dynasty / household (intra-pack)', () => {
    registerDlc(ALL_DLC_PACKS);
    const shahRukh = connectedCards('patron:shah-rukh');
    // father → sons (Baysunghur, Ulugh Beg) and queen (Gawhar Shad)
    expect(shahRukh.some((c) => c.id === 'patron:baysunghur')).toBe(true);
    expect(shahRukh.some((c) => c.id === 'patron:ulugh-beg')).toBe(true);
    expect(shahRukh.some((c) => c.id === 'patron:gawhar-shad')).toBe(true);
  });

  it('every authored patron link points at a real card', () => {
    const ids = new Set(ALL_DLC_PACKS.flatMap((p) => p.cards.map((c) => c.id)));
    const patronLinks = LINKS.filter((l) => l.a.startsWith('patron:') || l.b.startsWith('patron:'));
    expect(patronLinks.length).toBeGreaterThan(15);
    for (const l of patronLinks) {
      // both endpoints exist somewhere in the registered library (base seed ids are allowed too,
      // but every patron link here targets a DLC card)
      expect(ids.has(l.a)).toBe(true);
      expect(ids.has(l.b)).toBe(true);
    }
  });
});

function ASTRONOMY_HAS(id: string): boolean {
  return PATRON_PACKS.find((p) => p.id === 'patron:astronomy')!.cards.some((c) => c.id === id);
}
function ALCHEMY_HAS(id: string): boolean {
  return PATRON_PACKS.find((p) => p.id === 'patron:alchemy')!.cards.some((c) => c.id === id);
}
