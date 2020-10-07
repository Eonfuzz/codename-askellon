import { Gun } from "./gun";
import { Unit } from "w3ts/handles/unit";
import { GunItem } from "./gun-item";

export abstract class ArmableUnit {
    public unit: Unit;
    public weapon: Gun | undefined;

    constructor(unit: Unit) {
        this.unit = unit;
    }
    
    abstract onWeaponAdd(weapon: Gun): void
    abstract onWeaponRemove(weapon: Gun): void
}

export abstract class ArmableUnitWithItem extends ArmableUnit {
    public weapon: GunItem | undefined;
}

export class ArmableUnitNoCallbacks extends ArmableUnit {
    public unit: Unit;
    public weapon: Gun | undefined;

    constructor(unit: Unit) {
        super(unit);
    }
    
    onWeaponAdd(weapon: Gun) {}
    onWeaponRemove(weapon: Gun) {}
}