import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";

export class CeremonialDaggerItemAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());        
        
        return true;
    };

    public process(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}