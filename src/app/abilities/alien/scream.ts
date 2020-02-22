/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { UNIT_IS_FLY } from "../../../lib/order-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";


export class ScreamAbility implements Ability {
    constructor() {}

    public initialise(abMod: AbilityModule) {
        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        const screamSound = new SoundRef("Sounds\\Nazgul.wav", false);
        screamSound.playSound();
        KillSoundWhenDone(screamSound.sound);

        abMod.game.crewModule.CREW_MEMBERS.forEach(c => {
            c.addDespair(abMod.game, new BuffInstanceDuration(abMod.game.getTimeStamp(), 30));
        });
        return false;
    };
    
    public destroy(abMod: AbilityModule) {
        return true; 
    };
}