import type { CardDef } from '../../engine/types';

// SOCIETAS MAGICA DLC — the FIGURES, CONCEPTS, and PLACES of pre-modern learned magic (the subject
// matter studied in the academic field of magic studies). Per the user's instruction we name only
// the historical subjects, never living scholars. All cards are grounded + cited and carry glyph
// attributions per docs/CARD_STYLE_GUIDE.md so they play as real game pieces. A starter exemplar set —
// the corpus (data/corpus) supplies the thousands; these demonstrate the style.

interface DlcPack { id: string; name: string; description: string; cards: CardDef[] }

const F = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef: string, portal?: string): CardDef =>
  ({ id: `sm:${id}`, cls: 'figure', name, text, glyphs, correspondences: { ...corr, field: 'learned magic' }, sourceRef, ...(portal ? { portal } : {}) });
const C = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef = 'alchemical & magical tradition'): CardDef =>
  ({ id: `sm:c-${id}`, cls: 'concept', name, text, glyphs, correspondences: { ...corr, field: 'learned magic' }, sourceRef });
const L = (id: string, name: string, text: string, glyphs: string[], corr: Record<string, string>, sourceRef = 'history of magic'): CardDef =>
  ({ id: `sm:l-${id}`, cls: 'concept', name, text, glyphs, correspondences: { ...corr, kind: 'place', field: 'learned magic' }, sourceRef });

const FIGURES: CardDef[] = [
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

const CONCEPTS: CardDef[] = [
  C('magnum-opus', 'The Great Work', 'The alchemists’ total labour — perfecting base matter into the Stone, and the operator’s soul along with it.', ['sol'], { discipline: 'alchemy', stage: 'opus' }),
  C('prima-materia', 'Prima Materia', 'The formless first matter, despised and everywhere, on which the whole Work must begin.', ['earth', 'mercury-spirit'], { discipline: 'alchemy' }),
  C('nigredo', 'Nigredo', 'The blackening — putrefaction and dissolution, the necessary death before any rebirth.', ['saturn'], { stage: 'nigredo', operation: 'Putrefaction' }),
  C('albedo', 'Albedo', 'The whitening — washing and purification under the Moon, the dawn after the dark.', ['luna'], { stage: 'albedo' }),
  C('rubedo', 'Rubedo', 'The reddening — the marriage made permanent, completion in the red Stone.', ['sol'], { stage: 'rubedo', operation: 'Projection' }),
  C('coniunctio', 'Coniunctio', 'The chymical wedding of Sol and Luna into one body — the reconciliation of opposites.', ['sol', 'luna'], { operation: 'Conjunction' }),
  C('solve-coagula', 'Solve et Coagula', 'Dissolve and recombine — the breathing rhythm of every alchemical operation.', ['taurus', 'libra'], { discipline: 'alchemy' }),
  C('quintessence', 'Quintessence', 'The fifth essence distilled out of the four elements — incorruptible, the vehicle of virtue.', ['mercury-spirit'], { discipline: 'alchemy' }),
  C('macrocosm', 'Microcosm & Macrocosm', '“As above, so below” — the human being mirrors the cosmos, and so can be worked upon by the stars.', ['sol', 'mercury-spirit'], { discipline: 'Hermetica' }),
  C('sympathy', 'Sympathy & Antipathy', 'The hidden loves and hatreds binding all things — the natural magician’s lever upon the world.', ['venus', 'mars'], { discipline: 'natural magic' }),
  C('signatures', 'The Doctrine of Signatures', 'Each created thing wears an outward sign of its inner virtue, for the wise to read.', ['venus'], { discipline: 'natural magic' }),
  C('spiritus-mundi', 'Spiritus Mundi', 'The world-soul, the astral light — the subtle medium through which celestial powers descend.', ['mercury-spirit', 'air'], { discipline: 'Neoplatonism' }),
  C('theurgy', 'Theurgy', 'Ritual ascent of the soul toward union with the divine — magic as worship, not coercion.', ['sol', 'mercury-spirit'], { discipline: 'Neoplatonism' }),
  C('talisman', 'Talismanic Magic', 'Capturing a star’s virtue in an image cut at the proper hour, that it might act below.', ['saturn', 'sol'], { discipline: 'astral magic' }),
];

const PLACES: CardDef[] = [
  L('alexandria', 'Alexandria', 'Crucible of the Hermetica and of Greco-Egyptian alchemy, where Greek philosophy met Egyptian craft.', ['mercury-spirit'], { discipline: 'Hermetica' }),
  L('harran', 'Harran', 'The Sabian city whose surviving star-worship fed the astral magic of the medieval Arabic world.', ['saturn'], { discipline: 'astral magic' }),
  L('toledo', 'Toledo', 'Where twelfth-century translators turned the Arabic sciences — and their magic — into Latin.', ['mercury'], { discipline: 'translation' }),
  L('florence', 'Florence', 'Ficino’s Platonic Academy under Medici patronage revived Plato, Plotinus, and the Hermetica.', ['sol', 'jupiter'], { discipline: 'Renaissance magic' }),
  L('cracow', 'Cracow', 'A university hub where the learned magic of Central Europe was copied, taught, and debated.', ['mercury'], { discipline: 'magic manuscripts' }),
  L('prague', 'Prague', 'Rudolf II’s imperial court drew alchemists, astrologers, and John Dee to its laboratories.', ['mercury', 'saturn'], { discipline: 'alchemy' }),
  L('padua', 'Padua', 'Seat of astrological medicine, where the stars were read into the diagnosis of the body.', ['saturn'], { discipline: 'astrological medicine' }),
  L('sponheim', 'Sponheim', 'Trithemius’s Benedictine abbey, famed for a library that drew scholars from across Europe.', ['mercury'], { discipline: 'monastic learning' }),
  L('mortlake', 'Mortlake', 'John Dee’s house on the Thames held the greatest private library in Elizabethan England.', ['luna', 'mercury'], { discipline: 'angelic magic' }),
  L('montpellier', 'Montpellier', 'A medieval school of medicine where physic was bound to astrology and the virtues of herbs.', ['venus'], { discipline: 'astral medicine' }),
];

export const SOCIETAS_MAGICA_PACKS: DlcPack[] = [
  { id: 'dlc:sm-figures', name: 'Societas Magica · Figures of Learned Magic', description: 'Pre-modern figures of learned magic — Hermes to Paracelsus.', cards: FIGURES },
  { id: 'dlc:sm-concepts', name: 'Societas Magica · Concepts of the Art', description: 'The governing ideas of alchemy and learned magic — the Great Work, the coniunctio, sympathy & antipathy…', cards: CONCEPTS },
  { id: 'dlc:sm-places', name: 'Societas Magica · Places of Learned Magic', description: 'The cities, courts, and libraries where magic was made, translated, and taught.', cards: PLACES },
];
