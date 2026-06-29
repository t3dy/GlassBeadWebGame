import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { deepenSuggestion, isClaudeEnabled, setClaudeEnabled, claudeEndpoint, setClaudeEndpoint } from './claudeDeepen';

const CTX = { a: 'Sol', b: 'Luna', modeVoice: 'the Magister speaks softly' };

// Run env-agnostic: install a tiny in-memory localStorage so the test doesn't depend on jsdom.
function installLocalStorage(): void {
  const store = new Map<string, string>();
  const ls = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  vi.stubGlobal('localStorage', ls);
}

describe('claudeDeepen (opt-in hosted seam)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    installLocalStorage();
  });
  afterEach(() => vi.restoreAllMocks());

  it('is off by default and returns the grounded text unchanged (no network)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch' as never);
    expect(isClaudeEnabled()).toBe(false);
    const out = await deepenSuggestion('Sol weds Luna in the chymical wedding.', CTX);
    expect(out).toBe('Sol weds Luna in the chymical wedding.');
    expect(spy).not.toHaveBeenCalled(); // never even reaches the network when off
  });

  it('toggles enablement through localStorage', () => {
    setClaudeEnabled(true);
    expect(isClaudeEnabled()).toBe(true);
    setClaudeEnabled(false);
    expect(isClaudeEnabled()).toBe(false);
  });

  it('defaults the endpoint and lets it be overridden', () => {
    expect(claudeEndpoint()).toBe('/api/deepen');
    setClaudeEndpoint('https://example.test/deepen');
    expect(claudeEndpoint()).toBe('https://example.test/deepen');
  });

  it('returns Claude’s rephrasing when enabled and the proxy responds', async () => {
    setClaudeEnabled(true);
    vi.stubGlobal('fetch', vi.fn(async () =>
      ({ ok: true, json: async () => ({ text: 'Gold and silver are wed.' }) }) as Response));
    const out = await deepenSuggestion('Sol weds Luna.', CTX);
    expect(out).toBe('Gold and silver are wed.');
  });

  it('falls back to the original text on a network/proxy error', async () => {
    setClaudeEnabled(true);
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    const out = await deepenSuggestion('Sol weds Luna.', CTX);
    expect(out).toBe('Sol weds Luna.');
  });

  it('falls back when the proxy returns a non-ok status', async () => {
    setClaudeEnabled(true);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) }) as Response));
    const out = await deepenSuggestion('Sol weds Luna.', CTX);
    expect(out).toBe('Sol weds Luna.');
  });
});
