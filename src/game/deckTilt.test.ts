import { describe, it, expect } from 'vitest';
import type { CardDef } from '../engine/types';
import { tiltWeight, tiltOrder, tiltedSample } from './deckTilt';

// cls typed as string (cast on assign) so the fixtures don't depend on whether CardDef['cls'] has been
// widened to the full corpus set — matches deckTilt.ts's own forward/backward-compatible stance.
const card = (id: string, cls: string, extra: Partial<CardDef> = {}): CardDef => ({
  id, cls: cls as CardDef['cls'], name: id, text: '', glyphs: [], correspondences: {}, sourceRef: 'test', ...extra,
});

const DECK: CardDef[] = [
  card('fig', 'figure'),
  card('txt', 'text'),
  card('sym', 'symbol'),
  card('con', 'concept'),
  card('obj', 'object'),
  card('plc', 'place'),
  card('evt', 'event'),
  card('idea', 'idea'),
];
const byId = Object.fromEntries(DECK.map((c) => [c.id, c]));
const get = (id: string): CardDef | undefined => byId[id];
const ids = DECK.map((c) => c.id);

describe('deckTilt (genre → deck tilt)', () => {
  it('the Magister mode is roughly class-neutral; the Novel favours figures over symbols', () => {
    // novel: figure(1.4) should outrank symbol(0)
    expect(tiltWeight(get('fig'), 'novel')).toBeGreaterThan(tiltWeight(get('sym'), 'novel'));
    expect(tiltOrder(ids, get, 'novel')[0]).toBe('fig');
  });

  it('the Scholarly Article favours texts and concepts over figures', () => {
    const order = tiltOrder(ids, get, 'article');
    expect(order.indexOf('txt')).toBeLessThan(order.indexOf('fig'));
    expect(order.indexOf('con')).toBeLessThan(order.indexOf('fig'));
  });

  it('the Video Game favours systems — concepts/objects/ideas — over figures', () => {
    const order = tiltOrder(ids, get, 'video-game');
    expect(order.indexOf('con')).toBeLessThan(order.indexOf('fig'));
    expect(order.indexOf('obj')).toBeLessThan(order.indexOf('fig'));
  });

  it('a genre nudges on top of the mode: Novel/Sci-Fi lifts objects above the mode baseline', () => {
    const baseObj = tiltWeight(get('obj'), 'novel');
    const scifiObj = tiltWeight(get('obj'), 'novel', 'scifi');
    expect(scifiObj).toBeGreaterThan(baseObj);
  });

  it('an unknown mode is neutral — order is preserved', () => {
    expect(tiltOrder(ids, get, 'no-such-mode')).toEqual(ids);
  });

  it('never drops a card below the floor, so every card stays drawable', () => {
    for (const c of DECK) expect(tiltWeight(c, 'article')).toBeGreaterThanOrEqual(0.2);
  });

  it('tiltedSample returns n distinct ids from the pool', () => {
    let i = 0;
    const rnd = () => [0.1, 0.5, 0.9, 0.3, 0.7][i++ % 5];
    const picks = tiltedSample(ids, 5, get, 'novel', undefined, rnd);
    expect(picks.length).toBe(5);
    expect(new Set(picks).size).toBe(5);
    for (const p of picks) expect(ids).toContain(p);
  });

  it('tiltedSample over-represents the preferred class across many draws', () => {
    // Sweep the rng uniformly across (0,1) so the cumulative-weight walk samples in proportion to
    // weight. Under 'novel', figure (weight 2.4) must be drawn more often than symbol (weight 1.0).
    const N = 400;
    let i = 0;
    const rnd = () => (i++ % N) / N;
    const picks = Array.from({ length: N }, () => tiltedSample(ids, 1, get, 'novel', undefined, rnd)[0]);
    const share = (id: string) => picks.filter((p) => p === id).length / picks.length;
    expect(share('fig')).toBeGreaterThan(share('sym'));
    expect(share('fig')).toBeGreaterThan(0.15);
  });
});
