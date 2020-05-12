import { Game } from "app/game";
import { Trigger, Unit, Timer } from "w3ts";
import { ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { Vector3 } from "app/types/vector3";
import { getZFromXY, getAirBlockers } from "lib/utils";
import { TimedEvent } from "app/types/timed-event";
import { STUN_ID } from "app/interactions/interaction-event";
import { SoundRef } from "app/types/sound-ref";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { Log } from "lib/serilog/serilog";

/**
 * These locations are declared by the world editor
 */
declare const udg_fall_points: rect[];
declare const udg_fall_results: rect[];
declare const udg_fall_result_zone_names: string[];

declare const udg_jump_pass_zones: rect[];
declare const udg_jump_pass_zones_name: string[];

declare const udg_killzones: rect[];

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
        // Log.Information("Calling leap callbacks");
        this.onFinishCallback = (entry) => cb(entry);
    }

    update(delta: number) {
        const posDelta = this.mover.move(
            this.mover.originalPos, 
            this.mover.originalDelta, 
            this.mover.velocity, 
            delta
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

/**
 * Used to leap across space and time
 * Specifically, tracks where a unit lands and moves them elsewhere if needed
 */
export class LeapModule {
    game: Game;
    leapTrigger: Timer;

    instances: LeapEntry[] = [];

    fallingSounds = [
        new SoundRef("Sounds\\FallingWind.mp3", false),
        new SoundRef("Sounds\\FallingWhistle.mp3", false),
        new SoundRef("Sounds\\SnakeDeath.mp3", false)
    ];

    constructor(game: Game) {
        this.game = game;
        // this.leapTrigger = new Trigger();
    }

    /**
     * Creates a timer and begins looping through all leps
     */
    initialise() {
        this.leapTrigger = new Timer();
        // this.leapTrigger.registerTimerEvent(LEAP_INTERVAL, true);
        // this.leapTrigger.addAction(() => this.updateLeaps());
    }

    updateLeaps() {
        // Loop through instances
        this.instances = this.instances.filter(i => {
            const doDestroy = !i.update(LEAP_INTERVAL);
            if (doDestroy) {
                // If we need to destroy proc the callback
                if (i.onFinishCallback) i.onFinishCallback(i);
                // Now get unit xyz
                const unitLoc = i.location;
                const insideRectIndex = this.findInsideRect(udg_fall_points, unitLoc);
                const insideKillZone = this.findInsideRect(udg_killzones, unitLoc);

                if (insideKillZone) {
                    KillUnit(i.unit);
                    return false;
                }

                // If we are inside a fall rect...
                // FALL!
                if (insideRectIndex) {
                    const targetRect = udg_fall_results[insideRectIndex];
                    targetRect && this.makeUnitFall(i.unit, targetRect, udg_fall_result_zone_names[insideRectIndex]);
                }
                // Otherwise check to see if we landed in a new zone 
                else {
                    const newZone = this.findInsideRect(udg_jump_pass_zones, unitLoc);
                    const resultZone = !!newZone && udg_jump_pass_zones_name[newZone];
                    const z = resultZone && this.game.worldModule.getZoneByName(resultZone);
                    z && this.game.worldModule.travel(Unit.fromHandle(i.unit), z);
                }
            }

            return !doDestroy;
        });
        
        if (this.instances.length === 0) {
            this.leapTrigger.pause();
        }
    }

    makeUnitFall(who: unit, targetRect: rect, zoneName: string) {
        // Get random point in rect
        const locX = GetRandomReal(GetRectMinX(targetRect), GetRectMaxX(targetRect));
        const locY = GetRandomReal(GetRectMinY(targetRect), GetRectMaxY(targetRect));
        const player = GetOwningPlayer(who);

        // Hide and pause unit
        BlzPauseUnitEx(who, true);
        ShowUnit(who, false);

        const seed = GetRandomInt(0, 100);
        let fallingSound;
        if (seed <= 70) {
            fallingSound = this.fallingSounds[0];
        }
        else if (seed <= 90) {
            fallingSound = this.fallingSounds[1];
        }
        else {
            fallingSound = this.fallingSounds[2];
        }
        fallingSound.playSoundOnUnit(who, 127);

        // After 1.7 seconds unpause the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            // Move the player to the matching location
            const z = this.game.worldModule.getZoneByName(zoneName);
            z && this.game.worldModule.travel(Unit.fromHandle(who), z);

            PanCameraToTimedForPlayer(player, locX, locY, 0);

            // Add height to the unit
            UnitAddAbility(who, UNIT_IS_FLY);
            BlzUnitDisableAbility(who, UNIT_IS_FLY, true, true);
            SetUnitFlyHeight(who, 800, 9999);
            SetUnitPathing(who, false);
            return true;
        }, 250));

        // After 1.7 seconds unpause the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            // Move unit to here
            SetUnitX(who, locX);
            SetUnitY(who, locY);

            ShowUnit(who, true);
            // Select
            SelectUnitAddForPlayer(who, player);
            return true;
        }, 500));

        // After 1.7 seconds unpause the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            // Select
            SelectUnitAddForPlayer(who, player);
            SetUnitFlyHeight(who, 0, 1600);
            return true;
        }, 2300));

        // After 1.5 seconds move the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {

            // Damage the unit by 40% of its current hp
            const damage = GetUnitState(who, UNIT_STATE_LIFE) * 0.4;
            UnitDamageTarget(who, who, damage, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);

            SetUnitAnimation(who, "death");

            let sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", locX, locY);
            DestroyEffect(sfx);
            return true;
        }, 2800));

        // After 1.7 seconds unpause the unit
        this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
            BlzPauseUnitEx(who, false);
            UnitRemoveAbility(who, UNIT_IS_FLY);
            SetUnitPathing(who, true);
            SetUnitFlyHeight(who, 0, 9999);
            return true;
        }, 5800));
    }

    findInsideRect(rects: rect[], loc: Vector3): number | void {
        // Loop through the fall points
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
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
        if (this.instances.length === 1) {
            this.leapTrigger.start(LEAP_INTERVAL, true, () => this.updateLeaps());
        }
        return leapInstance;
    }
}