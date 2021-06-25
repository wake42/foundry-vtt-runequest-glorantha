import { RqgActorSheet } from "../rqgActorSheet";
import { WeaponCard } from "../../chat/weaponCard";
import { RqgActor } from "../rqgActor";
import { getDomDataset, RqgError } from "../../system/util";

export const combatMenuOptions = (actor: RqgActor, token: Token | null): ContextMenu.Item[] => [
  {
    name: "Roll (click)",
    icon: '<i class="fas fa-dice-d20"></i>',
    condition: () => true,
    callback: async (el: JQuery) => {
      const skillItemId = getDomDataset(el, "skill-id");
      const weaponItemId = getDomDataset(el, "item-id");
      if (skillItemId && weaponItemId) {
        await WeaponCard.show(weaponItemId, skillItemId, actor, token);
      } else {
        const msg = `Couldn't find skillId [${skillItemId}] or weaponId [${weaponItemId}] on actor ${actor.name} to show the weapon chat card from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
    },
  },
  {
    name: "Toggle Experience",
    icon: '<i class="fas fa-lightbulb"></i>',
    condition: () => true,
    callback: async (el: JQuery) => {
      const itemId = getDomDataset(el, "skill-id");
      const item = itemId && actor.items.get(itemId);
      if (!item || !("hasExperience" in item.data.data)) {
        const msg = `Couldn't find itemId [${itemId}] on actor ${actor.name} to toggle experience from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
      const toggledExperience = !item.data.data.hasExperience;
      await item.update({ "data.hasExperience": toggledExperience }, {});
    },
  },
  {
    name: "Edit Skill",
    icon: '<i class="fas fa-edit"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const skillItemId = getDomDataset(el, "skill-id");
      const skillItem = skillItemId && actor.items.get(skillItemId);
      if (!skillItem || !skillItem.sheet) {
        const msg = `Couldn't find itemId [${skillItemId}] on actor ${actor.name} to show skill Item sheet from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
      skillItem.sheet.render(true);
      return;
    },
  },
  {
    name: "Edit Weapon",
    icon: '<i class="fas fa-edit"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const weaponItemId = getDomDataset(el, "item-id");
      const item = weaponItemId && actor.items.get(weaponItemId);
      if (!item || !item.sheet) {
        const msg = `Couldn't find itemId [${weaponItemId}] on actor ${actor.name} to show weapon item sheet from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
      item.sheet.render(true);
    },
  },
  {
    name: "Delete Skill",
    icon: '<i class="fas fa-trash"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const skillItemId = getDomDataset(el, "skill-id");
      if (skillItemId) {
        RqgActorSheet.confirmItemDelete(actor, skillItemId);
      } else {
        const msg = `Couldn't find itemId [${skillItemId}] on actor ${actor.name} to delete skill item from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
    },
  },
  {
    name: "Delete Weapon",
    icon: '<i class="fas fa-trash"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const weaponItemId = getDomDataset(el, "item-id");
      if (weaponItemId) {
        RqgActorSheet.confirmItemDelete(actor, weaponItemId);
      } else {
        const msg = `Couldn't find itemId [${weaponItemId}] on actor ${actor.name} to delete weapon item from the combat context menu.`;
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
    },
  },
];
