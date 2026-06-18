import type { CardDef, Glyph } from './types';
import { CARDS as BASE_CARDS, SEED_DECK } from '../data/seedDeck';
import { GLYPHS as BASE_GLYPHS } from './glyphBank';

// CONTENT LAYER — merges base data with the player's "homebrew" edits (the Print Shop / level
// editor). Every card and glyph is editable; players can also create new cards. Edits persist in
// localStorage and are read by the pure engine via getCard()/getGlyph(), so homebrew is fully live.
// This is the seam the user's vision asks for: "make every game element fully editable."

interface Homebrew {
  cardOverrides: Record<string, Partial<CardDef>>;
  newCards: CardDef[];
  glyphOverrides: Record<string, Partial<Glyph>>;
}

const KEY = 'gbg_homebrew_v1';
let store: Homebrew = load();
let version = 0; // bumped on any edit so React can re-render

function load(): Homebrew {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { cardOverrides: p.cardOverrides ?? {}, newCards: p.newCards ?? [], glyphOverrides: p.glyphOverrides ?? {} };
    }
  } catch { /* ignore */ }
  return { cardOverrides: {}, newCards: [], glyphOverrides: {} };
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* ignore */ }
  version++;
}

export const homebrewVersion = () => version;

const newCardMap = () => Object.fromEntries((store.newCards ?? []).map((c) => [c.id, c]));

/** A card, with homebrew override merged over base/new. */
export function getCard(id: string): CardDef | undefined {
  const base = BASE_CARDS[id] ?? newCardMap()[id];
  if (!base) return undefined;
  const ov = store.cardOverrides[id];
  return ov ? { ...base, ...ov } : base;
}

/** Every playable card id (base seed + homebrew new cards). */
export function allCardIds(): string[] {
  return [...SEED_DECK.map((c) => c.id), ...(store.newCards ?? []).map((c) => c.id)];
}

/** A glyph, with homebrew text/correspondence override merged. */
export function getGlyph(id: string): Glyph | undefined {
  const base = BASE_GLYPHS[id];
  if (!base) return undefined;
  const ov = store.glyphOverrides[id];
  return ov ? { ...base, ...ov } : base;
}

// --- mutators (Print Shop) ---
export function editCard(id: string, patch: Partial<CardDef>) {
  store.cardOverrides[id] = { ...store.cardOverrides[id], ...patch };
  persist();
}
export function editGlyph(id: string, patch: Partial<Glyph>) {
  store.glyphOverrides[id] = { ...store.glyphOverrides[id], ...patch };
  persist();
}
export function createCard(card: CardDef): string {
  store.newCards = [...(store.newCards ?? []), card];
  persist();
  return card.id;
}
export function resetHomebrew() {
  store = { cardOverrides: {}, newCards: [], glyphOverrides: {} };
  persist();
}
