import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { BURST_RIFLE_ABILITY_ID } from "../guns/burst-rifle";
import { WeaponModule } from "../weapon-module";
import { Log } from "../../../lib/serilog/serilog";

/** @noSelfInFile **/
export const HIGH_QUALITY_POLYMER_ABILITY_ID = FourCC('A009');
export const HIGH_QUALITY_POLYMER_ITEM_ID = FourCC('I002');

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class HighQualityPolymer extends Attachment {

    name = "High Quality Polymer"

    /**
     * Gets the tooltip for the attachment
     * @param weapon 
     */
    public getTooltip(weapon: Gun): string {
        return "Has high quality polymer installed";
    };

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID) {
            if (weapon.equippedTo) {
                UnitAddAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID);
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
            UnitRemoveAbility(this.attachedTo.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    };

    public onEquip(weapon: Gun) {
        Log.Information("Re-equiping gun with hqp attachment");
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    }

    public onUnequip(weapon: Gun) {
        Log.Information("Unequiping gun with hqp attachment");
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    }
}