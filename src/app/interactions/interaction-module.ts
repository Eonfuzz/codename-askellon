/** @noSelfInFile **/
import { Game } from "../game";
import { InteractionEvent } from "./interaction-event";
import { Interactables, initElevators, initHatches, initWeaponsTerminals } from "./interaction-data";
import { SMART_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit, Timer } from "w3ts";
import { initShipInteractions, initAskellonInteractions } from "./ship-interactions";
import { initVendingInteraction } from "./vendor-interaction";
import { initCommandTerminal } from "./command-terminal";

export const UPDATE_PERIODICAL_INTERACTION = 0.03;

export class InteractionModule {
    game: Game;

    interactionBeginTrigger: Trigger;
    
    // interactionUpdateTrigger: Trigger;
    interactions: Array<InteractionEvent> = [];
    interactionTimer: Timer;

    constructor(game: Game) {
        this.game = game;

        this.interactionTimer = new Timer();

        // this.interactionUpdateTrigger = new Trigger();
        // this.interactionUpdateTrigger.registerTimerEvent(UPDATE_PERIODICAL_INTERACTION, true);
        // this.interactionUpdateTrigger.addAction(() => this.processInteractions(UPDATE_PERIODICAL_INTERACTION));

        // Now track when a user *might* start an interaction
        this.interactionBeginTrigger = new Trigger();
        this.interactionBeginTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        this.interactionBeginTrigger.addCondition(Condition(() => GetIssuedOrderId() === SMART_ORDER_ID));
        this.interactionBeginTrigger.addAction(() => this.beginInteraction());

        initElevators(game);
        initHatches(game);
        initWeaponsTerminals();
        initShipInteractions(game);
        initAskellonInteractions(game);
        initVendingInteraction(game);
        initCommandTerminal(game);
    }

    beginInteraction() {
        const trigUnit = Unit.fromHandle(GetTriggerUnit());
        const targetUnit = Unit.fromHandle(GetOrderTargetUnit());
        const targetUnitType = targetUnit.typeId;

        // First of all make sure we don't have one already
        const foundMatch = this.interactions.find(i => i.unit === trigUnit && i.targetUnit === targetUnit);
        if (foundMatch) return;

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

            if (this.interactions.length === 1) {
                this.interactionTimer.start(
                    UPDATE_PERIODICAL_INTERACTION, 
                    true, 
                    () => this.processInteractions(UPDATE_PERIODICAL_INTERACTION)
                );
            }
        }
    }

    processInteractions(delta: number) {
        this.interactions = this.interactions
            .filter(interaction => {
                const doDestroy = !interaction.process(delta);
                if (doDestroy) interaction.destroy();
                return !doDestroy;
            });
        if (this.interactions.length === 0) {
            this.interactionTimer.pause();
        }
    }
}