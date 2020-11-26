import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Log } from "lib/serilog/serilog";
import { SOUND_ALIEN_SCREAM } from "resources/sounds";

// const screamSound =new SoundRef("Sounds\\Nazgul.wav", false, true);

export class ScreamAbility implements Ability {
    casterUnit: Unit;

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        return true;
    };

    public process(delta: number) {

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
                        if (GetLocalPlayer() === pData.player.handle) {
                            SOUND_ALIEN_SCREAM.playSound();
                        }
                    }
                }
            });
        }
        else {
            Log.Error("Scream caster not in any zone. DIS BE A BUG");
        }
        return false;
    };
    
    public destroy() {
        return true; 
    };
}