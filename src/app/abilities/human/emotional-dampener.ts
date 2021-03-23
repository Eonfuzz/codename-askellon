import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ResearchFactory } from "app/research/research-factory";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";

const EMOTIONAL_DAMPENER_BASE_DURATION = 15;

export class EmotionalDampenerAbility extends AbilityWithDone {

    private unit: Unit | undefined;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

        if (crew) {
            // Only disable resolve if HC 2 isn't upgraded
            const hasHC2 = ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_HEALTHCARE, 2);
           
            if (!hasHC2) {
                crew.addResolve(
                    new BuffInstanceDuration(this.unit, EMOTIONAL_DAMPENER_BASE_DURATION),
                    true
                );
            }
            crew.addDespair(
                new BuffInstanceDuration(this.unit, EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );
        }
        else {
            DynamicBuffEntity.getInstance().addBuff(
                BUFF_ID.DESPAIR, 
                this.unit, 
                new BuffInstanceDuration(this.unit, EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );

            DynamicBuffEntity.getInstance().addBuff(
                BUFF_ID.RESOLVE, 
                this.unit, 
                new BuffInstanceDuration(this.unit, EMOTIONAL_DAMPENER_BASE_DURATION),
                true
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