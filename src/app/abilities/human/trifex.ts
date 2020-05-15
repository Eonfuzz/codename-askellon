import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "app/buff/buff-instance";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { ROLE_TYPES } from "resources/crewmember-names";

export class TrifexAbility implements Ability {

    private unit: Unit | undefined;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = abMod.game.crewModule.getCrewmemberForUnit(this.unit);

        if (crew) {
            abMod.game.buffModule.addBuff(
                BUFF_ID.TRIFEX, 
                this.unit, 
                new BuffInstanceDuration(this.unit, abMod.game.getTimeStamp(), 30)
            );
        }
        return true;
    };

    public process(module: AbilityModule, delta: number) {
        return false;
    };

    public destroy(aMod: AbilityModule) {
        return true;
    };
}