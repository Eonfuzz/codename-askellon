import { Unit } from "w3ts/index";
import { ABILITY_HOOK } from "./hook-types";

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

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.UnitDies) {
            
        }
    }

    public abstract onEvent(event: ABILITY_HOOK): void

    /**
     * Iterate upon this instance of the aiblity
     */
    public abstract step(deltaTime: number): void

    public doDestroy(): boolean {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public abstract destroy(): void
}