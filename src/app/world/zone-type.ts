import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "./zone-id";
import { SoundRef } from "../types/sound-ref";
import { WorldModule } from "./world-module";
import { TimedEvent } from "../types/timed-event";
import { Log } from "../../lib/serilog/serilog";
import { LIGHT_DEST_ID } from "../types/widget-id";
import { Unit } from "w3ts/handles/unit";
import { MapPlayer } from "w3ts";
import { Game } from "app/game";
import { EventListener, EVENT_TYPE, EventData } from "app/events/event";
import { getZFromXY } from "lib/utils";

const LIGHT_CLACK = "Sounds\\LightClack.mp3";
declare const udg_power_generators: Array<unit>;
declare const udg_power_generator_zones: Array<string>;

export class Zone {
    public id: ZONE_TYPE;
    protected game: Game;

    // Adjacent zones UNUSED
    protected adjacent: Array<Zone> = [];
    protected unitsInside: Array<Unit> = [];

    constructor(game: Game, id: ZONE_TYPE) {
        this.id = id;
        this.game = game;
    }

    /**
     * Unit enters the zone
     * @param unit 
     */
    public onLeave(world: WorldModule, unit: Unit) {
        const idx = this.unitsInside.indexOf(unit);
        if (idx >= 0) this.unitsInside.splice(idx, 1);
    }

    /**
     * Unit leaves the zone
     * @param unit 
     */
    public onEnter(world: WorldModule, unit: Unit) {
        this.unitsInside.push(unit);
    }

    public displayEnteringMessage(player: MapPlayer) {
        DisplayTextToPlayer(player.handle, 0, 0, `Entering ${ZONE_TYPE_TO_ZONE_NAME.get(this.id)}`);
    }

    /**
     * Returns all players present in a zone
     */
    public getPlayersInZone() {
        let players = this.unitsInside.map(u => u.owner);
        return players.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });
    }

    public doCauseFear() { return false; }
}

export class ShipZone extends Zone {
    private hasPower: boolean = true;
    public alwaysCauseFear: boolean = false;
    private hasOxygen: boolean = true;

    public lightSources: Array<destructable> = [];
    public powerGenerators: Array<Unit> = [];

    constructor(game: Game, id: ZONE_TYPE) {
        super(game, id);

        // Get get light sources and power gens based on ID
        const matchingIndexes = [];
        udg_power_generator_zones.forEach((zone, index) => id === zone && matchingIndexes.push(index));
        matchingIndexes.forEach(index => {
            this.powerGenerators.push(Unit.fromHandle(udg_power_generators[index+1]));
        });

        // Hook into station destruction events
        game.event.addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_DISABLED, 
            (self, data: EventData) => this.onGeneratorDestroy(data.data.unit, data.source))
        );
        // Register to and listen for security repair
        game.event.addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_ENABLED,
            (self, data: EventData) => this.onGeneratorRepair(data.data.unit, data.source))
        );
    }

    private onGeneratorDestroy(generator: Unit, source: Unit) {
        // Make sure we have generator in our array
        if (this.powerGenerators.indexOf(generator) >= 0) {
            Log.Information("Generator for "+this.id+" was destroyed!");
            this.updatePower(false);
        }
    }

    private onGeneratorRepair(generator: Unit, source: Unit) {
        // Make sure we have generator in our array
        if (this.powerGenerators.indexOf(generator) >= 0) {
            Log.Information("Generator for "+this.id+" was repaired!!");
            this.updatePower(true);
        }
    }

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        // If no oxy apply oxy loss
        // TODO
        // If no power apply power loss
        world.askellon.applyPowerChange(unit.owner, this.hasPower, false);
    }

    public updatePower(newState: boolean) {
        if (this.hasPower != newState) {
            // Apply power change to all players
            this.getPlayersInZone().map(p => this.game.worldModule.askellon.applyPowerChange(p, newState, true));

            if (!newState) {
                this.lightSources.forEach((lightSource, i) => {
                    const _i = i;
                    const r = GetRandomInt(2, 4);
                    const timer = 500 + r*r * 200;

                    this.game.worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                        const oldSource = this.lightSources[_i];
                        const oldX = GetDestructableX(oldSource);
                        const oldY = GetDestructableY(oldSource);
                        const terrainZ =  this.game.worldModule.game.getZFromXY(oldX, oldY);

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
                    }, timer));
                });
            }
            // Otherwise we need to reset the lights
            else {
                this.lightSources.forEach((lightSource, i) => {
                    const _i = i;
                    const r = GetRandomInt(2, 4);
                    const timer = 500 + r*r * 200;

                    this.game.timedEventQueue.AddEvent(new TimedEvent(() => {
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
                    }, timer));
                });
            }
        }
        this.hasPower = newState;
    }

    public doCauseFear() { return !this.hasPower || this.alwaysCauseFear; }
}