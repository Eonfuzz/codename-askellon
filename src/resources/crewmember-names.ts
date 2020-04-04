import { COL_GOLD, COL_VENTS, COL_TEAL, COL_ATTATCH } from "./colours";

/** @noSelfInFile **/
export enum ROLE_TYPES {
    CAPTAIN = 'Captain',
    NAVIGATOR = 'Navigator',
    ENGINEER = 'Engineer',
    SEC_GUARD = 'Security Guard',
    MAJOR = 'Major',
    DOCTOR = 'Doctor',
}
export const ROLE_NAMES = new Map<string, Array<string>>();

ROLE_NAMES.set(ROLE_TYPES.CAPTAIN, [
    "Captain Keenest", "Captain Kirk", "Captain Jack Sparrow", "Captain Creed", 
    "Captain Coloma", "Captain Dallas", "Captain Cutter", "Captain Reynolds", 
    "Captain Willard", "Captain Fodder", "Captain Cookie", "Captain Kimstar",
    "Captain Picard", "Captain Jakov", "Captain Shepherd", "Captain America",
    "Captain Sullivan", "Captain Frost", "Captain Shane"
]);

ROLE_NAMES.set(ROLE_TYPES.NAVIGATOR, [
    "Admiral Ackbar", "Admiral Doubt", "Admiral Hansel", "Admiral Gretel", "Admiral Jones", "Admiral Aedus",
    "Admiral Alex", "Navigator Stanley"
]);

ROLE_NAMES.set(ROLE_TYPES.SEC_GUARD, [
    "Pvt Clarke", "Pvt. \"Slick\" Jones", "Col. Kaedin", "Sly Marbo", "Pvt. Frost",
    "Pvt. Riley", "Pvt. Blake", "Pvt. Vasquez", "Pvt. Allen", "Pvt. Jenkins", "Pvt. Summers",
    "Pvt. Pyle", "Pvt. Harding", "Pvt. Hudson", "Cpl. Baker", "Cpl. Hicks", "Cpl. Emerich",
    "Cpl. Dilan", "Cpl. Collins", "Cpl. Duncan", "Cpl. Farquaad", "Pvt. Parts", "Pvt Fuzz",
    "Pvt Chapman", "Pvt Piggy", "Col. Harkon",
]);

ROLE_NAMES.set(ROLE_TYPES.ENGINEER, [
    "Engineer Fahr", "Engineer Isaac"
]);

ROLE_NAMES.set(ROLE_TYPES.MAJOR, [
    "Maj. Bonner", "Maj. Hatter", "Maj. Vonstroheim"
]);

ROLE_NAMES.set(ROLE_TYPES.DOCTOR, [
    "Doctor Dimento", "Doctor Quack", "Dr. Diggus Bickus", "Dr. Who"
]);


export const ROLE_DESCRIPTIONS = new Map<ROLE_TYPES, string>();

ROLE_DESCRIPTIONS.set(ROLE_TYPES.CAPTAIN, `The ${COL_GOLD}Captain|r controls station security targeting and pilots the Askellon through deep space.|nIt is your job to ensure your crew survive the trip.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.NAVIGATOR, `As ${COL_VENTS}Navigator|r you must scan deep space and lead your ${COL_GOLD}Captain|r through deep space.|nYou are also in charge of the Cargo Bay's ships.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.DOCTOR, `As ${COL_TEAL}Doctor|r research and upgrade Healthcare while using the Gene Splicer to upgrade your comrades.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.MAJOR, `Major is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.SEC_GUARD, `${COL_ATTATCH}Security Guards|r gain 30% bonus experience when damaging Alien Hosts`);