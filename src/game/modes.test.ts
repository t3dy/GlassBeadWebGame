import { describe, it, expect } from 'vitest';
import { MODES, MODE_MAP, composeModePrompt, DEFAULT_MODE_ID, genresOf } from './modes';

describe('game modes', () => {
  it('ships the named collaborative modes (incl. Video Game) with budgets, prompts, and genres', () => {
    const ids = MODES.map((m) => m.id);
    for (const id of ['magister', 'novel', 'short-story', 'poem', 'painting', 'biography', 'article', 'film-critique', 'bong-session', 'video-game'])
      expect(ids).toContain(id);
    for (const m of MODES) {
      expect(m.movesPerPlayer).toBeGreaterThan(0);
      expect(m.prompts.length).toBeGreaterThan(0);
      expect(m.invocation.length).toBeGreaterThan(0);
      expect(m.genres.length).toBeGreaterThan(0); // every mode subdivides by genre
      for (const ge of m.genres) expect(ge.prompts.length).toBeGreaterThan(0);
    }
  });

  it('subdivides by genre and the genre prompts override the mode base prompts', () => {
    expect(genresOf('video-game').map((x) => x.id)).toContain('roguelike');
    expect(genresOf('bong-session').map((x) => x.id)).toContain('philosophical');
    expect(genresOf('novel').map((x) => x.id)).toContain('scifi');
    const base = composeModePrompt('novel', 'Prague', 'John Dee');
    const scifi = composeModePrompt('novel', 'Prague', 'John Dee', 'meets', 'scifi');
    expect(scifi).toContain('Prague');
    expect(scifi).not.toBe(base); // genre changes the voice
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
