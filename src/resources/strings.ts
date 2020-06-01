import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD, COL_INFO, COL_TEAL, COL_PINK, } from "./colours";
import { MapPlayer, Unit } from "w3ts/index";
import { Crewmember } from "app/crewmember/crewmember-type";

export const STR_OPT_MESSAGE = `${COL_BAD}Role Preference|r`;
export const STR_OPT_HUMAN = `Human`;
export const STR_OPT_ALIEN = `Alien`;
export const STR_OPT_CULT = `Cultist`;

export const STR_CHAT_ALIEN_HOST = 'Alien Host';
export const STR_CHAT_ALIEN_SPAWN = 'Alien Spawn';
export const STR_CHAT_ALIEN_TAG = '[ALIEN]';

export const STR_GENE_REQUIRES_HEALTHCARE = `${COL_TEAL}Gene Splicer|r ${COL_GOLD}requires Healthcare 2.0|r`

export const STR_UPGRADE_NAME_WEAPONS = (researchLevel: number) => `${COL_ATTATCH}WEAPONS PRODUCTION|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_HEALTHCARE = (researchLevel: number) => `${COL_INFO}HEALTHCARE|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_VOID = (researchLevel: number) => `${COL_PINK}VOID FARING|r${COL_GOLD} TIER ${researchLevel}|r`;


export const STR_UPGRADE_COMPLETE_HEADER = () => `${COL_GOLD}-= STATION FUNCTIONALITY RESTORED =-|r`;
export const STR_UPGRADE_COMPLETE_SUBTITLE = (upgradeName: string) => `${COL_GOLD}RESEARCH:|r ${upgradeName}`;
export const STR_UPGRADE_COMPLETE_INFESTATION = () => `${COL_ALIEN}INFESTATION COMPLETE|r`;

export const STR_GENE_SUCCESSFUL = () => `${COL_INFO}Gene Splicing:|r ${COL_GOOD}SUCCESSFUL|r`
export const STR_GENE_ALIEN_SUCCESSFUL = () => `${COL_ALIEN}Mimicking human genome response|r`

export const STR_ALIEN_DEATH = (who: MapPlayer, whoColor: string, crew: Crewmember, alien: Unit, isAlienHost: boolean) => `
${COL_ALIEN}An Alien has been slain!|r
|cff${whoColor}${crew.name}|r${COL_ALIEN} was ${isAlienHost ? 'the Alien Host' : 'an Alien Spawn'}|r`;
