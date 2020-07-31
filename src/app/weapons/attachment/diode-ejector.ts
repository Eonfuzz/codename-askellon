import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, EMS_RIFLING_ABILITY_ID, LASER_ABILITY_ID } from "../weapon-constants";
import { ABIL_WEP_DIODE_EJ } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { diodeEjectTooltip } from "resources/ability-tooltips";
import { TooltipEntity } from "app/tooltip/tooltip-module";

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class DiodeEjector extends Attachment {

    name = "Diode Ejector"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === LASER_ABILITY_ID) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(ABIL_WEP_DIODE_EJ);
                TooltipEntity.getInstance().registerTooltip(crewmember, diodeEjectTooltip);
                BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, ABIL_WEP_DIODE_EJ, BlzGetAbilityCooldown(ABIL_WEP_DIODE_EJ, 0));
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

    public onEquip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            weapon.equippedTo.unit.addAbility(ABIL_WEP_DIODE_EJ);
            TooltipEntity.getInstance().registerTooltip(crewmember, diodeEjectTooltip);
            BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, ABIL_WEP_DIODE_EJ, BlzGetAbilityCooldown(ABIL_WEP_DIODE_EJ, 0));
        }
    }

    public onUnequip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            weapon.equippedTo.unit.removeAbility(ABIL_WEP_DIODE_EJ);
            TooltipEntity.getInstance().unregisterTooltip(crewmember, diodeEjectTooltip);
        }
    }
}