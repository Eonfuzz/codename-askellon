import { Game } from "app/game";
import { Trigger } from "app/types/jass-overrides/trigger";
import { ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { UNIT_IS_FLY } from "lib/order-ids";
import { TimedEvent } from "app/types/timed-event";
import { STUN_ID } from "app/interactions/interaction-event";

/**
 * These locations are declared by the world editor
 */
declare const udg_fall_points: rect[];
declare const udg_fall_results: rect[];
declare const udg_fall_zone_names: string[];

export const LEAP_INTERVAL = 0.03;
export class LeapEntry {
    unit: unit;
    mover: ProjectileMoverParabolic;
    location: Vector3;
    initalLocation: Vector3;
    timescale: number;

    // The leap is finished
    // Called BEFORE falling down to the abyss
    onFinishCallback?: (entry: LeapEntry) => void;

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

    onFinish(cb: (entry: LeapEntry) => void) {
        this.onFinishCallback = cb;
    }

    update(delta: number) {

        const posDelta = this.mover.move(
            this.mover.originalPos, 
            this.mover.originalDelta, 
            this.mover.velocity, 
            delta
        );

        const unitLoc = new Vector3(
            GetUnitX(this.unit) + posDelta.x,
            GetUnitY(this.unit) + posDelta.y,
            this.location.z + posDelta.z
        );
        this.location = unitLoc;
        const terrainZ = getZFromXY(unitLoc.x, unitLoc.y);

        // Check to see if we would collide, if so don't update unit location
        if (this.location.z <= terrainZ) {

            BlzPauseUnitEx(this.unit, false);
            UnitRemoveAbility(this.unit, UNIT_IS_FLY);
            SetUnitFlyHeight(this.unit, 0, 9999);
            return false;
        }

        // Update unit location
        SetUnitX(this.unit, unitLoc.x);
        SetUnitY(this.unit, unitLoc.y);
        SetUnitFlyHeight(this.unit, unitLoc.z+this.initalLocation.z-terrainZ, 9999);

        // Lets update this again next time
        return true;
    }
};

/**
 * Used to leap across space and time
 * Specifically, tracks where a unit lands and moves them elsewhere if needed
 */
export class LeapModule {
    game: Game;
    leapTrigger: Trigger;

    instances: LeapEntry[] = [];

    constructor(game: Game) {
        this.game = game;
        this.leapTrigger = new Trigger();
    }

    /**
     * Creates a timer and begins looping through all leps
     */
    initialise() {
        this.leapTrigger.RegisterTimerEventPeriodic(LEAP_INTERVAL);
        this.leapTrigger.AddAction(() => this.updateLeaps())
    }

    updateLeaps() {
        // Loop through instances
        this.instances = this.instances.filter(i => {
            const doDestroy = i.update(LEAP_INTERVAL);

            if (doDestroy) {
                // If we need to destroy proc the callback
                if (i.onFinishCallback) i.onFinishCallback(i);
                // Now get unit xyz
                const unitLoc = i.location;
                const insideRectIndex = this.findInsideRect(unitLoc);
                // If we are inside a fall rect...
                // FALL!
                if (insideRectIndex) {
                    const targetRect = udg_fall_results[insideRectIndex];
                    targetRect && this.makeUnitFall(i.unit, targetRect, udg_fall_zone_names[insideRectIndex]);
                }
            }

            return doDestroy;
        });
    }

    makeUnitFall(who: unit, targetRect: rect, zoneName: string) {
        // Get random point in rect
        const locX = GetRandomReal(GetRectMinX(targetRect), GetRectMaxX(targetRect));
        const locY = GetRandomReal(GetRectMinY(targetRect), GetRectMaxY(targetRect));

        // Hide and pause unit
        BlzPauseUnitEx(who, true);
        ShowUnit(who, false);

        // Play fall sound
        // TODO

        // After 1.5 seconds move the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            // Move unit to here
            SetUnitX(who, locX);
            SetUnitY(who, locY);

            // Unhide
            ShowUnit(who, true);

            // Move the player to the matching location
            const z = this.game.worldModule.getZoneByName(zoneName);
            z && this.game.worldModule.travel(who, z);

            // Damage the unit by 40% of its current hp
            const damage = GetUnitState(who, UNIT_STATE_LIFE) * 0.4;
            UnitDamageTarget(who, who, damage, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);

            SetUnitAnimation(who, "death");

            this.game.useDummyFor((dummy: unit) => {
                // Order unit to stun the dude that just landed
            }, STUN_ID)
            return true;
        }, 1500));

        // After 1.7 seconds unpause the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            BlzPauseUnitEx(who, false);
            return true;
        }, 1500));
    }

    findInsideRect(loc: Vector3): number | void {
        // Loop through the fall points
        for (let i = 0; i < udg_fall_points.length; i++) {
            const rect = udg_fall_points[i];
            if (rect && 
                GetRectMinX(rect) < loc.x &&
                GetRectMinY(rect) < loc.y &&
                GetRectMaxX(rect) > loc.x &&
                GetRectMaxY(rect) > loc.y) return i; 
        }
    }

    newLeap(who: unit, toWhere: Vector3, angle: number, timescale?: number): LeapEntry {
        const leapInstance = new LeapEntry(who, toWhere, angle, timescale);
        this.instances.push(leapInstance);
        return leapInstance;
    }
}