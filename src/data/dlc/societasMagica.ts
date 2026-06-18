import type { CardDef } from '../../engine/types';

// SOCIETAS MAGICA DLC — a starter, citable selection of the figures, texts, and contemporary
// scholars studied within the academic study of pre-modern learned magic (the Societas Magica and
// its journal *Magic, Ritual, and Witchcraft*). Two packs: HISTORICAL FIGURES and CONTEMPORARY
// SCHOLARS. Figures carry planetary/disciplinary attributes so they connect in the relation engine
// (e.g. Ficino beside a Venus bead surfaces his benefic remedy). This is a starter set the user will
// refine/replace with their own curated list — edit in the Print Shop or swap this file's contents.

interface DlcPack { id: string; name: string; description: string; cards: CardDef[] }

const F = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef: string, portal?: string): CardDef =>
  ({ id: `sm:${id}`, cls: 'figure', name, text, glyphs, correspondences: { ...corr, society: 'Societas Magica' }, sourceRef, ...(portal ? { portal } : {}) });

const HISTORICAL: CardDef[] = [
  F('hermes', 'Hermes Trismegistus', 'Legendary "thrice-great" author of the Hermetica; figurehead of the prisca theologia that licensed Renaissance magic.', ['mercury-spirit', 'sol'], { discipline: 'Hermetica' }, 'Corpus Hermeticum (trans. Ficino, 1471)', 'hermeticdb'),
  F('ficino', 'Marsilio Ficino', 'Florentine Neoplatonist; his De Vita prescribes astral talismans and planetary music to draw down celestial virtues against melancholy.', ['sol', 'jupiter', 'venus'], { planet: 'Sun', discipline: 'Renaissance magic' }, 'Ficino, De Vita Libri Tres (1489)', 'rmdb'),
  F('pico', 'Giovanni Pico della Mirandola', 'Author of the 900 Conclusiones; founder of Christian Kabbalah, who held that magic and Kabbalah prove the divinity of Christ.', ['mercury-spirit'], { discipline: 'Kabbalah' }, 'Pico, Conclusiones (1486)'),
  F('agrippa', 'Heinrich Cornelius Agrippa', 'His De occulta philosophia is the great Renaissance synthesis of natural, celestial, and ceremonial magic in three books.', ['saturn', 'mercury'], { discipline: 'occult philosophy' }, 'Agrippa, De occulta philosophia (1533)', 'rmdb'),
  F('trithemius', 'Johannes Trithemius', 'Abbot of Sponheim; his Steganographia veils cryptography as angelic magic, scandalizing and fascinating his readers.', ['mercury'], { discipline: 'angelic magic' }, 'Trithemius, Steganographia (c. 1499)'),
  F('dee', 'John Dee', 'Elizabethan philosopher; the Monas Hieroglyphica fuses alchemy and cosmology, and his angelic conversations yielded the Enochian system.', ['mercury', 'luna'], { discipline: 'angelic magic' }, 'Dee, Monas Hieroglyphica (1564)'),
  F('bacon', 'Roger Bacon', 'Franciscan; his Opus Majus defends a licit "natural magic" of optics, astrology, and the secret virtues of things.', ['sol'], { discipline: 'natural magic' }, 'Bacon, Opus Majus (1267)'),
  F('albertus', 'Albertus Magnus', 'Dominican master to whom the Speculum astronomiae is ascribed — the medieval attempt to sort licit astrology from illicit magic.', ['jupiter'], { discipline: 'natural philosophy' }, 'Speculum astronomiae (attrib., 13th c.)'),
  F('abano', "Pietro d'Abano", 'Paduan physician-astrologer of the Conciliator; later credited with the Heptameron of planetary ritual magic.', ['saturn'], { discipline: 'astrological magic' }, "d'Abano, Conciliator (1303)"),
  F('llull', 'Ramon Llull', 'His combinatorial Art turned letters and wheels into a logic of the divine names; pseudo-Llullian alchemy followed in his name.', ['mercury-spirit'], { discipline: 'ars combinatoria' }, 'Llull, Ars Magna (1305)'),
  F('honorius', 'Honorius of Thebes', 'Legendary compiler of the Liber Iuratus (Sworn Book) — a ritual magic defended as the secret inheritance of the magi.', ['saturn'], { discipline: 'ritual magic' }, 'Liber Iuratus Honorii (13th–14th c.)'),
  F('paracelsus', 'Paracelsus', 'Physician-magus of the tria prima; his Archidoxis magica binds talismanic, natural, and chymical magic to medicine.', ['sulphur', 'salt', 'mercury-spirit'], { discipline: 'alchemy', principle: 'Sulphur' }, 'Paracelsus, Archidoxis magica (attrib.)', 'hermeticdb'),
];

