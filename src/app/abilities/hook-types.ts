export enum ABILITY_HOOK {
    UnitAttacks,
    UnitIsAttacked,
    UnitEntersMap,
    UnitIssuedOrder,

    PreUnitTakesDamage,
    PreUnitDealsDamage,
    PostUnitTakesDamage,
    PostUnitDealsDamage,

    UnitStartsCastingAbility,
    UnitCastsAbility,

    UnitDies,
    UnitKills,
    UnitLearnsASkill,
}