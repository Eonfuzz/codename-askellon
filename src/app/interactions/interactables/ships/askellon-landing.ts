import { InteractableData } from "../interactable-type";
import { Unit } from "w3ts/index";
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON } from "resources/unit-ids";
import { HOLD_ORDER_ID } from "resources/ability-ids";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { Interactables } from "../interactables";

export function initAskellonInteractions() {
    const interaction: InteractableData = {
        condition:  (source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        onStart: (source: Unit, interactable: Unit) => {
            // Issue unit "Hold" order
            source.issueImmediateOrder(HOLD_ORDER_ID);
        },
        onCancel: (source: Unit, interactable: Unit) => {
        },
        action: (source: Unit, interactable: Unit) => {
            EventEntity.getInstance().sendEvent(EVENT_TYPE.SHIP_LEAVES_SPACE, {
                source: source,
                data: {
                    goal: interactable
                }
            })
        }
    }

    Interactables.set(SHIP_MAIN_ASKELLON, interaction);
}
