import { Crewmember } from "../../crewmember/crewmember-type";
import { Attachment } from "../attachment/attachment";
import { ArmableUnit, ArmableUnitWithItem } from "./unit-has-weapon";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { WeaponEntityAttackType } from "../weapon-attack-type";
import { Gun } from "./gun";
import { Unit } from "w3ts/index";

export abstract class GunItem extends Gun {
    item: item;
    attachment: Attachment | undefined;
    equippedTo: ArmableUnitWithItem;

    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(equippedTo);
        this.item = item;
    }
        
    public updateTooltip(caster: Unit) {
        // Update the item tooltip
        const itemTooltip = this.getItemTooltip(caster);
        BlzSetItemExtendedTooltip(this.item, itemTooltip);

        if (this.equippedTo) {
            const owner = this.equippedTo.unit.owner;

            // Update the equip tooltip
            const newTooltip = this.getTooltip(caster);
            if (GetLocalPlayer() === owner.handle) {
                BlzSetAbilityExtendedTooltip(this.getAbilityId(), newTooltip, 0);
            }

            // Also update our weapon stats
            this.applyWeaponAttackValues(caster);
        }
    }
    public onAdd(caster: ArmableUnitWithItem) {
        super.onAdd(caster);
        
        const weaponMode = PlayerStateFactory.get(caster.unit.owner).getAttackType();
        if (weaponMode === WeaponEntityAttackType.CAST) {
            caster.unit.addAbility(this.getAbilityId());
            BlzStartUnitAbilityCooldown(
                this.equippedTo.unit.handle, 
                this.getAbilityId(), 
                BlzGetAbilityCooldown(this.getAbilityId(), 0)
            );
            // Need to update the tooltip
            this.updateTooltip(caster.unit);
        }
        // If we are in attack mode let the user attack
        else {
            UnitRemoveAbility(this.equippedTo.unit.handle, FourCC('Abun'));
        }

        // If we have an attachment make sure it's added to the unit
        if (this.attachment) {
            this.attachment.onEquip(this, caster);
        }
    }

    public onRemove() {
        const u = this.equippedTo;
        
        // Don't care about the mode, always remove cast ability
        u.unit.removeAbility(this.getAbilityId());
        if (this.attachment) this.attachment.onUnequip(this, CrewFactory.getInstance().getCrewmemberForUnit(u.unit) as Crewmember);
        
        super.onRemove();
    }

    protected abstract getTooltip(crewmember: Unit): string;
    protected abstract getItemTooltip(crewmember: Unit): string;
    protected abstract applyWeaponAttackValues(caster: Unit): void;

    public attach(attachment: Attachment): boolean {
        if (this.attachment) {
            this.detach();
        }
        this.attachment = attachment;
        return true;
    }

    public detach() {
        if (this.attachment) {
            this.attachment.unattach();
            this.attachment = undefined;
        }
    }

    abstract getAbilityId(): number;
    abstract getItemId(): number;


    protected getDamageBonusMult(): number {
        if (this.equippedTo) {
            const crew = PlayerStateFactory.getCrewmember(this.equippedTo.unit.owner);
            if (crew) return crew.getDamageBonusMult();
        }
        return 1;
    }
}
