import { Gun } from "./gun";
import { WeaponModule } from "../weapon-module";
import { Unit } from "w3ts/handles/unit";

/** @noSelfInFile **/

export abstract class ArmableUnit {
    public unit: Unit;
    public weapon: Gun | undefined;

    constructor(unit: Unit) {
        this.unit = unit;
    }
    
    abstract onWeaponAdd(weaponModule: WeaponModule, weapon: Gun): void
    abstract onWeaponRemove(weaponModule: WeaponModule, weapon: Gun): void
}