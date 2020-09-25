import { InteractionEvent } from "./interaction-event";
import { initElevators, initHatches, initWeaponsTerminals } from "./interactables/elevator";
import { SMART_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit, Timer } from "w3ts";
import { initVendingInteraction } from "./interactables/vendor";
import { Log } from "lib/serilog/serilog";
import { initTesterInteractions } from "./interactables/genetic-tester";
import { Entity } from "app/entity-type";
import { Interactables } from "./interactables/interactables";
import { Hooks } from "lib/Hooks";
import { InitMiningInteraction } from "./interactables/ships/mining";
import { initShipInteractions } from "./interactables/ships/ship";
import { initAskellonInteractions } from "./interactables/ships/askellon-landing";

export const UPDATE_PERIODICAL_INTERACTION = 0.03;

export class InteractionEntity extends Entity {
    private static instance: InteractionEntity;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new InteractionEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private interactionBeginTrigger: Trigger;
    private interactions: Array<InteractionEvent> = [];

    constructor() {
        super();

        // Now track when a user *might* start an interaction
        this.interactionBeginTrigger = new Trigger();
        this.interactionBeginTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        this.interactionBeginTrigger.addCondition(Condition(() => GetIssuedOrderId() === SMART_ORDER_ID));
        this.interactionBeginTrigger.addAction(() => this.beginInteraction());

        try {
            initElevators();
            initHatches();
            initWeaponsTerminals();
            initVendingInteraction();
            initTesterInteractions();

            // Ship interactions
            InitMiningInteraction();
            initShipInteractions();
            initAskellonInteractions();
        }
        catch (e) {
            Log.Error("Failed setting up interactables");
            Log.Error(e);
        }
    }

    beginInteraction() {
        const trigUnit = Unit.fromHandle(GetTriggerUnit());
        const targetUnit = Unit.fromHandle(GetOrderTargetUnit());
        const targetUnitType = targetUnit.typeId;

        // Log.Information("BEING INTERACT TRACKING");

        // First of all make sure we don't have one already
        const foundMatch = this.interactions.find(i => i.unit === trigUnit && i.targetUnit === targetUnit);
        if (foundMatch) {
            return;
        }

        // Check to see if we have it in our interactable data
        const interact = Interactables.has(targetUnitType) && Interactables.get(targetUnitType);

        if (interact && (!interact.condition || interact.condition(trigUnit, targetUnit))) {
            const interactionTime = interact.getInteractionTime !== undefined
                ? interact.getInteractionTime(trigUnit, targetUnit) : 1.5;
            const interactionDistance = interact.getInteractionDistance !== undefined
                ? interact.getInteractionDistance(trigUnit, targetUnit) : 350;

            const newInteraction = new InteractionEvent(
                GetTriggerUnit(), 
                GetOrderTargetUnit(), 
                interactionTime,
                interactionDistance,
                interact,
                GetPlayerController(trigUnit.owner.handle) ===  MAP_CONTROL_COMPUTER ? false : !interact.hideInteractionBar
            );
            newInteraction.startInteraction();
            this.interactions.push(newInteraction);
        }
    }

    step() {
        let i = 0;
        while (i < this.interactions.length) {
            const interaction = this.interactions[i];
            if (interaction.process(this._timerDelay)) {
                i ++;
            }
            else {
                this.interactions[i].destroy();
                this.interactions[i] = this.interactions[ this.interactions.length - 1];
                delete this.interactions[this.interactions.length - 1];
            }
        }
    }
}