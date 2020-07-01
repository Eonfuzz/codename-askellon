import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";

export const puritySealSounds = [
    new SoundRef("Sounds\\WhatIsHisWill.mp3", false),
    new SoundRef("Sounds\\WhatIsYourDuty.mp3", false)
];

export class PuritySealAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    private isImpure: boolean = false;

    constructor(isImpure: boolean) {
        this.isImpure = isImpure;
    }

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        const sound = puritySealSounds[GetRandomInt(0, puritySealSounds.length - 1)];
        sound.playSoundOnUnit(this.unit.handle, 60);

        return true;
    };

    public process(module: AbilityModule, delta: number) {
        
        module.game.buffModule.addBuff(
            BUFF_ID.PURITY_SEAL, 
            this.targetUnit,
            new BuffInstanceDuration(this.unit, module.game.getTimeStamp(), 180)
        );

        return false;
    };

    public destroy(aMod: AbilityModule) { 
        return true;
    };
}