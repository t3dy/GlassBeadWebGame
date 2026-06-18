import { describe, it, expect } from 'vitest';
import { registerDlc, isBuiltinPack, listPacks, toggleActivePack, deckCardIds, getCard, libraryCardIds } from './content';
import { SOCIETAS_MAGICA_PACKS } from '../data/dlc/societasMagica';

describe('built-in DLC packs + deck building', () => {
  it('registers the Societas Magica packs as built-in and resolves their cards', () => {
    registerDlc(SOCIETAS_MAGICA_PACKS);
    expect(isBuiltinPack('dlc:sm-figures')).toBe(true);
    expect(isBuiltinPack('dlc:sm-scholars')).toBe(true);
    const names = listPacks().map((p) => p.name);
    expect(names).toContain('Societas Magica · Historical Figures');
    const ficino = getCard('sm:ficino');
    expect(ficino?.name).toBe('Marsilio Ficino');
    expect(ficino?.sourceRef.length).toBeGreaterThan(0);   // Grounding Rule
    expect(libraryCardIds()).toContain('sm:ficino');
  });

  it('builds the deck from an active built-in pack', () => {
    registerDlc(SOCIETAS_MAGICA_PACKS);
    toggleActivePack('dlc:sm-figures'); // activate
    const deck = deckCardIds();
    expect(deck).toContain('sm:ficino');
    expect(deck).not.toContain('gbg:bead'); // base seed excluded when a pack is active
    toggleActivePack('dlc:sm-figures'); // deactivate (clean up shared module state)
  });

  it('every Societas Magica card carries a sourceRef', () => {
    for (const pack of SOCIETAS_MAGICA_PACKS)
      for (const c of pack.cards) expect(c.sourceRef.length).toBeGreaterThan(0);
  });
});
