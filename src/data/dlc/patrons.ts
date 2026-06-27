import type { DlcPack } from './_card';
import { fig } from './_card';

// MEDIEVAL & RENAISSANCE PATRONAGE DLC — the rulers, dynasts, prelates, bankers, and court women who
// materially shaped the production of art, books, instruments, astronomy, and alchemy (c. 800–1650).
// Translated from docs/research/MEDIEVAL_RENAISSANCE_PATRONAGE_SOURCEBOOK.md, which is the grounding
// authority for every card here: roster table, glyph-attribution discipline, and Appendix-A templates.
// Per docs/CARD_STYLE_GUIDE.md §0 we name only historical figures; cards carry real sourceRefs and
// glyph attributions per the sourcebook's "Glyph Attribution for Patrons" section. Each unique patron
// is defined ONCE as a const, then composed into the five named expansion packs (patrons recur across
// packs by design — the same object, so ids stay identical).

// — Patron card consts (id: `patron:<slug>`) — alphabetical by slug —————————————————————————————

const alfonsoX = fig('patron:alfonso-x', 'Alfonso X of Castile',
  'Alfonso made kingship a translation engine, sponsoring astronomical, legal, historical, and musical works that moved Arabic and Andalusian learning through Castilian and Latin forms.',
  ['mercury', 'jupiter', 'aquarius'],
  { planet: 'Mercury', discipline: 'medieval science patronage', field: 'astronomy' },
  'Library of Congress; ISMI');

const alMamun = fig('patron:al-mamun', "al-Ma'mun",
  "The Abbasid caliph al-Ma'mun made Baghdad a focus of caliphal patronage, funding translators, libraries, and astronomical observation that carried Greek, Syriac, Persian, and Indian learning into Arabic.",
  ['mercury', 'jupiter', 'cancer'],
  { planet: 'Mercury', discipline: 'medieval science patronage', field: 'translation' },
  'Gutas, Greek Thought, Arabic Culture; ISMI');

const anneOfBrittany = fig('patron:anne-of-brittany', 'Anne of Brittany',
  'Twice queen of France, Anne of Brittany used books of hours, devotional manuscripts, and dynastic display to assert Breton identity and queenly legitimacy on costly vellum.',
  ['luna', 'venus', 'earth'],
  { planet: 'Moon', discipline: 'late medieval patronage', field: 'manuscripts' },
  'Met, Patronage at the Early Valois Courts');

const baysunghur = fig('patron:baysunghur', 'Baysunghur',
  'The Timurid prince Baysunghur ran a Herat atelier where calligraphers, painters, and editors produced refined manuscripts and corrected texts, making textual editing itself a princely craft.',
  ['mercury', 'gemini', 'venus'],
  { planet: 'Mercury', operation: 'Separation', discipline: 'Timurid manuscript patronage', field: 'manuscripts' },
  'Institute for Advanced Study, Baysunghur manuscript patronage');

const catherineDeMedici = fig('patron:catherine-de-medici', "Catherine de' Medici",
  'As queen and regent of France, Catherine de’ Medici staged festivals, architecture, and portraiture as instruments of monarchy, fashioning dynastic image amid confessional war.',
  ['luna', 'venus', 'sulphur'],
  { planet: 'Moon', principle: 'Sulphur', discipline: 'Renaissance court patronage', field: 'spectacle' },
  'Met, Patronage at the Early Valois Courts; Medici Archive Project');

const charlesV = fig('patron:charles-v-france', 'Charles V of France',
  'Charles V "the Wise" gathered a royal library in the Louvre and commissioned translations and architecture, binding learning and kingship into an apparatus of royal memory.',
  ['jupiter', 'saturn', 'capricorn'],
  { planet: 'Jupiter', operation: 'Fixation', discipline: 'late medieval patronage', field: 'libraries' },
  'Met, Patronage at the Early Valois Courts');

const christinaRegency = fig('patron:christina-regency', 'Christina of Lorraine & Maria Maddalena of Austria',
  'The Medici regents Christina of Lorraine and Maria Maddalena of Austria sustained dynastic science, devotion, and court culture in Florence during the minority of their heir.',
  ['luna', 'jupiter', 'salt'],
  { planet: 'Moon', principle: 'Salt', discipline: 'court science', field: 'regency culture' },
  'Medici Archive Project; Museo Galileo');

