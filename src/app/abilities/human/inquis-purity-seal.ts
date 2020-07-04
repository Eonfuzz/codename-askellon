import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_INQUIS_PURITY_SEAL_DUMMY, TECH_MAJOR_RELIGION, ABIL_INQUIS_PURITY_SEAL } from "resources/ability-ids";
import { PuritySeal } from "app/buff/purity-seal";

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
        sound.playSoundOnUnit(this.unit.handle, 70);

        return true;
    };

    public process(module: AbilityModule, delta: number) {

        const tLevel = module.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_RELIGION);
        const hasIncreasedDuration = module.game.researchModule.techHasOccupationBonus(TECH_MAJOR_RELIGION, 2);
        
        module.game.useDummyFor((dummy: unit) => {
            SetUnitAbilityLevel(dummy, ABIL_INQUIS_PURITY_SEAL_DUMMY, tLevel+1);
            SetUnitX(dummy, this.unit.x);
            SetUnitY(dummy, this.unit.y + 50);
            IssueTargetOrder(dummy, "innerfire", this.targetUnit.handle);
        }, ABIL_INQUIS_PURITY_SEAL_DUMMY);

        const buffFound = module.game.buffModule.addBuff(
            BUFF_ID.PURITY_SEAL, 
            this.targetUnit,
            new BuffInstanceDuration(this.unit, module.game.getTimeStamp(), hasIncreasedDuration ? 240 : 180)
        ) as PuritySeal;

        return false;
    };

    public destroy(aMod: AbilityModule) { 
        return true;
    };
}