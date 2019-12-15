import { Crewmember } from "../../crewmember/crewmember-type";
import { Gun } from "../guns/gun";

/** @noSelfInFile **/

/**
 * It attaches to a gun, generally supplies an ability to the weapon
 */
export abstract class Attachment {

    private attachedTo: Gun | undefined;

    /**
     * Returns true if it successfully equiped
     * @param weapon 
     */
    public equipTo(weapon: Gun): boolean {
        const canAttach = this.onAttach(weapon);

        if (canAttach) {
            return weapon.attach(this);
        }
        return false;
    };

    /**
     * Unequips the attachment
     * returns true if unequip was successful
     */
    public unequip(): void {
        this.onDeattach();
        this.attachedTo = undefined;
    };

    /**
     * Gets the tooltip for the attachment
     * @param weapon 
     */
    public abstract getTooltip(weapon: Gun): string;

    /**
     * Returns true if we did attach successfully
     */
    protected abstract onAttach(weapon: Gun): boolean;

    /**
     * Removes this from the attached wepaon
     */
    protected abstract onDeattach(): void;
}