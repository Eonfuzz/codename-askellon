import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { CrewFactory } from "app/crewmember/crewmember-factory";

export class TrifexAbility implements Ability {

    private unit: Unit | undefined;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

        if (crew) {
            DynamicBuffEntity.getInstance().addBuff(
                BUFF_ID.TRIFEX, 
                this.unit, 
                new BuffInstanceDuration(this.unit, 30)
            );
        }
        return true;
    };

    public process(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}