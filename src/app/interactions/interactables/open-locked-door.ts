import { Unit } from "w3ts";
import { Interactables } from "./interactables";
import { InteractableData } from "./interactable-type";
import { UNIT_ID_MANSION_DOOR } from "resources/unit-ids";
import { SecurityEntity } from "app/station/security-module";

export const initOpenLockedDoor = () => {
    const unlockUnpoweredDoor: InteractableData = {
        getInteractionTime: (fromUnit: Unit, targetUnit: Unit) => {
            return 6;
        },
        condition: (fromUnit: Unit, targetUnit: Unit) => {
            const door = SecurityEntity.getInstance().findDoor(targetUnit);
            if (door && !door.isDead && !door.isOpen && !door.isLocked() && !door.isPowered) {
                return true;
            }
            return false;
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            const door = SecurityEntity.getInstance().findDoor(targetUnit);
            if (door && !door.isDead && !door.isLocked() && !door.isPowered) {
                door.update(true, true);
            }
        }
    }
    Interactables.set(UNIT_ID_MANSION_DOOR, unlockUnpoweredDoor);
}