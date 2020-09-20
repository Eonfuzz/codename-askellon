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
            // Issue unit "Hold" order
            source.issueImmediateOrder(HOLD_ORDER_ID);
            EventEntity.send(EVENT_TYPE.SHIP_STARTS_MINING, { source: source, data: { target: interactable }});
        },
        onCancel: (source: Unit, interactable: Unit) => {
            EventEntity.send(EVENT_TYPE.SHIP_STOPS_MINING, { source: source, data: { target: interactable }});
        },
        onRefocus: (source: Unit, interactable: Unit) => {
            // Issue unit "Hold" order
            if (Vector2.fromWidget(source.handle).distanceTo(Vector2.fromWidget(interactable.handle)) <= this.getInteractionDistance(source, interactable))
                source.issueImmediateOrder(HOLD_ORDER_ID);
        },
        action: (source: Unit, interactable: Unit) => {
            // Set rock anim speed so it dies faster
            interactable.setTimeScale(1);
        }
    }
    
    Interactables.set(SPACE_UNIT_ASTEROID, asteroidInteraction);
    Interactables.set(SPACE_UNIT_MINERAL, asteroidInteraction);
}

// const miningShips = new Map<Unit,  boolean>();
// export function doMine(sfxPath: string, tickEvery: number, source: Unit, interactable: Unit) {
//     Timers.addTimedAction(tickEvery, () => {

//         if (!interactable.isAlive()) {
//             return;
//         }

//         const scale = interactable.selectionScale;

//         const sVec = vectorFromUnit(source.handle).applyPolarOffset(source.facing, 60);
//         const tVec = vectorFromUnit(interactable.handle);
//         tVec.x += GetRandomInt(-45, 45) * scale;
//         tVec.y += GetRandomInt(-45, 45) * scale;
//         const vecZ = getZFromXY(tVec.x, tVec.y) + GetRandomInt(-45, 45) * scale;
        
//         const lightning = 

//         UnitDamageTarget(source.handle, interactable.handle, 30, false, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);

//         const sfx = AddSpecialEffect(
//             sfxPath,
//             tVec.x,
//             tVec.y
//         );

//         const minerals = source.getItemInSlot(0);
//         const charges = GetItemCharges(minerals);
//         if (charges < 250) {
//             SetItemCharges(minerals, charges + 1);
//         }

//         BlzSetSpecialEffectZ(sfx, vecZ);
        

//         Timers.addTimedAction(0.1, () => {
//             DestroyEffect(sfx);
//             DestroyLightning(lightning);
//         });
//         if (miningShips.get(source) == true) doMine(sfxPath, tickEvery, source, interactable);
//     });
// }
