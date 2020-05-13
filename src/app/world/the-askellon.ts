/** @noSelfInFile **/
import { ZONE_TYPE } from "./zone-id";
import { Game } from "../game";
import { Zone, ShipZone } from "./zone-type";
import { WorldModule } from "./world-module";
import { SoundRef } from "../types/sound-ref";
import { TimedEvent } from "../types/timed-event";
import { BuffInstanceDuration, BuffInstanceCallback } from "../buff/buff-instance";
import { Log } from "../../lib/serilog/serilog";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { Vector2 } from "app/types/vector2";
import { Crewmember } from "app/crewmember/crewmember-type";
import { VISION_TYPE } from "./vision-type";
import { ABIL_GENE_NIGHTEYE } from "resources/ability-ids";
import { EventListener, EVENT_TYPE } from "app/events/event";
import { MapPlayer } from "w3ts";
import { ChurchZone } from "./zones/church";
import { BridgeZone, BridgeZoneVent } from "./zones/bridge";

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

declare const udg_Lights_Floor_1: destructable[];
declare const udg_Lights_Cargo: destructable[];
declare const udg_Lights_Bridge: destructable[];

export class TheAskellon {
    
    powerDownSound = new SoundRef("Sounds\\PowerDown.mp3", false);
    powerUpSound = new SoundRef("Sounds\\powerUp.mp3", false);

    world: WorldModule;
    floors: Map<ZONE_TYPE, ShipZone> = new Map();

    private pilot: Crewmember | undefined;

    constructor(world: WorldModule) {
        this.world = world;

        this.floors.set(ZONE_TYPE.FLOOR_1, new ShipZone(world.game, ZONE_TYPE.FLOOR_1, udg_Lights_Floor_1));
        this.floors.set(ZONE_TYPE.FLOOR_2, new ShipZone(world.game, ZONE_TYPE.FLOOR_2));
        this.floors.set(ZONE_TYPE.CARGO_A, new ShipZone(world.game, ZONE_TYPE.CARGO_A, udg_Lights_Cargo));
        this.floors.set(ZONE_TYPE.CARGO_A_VENT, new ShipZone(world.game, ZONE_TYPE.CARGO_A_VENT));
        this.floors.set(ZONE_TYPE.SERVICE_TUNNELS, new ShipZone(world.game, ZONE_TYPE.SERVICE_TUNNELS));
        this.floors.set(ZONE_TYPE.BRIDGE, new BridgeZone(world.game, ZONE_TYPE.BRIDGE, udg_Lights_Bridge));
        this.floors.set(ZONE_TYPE.BRIDGE_VENT, new BridgeZoneVent(world.game, ZONE_TYPE.BRIDGE_VENT));
        this.floors.set(ZONE_TYPE.CHURCH, new ChurchZone(world.game, ZONE_TYPE.CHURCH));

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
        const BRIDGE_VENT = this.floors.get(ZONE_TYPE.CARGO_A_VENT);
        if (BRIDGE_VENT) {
            BRIDGE_VENT.updatePower(false);
            BRIDGE_VENT.alwaysCauseFear = true;
        }
    }

    findZone(zone: ZONE_TYPE): ShipZone | undefined {
        return this.floors.get(zone);
    }

    applyPowerChange(player: MapPlayer, hasPower: boolean, justChanged: boolean) {
        let alienForce = this.world.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
        const crewmember = this.world.game.crewModule.getCrewmemberForPlayer(player);
        const vision = crewmember ? crewmember.getVisionType() : VISION_TYPE.NORMAL;

        if (hasPower && justChanged) {
            if (GetLocalPlayer() === player.handle) {
                this.powerUpSound.playSound();
            }
            this.world.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                if (GetLocalPlayer() === player.handle) {
                    switch(vision) {
                        case VISION_TYPE.NIGHT_VISION:
                        case VISION_TYPE.ALIEN:
                        default:
                            SetDayNightModels(
                                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
                            );
                    };
                }
                return true;
            }, 4000));
        }
        else if (hasPower && !justChanged && player.handle === GetLocalPlayer()) {
            switch(vision) {
                case VISION_TYPE.NIGHT_VISION:
                case VISION_TYPE.ALIEN:
                default:
                    SetDayNightModels(
                        "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                        "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
                    );
            };
        }
        else if (!hasPower && player.handle === GetLocalPlayer()) {
            // Play the sound effect only if the power has *just* changed
            if (justChanged) {
                this.powerDownSound.playSound();
            }
            switch(vision) {
                case VISION_TYPE.NIGHT_VISION:
                case VISION_TYPE.ALIEN:
                    SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx");
                    break;
                default:
                    SetDayNightModels("", "");
            }
        }


        // IF we dont have power add despair to the unit
        if (!hasPower && crewmember && GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE) === 0) {
            crewmember.addDespair(this.world.game, new BuffInstanceCallback(crewmember.unit, () => {
                const z = this.world.getUnitZone(crewmember.unit);
                const hasNighteye = GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE);
                return (z && hasNighteye === 0) ? z.doCauseFear() : false;
            }));
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
        // const askellonUnit = this.world.game.spaceModule.mainShip.unit;

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
        return items[Math.floor(Math.random() * items.length)];
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