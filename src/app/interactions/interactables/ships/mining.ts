import { InteractableData } from "../interactable-type";
import { Unit } from "w3ts/index";
import { SHIP_VOYAGER_UNIT, SPACE_UNIT_MINERAL, SPACE_UNIT_ASTEROID } from "resources/unit-ids";
import { TECH_MAJOR_VOID, HOLD_ORDER_ID } from "resources/ability-ids";
import { ResearchFactory } from "app/research/research-factory";
import { Interactables } from "../interactables";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Vector2 } from "app/types/vector2";

/**
 * Yes, mining is counted as an interaction
 */
export function InitMiningInteraction() {
    
    const asteroidInteraction: InteractableData = {
        hideInteractionBar: true,
        condition:  (source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        getInteractionTime:  (source: Unit, interactable: Unit) => {
            // Takes time based on asteroids remaining HP
            if (ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3)
                return interactable.life / 100 + 0.3;
            return interactable.life / 50 + 0.6;
        },
        getInteractionDistance:  (source: Unit, interactable: Unit) => {
            if (ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 2) {
                return 800 * 1.33;
            }
            return 800;
        },
        onStart: (source: Unit, interactable: Unit) => {
            EventEntity.send(EVENT_TYPE.SHIP_STARTS_MINING, { source: source, data: { target: interactable }});
        },
        onCancel: (source: Unit, interactable: Unit) => {
            EventEntity.send(EVENT_TYPE.SHIP_STOPS_MINING, { source: source, data: { target: interactable }});
        },
        onRefocus: (source: Unit, interactable: Unit) => {
            if (Vector2.fromWidget(source.handle).distanceTo(Vector2.fromWidget(interactable.handle)) <= this.getInteractionDistance(source, interactable))
                EventEntity.send(EVENT_TYPE.SHIP_STARTS_MINING, { source: source, data: { target: interactable }});
        },
        action: (source: Unit, interactable: Unit) => {
            // Set rock anim speed so it dies faster
            interactable.setTimeScale(1);
        }
    }
    
    Interactables.set(SPACE_UNIT_ASTEROID, asteroidInteraction);
    Interactables.set(SPACE_UNIT_MINERAL, asteroidInteraction);
}