import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD, COL_INFO, COL_TEAL, COL_PINK, COL_MISC, COL_ORANGE, } from "./colours";
import { MapPlayer, Unit } from "w3ts/index";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PLAYER_COLOR } from "lib/translators";

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
export const STR_UPGRADE_NAME_RELIGION = (researchLevel: number) => `${COL_PINK}RELIGIOUS DOGMA|r${COL_GOLD} TIER ${researchLevel}|r`;


export const STR_UPGRADE_COMPLETE_HEADER = () => `${COL_GOLD}-= STATION FUNCTIONALITY RESTORED =-|r`;
export const STR_UPGRADE_COMPLETE_SUBTITLE = (upgradeName: string) => `${COL_GOLD}RESEARCH:|r ${upgradeName}`;
export const STR_UPGRADE_COMPLETE_INFESTATION = () => `${COL_ALIEN}INFESTATION COMPLETE|r`;
export const STR_OCCUPATION_BONUS = () => `${COL_ATTATCH}OCCUPATION BONUS UNLOCKED|r`;

export const STR_GENE_SUCCESSFUL = () => `${COL_INFO}Gene Splicing:|r ${COL_GOOD}SUCCESSFUL|r`
export const STR_GENE_ALIEN_SUCCESSFUL = () => `${COL_ALIEN}Mimicking human genome response|r`

export const STR_ALIEN_DEATH = (who: MapPlayer, whoColor: string, crew: Crewmember, alien: Unit, isAlienHost: boolean) => `
${COL_ALIEN}An Alien has been slain!|r
|cff${whoColor}${crew.name}|r${COL_ALIEN} was ${isAlienHost ? 'the Alien Host' : 'an Alien Spawn'}|r`;


export const STR_GENETIC_SAMPLE = (who: MapPlayer, forUnit: Unit) => `${COL_MISC}Mandate :: All staff are to ensure they are regularly tested and immunized. The Askellon cannot afford another quarantine breach.|r

This is a genetic sample of ${COL_GOOD}${forUnit.nameProper}|r.
Bring this to the ${COL_TEAL}Genetic Sequencer|r to have it tested; if the sample is ${COL_ALIEN}infected|r the Crew will be alerted.`;

export const GENETIC_FACILITY_TOOLTIP = (slot1, slot2, slot3, slot4) => `|cff00ffffGenetic Sequencing |rFacility
${ slot4 ? `${COL_GOLD}Activate Computer to continue` : `${COL_MISC}Right Click to place a sample inside` }
${COL_MISC}[ ${slot1 ? `|r${GetItemName(slot1)}${COL_MISC}` : `Sample Required`} ]
[ ${slot2 ? `|r${GetItemName(slot2)}${COL_MISC}` : `Sample Required`} ]
[ ${slot3 ? `|r${GetItemName(slot3)}${COL_MISC}` : `Sample Required`} ]
[ ${slot4 ? `|r${GetItemName(slot4)}${COL_MISC}` : `Sample Required`} ]`;


export const TARGETING_TOOLTIP = (isTargeted: boolean, who: MapPlayer, crew: Crewmember) => `${isTargeted ? 'Untarget' : 'Target' } |cff${ PLAYER_COLOR[who.id] }${crew.name}|r`
export const TARGETING_TOOLTIP_EXTENDED = (isTargeted: boolean, who: MapPlayer, crew: Crewmember) => `${COL_MISC}Used often as a first resort by tyrannical captains, and a last resort by naive captains.|r

Current Status: ${isTargeted ? `${COL_ATTATCH}TARGETED|r` : `${COL_GOOD}UNTARGETED|r`}

Causes the security to attack or ignore the designated crewmember.`