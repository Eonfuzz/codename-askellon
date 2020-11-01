import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../zone-id";
import { Log } from "../../../lib/serilog/serilog";

import { Unit } from "w3ts/handles/unit";
import { MapPlayer, Timer, Region, Rectangle } from "w3ts";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventData } from "app/events/event-data";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_GENE_NIGHTEYE } from "resources/ability-ids";
import { VisionFactory } from "app/vision/vision-factory";
import { VISION_PENALTY } from "app/vision/vision-type";
import { SoundRef } from "app/types/sound-ref";
import { getZFromXY } from "lib/utils";
import { Timers } from "app/timer-type";
import { LIGHT_DEST_ID } from "app/types/widget-id";
import { BuffInstanceCallback } from "app/buff/buff-instance-callback-type";
import { CREWMEMBER_UNIT_ID, DESTR_ID_POWERED_LIGHT_BLUE, DESTR_ID_POWERED_LIGHT_RED, DESTR_ID_POWERED_LIGHT_WHITE, DESTR_ID_POWERED_LIGHT_GREEN } from "resources/unit-ids";
import { Vector2 } from "app/types/vector2";
import { Zone } from "./zone-type";
import { ZoneWithExits } from "./zone-with-exits";

const LIGHT_CLACK = "Sounds\\LightClack.mp3";
declare const udg_power_generators: Array<unit>;
declare const udg_power_generator_zones: Array<string>;

export class ShipZone extends ZoneWithExits {
    private hasPower: boolean = true;
    public alwaysCauseFear: boolean = false;
    private hasOxygen: boolean = true;

    public lightSources: Array<destructable>;
    public powerGenerators: Array<Unit> = [];

    // The time remaining until power resumes
    private powerShortRemaining = 0;

    powerDownSound = new SoundRef("Sounds\\PowerDown.mp3", false, true);
    powerUpSound = new SoundRef("Sounds\\powerUp.mp3", false, true);

