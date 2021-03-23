import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { CrewFactory } from "app/crewmember/crewmember-factory";

export class TrifexAbility extends AbilityWithDone {

    private unit: Unit | undefined;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

        if (crew) {
            DynamicBuffEntity.getInstance().addBuff(
                BUFF_ID.TRIFEX, 
                this.unit, 
                new BuffInstanceDuration(this.unit, 30)
            );
        }
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