import type { CardDef, Glyph } from './types';
import { CARDS as BASE_CARDS, SEED_DECK } from '../data/seedDeck';
import { GLYPHS as BASE_GLYPHS } from './glyphBank';
import { enrichGlyphs } from './glyphAttribution';

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

// CORPUS CARDS — the unified-ontology library (data/corpus). Registered at runtime by activateCorpus();
// resolvable through getCard() and listable via corpusCardIds(). Kept separate from the small seed
// hand-pool so thousands of library cards don't flood the deck — they are a searchable crystal.
let corpusCards: Record<string, CardDef> = {};
export function registerCorpusCards(cards: CardDef[]): void {
  // Attribute glyphs from each card's correspondences so corpus beads are real game pieces
  // (see glyphAttribution.ts + docs/CARD_STYLE_GUIDE.md). Respects any hand-authored glyphs.
  corpusCards = Object.fromEntries(cards.map((c) => [c.id, enrichGlyphs(c)]));
  version++;
}
export const corpusCardIds = (): string[] => Object.keys(corpusCards);
export const corpusCardCount = (): number => Object.keys(corpusCards).length;

// BUILT-IN DLC — curated packs shipped with the app (e.g. the Societas Magica packs). Their cards
// register here so getCard() resolves them; the packs appear in the Packs modal as activatable
// built-ins (id prefix "dlc:") that can't be deleted/edited but can be activated, exported, cloned.
let dlcCards: Record<string, CardDef> = {};
let builtinPacks: Pack[] = [];
export function registerDlc(packs: Array<{ id: string; name: string; description: string; cards: CardDef[] }>): void {
  dlcCards = Object.fromEntries(packs.flatMap((p) => p.cards.map((c) => [c.id, c] as const)));
  builtinPacks = packs.map((p) => ({ id: p.id, name: p.name, description: p.description, cardIds: p.cards.map((c) => c.id) }));
  version++;
}
export const isBuiltinPack = (id: string): boolean => builtinPacks.some((p) => p.id === id);

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

/** A card, with homebrew override merged over base/new/corpus. */
export function getCard(id: string): CardDef | undefined {
  const base = BASE_CARDS[id] ?? newCardMap()[id] ?? corpusCards[id] ?? dlcCards[id];
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

// --- DLC PACKS ---------------------------------------------------------------
// A pack is a player-curated selection of cards (from the base seed, the unified-ontology Crystal,
// or their own Print Shop cards) covering a topic — e.g. "Medieval Alchemists Pack". Active packs
// build the game's deck; packs export/import as self-contained JSON (embedding their card defs) so
// they are shareable "DLC". Persisted under their own key, independent of homebrew edits.

export interface Pack { id: string; name: string; description: string; cardIds: string[] }
interface PacksState { packs: Pack[]; active: string[] }

const PACK_KEY = 'gbg_packs_v1';
let packStore: PacksState = loadPacks();
function loadPacks(): PacksState {
  try {
    const raw = localStorage.getItem(PACK_KEY);
    if (raw) { const p = JSON.parse(raw); return { packs: p.packs ?? [], active: p.active ?? [] }; }
  } catch { /* ignore */ }
  return { packs: [], active: [] };
}
function persistPacks() { try { localStorage.setItem(PACK_KEY, JSON.stringify(packStore)); } catch { /* ignore */ } version++; }

export const listPacks = (): Pack[] => [...builtinPacks, ...packStore.packs];
export const activePackIds = (): string[] => packStore.active;

export function createPack(name: string, description: string, cardIds: string[]): string {
  const id = `pack:${Date.now()}`;
  packStore.packs = [...packStore.packs, { id, name: name || 'Untitled pack', description, cardIds: [...new Set(cardIds)] }];
  persistPacks();
  return id;
}
export function updatePack(id: string, patch: Partial<Pack>) {
  packStore.packs = packStore.packs.map((p) => (p.id === id ? { ...p, ...patch, cardIds: patch.cardIds ? [...new Set(patch.cardIds)] : p.cardIds } : p));
  persistPacks();
}
export function deletePack(id: string) {
  packStore.packs = packStore.packs.filter((p) => p.id !== id);
  packStore.active = packStore.active.filter((a) => a !== id);
  persistPacks();
}
export function toggleActivePack(id: string) {
  packStore.active = packStore.active.includes(id) ? packStore.active.filter((a) => a !== id) : [...packStore.active, id];
  persistPacks();
}

/** Every card id available to browse (base seed + homebrew + the Crystal corpus + built-in DLC). */
export function libraryCardIds(): string[] {
  return [...SEED_DECK.map((c) => c.id), ...(store.newCards ?? []).map((c) => c.id), ...Object.keys(corpusCards), ...Object.keys(dlcCards)];
}

/** The deck source: the union of active packs' cards (if any), else the default seed+homebrew pool. */
export function deckCardIds(): string[] {
  if (packStore.active.length) {
    const ids = new Set<string>();
    for (const p of listPacks()) if (packStore.active.includes(p.id)) for (const c of p.cardIds) ids.add(c);
    const resolvable = [...ids].filter((id) => !!getCard(id));
    if (resolvable.length) return resolvable;
  }
  return allCardIds();
}

/** Export a pack as self-contained JSON (embeds its resolved card defs) for sharing. */
export function exportPack(id: string): string {
  const p = listPacks().find((x) => x.id === id);
  if (!p) return '';
  const cards = p.cardIds.map((cid) => getCard(cid)).filter(Boolean) as CardDef[];
  return JSON.stringify({ kind: 'gbg-dlc-pack', name: p.name, description: p.description, cards }, null, 2);
}
/** Import a pack from exported JSON; unknown cards are registered into homebrew so they persist. */
export function importPack(json: string): string | null {
  try {
    const d = JSON.parse(json);
    const cards: CardDef[] = Array.isArray(d.cards) ? d.cards : [];
    for (const c of cards) if (c?.id && !getCard(c.id)) store.newCards = [...(store.newCards ?? []), c];
    persist();
    return createPack(d.name || 'Imported pack', d.description || '', cards.map((c) => c.id).filter(Boolean));
  } catch { return null; }
}
