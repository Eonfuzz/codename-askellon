import { Gun } from "../guns/gun";
import { Attachment } from "./attachment";
import { Log } from "../../../lib/serilog/serilog";
import { ABIL_ITEM_ATTACH_METEOR_CANISTER, ABIL_WEP_DIODE_EJ, ABIL_WEP_FLAMETHROWER } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { meteorCanisterTooltip } from "resources/ability-tooltips";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { GunItem } from "../guns/gun-item";
import { BURST_RIFLE_ABILITY_ID, SHOTGUN_ABILITY_ID } from "../weapon-constants";

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export class MeteorCanisterAttachment extends Attachment {

    name = "Meteor Canister"

    /**
     * Returns true if we did attach successfully
     */
    protected onAttach(weapon: GunItem, crewmember: Crewmember): boolean {
        if (weapon.getAbilityId() === BURST_RIFLE_ABILITY_ID || 
            weapon.getAbilityId() === SHOTGUN_ABILITY_ID|| 
            weapon.getAbilityId() === ABIL_WEP_FLAMETHROWER
        ) {
            if (weapon.equippedTo) {
                weapon.equippedTo.unit.addAbility(ABIL_ITEM_ATTACH_METEOR_CANISTER);
                TooltipEntity.getInstance().registerTooltip(crewmember, meteorCanisterTooltip);
                BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, ABIL_ITEM_ATTACH_METEOR_CANISTER, BlzGetAbilityCooldown(ABIL_ITEM_ATTACH_METEOR_CANISTER, 0));
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

    public onEquip(weapon: GunItem, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            weapon.equippedTo.unit.addAbility(ABIL_WEP_DIODE_EJ);
            TooltipEntity.getInstance().registerTooltip(crewmember, meteorCanisterTooltip);
            BlzStartUnitAbilityCooldown(weapon.equippedTo.unit.handle, ABIL_ITEM_ATTACH_METEOR_CANISTER, BlzGetAbilityCooldown(ABIL_ITEM_ATTACH_METEOR_CANISTER, 0));
        }
    }

    public onUnequip(weapon: GunItem, crewmember: Crewmember) {
        if (weapon &&  weapon.equippedTo) {
            weapon.equippedTo.unit.removeAbility(ABIL_WEP_DIODE_EJ);
            TooltipEntity.getInstance().unregisterTooltip(crewmember, meteorCanisterTooltip);
        }
    }
}