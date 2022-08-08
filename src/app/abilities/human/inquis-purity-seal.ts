import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_INQUIS_PURITY_SEAL_DUMMY, TECH_MAJOR_RELIGION, ABIL_INQUIS_PURITY_SEAL } from "resources/ability-ids";
import { PuritySeal } from "app/buff/buffs/purity-seal";
import { Game } from "app/game";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { ResearchFactory } from "app/research/research-factory";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";

export const puritySealSounds = [
    new SoundRef("Sounds\\WhatIsHisWill.mp3", false),
    new SoundRef("Sounds\\WhatIsYourDuty.mp3", false)
];

export class PuritySealAbility extends AbilityWithDone {

    public init() {
        super.init();
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        const sound = puritySealSounds[GetRandomInt(0, puritySealSounds.length - 1)];
        sound.playSoundOnUnit(this.casterUnit.handle, 70);

        return true;
    };

    public step(delta: number) {
        const tLevel = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION);
        const hasIncreasedDuration = ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_RELIGION, 2);
        
        const buffFound = DynamicBuffEntity.getInstance().addBuff(
            BUFF_ID.PURITY_SEAL, 
            this.targetUnit,
            new BuffInstanceDuration(this.casterUnit, hasIncreasedDuration ? 240 : 180)
        ) as PuritySeal;

        this.done = true;
        return false;
    };

    public destroy() { 
        return true;
    };
}