import { COL_GOLD, COL_VENTS, COL_TEAL, COL_ATTATCH, COL_GOOD } from "./colours";

/** @noSelfInFile **/
export enum ROLE_TYPES {
    CAPTAIN = 'Captain',
    NAVIGATOR = 'Navigator',
    ENGINEER = 'Engineer',
    SEC_GUARD = 'Security Guard',
    MAJOR = 'Major',
    DOCTOR = 'Doctor',
    INQUISITOR = 'Inquisitor',
    PILOT = 'Pilot'
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
    "Doctor Dimento", "Doctor Quack", "Doctor Diggus Bickus", "Doctor Who", "Doctor Chemix"
]);

ROLE_NAMES.set(ROLE_TYPES.INQUISITOR, [
    "Inquisitor Ithuriel", "Inquisitor Sapharax", "Inquisitor Eisenhorn", "Inquisitor Rhasan", "Inquisitor Lazarus", "Inquisitor Fyre"
]);

ROLE_NAMES.set(ROLE_TYPES.PILOT, [
    "\"Top Gun\" Maverick", "Hoban \"Wash\" Washburne", "Gilbert Ward \"Thomas\" Kane"
]);


export const ROLE_DESCRIPTIONS = new Map<ROLE_TYPES, string>();

ROLE_DESCRIPTIONS.set(ROLE_TYPES.CAPTAIN, `The ${COL_GOLD}Captain|r pilots the Askellon through deep space.
${COL_GOOD}- Start the game at level 2 and have bonus Will
- Gain bonus experience points while on the bridge|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.NAVIGATOR, `As ${COL_GOLD}Navigator|r you must scan deep space and lead your ${COL_GOLD}Captain|r through deep space.|nYou are also in charge of the Cargo Bay's ships.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.DOCTOR, `The ${COL_GOLD}Doctor|r researches Genetic enhancement and hunts the Alien.
${COL_GOOD}- Start the game with +2 Vitality and +4 Will
- Gain bonus experience points while applying Genetic Splices
- Gain bonus experience points while Sequencing DNA
- Start with a Genetic Sampler|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.MAJOR, `Major is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.SEC_GUARD, `${COL_GOLD}Security Guards|r patrols the station to ensure order is upheld.
${COL_GOOD}- Start the game with +10% bonus damage
- Receive bonus experience from combat
- Starts with Harkon's Blitzer`);

ROLE_DESCRIPTIONS.set(ROLE_TYPES.INQUISITOR, `The ${COL_GOLD}Inquisitor|r hunts down xenos scum.
${COL_GOOD}- Start the game with Seal of Purity
- Cannot benefit from Gene Splicing
- Can upgrade abilities in the Cathederal|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.PILOT, `The ${COL_GOLD}Pilot|r patrols the void and mines minerals.
${COL_GOOD}- Receive bonus experience from mining
- Receive bonus experience for fighting in space
- All ship abilities cost 1 less mana
- Ships lose 10% less fuel|r`);