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

  // Robert Anton Wilson — the conspiratorial web (links also reach the base seed's RAW/Leary cards)
  { a: 'rawd:wilson', b: 'rawd:illuminatus', reason: 'Wilson co-wrote the Illuminatus! Trilogy.' },
  { a: 'rawd:wilson', b: 'rawd:cosmic-trigger', reason: 'Cosmic Trigger is Wilson’s own account of Chapel Perilous.' },
  { a: 'rawd:wilson', b: 'rawd:prometheus', reason: 'Wilson’s manual of the eight-circuit model.' },
  { a: 'rawd:wilson', b: 'rawd:guerrilla-ontology', reason: 'Guerrilla ontology was Wilson’s signature method.' },
  { a: 'rawd:wilson', b: 'leary:circuit', reason: 'Wilson built his eight-circuit work on Timothy Leary’s model.' },
  { a: 'rawd:wilson', b: 'raw:maybe', reason: 'Wilson’s “maybe logic” / model agnosticism.' },
  { a: 'rawd:shea', b: 'rawd:illuminatus', reason: 'Shea co-wrote the Illuminatus! Trilogy with Wilson.' },
  { a: 'rawd:illuminatus', b: 'rawd:hagbard', reason: 'Hagbard Celine captains the resistance in Illuminatus!' },
  { a: 'rawd:illuminatus', b: 'rawd:fnord', reason: 'The fnords are revealed in Illuminatus!' },
  { a: 'rawd:illuminatus', b: 'rawd:bavarian', reason: 'The Bavarian Illuminati are the trilogy’s master-conspiracy.' },
  { a: 'rawd:illuminatus', b: 'rawd:jams', reason: 'The JAMs are the Discordian faction of the trilogy.' },
  { a: 'rawd:eris', b: 'rawd:discordianism', reason: 'Eris is the goddess of Discordianism.' },
  { a: 'rawd:discordianism', b: 'rawd:principia', reason: 'The Principia Discordia is the Discordian scripture.' },
  { a: 'rawd:principia', b: 'rawd:thornley', reason: 'Thornley co-authored the Principia Discordia.' },
  { a: 'rawd:8circuit', b: 'leary:circuit', reason: 'The same eight-circuit model, after Leary.' },
  { a: 'rawd:8circuit', b: 'rawd:prometheus', reason: 'Prometheus Rising is the eight-circuit manual.' },
  { a: 'rawd:reality-tunnels', b: 'rawd:maybe-logic', reason: 'Model agnosticism is the discipline for navigating reality tunnels.' },
  { a: 'rawd:cosmic-trigger', b: 'rawd:chapel-perilous', reason: 'Cosmic Trigger narrates Wilson’s passage through Chapel Perilous.' },
  { a: 'rawd:23enigma', b: 'rawd:law-of-fives', reason: 'Both are Discordian games of pattern-finding.' },
  { a: 'rawd:masks', b: 'rawd:wilson', reason: 'Wilson’s novel of magical initiation with Joyce, Einstein, and Crowley.' },
  { a: 'rawd:mindfuck', b: 'rawd:discordianism', reason: 'Operation Mindfuck is the Discordian culture-jamming tactic.' },

  // Patronage — the courts that funded the figures, places, and works of the other packs (cross-pack),
  // and the dynastic / household networks that bound the patrons to one another (patron:* ids).
  // Grounded in docs/research/MEDIEVAL_RENAISSANCE_PATRONAGE_SOURCEBOOK.md.
  { a: 'patron:cosimo-de-medici', b: 'sm:ficino', reason: 'Cosimo de’ Medici founded the Florentine Platonic Academy and set Ficino to translate Plato and the Hermetica.' },
  { a: 'patron:lorenzo-de-medici', b: 'sm:ficino', reason: 'Ficino’s philosophy and translating flourished under Lorenzo the Magnificent’s protection.' },
  { a: 'patron:lorenzo-de-medici', b: 'sm:pico', reason: 'Lorenzo de’ Medici sheltered Pico della Mirandola in Florence after his condemnation.' },
  { a: 'patron:cosimo-de-medici', b: 'sm:l-florence', reason: 'Medici patronage made Florence the seat of the Platonic revival.' },
  { a: 'patron:rudolf-ii', b: 'ema:maier', reason: 'Michael Maier served Rudolf II as physician at the imperial court in Prague.' },
  { a: 'patron:rudolf-ii', b: 'sm:dee', reason: 'John Dee was drawn to Rudolf II’s Prague court on his continental travels.' },
  { a: 'patron:rudolf-ii', b: 'sm:l-prague', reason: 'Rudolfine Prague was the theatre of the emperor’s alchemy, astronomy, and Kunstkammer.' },
  { a: 'patron:elizabeth-i', b: 'sm:dee', reason: 'John Dee was Elizabeth I’s philosopher and astrological adviser.' },
  { a: 'patron:alfonso-x', b: 'sm:l-toledo', reason: 'Alfonso X’s translators at Toledo turned Arabic and Andalusian science into Castilian and Latin.' },
  { a: 'patron:al-mamun', b: 'patron:alfonso-x', reason: 'Both made kingship a translation engine — Abbasid Baghdad’s movement reaching forward to Alfonsine Toledo.' },

  // Medici house
  { a: 'patron:cosimo-de-medici', b: 'patron:lorenzo-de-medici', reason: 'Grandfather and grandson of the Medici banking house that ruled Florence by patronage.' },
  { a: 'patron:cosimo-de-medici', b: 'patron:cosimo-i-de-medici', reason: 'The elder Cosimo and the first grand duke of Tuscany who refounded Medici rule.' },
  { a: 'patron:cosimo-i-de-medici', b: 'patron:cosimo-ii-de-medici', reason: 'Successive grand dukes of Tuscany.' },
  { a: 'patron:lorenzo-de-medici', b: 'patron:leo-x', reason: 'Pope Leo X (Giovanni de’ Medici) was Lorenzo the Magnificent’s son.' },
  { a: 'patron:cosimo-ii-de-medici', b: 'patron:christina-regency', reason: 'Christina of Lorraine and Maria Maddalena governed Tuscany as regents after Cosimo II.' },
  { a: 'patron:lorenzo-de-medici', b: 'patron:catherine-de-medici', reason: 'Catherine de’ Medici descended from the line of Lorenzo the Magnificent.' },

  // Roman papacy
  { a: 'patron:nicholas-v', b: 'patron:julius-ii', reason: 'Nicholas V’s plan to rebuild Rome and St Peter’s was taken up monumentally by Julius II.' },
  { a: 'patron:julius-ii', b: 'patron:leo-x', reason: 'Julius II and his Medici successor Leo X presided over the art of the High Renaissance in Rome.' },

  // Valois & Burgundy
  { a: 'patron:jean-de-berry', b: 'patron:charles-v-france', reason: 'Jean de Berry was the brother of King Charles V of France.' },
  { a: 'patron:charles-v-france', b: 'patron:philip-the-bold', reason: 'Philip the Bold of Burgundy was a brother of Charles V of France.' },
  { a: 'patron:philip-the-bold', b: 'patron:philip-the-good', reason: 'Successive Valois dukes of Burgundy who built the court’s magnificence.' },

  // Timurid Herat & Samarkand
  { a: 'patron:shah-rukh', b: 'patron:baysunghur', reason: 'Baysunghur ran his father Shah Rukh’s Herat atelier of the book.' },
  { a: 'patron:shah-rukh', b: 'patron:ulugh-beg', reason: 'Ulugh Beg, Shah Rukh’s son, built the great observatory at Samarkand.' },
  { a: 'patron:shah-rukh', b: 'patron:gawhar-shad', reason: 'Gawhar Shad was Shah Rukh’s queen and a great architectural patron in her own right.' },

  // Habsburg
  { a: 'patron:maximilian-i', b: 'patron:margaret-of-austria', reason: 'Margaret of Austria was the daughter of Emperor Maximilian I and his regent in the Netherlands.' },
];
