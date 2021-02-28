import { Unit, Timer } from "w3ts";
import { Vector3 } from "app/types/vector3";
import { SoundRef } from "app/types/sound-ref";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { Log } from "lib/serilog/serilog";
import { Entity } from "app/entity-type";
import { Leap } from "./leap-type";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Hooks } from "lib/Hooks";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";

/**
 * These locations are declared by the world editor
 */
declare const udg_fall_points: rect[];
declare const udg_fall_results: rect[];
declare const udg_fall_result_zone_names: string[];

declare const udg_killzones: rect[];

/**
 * Used to leap across space and time
 * Specifically, tracks where a unit lands and moves them elsewhere if needed
 */
export class LeapEntity extends Entity {
    private static instance: LeapEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new LeapEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    instances: Leap[] = [];

    fallingSounds = [
        new SoundRef("Sounds\\FallingWind.mp3", false),
        new SoundRef("Sounds\\FallingWhistle.mp3", false),
        new SoundRef("Sounds\\SnakeDeath.mp3", false)
    ];
    
    _timerDelay = 0.02;
    step() {
        let i = 0;
        while (i < this.instances.length) {
            const leap = this.instances[i];

            if (leap.update(this._timerDelay)) {
                i++;
            }
            else {
                this.onLeapDestroy(leap);
                this.instances[i] = this.instances[ this.instances.length - 1];
                delete this.instances[this.instances.length - 1];
            }
        }
    }

    private onLeapDestroy(leap: Leap) {
        // If we need to destroy proc the callback
        if (leap.onFinishCallback) leap.onFinishCallback(leap);
        // Now get unit xyz
        const unitLoc = leap.location;
        const insideRectIndex = this.findInsideRect(udg_fall_points, unitLoc);
        const insideKillZone = this.findInsideRect(udg_killzones, unitLoc);

        if (insideKillZone) {
            KillUnit(leap.unit);
            return false;
        }

        // If we are inside a fall rect...
        // FALL!
        if (insideRectIndex) {
            const targetRect = udg_fall_results[insideRectIndex];
            targetRect && this.makeUnitFall(leap.unit, targetRect, udg_fall_result_zone_names[insideRectIndex]);
        }
        // Otherwise check to see if we landed in a new zone 
        else {
            const newZone = WorldEntity.getInstance().getPointZone(unitLoc.x, unitLoc.y);
            if (newZone) {
                // Special planet check
                if (newZone.id === ZONE_TYPE.PLANET) {
                    const height = GetTerrainCliffLevel(unitLoc.x, unitLoc.y);
                    if (height < 2) {
                        KillUnit(leap.unit);
                        return false;
                    }
                }
                // Travel the unit as needed
                EventEntity.send(EVENT_TYPE.TRAVEL_UNIT_TO, {
                    source: Unit.fromHandle(leap.unit),
                    data: { zoneName: newZone.id }
                })
            }
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
        Timers.addTimedAction(0.25, () => {
            // Move the player to the matching location
            if (zoneName) {
                // Travel the unit as needed
                EventEntity.send(EVENT_TYPE.TRAVEL_UNIT_TO, {
                    source: Unit.fromHandle(who),
                    data: { zoneName: zoneName }
                })
            }

            PanCameraToTimedForPlayer(player, locX, locY, 0);

            // Add height to the unit
            UnitAddAbility(who, UNIT_IS_FLY);
            BlzUnitDisableAbility(who, UNIT_IS_FLY, true, true);
            SetUnitFlyHeight(who, 800, 9999);
            SetUnitPathing(who, false);
            return true;
        });

        // After 1.7 seconds unpause the unit
        Timers.addTimedAction(0.5, () => {
            // Move unit to here
            SetUnitX(who, locX);
            SetUnitY(who, locY);

            ShowUnit(who, true);
            // Select
            SelectUnitAddForPlayer(who, player);
            return true;
        });

        // After 1.7 seconds unpause the unit
        Timers.addTimedAction(2.3, () => {
            // Select
            SelectUnitAddForPlayer(who, player);
            SetUnitFlyHeight(who, 0, 1600);
            return true;
        });

        // After 1.5 seconds move the unit
        Timers.addTimedAction(2.8, () => {

            // Damage the unit by 40% of its current hp
            const damage = GetUnitState(who, UNIT_STATE_LIFE) * 0.4;
            UnitDamageTarget(who, who, damage, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);

            SetUnitAnimation(who, "death");

            let sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", locX, locY);
            DestroyEffect(sfx);
            return true;
        });

        // After 1.7 seconds unpause the unit
        Timers.addTimedAction(5.8, () => {
            BlzPauseUnitEx(who, false);
            UnitRemoveAbility(who, UNIT_IS_FLY);
            SetUnitPathing(who, true);
            SetUnitFlyHeight(who, 0, 9999);
            return true;
        });
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

    newLeap(who: unit, toWhere: Vector3, angle: number, timescale?: number): Leap {
        const leapInstance = new Leap(who, toWhere, angle, timescale);
        this.instances.push(leapInstance);
        return leapInstance;
    }
}