const S = (id: string, name: string, text: string, focus: string, sourceRef: string): CardDef =>
  ({ id: `sm:sch-${id}`, cls: 'figure', name, text, glyphs: ['mercury-spirit'], correspondences: { discipline: 'history of magic', topic: focus, society: 'Societas Magica' }, sourceRef });

const SCHOLARS: CardDef[] = [
  S('kieckhefer', 'Richard Kieckhefer', 'Mapped the "clerical underworld" of medieval necromancy and the common tradition of learned magic.', 'medieval magic', 'Kieckhefer, Magic in the Middle Ages (1989)'),
  S('fanger', 'Claire Fanger', 'Editor of Conjuring Spirits and Invoking Angels; recovered the devotional angelic magic of John of Morigny and the Ars Notoria.', 'angelic / notory art', 'Fanger (ed.), Invoking Angels (2012)'),
  S('klaassen', 'Frank Klaassen', 'Traced the transformation of ritual and natural magic across the medieval-to-Renaissance manuscript record.', 'magic manuscripts', 'Klaassen, The Transformations of Magic (2013)'),
  S('page', 'Sophie Page', 'Studied monastic magic — the astrological and image magic copied within the cloister of St Augustine’s, Canterbury.', 'monastic magic', 'Page, Magic in the Cloister (2013)'),
  S('lang', 'Benedek Láng', 'Surveyed the circulation of magic texts among the learned of late-medieval Central Europe.', 'Central European magic', 'Láng, Unlocked Books (2008)'),
  S('boudet', 'Jean-Patrice Boudet', 'Charted the medieval field "between science and nigromancy" — astrology, divination, and magic in the Latin West.', 'astrology & magic', 'Boudet, Entre science et nigromance (2006)'),
  S('bailey', 'Michael D. Bailey', 'Historian of magic, superstition, and witchcraft; a founding voice of the journal Magic, Ritual, and Witchcraft.', 'superstition & witchcraft', 'Bailey, Magic and Superstition in Europe (2007)'),
  S('davies', 'Owen Davies', 'Wrote the history of the grimoire — the books of magic themselves, from antiquity to the present.', 'grimoires', 'Davies, Grimoires: A History of Magic Books (2009)'),
  S('veronese', 'Julien Véronèse', 'Critical editor of the Ars Notoria and student of the Liber Iuratus and Solomonic ritual magic.', 'notory art', 'Véronèse, L’Ars notoria au Moyen Âge (2007)'),
  S('rider', 'Catherine Rider', 'Examined magic in everyday medieval life — impotence, healing, and the pastoral response to popular magic.', 'everyday magic', 'Rider, Magic and Impotence in the Middle Ages (2006)'),
];

export const SOCIETAS_MAGICA_PACKS: DlcPack[] = [
  { id: 'dlc:sm-figures', name: 'Societas Magica · Historical Figures', description: 'Pre-modern figures of learned magic studied by the Societas Magica — Hermes to Paracelsus.', cards: HISTORICAL },
  { id: 'dlc:sm-scholars', name: 'Societas Magica · Contemporary Scholars', description: 'Modern historians of pre-modern magic and their signature works.', cards: SCHOLARS },
];
