import type { CardDef } from '../../engine/types';

// Shared builders for the curated DLC packs. Sober, academic register; every card cited; glyphs per
// docs/CARD_STYLE_GUIDE.md. cls: figure (person) · text (work) · concept (idea/event/place).

export interface DlcPack { id: string; name: string; description: string; cards: CardDef[] }

export const fig = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef: string, portal?: string): CardDef =>
  ({ id, cls: 'figure', name, text, glyphs, correspondences: corr, sourceRef, ...(portal ? { portal } : {}) });
export const txt = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef: string, portal?: string): CardDef =>
  ({ id, cls: 'text', name, text, glyphs, correspondences: corr, sourceRef, ...(portal ? { portal } : {}) });
export const con = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef: string, portal?: string): CardDef =>
  ({ id, cls: 'concept', name, text, glyphs, correspondences: corr, sourceRef, ...(portal ? { portal } : {}) });