const cosimoDeMedici = fig('patron:cosimo-de-medici', "Cosimo de' Medici",
  "Cosimo's banking fortune and political authority supported Florentine building, sculpture, libraries, and humanist learning, making patronage a quiet instrument of civic rule.",
  ['jupiter', 'sol', 'mercury-spirit'],
  { planet: 'Jupiter', discipline: 'Renaissance patronage', field: 'Florence' },
  'Met Heilbrunn; Medici Archive Project');

const cosimoIDeMedici = fig('patron:cosimo-i-de-medici', "Cosimo I de' Medici",
  'As first grand duke of Tuscany, Cosimo I turned patronage into statecraft, founding academies and commissioning architecture and collections that projected a consolidated princely image.',
  ['jupiter', 'sol', 'earth'],
  { planet: 'Jupiter', discipline: 'Renaissance court patronage', field: 'state image' },
  'Met, Florence and Central Italy 1400-1600; Medici Archive Project');

const cosimoIIDeMedici = fig('patron:cosimo-ii-de-medici', "Cosimo II de' Medici",
  "Cosimo II gave Galileo a courtly platform where telescopic discovery became dynastic emblem, with Jupiter's moons renamed the Medicean Stars.",
  ['jupiter', 'mercury', 'sol'],
  { planet: 'Jupiter', discipline: 'court science', field: 'astronomy' },
  'The Galileo Project; Museo Galileo');

const elizabethI = fig('patron:elizabeth-i', 'Queen Elizabeth I',
  'Elizabeth I ruled through spectacle, sponsoring court display, navigation, and the intelligence and occult networks that gathered around figures such as John Dee.',
  ['luna', 'mercury', 'venus'],
  { planet: 'Moon', discipline: 'Renaissance court patronage', field: 'court spectacle' },
  'Met Heilbrunn, English Renaissance court');

const federicoMontefeltro = fig('patron:federico-montefeltro', 'Federico da Montefeltro',
  'Federico turned condottiere income into Urbino court culture, joining armor, books, architecture, and perspectival studiolo imagery into a humanist image of rulership.',
  ['mars', 'jupiter', 'virgo'],
  { planet: 'Mars', operation: 'Distillation', discipline: 'Renaissance court patronage' },
  'Italian Renaissance Learning Resources; Met Publications');

const francisI = fig('patron:francis-i', 'Francis I of France',
  'Francis I drew Italian artists and humanists to Fontainebleau, raising royal art, architecture, and learning into instruments of magnificence and a French golden age.',
  ['sol', 'jupiter', 'sagittarius'],
  { planet: 'Sun', operation: 'Exaltation', discipline: 'Renaissance court patronage', field: 'royal art' },
  'Met Heilbrunn, French court patronage');

const gawharShad = fig('patron:gawhar-shad', 'Gawhar Shad',
  'The Timurid queen Gawhar Shad financed mosques, madrasas, and shrines at Herat and Mashhad, making architectural piety a durable expression of dynastic and devotional authority.',
  ['luna', 'earth', 'jupiter'],
  { planet: 'Moon', discipline: 'Timurid patronage', field: 'architecture' },
  'Met, Timurid art and architecture');

const henryLancastrian = fig('patron:henry-lancastrian', 'The Lancastrian Court (Henry V & Henry VI)',
  'The Lancastrian kings Henry V and Henry VI cultivated royal image through manuscripts, chapel foundation, and conquest legitimacy, binding piety and dynasty to the claim on France.',
  ['mars', 'jupiter', 'luna'],
  { planet: 'Mars', discipline: 'late medieval patronage', field: 'royal image' },
  'Met, Patronage at the Early Valois Courts');

const isabellaDeste = fig('patron:isabella-deste', "Isabella d'Este",
  'Isabella used letters, agents, collecting, portraiture, music, and the studiolo to make taste itself a courtly instrument of memory, diplomacy, and authority.',
  ['venus', 'mercury', 'luna'],
  { planet: 'Venus', discipline: 'Renaissance collecting', field: 'studiolo' },
  'Italian Renaissance Learning Resources; Smarthistory');

const jeanDeBerry = fig('patron:jean-de-berry', 'Jean, duc de Berry',
  'Jean de Berry transformed devotion, luxury, and dynastic memory into illuminated books, jewels, and tomb sculpture; his manuscripts make sacred time visible as aristocratic possession.',
  ['luna', 'saturn', 'capricorn'],
  { planet: 'Moon', operation: 'Fixation', discipline: 'late medieval patronage' },
  'Met Heilbrunn');

