import { exportedForTesting, getDamageDegree } from "./combatCalculations";
import { AbilitySuccessLevelEnum } from "../rolls/AbilityRoll/AbilityRoll.defs";
import { RqgError } from "./util";

describe("getDamageDegree", () => {
  it("should return the correct damage degree for parry", () => {
    const result = getDamageDegree(
      "parry",
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Failure,
    );
    expect(result).toBe("normal");
  });

  it("should return the correct damage degree for dodge", () => {
    const result = getDamageDegree(
      "dodge",
      AbilitySuccessLevelEnum.Special,
      AbilitySuccessLevelEnum.Failure,
    );
    expect(result).toBe("special");
  });

  it("should return the correct damage degree for ignore", () => {
    const result = getDamageDegree(
      "ignore",
      AbilitySuccessLevelEnum.Critical,
      AbilitySuccessLevelEnum.Failure,
    );
    expect(result).toBe("maxSpecial");
  });

  it("should throw an error for unsupported defence type", () => {
    expect(() =>
      getDamageDegree(
        "unsupported" as any,
        AbilitySuccessLevelEnum.Success,
        AbilitySuccessLevelEnum.Failure,
      ),
    ).toThrow(RqgError);
  });
});

const calculateDamages = exportedForTesting.calculateDamages;

describe("calculateDamages", () => {
  it("should return correct damage for Success:Success attack and parry", () => {
    const result = calculateDamages(
      "parry",
      10,
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Success,
      5,
      5,
    );
    expect(result).toEqual({
      weaponDamage: 1,
      defenderHitLocationDamage: 5,
      parryingHitLocation: true,
    });
  });

  it("should return correct damage for Success:Failure attack and parry", () => {
    const result = calculateDamages(
      "parry",
      20,
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Failure,
      10,
      4,
    );
    expect(result).toEqual({
      weaponDamage: undefined,
      defenderHitLocationDamage: 20,
      parryingHitLocation: false,
    });
  });

  it("should return correct damage for Crit:Special attack and parry", () => {
    const result = calculateDamages(
      "parry",
      50,
      AbilitySuccessLevelEnum.Critical,
      AbilitySuccessLevelEnum.Special,
      4,
      12,
    );
    expect(result).toEqual({
      weaponDamage: 1,
      defenderHitLocationDamage: 46,
      parryingHitLocation: true,
    });
  });

  it("should return correct damage for Failure:Success attack and parry", () => {
    const result = calculateDamages(
      "parry",
      20,
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Failure,
      10,
      4,
    );
    expect(result).toEqual({
      weaponDamage: undefined,
      defenderHitLocationDamage: 20,
      parryingHitLocation: false,
    });
  });

  it("should return correct damage for a successful dodge", () => {
    const result = calculateDamages(
      "dodge",
      10,
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Success,
      undefined,
      undefined,
    );
    expect(result).toEqual({
      weaponDamage: undefined,
      defenderHitLocationDamage: 10,
      parryingHitLocation: false,
    });
  });

  it("should return correct damage for ignore defense", () => {
    const result = calculateDamages(
      "ignore",
      10,
      AbilitySuccessLevelEnum.Success,
      AbilitySuccessLevelEnum.Failure,
      undefined,
      undefined,
    );
    expect(result).toEqual({
      weaponDamage: undefined,
      defenderHitLocationDamage: 10,
      parryingHitLocation: false,
    });
  });

  it("should throw an error if defence success level is undefined for parry", () => {
    expect(() =>
      calculateDamages("parry", 10, AbilitySuccessLevelEnum.Success, undefined, 5, 5),
    ).toThrow(RqgError);
  });

  it("should throw an error if no damage calculating function is found for parry", () => {
    expect(() =>
      calculateDamages("parry", 10, "unsupported" as any, AbilitySuccessLevelEnum.Success, 5, 5),
    ).toThrow(RqgError);
  });
});
