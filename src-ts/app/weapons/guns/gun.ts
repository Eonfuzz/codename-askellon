/** @noSelfInFile **/
import { Vector3 } from "../../types/vector3";
import { Crewmember } from "../../crewmember/crewmember-type";
import { WeaponModule } from "../weapon-module";
import { Attachment } from "../attachment/attachment";

export abstract class Gun {
    item: item;
    equippedTo: unit | undefined;

    attachment: Attachment | undefined;
    remainingCooldown: number | undefined;

    constructor(item: item, equippedTo: unit) {
        this.item = item;
        this.equippedTo = equippedTo;
    }
    
    public onAdd(weaponModule: WeaponModule, caster: Crewmember) {
        this.equippedTo = caster.unit;
        UnitAddAbility(caster.unit, this.getAbilityId());
        this.updateTooltip(weaponModule, caster);

        if (this.remainingCooldown && this.remainingCooldown > 0) {
            // SetAbilityCooldown
            print("Reforged better add a way to set cooldowns remaining");
        }
    };
    public onRemove(weaponModule: WeaponModule) {
        if (this.equippedTo) {
            UnitRemoveAbility(this.equippedTo, this.getAbilityId());
            this.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(this.equippedTo, this.getAbilityId());
            this.equippedTo = undefined;
        }
    };

    public updateTooltip(weaponModule: WeaponModule, caster: Crewmember) {
        if (this.equippedTo) {
            const owner = GetOwningPlayer(this.equippedTo);
            const newTooltip = this.getTooltip(weaponModule, caster);
            if (GetLocalPlayer() === owner) {
                BlzSetAbilityExtendedTooltip(this.getAbilityId(), newTooltip, 0);
            }
        }
    };
    protected abstract getTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string;

    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        this.remainingCooldown = weaponModule.game.getTimeStamp();
    }
    abstract getDamage(weaponModule: WeaponModule, caster: Crewmember): number;


    public attach(attachment: Attachment): boolean {
        this.attachment = this.attachment;
        return true;
    }

    abstract getAbilityId(): number;
    abstract getItemId(): number;
}
