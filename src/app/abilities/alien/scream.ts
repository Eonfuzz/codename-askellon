/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
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