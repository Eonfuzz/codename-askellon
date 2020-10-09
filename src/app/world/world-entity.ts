import { Zone } from "./zone-types/zone-type";
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
import { Hooks } from "lib/Hooks";
import { Entity } from "app/entity-type";

export class WorldEntity extends Entity {
    private static instance: WorldEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new WorldEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }
    
    
    // The ship itself
    public askellon: TheAskellon;

    // Zones outside of the ship
    private worldZones: Map<ZONE_TYPE, Zone> = new Map();
    private allZones: Zone[] = [];
    // Map of unit to zone
    private unitLocation: Map<Unit, Zone> = new Map();

    _timerDelay = 0.25;

    constructor() {
        super();

        this.askellon = new TheAskellon();
        this.worldZones.set(ZONE_TYPE.SPACE, new SpaceZone(ZONE_TYPE.SPACE));
        this.allZones.push(this.worldZones.get(ZONE_TYPE.SPACE));

        // Listen to unit travel events
        EventEntity.listen(new EventListener(EVENT_TYPE.TRAVEL_UNIT_TO, (listener, data) => {
            const u = data.source;
            let desiredLoc = data.data.zone as ZONE_TYPE || this.getZoneByName(data.data.zoneName);
            const isSubtravel = !!data.data.subTravel;

            const oldZone = this.getUnitZone(u);
            if (oldZone && oldZone.id !== desiredLoc)
                this.travel(u, desiredLoc, isSubtravel);
        }));

        EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, (self, data) => {
            // Log.Information("World entity caught unit remove")
            this.removeUnit(data.source);
        }));
    }

    step() {
        this.worldZones.get(ZONE_TYPE.SPACE).step(this._timerDelay);  
        this.askellon.step(this._timerDelay);
    }

    /**
     * Actually does the travel work
     * @param unit 
     * @param to 
     */
    public handleTravel(unit: Unit, to: ZONE_TYPE) {
        try {
            const oldZone = this.unitLocation.get(unit);
            const newZone = this.getZone(to);     

            // Now call on enter and on leave for the zones
            oldZone && oldZone.onLeave(unit);
            newZone && newZone.onEnter(unit);
            
            if (newZone) {
                // Log.Information("Setting "+unit.name+" to zone "+ZONE_TYPE[newZone.id]);
                this.unitLocation.set(unit, newZone);
            }

            return newZone;
        }
        catch(e) {
            Log.Error("Handle Travel Failed");
            Log.Error(e);
        }
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
        const oldZone = this.getUnitZone(unit);
        const nZone = this.handleTravel(unit, to);
        const pData = PlayerStateFactory.get(unit.owner);

        // If we dont have player data that means its an AI player
        if (!pData || !pData.getCrewmember()) return;

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

                const oldZoneInAskellon = oldZone && this.askellon.findZone(oldZone.id)
                const newZoneInAskellon = !!this.askellon.findZone(nZone.id);

                // Log.Information(`Old ${oldZoneInAskellon} New ${newZoneInAskellon}`);
                if (!oldZoneInAskellon && newZoneInAskellon) {
                    this.askellon.onEnterAskellon(crew.unit, nZone);
                }

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
        return this.unitLocation.get(whichUnit);
    }

    /**
     * Removes the unit from our data list
     * REQUIRED to maintain correct state
     * @param whichUnit 
     */
    removeUnit(whichUnit: Unit) {
        const zone = this.getUnitZone(whichUnit);

        try {
            if (zone) {
                // Log.Information("Removing unit "+whichUnit.name+" from "+zone.id);
                // Force on leave
                zone.onLeave(whichUnit);
                // Remove data on it
                this.unitLocation.delete(whichUnit);
            }
            else {
                // Log.Information("Remove zone failed for "+whichUnit.name);
            }
        }
        catch(e) {
            Log.Error("Remove unit failed");
            Log.Error(e);
        }
    }

    /**
     * Converts a point to zone
     * VERY experimental, probably lags or something
     * @param x 
     * @param y 
     */
    getPointZone(x: number, y: number): Zone | undefined {
        try {
            for (let index = 0; index < this.allZones.length; index++) {
                const zone = this.allZones[index];
                if (zone.pointIsInZone(x, y)) return zone;
            }
            for (let index = 0; index < this.askellon.allFloors.length; index++) {
                const zone = this.askellon.allFloors[index];
                if (zone.pointIsInZone(x, y)) return zone;            
            }
        }
        catch(e) {
            // Log.Error("ERROR POINT => ZONE");
            // Log.Error(e);
        }
        return undefined;
    }
}