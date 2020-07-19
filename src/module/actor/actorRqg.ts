/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
import { ActorDataRqg } from "../data-model/actor-data/actorDataRqg";
import { Modifiers } from "../modifiers";
import { HitLocation } from "../data-model/actor-data/hitLocation";

export class ActorRqg extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  /** @override */
  prepareData() {
    super.prepareData();

    const actorData: ActorData = this.data;
    const data: ActorDataRqg = actorData.data;
    const flags = actorData.flags;

    // *** Setup calculated stats ***
    data.attributes.magicPoints.max = data.characteristics.power.chance;
    data.attributes.dexStrikeRank = Modifiers.dexSR(
      data.characteristics.dexterity.chance
    );
    data.attributes.sizStrikeRank = Modifiers.sizSR(
      data.characteristics.size.chance
    );
    data.attributes.hitPoints.max = Modifiers.hitPoints(
      data.characteristics.constitution.chance,
      data.characteristics.size.chance,
      data.characteristics.power.chance
    );

    console.log(
      "**** Modifiers.hitPointsPerLocation(data.attributes.hitPoints.max)",
      Modifiers.hitPointsPerLocation(data.attributes.hitPoints.max)
    );

    console.log(Array.isArray(data.hitLocations));

    Modifiers.hitPointsPerLocation(data.attributes.hitPoints.max).forEach(
      (tuple) => {
        const location = data.hitLocations[tuple[0]];
        if (location) {
          // TODO Check if this location exists (for this race) - needs work...
          data.hitLocations[tuple[0]].hp.max = tuple[1];
        }
      }
    );

    Modifiers.hitPointsPerLocation(data.attributes.hitPoints.max).forEach(
      (tuple) => {
        const hitLocations: [string, HitLocation][] = Object.entries(
          data.hitLocations
        );
        hitLocations.find((l) => l[0] === tuple[0])[1].hp.max = tuple[1];
      }
    );

    data.attributes.damageBonus = Modifiers.damageBonus(
      data.characteristics.strength.chance,
      data.characteristics.size.chance
    );
    data.attributes.healingRate = Modifiers.healingRate(
      data.characteristics.constitution.chance
    );
    data.attributes.spiritCombatDamage = Modifiers.spiritCombatDamage(
      data.characteristics.power.chance,
      data.characteristics.charisma.chance
    );
    data.attributes.maximumEncumbrance =
      (data.characteristics.strength.chance +
        data.characteristics.constitution.chance) /
      2;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    // if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data: ActorDataRqg = actorData.data;

    // Make modifications to data here.

    // TODO  modifying the base chance
    //   private static calcHitPoints(data: ActorDataRqg): number {
    //     return data.characteristics.constitution.chance;
    //   }

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(data.abilities)) {
    //   // Calculate the modifier using d20 rules.
    //   ability.mod = Math.floor((ability.value - 10) / 2);
    // }
  }

  prepareEmbeddedEntities() {
    super.prepareEmbeddedEntities();
  }
  RollData() {
    // const data = super.getRollData();
    // const shorthand = game.settings.get("rqg", "macroShorthand");
    //
    // // Re-map all attributes onto the base roll data
    // if (!!shorthand) {
    //     for (let [k, v] of Object.entries(data.attributes)) {
    //         if (!(k in data)) data[k] = v.value;
    //     }
    //     delete data.attributes;
    // }
    // Map all items data using their slugified names
    // data.items = this.data.items.reduce((obj, i) => {
    //     let key = i.name.slugify({strict: true});
    //     let itemData = duplicate(i.data);
    //     if (!!shorthand) {
    //         for (let [k, v] of Object.entries(itemData.attributes)) {
    //             if (!(k in itemData)) itemData[k] = v.value;
    //         }
    //         delete itemData["attributes"];
    //     }
    //     obj[key] = itemData;
    //     return obj;
    // }, {});
    // return data;
  }
}
