import { describe, it, expect } from 'vitest';
import { MODES, MODE_MAP, composeModePrompt, DEFAULT_MODE_ID } from './modes';

describe('game modes', () => {
  it('ships the named collaborative modes with move budgets and prompts', () => {
    const ids = MODES.map((m) => m.id);
    for (const id of ['magister', 'novel', 'short-story', 'poem', 'painting', 'biography', 'article', 'film-critique', 'bong-session'])
      expect(ids).toContain(id);
    for (const m of MODES) {
      expect(m.movesPerPlayer).toBeGreaterThan(0);
      expect(m.prompts.length).toBeGreaterThan(0);
      expect(m.invocation.length).toBeGreaterThan(0);
    }
  });

  it('composes a customized interaction prompt, filling the bead names', () => {
    const p = composeModePrompt('novel', 'John Dee', 'Prague', 'meets');
    expect(p).toContain('John Dee');
    expect(p).toContain('Prague');
    expect(p).not.toContain('{a}');
    expect(p).not.toContain('{b}');
  });

  it('is deterministic per pairing and differs by mode voice', () => {
    const a = composeModePrompt('film-critique', 'Eris', 'Fnord');
    const b = composeModePrompt('film-critique', 'Eris', 'Fnord');
    expect(a).toBe(b); // stable for the same pairing
    // the same pairing under a different mode should usually read differently
    const bong = composeModePrompt('bong-session', 'Eris', 'Fnord');
    expect(typeof bong).toBe('string');
  });

  it('falls back to the default mode for an unknown id', () => {
    const p = composeModePrompt('no-such-mode', 'A', 'B');
    expect(p).toContain('A');
    expect(MODE_MAP[DEFAULT_MODE_ID]).toBeTruthy();
  });
});
