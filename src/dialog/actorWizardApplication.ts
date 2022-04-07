import { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import { RqgActor } from "../actors/rqgActor";
import { ActorTypeEnum } from "../data-model/actor-data/rqgActorData";
import { getActorTemplates } from "../system/api/rqidApi";
import { RQG_CONFIG } from "../system/config";
import { getGame, localize } from "../system/util";

export class ActorWizard extends FormApplication {
  actor: RqgActor;
  species: {
    selectedSpeciesTemplate: RqgActor | undefined;
    speciesTemplates: RqgActor[] | undefined;
  } = { selectedSpeciesTemplate: undefined, speciesTemplates: undefined };

  constructor(object: RqgActor, options: any) {
    super(object, options);
    this.actor = object;
    const templateId = this.actor.getFlag(
      RQG_CONFIG.flagScope,
      RQG_CONFIG.actorWizardFlags.selectedSpeciesId
    );

    const template = getGame().actors?.get(templateId as string) as RqgActor;

    if (!template) {
      this.species.selectedSpeciesTemplate = undefined;
    }
    //@ts-ignore
    else if (template?.type === ActorTypeEnum.Character) {
      this.species.selectedSpeciesTemplate = template as RqgActor;
    } else {
      this.species.selectedSpeciesTemplate = undefined;
      const msg = `The Actor named ${this.actor.name} has a \n${RQG_CONFIG.actorWizardFlags.selectedSpeciesId}\n flag with a value that is not an RqgActor.`;
      console.warn(msg);
      ui.notifications?.warn(msg);
    }
  }

  static get defaultOptions(): FormApplication.Options {
    return mergeObject(FormApplication.defaultOptions, {
      classes: ["rqg", "sheet", ActorTypeEnum.Character],
      popOut: true,
      template: "systems/rqg/dialog/actorWizardApplication.hbs",
      id: "actor-wizard-application",
      title: localize("RQG.ActorCreation.AdventurerCreationWizardTitle"),
      width: 850,
      height: 650,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true,
      resizable: true,
      tabs: [
        {
          navSelector: ".creation-sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "0-species",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  async getData(): Promise<any> {
    //TODO: this should probably have a specific class

    if (!this.species.speciesTemplates) {
      // Don't get these every time.
      this.species.speciesTemplates = await getActorTemplates();
    }

    if (
      !this.species.selectedSpeciesTemplate &&
      this.species.speciesTemplates &&
      this.species.speciesTemplates.length > 0
    ) {
      // TODO: Set to the first one, but when we have rqid for templates set to "Human"
      this.species.selectedSpeciesTemplate = this.species.speciesTemplates[0];
    }

    return {
      actor: this.actor,
      species: this.species,
    };
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    this.form?.querySelectorAll("[data-actor-creation-complete]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        this._setActorCreationComplete();
      });
    });
  }

  _setActorCreationComplete() {
    this.actor.setFlag(RQG_CONFIG.flagScope, RQG_CONFIG.actorWizardFlags.actorWizardComplete, true);
    document.querySelectorAll(`.actor-wizard-button-${this.actor.id}`).forEach((el) => {
      el.remove();
    });
    this.close();
  }

  async _updateObject(event: Event, formData?: object): Promise<unknown> {
    console.log("Update Object", formData);

    console.log(formData);

    //@ts-ignore selectedSpeciesTemplateId
    const selectedTemplateId = formData?.selectedSpeciesTemplateId;

    this.species.selectedSpeciesTemplate = this.species.speciesTemplates?.find(
      (t) => t.id === selectedTemplateId
    );

    await this.actor.unsetFlag(RQG_CONFIG.flagScope, RQG_CONFIG.actorWizardFlags.selectedSpeciesId);

    const foo = { foo: "glorp", bar: "florp" };

    await this.actor.setFlag(
      RQG_CONFIG.flagScope,
      RQG_CONFIG.actorWizardFlags.selectedSpeciesId,
      this.species.selectedSpeciesTemplate?.id
    );

    const templateChars = this.species.selectedSpeciesTemplate?.data.data.characteristics;

    if (templateChars) {
      const update = {
        data:{
        characteristics: {
          strength: {
            formula: templateChars.strength.formula,
          },
          constitution: {
            formula: templateChars.constitution.formula,
          },
          size: {
            formula: templateChars.size.formula,
          },
          dexterity: {
            formula: templateChars.dexterity.formula,
          },
          intelligence: {
            formula: templateChars.intelligence.formula,
          },
          power: {
            formula: templateChars.power.formula,
          },
          charisma: {
            formula: templateChars.charisma.formula,
          },
        },
        background: {
          species: this.species.selectedSpeciesTemplate?.data.data.background.species,
        },
      }
    }

      await this.actor.update(update);
    }

    this.render();

    return;
  }
}
