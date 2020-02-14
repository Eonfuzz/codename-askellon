import { ZONE_TYPE } from "./zone-id";
import { SoundRef } from "../types/sound-ref";
import { WorldModule } from "./world-module";
import { TimedEvent } from "../types/timed-event";
import { Log } from "../../lib/serilog/serilog";
import { LIGHT_DEST_ID } from "../types/widget-id";

/** @noSelfInFile **/

const LIGHT_CLACK = "Sounds\\LightClack.mp3";

export class Zone {
    public id: ZONE_TYPE;

    // Adjacent zones UNUSED
    protected adjacent: Array<Zone> = [];
    protected unitsInside: Array<unit> = [];

    constructor(id: ZONE_TYPE) {
        this.id = id;
    }

    /**
     * Unit enters the zone
     * @param unit 
     */
    public onLeave(world: WorldModule, unit: unit) {
        const idx = this.unitsInside.indexOf(unit);
        if (idx >= 0) this.unitsInside.splice(idx, 1);
    }

    /**
     * Unit leaves the zone
     * @param unit 
     */
    public onEnter(world: WorldModule, unit: unit) {
        this.unitsInside.push(unit);
    }

    /**
     * Returns all players present in a zone
     */
    public getPlayersInZone() {
        let players = this.unitsInside.map(u => GetOwningPlayer(u));
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

    public onLeave(world: WorldModule, unit: unit) {
        super.onLeave(world, unit);

        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(world: WorldModule, unit: unit) {
        super.onEnter(world, unit);

        // If no oxy apply oxy loss
        // TODO
        // If no power apply power loss
        world.askellon.applyPowerChange(GetOwningPlayer(unit), this.hasPower, false);
    }

    public updatePower(worldModule: WorldModule, newState: boolean) {
        if (this.hasPower != newState) {
            // Apply power change to all players
            this.getPlayersInZone().map(p => worldModule.askellon.applyPowerChange(p, newState, true));

            if (!newState) {
                this.lightSources.forEach((lightSource, i) => {
                    const _i = i;
                    const r = GetRandomInt(2, 4);
                    const timer = 500 + r*r * 200;

                    worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                        const oldSource = this.lightSources[_i];
                        const oldX = GetDestructableX(oldSource);
                        const oldY = GetDestructableY(oldSource);
                        const terrainZ = worldModule.game.getZFromXY(oldX, oldY);

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

                    worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                        const oldSource = this.lightSources[_i];
                        const oldX = GetDestructableX(oldSource);
                        const oldY = GetDestructableY(oldSource);
                        const terrainZ = worldModule.game.getZFromXY(oldX, oldY);

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