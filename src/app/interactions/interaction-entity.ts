import { InteractionEvent } from "./interaction-event";
import { initElevators, initHatches } from "./interactables/elevator";
import { SMART_ORDER_ID, MOVE_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit, Timer } from "w3ts";
import { initVendingInteraction } from "./interactables/vendor";
import { Log } from "lib/serilog/serilog";
import { Entity } from "app/entity-type";
import { Interactables } from "./interactables/interactables";
import { Hooks } from "lib/Hooks";
import { InitMiningInteraction } from "./interactables/ships/mining";
import { initShipInteractions } from "./interactables/ships/ship";
import { initAskellonInteractions } from "./interactables/ships/askellon-landing";
import { GameTimeElapsed } from "app/types/game-time-elapsed";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { initInteractionTerminals } from "./interactables/terminals";
import { initTesterInteractions } from "./interactables/genetic-testing-facility";
import { initPlanetLandingInteraction } from "./interactables/ships/planet-landing";
import { SmartTrigger } from "lib/SmartTrigger";
import { intAltarInteraction } from "./interactables/cathederal-altar";

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

    private unitInteractionTimeStamp = new Map<Unit, number>();

    constructor() {
        super();

        // Now track when a user *might* start an interaction
        this.interactionBeginTrigger = new SmartTrigger();
        this.interactionBeginTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        this.interactionBeginTrigger.addCondition(Condition(() => {
            const oId = GetIssuedOrderId();
            return oId === SMART_ORDER_ID || oId === MOVE_ORDER_ID;
        }));
        this.interactionBeginTrigger.addAction(() => this.beginInteraction());

        // Listen to unit removal
        EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, (self, ev) => {
            if (this.unitInteractionTimeStamp.has(ev.source)) {
                this.unitInteractionTimeStamp.delete(ev.source);
            }
        }));

        try {
            initElevators();
            initHatches();
            initInteractionTerminals();
            initVendingInteraction();

            initTesterInteractions();
            intAltarInteraction();
            
            // Ship interactions
            InitMiningInteraction();
            initShipInteractions();
            initAskellonInteractions();
            initPlanetLandingInteraction();
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

        // Check our cooldown
        if (!this.checkCooldown(trigUnit)) return;// Log.Information("Interace cooldown!");

        // Check to see if we have it in our interactable data
        const interact = Interactables.has(targetUnitType) && Interactables.get(targetUnitType);

        if (interact && (!interact.condition || interact.condition(trigUnit, targetUnit))) {
            const interactionTime = interact.getInteractionTime !== undefined
                ? interact.getInteractionTime(trigUnit, targetUnit) : 1.3;
            const interactionDistance = interact.getInteractionDistance !== undefined
                ? interact.getInteractionDistance(trigUnit, targetUnit) : 350;

            const newInteraction = new InteractionEvent(
                GetTriggerUnit(), 
                GetOrderTargetUnit(), 
                interactionTime * (1 + 1 * (1 - trigUnit.life/trigUnit.maxLife)),
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
                // And interact is complete, log it in cooldown
                if (interaction.isComplete)
                    this.setInteractTimeStamp(interaction.unit);

                this.interactions[i].destroy();
                this.interactions[i] = this.interactions[ this.interactions.length - 1];
                delete this.interactions[this.interactions.length - 1];
            }
        }
    }

    private checkCooldown(who: Unit) {
        const ourGameTime = GameTimeElapsed.getTime();
        const lastInteraction = this.unitInteractionTimeStamp.get(who) || 0;

        return (ourGameTime - lastInteraction) >= 3;
    }

    private setInteractTimeStamp(who: Unit) {
        if (PlayerStateFactory.isAlienAI(who.owner)) return;
        
        const ourGameTime = GameTimeElapsed.getTime();
        this.unitInteractionTimeStamp.set(who, ourGameTime);
    }
}