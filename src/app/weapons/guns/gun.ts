/** @noSelfInFile **/
import { Vector3 } from "../../types/vector3";
import { Crewmember } from "../../crewmember/crewmember-type";
import { WeaponModule } from "../weapon-module";
import { Attachment } from "../attachment/attachment";
import { ArmableUnit } from "./unit-has-weapon";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { Log } from "../../../lib/serilog/serilog";
import { TECH_CREWMEMBER_ATTACK_ENABLE } from "../../../resources/ability-ids";

export abstract class Gun {
    item: item;
    equippedTo: ArmableUnit | undefined;

    attachment: Attachment | undefined;
    remainingCooldown: number | undefined;

    protected spreadAOE: number = 0;
    protected bulletDistance = 1200;

    public name = "default";

    constructor(item: item, equippedTo: ArmableUnit) {
        this.item = item;
        this.equippedTo = equippedTo;
    }
    
    public onAdd(weaponModule: WeaponModule, caster: Crewmember) {
        this.equippedTo = caster;
        this.equippedTo.onWeaponAdd(weaponModule, this);

        weaponModule.unitsWithWeapon.set(caster.unit.handle, this);


        // Always update the tooltip
        this.updateTooltip(weaponModule, caster);
        // Enable the attack UI
        SetPlayerTechResearched(caster.player.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 1);

        // Cast mode adds the ability
        if (weaponModule.WEAPON_MODE === 'CAST') {
            caster.unit.addAbility(this.getAbilityId());
        }
        // If we are in attack mode let the user attack
        else {
            UnitRemoveAbility(this.equippedTo.unit.handle, FourCC('Abun'));
        }
        
        const sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", caster.unit, 50);

        // If we have an attachment make sure it's added to the unit
        if (this.attachment) {
            this.attachment.onEquip(this, caster);
        }
        
        if (this.remainingCooldown && this.remainingCooldown > 0) {
            // SetAbilityCooldown
            print("Reforged better add a way to set cooldowns remaining");
        }
    }

    public onRemove(weaponModule: WeaponModule) {
        if (this.equippedTo) {

            weaponModule.unitsWithWeapon.delete(this.equippedTo.unit.handle);

            // Don't care about the mode, always remove cast ability
            this.equippedTo.unit.removeAbility(this.getAbilityId());
            // Don't care about mode, always disable attack ui
            SetPlayerTechResearched(this.equippedTo.unit.owner.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 0);

            // If we are cast mode set this remaning cooldown
            if (weaponModule.WEAPON_MODE === 'CAST') {
                this.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(this.equippedTo.unit.handle, this.getAbilityId());
            }
            else {
                UnitAddAbility(this.equippedTo.unit.handle, FourCC('Abun'));
            }

            this.equippedTo.onWeaponRemove(weaponModule, this);
            // Handle no crewmember?
            if (this.attachment) this.attachment.onUnequip(this, weaponModule.game.crewModule.getCrewmemberForUnit(this.equippedTo.unit) as Crewmember);
            this.equippedTo = undefined;
        }
    }

    public updateTooltip(weaponModule: WeaponModule, caster: Crewmember) {
        // Update the item tooltip
        const itemTooltip = this.getItemTooltip(weaponModule, caster);
        BlzSetItemExtendedTooltip(this.item, itemTooltip);

        if (this.equippedTo) {
            const owner = this.equippedTo.unit.owner;

            // Update the equip tooltip
            const newTooltip = this.getTooltip(weaponModule, caster);
            if (GetLocalPlayer() === owner.handle) {
                BlzSetAbilityExtendedTooltip(this.getAbilityId(), newTooltip, 0);
            }

            // Also update our weapon stats
            this.applyWeaponAttackValues(weaponModule, caster);
        }
    }

    protected abstract getTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string;
    protected abstract getItemTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string;
    protected abstract applyWeaponAttackValues(weaponModule: WeaponModule, caster: Crewmember): void;

    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        this.remainingCooldown = weaponModule.game.getTimeStamp();
    }

    abstract getDamage(weaponModule: WeaponModule, caster: Crewmember): number;


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

    protected getStrayValue(caster: Crewmember) {
        // Accuracy is some number, starting at 100
        const accuracy = caster.getAccuracy();
        // Make accuracy exponentially effect the weapon
        const accuracyModifier = Pow(100-accuracy, 2) * (accuracy > 0 ? -1 : 1);
        return accuracyModifier;
    }

    protected getStrayLocation(originalLocation: Vector3, caster: Crewmember): Vector3 {
        const accuracyModifier = this.getStrayValue(caster);

        // Minimum distance for the shot
        const minLength = 0;
        // Maximum distance for stray shots
        // Accuracy is exponentially good / bad
        const maxLength = this.spreadAOE + accuracyModifier / 2;

        // The maximimum possible spread for the shot
        const angleSpread = Math.min(30 + accuracyModifier / 40, 10);

        // Get the angle back towards the caster
        const dX = caster.unit.x - originalLocation.x;
        const dY = caster.unit.y - originalLocation.y;
        const thetaRadians = Atan2(dY, dX);

        // Project the point with a random distance
        let newLocation = originalLocation.projectTowards2D( 
            Rad2Deg(thetaRadians) * GetRandomReal(-angleSpread, angleSpread), 
            GetRandomInt(MathRound(minLength), MathRound(maxLength))
        );

        return newLocation;
    }
}
