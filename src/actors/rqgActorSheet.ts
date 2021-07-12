import { SkillCategoryEnum, SkillData } from "../data-model/item-data/skillData";
import { HomeLandEnum, OccupationEnum } from "../data-model/actor-data/background";
import { RqgActorData } from "../data-model/actor-data/rqgActorData";
import { ItemTypeEnum } from "../data-model/item-data/itemTypes";
import { HitLocationSheet } from "../items/hit-location-item/hitLocationSheet";
import { RqgItem } from "../items/rqgItem";
import { skillMenuOptions } from "./context-menues/skill-context-menu";
import { combatMenuOptions } from "./context-menues/combat-context-menu";
import { hitLocationMenuOptions } from "./context-menues/health-context-menu";
import { passionMenuOptions } from "./context-menues/passion-context-menu";
import { gearMenuOptions } from "./context-menues/gear-context-menu";
import { spiritMagicMenuOptions } from "./context-menues/spirit-magic-context-menu";
import { cultMenuOptions } from "./context-menues/cult-context-menu";
import { runeMagicMenuOptions } from "./context-menues/rune-magic-context-menu";
import { runeMenuOptions } from "./context-menues/rune-context-menu";
import { equippedStatuses } from "../data-model/item-data/IPhysicalItem";
import { characteristicMenuOptions } from "./context-menues/characteristic-context-menu";
import { createItemLocationTree, LocationNode } from "../items/shared/locationNode";
import { CharacteristicCard } from "../chat/characteristicCard";
import { WeaponCard } from "../chat/weaponCard";
import { SpiritMagicCard } from "../chat/spiritMagicCard";
import { ItemCard } from "../chat/itemCard";
import { Characteristics } from "../data-model/actor-data/characteristics";
import { RqgActor } from "./rqgActor";
import { getDomDataset, getRequiredDomDataset, RqgError } from "../system/util";
import { RuneItemData, RuneTypeEnum } from "../data-model/item-data/runeData";
import { RqgConfig } from "../system/config";
import { DamageCalculations } from "../system/damageCalculations";
import { actorHealthStatuses } from "../data-model/actor-data/attributes";

declare const CONFIG: RqgConfig;

interface UiSections {
  health: boolean;
  combat: boolean;
  runes: boolean;
  spiritMagic: boolean;
  runeMagic: boolean;
  sorcery: boolean;
  skills: boolean;
  gear: boolean;
  passions: boolean;
  background: boolean;
  activeEffects: boolean;
}

// Data fed to handlebars renderer
interface ActorSheetTemplate {
  // Basic (Foundry) data
  cssClass: string;
  editable: boolean;
  limited: boolean;
  options: object;
  owner: boolean;
  title: string;

  // The actor and reorganised owned items
  rqgActorData: Actor.Data<RqgActorData>;
  tokenId?: string;
  /** reorganized for presentation TODO type it better */
  ownedItems: any;

  /** Find this skill to show on spirit combat part */
  spiritCombatSkillData: Item.Data<SkillData>;
  /** Find this skill to show on combat part */
  dodgeSkillData: Item.Data<SkillData>;

  // Lists for dropdown values
  occupations: `${OccupationEnum}`[];
  homelands: `${HomeLandEnum}`[];
  locations: string[];
  healthStatuses: typeof actorHealthStatuses;

  // Other data needed for the sheet
  /** Array of element runes with > 0% chance */
  characterRunes: RuneItemData[];
  /** (html) Precalculated missile weapon SRs if loaded at start of round */
  loadedMissileSr: string[];
  /** (html) Precalculated missile weapon SRs if not loaded at start of round */
  unloadedMissileSr: string[];
  /** physical items reorganised as a tree of items containing items */
  itemLocationTree: LocationNode;
  /** list of pow-crystals */
  powCrystals: { name: string; size: number }[];
  spiritMagicPointSum: number;
  freeInt: number;

  // UI toggles
  isGM: boolean;
  showUiSection: UiSections;
}

