/** @noSelfInFile **/
import { Vector3 } from "../../types/vector3";
import { Crewmember } from "../../crewmember/crewmember-type";
import { WeaponModule } from "../weapon-module";

export interface Gun {
    item: item;
    equippedTo: unit | undefined;

    // Set when the gun is removed and a cooldown still exists
    remainingCooldown: number | undefined;
    
    onAdd(weaponModule: WeaponModule, caster: Crewmember): void;
    onRemove(weaponModule: WeaponModule): void;

    onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void;
    getDamage(weaponModule: WeaponModule, caster: Crewmember): number;

    updateTooltip(weaponModule: WeaponModule, caster: Crewmember): void;
}

export interface GunDecorator {
    abilityId: number;
    itemId: number;

    /**
     * Adds the gun to the weapon module
     * @param weaponModule 
     */
    initialise(weaponModule: WeaponModule): void;
}