    constructor(id: ZONE_TYPE) {
        super(id);

        if (!this.lightSources) this.lightSources = [];

        // Get get light sources and power gens based on ID
        const matchingIndexes = [];
        udg_power_generator_zones.forEach((zone, index) => id === zone && matchingIndexes.push(index));
        matchingIndexes.forEach(index => {
            this.powerGenerators.push(Unit.fromHandle(udg_power_generators[index+1]));
        });

        // Hook into station destruction events
        EventEntity.getInstance().addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_DISABLED, 
            (self, data: EventData) => this.onGeneratorDestroy(data.data.unit, data.source))
        );
        // Register to and listen for security repair
        EventEntity.getInstance().addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_ENABLED,
            (self, data: EventData) => this.onGeneratorRepair(data.data.unit, data.source))
        );
        // Register to and listen for security repair
        EventEntity.getInstance().addListener(
            new EventListener(EVENT_TYPE.STATION_POWER_OUT,
            (self, data: EventData) => this.onPowerOut(data.data.zone, data.data.duration))
        );
    }
    public addExit(whichExit: Unit) {
        this.exits.push(whichExit);
    }

    public setExits(to: Unit[]) {
        this.exits = to;
    }

    protected addRegion(r: rect) {
        super.addRegion(r);

        if (!this.lightSources) this.lightSources = [];

        EnumDestructablesInRectAll(r, () => {
            const d = GetFilterDestructable();
            const id = GetDestructableTypeId(d);
            // Log.Information("Adding region id found: "+id);
            // if (id === DESTR_ID_POWERED_LIGHT_BLUE) this.lightSources.push(d);
            // else if (id === DESTR_ID_POWERED_LIGHT_RED) this.lightSources.push(d);
            // else 
            if (id === DESTR_ID_POWERED_LIGHT_WHITE) this.lightSources.push(d);
            // else if (id === DESTR_ID_POWERED_LIGHT_GREEN) this.lightSources.push(d);
        });
    }

    private onGeneratorDestroy(generator: Unit, source: Unit) {
        // Make sure we have generator in our array
        if (this.powerGenerators.indexOf(generator) >= 0) {
            // Log.Information("Generator for "+ZONE_TYPE[this.id]+" was destroyed!");
            try {
                this.updatePower(false);
            }
            catch (e) {
                Log.Error(e);
            }
        }
    }

    private onGeneratorRepair(generator: Unit, source: Unit) {
        // Make sure we have generator in our array
        if (this.powerGenerators.indexOf(generator) >= 0) {
            // Log.Information("Generator for "+ZONE_TYPE[this.id]+" was repaired!!");
            if (this.powerShortRemaining <= 0 && this.hasActiveGenerators()) this.updatePower(true);
        }
    }

    /**
     * Returns true if one generator is alive
     */
    private hasActiveGenerators() {
        // Do we have any living generators still?
        for (let index = 0; index < this.powerGenerators.length; index++) {
            const generator = this.powerGenerators[index];
            if (generator.isAlive()) {
                return true;
            }
        }
        return false;
    }

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {

            // Remove the existing modifier (if any)
            if (this.playerLightingModifiers.has(unit.owner)) {
                const mod = this.playerLightingModifiers.get(unit.owner);
                this.playerLightingModifiers.delete(unit.owner);
                VisionFactory.getInstance().removeVisionModifier(mod);
            }

            // If no oxy remove oxy loss
            // TODO
            // If no power remove power loss
            // Remove shared vision of exits
            this.exits.forEach(exit => {
                // Log.Information("Removing exit vision "+exit.name);
                exit.shareVision(unit.owner, false);
            });
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {
            // Log.Information("Sharing exit vision");
            this.exits.forEach(exit => {
                // Log.Information(exit.name);
                exit.shareVision(unit.owner, true);
            });

            // If no oxy apply oxy loss
            // TODO
            // If no power apply power loss
            this.applyPowerChange(unit.owner, this.hasPower, false)
        }
    }

    private onPowerOut(targetZone: ZONE_TYPE, duration: number) {
        if (targetZone !== this.id) return;
        this.powerShortRemaining = Math.max(this.powerShortRemaining, duration);
        if (this.powerShortRemaining > 0) this.updatePower(false);
    }

    public step(delta: number) {
        if (this.powerShortRemaining > 0 && !this.alwaysCauseFear) {
            this.powerShortRemaining -= delta;
            // If we are less than zero, we may need to update power
            if (this.powerShortRemaining <= 0) {
                if (this.powerGenerators.length > 0) {
                    // If the generator is alive, we need to update power!
                    if (this.hasActiveGenerators()) {
                        this.updatePower(true);
                    }
                }
                else {
                    this.updatePower(true);
                }
            }
        }
        
    }

    /**
     * Sets the power state of the floor
     * @param newState 
     */
    public updatePower(newState: boolean) {
        if (this.hasPower === newState) return;
        try {
            if (!newState) {
                // Apply power change to all players
                this.getPlayersInZone().map(p => this.applyPowerChange(p, newState, true));
                this.lightSources.forEach((lightSource, i) => {
                    const _i = i;
                    const r = GetRandomInt(2, 4);
                    const timer = 0.5 + r*r * 0.2;

                    Timers.addTimedAction(timer, () => {
                        const oldSource = this.lightSources[_i];
                        const oldX = GetDestructableX(oldSource);
                        const oldY = GetDestructableY(oldSource);
                        const terrainZ =  getZFromXY(oldX, oldY);

                        const result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "" )
                        SetSoundDuration(result, GetSoundFileDuration(LIGHT_CLACK));
                        SetSoundChannel(result, 1);
                        SetSoundVolume(result, 30);
                        SetSoundPitch(result, 1.0);
                        SetSoundDistances(result, 2000.0, 10000.0);
                        SetSoundDistanceCutoff(result, 4500.0);
    
                        const location = Location(oldX, oldY);
                        PlaySoundAtPointBJ(result, 127, location, terrainZ);
                        RemoveLocation(location);
                        KillSoundWhenDone(result);

                        RemoveDestructable(oldSource);
                        this.lightSources[_i] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 9999, 0, 1, 0);
                        return true;
                    });
                });
                EventEntity.send(EVENT_TYPE.FLOOR_LOSES_POWER, { source: null, data: { floor: this.id }});
            }
            // Otherwise we need to reset the lights
            else {
                Timers.addSlowTimedAction(4, () => {
                    // Apply power change to all players
                    this.getPlayersInZone().map(p => this.applyPowerChange(p, newState, true));
                });
                this.lightSources.forEach((lightSource, i) => {
                    const _i = i;
                    const r = GetRandomInt(2, 4);
                    const timer = 0.5 + r*r * 0.2;

                    Timers.addTimedAction(timer, () => {
                        const oldSource = this.lightSources[_i];
                        const oldX = GetDestructableX(oldSource);
                        const oldY = GetDestructableY(oldSource);
                        const terrainZ = getZFromXY(oldX, oldY);

                        const result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "" )
                        SetSoundDuration(result, GetSoundFileDuration(LIGHT_CLACK));
                        SetSoundChannel(result, 2);
                        SetSoundVolume(result, 30);
                        SetSoundPitch(result, 1.0);
                        SetSoundDistances(result, 2000.0, 10000.0);
                        SetSoundDistanceCutoff(result, 4500.0);
    
                        const location = Location(oldX, oldY);
                        PlaySoundAtPointBJ(result, 127, location, terrainZ);
                        KillSoundWhenDone(result);

                        RemoveLocation(location);

                        RemoveDestructable(oldSource);
                        this.lightSources[_i] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 100, 0, 1, 0);
                        return true;
                    });
                });
                EventEntity.send(EVENT_TYPE.FLOOR_GAINS_POWER, { source: null, data: { floor: this.id }});
            }
            this.hasPower = newState;
        }
        catch(e) {
            Log.Error(e);
        }
    }

    /**
     * Visible power changes for local player
     * Will also update player vision status
     * @param player 
     * @param hasPower 
     * @param justChanged 
     */
    applyPowerChange(player: MapPlayer, hasPower: boolean, justChanged: boolean) {
        const playerDetails = PlayerStateFactory.get(player);
        if (playerDetails) {
            const crewmember = playerDetails.getCrewmember();
            
            // IF we dont have power add despair to the unit
            if (!hasPower && crewmember && GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE) === 0) {
                crewmember.addDespair(new BuffInstanceCallback(crewmember.unit, () => {
                    const hasNighteye = GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE) > 0;

                    return !hasNighteye && this.unitsInside.indexOf(crewmember.unit) >= 0 && this.doCauseFear();
                }));
            }
        }

        // Remove the existing modifier (if any)
        if (this.playerLightingModifiers.has(player)) {
            const mod = this.playerLightingModifiers.get(player);
            this.playerLightingModifiers.delete(player);
            VisionFactory.getInstance().removeVisionModifier(mod);
        }

        if (!hasPower) {
            this.playerLightingModifiers.set(player, 
                VisionFactory.getInstance().addVisionModifier(VISION_PENALTY.TERRAIN_DARK_AREA, player)
            );
        }
        if (hasPower && justChanged && GetLocalPlayer() === player.handle) {
            this.powerUpSound.playSound();
        }
        else if (!hasPower && justChanged  && GetLocalPlayer() === player.handle) {
            this.powerDownSound.playSound();
        }
    }

    public doCauseFear() { return !this.hasPower || this.alwaysCauseFear; }
}