export class RqgActorSheet extends ActorSheet<ActorSheet.Data<RqgActor>, RqgActor> {
  static get defaultOptions() {
    // @ts-ignore mergeObject
    return mergeObject(super.defaultOptions, {
      classes: ["rqg", "sheet", "actor"],
      template: "systems/rqg/actors/rqgActorSheet.html",
      width: 550,
      height: 650,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "combat",
        },
        {
          navSelector: ".gear-tabs",
          contentSelector: ".gear-body",
          initial: "by-item-type",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  /* -------------------------------------------- */

  // TODO type system presumes ActorSheet.Data<Actor> but I've organised as ActorSheetTemplate
  getData(): any {
    // @ts-ignore 0.8 document.isOwner
    const isOwner: boolean = this.document.isOwner;
    const spiritMagicPointSum = this.getSpiritMagicPointSum();
    // @ts-ignore 0.8 document
    const rqgActorData = this.document.data.toObject(false);
    const dexStrikeRank = rqgActorData.data.attributes.dexStrikeRank;
    if (dexStrikeRank == null) {
      const msg = "Dex SR was not yet calculated.";
      ui.notifications?.error(msg);
      throw new RqgError(msg, this.actor);
    }
    const templateData: ActorSheetTemplate = {
      cssClass: isOwner ? "editable" : "locked",
      editable: this.isEditable,
      // @ts-ignore 0.8 document
      limited: this.document.limited,
      options: this.options,
      owner: isOwner,
      title: this.title,

      rqgActorData: rqgActorData,
      tokenId: this.token?.id,
      ownedItems: this.organizeOwnedItems(),

      spiritCombatSkillData: this.getSkillDataByName(CONFIG.RQG.skillName.spiritCombat),
      dodgeSkillData: this.getSkillDataByName(CONFIG.RQG.skillName.dodge),

      characterRunes: this.getCharacterRuneImgs(), // Array of element runes with > 0% chance
      loadedMissileSr: this.getLoadedMissileSr(dexStrikeRank), // (html) Precalculated missile weapon SRs if loaded at start of round
      unloadedMissileSr: this.getUnloadedMissileSr(dexStrikeRank), // (html) Precalculated missile weapon SRs if not loaded at start of round
      // @ts-ignore 0.8 toObject
      itemLocationTree: createItemLocationTree(this.actor.items.toObject(false)), // physical items reorganised as a tree of items containing items
      powCrystals: this.getPowCrystals(),
      spiritMagicPointSum: spiritMagicPointSum,
      freeInt: this.getFreeInt(spiritMagicPointSum),

      // Lists for dropdown values
      occupations: Object.values(OccupationEnum),
      homelands: Object.values(HomeLandEnum),
      locations: this.getPhysicalItemLocations(),
      healthStatuses: [...actorHealthStatuses],

      // UI toggles
      isGM: !!game.user?.isGM,
      showUiSection: this.getUiSectionVisibility(),
    };
    console.log(templateData);
    return templateData;
  }

  private getPhysicalItemLocations(): string[] {
    // Used for DataList input dropdown
    const physicalItems: RqgItem[] = this.actor.items.filter(
      (i: Item) => i.data.data.physicalItemType
    );
    return [
      ...new Set([
        ...this.actor.items.filter((i: Item) => i.data.data.isContainer).map((i) => i.name),
        ...physicalItems.map((i: Item) => i.data.data.location),
      ]),
    ];
  }

  private getSpiritMagicPointSum(): number {
    return this.actor.items
      .filter((i: Item<any>) => i.type === (ItemTypeEnum.SpiritMagic as string))
      .reduce((acc: number, m: Item<any>) => acc + m.data.data.points, 0);
  }

  private getPowCrystals(): { name: string; size: number }[] {
    return (
      this.actor.effects &&
      this.actor.effects
        .filter(
          (e) =>
            e.data.changes.find((e) => e.key === "data.attributes.magicPoints.max") !== undefined
        )
        .map((e) => {
          return {
            name: e.data.label,
            size: e.data.changes
              .filter((c: any) => c.key === "data.attributes.magicPoints.max")
              .reduce((acc: number, c: any) => acc + c.value, 0),
          };
        })
    );
  }

  private getFreeInt(spiritMagicPointSum: number): number {
    return (
      this.actor.data.data.characteristics.intelligence.value -
      spiritMagicPointSum -
      this.actor.items.filter(
        (i: Item<any>) =>
          i.type === ItemTypeEnum.Skill &&
          i.data.data.category === SkillCategoryEnum.Magic &&
          !!i.data.data.runes.length
      ).length
    );
  }

  private getLoadedMissileSr(dexSr: number): string[] {
    const reloadIcon = CONFIG.RQG.missileWeaponReloadIcon;
    const loadedMissileSr = [
      ["1", reloadIcon, "5", reloadIcon, "10"],
      ["1", reloadIcon, "7", reloadIcon],
      ["2", reloadIcon, "9"],
      ["3", reloadIcon, "11"],
      ["4", reloadIcon],
      ["5", reloadIcon],
    ];
    return loadedMissileSr[dexSr];
  }

  private getUnloadedMissileSr(dexSr: number): string[] {
    const reloadIcon = CONFIG.RQG.missileWeaponReloadIcon;
    const unloadedMissileSr = [
      [reloadIcon, "5", reloadIcon, "10"],
      [reloadIcon, "6", reloadIcon, "12"],
      [reloadIcon, "7", reloadIcon],
      [reloadIcon, "8"],
      [reloadIcon, "9"],
      [reloadIcon, "10"],
    ];
    return unloadedMissileSr[dexSr];
  }

  private getCharacterRuneImgs(): RuneItemData[] {
    return this.actor.items
      .filter(
        (i: Item<any>) =>
          i.data.type === ItemTypeEnum.Rune &&
          i.data.data.runeType === RuneTypeEnum.Element &&
          !!i.data.data.chance
      )
      .map((r) => r.data as RuneItemData)
      .sort((a: RuneItemData, b: RuneItemData) => b.data.chance - a.data.chance);
  }

  private getSkillDataByName(name: String): Item.Data<SkillData> {
    const skillItem = this.actor.items.find(
      (i) => i.data.name === name && i.type === ItemTypeEnum.Skill
    );
    return skillItem?.data as Item.Data<SkillData>;
  }

  /**
   * Take the owned items of the actor and rearrange them for presentation.
   * returns something like this {armor: [RqgItem], elementalRune: [RqgItem], ... }
   * @private
   */
  private organizeOwnedItems(): any {
    const itemTypes: any = Object.fromEntries(
      game.system.entityTypes.Item.map((t: string) => [t, []])
    );
    this.actor.items.forEach((item) => {
      itemTypes[item.type].push(item);
    });

    // Separate skills into skill categories {agility: [RqgItem], communication: [RqgItem], ... }
    const skills: any = {};
    Object.values(SkillCategoryEnum).forEach((cat: string) => {
      skills[cat] = itemTypes[ItemTypeEnum.Skill].filter((s: any) => cat === s.data.data.category);
    });
    // Sort the skills inside each category
    Object.values(skills).forEach((skillList) =>
      (skillList as RqgItem[]).sort((a: RqgItem, b: RqgItem) =>
        ("" + a.data.name).localeCompare(b.data.name)
      )
    );
    itemTypes[ItemTypeEnum.Skill] = skills;

    // Separate runes into types (elemental, power, form, technique)
    const runes: any = {};
    Object.values(RuneTypeEnum).forEach((type: string) => {
      runes[type] = itemTypes[ItemTypeEnum.Rune].filter((r: any) => type === r.data.data.runeType);
    });
    itemTypes[ItemTypeEnum.Rune] = runes;

    // Organise powerRunes as { fertility: RqgItem, death: RqgItem, ... }
    itemTypes[ItemTypeEnum.Rune][RuneTypeEnum.Power] = {
      ...itemTypes[ItemTypeEnum.Rune][RuneTypeEnum.Power].reduce((acc: any, item: Item) => {
        acc[item.data.data.rune] = item;
        return acc;
      }, []),
    };

    // Organise formRunes as { man: RqgItem, beast: RqgItem, ... }
    itemTypes[ItemTypeEnum.Rune][RuneTypeEnum.Form] = {
      ...itemTypes[ItemTypeEnum.Rune][RuneTypeEnum.Form].reduce((acc: any, item: Item) => {
        acc[item.data.data.rune] = item;
        return acc;
      }, []),
    };

    // Sort the hit locations
    itemTypes[ItemTypeEnum.HitLocation].sort(
      (a: Item, b: Item) => b.data.data.dieFrom - a.data.data.dieFrom
    );

    return itemTypes;
  }

  private getUiSectionVisibility(): UiSections {
    return {
      health:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) => i.type === ItemTypeEnum.HitLocation).length,
      combat:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) =>
          [ItemTypeEnum.MeleeWeapon as string, ItemTypeEnum.MissileWeapon as string].includes(
            i.type
          )
        ).length,
      runes:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) => i.type === ItemTypeEnum.Rune).length,
      spiritMagic:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) => i.type === ItemTypeEnum.SpiritMagic).length,
      runeMagic:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) =>
          [ItemTypeEnum.Cult as string, ItemTypeEnum.RuneMagic as string].includes(i.type)
        ).length,
      sorcery:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter(
          (i: Item<any>) => i.type === (ItemTypeEnum.Rune as string) && i.data.data.isMastered
        ).length,
      skills:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) => i.type === ItemTypeEnum.Skill).length,
      gear:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) =>
          [
            ItemTypeEnum.Gear as string,
            ItemTypeEnum.MeleeWeapon as string,
            ItemTypeEnum.MissileWeapon as string,
            ItemTypeEnum.Armor as string,
          ].includes(i.type)
        ).length,
      passions:
        CONFIG.RQG.debug.showAllUiSections ||
        !!this.actor.items.filter((i) => i.type === ItemTypeEnum.Passion).length,
      background: true,
      activeEffects: CONFIG.RQG.debug.showActorActiveEffectsTab && !!game.user?.isGM,
    };
  }

  protected _updateObject(event: Event, formData: any) {
    const maxHitPoints = this.actor.data.data.attributes.hitPoints.max;
    if (maxHitPoints == null) {
      const msg = "Actor does not have max hitpoints set.";
      ui.notifications?.error(msg);
      throw new RqgError(msg, this.actor);
    }
    if (
      formData["data.attributes.hitPoints.value"] == null || // Actors without hit locations should not get undefined
      formData["data.attributes.hitPoints.value"] > maxHitPoints
    ) {
      formData["data.attributes.hitPoints.value"] = maxHitPoints;
    }

    // Hack: Temporarily change hp.value to what it will become so getCombinedActorHealth will work
    const hpTmp = this.actor.data.data.attributes.hitPoints.value;
    this.actor.data.data.attributes.hitPoints.value = formData["data.attributes.hitPoints.value"];

    const newHealth = DamageCalculations.getCombinedActorHealth(this.actor.data);
    if (newHealth !== this.actor.data.data.attributes.health) {
      // Chat to all owners
      const whisperRecipients = Object.entries(this.actor.data.permission)
        .filter(([userId, permission]) => permission >= CONST.ENTITY_PERMISSIONS.OBSERVER)
        .map(([userId, permission]) => userId);

      const speakerName = this.token?.name || this.actor.data.token.name;
      let message;
      if (newHealth === "dead" && !this.actor.effects.find((e) => e.data.label === "dead")) {
        message = `${speakerName} runs out of hitpoints and dies here and now!`;
      }
      if (
        newHealth === "unconscious" &&
        !this.actor.effects.find((e) => e.data.label === "unconscious")
      ) {
        message = `${speakerName} faints from lack of hitpoints!`;
      }
      message &&
        ChatMessage.create({
          user: game.user?.id,
          speaker: { alias: speakerName },
          content: message,
          whisper: whisperRecipients,
          type: CONST.CHAT_MESSAGE_TYPES.WHISPER,
        });
    }

    this.actor.data.data.attributes.hitPoints.value = hpTmp; // Restore hp so the form will work
    if (this.token) {
      const tokenHealthBefore = this.token.actor.data.data.attributes.health;
      this.token.actor.data.data.attributes.health = newHealth; // "Pre update" the health to make the setTokenEffect call work
      // @ts-ignore 0.8 object - token is actually a TokenDocument?
      HitLocationSheet.setTokenEffect(this.token.object, tokenHealthBefore);
    }

    formData["data.attributes.health"] = newHealth;

    return super._updateObject(event, formData);
  }

  get title(): string {
    const linked = this.actor.data.token.actorLink;
    const isToken = this.actor.isToken;

    let prefix = "";
    if (!linked) {
      prefix = isToken ? "[Token] " : "[Prototype] ";
    }
    const speakerName = isToken ? this.actor.token!.data.name : this.actor.data.token.name;
    const postfix = isToken ? ` (${this.actor.data.token.name})` : "";

    return prefix + speakerName + postfix;

    // return this.actor.isToken
    //   ? `[Token] ${this.actor.token!.data.name} (${this.actor.data.token.name})`
    //   : this.actor.data.token.name;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    // @ts-ignore 0.8
    if (!this.actor.isOwner) {
      // Only owners are allowed to interact
      return;
    }

    new ContextMenu(
      html,
      ".characteristic-contextmenu",
      characteristicMenuOptions(this.actor, this.token)
    );
    new ContextMenu(html, ".combat-contextmenu", combatMenuOptions(this.actor, this.token));
    new ContextMenu(html, ".hit-location-contextmenu", hitLocationMenuOptions(this.actor));
    new ContextMenu(html, ".rune-contextmenu", runeMenuOptions(this.actor, this.token));
    new ContextMenu(
      html,
      ".spirit-magic-contextmenu",
      spiritMagicMenuOptions(this.actor, this.token)
    );
    new ContextMenu(html, ".cult-contextmenu", cultMenuOptions(this.actor));
    new ContextMenu(html, ".rune-magic-contextmenu", runeMagicMenuOptions(this.actor, this.token));
    new ContextMenu(html, ".skill-contextmenu", skillMenuOptions(this.actor, this.token));
    new ContextMenu(html, ".gear-contextmenu", gearMenuOptions(this.actor));
    new ContextMenu(html, ".passion-contextmenu", passionMenuOptions(this.actor, this.token));

    // Use attributes data-item-edit, data-item-delete & data-item-roll to specify what should be clicked to perform the action
    // Set data-item-edit=actor.items._id on the same or an outer element to specify what item the action should be performed on.

    // Roll Characteristic
    this.form!.querySelectorAll("[data-characteristic-roll]").forEach((el) => {
      const characteristicName = (el.closest("[data-characteristic]") as HTMLElement).dataset
        .characteristic;

      let clickCount = 0;
      const actorCharacteristics: Characteristics = this.actor.data.data.characteristics;
      if (!characteristicName || !(characteristicName in actorCharacteristics)) {
        const msg = `Characteristic [${characteristicName}] isn't found on actor [${this.actor.name}].`;
        ui.notifications?.error(msg);
        throw new RqgError(msg, this.actor);
      }
      el.addEventListener("click", async (ev: Event) => {
        clickCount = Math.max(clickCount, (ev as MouseEvent).detail);

        if (clickCount >= 2) {
          const speakerName = this.token?.name || this.actor.data.token.name;
          await CharacteristicCard.roll(
            characteristicName,
            actorCharacteristics[characteristicName as keyof typeof actorCharacteristics].value,
            5,
            0,
            this.actor,
            speakerName
          );
          clickCount = 0;
        } else if (clickCount === 1) {
          setTimeout(async () => {
            if (clickCount === 1) {
              await CharacteristicCard.show(
                {
                  name: characteristicName,
                  data: actorCharacteristics[
                    characteristicName as keyof typeof actorCharacteristics
                  ],
                },
                this.actor,
                this.token
              );
            }
            clickCount = 0;
          }, CONFIG.RQG.dblClickTimeout);
        }
      });
    });

    // Roll against Item Ability Chance
    this.form!.querySelectorAll("[data-item-roll]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      const item = this.actor.items.get(itemId) as Item<any>;
      let clickCount = 0;

      el.addEventListener("click", async (ev: Event) => {
        clickCount = Math.max(clickCount, (ev as MouseEvent).detail);

        if (clickCount >= 2) {
          const speakerName = this.token?.name || this.actor.data.token.name;
          await ItemCard.roll(item.data, 0, this.actor, speakerName);
          clickCount = 0;
        } else if (clickCount === 1) {
          setTimeout(async () => {
            if (clickCount === 1) {
              await ItemCard.show(itemId, this.actor, this.token);
            }
            clickCount = 0;
          }, CONFIG.RQG.dblClickTimeout);
        }
      });
    });

    // Roll Spirit Magic
    (this.form as HTMLElement).querySelectorAll("[data-spirit-magic-roll]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      const item = this.actor.items.get(itemId);
      if (!item) {
        const msg = `Couldn't find item [${itemId}] to roll Spirit Magic against`;
        ui.notifications?.error(msg);
        throw new RqgError(msg, el);
      }
      let clickCount = 0;

      el.addEventListener("click", async (ev: Event) => {
        if (item.data.type !== ItemTypeEnum.SpiritMagic) {
          const msg = "Tried to roll a Spirit Magic Roll against some other Item";
          ui.notifications?.error(msg);
          throw new RqgError(msg, item);
        }
        clickCount = Math.max(clickCount, (ev as MouseEvent).detail);
        if (clickCount >= 2) {
          if (item.data.data.isVariable && item.data.data.points > 1) {
            await SpiritMagicCard.show(itemId, this.actor, this.token);
          } else {
            const speakerName = this.token?.name || this.actor.data.token.name;
            await SpiritMagicCard.roll(
              item.data,
              item.data.data.points,
              0,
              this.actor,
              speakerName
            );
          }

          clickCount = 0;
        } else if (clickCount === 1) {
          setTimeout(async () => {
            if (clickCount === 1) {
              await SpiritMagicCard.show(itemId, this.actor, this.token);
            }
            clickCount = 0;
          }, CONFIG.RQG.dblClickTimeout);
        }
      });
    });

    // Show Weapon Chat Card
    (this.form as HTMLElement).querySelectorAll("[data-weapon-roll]").forEach((el) => {
      const weaponItemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      const skillItemId = getDomDataset($(el as HTMLElement), "skill-id");
      if (!skillItemId) {
        console.warn(
          `Weapon ${weaponItemId} is missing a skill. Normal if you just dragged the weapon in, but should only happen then`
        );
      }

      let clickCount = 0;
      el.addEventListener("click", async (ev: Event) => {
        clickCount = Math.max(clickCount, (ev as MouseEvent).detail);
        if (skillItemId && clickCount >= 2) {
          // Ignore double clicks by doing the same as on single click
          await WeaponCard.show(weaponItemId, skillItemId, this.actor, this.token);
          clickCount = 0;
        } else if (skillItemId && clickCount === 1) {
          setTimeout(async () => {
            if (clickCount === 1) {
              await WeaponCard.show(weaponItemId, skillItemId, this.actor, this.token);
            }
            clickCount = 0;
          }, CONFIG.RQG.dblClickTimeout);
        }
      });
    });

    // Set Token SR in Combat Tracker
    (this.form as HTMLElement).querySelectorAll("[data-set-sr]").forEach((el: Element) => {
      const sr = getRequiredDomDataset($(el as HTMLElement), "set-sr");
      let token = this.token;
      if (!token && this.actor.data.token.actorLink) {
        const activeTokens = this.actor.getActiveTokens();
        token = activeTokens ? activeTokens[0] : null;
      }

      let clickCount = 0;

      function setTokenCombatSr() {
        game.combats?.forEach(async (combat) => {
          const combatant = token && combat.getCombatantByToken(token.id);
          combatant &&
            // @ts-ignore 0.8
            (await combat.updateEmbeddedDocuments("Combatant", [
              {
                // @ts-ignore 0.8
                _id: combatant.id,
                initiative: sr,
              },
            ]));
        });
      }

      el.addEventListener("click", async (ev: Event) => {
        clickCount = Math.max(clickCount, (ev as MouseEvent).detail);
        if (clickCount >= 2) {
          // Ignore double clicks by doing the same as on single click
          setTokenCombatSr();
          clickCount = 0;
        } else if (clickCount === 1) {
          setTimeout(async () => {
            if (clickCount === 1 && token) {
              setTokenCombatSr();
            }
            clickCount = 0;
          }, CONFIG.RQG.dblClickTimeout);
        }
      });
    });

    // Open Linked Journal Entry
    (this.form as HTMLElement).querySelectorAll("[data-journal-id]").forEach((el: Element) => {
      const pack = getDomDataset($(el as HTMLElement), "journal-pack");
      const id = getRequiredDomDataset($(el as HTMLElement), "journal-id");
      el.addEventListener("click", () => RqgActorSheet.showJournalEntry(id, pack));
    });

    // Edit Item (open the item sheet)
    (this.form as HTMLElement).querySelectorAll("[data-item-edit]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      const item = this.actor.items.get(itemId);
      if (!item || !item.sheet) {
        const msg = `Couldn't find itemId [${itemId}] on actor ${this.actor.name} to open item sheet (during setup).`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
      el.addEventListener("click", () => item.sheet!.render(true));
    });

    // Delete Item (remove item from actor)
    (this.form as HTMLElement).querySelectorAll("[data-item-delete]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      el.addEventListener("click", () => RqgActorSheet.confirmItemDelete(this.actor, itemId));
    });

    // Cycle the equipped state of a physical Item
    (this.form as HTMLElement).querySelectorAll("[data-item-equipped-toggle]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      el.addEventListener("click", async () => {
        const item = this.actor.items.get(itemId);
        if (!item || !("equippedStatus" in item.data.data)) {
          const msg = `Couldn't find itemId [${itemId}] to toggle the equipped state (when clicked).`;
          ui.notifications?.error(msg);
          throw new RqgError(msg);
        }
        const newStatus =
          equippedStatuses[
            (equippedStatuses.indexOf(item.data.data.equippedStatus) + 1) % equippedStatuses.length
          ];
        // Will trigger a Actor#_onModifyEmbeddedEntity that will update the other physical items in the same location tree
        await item.update({ "data.equippedStatus": newStatus });
      });
    });

    // Edit item value
    (this.form as HTMLElement).querySelectorAll("[data-item-edit-value]").forEach((el) => {
      const path = getRequiredDomDataset($(el as HTMLElement), "item-edit-value");
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      el.addEventListener("change", async (event) => {
        const item = this.actor.items.get(itemId);
        if (!item) {
          const msg = `Couldn't find itemId [${itemId}] to edit an item (when clicked).`;
          ui.notifications?.error(msg);
          throw new RqgError(msg);
        }
        await item.update({ [path]: (event.target as HTMLInputElement).value }, {});
      });
    });

    // Add wound to hit location TODO move listener to hitlocation
    (this.form as HTMLElement).querySelectorAll("[data-item-add-wound]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      const speakerName = this.token?.name || this.actor.data.token.name;
      el.addEventListener("click", () =>
        HitLocationSheet.showAddWoundDialog(this.actor, itemId, speakerName)
      );
    });

    // Heal wounds to hit location TODO move listener to hitlocation
    (this.form as HTMLElement).querySelectorAll("[data-item-heal-wound]").forEach((el) => {
      const itemId = getRequiredDomDataset($(el as HTMLElement), "item-id");
      el.addEventListener("click", () => HitLocationSheet.showHealWoundDialog(this.actor, itemId));
    });

    // Edit Actor Active Effect
    (this.form as HTMLElement).querySelectorAll("[data-actor-effect-edit]").forEach((el) => {
      const effectId = getRequiredDomDataset($(el as HTMLElement), "effect-id");
      el.addEventListener("click", () => {
        const effect = this.actor.effects.get(effectId);
        if (!effect) {
          const msg = `Couldn't find active effect id [${effectId}] to edit the effect (when clicked).`;
          ui.notifications?.error(msg);
          throw new RqgError(msg);
        }
        new ActiveEffectConfig(effect).render(true);
      });
    });
  }

  static confirmItemDelete(actor: RqgActor, itemId: string): void {
    const item = actor.items.get(itemId);
    if (!item) {
      const msg = `Couldn't find itemId [${itemId}] on actor ${actor.name} to show delete item Dialog (when clicked).`;
      ui.notifications?.error(msg);
      throw new RqgError(msg);
    }
    new Dialog(
      {
        title: `Delete ${item.type}: ${item.name}`,
        content: "Do you want to delete this item",
        default: "submit",
        buttons: {
          submit: {
            icon: '<i class="fas fa-check"></i>',
            label: "Confirm",
            callback: async () => {
              // @ts-ignore 0.8
              await actor.deleteEmbeddedDocuments("Item", [itemId]);
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => null,
          },
        },
      },
      {
        classes: ["rqg", "dialog"],
      }
    ).render(true);
  }

  // TODO Move somewhere else!
  // TODO Compare to new foundry implementation!!!
  static async showJournalEntry(id: string, packName?: string): Promise<void> {
    let entity;

    // Compendium Link
    if (packName) {
      const pack = game.packs?.get(packName);
      entity = id && pack ? await pack.getEntity(id) : null;

      // World Entity Link
    } else {
      // @ts-ignore 0.8
      const cls = CONFIG.JournalEntry.documentClass;
      // @ts-ignore
      entity = cls.collection.get(id);
    }
    if (!entity) {
      const msg = `Couldn't find journal with id [${id}] and packName ${packName} to to show it.`;
      ui.notifications?.error(msg);
      throw new RqgError(msg);
    }
    entity.sheet.render(true);
  }
}
