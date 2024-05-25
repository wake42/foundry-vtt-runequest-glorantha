import type { RqgItem } from "../items/rqgItem";
import {
  assertActorType,
  assertItemType,
  getDomDataset,
  getGame,
  getRequiredDomDataset,
  localize,
  usersIdsThatOwnActor,
} from "../system/util";
import { ItemTypeEnum } from "../data-model/item-data/itemTypes";
import { DefenceType } from "./RqgChatMessage.types";
import { DefenceDialog } from "../applications/AttackFlow/defenceDialog";
import { systemId } from "../system/config";
import { templatePaths } from "../system/loadHandlebarsTemplates";
import { RqgActor } from "../actors/rqgActor";
import { ActorTypeEnum } from "../data-model/actor-data/rqgActorData";
import { DamageCalculations } from "../system/damageCalculations";
import type { RqgChatMessage } from "./RqgChatMessage";
import { AbilityRoll } from "../rolls/AbilityRoll/AbilityRoll";

export async function handleDefend(clickedButton: HTMLButtonElement): Promise<void> {
  const { chatMessageId, attackWeaponUuid } = getChatMessageInfo(clickedButton);

  const attackingWeapon = (await fromUuid(attackWeaponUuid)) as RqgItem | undefined;
  assertItemType(attackingWeapon?.type, ItemTypeEnum.Weapon);
  const defence = getRequiredDomDataset(clickedButton, "defence") as DefenceType;
  await new DefenceDialog(attackingWeapon, {
    defenceType: defence,
    chatMessageId: chatMessageId,
  }).render(true);
}

/**
 * Roll Damage and hit location rolls and update AttackChat with new state
 */
export async function handleDamageAndHitlocation(clickedButton: HTMLButtonElement): Promise<void> {
  const { chatMessageId } = getChatMessageInfo(clickedButton);

  const attackChatMessage = getGame().messages?.get(chatMessageId) as RqgChatMessage | undefined;
  if (!attackChatMessage) {
    // TODO Warn about missing chat message
    return;
  }

  const attackingWeaponUuid = getRequiredDomDataset(clickedButton, "attack-weapon-uuid");
  // @ts-expect-error fromUuidSync
  const attackWeapon = fromUuidSync(attackingWeaponUuid);

  const hitLocationRoll = new Roll("1d20");
  await hitLocationRoll.evaluate();

  // TODO const hitlocation = get target and find hitlocation from roll

  const damageRoll = new Roll("1d8+1"); // TODO fake damage formula
  await damageRoll.evaluate();

  const attackRoll = attackChatMessage.getFlag(systemId, "chat.attackRoll") as
    | AbilityRoll
    | undefined;
  const defendRoll = attackChatMessage.getFlag(systemId, "chat.defendRoll") as
    | AbilityRoll
    | undefined;
  const attackerActor = attackWeapon.parent; // TODO or attackingActorUuid
  const defendingActor = (await fromUuid(
    attackChatMessage.getFlag(systemId, "chat.defendingActorUuid"),
  )) as RqgActor | undefined;

  const { outcomeDescription, woundedActor, damagedWeapon } = calculateOutcome(
    attackRoll!,
    defendRoll!,
    damageRoll,
    hitLocationRoll,
    attackerActor,
    defendingActor,
    attackWeapon,
    // attackingNaturalWeaponHitlocation for parry damage
    // defenceSkill,
    // defendingWeapon,
  );

  const messageData = attackChatMessage.toObject();
  foundry.utils.mergeObject(
    messageData,
    {
      flags: {
        [systemId]: {
          chat: {
            attackState: `DamageRolled`,
            damageRoll: damageRoll,
            hitLocationRoll: hitLocationRoll,
            damagedActorUuid: woundedActor?.uuid,
            damagedWeaponUuid: damagedWeapon.uuid,
            outcomeDescription: outcomeDescription,
          },
        },
      },
    },
    { overwrite: true },
  );

  messageData.content = await renderTemplate(
    templatePaths.attackChatMessage,
    messageData.flags.rqg!.chat!,
  );

  await attackChatMessage?.update(messageData);

  // TODO update chat with rolls

  // TODO just testing.. should be part of the attack message.
  hitLocationRoll.toMessage();
  damageRoll.toMessage();
}

/**
 * Apply previously rolled damage to the actor pointed to by the actor-damage button
 */
