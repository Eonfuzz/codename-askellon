import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, EMS_RIFLING_ABILITY_ID, LASER_ABILITY_ID } from "../weapon-constants";
import { ABIL_WEP_DIODE_EJ } from "resources/ability-ids";

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class DiodeEjector extends Attachment {

    name = "Diode Ejector"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun): boolean {
        if (weapon.getAbilityId() === LASER_ABILITY_ID) {
            if (weapon.equippedTo) {
                UnitAddAbility(weapon.equippedTo.unit, ABIL_WEP_DIODE_EJ);
            }
            return true;
        }
        return false;
    };

    /**
     * Removes this from the attached wepaon
     */
    protected onDeattach(): void {
        // Should never be de-attached
    };

    public onEquip(weapon: Gun) {
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit, ABIL_WEP_DIODE_EJ);
            BlzSetUnitAbilityCooldown(weapon.equippedTo.unit, ABIL_WEP_DIODE_EJ, 0, 
                BlzGetAbilityCooldown(ABIL_WEP_DIODE_EJ, 0)    
            );
        }
    }

    public onUnequip(weapon: Gun) {
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit, ABIL_WEP_DIODE_EJ);
        }
    }
}