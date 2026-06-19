import { fig, txt, con, type DlcPack } from './_card';

// WITCH TRIALS & THE INQUISITION — the somber history of persecution that shadowed learned magic.
// Treated soberly and academically; the critics and victims are named alongside the instruments.

const W = { discipline: 'demonology', era: 'early modern' };
export const WITCH_TRIAL_CARDS = [
  txt('wt:malleus', 'The Malleus Maleficarum', 'Heinrich Kramer’s 1486 “Hammer of Witches” welded folk belief, scholastic demonology, and inquisitorial procedure into the period’s most influential — and most lethal — handbook of prosecution.', ['saturn'], W, 'Kramer, Malleus Maleficarum (1486)'),
  fig('wt:kramer', 'Heinrich Kramer', 'The Dominican inquisitor (Institoris) whose zeal, rebuffed even by local bishops, produced the Malleus and helped fix the stereotype of the witch.', ['saturn'], W, 'cited in the Malleus (1486)'),
  con('wt:sabbath', 'The Witches’ Sabbath', 'The imagined nocturnal assembly — flight, feast, homage to the Devil — assembled by demonologists from disparate folklore into a single damning charge.', ['saturn'], W, 'reconstructed in Ginzburg, Ecstasies (1989)'),
  con('wt:pact', 'The Demonic Pact', 'The covenant with the Devil that, in the cumulative concept of witchcraft, turned the maleficent neighbour into an apostate and heretic.', ['saturn', 'mars'], W, 'cumulative concept; cf. Cohn, Europe’s Inner Demons (1975)'),
  fig('wt:benandanti', 'The Benandanti', 'The Friulian “good walkers” who believed they fought witches in spirit for the harvest — and whom the inquisitors slowly reshaped, in their own minds, into witches.', ['luna'], { ...W, era: 'early modern' }, 'Ginzburg, The Night Battles (1966)'),
  fig('wt:hopkins', 'Matthew Hopkins', 'The self-styled “Witchfinder General” whose campaign through the chaos of the English Civil War sent perhaps a hundred to the gallows.', ['saturn'], W, 'Hopkins, The Discovery of Witches (1647)'),
  con('wt:salem', 'The Salem Trials', 'The 1692 Massachusetts panic, in which spectral evidence and a credulous court condemned twenty to death before the colony recoiled in shame.', ['saturn'], W, 'Boyer & Nissenbaum, Salem Possessed (1974)'),
  fig('wt:weyer', 'Johann Weyer', 'The physician whose De praestigiis daemonum argued that accused witches were deluded melancholics, not heretics — an early voice against the trials.', ['mercury'], W, 'Weyer, De praestigiis daemonum (1563)'),
  fig('wt:spee', 'Friedrich Spee', 'The Jesuit who, having attended the condemned, anonymously published the Cautio Criminalis, a devastating exposure of how torture manufactured confessions.', ['mercury-spirit'], W, 'Spee, Cautio Criminalis (1631)'),
  txt('wt:summis', 'Summis desiderantes affectibus', 'The 1484 bull by which Innocent VIII lent papal authority to Kramer’s inquisition in the German lands, later bound into the Malleus.', ['saturn'], W, 'Innocent VIII, Summis desiderantes (1484)'),
];

const I = { discipline: 'inquisition', era: 'medieval' };
export const INQUISITION_CARDS = [
  con('inq:medieval', 'The Medieval Inquisition', 'The papal tribunals established from the 1230s to extirpate the Cathar and Waldensian heresies, the institutional root of the later Inquisitions.', ['saturn'], I, 'cf. Given, Inquisition and Medieval Society (1997)'),
  fig('inq:gui', 'Bernard Gui', 'The Dominican inquisitor of Toulouse whose Practica laid out, with cold method, the questioning, sentencing, and penances of the accused.', ['saturn'], I, 'Gui, Practica inquisitionis (c. 1324)'),
  txt('inq:directorium', 'The Directorium Inquisitorum', 'Nicholas Eymerich’s manual, later annotated by Peña, became the standard procedural authority for the inquisitor’s office.', ['saturn'], { ...I, era: 'late medieval' }, 'Eymerich, Directorium Inquisitorum (1376)'),
  con('inq:spanish', 'The Spanish Inquisition', 'Established in 1478 under royal control, it pursued conversos, moriscos, and later any deviance, becoming a byword for confessional terror.', ['saturn', 'mars'], { ...I, era: 'early modern' }, 'cf. Kamen, The Spanish Inquisition (1997)'),
  con('inq:roman', 'The Roman Inquisition', 'The Congregation of the Holy Office (1542) and its Index of Forbidden Books policed doctrine across Counter-Reformation Italy.', ['saturn'], { ...I, era: 'early modern' }, 'Roman Inquisition / Holy Office (1542)'),
  fig('inq:bruno', 'Giordano Bruno', 'The Nolan, who taught an infinite universe of innumerable worlds and a Hermetic religion of nature, was burned in the Campo de’ Fiori in 1600 after eight years’ imprisonment.', ['sol', 'saturn'], { ...I, era: 'early modern', tradition: 'Hermetism' }, 'Bruno, De l’infinito universo (1584); trial records'),
  fig('inq:campanella', 'Tommaso Campanella', 'The Dominican author of the City of the Sun, imprisoned and tortured for twenty-seven years, who practised astral magic to ward the very stars he feared.', ['sol', 'saturn'], { ...I, era: 'early modern' }, 'Campanella, La città del Sole (1602)'),
  fig('inq:cecco', "Cecco d'Ascoli", 'The astrologer and poet burned at Florence in 1327, his commentary on the Sphere condemned for binding the heavens too tightly to fate.', ['saturn'], I, "Cecco d'Ascoli, commentary on the Sphaera (c. 1324)"),
  con('inq:cathars', 'The Cathars', 'The dualist heretics of Languedoc whose belief in two principles — a good God and an evil maker of matter — the Inquisition was founded to destroy.', ['saturn'], I, 'cf. Lambert, The Cathars (1998)'),
  fig('inq:abano', "Pietro d'Abano", 'The Paduan physician-astrologer twice brought before the Inquisition for magic and unbelief; he died, it is said, before the second sentence could be carried out.', ['saturn'], I, "d'Abano, Conciliator (1303); trial tradition"),
];

export const WITCH_TRIALS_PACK: DlcPack = { id: 'dlc:witch-trials', name: 'The Witch Trials', description: 'The handbooks, hunters, victims, and critics of the early modern persecution — treated soberly.', cards: WITCH_TRIAL_CARDS };
export const INQUISITION_PACK: DlcPack = { id: 'dlc:inquisition', name: 'The Inquisition', description: 'The tribunals and their manuals, and the magi and heretics they tried — Bruno, Campanella, Cecco, the Cathars.', cards: INQUISITION_CARDS };
