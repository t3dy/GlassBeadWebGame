import { fig, type DlcPack } from './_card';

// MEDIEVAL SCHOLASTICS — key figures as they bore on metaphysics and the licit/illicit boundary of
// magic. Sober and academic. era: medieval; discipline: scholasticism (with the relevant facet).

const C = { discipline: 'scholasticism', era: 'medieval' };

export const SCHOLASTIC_CARDS = [
  fig('sch:aquinas', 'Thomas Aquinas', 'In the Summa Theologiae the Angelic Doctor fixed the boundary of licit knowledge: angels and demons are real, demons deceive, and most magic implicitly traffics with them — yet the natural virtues of things remain a lawful study.', ['sol'], { ...C, facet: 'angelology' }, 'Aquinas, Summa Theologiae (1265–1274)'),
  fig('sch:albertus', 'Albertus Magnus', 'Aquinas’s teacher; encyclopedist of nature who gathered the occult virtues of stones, plants, and stars, and to whom the Speculum astronomiae’s defence of astrology is ascribed.', ['jupiter'], { ...C, facet: 'natural philosophy' }, 'Albertus Magnus, De mineralibus (c. 1250)'),
  fig('sch:hugh', 'Hugh of St Victor', 'In the Didascalicon he mapped all human knowledge and classed magic among the unlawful arts, even as the Victorine school made contemplation a science of ascent.', ['mercury-spirit'], { ...C, facet: 'classification of knowledge' }, 'Hugh of St Victor, Didascalicon (c. 1127)'),
  fig('sch:eriugena', 'John Scotus Eriugena', 'His Periphyseon set out a Christian Neoplatonism of the fourfold division of nature; his translation of Pseudo-Dionysius carried negative theology into the Latin West.', ['sol', 'mercury-spirit'], { ...C, facet: 'Christian Neoplatonism', era: 'early medieval' }, 'Eriugena, Periphyseon (c. 867)'),
  fig('sch:joachim', 'Joachim of Fiore', 'The Calabrian abbot read history as three ages — Father, Son, and an imminent Age of the Spirit — a prophetic theology that haunted later esoteric and millenarian thought.', ['saturn'], { ...C, facet: 'apocalyptic theology' }, 'Joachim of Fiore, Expositio in Apocalypsim (c. 1196)'),
  fig('sch:lull', 'Ramon Llull', 'His combinatorial Art turned the divine Names into rotating figures, a logic of conversion later read as a key to universal knowledge — and lent its name to a vast pseudo-Lullian alchemy.', ['mercury-spirit'], { ...C, facet: 'ars combinatoria' }, 'Llull, Ars Magna (1305)'),
  fig('sch:henry-ghent', 'Henry of Ghent', 'The leading secular master of late-13th-century Paris; his doctrines of the analogy of being and divine illumination were mined by Duns Scotus and, two centuries on, drawn into Pico della Mirandola’s metaphysics.', ['sol'], { ...C, facet: 'metaphysics of being' }, 'Henry of Ghent, Summa quaestionum ordinariarum (c. 1280)'),
  fig('sch:bonaventure', 'Bonaventure', 'The Seraphic Doctor charted the soul’s ascent to God through the vestiges and image of the Trinity in creation — a mystical itinerary within the schools.', ['sol'], { ...C, facet: 'mystical theology' }, 'Bonaventure, Itinerarium mentis in Deum (1259)'),
  fig('sch:scotus', 'John Duns Scotus', 'The Subtle Doctor argued the univocity of being and the haecceity that makes each thing this one — reshaping the metaphysics later magic and theology assumed.', ['mercury-spirit'], { ...C, facet: 'metaphysics' }, 'Duns Scotus, Ordinatio (c. 1300)'),
  fig('sch:ockham', 'William of Ockham', 'His nominalism and the razor severed what reason can demonstrate from what faith holds, loosening the rational scaffolding on which natural magic had leaned.', ['mercury'], { ...C, facet: 'nominalism' }, 'Ockham, Summa Logicae (c. 1323)'),
  fig('sch:grosseteste', 'Robert Grosseteste', 'In De luce he made light the first corporeal form from which all bodies unfold — a metaphysics of light joining optics, cosmology, and the divine.', ['sol'], { ...C, facet: 'metaphysics of light' }, 'Grosseteste, De luce (c. 1225)'),
  fig('sch:bacon', 'Roger Bacon', 'The Franciscan defended a licit natural magic of optics, astrology, and the secret virtues of things, and dreamed of an experimental science to prolong life.', ['sol'], { ...C, facet: 'natural magic' }, 'Bacon, Opus Majus (1267)'),
  fig('sch:siger', 'Siger of Brabant', 'A leader of the Latin Averroists whose theses on the eternity of the world and the unity of the intellect were condemned in 1277.', ['mercury'], { ...C, facet: 'Latin Averroism' }, 'Condemnations of 1277 (Tempier)'),
  fig('sch:boethius', 'Boethius', 'His Consolation and his logical works transmitted Aristotle and the quadrivium to the Latin Middle Ages, framing the very vocabulary of the schools.', ['mercury-spirit'], { ...C, facet: 'transmission', era: 'late antique' }, 'Boethius, Consolatio Philosophiae (c. 524)'),
  fig('sch:dionysius', 'Pseudo-Dionysius the Areopagite', 'The author of the celestial and ecclesiastical Hierarchies and the via negativa, whose Neoplatonism, read as apostolic, suffused medieval angelology and mysticism.', ['sol', 'mercury-spirit'], { ...C, facet: 'negative theology', era: 'late antique' }, 'Pseudo-Dionysius, Corpus Areopagiticum (c. 500)'),
  fig('sch:avicenna', 'Avicenna (Ibn Sina)', 'His Metaphysics of the Healing set out the emanation of separate intelligences from the First — the angelology and cosmology the schoolmen absorbed and contested.', ['mercury-spirit'], { ...C, facet: 'emanationist metaphysics', tradition: 'Arabic philosophy' }, 'Avicenna, Kitab al-Shifa (c. 1027)'),
  fig('sch:averroes', 'Averroes (Ibn Rushd)', 'The Commentator on Aristotle, whose thesis of a single shared intellect provoked condemnation and a long Latin controversy.', ['mercury'], { ...C, facet: 'Aristotelian commentary', tradition: 'Arabic philosophy' }, 'Averroes, Long Commentary on the De Anima (c. 1190)'),
  fig('sch:maimonides', 'Moses Maimonides', 'The Guide for the Perplexed reconciled Aristotle with Scripture and condemned astral magic as idolatry — a verdict the schoolmen cited on both sides.', ['saturn'], { ...C, facet: 'Jewish philosophy', tradition: 'Jewish philosophy' }, 'Maimonides, Guide for the Perplexed (c. 1190)'),
  fig('sch:cusa', 'Nicholas of Cusa', 'In De docta ignorantia he taught the coincidence of opposites in the infinite and a learned ignorance before God — a bridge from scholasticism to Renaissance speculation.', ['sol', 'luna'], { ...C, facet: 'coincidence of opposites', era: 'late medieval' }, 'Cusanus, De docta ignorantia (1440)'),
  fig('sch:eckhart', 'Meister Eckhart', 'His preaching of the ground of the soul and the birth of God within pressed apophatic mysticism to the edge of orthodoxy, and to a posthumous condemnation.', ['mercury-spirit'], { ...C, facet: 'apophatic mysticism' }, 'Eckhart, German Sermons (c. 1300)'),
  fig('sch:anselm', 'Anselm of Canterbury', 'Father of scholasticism; his ontological argument and “faith seeking understanding” set the method the schools would follow.', ['sol'], { ...C, facet: 'philosophical theology', era: 'early medieval' }, 'Anselm, Proslogion (1078)'),
];

export const SCHOLASTIC_PACK: DlcPack = {
  id: 'dlc:scholastics',
  name: 'Scholastic Philosophers · Aquinas & the Schools',
  description: 'Thomas Aquinas and twenty schoolmen, as they bore on metaphysics and the boundary of licit magic.',
  cards: SCHOLASTIC_CARDS,
};
