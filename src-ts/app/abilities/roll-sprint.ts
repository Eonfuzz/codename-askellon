import { Ability } from "./ability-type";
import { AbilityModule } from "./ability-module";
import { Vector2, vectorFromUnit } from "../types/vector2";
import { Log } from "../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../weapons/weapon-constants";

/** @noSelfInFile **/
const ROLL_DISTANCE = 330;
const ROLL_DURATION = 0.3;

export class rollWhenSprinting implements Ability {

    private unit: unit | undefined;
    private direction: Vector2 | undefined;
    private timeElapsed: number;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(module: AbilityModule) {
        this.unit = GetTriggerUnit();

        const unitPos = vectorFromUnit(this.unit);

        // Distance is increased if the unit has high quality polymers
        const rollModifier = GetUnitAbilityLevel(this.unit, HIGH_QUALITY_POLYMER_ABILITY_ID) > 0 ? 1.3 : 1;

        const targetPos = unitPos.applyPolarOffset(
            GetUnitFacing(this.unit), 
            ROLL_DISTANCE * rollModifier
        );

        this.direction = targetPos.subtract( unitPos )
            .normalise()
            .multiplyN((ROLL_DISTANCE * rollModifier) / ROLL_DURATION);

        return true;
    };

    public process(module: AbilityModule, delta: number) {
        this.timeElapsed = this.timeElapsed + delta;
        if (this.direction && this.unit) {
            const newPosition = vectorFromUnit(this.unit).add( this.direction.multiplyN(delta) );
            SetUnitX(this.unit, newPosition.x);
            SetUnitY(this.unit, newPosition.y);
        }
        return this.timeElapsed <= ROLL_DURATION; 
    };

    public destroy(module: AbilityModule) { return false; };
}