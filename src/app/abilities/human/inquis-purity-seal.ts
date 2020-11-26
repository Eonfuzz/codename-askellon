import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_INQUIS_PURITY_SEAL_DUMMY, TECH_MAJOR_RELIGION, ABIL_INQUIS_PURITY_SEAL } from "resources/ability-ids";
import { PuritySeal } from "app/buff/buffs/purity-seal";
import { Game } from "app/game";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { ResearchFactory } from "app/research/research-factory";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DummyCast } from "lib/dummy";

export const puritySealSounds = [
    new SoundRef("Sounds\\WhatIsHisWill.mp3", false),
    new SoundRef("Sounds\\WhatIsYourDuty.mp3", false)
];

export class PuritySealAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        const sound = puritySealSounds[GetRandomInt(0, puritySealSounds.length - 1)];
        sound.playSoundOnUnit(this.unit.handle, 70);

        return true;
    };

    public process(delta: number) {
        const tLevel = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION);
        const hasIncreasedDuration = ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_RELIGION, 2);
        
        const buffFound = DynamicBuffEntity.getInstance().addBuff(
            BUFF_ID.PURITY_SEAL, 
            this.targetUnit,
            new BuffInstanceDuration(this.unit, hasIncreasedDuration ? 240 : 180)
        ) as PuritySeal;

        return false;
    };

    public destroy() { 
        return true;
    };
}