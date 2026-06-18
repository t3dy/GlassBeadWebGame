// Knowledge portals — the live DH sites from C:\Dev\wiki (the DBCatalog network). Cards drawn from
// a portal link out to its website; the portal bar links to all of them. URLs verified against
// wiki/index.html (the deployed hub). The full card-ingestion pipeline is still BRACKETED
// (docs/CARD_CORPUS.md) — this wires the deck to the real sites now.

export interface Portal {
  id: string;
  title: string;
  url: string;
  blurb: string;
}

export const PORTALS: Portal[] = [
  { id: 'hermeticdb', title: 'HermeticDB — the Emerald Tablet', url: 'https://t3dy.github.io/HermeticDB/', blurb: 'Textual transmission of the Emerald Tablet across Arabic, Latin, and English.' },
  { id: 'rmdb', title: 'Renaissance Magic (RMDB)', url: 'https://t3dy.github.io/RMDB/', blurb: '337 academic texts on Renaissance ritual and esoteric magic.' },
  { id: 'goetia', title: 'Goetia Sigil Analysis', url: 'https://t3dy.github.io/goetia-sigil-analysis/', blurb: 'Reverse-engineering the 72 Goetic seals (the kamea-path hypothesis).' },
  { id: 'hpmarginalia', title: 'HPMarginalia — Hypnerotomachia', url: 'https://t3dy.github.io/HPMarginalia/', blurb: 'Alchemical marginalia in the 1499 Aldine Hypnerotomachia Poliphili.' },
  { id: 'querypat', title: 'QueryPat — Philip K. Dick', url: 'https://t3dy.github.io/QueryPat/', blurb: 'The definitive Philip K. Dick literary-criticism portal.' },
  { id: 'shakesphyllis', title: 'Shakespeare Sonnets', url: 'https://t3dy.github.io/ShakesPhyllis/', blurb: 'The 1609 Quarto: the Fair Youth and the Dark Lady.' },
  { id: 'marxistportal', title: 'Marxist Portal', url: 'https://t3dy.github.io/MarxistPortal/', blurb: '21st-century crises through four Marxist lenses.' },
  { id: 'dreambase', title: 'Dreambase (Megabase)', url: 'https://t3dy.github.io/BetterDreambaseChunks/', blurb: 'A synthetic memory bank of thousands of LLM conversations.' },
];

export const PORTAL_HUB = { title: 'DBCatalog — the portal network', url: 'https://t3dy.github.io/DBCatalog/' };

export const PORTAL_MAP: Record<string, Portal> = Object.fromEntries(PORTALS.map((p) => [p.id, p]));