const juliusII = fig('patron:julius-ii', 'Pope Julius II',
  'The "warrior pope" Julius II yoked papal monarchy to monumental art, commissioning Michelangelo, Raphael, and Bramante to rebuild Rome as an image of the Church triumphant.',
  ['mars', 'sol', 'capricorn'],
  { planet: 'Mars', operation: 'Fixation', discipline: 'papal patronage', field: 'Rome' },
  'Met Heilbrunn, Rome in the High Renaissance');

const leoX = fig('patron:leo-x', 'Pope Leo X',
  'The Medici pope Leo X carried Florentine taste to Rome, lavishing wealth on music, letters, and art and treating the papacy itself as a stage for humanist magnificence.',
  ['sol', 'venus', 'jupiter'],
  { planet: 'Sun', discipline: 'papal patronage', field: 'Rome' },
  'Met Heilbrunn; Medici Archive Project');

const lorenzoDeMedici = fig('patron:lorenzo-de-medici', "Lorenzo de' Medici",
  'Lorenzo "the Magnificent" gathered poets, artists, and philosophers into a Florentine circle, joining diplomacy, verse, and patronage so that learning and art served Medici brokerage.',
  ['sol', 'venus', 'mercury-spirit'],
  { planet: 'Sun', discipline: 'Renaissance patronage', field: 'Florence' },
  'Met, Florence and Central Italy 1400-1600; Medici Archive Project');

const ludovicoSforza = fig('patron:ludovico-sforza', 'Ludovico Sforza',
  'Ludovico "il Moro" Sforza made Milan a theater of court spectacle, employing Leonardo da Vinci and Bramante on engineering, painting, and festival to dignify a contested dukedom.',
  ['mars', 'venus', 'sulphur'],
  { planet: 'Mars', principle: 'Sulphur', discipline: 'Renaissance court patronage', field: 'Milan' },
  'Met, Florence and Central Italy 1400-1600');

const margaretOfAustria = fig('patron:margaret-of-austria', 'Margaret of Austria',
  'Regent of the Netherlands, Margaret of Austria gathered music, painting, and learning at Mechelen, joining diplomacy and education into a Habsburg court of refined sociability.',
  ['venus', 'mercury', 'jupiter'],
  { planet: 'Venus', discipline: 'Renaissance court patronage', field: 'music' },
  'Met, Burgundian Netherlands: Court Life and Patronage');

const maximilianI = fig('patron:maximilian-i', 'Maximilian I',
  'The Habsburg emperor Maximilian I harnessed the printing press to chivalric memory, commissioning printed monuments and genealogies that turned dynastic propaganda into reproducible image.',
  ['mars', 'saturn', 'aquarius'],
  { planet: 'Mars', operation: 'Multiplication', discipline: 'imperial patronage', field: 'print' },
  'Met Heilbrunn, the Holy Roman Empire');

const nicholasV = fig('patron:nicholas-v', 'Pope Nicholas V',
  'The humanist pope Nicholas V founded the Vatican Library and planned the rebuilding of Rome, making book collection and architecture pillars of a renewed papal capital.',
  ['jupiter', 'sol', 'capricorn'],
  { planet: 'Jupiter', operation: 'Fixation', discipline: 'papal patronage', field: 'libraries' },
  'Met Heilbrunn, Rome; Vatican Library');

const philipTheBold = fig('patron:philip-the-bold', 'Philip the Bold of Burgundy',
  'Philip the Bold founded the Charterhouse of Champmol and its dynastic tombs, employing sculptors such as Claus Sluter to make Burgundian magnificence permanent in stone.',
  ['mars', 'saturn', 'capricorn'],
  { planet: 'Saturn', operation: 'Fixation', discipline: 'late medieval patronage', field: 'sculpture' },
  'Met, Burgundian Netherlands: Court Life and Patronage');

const philipTheGood = fig('patron:philip-the-good', 'Philip the Good of Burgundy',
  'Philip the Good made the Burgundian court a model of ritual splendor, founding the Order of the Golden Fleece and amassing manuscripts that fused chivalry, piety, and political display.',
  ['jupiter', 'venus', 'mars'],
  { planet: 'Jupiter', discipline: 'late medieval patronage', field: 'manuscripts' },
  'Met, Burgundian Netherlands: Court Life and Patronage');

