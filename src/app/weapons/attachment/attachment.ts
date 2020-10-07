import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { Log } from "../../../lib/serilog/serilog";
import { Item } from "w3ts/handles/item";
import { Game } from "app/game";
import { GunItem } from "../guns/gun-item";
import { ArmableUnitWithItem } from "../guns/unit-has-weapon";

/** @noSelfInFile **/

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export abstract class Attachment {
    public game: Game;

    protected attachedTo: GunItem | undefined;
    protected item: item | undefined;
    protected itemId: number;
    public name: string = '';

    constructor(game: Game, item: item) {
        this.item = item;
        this.itemId = GetItemTypeId(item);
        this.game = game;
    }

    /**
     * Returns true if it successfully equiped
     * @param weapon 
     */
    public attachTo(weapon: GunItem, unit: ArmableUnitWithItem): boolean {
        const canAttach = this.onAttach(weapon, unit);
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
            const unitHasSpareItemSlot = UnitInventoryCount(unit.handle) < UnitInventorySize(unit.handle);

            const newItem = CreateItem(this.itemId, unit.x, unit.y);
            if (unitHasSpareItemSlot) unit.addItem(Item.fromHandle(newItem));
        }

        // Now remove this attached info
        this.attachedTo = undefined;
    };

    /**
     * Returns true if we did attach successfully
     */
    protected abstract onAttach(weapon: GunItem, unit: ArmableUnitWithItem): boolean;

    /**
     * Removes this from the attached wepaon
     */
    protected abstract onDeattach(): void;

    /**
     * We are re-eqiupping a weapon with this attachment
     * @param weapon 
     */
    public abstract onEquip(weapon: GunItem, unit: ArmableUnitWithItem): void;

    /**
     * We are re-removing a weapon with this attachment
     * @param weapon 
     */
    public abstract onUnequip(weapon: GunItem, crewmember: Crewmember): void;
}