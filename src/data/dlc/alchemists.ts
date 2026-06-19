import { fig, txt, type DlcPack } from './_card';

// ALCHEMISTS — four packs across the tradition's history. Sober, cited. Arabic figures grounded in
// E:\pdf\alchemy\Arabic alchemy (Pseudo-Geber's Summa Perfectionis, the Turba Philosophorum, the
// Zosimos Arabus). Glyphs per the style guide.

const ANCIENT = { tradition: 'Greek alchemy', era: 'ancient', discipline: 'alchemy' };
export const ANCIENT_ALCHEMY_CARDS = [
  fig('anc:zosimos', 'Zosimos of Panopolis', 'The earliest substantial Greek alchemical author; his visions of the flaying and reconstitution of a homunculus fuse laboratory practice with the soul’s purification.', ['mercury-spirit', 'sol'], ANCIENT, 'Zosimos, Authentic Memoirs (c. 300 CE)', 'hermeticdb'),
  fig('anc:maria', 'Maria the Jewess', 'Reputed inventor of the water-bath (bain-marie), the tribikos, and the kerotakis; the axiom “one becomes two, two becomes three” is hers.', ['water', 'mercury'], ANCIENT, 'cited in Zosimos (c. 1st–3rd c. CE)'),
  fig('anc:cleopatra', 'Cleopatra the Alchemist', 'Author of the Chrysopoeia, whose diagrams of the ouroboros and the still set out the making of gold as a self-devouring cycle.', ['sol', 'luna'], ANCIENT, 'Cleopatra, Chrysopoeia (c. 1st–3rd c. CE)'),
  fig('anc:democritus', 'Pseudo-Democritus', 'The Physika kai Mystika, ascribed to Democritus and linked to Bolos of Mendes, is the foundational handbook of dyeing and transmutation.', ['mercury'], ANCIENT, 'Pseudo-Democritus, Physika kai Mystika (c. 1st c. CE)'),
  fig('anc:ostanes', 'Ostanes', 'The legendary Persian magus invoked as teacher of the Greek alchemists — “nature rejoices in nature” is attributed to his lineage.', ['saturn'], { ...ANCIENT, tradition: 'Persian-Greek' }, 'cited in the Greek alchemical corpus'),
  fig('anc:olympiodorus', 'Olympiodorus', 'His commentary on Zosimos and on “the energy of the philosophers” reads the art philosophically, harmonising it with Neoplatonism.', ['mercury-spirit'], ANCIENT, 'Olympiodorus, On the Sacred Art (c. 6th c. CE)'),
  fig('anc:synesius', 'Synesius', 'The dialogue addressed to Dioscorus interprets Pseudo-Democritus allegorically, an early turn toward inner alchemy.', ['mercury-spirit'], ANCIENT, 'Synesius, Commentary on Democritus (c. 4th c. CE)'),
  fig('anc:stephanus', 'Stephanus of Alexandria', 'Delivered nine lectures “on the great and sacred art” at the court of Heraclius, joining alchemy to cosmology and astrology.', ['sol'], ANCIENT, 'Stephanus, On the Great Art (c. 610–641 CE)'),
];

