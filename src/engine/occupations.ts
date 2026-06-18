import type { Occupation } from './types';

// THE MEEPLE BANK — worker-placement occupations. Click a meeple to read it in the info panel;
// drag (or click) it onto a space to place a worker. Each grants a small affinity that brightens
// adjacent beads bearing its topic. (Deeper occupation actions / contested role-spaces are the next
// iteration — see docs/ROLES.md.)

export const OCCUPATIONS: Occupation[] = [
  { id: 'alchemist', emoji: '⚗️', name: 'Alchemist', affinity: 'Sulphur',
    meaning: 'Worker of the Great Work — calcining, dissolving, conjoining matter in the furnace.',
    gameUse: 'Placed beside the principles and metals, the Alchemist strengthens transformative relations.', sourceRef: 'alchemical tradition' },
  { id: 'cleric', emoji: '⛪', name: 'Cleric', affinity: 'Sun',
    meaning: 'Keeper of rite and sacrament — consecration, blessing, the ordered light.',
    gameUse: 'Consecrates nearby beads; favours solar and celestial relations.', sourceRef: 'medieval Christendom' },
  { id: 'necromancer', emoji: '💀', name: 'Necromancer', affinity: 'Saturn',
    meaning: 'Worker of the nigredo — death, decay, and what is raised from the grave of matter.',
    gameUse: 'Thrives on Saturn and Putrefaction; turns the blackening to advantage.', sourceRef: 'Goetic / saturnine lore' },
  { id: 'philosopher', emoji: '🦉', name: 'Philosopher', affinity: 'Mercury',
    meaning: 'Lover of wisdom — separation, analogy, the discernment of essences.',
    gameUse: 'Favours mercurial mediation and analogical relations across disciplines.', sourceRef: 'the philosophical tradition' },
  { id: 'neoplatonist', emoji: '🌟', name: 'Neoplatonist', affinity: 'Sun',
    meaning: 'Theurgist of the emanations — ascent from matter toward the One.',
    gameUse: 'Lifts a board state upward; favours solar and exalting relations.', sourceRef: 'Neoplatonism' },
  { id: 'printer', emoji: '🖨️', name: 'Printer', affinity: 'Mercury',
    meaning: 'Master of the press — reproduction, multiplication, the spread of the word.',
    gameUse: 'Multiplies and publishes; favours Mercury and the process of Multiplication.', sourceRef: 'early book history' },
  { id: 'artisan', emoji: '🔨', name: 'Artisan', affinity: 'Venus',
    meaning: 'Maker and craftsman — the forming of glyphs, sigils, and vessels by hand.',
    gameUse: 'Crafts and fixes; favours Venus and coagulating relations.', sourceRef: 'the craft guilds' },
  { id: 'scholar', emoji: '📜', name: 'Scholar', affinity: 'Mercury',
    meaning: 'Reader of the archive — research, citation, the gathering of authorities.',
    gameUse: 'Draws on the universal archive; broadens the relations a board can yield.', sourceRef: 'the universal archive' },
  { id: 'patron', emoji: '👑', name: 'Patron', affinity: 'Jupiter',
    meaning: 'Sponsor of the work — fortune, abundance, the funding of the Great Work.',
    gameUse: 'Bestows fortune; favours Jupiter and benefic relations.', sourceRef: 'Renaissance patronage' },
  { id: 'astrologer', emoji: '🔭', name: 'Astrologer', affinity: 'Moon',
    meaning: 'Reader of the heavens — election of hours, the casting of celestial figures.',
    gameUse: 'Favours the planets and lunar relations; reads the sky of the board.', sourceRef: 'judicial astrology' },
  { id: 'physician', emoji: '🌿', name: 'Physician', affinity: 'Venus',
    meaning: 'Healer of the body — humours, herbs, and the tempering of melancholy.',
    gameUse: 'Tempers the saturnine; favours the benefic Venus-Jupiter remedies.', sourceRef: 'Galenic / Ficinian medicine' },
  { id: 'magus', emoji: '🪄', name: 'Magus', affinity: 'Sulphur',
    meaning: 'Operator of natural magic — drawing down the virtues of the stars into matter.',
    gameUse: 'Amplifies every nearby relation; the most potent and rarest worker.', sourceRef: 'Renaissance natural magic' },
];

export const OCC_MAP: Record<string, Occupation> = Object.fromEntries(OCCUPATIONS.map((o) => [o.id, o]));
