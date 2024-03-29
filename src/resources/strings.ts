import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD, COL_INFO, COL_TEAL, COL_PINK, COL_MISC, COL_ORANGE, } from "./colours";
import { MapPlayer, Unit, playerColors } from "w3ts/index";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PlayerStateFactory } from "app/force/player-state-entity";

export const STR_OPT_MESSAGE = `${COL_BAD}Role Preference|r`;
export const STR_OPT_HUMAN = `Human`;
export const STR_OPT_ALIEN = `Alien`;
export const STR_OPT_CULT = `Cultist`;

export const STR_CHAT_ALIEN_HOST = 'Alien Host';
export const STR_CHAT_ALIEN_SPAWN = 'Alien Spawn';
export const STR_CHAT_ALIEN_TAG = 'ALIEN';

export const STR_GENE_REQUIRES_HEALTHCARE = `${COL_TEAL}Gene Splicer|r ${COL_GOLD}requires Healthcare 2.0|r`

export const STR_UPGRADE_NAME_WEAPONS = (researchLevel: number) => `${COL_ATTATCH}WEAPONS PRODUCTION|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_HEALTHCARE = (researchLevel: number) => `${COL_INFO}HEALTHCARE|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_VOID = (researchLevel: number) => `${COL_PINK}VOID DELVING|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_RELIGION = (researchLevel: number) => `${COL_PINK}RELIGIOUS DOGMA|r${COL_GOLD} TIER ${researchLevel}|r`;
export const STR_UPGRADE_NAME_REACTOR = (researchLevel: number) => `${COL_PINK}REACTOR SYSTEMS|r${COL_GOLD} TIER ${researchLevel}|r`; 
export const STR_UPGRADE_NAME_SECURITY = (researchLevel: number) => `${COL_PINK}SECURITY MAINFRAME|r${COL_GOLD} TIER ${researchLevel}|r`; 
export const STR_UPGRADE_MINERALS_PROGRESS = (researchLevel: number) => `RAW MATERIALS QUOTA [${COL_GOLD}${researchLevel * 200}/${researchLevel * 200}|r] ${
    researchLevel === 1 ? `${COL_TEAL}Blood Tester|r Repaired and functional` : 
    researchLevel === 2 ? `${COL_ATTATCH}Crewmember|r Health and Amror improved` : 
    `${COL_GOLD}Askellon Engines|r reactivated`
}`;
export const STR_UPGRADE_NAME_BLOOD_TESTER = (researchLevel: number) => `${COL_PINK}GENETIC SEQUENCER|r${COL_GOLD} ONLINE|r`; 
export const GENETIC_FACILITY_TOOLTIP = (testerSlots: item[]) => {

    let nString = `|cff00ffffBlood Testing|r Facility|n`+
    `${ testerSlots.length >= 4 
        ? `${COL_GOLD}Activate Computer to continue` 
        : `${COL_MISC}Right Click to place a sample inside` 
    }|r|n`;

    for (let index = 0; index < 4; index++) {
        const i = testerSlots[index];
        if (i) {
            const pI = GetItemUserData(i);

            if (pI >= 0) {
                const player = PlayerStateFactory.get(pI);
                const pName = player.getCrewmember().name;
                nString += `[ ${playerColors[pI].code+pName}|r ]|n`
            }
            else {
                nString += `[ ${COL_GOOD}Unidentified Sample|r ]|n`
            }
        }
        else {
            nString += `[ Sample Required ]|n`
        }
    }
    return nString;
}

export const STR_UPGRADE_COMPLETE_HEADER = () => `${COL_GOLD}-= STATION FUNCTIONALITY RESTORED =-|r`;
export const STR_UPGRADE_COMPLETE_SUBTITLE = (upgradeName: string) => `${COL_GOLD}RESEARCH:|r ${upgradeName}`;
export const STR_UPGRADE_COMPLETE_INFESTATION = () => `${COL_ALIEN}INFESTATION COMPLETE|r`;
export const STR_OCCUPATION_BONUS = () => `${COL_ATTATCH}OCCUPATION BONUS UNLOCKED|r`;

export const STR_GENE_SUCCESSFUL = () => `${COL_INFO}Gene Splicing:|r ${COL_GOOD}SUCCESSFUL|r`

export const STR_ALIEN_DEATH = (who: MapPlayer, whoColor: string, crew: Crewmember, alien: Unit, isAlienHost: boolean) => `
${COL_ALIEN}An Alien has been slain!|r
${whoColor}${crew.name}|r${COL_ALIEN} was ${isAlienHost ? 'the Alien Host' : 'an Alien Spawn'}|r`;


export const STR_GENETIC_SAMPLE = (who: MapPlayer, forUnit: Unit) => `${COL_MISC}Mandate :: All staff are to ensure they are regularly tested and immunized. The Askellon cannot afford another quarantine breach.|r

This is a genetic sample of ${playerColors[forUnit.owner.id].code}${forUnit.nameProper}|r.
Bring this to the ${COL_TEAL}Blood Tester|r to have it tested; if the sample is ${COL_ALIEN}infected|r the Crew will be alerted.

${COL_ORANGE}Ethics requires you to get consent before extracting sample|r`;
export const STR_GENETIC_SAMPLE_PURE = (who: MapPlayer, forUnit: Unit) => `${COL_MISC}Mandate :: All staff are to ensure they are regularly tested and immunized. The Askellon cannot afford another quarantine breach.|r

A pure, uncontanimated sample of a ${playerColors[forUnit.owner.id].code}${forUnit.name}|r.
Bring this to the ${COL_TEAL}Blood Tester|r to have it tested; A ${COL_GOOD}Pure|r sample may be inserted multiple times.

${COL_ORANGE}Animals were harmed during the making of this. You monster.|r`;

export const GENETIC_FACILITY_TOOLTIP_DAMAGED = () => `|cff00ffffBlood Testing|r Facility
${COL_MISC}This facility is |r${COL_ATTATCH}Offline|r${COL_MISC}
Repair it by using the nearby terminal|r`;


export const TARGETING_TOOLTIP = (isTargeted: boolean, who: MapPlayer, crew: Crewmember) => `${isTargeted ? 'Untarget' : 'Target' } ${ playerColors[who.id].code }${crew.name}|r`
export const TARGETING_TOOLTIP_EXTENDED = (isTargeted: boolean, who: MapPlayer, crew: Crewmember) => `${COL_MISC}Used often as a first resort by tyrannical captains, and a last resort by naive captains.|r

Current Status: ${isTargeted ? `${COL_ATTATCH}TARGETED|r` : `${COL_GOOD}UNTARGETED|r`}

Causes the security to attack or ignore the designated crewmember.`