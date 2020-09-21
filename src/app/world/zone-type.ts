import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "./zone-id";
import { Log } from "../../lib/serilog/serilog";

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

const LIGHT_CLACK = "Sounds\\LightClack.mp3";
declare const udg_power_generators: Array<unit>;
declare const udg_power_generator_zones: Array<string>;

export class Zone {
    public id: ZONE_TYPE;

    // Adjacent zones UNUSED
    protected adjacent: Array<Zone> = [];
    protected unitsInside: Array<Unit> = [];

    protected zoneRegion: Region;
    protected allRects: rect[] = [];

    constructor(id: ZONE_TYPE) {
        this.id = id;
        
        this.zoneRegion = new Region();

        try {
            // We need to scan _g to find rects that match us
            let strId = ZONE_TYPE[this.id].toLowerCase();
            while (strId.indexOf('_') >= 0) {
                strId = strId.replace('_', '');
            }
            const namespaceVarName = `gg_rct_zone${strId}`;

            let idx = 1;
            let namespaceCheck = `${namespaceVarName}${idx++}`;
            while (_G[namespaceCheck]) {
                const rect = _G[namespaceCheck] as rect;
                this.addRegion(rect);
                namespaceCheck = `${namespaceVarName}${idx++}`;
            }
        }
        catch(e) {
            Log.Error("Reading regions fail");
            Log.Error(e);
        }
    }

    protected addRegion(r: rect) {
        this.zoneRegion.addRect(Rectangle.fromHandle(r));
        this.allRects.push(r);
    }

    public pointIsInZone(x: number, y: number): boolean {
        if (this.allRects.length === 0) return false;
        else return this.zoneRegion.containsCoords(x, y);
    }

    public getRandomPointInZone(): Vector2 {
        if (this.allRects.length === 0) return new Vector2(0,0);
        const idx = GetRandomInt(0, this.allRects.length - 1);
        const rect = this.allRects[idx];
        return new Vector2(GetRandomReal(GetRectMinX(rect), GetRectMaxX(rect)), GetRandomReal(GetRectMinY(rect), GetRectMaxY(rect)));
    }

    /**
     * Unit enters the zone
     * @param unit 
     */
    public onLeave(unit: Unit) {
        const idx = this.unitsInside.indexOf(unit);
        if (idx >= 0) this.unitsInside.splice(idx, 1);
        else Log.Warning("Failed to remove unit "+unit.name+" from "+this.id);
    }

    /**
     * Unit leaves the zone
     * @param unit 
     */
    public onEnter(unit: Unit) {
        this.unitsInside.push(unit);
    }

    public displayEnteringMessage(player: MapPlayer) {
        DisplayTextToPlayer(player.handle, 0, 0, `Entering ${ZONE_TYPE_TO_ZONE_NAME.get(this.id)}`);
    }


    /** Does nothing by default */
    public step(delta: number) {}

    /**
     * Returns all players present in a zone
     */
    public getPlayersInZone() {
        try { 
            let players = this.unitsInside.map(u => {
                // Log.Information("Getting "+u.name);
                return u.owner;
            });
            return players.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            });
        }
        catch (e) {
            Log.Error("Failed to get players in zone "+this.id);
            Log.Error(e);
            return [];
        }
    }

    public doCauseFear() { return false; }
}

export class ShipZone extends Zone {
    private hasPower: boolean = true;
    public alwaysCauseFear: boolean = false;
    private hasOxygen: boolean = true;

    public lightSources: Array<destructable>;
    public powerGenerators: Array<Unit> = [];

    // The exits to and from this zone
    private exits: Array<Unit> = [];
    private playerLightingModifiers = new Map<MapPlayer, number>();

    powerDownSound = new SoundRef("Sounds\\PowerDown.mp3", false, true);
    powerUpSound = new SoundRef("Sounds\\powerUp.mp3", false, true);

    constructor(id: ZONE_TYPE,  exits?: Unit[]) {
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
            if (id === DESTR_ID_POWERED_LIGHT_BLUE) this.lightSources.push(d);
            else if (id === DESTR_ID_POWERED_LIGHT_RED) this.lightSources.push(d);
            else if (id === DESTR_ID_POWERED_LIGHT_WHITE) this.lightSources.push(d);
            else if (id === DESTR_ID_POWERED_LIGHT_GREEN) this.lightSources.push(d);
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
            this.updatePower(true);
        }
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

    public updatePower(newState: boolean) {
        try {
            if (this.hasPower != newState) {

                if (this.hasPower) {
                    // Apply power change to all players
                    this.getPlayersInZone().map(p => this.applyPowerChange(p, newState, true));
                }
                else {
                    const t = new Timer();
                    t.start(4, false, () => {
                        // Apply power change to all players
                        this.getPlayersInZone().map(p => this.applyPowerChange(p, newState, true));
                        t.destroy();
                    });
                }

                if (!newState) {
                    Log.Information("Power out, my lights: "+this.lightSources.length);
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
                            SetSoundVolume(result, 127);
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
                }
                // Otherwise we need to reset the lights
                else {
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
                            SetSoundVolume(result, 127);
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
                }
            }
            this.hasPower = newState;
        }
        catch(e) {
            Log.Error(e);
        }
    }

    applyPowerChange(player: MapPlayer, hasPower: boolean, justChanged: boolean) {
        try {
            // let alienForce = this.world.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
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
        catch(e) {
            Log.Error("Failed to apply power change");
            Log.Error(e);
        }
    }

    public doCauseFear() { return !this.hasPower || this.alwaysCauseFear; }
}