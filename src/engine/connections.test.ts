import { describe, it, expect } from 'vitest';
import { registerDlc } from './content';
import { ALL_DLC_PACKS } from '../data/dlc';
import { connectedCards } from './connections';

describe('connected-card draws', () => {
  it('offers Pico when Henry of Ghent is placed (authored influence link)', () => {
    registerDlc(ALL_DLC_PACKS);
    const conns = connectedCards('sch:henry-ghent');
    const pico = conns.find((c) => c.id === 'sm:pico');
    expect(pico).toBeTruthy();
    expect(pico!.reason.toLowerCase()).toContain('pico');
  });

  it('links the same figure across packs (John Dee in two packs)', () => {
    registerDlc(ALL_DLC_PACKS);
    const conns = connectedCards('ema:dee');
    expect(conns.some((c) => c.id === 'sm:dee')).toBe(true);
  });

  it('falls back to thematic links by shared correspondence', () => {
    registerDlc(ALL_DLC_PACKS);
    // a card with no authored link still finds same-discipline neighbours
    const conns = connectedCards('sch:bonaventure');
    expect(conns.length).toBeGreaterThan(0);
  });

  it('the RAW pack links its novels and reaches the base seed (Wilson → Leary’s circuits)', () => {
    registerDlc(ALL_DLC_PACKS);
    const conns = connectedCards('rawd:wilson');
    expect(conns.some((c) => c.id === 'rawd:illuminatus')).toBe(true);
    expect(conns.some((c) => c.id === 'leary:circuit')).toBe(true); // cross-pack to the seed deck
  });

  it('every DLC pack card carries a sourceRef (Grounding Rule)', () => {
    for (const p of ALL_DLC_PACKS) for (const c of p.cards) expect(c.sourceRef.length).toBeGreaterThan(0);
  });
});
