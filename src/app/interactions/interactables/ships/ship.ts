import { Unit, Timer } from "w3ts";
import { TECH_MAJOR_VOID, HOLD_ORDER_ID } from "resources/ability-ids";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { SoundWithCooldown, SoundRef } from "app/types/sound-ref";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { InteractableData } from "../interactable-type";
import { COL_ATTATCH, COL_PINK } from "resources/colours";
import { Interactables } from "../interactables";

// Interacting with asteroids
const noInventorySpace = new SoundRef("Sounds\\DeniedBeep.mp3", false, true);

export function initShipInteractions() {
    const interaction: InteractableData = {
        condition:  (source: Unit, interactable: Unit) => {

            if (source.typeId === SHIP_VOYAGER_UNIT) {
                return false;
            }
            // Make sure ships can't fly ships, lol.
            return true;
        },
        onStart: (source: Unit, interactable: Unit) => {
        },
        onCancel: (source: Unit, interactable: Unit) => {
        },
        action: (source: Unit, interactable: Unit) => {
            if (GetPlayerTechCount(source.owner.handle, TECH_MAJOR_VOID, true) === 0) {
                DisplayTimedTextToPlayer(source.owner.handle, 0, 0, 5, `${COL_ATTATCH}ACCESS DENIED|R ${COL_PINK}Void Delving I|r required`);
                if (source.owner.handle === GetLocalPlayer()) {
                    noInventorySpace.playSound();
                }
                return false;
            }
            EventEntity.getInstance().sendEvent(EVENT_TYPE.ENTER_SHIP, {
                source: source,
                data: {
                    ship: interactable
                }
            })
        }
    }

    Interactables.set(SHIP_VOYAGER_UNIT, interaction);
}
