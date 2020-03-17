import { COL_GOOD, COL_VENTS, COL_BAD, COL_ALIEN, COL_ATTATCH, COL_GOLD, COL_INFO, COL_TEAL, } from "./colours";
import { ROLE_TYPES } from "app/crewmember/crewmember-names";

export const ROLE_DESCRIPTIONS = new Map<ROLE_TYPES, string>();

ROLE_DESCRIPTIONS.set(ROLE_TYPES.CAPTAIN, `The ${COL_GOLD}Captain|r controls station security targeting and pilots the Askellon through deep space.|nIt is your job to ensure your crew survive the trip.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.NAVIGATOR, `As ${COL_VENTS}Navigator|r you must scan deep space and lead your ${COL_GOLD}Captain|r through deep space.|nYou are also in charge of the Cargo Bay's ships.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.DOCTOR, `As ${COL_TEAL}Doctor|r research and upgrade Healthcare while using the Gene Splicer to upgrade your comrades.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.MAJOR, `Major is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.SEC_GUARD, `${COL_ATTATCH}Security Guards|r gain 30% bonus experience when damaging Alien Hosts`);