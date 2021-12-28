import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ResearchFactory } from "app/research/research-factory";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { DynamicBuffState } from "app/buff/dynamic-buff-state";

const EMOTIONAL_DAMPENER_BASE_DURATION = 45;

export class EmotionalDampenerAbility extends AbilityWithDone {

    private unit: Unit | undefined;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

        const madness = DynamicBuffState.unitHasBuff(BUFF_ID.MADNESS, this.unit);
        if (madness) {
            madness.clear();
        }

        if (crew) {
            this.unit.intelligence = this.unit.intelligence - 1;
            
            // Only disable resolve if HC 2 isn't upgraded
            const hasHC2 = ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_HEALTHCARE, 1);
           
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