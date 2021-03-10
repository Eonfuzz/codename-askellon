import { Zone } from "./zone-types/zone-type";
import { TheAskellon } from "./the-askellon";
import { ZONE_TYPE, STRING_TO_ZONE_TYPE } from "./zone-id";
import { Trigger, Unit, MapPlayer, Timer } from "w3ts";
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
import { PlanetZone } from "./zones/planet";
import { AskellonEntity } from "app/station/askellon-entity";
import { MessageAllPlayers } from "lib/utils";
import { COL_ATTATCH, COL_BAD } from "resources/colours";
import { Timers } from "app/timer-type";
import { PlayNewSound } from "lib/translators";
import { VisionFactory } from "app/vision/vision-factory";
import { Players } from "w3ts/globals/index";
import { SoundRef } from "app/types/sound-ref";

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
    private unitLocation: Map<number, Zone> = new Map();

    _timerDelay = 0.25;

    constructor() {
        super();

        this.askellon = new TheAskellon();
        this.worldZones.set(ZONE_TYPE.SPACE, new SpaceZone(ZONE_TYPE.SPACE));
        this.worldZones.set(ZONE_TYPE.PLANET, new PlanetZone(ZONE_TYPE.PLANET));

        this.allZones.push(this.worldZones.get(ZONE_TYPE.SPACE));
        this.allZones.push(this.worldZones.get(ZONE_TYPE.PLANET));

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

        EventEntity.listen(EVENT_TYPE.WORLD_EVENT_SOLAR, () => {
            Timers.addSlowTimedAction(GetRandomInt(260, 700), () => this.beginASolarFlare());
        });
        Timers.addSlowTimedAction(GetRandomInt(300, 800), () => this.beginASolarFlare());
    }

    step() {
        this.allZones.forEach(z => {
            z.step(this._timerDelay);
        });
        this.askellon.step(this._timerDelay);
    }

    /**
     * Actually does the travel work
     * @param unit 
     * @param to 
     */
    public handleTravel(unit: Unit, to: ZONE_TYPE) {
        try {
            const oldZone = this.unitLocation.get(unit.id);
            const newZone = this.getZone(to);     

            // Now call on enter and on leave for the zones
            oldZone && oldZone.onLeave(unit);
            newZone && newZone.onEnter(unit);
            
            if (newZone) {
                // Log.Information("Setting "+unit.name+" to zone "+ZONE_TYPE[newZone.id]);
                this.unitLocation.set(unit.id, newZone);
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

                // Log.Information("Not subtravel");

                const oldZoneInAskellon = oldZone && this.askellon.findZone(oldZone.id)
                const newZoneInAskellon = !!this.askellon.findZone(nZone.id);

                // Log.Information(`Old ${oldZoneInAskellon} New ${newZoneInAskellon}`);
                if (!oldZoneInAskellon && newZoneInAskellon) {
                    this.askellon.onEnter(crew.unit, nZone);
                }
                else if (!newZoneInAskellon && oldZoneInAskellon) {
                    this.askellon.onLeave(crew.unit, nZone);
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
        return this.unitLocation.get(whichUnit.id);
    }

    /**
     * Removes the unit from our data list
     * REQUIRED to maintain correct state
     * @param whichUnit 
     */
    removeUnit(whichUnit: Unit) {
        const zone = this.getUnitZone(whichUnit);

        Log.Verbose("Remove unit called");

        try {
            if (zone) {
                Log.Verbose("Removing unit "+whichUnit.name+" from "+zone.id);
                // Force on leave
                zone.onLeave(whichUnit);
                // Remove data on it
                this.unitLocation.delete(whichUnit.id);
            }
            else {
                Log.Verbose("Remove zone failed for "+whichUnit.name);
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

    /**
     * Does what you think it do
     */
    public getAllZones() {
        const result = [];
        this.allZones.forEach(z => result.push(z));
        this.askellon.allFloors.forEach(z => result.push(z));
        return result;
    }


    private warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
    /**
     * Begins a solar flare event
     */
    public beginASolarFlare() {

        this.warpStormSound.setVolume(10);
        this.warpStormSound.playSound();

        Timers.addTimedAction(5, () => this.warpStormSound.setVolume(20));
        Timers.addTimedAction(10, () => this.warpStormSound.setVolume(30));
        Timers.addTimedAction(15, () => this.warpStormSound.setVolume(40));
        Timers.addTimedAction(20, () => this.warpStormSound.setVolume(60));
        Timers.addTimedAction(22, () => this.warpStormSound.setVolume(70));
        Timers.addTimedAction(24, () => this.warpStormSound.setVolume(80));
        Timers.addTimedAction(26, () => this.warpStormSound.setVolume(90));
        Timers.addTimedAction(27, () => this.warpStormSound.setVolume(100));
        Timers.addTimedAction(28, () => this.warpStormSound.setVolume(127));


        Timers.addTimedAction(30, () => {
            const t = new Timer();

            const dialog = CreateTimerDialog(t.handle);
            t.start(30, false, () => {
                t.destroy();
                TimerDialogDisplay(dialog, false);
                DestroyTimerDialog(dialog)

                this.warpStormSound.stopSound();
                PlayNewSound("Sounds\\SunFlare.wav", 127);
                
                Timers.addTimedAction(1, () => {
                    PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
                    CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0);           
                
                    EnableUserUI(true);
                })
        
                Timers.addTimedAction(2, () => {
                    SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
                    CameraSetSourceNoise(5, 50);
                });
                Timers.addTimedAction(3, () => {
                    CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
                    
                    EnableUserUI(true);
                    CameraSetSourceNoise(15, 50);
                });
                Timers.addTimedAction(5, () => {
                    Players.forEach(p => {
                        const c = PlayerStateFactory.getCrewmember(p);
                        if (c) {
                            VisionFactory.getInstance().calculateVision(p);
                        }
                    })
                    PlayNewSound("Sounds\\ExplosionDistant.mp3", 127);
                    EventEntity.send(EVENT_TYPE.WORLD_EVENT_SOLAR, { source: undefined });
                    AskellonEntity.causePowerSurge(GetRandomReal(0, 100) > 70 ? 3 : 2);
                    CameraSetSourceNoise(20, 50);
                });
                Timers.addTimedAction(11, () => {
                    CameraSetSourceNoise(10, 50);
                    EnableUserUI(true);
                });
                Timers.addTimedAction(12, () => {
                    CameraSetSourceNoise(5, 50);
                    EnableUserUI(true);
                });
                Timers.addTimedAction(15, () => {
                    CameraSetSourceNoise(0, 0);
                    EnableUserUI(true);
                });
            })
            TimerDialogSetTitle(dialog, "Solar Event");
            TimerDialogDisplay(dialog, true);

            AskellonEntity.getInstance().reactorWarningSound.playSound();
            MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] SOLAR EVENT DETECTED, RETURN TO THE ASKELLON.`);
        });
    }

    public log() {
        Log.Information(`TOTAL ${this.unitLocation.size}`);
        this.askellon.log();
    }
}