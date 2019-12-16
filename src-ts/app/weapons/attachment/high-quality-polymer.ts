import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { BURST_RIFLE_ABILITY_ID } from "../guns/burst-rifle";
import { WeaponModule } from "../weapon-module";

/** @noSelfInFile **/
export const HIGH_QUALITY_POLYMER_ABILITY_ID = FourCC('Aweb');
export const HIGH_QUALITY_POLYMER_ITEM_ID = FourCC('I002');

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class HighQualityPolymer extends Attachment {
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
                UnitAddAbility(weapon.equippedTo, HIGH_QUALITY_POLYMER_ABILITY_ID);
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
            UnitRemoveAbility(this.attachedTo.equippedTo, HIGH_QUALITY_POLYMER_ABILITY_ID);
        }
    };
}