import { fig, txt, type DlcPack } from './_card';

// HERMETISTS — the ancient Hermetic corpus and its medieval transmission. Sober, cited.

const ANC = { tradition: 'Hermetica', era: 'ancient', discipline: 'Hermetism' };
export const ANCIENT_HERMETICA_CARDS = [
  fig('her:hermes', 'Hermes Trismegistus', 'The legendary “thrice-great” sage, a fusion of Hermes and Thoth, to whom the philosophical and technical Hermetica were ascribed — the figurehead of a prisca theologia.', ['mercury-spirit', 'sol'], ANC, 'Corpus Hermeticum (Greek, 2nd–3rd c. CE)', 'hermeticdb'),
  txt('her:poimandres', 'Poimandres', 'The first treatise of the Corpus Hermeticum: a vision of the divine Mind, the fall of primal Man into nature, and the way of ascent and rebirth.', ['sol', 'mercury-spirit'], ANC, 'Corpus Hermeticum I (2nd–3rd c. CE)', 'hermeticdb'),
  txt('her:asclepius', 'The Asclepius', 'The Latin Hermetic dialogue, preserved entire, including the notorious passage on Egyptians ensouling statues as gods.', ['mercury-spirit'], ANC, 'Asclepius (Latin, 3rd–4th c. CE)', 'hermeticdb'),
  txt('her:emerald', 'The Emerald Tablet', '“That which is above is as that which is below” — the brief, cryptic Tabula Smaragdina became the charter of alchemy.', ['sol', 'mercury-spirit'], ANC, 'Tabula Smaragdina (Arabic, before 9th c.)', 'hermeticdb'),
  txt('her:kore', 'The Kore Kosmou', 'The “Virgin of the World”: Isis instructs Horus in the descent of souls and the ordering of the cosmos.', ['luna'], ANC, 'Stobaean Hermetica, Kore Kosmou (2nd–3rd c. CE)'),
  fig('her:bolos', 'Bolos of Mendes', 'The Hellenistic compiler whose writings on the sympathies of nature bridge the Hermetic and the alchemical literatures.', ['mercury'], ANC, 'Bolos, Physika (c. 200 BCE)'),
  fig('her:agathodaimon', 'Agathodaimon', 'A Hermetic teacher invoked in the Greek corpus and alchemical writings as a source of the divine wisdom.', ['mercury-spirit'], ANC, 'cited in the Hermetic & alchemical corpora'),
];

const MED = { tradition: 'Hermetism', era: 'medieval', discipline: 'Hermetism' };
export const MEDIEVAL_HERMETICA_CARDS = [
  txt('mhr:picatrix', 'The Picatrix', 'The Ghayat al-Hakim, “the goal of the wise,” an Arabic and then Latin manual of astral and talismanic magic drawing on Hermetic and Sabian sources.', ['saturn', 'sol'], { ...MED, tradition: 'Hermetic magic' }, 'Picatrix / Ghayat al-Hakim (c. 1000; Latin 1256)'),
  txt('mhr:liber-hermetis', 'The Liber Hermetis', 'An astrological Hermetica of the decans and the fixed stars, transmitting Egyptian star-lore to the Latin Middle Ages.', ['saturn'], MED, 'Liber Hermetis (Latin transmission)'),
  txt('mhr:24philosophers', 'The Book of the Twenty-Four Philosophers', 'A pseudo-Hermetic collection of definitions of God — “an infinite sphere whose centre is everywhere, circumference nowhere.”', ['sol'], MED, 'Liber XXIV philosophorum (12th c.)'),
  fig('mhr:bernardus', 'Bernardus Silvestris', 'His Cosmographia stages the fashioning of the universe and of Man in a Platonic-Hermetic key at the School of Chartres.', ['mercury-spirit'], MED, 'Bernardus Silvestris, Cosmographia (c. 1147)'),
  fig('mhr:alan', 'Alan of Lille', 'The “Universal Doctor”; his Anticlaudianus and Plaint of Nature personify Nature as God’s vicar in a Neoplatonic cosmos.', ['venus'], MED, 'Alan of Lille, Anticlaudianus (c. 1182)'),
  fig('mhr:hortulanus', 'Hortulanus', 'The medieval commentator whose gloss made the Emerald Tablet legible as a recipe for the alchemical Work.', ['sol'], { ...MED, discipline: 'alchemy' }, 'Hortulanus, Commentary on the Emerald Tablet (14th c.)'),
  fig('mhr:daniel-morley', 'Daniel of Morley', 'Carried Arabic astrology and natural philosophy from Toledo to England, an agent of the twelfth-century transmission.', ['mercury'], MED, 'Daniel of Morley, Philosophia (c. 1175)'),
];

export const ANCIENT_HERMETICA_PACK: DlcPack = { id: 'dlc:herm-ancient', name: 'Ancient Hermetists', description: 'Hermes Trismegistus and the Greek-Egyptian Hermetica — Poimandres, the Asclepius, the Emerald Tablet.', cards: ANCIENT_HERMETICA_CARDS };
export const MEDIEVAL_HERMETICA_PACK: DlcPack = { id: 'dlc:herm-medieval', name: 'Medieval Hermetists', description: 'The medieval transmission — the Picatrix, the Liber Hermetis, the School of Chartres, the Tablet’s glossators.', cards: MEDIEVAL_HERMETICA_CARDS };
