import type { GameState } from '../engine/types';

// DataStore interface — local-first. The shared Supabase backend / crystal / online play are
// BRACKETED (see docs/DATA_MODEL.md, docs/DEPLOYMENT.md).

export interface DataStore {
  save(state: GameState): void;
  load(): GameState | null;
  clear(): void;
}

const KEY = 'gbg_save_v3';

/** Guard against stale/incompatible saves from earlier schema versions. */
function isValid(s: unknown): s is GameState {
  return !!s && typeof s === 'object'
    && Array.isArray((s as GameState).players)
    && typeof (s as GameState).phase === 'string'
    && !!(s as GameState).meeples;
}

export const localStore: DataStore = {
  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore quota/availability errors */
    }
  },
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};
