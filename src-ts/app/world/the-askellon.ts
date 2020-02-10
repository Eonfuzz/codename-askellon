/** @noSelfInFile **/
import { ZONE_TYPE } from "./zone-id";
import { Game } from "../game";
import { Zone, ShipZone } from "./zone-type";
import { WorldModule } from "./world-module";
import { SoundRef } from "../types/sound-ref";

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
    
    powerDownSound = new SoundRef("Sounds\\PowerDown.mp3", false)

    world: WorldModule;
    floors: Map<ZONE_TYPE, ShipZone> = new Map();

    constructor(world: WorldModule) {
        this.world = world;

        this.floors.set(ZONE_TYPE.FLOOR_1, new ShipZone(ZONE_TYPE.FLOOR_1));
        this.floors.set(ZONE_TYPE.FLOOR_2, new ShipZone(ZONE_TYPE.FLOOR_2));
    }

    findZone(zone: ZONE_TYPE): ShipZone | undefined {
        return this.floors.get(zone);
    }

    applyPowerChange(player: player, hasPower: boolean, justChanged: boolean) {
        if (hasPower && player === GetLocalPlayer()) {
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
            SetDayNightModels("", "");
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
}