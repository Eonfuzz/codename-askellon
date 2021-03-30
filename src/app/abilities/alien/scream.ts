import { AbilityWithDone } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Log } from "lib/serilog/serilog";
import { SOUND_ALIEN_SCREAM } from "resources/sounds";

export class ScreamAbility extends AbilityWithDone {    

    public init() {
        super.init();
        return true;
    };

    public step(delta: number) {

        const world = WorldEntity.getInstance();
        // Get out current unit's zone
        const zone = world.getPointZone(this.casterUnit.x, this.casterUnit.y) || world.getUnitZone(this.casterUnit);

        if (zone) {
            const pInZone = zone.getPlayersInZone();
            SOUND_ALIEN_SCREAM.setVolume(40);
            pInZone.forEach(player => {
                const pData = PlayerStateFactory.get(player);
                if (pData) {
                    const crew = pData.getCrewmember();
                    if (crew && crew.unit.isAlive()) {
                        crew.addDespair(new BuffInstanceDuration(this.casterUnit, 30));
                    }
                }
            });
            SOUND_ALIEN_SCREAM.setVolume(90);
            SOUND_ALIEN_SCREAM.playSoundForPlayers(pInZone);
        }
        else {
            Log.Error("Scream caster not in any zone. DIS BE A BUG");
        }
        
        this.done = true;
        return false;
    };
    
    public destroy() {
        return true; 
    };
}