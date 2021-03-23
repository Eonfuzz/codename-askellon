import { Unit } from "w3ts/index";
import { ABILITY_HOOK } from "./hook-types";
import {ABIL_CULTIST_DARK_THRALL} from "resources/ability-ids"

export abstract class Behaviour {

    protected forUnit!: Unit;

    /**
     * Will throw an error if the instance cannot be created
     * @param event 
     */
    constructor() {}

    public init(forUnit: Unit): boolean {
        this.forUnit = forUnit;
        return true;
    }

    /**
     * Iterate upon this instance of the ability
     */
    public onEvent(event: ABILITY_HOOK) {
        if (event = ABILITY_HOOK.UnitDies) {
            this.forUnit = Unit.fromHandle(GetTriggerUnit());
            ReviveHero(this.forUnit.handle,this.forUnit.x,this.forUnit.y,false);
            PauseUnit(this.forUnit.handle,true);
            SetUnitAnimation(this.forUnit.handle,"death");
            SetUnitInvulnerable(this.forUnit.handle,true);
        }
    }

    public abstract step(deltaTime: number) {

        return true;
    }

    public doDestroy(): boolean {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public abstract destroy(): void
}