/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";


export class ScreamAbility implements Ability {
    casterUnit: Unit;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        const screamSound = new SoundRef("Sounds\\Nazgul.wav", false);
        screamSound.playSound();
        KillSoundWhenDone(screamSound.sound);

        abMod.game.crewModule.CREW_MEMBERS.forEach(c => {
            c.addDespair(abMod.game, new BuffInstanceDuration(this.casterUnit, abMod.game.getTimeStamp(), 30));
        });
        return false;
    };
    
    public destroy(abMod: AbilityModule) {
        return true; 
    };
}