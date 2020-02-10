import { ZONE_TYPE } from "./zone-id";
import { SoundRef } from "../types/sound-ref";
import { WorldModule } from "./world-module";
import { TimedEvent } from "../types/timed-event";

/** @noSelfInFile **/


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
}

export class ShipZone extends Zone {
    private hasPower: boolean = true;
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

            if (newState) {
                let poweredSFX = this.lightSources.slice();

                // Apply light sources shutting down sfx
                // Hide half of all lights first 500ms
                worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                    poweredSFX = poweredSFX.filter((l, i) => {
                        if (i <= (poweredSFX.length / 2)) {
                            ShowDestructable(l, false);
                            return false;
                        }
                    })
                    return true;
                }, 500));

                // Another half
                worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                    poweredSFX = poweredSFX.filter((l, i) => {
                        if (i <= (poweredSFX.length / 2)) {
                            ShowDestructable(l, false);
                            return false;
                        }
                    })
                    return true;
                }, 1000));

                // And all of them
                worldModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                    poweredSFX.forEach((l, i) => ShowDestructable(l, false))
                    return true;
                }, 1500));
            }
        }
        this.hasPower = newState;
    }
}