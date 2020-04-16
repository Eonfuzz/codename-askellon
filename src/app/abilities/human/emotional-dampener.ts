import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "app/buff/buff-instance";

const EMOTIONAL_DAMPENER_BASE_DURATION = 15;

export class EmotionalDampenerAbility implements Ability {

    private unit: Unit | undefined;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        const crew = abMod.game.crewModule.getCrewmemberForUnit(this.unit);

        if (crew) {
            crew.addResolve(
                abMod.game,
                new BuffInstanceDuration(this.unit, abMod.game.getTimeStamp(), EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );
            crew.addDespair(
                abMod.game,
                new BuffInstanceDuration(this.unit, abMod.game.getTimeStamp(), EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );
        }
        else {
            abMod.game.buffModule.addBuff(
                BUFF_ID.DESPAIR, 
                this.unit, 
                new BuffInstanceDuration(this.unit, abMod.game.getTimeStamp(), EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );

            abMod.game.buffModule.addBuff(
                BUFF_ID.RESOLVE, 
                this.unit, 
                new BuffInstanceDuration(this.unit, abMod.game.getTimeStamp(), EMOTIONAL_DAMPENER_BASE_DURATION),
                true
            );
        }
        return true;
    };

    public process(module: AbilityModule, delta: number) {
        return false;
    };

    public destroy(aMod: AbilityModule) {
        return false;
    };
}