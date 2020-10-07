import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { BURST_RIFLE_ABILITY_ID, SHOTGUN_ABILITY_ID, AT_ABILITY_DRAGONFIRE_BLAST } from "../weapon-constants";
import { Crewmember } from "app/crewmember/crewmember-type";
import { dragonBreathBlastTooltip } from "resources/ability-tooltips";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { GunItem } from "../guns/gun-item";
/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class DragonfireBarrelAttachment extends Attachment {

    name = "Dragonfire Barrel"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: GunItem, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID || 
            weapon.getAbilityId() === SHOTGUN_ABILITY_ID
        ) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(AT_ABILITY_DRAGONFIRE_BLAST);
                BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST, BlzGetAbilityCooldown(AT_ABILITY_DRAGONFIRE_BLAST, 0));

                TooltipEntity.getInstance().registerTooltip(
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
            TooltipEntity.getInstance().unregisterTooltip(
                CrewFactory.getInstance().getCrewmemberForUnit(this.attachedTo.equippedTo.unit) as Crewmember, 
                dragonBreathBlastTooltip
            );
        }
    };

    public onEquip(weapon: GunItem, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitAddAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
            BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST, BlzGetAbilityCooldown(AT_ABILITY_DRAGONFIRE_BLAST, 0));

            // Add ability tooltip
            TooltipEntity.getInstance().registerTooltip(crewmember, dragonBreathBlastTooltip);
        }
    }

    public onUnequip(weapon: GunItem, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            UnitRemoveAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST);
            // Add ability tooltip
            TooltipEntity.getInstance().unregisterTooltip(crewmember, dragonBreathBlastTooltip);
        }
    }
}