import { Zone } from "./zone-type";
import { TheAskellon } from "./the-askellon";
import { ZONE_TYPE, STRING_TO_ZONE_TYPE } from "./zone-id";
import { Trigger, Unit, MapPlayer } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { AlienForce } from "app/force/forces/alien-force";
import { SpaceZone } from "./zones/space";
import { EVENT_TYPE } from "app/events/event-enum";

import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";

export class WorldEntity {
    private static instance: WorldEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new WorldEntity();
        }
        return this.instance;
    }
    
    
    // The ship itself
    public askellon: TheAskellon;

    // Zones outside of the ship
    private worldZones: Map<ZONE_TYPE, Zone> = new Map();
    // Map of unit to zone
    private unitLocation: Map<number, Zone> = new Map();

    constructor() {
        this.askellon = new TheAskellon();
        this.worldZones.set(ZONE_TYPE.SPACE, new SpaceZone(ZONE_TYPE.SPACE));

        const deathTrigger = new Trigger();
        deathTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        deathTrigger.addAction(() => this.unitDeath());

        // Listen to unit travel events
        EventEntity.listen(new EventListener(EVENT_TYPE.TRAVEL_UNIT_TO, (listener, data) => {
            const u = data.source;
            let desiredLoc = data.data.zone || this.getZoneByName(data.data.zoneName);
            const isSubtravel = !!data.data.subTravel;
            this.travel(u, desiredLoc, isSubtravel);
        }));
    }

    /**
     * Actually does the travel work
     * @param unit 
     * @param to 
     */
    public handleTravel(unit: Unit, to: ZONE_TYPE) {
        const uHandle = unit.id;
        const oldZone = this.unitLocation.get(uHandle);
        const newZone = this.getZone(to);        

        // Now call on enter and on leave for the zones
        oldZone && oldZone.onLeave(unit);
        newZone && newZone.onEnter(unit);
        
        newZone && this.unitLocation.set(uHandle, newZone);
    }

    /**
     * 
     * @param unit 
     * @param to 
     * @param isSubTravel used internally, if true we wont call entering floors
     */
    travel(unit: Unit, to: ZONE_TYPE, isSubTravel?: boolean) {

        // Log.Information("Unit Travel "+unit.name);

        // Does the travel work
        this.handleTravel(unit, to);
        const pData = PlayerStateFactory.get(unit.owner);

        // If we dont have player data that means its an AI player
        if (!pData) return;

        try {
            // Now we need to see if we have to travel the ALIEN FORM and or the CREWMEBMER (incase alien or transformed)
            // If this is a player we care about
            const crew = pData.getCrewmember(); 
            const force = pData.getForce() as AlienForce;
            const isAlien = force.is(ALIEN_FORCE_NAME);
            const alienUnit = isAlien ? force.getAlienFormForPlayer(unit.owner) : undefined;

            const isCrewmember = crew && crew.unit === unit;

            // If it was the alien form, we need to travel the crewmember around
            if (isAlien && alienUnit == unit) {
                this.handleTravel(crew.unit, to);
            }
            // Otherwise, check if the traversing unit is crewmember AND has an alien form
            else if (isCrewmember && isAlien && crew) {
                // If so travel that alien form
                this.handleTravel(alienUnit, to);
            }

            // If the traversing unit was alien or crewmember, call the floor change event
            const isCrewOrAlien = (crew && crew.unit === unit) || alienUnit == unit;
            if (!isSubTravel && isCrewOrAlien)  {
                const newLoc = this.getZone(to);
                newLoc && newLoc.displayEnteringMessage(unit.owner);

                EventEntity.getInstance().sendEvent(
                    EVENT_TYPE.CREW_CHANGES_FLOOR, 
                    { source: unit, crewmember: pData.getCrewmember()}
                );
            }
        }
        catch (e) {
            Log.Error("TRAVEL FAILED");
            Log.Error(e);
        }
    }

    unitDeath() {
        const unit = Unit.fromHandle(GetTriggerUnit());
        const handle = unit.id;

        if (this.unitLocation.has(handle)) {
            const zone = this.unitLocation.get(handle);
            zone && zone.onLeave(unit);
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
        if (!whichUnit) Log.Error("getUnitZone called but unit is undefined");
        return this.unitLocation.get(whichUnit.id);
    }

    /**
     * Removes the unit from our data list
     * REQUIRED to maintain correct state
     * @param whichUnit 
     */
    removeUnit(whichUnit: Unit) {
        const zone = this.getUnitZone(whichUnit);

        if (zone) {
            // Log.Information("Removing unit "+whichUnit.name+" from "+zone.id);
            // Force on leave
            zone.onLeave(whichUnit);
            // Remove data on it
            this.unitLocation.delete(whichUnit.id);
        }
        else {
            Log.Information("Remove zone failed for "+whichUnit.name);
        }
    }
}