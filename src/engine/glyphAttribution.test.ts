import { describe, it, expect } from 'vitest';
import { attributeGlyphs, enrichGlyphs } from './glyphAttribution';
import type { CardDef } from './types';

describe('glyph attribution', () => {
  it('maps alchemical operations and planet-metals to glyph ids', () => {
    expect(attributeGlyphs({ operation: 'Putrefaction' })).toContain('scorpio');
    expect(attributeGlyphs({ planet: 'Saturn' })).toContain('saturn');
    expect(attributeGlyphs({ metal: 'Gold' })).toContain('sol');
    expect(attributeGlyphs({ stage: 'nigredo' })).toContain('saturn');
  });

  it('ignores the entity name field to avoid false hits', () => {
    // a person literally named with a planet word should not be tagged from the name
    expect(attributeGlyphs({ entity: 'Mars of Padua' })).toEqual([]);
  });

  it('caps the number of glyphs and dedupes', () => {
    const g = attributeGlyphs({ a: 'Sun', b: 'Gold', c: 'Calcination', d: 'Fire', e: 'Water', f: 'Salt' });
    expect(g.length).toBeLessThanOrEqual(4);
    expect(new Set(g).size).toBe(g.length);
  });

  it('reads Latin operation spellings', () => {
    expect(attributeGlyphs({ operation: 'Putrefactio' })).toContain('scorpio');
    expect(attributeGlyphs({ operation: 'Coniunctio' })).toContain('cancer');
  });

  it('enriches a glyph-less card but respects hand-authored glyphs', () => {
    const bare: CardDef = { id: 'x', cls: 'concept', name: 'X', text: '', glyphs: [], correspondences: { operation: 'Conjunction' }, sourceRef: 's' };
    expect(enrichGlyphs(bare).glyphs).toContain('cancer');
    const made: CardDef = { ...bare, glyphs: ['sol'] };
    expect(enrichGlyphs(made).glyphs).toEqual(['sol']); // untouched
  });

  it('self-tags a non-figure card from its name, but not a figure', () => {
    const concept: CardDef = { id: 'c', cls: 'concept', name: 'Putrefactio', text: '', glyphs: [], correspondences: {}, sourceRef: 's' };
    expect(enrichGlyphs(concept).glyphs).toContain('scorpio');
    const figure: CardDef = { id: 'f', cls: 'figure', name: 'Mars of Padua', text: '', glyphs: [], correspondences: {}, sourceRef: 's' };
    expect(enrichGlyphs(figure).glyphs).toEqual([]); // a person's name is not scanned
  });
});
