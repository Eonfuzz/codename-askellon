import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, EMS_RIFLING_ABILITY_ID, SNIPER_ABILITY_ID, SHOTGUN_ABILITY_ID } from "../weapon-constants";
import { Crewmember } from "app/crewmember/crewmember-type";

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class RailRifle extends Attachment {

    name = "Rail Rifle"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID || 
            weapon.getAbilityId() === SHOTGUN_ABILITY_ID
        ) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(SNIPER_ABILITY_ID);
                BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID, BlzGetAbilityCooldown(SNIPER_ABILITY_ID, 0));

            }
            return true;
        }
        return false;
    };

    /**
     * Removes this from the attached wepaon
     */
    protected onDeattach(): void {
        if (this.attachedTo &&  this.attachedTo.equippedTo) {
            UnitRemoveAbility(this.attachedTo.equippedTo.unit.handle, SNIPER_ABILITY_ID);
        }
    };

    public onEquip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID);
            BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID, BlzGetAbilityCooldown(SNIPER_ABILITY_ID, 0));
        }
    }

    public onUnequip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID);
        }
    }
}