const ARABIC = { tradition: 'Arabic alchemy', era: 'medieval', discipline: 'alchemy' };
export const ARABIC_ALCHEMY_CARDS = [
  fig('ara:jabir', 'Jabir ibn Hayyan', 'The vast Jabirian corpus founds the theory of the balance — that every body is composed of the four natures in measurable proportion — and of the elixir that perfects them.', ['mercury', 'sulphur', 'salt'], ARABIC, 'Jabir, Kitab al-Mizan (8th–10th c.)'),
  fig('ara:razi', 'Abu Bakr al-Razi', 'Rhazes gave alchemy a sober, laboratory cast: his Secret of Secrets classifies substances and apparatus and sets out clear operations, against mystification.', ['mercury', 'salt'], ARABIC, 'al-Razi, Sirr al-asrar (c. 900)'),
  fig('ara:ibn-umayl', 'Ibn Umayl', 'Senior Zadith to the Latins; his Silvery Water and Starry Earth, the “Book of Pictures,” reads ancient symbols and was widely copied in the West.', ['luna', 'water'], ARABIC, "Ibn Umayl, al-Ma' al-waraqi (c. 950)"),
  fig('ara:khalid', 'Khalid ibn Yazid', 'The Umayyad prince to whom Arabic tradition ascribed the first translations of alchemy from Greek — a foundational legend of the art’s transmission.', ['sol'], ARABIC, 'attributed; cited by Ibn al-Nadim, Fihrist (10th c.)'),
  txt('ara:turba', 'The Turba Philosophorum', 'The “Assembly of the Philosophers,” an Arabic dialogue staging the pre-Socratic sages on first matter, became one of the most influential alchemical texts in Latin Europe.', ['mercury-spirit'], ARABIC, 'Turba Philosophorum (c. 900; Latin 12th c.)'),
  fig('ara:tughrai', "al-Tughra'i", 'Poet and alchemist; his Lamps of Wisdom defended the art against Avicenna’s denial that one species could be transmuted into another.', ['sol'], ARABIC, "al-Tughra'i, Masabih al-hikma (c. 1120)"),
  fig('ara:jildaki', 'al-Jildaki', 'The great Mamluk-era encyclopedist whose immense commentaries preserve and systematise centuries of Arabic alchemical learning.', ['mercury-spirit'], ARABIC, 'al-Jildaki, Nihayat al-talab (14th c.)'),
  txt('ara:summa', 'Pseudo-Geber · Summa Perfectionis', 'The Latin Summa, long ascribed to Geber, gave Europe a rigorous corpuscular theory of metals and became the most authoritative medieval alchemy.', ['mercury', 'sulphur'], { ...ARABIC, tradition: 'Latin (pseudo-Geber)' }, 'Pseudo-Geber, Summa Perfectionis (late 13th c.)'),
];

const MED = { tradition: 'Latin alchemy', era: 'medieval', discipline: 'alchemy' };
export const MEDIEVAL_ALCHEMY_CARDS = [
  fig('mda:arnald', 'Arnald of Villanova', 'Physician to popes and kings; the alchemical works under his name bind the elixir to medicine and the prolongation of life.', ['venus', 'mercury'], MED, 'attrib. Arnald, Rosarius philosophorum (c. 1300)'),
  fig('mda:rupescissa', 'John of Rupescissa', 'The Franciscan visionary distilled a “quintessence” from wine as a heavenly medicine, and read alchemy through an apocalyptic lens.', ['mercury-spirit'], MED, 'Rupescissa, De consideratione quintae essentiae (c. 1351)'),
  fig('mda:petrus-bonus', 'Petrus Bonus', 'His Pretiosa Margarita Novella argues that alchemy is a true and partly divine science, anticipating its perfection of nature.', ['sol'], MED, 'Petrus Bonus, Pretiosa Margarita Novella (1330)'),
  fig('mda:ripley', 'George Ripley', 'The Augustinian canon’s Compound of Alchymy set the Work as twelve “gates,” a scheme English adepts followed for centuries.', ['sol', 'luna'], MED, 'Ripley, The Compound of Alchymy (1471)'),
  fig('mda:norton', 'Thomas Norton', 'His Ordinall of Alchimy, in English verse, teaches the art’s secrecy, cost, and the rare grace required of its practitioner.', ['mercury'], MED, 'Norton, Ordinall of Alchimy (1477)'),
  fig('mda:flamel', 'Nicolas Flamel', 'The Parisian scrivener whose posthumous legend made him an adept who read the Book of Abraham the Jew and achieved the Stone.', ['sol'], MED, 'legend; Livre des figures hiéroglyphiques (attrib., later)'),
  fig('mda:bernard', 'Bernard of Treviso', 'His allegory of the long, costly quest for the Stone became a byword for the seeker misled by false books and false masters.', ['mercury-spirit'], MED, 'Bernard of Treviso (15th c.)'),
  fig('mda:michael-scot', 'Michael Scot', 'Court scholar and astrologer to Frederick II; translator of Aristotle and Averroes, credited with alchemical and magical works.', ['saturn'], MED, 'attrib.; cited at Frederick II’s court (c. 1230)'),
];

