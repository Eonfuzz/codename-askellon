/** @noSelfInFile **/
import { Game } from "../game";
import { InteractionEvent } from "./interaction-event";
import { Interactables, initElevators, initHatches, initWeaponsTerminals } from "./interaction-data";
import { SMART_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit } from "w3ts";

export const UPDATE_PERIODICAL_INTERACTION = 0.03;

export class InteractionModule {
    game: Game;

    interactionBeginTrigger: Trigger;
    
    interactionUpdateTrigger: Trigger;
    interactions: Array<InteractionEvent> = [];

    constructor(game: Game) {
        this.game = game;

        this.interactionUpdateTrigger = new Trigger();
        this.interactionUpdateTrigger.registerTimerEvent(UPDATE_PERIODICAL_INTERACTION, true);
        this.interactionUpdateTrigger.addAction(() => this.processInteractions(UPDATE_PERIODICAL_INTERACTION));

        // Now track when a user *might* start an interaction
        this.interactionBeginTrigger = new Trigger();
        // TODO This event *may* need to become specific in the future for optimisation
        this.interactionBeginTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        // TODO Do we care about this unit interaction?
        this.interactionBeginTrigger.addCondition(Condition(() => {
            return GetIssuedOrderId() === SMART_ORDER_ID;
        }));
        this.interactionBeginTrigger.addAction(() => {
            const trigUnit = Unit.fromHandle(GetTriggerUnit());
            const targetUnit = Unit.fromHandle(GetOrderTargetUnit());
            const targetUnitType = targetUnit.typeId;

            // First of all make sure we don't have one already
            if (this.interactions.filter(i => i.unit === trigUnit && i.targetUnit === targetUnit).length > 0) return;

            // Check to see if we have it in our interactable data
            const interact = Interactables.has(targetUnitType) && Interactables.get(targetUnitType);

            if (interact && (!interact.condition || interact.condition(this, trigUnit, targetUnit))) {
                const newInteraction = new InteractionEvent(GetTriggerUnit(), GetOrderTargetUnit(), 1.5, 
                    () => interact.action(this, trigUnit, targetUnit),
                    () => interact.onStart && interact.onStart(this, trigUnit, targetUnit),
                    () => interact.onCancel && interact.onCancel(this, trigUnit, targetUnit)
                );
                newInteraction.startInteraction();
                this.interactions.push(newInteraction);
            }
        });

        initElevators(game);
        initHatches(game);
        initWeaponsTerminals();
    }

    processInteractions(delta: number) {
        this.interactions = this.interactions
            .filter(interaction => {
                const doDestroy = !interaction.process(delta);
                if (doDestroy) interaction.destroy();
                return !doDestroy;
            });
    }
}