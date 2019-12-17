/** @noSelfInFile **/
import { Game } from "../game";
import { InteractionEvent } from "./interaction-event";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";

export const UPDATE_PERIODICAL_INTERACTION = 0.03;
export const SMART_ORDER_ID = 851971;

export class InteractionModule {
    game: Game;

    interactionBeginTrigger: Trigger;
    
    interactionUpdateTrigger: Trigger;
    interactions: Array<InteractionEvent> = [];

    constructor(game: Game) {
        this.game = game;

        this.interactionUpdateTrigger = new Trigger();
        this.interactionUpdateTrigger.RegisterTimerEventPeriodic(UPDATE_PERIODICAL_INTERACTION);
        this.interactionUpdateTrigger.AddAction(() => this.processInteractions(UPDATE_PERIODICAL_INTERACTION));

        // Now track when a user *might* start an interaction
        this.interactionBeginTrigger = new Trigger();
        // TODO This event *may* need to become specific in the future for optimisation
        this.interactionBeginTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        // TODO Do we care about this unit interaction?
        this.interactionBeginTrigger.AddCondition(() => {
            return GetIssuedOrderId() === SMART_ORDER_ID
        });
        this.interactionBeginTrigger.AddAction(() => {
            const newInteraction = new InteractionEvent(GetTriggerUnit(), GetOrderTargetUnit(), 1.5, () => {
                Log.Information("Unit finished interaction!");
            });
            newInteraction.startInteraction();
            this.interactions.push(newInteraction);
        });
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