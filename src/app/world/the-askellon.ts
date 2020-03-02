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
        this.floors.set(ZONE_TYPE.VENTRATION, new ShipZone(ZONE_TYPE.VENTRATION));

        // Now apply lights to the zones
        const z1 = this.floors.get(ZONE_TYPE.FLOOR_1);
        if (z1) {
            z1.lightSources.push(gg_dest_B002_0015);
            z1.lightSources.push(gg_dest_B002_0017);
            z1.lightSources.push(gg_dest_B002_0019);
            z1.lightSources.push(gg_dest_B002_0022);
        }
        
        // Now apply lights to the zones
        const vents = this.floors.get(ZONE_TYPE.VENTRATION);
        if (vents) {
            vents.updatePower(world, false);
            vents.alwaysCauseFear = true;
        }
    }

    findZone(zone: ZONE_TYPE): ShipZone | undefined {
        return this.floors.get(zone);
    }

    applyPowerChange(player: player, hasPower: boolean, justChanged: boolean) {
        let alienForce = this.world.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
        let playerIsAlien = alienForce.hasPlayer(player);

        if (hasPower && justChanged) {
            if (GetLocalPlayer() === player) {
                this.powerUpSound.playSound();
            }
            this.world.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                if (GetLocalPlayer() === player) {
                    SetDayNightModels(
                        "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                        "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
                    );
                }
                return true;
            }, 4000));
        }
        else if (hasPower && !justChanged && player === GetLocalPlayer()) {
            SetDayNightModels(
                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
            );
        }
        else if (!hasPower && player === GetLocalPlayer()) {
            // Play the sound effect only if the power has *just* changed
            if (justChanged) {
                this.powerDownSound.playSound();
            }
            if (playerIsAlien) {
                SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\NiteVisionModelRed.mdx");
            }
            else {
                SetDayNightModels("", "");
            }
        }


        // IF we dont have power add despair to the unit
        if (!hasPower && !playerIsAlien) {
            // Try to get crewmember
            const crew = this.world.game.crewModule.getCrewmemberForPlayer(player);
            if (crew) {
                crew.addDespair(this.world.game, new BuffInstanceCallback(() => {
                    const z = this.world.getUnitZone(crew.unit);
                    return z ? z.doCauseFear() : false;
                }));
            }
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
}