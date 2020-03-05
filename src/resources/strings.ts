import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD } from "./colours";

export const STR_OPT_MESSAGE = `${COL_BAD}Role Preference|r`;
export const STR_OPT_HUMAN = `Human`;
export const STR_OPT_ALIEN = `Alien`;
export const STR_OPT_CULT = `Cultist`;

export const STR_UPGRADE_NAME_WEAPONS = (researchLevel: number) => `${COL_ATTATCH}WEAPONS PRODUCTION TIER ${researchLevel}|r`;

export const STR_UPGRADE_COMPLETE_HEADER = (upgradeName: string) => `${COL_GOLD}-= STATION FUNCTIONALITY RESTORED =-|r`;
export const STR_UPGRADE_COMPLETE_SUBTITLE = (upgradeName: string) => `${COL_GOLD}RESEARCH:|r ${upgradeName}`;
export const STR_UPGRADE_COMPLETE_INFESTATION = (upgradeName: string) => `${COL_ALIEN}INFESTATION COMPLETE|r`;
