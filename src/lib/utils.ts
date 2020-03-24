import { Vector2 } from "app/types/vector2";

/**
 * Should always be defined,
 * Used for measuring Z heights
 */
let TEMP_LOCATION = Location(0, 0);

export function getZFromXY(x: number, y: number): number {
    MoveLocation(TEMP_LOCATION, x, y);
    return GetLocationZ(TEMP_LOCATION)
}



/**
 * Returns a spread of vector2[] 
 * @param angleDegreeLeft 
 * @param angleDegreeRight 
 * @param distance 
 */
export function getPointsInRangeWithSpread(angleDegLeft: number, angleDegRight: number, numLocs: number, distance: number, centralModifier?: number): Vector2[] {
    const result = [];

    const endAngle = angleDegRight;
    let currentAngle = angleDegLeft;
    const incrementBy = (endAngle - currentAngle) / numLocs;
    
    while (currentAngle <= endAngle) {
        let distanceModifier: number = centralModifier ? 1 + Sin((result.length / numLocs) * bj_PI) * centralModifier : 1;

        result.push(
            new Vector2(0, 0).applyPolarOffset(currentAngle, distance * distanceModifier)
        );
        
        // Increment current angle
        currentAngle += incrementBy;
    }

    return result;
}