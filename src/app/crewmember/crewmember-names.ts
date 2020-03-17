/** @noSelfInFile **/
export enum ROLE_TYPES {
    CAPTAIN = 'Captain',
    NAVIGATOR = 'Navigator',
    ENGINEER = 'Engineer',
    SEC_GUARD = 'Security Guard',
    MAJOR = 'Major',
    DOCTOR = 'Doctor',
}
export const ROLE_NAMES = new Map<string, string[]>();

ROLE_NAMES.set(ROLE_TYPES.CAPTAIN, [
    "Captain Keene", "Captain Kirk", "Captain Jack Sparrow", "Captain Creed", 
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
    "Cpl. Dilan", "Cpl. Collins", "Cpl. Duncan", "Cpl Farquaad", "Pvt. Parts", "Pvt Fuzz",
    "Pvt Chapman", "Pvt Piggy"
]);

ROLE_NAMES.set(ROLE_TYPES.ENGINEER, [
    "Engineer Fahr"
]);

ROLE_NAMES.set(ROLE_TYPES.MAJOR, [
    "Maj. Bonner", "Maj. Hatter", "Maj. Vonstroheim"
]);

ROLE_NAMES.set(ROLE_TYPES.DOCTOR, [
    "Doctor Dimento", "Doctor Quack", "Dr. Diggus Bickus", "Dr. Who"
]);