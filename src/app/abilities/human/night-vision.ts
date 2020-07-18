import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/handles/unit";
import { VISION_TYPE } from "app/vision/vision-type";

const NIGHT_VISION_DURATION = 30;

export class NightVisionAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;

    private oldVis: VISION_TYPE = VISION_TYPE.HUMAN;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        // Re-enter the unit's current zone
        const z = abMod.game.worldModule.getUnitZone(this.unit);
        const crew = abMod.game.crewModule.getCrewmemberForUnit(this.unit);
        if (z && crew) {
            this.oldVis = abMod.game.vision.getPlayerVision(this.unit.owner);
            abMod.game.vision.setPlayervision(this.unit.owner, VISION_TYPE.NIGHT_VISION);
            z.onEnter(abMod.game.worldModule, this.unit);
        }
        return true;
    };

    public process(module: AbilityModule, delta: number) {
        this.timeElapsed += delta;
        return this.timeElapsed < NIGHT_VISION_DURATION;
    };

    public destroy(aMod: AbilityModule) { 
        if (this.unit) {
            const z = aMod.game.worldModule.getUnitZone(this.unit);
            const crew = aMod.game.crewModule.getCrewmemberForUnit(this.unit);
            if (z && crew) {
                aMod.game.vision.setPlayervision(this.unit.owner, this.oldVis);
    
                z.onEnter(aMod.game.worldModule, this.unit);
            }
        }
        return true;
    };
}