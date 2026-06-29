import { describe, it, expect } from 'vitest';
import { MODES, MODE_MAP, composeModePrompt } from './modes';
import { EXTRA_PROMPTS } from './modePrompts';

describe('EXTRA_PROMPTS (mode/genre prompt bank)', () => {
  it('covers every mode with 3 base prompts', () => {
    for (const mode of MODES) {
      const extra = EXTRA_PROMPTS[mode.id];
      expect(extra, `missing extra prompts for mode ${mode.id}`).toBeTruthy();
      expect(extra.base.length).toBe(3);
    }
  });

  it('only references real genre ids, and covers every genre of every mode', () => {
    for (const mode of MODES) {
      const extra = EXTRA_PROMPTS[mode.id];
      const realGenreIds = new Set(mode.genres.map((x) => x.id));
      for (const gid of Object.keys(extra.genres)) {
        expect(realGenreIds.has(gid), `${mode.id}: unknown genre ${gid}`).toBe(true);
        expect(extra.genres[gid].length).toBeGreaterThanOrEqual(2);
      }
      for (const ge of mode.genres) {
        expect(extra.genres[ge.id], `${mode.id}: genre ${ge.id} has no extra prompts`).toBeTruthy();
      }
    }
  });

  it('every template carries both {a} and {b} slots', () => {
    for (const extra of Object.values(EXTRA_PROMPTS)) {
      const all = [...extra.base, ...Object.values(extra.genres).flat()];
      for (const t of all) {
        expect(t.includes('{a}'), `missing {a}: ${t}`).toBe(true);
        expect(t.includes('{b}'), `missing {b}: ${t}`).toBe(true);
      }
    }
  });

  it('templates are content-neutral (no leaked card names baked in)', () => {
    // The Grounding Rule lives in the cards, not the templates: a template must work for ANY pair.
    // Guard against a stray proper noun like "Sol"/"Ficino" being hard-coded into a template.
    const banned = /\b(Sol|Luna|Ficino|Saturn|Venus|Jupiter|Paracelsus|Hesse|Leary)\b/;
    for (const extra of Object.values(EXTRA_PROMPTS)) {
      const all = [...extra.base, ...Object.values(extra.genres).flat()];
      for (const t of all) expect(banned.test(t), `leaked name in: ${t}`).toBe(false);
    }
  });

  it('composeModePrompt fills slots and can surface an extra prompt', () => {
    const out = composeModePrompt('novel', 'The Green Lion', 'Maybe Logic', 'meets', 'noir');
    expect(out).toContain('The Green Lion');
    expect(out).toContain('Maybe Logic');
    expect(out).not.toContain('{a}');
    expect(out).not.toContain('{b}');
  });

  it('merged pools are strictly larger than the base mode definitions', () => {
    // every genre pool now = its own prompts + the extra bank, so variety strictly increased.
    for (const mode of MODES) {
      for (const ge of mode.genres) {
        const merged = ge.prompts.length + (EXTRA_PROMPTS[mode.id]?.genres[ge.id]?.length ?? 0);
        expect(merged).toBeGreaterThan(ge.prompts.length);
      }
      expect(MODE_MAP[mode.id]).toBeTruthy();
    }
  });
});
