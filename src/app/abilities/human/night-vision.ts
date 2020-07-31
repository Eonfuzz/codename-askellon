import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { VISION_TYPE } from "app/vision/vision-type";
import { WorldEntity } from "app/world/world-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { VisionFactory } from "app/vision/vision-factory";

const NIGHT_VISION_DURATION = 30;

export class NightVisionAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;

    private oldVis: VISION_TYPE = VISION_TYPE.HUMAN;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        // Re-enter the unit's current zone
        const z = WorldEntity.getInstance().getUnitZone(this.unit);
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);
        if (z && crew) {
            this.oldVis = VisionFactory.getInstance().getPlayerVision(this.unit.owner);
            VisionFactory.getInstance().setPlayervision(this.unit.owner, VISION_TYPE.NIGHT_VISION);
            z.onEnter(this.unit);
        }
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;
        return this.timeElapsed < NIGHT_VISION_DURATION;
    };

    public destroy() { 
        if (this.unit) {
            const z = WorldEntity.getInstance().getUnitZone(this.unit);
            const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);
            if (z && crew) {
                VisionFactory.getInstance().setPlayervision(this.unit.owner, this.oldVis);
    
                z.onEnter(this.unit);
            }
        }
        return true;
    };
}