export async function handleApplyActorDamage(clickedButton: HTMLButtonElement): Promise<void> {
  const { chatMessageId } = getChatMessageInfo(clickedButton);

  const attackChatMessage = getGame().messages?.get(chatMessageId);
  if (!attackChatMessage) {
    // TODO Warn about missing chat message
    return;
  }
  const damagedActorUuid = getRequiredDomDataset(clickedButton, "wounded-actor-uuid");
  const damagedActor = (await fromUuid(damagedActorUuid)) as RqgActor | undefined;
  if (!damagedActor) {
    // TODO Warn about missing token
    return;
  }
  assertActorType(damagedActor.type, ActorTypeEnum.Character);
  const damageRoll = attackChatMessage.getFlag(systemId, "chat.damageRoll") as Roll;
  const hitLocationRoll = attackChatMessage.getFlag(systemId, "chat.hitLocationRoll") as Roll;
  const damageAmount = damageRoll.total ?? 0;
  const hitLocationNumberAffected = hitLocationRoll.total;
  if (!hitLocationNumberAffected) {
    // TODO Warn about missing hitlocationResult
    return;
  }
  const damagedHitLocation = damagedActor.items.find(
    (i) =>
      hitLocationNumberAffected >= i.system.dieFrom && hitLocationNumberAffected <= i.system.dieTo,
  );
  if (!damagedHitLocation) {
    // TODO Warn about missing hitlocation
    return;
  }

  const messageData = attackChatMessage.toObject();
  const messageDataUpdate = {
    flags: {
      [systemId]: {
        chat: {
          actorDamagedApplied: true,
        },
      },
    },
  };
  foundry.utils.mergeObject(messageData, messageDataUpdate, { overwrite: true });

  messageData.content = await renderTemplate(
    templatePaths.attackChatMessage,
    messageData.flags[systemId]!.chat!,
  );

  await attackChatMessage?.update(messageData);

  // TODO refactor to inflictWound method on actor instead
  // TODO FIXME BUG - does not reduce damage by AP on hit location !!! ***
  // @ts-expect-error speaker
  const speaker = attackChatMessage.speaker;

  const { hitLocationUpdates, actorUpdates, notification, uselessLegs } =
    DamageCalculations.addWound(
      damageAmount,
      true,
      damagedHitLocation!,
      damagedActor as RqgActor,
      speaker,
    );

  console.error("RQG | TODO handle uselesslegs", uselessLegs); // TODO Handle uselesslegs

  hitLocationUpdates && (await damagedHitLocation!.update(hitLocationUpdates));
  actorUpdates && (await damagedActor!.update(actorUpdates as any)); // TODO fix type
  await ChatMessage.create({
    user: getGame().user?.id,
    speaker: speaker,
    content: localize("RQG.Item.HitLocation.AddWoundChatContent", {
      actorName: damagedActor!.name,
      hitLocationName: damagedHitLocation!.name,
      notification: notification,
    }),
    whisper: usersIdsThatOwnActor(damagedActor!),
  });
}

/**
 * Reduce weapon HP by the number of points specified by the data-weapon-damage dataset on the button
 */
export async function handleApplyWeaponDamage(clickedButton: HTMLButtonElement): Promise<void> {
  ui.notifications?.info(`NotYetInvented ${clickedButton.dataset}`);
}

/**
 * Utility function to extract data from the AttackChat html.
 * TODO How to decide what should be in html and what should be in flags?
 */
function getChatMessageInfo(button: HTMLElement): {
  chatMessageId: string;
  attackWeaponUuid: string;
  defenceWeaponUuid: string | undefined;
} {
  const chatMessageId = getRequiredDomDataset(button, "message-id");
  const attackWeaponUuid = getRequiredDomDataset(button, "attack-weapon-uuid");
  const defenceWeaponUuid = getDomDataset(button, "defend-weapon-uuid");
  return {
    chatMessageId: chatMessageId,
    attackWeaponUuid: attackWeaponUuid,
    defenceWeaponUuid: defenceWeaponUuid,
  };
}

function calculateOutcome(
  attackRoll: AbilityRoll,
  defendRoll: AbilityRoll,
  damageRoll: Roll,
  hitLocationRoll: Roll,
  attackerActor: RqgActor,
  defendingActor: RqgActor | undefined,
  attackWeapon: RqgItem,
  // attackingNaturalWeaponHitlocation for parry damage
  // defenceSkill,
  // defendingWeapon,
) {
  const damagedHitLocation = defendingActor?.items.find(
    (i) =>
      (hitLocationRoll.total ?? 0) >= i.system.dieFrom &&
      (hitLocationRoll.total ?? 0) <= i.system.dieTo,
  );
  const outcomeDescription = getOutcomeDescription(
    damageRoll.total ?? 0,
    damagedHitLocation?.name ?? "",
    hitLocationRoll.total ?? 0,
    0,
    0,
  );
  return {
    // TODO not correct actor/weapon for damage
    outcomeDescription: outcomeDescription,
    woundedActor: defendingActor,
    damagedWeapon: attackWeapon,
  };
}

function getOutcomeDescription(
  actorDamage: number,
  hitLocationName: string,
  hitLocationRoll: number,
  weaponDamage: number,
  weaponAbsorbtion: number,
): string {
  return `...and does ${actorDamage} damage to ${hitLocationName} (${hitLocationRoll}) defending weapon absorbs ${weaponAbsorbtion}hp and is reduces by ${weaponDamage}HP`;
}
