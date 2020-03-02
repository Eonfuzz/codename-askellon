
/**
 * Should always be defined,
 * Used for measuring Z heights
 */
let TEMP_LOCATION = Location(0, 0);

export function getZFromXY(x: number, y: number): number {
    MoveLocation(TEMP_LOCATION, x, y);
    return GetLocationZ(TEMP_LOCATION)
}