import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, SHOTGUN_ABILITY_ID, AT_ABILITY_DRAGONFIRE_BLAST } from "../weapon-constants";
import { Crewmember } from "app/crewmember/crewmember-type";
import { dragonBreathBlastTooltip } from "resources/ability-tooltips";
/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class DragonfireBarrelAttachment extends Attachment {

    name = "Dragonfire Barrel"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: Gun, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID || 
            weapon.getAbilityId() === SHOTGUN_ABILITY_ID
        ) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(AT_ABILITY_DRAGONFIRE_BLAST);

                this.game.tooltips.registerTooltip(
                    crewmember, 
                    dragonBreathBlastTooltip
                );
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
            // Add ability tooltip TODO handle no crewmember?
            this.game.tooltips.unregisterTooltip(
                this.game.crewModule.getCrewmemberForUnit(this.attachedTo.equippedTo.unit) as Crewmember, 
                dragonBreathBlastTooltip
            );
        }
    };

    public onEquip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
            // Add ability tooltip
            this.game.tooltips.registerTooltip(crewmember, dragonBreathBlastTooltip);
        }
    }

    public onUnequip(weapon: Gun, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
            // Add ability tooltip
            this.game.tooltips.unregisterTooltip(crewmember, dragonBreathBlastTooltip);
        }
    }
}