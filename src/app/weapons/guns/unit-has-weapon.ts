import { Gun } from "./gun";
import { Unit } from "w3ts/handles/unit";

export abstract class ArmableUnit {
    public unit: Unit;
    public weapon: Gun | undefined;

    constructor(unit: Unit) {
        this.unit = unit;
    }
    
    abstract onWeaponAdd(weapon: Gun): void
    abstract onWeaponRemove(weapon: Gun): void
}