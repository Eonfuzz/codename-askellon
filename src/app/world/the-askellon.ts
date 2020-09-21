import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME, STRING_TO_ZONE_TYPE } from "./zone-id";
import { Zone, ShipZone } from "./zone-type";
import { SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ABIL_GENE_NIGHTEYE } from "resources/ability-ids";
import { MapPlayer, Unit } from "w3ts";
import { ChurchZone } from "./zones/church";
import { BridgeZone, BridgeZoneVent } from "./zones/bridge";
import { VISION_PENALTY } from "app/vision/vision-type";

import { VisionFactory } from "app/vision/vision-factory";
import { BuffInstanceCallback } from "app/buff/buff-instance-callback-type";
// import { WorldEntity } from "./world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ReactorZone } from "./zones/reactor";

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

export class TheAskellon {
    floors: Map<ZONE_TYPE, ShipZone> = new Map();
    allFloors: Zone[] = [];

    private pilot: Crewmember | undefined;

    constructor() {
        this.addFloor(ZONE_TYPE.ARMORY, new ShipZone(ZONE_TYPE.ARMORY));
        this.addFloor(ZONE_TYPE.ARMORY_VENT, new ShipZone(ZONE_TYPE.ARMORY_VENT));
        this.addFloor(ZONE_TYPE.CARGO_A, new ShipZone(ZONE_TYPE.CARGO_A));
        this.addFloor(ZONE_TYPE.CARGO_A_VENT, new ShipZone(ZONE_TYPE.CARGO_A_VENT));
        this.addFloor(ZONE_TYPE.SERVICE_TUNNELS, new ShipZone(ZONE_TYPE.SERVICE_TUNNELS));
        this.addFloor(ZONE_TYPE.BIOLOGY, new ShipZone(ZONE_TYPE.BIOLOGY ));
        this.addFloor(ZONE_TYPE.BRIDGE, new BridgeZone(ZONE_TYPE.BRIDGE));
        this.addFloor(ZONE_TYPE.BRIDGE_VENT, new BridgeZoneVent(ZONE_TYPE.BRIDGE_VENT));
        this.addFloor(ZONE_TYPE.CHURCH, new ChurchZone(ZONE_TYPE.CHURCH));
        this.addFloor(ZONE_TYPE.REACTOR, new ReactorZone(ZONE_TYPE.REACTOR));
        this.addFloor(ZONE_TYPE.CARGO_B, new ReactorZone(ZONE_TYPE.CARGO_B));

        // Now apply lights to the zones
        const SERVICE_TUNNELS = this.floors.get(ZONE_TYPE.SERVICE_TUNNELS);
        if (SERVICE_TUNNELS) {
            SERVICE_TUNNELS.updatePower(false);
            SERVICE_TUNNELS.alwaysCauseFear = true;
        }
        const CARGO_A_VENT = this.floors.get(ZONE_TYPE.CARGO_A_VENT);
        if (CARGO_A_VENT) {
            CARGO_A_VENT.updatePower(false);
            CARGO_A_VENT.alwaysCauseFear = true;
        }
        const BRIDGE_VENT = this.floors.get(ZONE_TYPE.BRIDGE_VENT);
        if (BRIDGE_VENT) {
            BRIDGE_VENT.updatePower(false);
            BRIDGE_VENT.alwaysCauseFear = true;
        }
        const ARMORY_VENT = this.floors.get(ZONE_TYPE.ARMORY_VENT);
        if (ARMORY_VENT) {
            ARMORY_VENT.updatePower(false);
            ARMORY_VENT.alwaysCauseFear = true;
        }


        // Now apply exits
        udg_elevator_entrances.forEach((u, index) => {
            const matchingExitZones = udg_elevator_exit_zones[index];
            const zone = STRING_TO_ZONE_TYPE.get(matchingExitZones);

            // Get our zone
            if (this.floors.has(zone)) {
                const floor = this.floors.get(zone);
                floor.addExit(Unit.fromHandle(udg_elevator_exits[index]));
            }
        });
    }
    
    private addFloor(id: ZONE_TYPE, zone: ShipZone) {
        this.floors.set(id, zone);
        this.allFloors.push(zone);
    }

    findZone(zone: ZONE_TYPE): ShipZone | undefined {
        return this.floors.get(zone);
    }

    public step(delta: number) {
        // For now only step the reactor
        this.floors.get(ZONE_TYPE.REACTOR).step(delta);
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

    /**
     * Gets a list of players currently on the Aksellon
     */
    public getPlayers(): MapPlayer[] {
        const result: MapPlayer[] = [];
        Array.from(this.floors).forEach(v => v[1].getPlayersInZone().forEach(p => result.push(p)));
        return result;
    }

    private onSecurityDamage(destroyedSecurity: unit, vandal: unit) {
        Log.Information("Ship found security damage!");
    }

    private onSecurityRepair(repairedSecurity: unit, engineer: unit) {
        Log.Information("Ship found security repair!");
    }
}