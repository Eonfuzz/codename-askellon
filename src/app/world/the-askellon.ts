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
import { ABIL_NIGHTEYE } from "resources/ability-ids";
import { EventListener, EVENT_TYPE } from "app/events/event";

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

export class TheAskellon {
    
    powerDownSound = new SoundRef("Sounds\\PowerDown.mp3", false);
    powerUpSound = new SoundRef("Sounds\\powerUp.mp3", false);

    world: WorldModule;
    floors: Map<ZONE_TYPE, ShipZone> = new Map();

    private pilot: Crewmember | undefined;

    constructor(world: WorldModule) {
        this.world = world;

        this.floors.set(ZONE_TYPE.FLOOR_1, new ShipZone(ZONE_TYPE.FLOOR_1));
        this.floors.set(ZONE_TYPE.FLOOR_2, new ShipZone(ZONE_TYPE.FLOOR_2));
        this.floors.set(ZONE_TYPE.CARGO_A, new ShipZone(ZONE_TYPE.CARGO_A));
        this.floors.set(ZONE_TYPE.CARGO_A_VENT, new ShipZone(ZONE_TYPE.CARGO_A_VENT));
        this.floors.set(ZONE_TYPE.SERVICE_TUNNELS, new ShipZone(ZONE_TYPE.SERVICE_TUNNELS));

        // Now apply lights to the zones
        const z1 = this.floors.get(ZONE_TYPE.FLOOR_1);
        if (z1) {
            z1.lightSources.push(gg_dest_B002_0015);
            z1.lightSources.push(gg_dest_B002_0017);
            z1.lightSources.push(gg_dest_B002_0019);
            z1.lightSources.push(gg_dest_B002_0022);
        }
        
        // Now apply lights to the zones
        const SERVICE_TUNNELS = this.floors.get(ZONE_TYPE.SERVICE_TUNNELS);
        if (SERVICE_TUNNELS) {
            SERVICE_TUNNELS.updatePower(world, false);
            SERVICE_TUNNELS.alwaysCauseFear = true;
        }
        const CARGO_A_VENT = this.floors.get(ZONE_TYPE.CARGO_A_VENT);
        if (CARGO_A_VENT) {
            CARGO_A_VENT.updatePower(world, false);
            CARGO_A_VENT.alwaysCauseFear = true;
        }

        // Register to and listen for security destruction
        this.world.game.event.addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_DISABLED, 
            (self, data: any) => this.onSecurityDamage(data.unit, data.source))
        );
        // Register to and listen for security repair
        this.world.game.event.addListener(
            new EventListener(EVENT_TYPE.STATION_SECURITY_ENABLED,
            (self, data: any) => this.onSecurityRepair(data.unit, data.source))
        );
    }

    findZone(zone: ZONE_TYPE): ShipZone | undefined {
        return this.floors.get(zone);
    }

    applyPowerChange(player: player, hasPower: boolean, justChanged: boolean) {
        let alienForce = this.world.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
        const crewmember = this.world.game.crewModule.getCrewmemberForPlayer(player);
        const vision = crewmember ? crewmember.getVisionType() : VISION_TYPE.NORMAL;

        if (hasPower && justChanged) {
            if (GetLocalPlayer() === player) {
                this.powerUpSound.playSound();
            }
            this.world.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                if (GetLocalPlayer() === player) {
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
        else if (hasPower && !justChanged && player === GetLocalPlayer()) {
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
        else if (!hasPower && player === GetLocalPlayer()) {
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
        if (!hasPower && crewmember && GetUnitAbilityLevel(crewmember.unit, ABIL_NIGHTEYE) === 0) {
            crewmember.addDespair(this.world.game, new BuffInstanceCallback(() => {
                const z = this.world.getUnitZone(crewmember.unit);
                const hasNighteye = GetUnitAbilityLevel(crewmember.unit, ABIL_NIGHTEYE);
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
        const askellonUnit = this.world.game.spaceModule.mainShip.unit;

        // Damage the ship
        if (askellonUnit) {
            UnitDamageTarget(askellonUnit, askellonUnit, damage, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);
        }

        if (damage > SMALL_DAMAGE_THRESHOLD) {
            // Play ship groan sfx
            // Shake screen for all inside ship
        }
        else if (damage > MODREATE_DAMAGE_THRESHOLD) {
            // Play ship bang sfx
            // Moderate Shake screen for all inside ship
            // Cause temporary power out in effected zone
        }
        else if (damage > EXTREME_DAMAGE_THRESHOLD) {
            // Play ship bang sfx
            // Heavy screen shake
            // Damage all players and units in zone
            // Cause permanent power out in effected zone
            // Damage all modules in effected zone
        }
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
    public getPlayers(): player[] {
        const result: player[] = [];
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