const rudolfII = fig('patron:rudolf-ii', 'Rudolf II',
  'Rudolfine Prague gathered painters, astronomers, instrument makers, collectors, and alchemists into an imperial theater of wonder, secrecy, and natural philosophy.',
  ['mercury', 'saturn', 'sulphur'],
  { planet: 'Mercury', principle: 'Sulphur', discipline: 'alchemy and court science' },
  'Met Heilbrunn; Evans; Marshall');

const shahRukh = fig('patron:shah-rukh', 'Shah Rukh',
  'The Timurid sovereign Shah Rukh ruled from Herat, sponsoring histories, manuscripts, and architecture that asserted dynastic legitimacy and gathered the arts of the book.',
  ['jupiter', 'saturn', 'salt'],
  { planet: 'Jupiter', principle: 'Salt', discipline: 'Timurid patronage', field: 'manuscripts' },
  'Met, Timurid art and architecture');

const suleiman = fig('patron:suleiman', 'Suleiman the Magnificent',
  'The Ottoman sultan Suleiman the Magnificent reshaped Istanbul through Sinan’s architecture, codified law, and imperial craft, making magnificence an instrument of dynastic and legal order.',
  ['sol', 'jupiter', 'libra'],
  { planet: 'Sun', operation: 'Coagulation', discipline: 'imperial patronage', field: 'architecture' },
  'Met Heilbrunn, the Ottoman court');

const ulughBeg = fig('patron:ulugh-beg', 'Ulugh Beg',
  'The Timurid prince Ulugh Beg built a great observatory and madrasa at Samarkand, where astronomers compiled star tables that ranked among the most precise of the pre-telescopic age.',
  ['mercury', 'air', 'libra'],
  { planet: 'Mercury', operation: 'Coagulation', discipline: 'medieval astronomy patronage', field: 'astronomy' },
  "University of Washington Silk Road Seattle, Ulugh Beg's Observatory");

// — The five named expansion packs (per the sourcebook's "Next Expansion Packs") ——————————————————

export const WOMEN_PATRONS_PACK: DlcPack = {
  id: 'patron:women',
  name: 'Patrons · Women of the Courts',
  description: 'Queens, regents, and marchionesses who wielded letters, collecting, music, devotion, and dynastic display as instruments of authority.',
  cards: [isabellaDeste, margaretOfAustria, anneOfBrittany, gawharShad, catherineDeMedici, elizabethI, christinaRegency],
};

export const ASTRONOMY_INSTRUMENT_PATRONS_PACK: DlcPack = {
  id: 'patron:astronomy',
  name: 'Patrons · Astronomy & Instruments',
  description: 'Rulers who funded observatories, star tables, and mathematical instruments, from Abbasid Baghdad to Medicean Florence.',
  cards: [alMamun, alfonsoX, ulughBeg, rudolfII, cosimoIIDeMedici, baysunghur],
};

export const MANUSCRIPT_COURTS_PACK: DlcPack = {
  id: 'patron:manuscript',
  name: 'Patrons · Manuscript Courts',
  description: 'Courts where vellum, gold, and calligraphy made devotion, memory, and dynasty visible in the illuminated book.',
  cards: [jeanDeBerry, charlesV, philipTheGood, baysunghur, anneOfBrittany, alfonsoX],
};

export const ALCHEMY_KUNSTKAMMER_PACK: DlcPack = {
  id: 'patron:alchemy',
  name: 'Patrons · Alchemy & Kunstkammer',
  description: 'Princes whose laboratories, cabinets, and scientific collections joined alchemy, astronomy, and the wonders of nature and art.',
  cards: [rudolfII, cosimoIDeMedici, cosimoIIDeMedici, christinaRegency],
};

export const MAGNIFICENCE_PROPAGANDA_PACK: DlcPack = {
  id: 'patron:magnificence',
  name: 'Patrons · Magnificence & Propaganda',
  description: 'Popes, kings, and emperors who turned art, architecture, and spectacle into the propaganda of rule and dynastic memory.',
  cards: [
    juliusII, leoX, francisI, maximilianI, suleiman, catherineDeMedici, philipTheGood,
    federicoMontefeltro, cosimoDeMedici, lorenzoDeMedici, nicholasV, ludovicoSforza,
    philipTheBold, henryLancastrian, shahRukh,
  ],
};

export const PATRON_PACKS: DlcPack[] = [
  WOMEN_PATRONS_PACK,
  ASTRONOMY_INSTRUMENT_PATRONS_PACK,
  MANUSCRIPT_COURTS_PACK,
  ALCHEMY_KUNSTKAMMER_PACK,
  MAGNIFICENCE_PROPAGANDA_PACK,
];
