import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD, COL_INFO, COL_TEAL, } from "./colours";
import { ROLE_TYPES } from "app/crewmember/crewmember-names";

export const ROLE_DESCRIPTIONS = new Map<ROLE_TYPES, string>();

ROLE_DESCRIPTIONS.set(ROLE_TYPES.CAPTAIN, `Captain role is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.NAVIGATOR, `Navigator role is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.DOCTOR, `As the ${COL_TEAL}Doctor|r your main job is research Healthcare and splice Gene's into your fellow Crewmembers.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.MAJOR, ``);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.SEC_GUARD, `${COL_ATTATCH}Security Guards|r gain 30% bonus experience when damaging Alien Hosts`);