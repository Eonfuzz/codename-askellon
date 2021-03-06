import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME, STRING_TO_ZONE_TYPE } from "./zone-id";
import { Zone } from "./zone-types/zone-type";
import { Log } from "../../lib/serilog/serilog";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit } from "w3ts";
import { ChurchZone } from "./zones/church";
import { BridgeZone } from "./zones/bridge";
import { ReactorZone } from "./zones/reactor";
import { ShipZone } from "./zone-types/ship-zone";
import { VentZone } from "./zone-types/vent-zone";
import { ZoneWithExits } from "./zone-types/zone-with-exits";
import { BridgeZoneVent } from "./zones/bridge-vent";

// Small damage
// Will not cause damage to interior
// Lights will flash
const SMALL_DAMAGE_THRESHOLD = 300;

// Moderate damage
// May cause damage to interior
const MODREATE_DAMAGE_THRESHOLD = 900;

// Okay wtf
// Will cause damage to interior and other ship systems
const EXTREME_DAMAGE_THRESHOLD = 1800;

declare const udg_elevator_entrances: unit[];
declare const udg_elevator_exits: unit[];
declare const udg_elevator_exit_zones: string[];

declare const udg_hatch_entrances: unit [];
declare const udg_hatch_exits: unit[];

export class TheAskellon {
    floors: Map<ZONE_TYPE, ZoneWithExits> = new Map();
    allFloors: Zone[] = [];

    private playersInAskellon: MapPlayer[] = [];

    private pilot: Crewmember | undefined;

    constructor() {

        try {

            this.addFloor(ZONE_TYPE.ARMORY, new ShipZone(ZONE_TYPE.ARMORY));
            this.addFloor(ZONE_TYPE.CARGO_A, new ShipZone(ZONE_TYPE.CARGO_A));
            this.addFloor(ZONE_TYPE.BIOLOGY, new ShipZone(ZONE_TYPE.BIOLOGY));
            this.addFloor(ZONE_TYPE.BRIDGE, new BridgeZone(ZONE_TYPE.BRIDGE));
            this.addFloor(ZONE_TYPE.CHURCH, new ChurchZone(ZONE_TYPE.CHURCH));
            this.addFloor(ZONE_TYPE.REACTOR, new ReactorZone(ZONE_TYPE.REACTOR));
            this.addFloor(ZONE_TYPE.CARGO_B, new ShipZone(ZONE_TYPE.CARGO_B));

            // Vents and others
            this.addFloor(ZONE_TYPE.ARMORY_VENT, new VentZone(ZONE_TYPE.ARMORY_VENT));
            this.addFloor(ZONE_TYPE.BRIDGE_VENT, new BridgeZoneVent(ZONE_TYPE.BRIDGE_VENT));
            this.addFloor(ZONE_TYPE.CARGO_A_VENT, new VentZone(ZONE_TYPE.CARGO_A_VENT));
            this.addFloor(ZONE_TYPE.CARGO_B_VENT, new VentZone(ZONE_TYPE.CARGO_B_VENT));
            this.addFloor(ZONE_TYPE.BIOLOGY_VENT, new VentZone(ZONE_TYPE.BIOLOGY_VENT));
            this.addFloor(ZONE_TYPE.SERVICE_TUNNELS_EAST, new VentZone(ZONE_TYPE.SERVICE_TUNNELS_EAST));
            this.addFloor(ZONE_TYPE.SERVICE_TUNNELS_WEST, new VentZone(ZONE_TYPE.SERVICE_TUNNELS_WEST));
            this.addFloor(ZONE_TYPE.CHURCH_VENT, new VentZone(ZONE_TYPE.CHURCH_VENT));

            // Now apply exits
            udg_elevator_entrances.forEach((u, index) => {
                const entranceZone = this.allFloors.find(z => z.pointIsInZone(GetUnitX(u), GetUnitY(u)));

                if (entranceZone instanceof ZoneWithExits) {
                    const exitUnit = udg_elevator_exits[index];
                    const exitZone = this.allFloors.find(z => z.pointIsInZone(GetUnitX(exitUnit), GetUnitY(exitUnit)));

                    entranceZone.addPathway({ 
                        entrance: Unit.fromHandle(u), 
                        exit: Unit.fromHandle(udg_elevator_exits[index]),
                        leadsTo: exitZone
                    });
                }
                else {
                    Log.Information((entranceZone ? entranceZone.id : GetUnitName(u)) + " has no exits ");
                }
            });

            udg_hatch_entrances.forEach((u, index) => {
                const entranceZone = this.allFloors.find(z => z.pointIsInZone(GetUnitX(u), GetUnitY(u)));

                if (entranceZone instanceof ZoneWithExits) {
                    const exitUnit = udg_hatch_exits[index];
                    const exitZone = this.allFloors.find(z => z.pointIsInZone(GetUnitX(exitUnit), GetUnitY(exitUnit)));

                    entranceZone.addPathway({ 
                        entrance: Unit.fromHandle(u), 
                        exit: Unit.fromHandle(udg_hatch_exits[index]),
                        leadsTo: exitZone
                    });
                }
                else {
                    UnitShareVision(u, MapPlayer.fromIndex(0).handle, true);
                    Log.Information((entranceZone ? entranceZone.id : `Entrance zone NOT FOUND`+GetUnitName(u)) + " has no exits ");
                }
            });

        } catch(e) {
            Log.Error("Failed to init askellon");
            Log.Error(e);
        }
    }
    
