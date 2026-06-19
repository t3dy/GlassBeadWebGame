// INFLUENCE LINKS — authored, grounded connections between cards (teacher→pupil, source→text,
// translation, influence). They power "draw a card connected to the one you just placed": e.g. place
// Henry of Ghent and you may draw Pico, with the reason shown. Bidirectional. Card ids come from the
// curated DLC packs (sm: societas · sch: scholastics · anc/ara/mda/ema: alchemists · her/mhr: hermetists).

export interface Link { a: string; b: string; reason: string }

export const LINKS: Link[] = [
  { a: 'sch:henry-ghent', b: 'sm:pico', reason: 'Henry of Ghent’s metaphysics of being and illumination was drawn into Pico della Mirandola’s thought.' },
  { a: 'sch:albertus', b: 'sch:aquinas', reason: 'Albertus Magnus taught Thomas Aquinas at Cologne.' },
  { a: 'sch:avicenna', b: 'sch:albertus', reason: 'Avicenna’s emanationist metaphysics shaped Albertus’s natural philosophy.' },
  { a: 'sch:avicenna', b: 'sch:aquinas', reason: 'Aquinas built on, and corrected, Avicenna’s account of being and the intelligences.' },
  { a: 'sch:averroes', b: 'sch:siger', reason: 'Siger of Brabant championed Averroes’s reading of Aristotle at Paris.' },
  { a: 'sch:averroes', b: 'sch:aquinas', reason: 'Aquinas wrote against Averroes on the unity of the intellect.' },
  { a: 'sch:dionysius', b: 'sch:eriugena', reason: 'Eriugena translated Pseudo-Dionysius into Latin.' },
  { a: 'sch:dionysius', b: 'sch:aquinas', reason: 'Aquinas commented on the Dionysian Divine Names.' },
  { a: 'sm:ficino', b: 'sm:pico', reason: 'Ficino and Pico were the twin luminaries of the Florentine Platonic Academy.' },
  { a: 'sm:ficino', b: 'her:hermes', reason: 'Ficino translated the Corpus Hermeticum, ascribed to Hermes Trismegistus.' },
  { a: 'sm:ficino', b: 'her:poimandres', reason: 'Ficino’s translation opened with the Poimandres.' },
  { a: 'sm:ficino', b: 'mhr:picatrix', reason: 'Ficino drew on the Picatrix for his astral talismanic magic.' },
  { a: 'sm:agrippa', b: 'mhr:picatrix', reason: 'Agrippa’s ceremonial magic absorbed the Picatrix tradition.' },
  { a: 'her:hermes', b: 'her:emerald', reason: 'The Emerald Tablet was ascribed to Hermes Trismegistus.' },
  { a: 'her:emerald', b: 'mhr:hortulanus', reason: 'Hortulanus’s gloss made the Emerald Tablet legible as alchemy.' },
  { a: 'ara:jabir', b: 'ara:summa', reason: 'The Latin Summa Perfectionis circulated under Jabir’s Latin name, Geber.' },
  { a: 'anc:zosimos', b: 'ara:turba', reason: 'Zosimos’s writings were a source of the Turba Philosophorum.' },
  { a: 'anc:democritus', b: 'anc:synesius', reason: 'Synesius wrote a commentary on Pseudo-Democritus.' },
  { a: 'anc:democritus', b: 'anc:maria', reason: 'Maria the Jewess belongs to the same early Graeco-Egyptian school.' },
  { a: 'ema:starkey', b: 'ema:newton', reason: 'Newton studied George Starkey’s (Philalethes’s) sophic mercury closely.' },
  { a: 'ema:paracelsus', b: 'ema:van-helmont', reason: 'Van Helmont reformed and extended Paracelsian chymistry.' },
  { a: 'ema:paracelsus', b: 'sm:paracelsus', reason: 'The same Paracelsus, physician-magus of the tria prima.' },
  { a: 'ema:dee', b: 'sm:dee', reason: 'The same John Dee, of the Monas Hieroglyphica.' },
  { a: 'inq:bruno', b: 'inq:campanella', reason: 'Bruno and Campanella were the two great Hermetic casualties of the Roman Inquisition.' },
  { a: 'ema:maier', b: 'her:emerald', reason: 'Maier’s emblematic alchemy is steeped in the Hermetic Tablet.' },
  { a: 'inq:abano', b: 'sm:abano', reason: 'The same Pietro d’Abano, tried for magic.' },
  { a: 'sch:lull', b: 'sm:pico', reason: 'The Lullian Art fed the combinatorial mysticism Pico admired.' },
];
