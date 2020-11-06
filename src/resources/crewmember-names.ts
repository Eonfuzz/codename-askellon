import { COL_GOLD, COL_VENTS, COL_TEAL, COL_ATTATCH, COL_GOOD, COL_ALIEN } from "./colours";
import { Vector2 } from "app/types/vector2";

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
export const ROLE_SPAWN_LOCATIONS = new Map<ROLE_TYPES, Vector2[]>();

ROLE_NAMES.set(ROLE_TYPES.CAPTAIN, [
    "Captain Keenest", "Captain Kirk", "Captain Jack Sparrow", "Captain Creed", 
    "Captain Coloma", "Captain Dallas", "Captain Cutter", "Captain Reynolds", 
    "Captain Willard", "Captain Fodder", "Captain Cook", "Captain Kimstar",
    "Captain Picard", "Captain Jakov", "Captain Shepherd", "Captain America",
    "Captain Sullivan", "Captain Frost", "Captain Shane", "Captain Blazkowicz"
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
    "Engineer Fahr", "Engineer Isaac", "Engineer \"Support\" Ware", "Engineer Zed", "Engineer Swann", 
    "Engineer Arhanul", "Engineer Homer",
]);

ROLE_NAMES.set(ROLE_TYPES.MAJOR, [
    "Maj. Bonner", "Maj. Hatter", "Maj. Vonstroheim"
]);

ROLE_NAMES.set(ROLE_TYPES.DOCTOR, [
    "Doctor Dimento", "Doctor Quack", "Doctor Who", "Doctor Chemix", "Doctor Freeman", "Doctor Kimberly", "Doctor Strange"
]);

ROLE_NAMES.set(ROLE_TYPES.INQUISITOR, [
    "Inquisitor Ithuriel", "Inquisitor Sapharax", "Inquisitor Eisenhorn", "Inquisitor Rhasan", "Inquisitor Lazarus", 
    "Inquisitor Fyre", "Inquisitor Pariah", "Inquisitor Tosh"
]);

ROLE_NAMES.set(ROLE_TYPES.PILOT, [
    "\"Top Gun\" Maverick", "Hoban \"Wash\" Washburne", "Gilbert Ward \"Thomas\" Kane", "Carl \"Chunky\" Rodgers", "Crocodile Jim", "Jebediah Kerman", "Jaeger \"Ace\" Ventura"
]);


export const ROLE_DESCRIPTIONS = new Map<ROLE_TYPES, string>();

ROLE_DESCRIPTIONS.set(ROLE_TYPES.CAPTAIN, `${COL_GOOD}- Guide your crew by using the ${COL_TEAL}Security Terminal|r${COL_GOOD}
- Eliminate outliers by ${COL_TEAL}targeting|r${COL_GOOD} by terminal
- Gain bonus experience points while on the bridge|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.NAVIGATOR, `As ${COL_GOLD}Navigator|r you must scan deep space and lead your ${COL_GOLD}Captain|r through deep space.|nYou are also in charge of the Cargo Bay's ships.`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.DOCTOR, `${COL_GOOD}- Use your ${COL_TEAL}Genetic Sampler|r${COL_GOOD} to get Samples
- Feed samples to the ${COL_TEAL}Blood Tester|r${COL_GOOD} and find the alien
- Upgrade your allies by usign the ${COL_TEAL}Gene Splicer|r${COL_GOOD}
- Start the game with +2 Vitality and +4 Will
- Gain bonus experience points while applying Genetic Splices
- Gain bonus experience points while Sequencing DNA|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.MAJOR, `Major is WIP`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.SEC_GUARD, `${COL_GOOD}- Hunt down and eliminate any ${COL_ALIEN}Alien forces|r${COL_GOOD}
- Start the game with +10% bonus damage
- Receive bonus experience from combat
- Starts with Harkon's Blitzer`);

ROLE_DESCRIPTIONS.set(ROLE_TYPES.INQUISITOR, `${COL_GOOD}- Bless your brothers with the ${COL_TEAL}Seal of Purity|r${COL_GOOD}
- Become extremely powerful by upgrading in the ${COL_TEAL}Cathederal|r${COL_GOOD}
- Gain permanent attribute boosts by using ${COL_TEAL}Seal of Purity|r${COL_ATTATCH}
- Religion prevents you from ever Gene Splicing|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.PILOT, `${COL_GOOD}- Protect the Askellon from harm using ace pilot skills
- Mine asteroids in space for permanent upgrades
- Gain bonus experience from dog fights and mining
- Ship speed is increased by 10%
- Ship fuel costs reduced by 10%|r`);
ROLE_DESCRIPTIONS.set(ROLE_TYPES.ENGINEER, `${COL_GOOD}- Maintain and repair the ${COL_TEAL}Reactor|r${COL_GOOD}
- Use the ${COL_TEAL}Reactor's|r${COL_GOOD} special abilities to turn the tide of battle
- Use ${COL_TEAL}Repair Kits|r${COL_GOOD} to remove rubble
- Begin the game with 3 bonus Vitality, 5 Repairs Kits and a Signal Booster|r`);

 
export const ROLE_GUIDES = new Map<ROLE_TYPES, string>();
// export const CREW_ROLE_DESC = `Restore the ship to its full functional`;
ROLE_GUIDES.set(ROLE_TYPES.CAPTAIN, `Your role is a work in progress, you gain bonus experience points while on bridge.`);