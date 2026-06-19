import { describe, it, expect, beforeEach } from 'vitest';
import {
  exportUserLibrary, importUserLibrary, isLibraryEmpty,
  type UserLibrary,
} from './content';

// The cloud-sync seam: the user library must round-trip losslessly and report
// emptiness correctly (the signal that decides push-vs-pull on first login).

const SAMPLE: UserLibrary = {
  homebrew: {
    cardOverrides: { 'seed:mercury': { name: 'Quicksilver' } },
    newCards: [{ id: 'mine:1', cls: 'concept', name: 'My Card', text: 'forged', glyphs: ['☿'], correspondences: {}, sourceRef: 'player (Print Shop)' }],
    glyphOverrides: { '☉': { meaning: 'Gold, refined' } },
  },
  packs: { packs: [{ id: 'pack:1', name: 'Alchemy', description: '', cardIds: ['mine:1'] }], active: ['pack:1'] },
};

describe('user library cloud seam', () => {
  beforeEach(() => importUserLibrary(null)); // reset to empty before each test

  it('reports empty after importing null', () => {
    expect(isLibraryEmpty()).toBe(true);
  });

  it('round-trips a full library through import → export', () => {
    importUserLibrary(SAMPLE);
    expect(isLibraryEmpty()).toBe(false);
    expect(exportUserLibrary()).toEqual(SAMPLE);
  });

  it('treats a partial/legacy blob defensively (missing fields default empty)', () => {
    importUserLibrary({ homebrew: { newCards: [{ id: 'x', cls: 'concept', name: 'X', text: '', glyphs: [], correspondences: {}, sourceRef: 'test' }] } });
    const out = exportUserLibrary();
    expect(out.homebrew.newCards).toHaveLength(1);
    expect(out.homebrew.cardOverrides).toEqual({});
    expect(out.packs).toEqual({ packs: [], active: [] });
  });
});