    private addFloor(id: ZONE_TYPE, zone: ZoneWithExits) {
        this.floors.set(id, zone);
        this.allFloors.push(zone);
    }

    findZone(zone: ZONE_TYPE): ZoneWithExits | undefined {
        return this.floors.get(zone);
    }

    public step(delta: number) {
        for (let index = 0; index < this.allFloors.length; index++) {
            const floor = this.allFloors[index];
            floor.step(delta);
        }
    }

    /**
     * Damages the ship
     * If no zone is passed it will instead damage a random zone
     * @param damage 
     * @param zone 
     */
    damageShip(damage: number, zone?: ZONE_TYPE) {
        const damagedZone = zone ? this.findZone(zone) : this.getRandomZone()[1];
        // // Damage the ship
        // if (askellonUnit) {
        //     askellonUnit.damageTarget(askellonUnit.handle, damage, 0, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);
        // }

        // if (damage > SMALL_DAMAGE_THRESHOLD) {
        //     // Play ship groan sfx
        //     // Shake screen for all inside ship
        // }
        // else if (damage > MODREATE_DAMAGE_THRESHOLD) {
        //     // Play ship bang sfx
        //     // Moderate Shake screen for all inside ship
        //     // Cause temporary power out in effected zone
        // }
        // else if (damage > EXTREME_DAMAGE_THRESHOLD) {
        //     // Play ship bang sfx
        //     // Heavy screen shake
        //     // Damage all players and units in zone
        //     // Cause permanent power out in effected zone
        //     // Damage all modules in effected zone
        // }
    }

    private getRandomZone() {
        let items = Array.from(this.floors);
        return items[GetRandomInt(0, items.length - 1)];
    }


    public setPilot(crewmember?: Crewmember) {
        this.pilot = crewmember;
    }

    /**
     * Gets the current pilot of the askellon
     */
    public getPilot(): Crewmember | undefined {
        return this.pilot;
    }


    private onSecurityDamage(destroyedSecurity: unit, vandal: unit) {
        Log.Information("Ship found security damage!");
    }

    private onSecurityRepair(repairedSecurity: unit, engineer: unit) {
        Log.Information("Ship found security repair!");
    }

    public onEnter(who: Unit, whichFloor: Zone) {
        if (who && who.owner) {
            // Log.Information("Entering "+who.name);
            this.playersInAskellon.push(who.owner);
            SetCameraBoundsToRectForPlayerBJ(who.owner.handle, gg_rct_stationtempvision);
            if (who.owner.handle === GetLocalPlayer()) BlzChangeMinimapTerrainTex("war3mapPreviewAskellon.dds");
        }
    }

    public onLeave(who: Unit, whichFloor: Zone) {
        if (who && who.owner) {
            this.playersInAskellon.splice( this.playersInAskellon.indexOf(who.owner), 1 );
        }
    }

    public getPlayers() {
        return this.playersInAskellon.slice();
    }

    public log() {
        Log.Information(`Floors: ${this.allFloors.length}`)
        for (let index = 0; index < this.allFloors.length; index++) {
            try {
                const element = this.allFloors[index];
                element.debug();
            }
            catch (e) {
                Log.Error(`Failed to log Askellon at ${index} e: ${e}`);
            }
        }
    }
}