const EM = { tradition: 'early modern alchemy', era: 'early modern', discipline: 'alchemy' };
export const EARLY_MODERN_ALCHEMY_CARDS = [
  fig('ema:paracelsus', 'Paracelsus', 'Founder of iatrochemistry; his tria prima of Sulphur, Salt, and Mercury and his chemical medicine overturned humoral physic.', ['sulphur', 'salt', 'mercury-spirit'], EM, 'Paracelsus, Opus Paramirum (1531)', 'hermeticdb'),
  fig('ema:dee', 'John Dee', 'The Monas Hieroglyphica condensed cosmos and alchemy into a single sign; his angelic conversations sought a universal restoration of knowledge.', ['mercury', 'luna'], EM, 'Dee, Monas Hieroglyphica (1564)'),
  fig('ema:khunrath', 'Heinrich Khunrath', 'His Amphitheatre of Eternal Wisdom fused Paracelsian alchemy, Kabbalah, and prayer into a theosophical laboratory-oratory.', ['sol', 'mercury-spirit'], EM, 'Khunrath, Amphitheatrum Sapientiae Aeternae (1595)'),
  fig('ema:maier', 'Michael Maier', 'Physician to Rudolf II; his Atalanta Fugiens set fifty alchemical emblems to epigram and fugue, an alchemy for eye, mind, and ear.', ['sol', 'venus'], EM, 'Maier, Atalanta Fugiens (1618)'),
  fig('ema:fludd', 'Robert Fludd', 'His History of the Two Worlds drew the macrocosm and microcosm as a single harmonic engine, defending the Rosicrucians and Paracelsian medicine.', ['sol', 'luna'], EM, 'Fludd, Utriusque Cosmi Historia (1617–1621)'),
  fig('ema:van-helmont', 'Jan Baptist van Helmont', 'The Helmontian chymist coined “gas,” sought the universal solvent (the alkahest), and made the Paracelsian art an experimental philosophy of matter.', ['water', 'mercury'], EM, 'van Helmont, Ortus Medicinae (1648)'),
  fig('ema:starkey', 'George Starkey', 'Writing as Eirenaeus Philalethes, the colonial chymist’s sophic mercury was studied closely by Boyle and Newton.', ['mercury', 'sulphur'], EM, 'Philalethes, Introitus Apertus (1667)'),
  fig('ema:ashmole', 'Elias Ashmole', 'Antiquary and founding Fellow of the Royal Society; his Theatrum Chemicum Britannicum gathered and preserved English alchemical verse.', ['salt'], EM, 'Ashmole, Theatrum Chemicum Britannicum (1652)'),
  fig('ema:newton', 'Isaac Newton', 'Across a million unpublished words he pursued the vegetable spirit and the sophic mercury, reading the alchemical adepts as keepers of an ancient wisdom.', ['sol', 'mercury'], EM, "Newton's alchemical manuscripts (c. 1668–1696)"),
];

export const ANCIENT_ALCHEMY_PACK: DlcPack = { id: 'dlc:alc-ancient', name: 'Ancient Alchemists · Graeco-Egyptian', description: 'The Greek-Egyptian founders: Zosimos, Maria, Cleopatra, Pseudo-Democritus, and their commentators.', cards: ANCIENT_ALCHEMY_CARDS };
export const ARABIC_ALCHEMY_PACK: DlcPack = { id: 'dlc:alc-arabic', name: 'Arabic Alchemists', description: 'Jabir, al-Razi, Ibn Umayl and the texts (the Turba, the Summa) through which Arabic alchemy reached the West.', cards: ARABIC_ALCHEMY_CARDS };
export const MEDIEVAL_ALCHEMY_PACK: DlcPack = { id: 'dlc:alc-medieval', name: 'Medieval Alchemists · Latin West', description: 'The Latin adepts — Arnald, Rupescissa, Ripley, Norton — and their schemes of the Work.', cards: MEDIEVAL_ALCHEMY_CARDS };
export const EARLY_MODERN_ALCHEMY_PACK: DlcPack = { id: 'dlc:alc-earlymodern', name: 'Early Modern Alchemists', description: 'From Paracelsus and Dee to van Helmont, Starkey, and Newton — alchemy at the threshold of chemistry.', cards: EARLY_MODERN_ALCHEMY_CARDS };
