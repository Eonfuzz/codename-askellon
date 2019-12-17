/** @noSelfInFile **/
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";

export class InteractionEvent {
    private interactionTrigger: Trigger | undefined;
    private unit: unit;
    private callback: Function;

    private timeRemainingForAction: number;
  
    constructor(unit: unit, interactTime: number, callback: Function) {
        this.unit = unit; 
        this.timeRemainingForAction = interactTime;
        this.callback = callback;
    }
  
    startInteraction() {
      this.interactionTrigger = new Trigger();
      this.interactionTrigger.RegisterUnitIssuedOrder(this.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
      this.interactionTrigger.AddCondition(() => GetIssuedOrderId() === FourCC('smart'));
      this.interactionTrigger.AddAction(() => { this.onCancel(); });
    }

    /**
     * returns false if this needs to be destroyed
     * @param delta 
     */
    process(delta: number) : boolean {
        if (this.interactionTrigger && this.interactionTrigger.isDestroyed) {
            return false;
        }

        this.timeRemainingForAction -= delta;
        if (this.timeRemainingForAction) {
            this.onInteractionCompletion();
            return false;
        }
        return true;
    }
  
    onCancel() {
      if (this.interactionTrigger) {
        this.interactionTrigger.destroy();
      }
    }
  
    onInteractionCompletion() {
      const didComplete = this.interactionTrigger && !this.interactionTrigger.isDestroyed;
      this.interactionTrigger = undefined;  
      if (didComplete) this.callback();
    }
  }