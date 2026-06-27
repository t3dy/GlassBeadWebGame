import type { DlcPack } from './_card';
import { SOCIETAS_MAGICA_PACKS } from './societasMagica';
import { SCHOLASTIC_PACK } from './scholastica';
import { ANCIENT_ALCHEMY_PACK, ARABIC_ALCHEMY_PACK, MEDIEVAL_ALCHEMY_PACK, EARLY_MODERN_ALCHEMY_PACK } from './alchemists';
import { ANCIENT_HERMETICA_PACK, MEDIEVAL_HERMETICA_PACK } from './hermetica';
import { WITCH_TRIALS_PACK, INQUISITION_PACK } from './persecution';
import { RAW_PACK } from './raw';
import { PATRON_PACKS } from './patrons';

// All built-in DLC packs, registered at app start. Players activate any combination to build the deck;
// the "draw connected" system (engine/connections.ts) links cards across packs.
export const ALL_DLC_PACKS: DlcPack[] = [
  ...SOCIETAS_MAGICA_PACKS,
  SCHOLASTIC_PACK,
  ANCIENT_ALCHEMY_PACK, ARABIC_ALCHEMY_PACK, MEDIEVAL_ALCHEMY_PACK, EARLY_MODERN_ALCHEMY_PACK,
  ANCIENT_HERMETICA_PACK, MEDIEVAL_HERMETICA_PACK,
  WITCH_TRIALS_PACK, INQUISITION_PACK,
  RAW_PACK,
  ...PATRON_PACKS,
];
