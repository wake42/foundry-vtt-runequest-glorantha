import { EquippedStatus } from "../data-model/item-data/IPhysicalItem";
import { SkillData } from "../data-model/item-data/skillData";

export const handlebarsHelpers = function () {
  Handlebars.registerHelper("concat", (...strs) =>
    strs.filter((s) => typeof s !== "object").join("")
  );
  Handlebars.registerHelper("json", (context) => JSON.stringify(context));

  Handlebars.registerHelper("currency", (value, unit) => {
    return `${new Intl.NumberFormat().format(value)} ${unit}`;
  });

  Handlebars.registerHelper("itemname", (itemId, actorId) => {
    const actor = game.actors.find((a) => a._id === actorId);
    if (!actor) {
      console.warn(
        `RQG | Handlebar helper "itemname": Couldn't find actor "${actorId}" while checking itemname "${itemId}" `
      );
    }
    const item = actor?.items.get(itemId);
    return item ? item.data.name : "---";
  });

  Handlebars.registerHelper("skillchance", (itemId, actorId) => {
    const actor = game.actors.find((a) => a._id === actorId);
    if (!actor) {
      console.warn(
        `RQG | Handlebar helper "skillchance": Couldn't find actor "${actorId}" while checking skill chance on item "${itemId}" `
      );
    }
    const item = actor?.items.get(itemId) as Item<SkillData>;
    return item ? item.data.data.chance : "---";
  });

  Handlebars.registerHelper("experiencedclass", (itemId, actorId) => {
    const actor = game.actors.find((a) => a._id === actorId);
    if (!actor) {
      console.warn(
        `RQG | Handlebar helper "experiencedclass": Couldn't find actor "${actorId}" while checking experience on item "${itemId}" `
      );
    }
    const item = actor?.items.get(itemId) as Item<any>;
    return item && item.data.data.hasExperience ? "experienced" : "";
  });

  Handlebars.registerHelper("quantity", (itemId, actorId) => {
    const actor = game.actors.find((a) => a._id === actorId);
    if (!actor) {
      console.warn(
        `RQG | Handlebar helper "quantity": Couldn't find actor "${actorId}" while checking quantity on item "${itemId}" `
      );
    }
    const item = actor?.items.get(itemId) as Item<any>;
    return item ? item.data.data.quantity : "---";
  });

  Handlebars.registerHelper("runeImg", (runeName) => {
    const allRunesIndex = game.settings.get("rqg", "runes");
    return allRunesIndex.find((r) => r.name === runeName)?.img;
  });

  Handlebars.registerHelper("enrichHtml", (content) => {
    return TextEditor.enrichHTML(content);
  });

  Handlebars.registerHelper("equippedIcon", (equippedStatus: EquippedStatus) => {
    equippedStatus = equippedStatus ? equippedStatus : "notCarried";
    return CONFIG.RQG.equippedIcons[equippedStatus];
  });

  Handlebars.registerHelper("gearViewIcon", (view: string) => {
    return CONFIG.RQG.gearViewIcons[view];
  });

  Handlebars.registerHelper("yes-no", (bool) => {
    return bool ? "yes" : "no";
  });

  Handlebars.registerHelper("multiply", (...nums) => {
    nums.pop();
    return Math.floor(
      nums.reduce((acc, n) => {
        acc = acc * n;
        return acc;
      })
    );
  });

  Handlebars.registerHelper("sum", (...nums) => {
    nums.pop();
    return nums.reduce((acc, n) => {
      acc = acc + n;
      return acc;
    });
  });

  Handlebars.registerHelper("buildPhysicalItemLocation", (physicalItem, level) => {
    if (!level) level = 1;
    let str = "";
    for (let i = 0; i < level; i++) str += "+";
    str += Handlebars.partials["systems/rqg/actors/parts/physical-item-location.html"]({
      physicalItemLocation: physicalItem,
    });
    physicalItem.friends.forEach((o) => {
      str = str + this.buildObject(o, level + 1);
    });
    return new Handlebars.SafeString(str);
  });
};
