import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { VISION_TYPE } from "app/world/vision-type";
import { Unit } from "w3ts/handles/unit";

const NIGHT_VISION_DURATION = 30;

export class NightVisionAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;

    private oldVis: VISION_TYPE = VISION_TYPE.NORMAL;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        // Re-enter the unit's current zone
        const z = abMod.game.worldModule.getUnitZone(this.unit);
        const crew = abMod.game.crewModule.getCrewmemberForUnit(this.unit);
        if (z && crew) {
            this.oldVis = crew.getVisionType();
            crew.setVisionType(VISION_TYPE.NIGHT_VISION);
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
                crew.setVisionType(this.oldVis);
                z.onEnter(aMod.game.worldModule, this.unit);
            }
        }
        return false;
    };
}