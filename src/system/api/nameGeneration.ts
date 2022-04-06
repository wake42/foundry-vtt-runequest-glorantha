import { SystemData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";
import { match } from "assert";
import Foswig from "foswig";
import { stringify } from "querystring";
import { RQG_CONFIG } from "../config";
import { getGame, localize } from "../util";
import { Rqid } from "./rqidApi";

export class nameGeneration {
  static defaultConstraints = {
    minLength: 2,
    maxLength: 10,
    allowDuplicates: true,
    maxAttempts: 25,
  };

  /**
   * Generate one or more names from the RollTable or JournalEntry Name Base referenced in the rqid.
   *
   * Markov Examples:
   *
   * Generate 1 name using the default constraints:
   * ```
   * await game.system.api.names.Generate("je.names-sartarite-female")
   * ```
   * Generate 10 names using the default constraints:
   * ```
   * await game.system.api.names.Generate("je.names-sartarite-female", 10)
   * ```
   * Generate 20 names overriding some of the properties of the default constraints
   * ```
   * await game.system.api.names.Generate("je.names-sartarite-female", 20, {maxAttempts: 5, allowDuplicates: false,})
   * ```
   *
   * RollTable Examples:
   * ```
   * await game.system.api.names.Generate("rt.names-sartarite-male", 20)
   * ```
   */
  static async Generate(
    rqid: string,
    num: number = 1,
    constraints = this.defaultConstraints
  ): Promise<string[] | undefined> {
    if (!rqid) {
      return undefined;
    }

    if (rqid.startsWith(RQG_CONFIG.rqidPrefixes.journalEntry)) {
      return this.GenerateFromNameBase(rqid, num, constraints);
    }

    if (rqid.startsWith(RQG_CONFIG.rqidPrefixes.rollTable)) {
      // Generate a name from a Roll Table
      return this.GenerateFromRollTable(rqid, num, constraints);
    }

    const msg = localize("RQG.Notification.Warn.NameGenRqidNotSupported", { rqid: rqid });
    console.warn(msg);
    ui.notifications?.warn(msg);

    return undefined;
  }

  static async GenerateFromNameBase(
    rqid: string,
    num: number = 1,
    constraints = this.defaultConstraints
  ): Promise<string[] | undefined> {
    if (!rqid) {
      return undefined;
    }

    // Generate a name using Foswig
    const nameBase = await this.GetNameBase(rqid);

    if (!nameBase) {
      const msg = localize("RQG.Notification.Warn.NameGenRqidNotFound", { rqid: rqid });
      console.warn(msg);
      ui.notifications?.warn(msg);
      return undefined;
    }

    // properties on the constraints will override defaultConstraints if they exist
    const mergedConstraints = { ...this.defaultConstraints, ...constraints };

    const chain = new Foswig(3, nameBase.names);
    const nameBaseNotLongEnoughMsg = localize("RQG.Notification.Warn.NameBaseNotLongEnough", {
      rqid: rqid,
      attempts: mergedConstraints.maxAttempts,
    });

    const numRolls = num < 1 ? 1 : num;

    const result: string[] = [];
    let warn = false;
    for (let i = 0; i < numRolls; i++) {
      try {
        result.push(chain.generate(mergedConstraints));
      } catch (error) {
        warn = true;
        console.log(nameBaseNotLongEnoughMsg, error);
      }
    }
    if (warn) {
      // Only warn once because the try catch above could fail numerous times
      console.warn(nameBaseNotLongEnoughMsg);
      ui.notifications?.warn(nameBaseNotLongEnoughMsg);
    }
    return result;
  }

  static async GetNameBases(): Promise<Map<string, NameBase> | undefined> {
    const worldRqids = getGame().journal?.map((j) => {
      //@ts-ignore flags.rqg
      if (j.data.flags?.rqg?.rqid.startsWith("names-")) {
        //@ts-ignore flags.rqg
        return j.data.flags?.rqg?.rqid;
      }
    });

    const compendiumRqids: string[] = [];
    for (const pack of getGame().packs) {
      if (pack.documentClass.name === "JournalEntry") {
        for (const journal of await pack.getDocuments()) {
          if (journal.data.flags?.rqg?.rqid.startsWith("names-")) {
            //@ts-ignore flags.rqg
            compendiumRqids.push(journal.data.flags?.rqg?.rqid);
          }
        }
      }
    }

    const allRqids = worldRqids
      ?.concat(compendiumRqids)
      .filter((v, i, a) => v !== undefined && a.indexOf(v) === i);

    if (allRqids !== undefined && allRqids.length > 0) {
      const result = new Map<string, NameBase>();
      allRqids.forEach(async (rqid) => {
        const nameBase = await this.GetNameBase(rqid);
        if (nameBase !== undefined) {
          result.set(nameBase.rqid, nameBase);
        }
      });

      return result;
    }

    return undefined;
  }

  static async GetNameBase(rqid: string, lang: string = "en"): Promise<NameBase | undefined> {
    const nameJournal = await Rqid.journalFromRqid(rqid, lang);

    if (nameJournal === undefined) {
      return undefined;
    }

    let names = nameJournal?.data.content;
    // TODO: This could possibly be more robust to allow users to not have to be exact in entering names
    names = names?.replace("<pre>", "").replace("</pre>", "");
    const nameArray = names?.split("<br />");

    const result = new NameBase({
      rqid: rqid,
      names: nameArray,
    });

    return result;
  }

  static async GenerateFromRollTable(
    rqid: string,
    num: number = 1,
    constraints = this.defaultConstraints
  ): Promise<string[] | undefined> {
    if (!rqid) {
      return undefined;
    }

    const nameTable = await Rqid.rollTableFromRqid(rqid);

    if (!nameTable) {
      const msg = localize("RQG.Notification.Warn.NameGenRqidNotFound", {
        rqid: rqid,
      });
      console.warn(msg);
      ui.notifications?.warn(msg);
      return undefined;
    }

    const numRolls = num < 1 ? 1 : num;

    const result: string[] = [];

    for (let i = 0; i < numRolls; i++) {
      //@ts-ignore roll
      const tableResult = await nameTable.roll();
      result.push(await this.ResolveTableResult(tableResult, constraints));
    }

    return result;
  }

  static async ResolveTableResult(
    tableResult: any,
    constraints = this.defaultConstraints
  ): Promise<string> {
    if (!tableResult.results[0].data.text) {
      return "";
    }

    const tableString: string = tableResult.results[0].data.text;
    let resultString = tableString;
    const regex = /[^{{\}\}]+(?=})/gm;
    let match;

    while ((match = regex.exec(tableString)) != null) {
      const generatedValue = await this.Generate(match[0], 1, constraints);
      if (generatedValue) {
        resultString = resultString.replace(match[0], generatedValue[0]);
      } 
      // If it couldn't generate a message, just leave the token. 
      //Error message will have already been displayed.
    }
    return resultString.replaceAll("{{", "").replaceAll("}}", "");
  }
}

class NameBase {
  rqid: string = "";
  names: string[] = [];
  public constructor(init?: Partial<NameBase>) {
    Object.assign(this, init);
  }
}
