import { ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { Vector3 } from "app/types/vector3";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { getAirBlockers, getZFromXY } from "lib/utils";

export class Leap {
    unit: unit;
    mover: ProjectileMoverParabolic;
    location: Vector3;
    initalLocation: Vector3;
    timescale: number;

    // The leap is finished
    // Called BEFORE falling down to the abyss
    onFinishCallback?: (entry: Leap) => void;

    constructor(who: unit, toWhere: Vector3, angle: number, timescale: number = 1) {
        const cX = GetUnitX(who);
        const cY = GetUnitY(who);
        const cZ = getZFromXY(cX, cY);

        this.unit = who;
        this.location = new Vector3(cX, cY, cZ);
        this.initalLocation = new Vector3(cX, cY, cZ);
        this.timescale = timescale;
        this.mover = new ProjectileMoverParabolic(
            this.location,
            toWhere,
            Deg2Rad(angle)
        );

        BlzPauseUnitEx(who, true);
        UnitAddAbility(who, UNIT_IS_FLY);
        BlzUnitDisableAbility(who, UNIT_IS_FLY, true, true);
    }

    onFinish(cb: (entry: Leap) => void) {
        // Log.Information("Calling leap callbacks");
        this.onFinishCallback = (entry) => cb(entry);
    }

    update(delta: number) {

        // Log.Information("Updating leap");
        const posDelta = this.mover.move(
            this.mover.originalPos, 
            this.mover.originalDelta, 
            this.mover.velocity, 
            delta*this.timescale
        );

        const uX = GetUnitX(this.unit);
        const uY = GetUnitY(this.unit);

        const unitLoc = new Vector3(
            uX + posDelta.x,
            uY + posDelta.y,
            this.location.z + posDelta.z
        );

        const airBlockers = getAirBlockers(
            uX < unitLoc.x ? uX : unitLoc.x,
            uY < unitLoc.y ? uY : unitLoc.y,
            uX >= unitLoc.x ? uX : unitLoc.x,
            uX >= unitLoc.y ? uY : unitLoc.y,
        );
        if (airBlockers.length > 0) {
            unitLoc.x = uX;
            unitLoc.y = uY;
        }

        this.location = unitLoc;
        const terrainZ = getZFromXY(unitLoc.x, unitLoc.y);

        // Check to see if we would collide, if so don't update unit location
        if (this.location.z < terrainZ) {
            // Log.Information("Less than TZ");
            BlzPauseUnitEx(this.unit, false);
            UnitRemoveAbility(this.unit, UNIT_IS_FLY);
            SetUnitFlyHeight(this.unit, 0, 9999);

            // If we are in a cliff move back
            if (IsTerrainPathable(unitLoc.x, unitLoc.y, PATHING_TYPE_WALKABILITY)) {
                // Shunt us back
                let newLoc = unitLoc.subtract(posDelta.multiplyN(5));
                SetUnitX(this.unit, newLoc.x);
                SetUnitY(this.unit, newLoc.y);
            }
            
            return false;
        }

        // Update unit location
        SetUnitX(this.unit, unitLoc.x);
        SetUnitY(this.unit, unitLoc.y);
        SetUnitFlyHeight(this.unit, unitLoc.z-terrainZ, 9999);

        // Lets update this again next time
        return true;
    }
};
