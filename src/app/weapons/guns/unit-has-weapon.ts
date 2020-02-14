import { Gun } from "./gun";
import { WeaponModule } from "../weapon-module";

/** @noSelfInFile **/

export abstract class ArmableUnit {
    public unit: unit;
    public weapon: Gun | undefined;

    constructor(unit: unit) {
        this.unit = unit;
    }
    
    abstract onWeaponAdd(weaponModule: WeaponModule, weapon: Gun): void
    abstract onWeaponRemove(weaponModule: WeaponModule, weapon: Gun): void
}