/** @noSelfInFile **/
import { Game } from "../game";
import { Zone } from "./zone-type";
import { Ship } from "../space/ship";
import { TheAskellon } from "./the-askellon";
import { ZONE_TYPE } from "./zone-id";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";

export class WorldModule {
    game: Game;
    
    // The ship itself
    askellon: TheAskellon;

    // Zones outside of the ship
    worldZones: Map<ZONE_TYPE, Zone> = new Map();

    // Map of unit to zone
    unitLocation: Map<number, Zone> = new Map();

    constructor(game: Game) {
        this.game = game;
        this.askellon = new TheAskellon(this);

        const deathTrigger = new Trigger();
        deathTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DEATH);
        deathTrigger.AddAction(() => this.unitDeath());
    }

    travel(unit: unit, to: ZONE_TYPE) {
        const uHandle = GetHandleId(unit);
        const oldZone = this.unitLocation.get(uHandle);
        const newZone = this.getZone(to);        

        // Now call on enter and on leave for the zones
        oldZone?.onLeave(this, unit);
        newZone?.onEnter(this, unit);
        
        newZone && this.unitLocation.set(uHandle, newZone);

        if (oldZone) {
            Log.Information(GetHeroProperName(unit)+"::"+ZONE_TYPE[oldZone.id]+"->"+ZONE_TYPE[to]);
        }
    }

    unitDeath() {
        const unit = GetTriggerUnit();
        const handle = GetHandleId(unit);

        if (this.unitLocation.has(handle)) this.unitLocation.delete(handle);
    }

    getZone(whichZone: ZONE_TYPE) {
        return this.askellon.findZone(whichZone) || this.worldZones.get(whichZone);
    }

    getPlayersInZone(whichZone: ZONE_TYPE): Array<player> {
        return [];
    }
}