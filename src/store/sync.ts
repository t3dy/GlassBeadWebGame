import { supabase } from './supabase';
import {
  exportUserLibrary,
  importUserLibrary,
  isLibraryEmpty,
  onContentChange,
} from '../engine/content';
import type { GameState } from '../engine/types';

// SYNC ENGINE — keeps a logged-in user's library + board states mirrored to
// Supabase with low friction: pull on login, debounced auto-push on every edit.
// Everything no-ops gracefully when `supabase` is null (guest mode).

export type SyncStatus = 'offline' | 'idle' | 'syncing' | 'saved' | 'error';

export interface GameSummary {
  id: string;
  name: string;
  is_current: boolean;
  updated_at: string;
}

// ── status (a tiny observable so the nav bar can show a sync chip) ────────────
let status: SyncStatus = supabase ? 'idle' : 'offline';
const statusListeners = new Set<(s: SyncStatus) => void>();
function setStatus(s: SyncStatus) {
  status = s;
  for (const cb of statusListeners) cb(s);
}
export const getSyncStatus = (): SyncStatus => status;
export function subscribeSyncStatus(cb: (s: SyncStatus) => void): () => void {
  statusListeners.add(cb);
  return () => { statusListeners.delete(cb); };
}

// ── session state ─────────────────────────────────────────────────────────────
let userId: string | null = null;
let currentGameId: string | null = null;
let unsubscribeContent: (() => void) | null = null;

function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...a: A) => { if (t) clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ── library push (cards / glyphs / packs) ─────────────────────────────────────
async function pushLibraryNow() {
  if (!supabase || !userId) return;
  setStatus('syncing');
  const { error } = await supabase
    .from('user_library')
    .upsert({ user_id: userId, data: exportUserLibrary(), updated_at: new Date().toISOString() });
  setStatus(error ? 'error' : 'saved');
}
const pushLibrary = debounce(() => { void pushLibraryNow(); }, 1200);

// ── current-board push ────────────────────────────────────────────────────────
let pendingState: GameState | null = null;
async function pushGameNow() {
  if (!supabase || !userId || !pendingState) return;
  const state = pendingState;
  setStatus('syncing');
  if (currentGameId) {
    const { error } = await supabase
      .from('games')
      .update({ state, updated_at: new Date().toISOString() })
      .eq('id', currentGameId);
    setStatus(error ? 'error' : 'saved');
  } else {
    const { data, error } = await supabase
      .from('games')
      .insert({ owner: userId, name: 'Current game', state, is_current: true })
      .select('id')
      .single();
    if (error || !data) { setStatus('error'); return; }
    currentGameId = data.id;
    setStatus('saved');
  }
}
const pushGameDebounced = debounce(() => { void pushGameNow(); }, 1200);

/** Auto-save the live board to the cloud (debounced). Called from App's save effect. */
export function pushGame(state: GameState) {
  if (!supabase || !userId) return;
  pendingState = state;
  pushGameDebounced();
}

// ── login / logout ────────────────────────────────────────────────────────────
/**
 * Called when a user signs in. Pulls their cloud library + current board, or — if
 * the cloud is empty (new account) — seeds it from the local/guest data so nothing
 * the player made as a guest is lost. Returns the board to load, if any.
 */
export async function initSync(uid: string): Promise<GameState | null> {
  if (!supabase) return null;
  userId = uid;
  setStatus('syncing');

  // Library: cloud wins if present; otherwise push local up.
  try {
    const { data: lib } = await supabase
      .from('user_library')
      .select('data')
      .eq('user_id', uid)
      .maybeSingle();
    if (lib?.data) {
      importUserLibrary(lib.data);
    } else if (!isLibraryEmpty()) {
      await pushLibraryNow();
    }
  } catch { setStatus('error'); }

  // Subscribe to future edits.
  unsubscribeContent?.();
  unsubscribeContent = onContentChange(() => pushLibrary());

  // Current board: load the user's is_current row if any.
  let loaded: GameState | null = null;
  try {
    const { data: game } = await supabase
      .from('games')
      .select('id, state')
      .eq('owner', uid)
      .eq('is_current', true)
      .maybeSingle();
    if (game) {
      currentGameId = game.id;
      loaded = game.state as GameState;
    }
  } catch { /* ignore */ }

  setStatus('idle');
  return loaded;
}

/** Called on sign-out: stop syncing and forget the session. */
export function teardownSync() {
  unsubscribeContent?.();
  unsubscribeContent = null;
  userId = null;
  currentGameId = null;
  pendingState = null;
  setStatus(supabase ? 'idle' : 'offline');
}

// ── saved games API (the Saves browser) ───────────────────────────────────────
export async function listGames(): Promise<GameSummary[]> {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('games')
    .select('id, name, is_current, updated_at')
    .eq('owner', userId)
    .order('updated_at', { ascending: false });
  if (error || !data) return [];
  return data as GameSummary[];
}

export async function loadGame(id: string): Promise<GameState | null> {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('games').select('state').eq('id', id).single();
  if (error || !data) return null;
  // Make this the current board going forward.
  await supabase.from('games').update({ is_current: false }).eq('owner', userId).eq('is_current', true);
  await supabase.from('games').update({ is_current: true }).eq('id', id);
  currentGameId = id;
  return data.state as GameState;
}

/** Save the given board as a new named entry (a separate "space in memory"). */
export async function saveGameAs(name: string, state: GameState): Promise<GameSummary | null> {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('games')
    .insert({ owner: userId, name: name || 'Untitled', state, is_current: false })
    .select('id, name, is_current, updated_at')
    .single();
  if (error || !data) return null;
  return data as GameSummary;
}

export async function renameGame(id: string, name: string): Promise<void> {
  if (!supabase || !userId) return;
  await supabase.from('games').update({ name }).eq('id', id);
}

export async function deleteGame(id: string): Promise<void> {
  if (!supabase || !userId) return;
  await supabase.from('games').delete().eq('id', id);
  if (currentGameId === id) currentGameId = null;
}
