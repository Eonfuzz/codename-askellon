/** @noSelfInFile **/
import { Game } from "../game";
import { Zone } from "./zone-type";
import { TheAskellon } from "./the-askellon";
import { ZONE_TYPE, STRING_TO_ZONE_TYPE } from "./zone-id";
import { Trigger, Unit, MapPlayer } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { EVENT_TYPE } from "app/events/event";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { Crewmember } from "app/crewmember/crewmember-type";

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
        deathTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        deathTrigger.addAction(() => this.unitDeath());
    }

    /**
     * Actually does the travel work
     * @param unit 
     * @param to 
     */
    private handleTravel(unit: Unit, to: ZONE_TYPE) {
        const uHandle = unit.id;
        const oldZone = this.unitLocation.get(uHandle);
        const newZone = this.getZone(to);        

        // Now call on enter and on leave for the zones
        oldZone && oldZone.onLeave(this, unit);
        newZone && newZone.onEnter(this, unit);
        
        newZone && this.unitLocation.set(uHandle, newZone);

        // if (oldZone) {
        //     Log.Information(GetHeroProperName(unit)+"::"+ZONE_TYPE[oldZone.id]+"->"+ZONE_TYPE[to]);
        // }
    }

    travel(unit: Unit, to: ZONE_TYPE) {
        const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;

        // Does the travel work
        this.handleTravel(unit, to);

        // Now we need to see if we have to travel the ALIEN FORM and or the CREWMEBMER (incase alien or transformed)
        // If this is a player we care about
        const crew = this.game.crewModule.getCrewmemberForUnit(unit);
        const alien = alienForce.getAlienFormForPlayer(unit.owner);

        const isCrewmember = crew && crew.unit === unit;

        // If it was the alien form, we need to travel the crewmember around
        if (alien == unit) {
            const alienCrew = this.game.crewModule.getCrewmemberForPlayer(unit.owner) as Crewmember;
            this.handleTravel(alienCrew.unit, to);
        }
        // Otherwise, check if the traversing unit is crewmember AND has an alien form
        else if (isCrewmember && alien && crew) {
            // If so travel that alien form
            this.handleTravel(alien, to);
        }

        if (isCrewmember  && crew) {
            const newLoc = this.getZone(to);
            newLoc && newLoc.displayEnteringMessage(crew.player);
        }

        // If the traversing unit was alien or crewmember, call the floor change event
        if ((crew && crew.unit === unit) || alien == unit) 
            this.game.event.sendEvent(EVENT_TYPE.CREW_CHANGES_FLOOR, { source: unit, crewmember: crew as Crewmember });
        
    }

    unitDeath() {
        const unit = Unit.fromHandle(GetTriggerUnit());
        const handle = unit.id;

        if (this.unitLocation.has(handle)) {
            const zone = this.unitLocation.get(handle);
            zone && zone.onLeave(this, unit);
            this.unitLocation.delete(handle);
        }
    }

    getZone(whichZone: ZONE_TYPE) {
        return this.askellon.findZone(whichZone) || this.worldZones.get(whichZone);
    }

    getZoneByName(whichZone: string) {
        const result = STRING_TO_ZONE_TYPE.get(whichZone);
        if (!result) Log.Error("FAILED TO GET ZONE FOR "+whichZone);
        return result as ZONE_TYPE;
    }

    getPlayersInZone(whichZone: ZONE_TYPE): Array<MapPlayer> {
        return [];
    }

    getUnitZone(whichUnit: Unit): Zone | undefined {
        return this.unitLocation.get(whichUnit.id);
    }
}