import {
  SkillCategoryEnum,
  SkillData,
} from "../../data-model/item-data/skillData";
import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";

// All default skills that are have a base chance > 0.
// Base Chance 0 skills (skills you have to learn to use) go into a compendium (packs/skills.db).
const characterSkills: ItemData<SkillData>[] = [
  // *** Agility ***
  {
    name: "Boat",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Climb",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 40,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Dodge",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 1,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Drive",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Jump",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 1,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Ride (all)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Swim",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Agility,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Communication ***
  {
    name: "Act",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Art",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Bargain",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Charm",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Dance",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Disguise",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Fast Talk",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Intimidate",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Intrigue",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Orate",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Sing",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Speak Own Language (...)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Communication,
      baseChance: 50,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Knowledge ***
  {
    name: "Animal Lore",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Battle",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Celestial Lore",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
    },
  },
  {
    name: "Customs (local)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 25,
      learnedChance: 0,
    },
  },
  {
    name: "Elder Race Lore",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
    },
  },
  {
    name: "Evaluate",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Farm",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "First Aid",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Game",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Herd",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Homeland Lore (own)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 30,
      learnedChance: 0,
    },
  },
  {
    name: "Manage Household",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Mineral Lore",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
    },
  },
  {
    name: "Peaceful Cut",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Plant Lore",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 10,
      learnedChance: 0,
    },
  },
  {
    name: "Survival",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Treat Disease",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Treat Poison",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Knowledge,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  // *** Magic ***
  {
    name: "Prepare Corpse",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Magic,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Spirit Combat",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Magic,
      baseChance: 20,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Spirit Travel",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Magic,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Worship (...)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Magic,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Manipulation ***
  {
    name: "Conceal",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Manipulation,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Devise",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Manipulation,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Sleight",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Manipulation,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Perception ***
  {
    name: "Insight (own species)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Perception,
      baseChance: 20,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Listen",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Perception,
      baseChance: 25,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Scan",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Perception,
      baseChance: 25,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Search",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Perception,
      baseChance: 25,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Track",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Perception,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Perception ***
  {
    name: "Hide",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Stealth,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Move Quietly",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Stealth,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Melee Weapons ***
  {
    name: "1H Axe",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "2H Axe",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Broadsword",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Dagger",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Kopis",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "1H Mace",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Pike",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Rapier",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Shortsword",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "1H Spear (incl. Lance)",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "2H Spear",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MeleeWeapons,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Missile Weapons ***
  {
    name: "Composite Bow",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Javelin",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Pole Lasso",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Self Bow",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Sling",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Throwing Dagger",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 5,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Thrown Axe",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.MissileWeapons,
      baseChance: 10,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Shields ***
  {
    name: "Small Shield",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Shields,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Medium Shield",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Shields,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Large Shield",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.Shields,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },

  // *** Shields ***
  {
    name: "Fist",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.NaturalWeapons,
      baseChance: 25,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Grapple",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.NaturalWeapons,
      baseChance: 25,
      learnedChance: 0,
      experience: false,
    },
  },
  {
    name: "Kick",
    type: ItemTypeEnum.Skill,
    img: "icons/svg/mystery-man.svg",
    flags: {},
    data: {
      category: SkillCategoryEnum.NaturalWeapons,
      baseChance: 15,
      learnedChance: 0,
      experience: false,
    },
  },
];

export default characterSkills;
