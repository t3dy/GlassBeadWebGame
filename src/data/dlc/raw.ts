import { fig, txt, con, type DlcPack } from './_card';

// ROBERT ANTON WILSON — his novels (especially the Illuminatus! Trilogy) and his magic/consciousness
// theories. Adapted from the RAW/Illuminatus knowledge portal (C:\Dev\wiki: ontology_raw_illuminatus,
// illuminatus_concept_cards, raw_book_*). RAW (1932–2007) is historical; the Illuminatus characters
// and Discordian deities are fictional/mythic. Glyphs by the style guide's discipline defaults
// (the trickster-mediator → ☿ Mercury-spirit; conspiracy/control → ♄ Saturn; discord → ♂ Mars).

const D = { discipline: 'RAW', era: 'contemporary' };
const DISC = { ...D, tradition: 'Discordianism' };
const EPIS = { ...D, tradition: 'guerrilla ontology' };
const ILLUM = { ...D, tradition: 'Illuminatus' };

export const RAW_CARDS = [
  // The authors
  fig('rawd:wilson', 'Robert Anton Wilson', 'Novelist, "guerrilla ontologist," and co-author of Illuminatus!; his life-work used comedy, conspiracy, and occultism to pry open the reader’s certainties and teach a cheerful agnosticism toward every model of reality.', ['mercury-spirit'], { ...EPIS }, 'Wilson, Cosmic Trigger I (1977)'),
  fig('rawd:shea', 'Robert Shea', 'Journalist and novelist who co-wrote the Illuminatus! Trilogy with Wilson out of conspiracy letters sent to Playboy; later a historical novelist in his own right.', ['mercury-spirit'], { ...ILLUM }, 'Shea & Wilson, Illuminatus! (1975)'),
  fig('rawd:thornley', 'Kerry Thornley', 'Co-founder, with Greg Hill, of Discordianism and co-author of the Principia Discordia — the comic religion of Eris that Illuminatus! made its theology.', ['mars', 'mercury-spirit'], { ...DISC }, 'Thornley & Hill, Principia Discordia (1965)'),

  // The works
  txt('rawd:illuminatus', 'The Illuminatus! Trilogy', 'The sprawling 1975 conspiracy novel in which every secret society is real and at war; it weaponises paranoia as a reading method, then dissolves it in Discordian laughter.', ['saturn', 'mercury-spirit'], ILLUM, 'Shea & Wilson, Illuminatus! (1975)'),
  txt('rawd:cosmic-trigger', 'Cosmic Trigger', 'Wilson’s autobiographical account of his passage through "Chapel Perilous" — the Sirius mystery, synchronicity, and the danger of believing one’s own revelations.', ['mercury-spirit'], EPIS, 'Wilson, Cosmic Trigger I: Final Secret of the Illuminati (1977)'),
  txt('rawd:prometheus', 'Prometheus Rising', 'Wilson’s manual of the eight-circuit model: a do-it-yourself program of exercises for re-imprinting the nervous system and escaping one’s habitual reality tunnel.', ['fire', 'sol'], EPIS, 'Wilson, Prometheus Rising (1983)'),
  txt('rawd:quantum-psych', 'Quantum Psychology', 'A workbook in model agnosticism and E-Prime, training the reader to speak and think without the false certainty of the word "is."', ['mercury-spirit'], EPIS, 'Wilson, Quantum Psychology (1990)'),
  txt('rawd:schrodinger', "Schrödinger’s Cat Trilogy", 'Wilson’s "quantum" comedy of parallel worlds, in which the same characters live divergent fates — fiction as a demonstration of the multiple-universe reality.', ['mercury-spirit', 'luna'], D, "Wilson, Schrödinger's Cat Trilogy (1979)"),
  txt('rawd:masks', 'Masks of the Illuminati', 'A historical mystery setting James Joyce and Albert Einstein against an occult plot entangling Aleister Crowley — RAW’s most direct novel of magical initiation.', ['mercury-spirit'], { ...D, tradition: 'Thelema' }, 'Wilson, Masks of the Illuminati (1981)'),
  txt('rawd:principia', 'The Principia Discordia', 'The Discordian "sacred text" — a collage of jokes, koans, and parody scripture proclaiming Eris and the worship of chaos.', ['mars'], DISC, 'Malaclypse the Younger, Principia Discordia (1965; 1970)'),

  // Illuminatus characters & factions
  con('rawd:hagbard', 'Hagbard Celine', 'The Discordian anarchist captain of the golden submarine Leif Erikson, who fights the Illuminati while insisting that all government, even his own resistance, is the enemy of liberty.', ['mercury', 'water'], ILLUM, 'Shea & Wilson, Illuminatus! (1975)'),
  con('rawd:jams', 'The Justified Ancients of Mummu', 'The chaotic counter-conspiracy of the trilogy — the Discordian resistance to the order-imposing Illuminati, named for the primordial powers of disorder.', ['mars'], ILLUM, 'Shea & Wilson, Illuminatus! (1975)'),
  con('rawd:eris', 'Eris & the Golden Apple', 'The goddess of discord whose apple "to the fairest" began the Trojan War; in Discordianism she is the cheerful patroness of chaos and the original cosmic joke.', ['mars', 'venus'], DISC, 'Principia Discordia; Illuminatus! (1975)'),
  con('rawd:fnord', 'Fnord', 'The word the trilogy says you were conditioned in school not to consciously see — a parable of how language hides the mechanisms of control in plain sight.', ['saturn'], ILLUM, 'Shea & Wilson, Illuminatus! (1975)'),
  con('rawd:bavarian', 'The Bavarian Illuminati', 'The historical 1776 secret society of Adam Weishaupt, which the trilogy inflates into the immortal master-conspiracy behind all of history.', ['saturn'], ILLUM, 'Shea & Wilson, Illuminatus! (1975)'),

  // The magic & consciousness theories
  con('rawd:8circuit', 'The Eight-Circuit Model', 'The map of consciousness Wilson developed from Timothy Leary: eight successive "circuits" of the nervous system, from bio-survival to the non-local quantum mind.', ['fire', 'mercury-spirit'], EPIS, 'Wilson, Prometheus Rising (1983)'),
  con('rawd:reality-tunnels', 'Reality Tunnels', 'Wilson’s term for the way belief, language, and conditioning organise perception, so that conspiracy, mysticism, and skepticism can each feel wholly convincing from inside.', ['mercury-spirit'], EPIS, 'wiki: illuminatus_concept_cards (Reality Tunnels)'),
  con('rawd:maybe-logic', 'Model Agnosticism', 'RAW’s governing rule: treat every worldview — occult, scientific, political, conspiratorial — as a provisional tool, never a final truth that closes the question.', ['mercury-spirit'], EPIS, 'Wilson, Quantum Psychology (1990)'),
  con('rawd:chapel-perilous', 'Chapel Perilous', 'The dangerous inner zone where coincidence, paranoia, and revelation become impossible to tell apart; one emerges either a stone paranoid or an agnostic.', ['saturn'], EPIS, 'Wilson, Cosmic Trigger I (1977)'),
  con('rawd:23enigma', 'The 23 Enigma', 'The conviction, half-joke and half-experiment, that the number 23 recurs uncannily — RAW’s favourite demonstration of the mind’s hunger to find pattern.', ['saturn'], DISC, 'Wilson, Cosmic Trigger I (1977)'),
  con('rawd:law-of-fives', 'The Law of Fives', 'The Discordian "law" that all things happen in fives, or are divisible by or related to five — true exactly to the degree that one looks for it.', ['mars'], DISC, 'Principia Discordia'),
  con('rawd:mindfuck', 'Operation Mindfuck', 'The Discordian tactic of hoaxes, rumours, and false leads meant to make authority look unstable and to jolt the target out of a fixed reality tunnel.', ['mercury'], DISC, 'Shea & Wilson, Illuminatus! (1975)'),
  con('rawd:discordianism', 'Discordianism', 'At once comic theology, anti-authoritarian practice, and interpretive trap: it invites you to see patterns, distrust patterns, and notice the desire for patterns, all at once.', ['mars', 'mercury-spirit'], DISC, 'wiki: illuminatus_concept_cards (Discordianism)'),
  con('rawd:guerrilla-ontology', 'Guerrilla Ontology', 'RAW’s literary method of mixing fact, fiction, and forgery without flagging which is which, so the reader must stay awake and decide for themselves what is real.', ['mercury-spirit'], EPIS, 'Wilson, The Illuminati Papers (1980)'),
];

export const RAW_PACK: DlcPack = {
  id: 'dlc:raw',
  name: 'Robert Anton Wilson · Illuminatus & the Magick of Maybe',
  description: 'RAW’s novels (the Illuminatus! Trilogy, Cosmic Trigger, Schrödinger’s Cat) and his magic & consciousness theories — reality tunnels, the eight circuits, model agnosticism, Discordianism.',
  cards: RAW_CARDS,
};
