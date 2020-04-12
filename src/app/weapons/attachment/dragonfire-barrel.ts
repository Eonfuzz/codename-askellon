import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, SHOTGUN_ABILITY_ID, AT_ABILITY_DRAGONFIRE_BLAST } from "../weapon-constants";
/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class DragonfireBarrelAttachment extends Attachment {

    name = "Dragonfire Barrel"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID || 
            weapon.getAbilityId() === SHOTGUN_ABILITY_ID
        ) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(AT_ABILITY_DRAGONFIRE_BLAST);
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
            UnitRemoveAbility(this.attachedTo.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
        }
    };

    public onEquip(weapon: Gun) {
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
        }
    }

    public onUnequip(weapon: Gun) {
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
        }
    }
}