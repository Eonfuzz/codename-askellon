import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { Log } from "../../../lib/serilog/serilog";

/** @noSelfInFile **/

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export abstract class Attachment {

    protected attachedTo: Gun | undefined;
    protected item: item | undefined;
    protected itemId: number;
    public name: string = '';

    constructor(item: item) {
        this.item = item;
        this.itemId = GetItemTypeId(item);
    }

    /**
     * Returns true if it successfully equiped
     * @param weapon 
     */
    public attachTo(weapon: Gun): boolean {
        const canAttach = this.onAttach(weapon);
        if (canAttach) {
            if (weapon.equippedTo) {
                const sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", weapon.equippedTo.unit, 50);
            }
            const didAttach = weapon.attach(this);
            // Remove the item instance
            if (didAttach) {
                this.item && RemoveItem(this.item);
                this.item = undefined;
                this.attachedTo = weapon;
            }
            return didAttach;
        }
        return false;
    };

    /**
     * Unequips the attachment
     * returns true if unequip was successful
     */
    public unattach(): void {
        this.onDeattach();
        
        // Create a new item instance of the attached item
        // If we are attached to a unit, try to create it in their inventory
        if (this.attachedTo && this.attachedTo.equippedTo) {
            const unit = this.attachedTo.equippedTo.unit;
            const unitHasSpareItemSlot = UnitInventoryCount(unit) < UnitInventorySize(unit);

            const newItem = CreateItem(this.itemId, GetUnitX(unit), GetUnitY(unit));
            if (unitHasSpareItemSlot) UnitAddItem(unit, newItem);
        }

        // Now remove this attached info
        this.attachedTo = undefined;
    };

    /**
     * Returns true if we did attach successfully
     */
    protected abstract onAttach(weapon: Gun): boolean;

    /**
     * Removes this from the attached wepaon
     */
    protected abstract onDeattach(): void;

    /**
     * We are re-eqiupping a weapon with this attachment
     * @param weapon 
     */
    public abstract onEquip(weapon: Gun): void;

    /**
     * We are re-removing a weapon with this attachment
     * @param weapon 
     */
    public abstract onUnequip(weapon: Gun): void;
}