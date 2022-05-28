import { RqidLink } from "../shared/rqidLink";
import { DEFAULT_RQIDLANG, DEFAULT_RQIDPRIORITY } from "./IRqid";
import { ItemTypeEnum } from "./itemTypes";
import { Spell, SpellConcentrationEnum, SpellDurationEnum, SpellRangeEnum } from "./spell";

export interface SpiritMagicDataSourceData extends Spell {
  /** Can the caster decide the number of magic points used */
  isVariable: boolean;
  /** Can't be cast if one of the listed spells are already active (not yet implemented) */
  incompatibleWith: string[];
  /** Textual representation of what the spell focus is */
  spellFocus: string;
  /** Should this spell be included for CHA limit calculations */
  isMatrix: boolean;
}

// --- Derived Data ---
export interface SpiritMagicDataPropertiesData extends SpiritMagicDataSourceData {}

export interface SpiritMagicDataSource {
  type: ItemTypeEnum.SpiritMagic;
  data: SpiritMagicDataSourceData;
}

export interface SpiritMagicDataProperties {
  type: ItemTypeEnum.SpiritMagic;
  data: SpiritMagicDataPropertiesData;
}

export const emptySpiritMagic: SpiritMagicDataSourceData = {
  rqid: "",
  rqidPriority: DEFAULT_RQIDPRIORITY,
  rqidLang: DEFAULT_RQIDLANG,
  descriptionRqidLink: new RqidLink(),
  points: 0,
  isVariable: false,
  isRitual: false,
  isEnchantment: false,
  castingRange: SpellRangeEnum.Ranged,
  duration: SpellDurationEnum.Instant,
  concentration: SpellConcentrationEnum.Passive,
  incompatibleWith: [],
  spellFocus: "",
  isMatrix: false,
};
