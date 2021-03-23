import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";

export const COMEBACK_DURATION = 30;

export class ComebackDrugAbility extends AbilityWithDone {

    private unit: Unit | undefined;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());

        DynamicBuffEntity.getInstance().addBuff(
            BUFF_ID.DRUG_COMEBACK, 
            this.unit, 
            new BuffInstanceDuration(this.unit, COMEBACK_DURATION)
        );
        this.done = true; 
        return true;
    };

    public step(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}