import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { WeaponModule } from "../weapon-module";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, HIGH_QUALITY_POLYMER_ABILITY_ID } from "../weapon-constants";

/** @noSelfInFile **/

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class HighQualityPolymer extends Attachment {

    name = "High Quality Polymer"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID) {
            if (weapon.equippedTo) {
                UnitAddAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID);
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
            UnitRemoveAbility(this.attachedTo.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    };

    public onEquip(weapon: Gun, crewmember: Crewmember) {
        // Log.Information("Re-equiping gun with hqp attachment");
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    }

    public onUnequip(weapon: Gun, crewmember: Crewmember) {
        // Log.Information("Unequiping gun with hqp attachment");
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    }
}