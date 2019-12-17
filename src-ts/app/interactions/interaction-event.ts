/** @noSelfInFile **/
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { vectorFromUnit } from "../types/vector2";

export const INTERACT_MAXIMUM_DISTANCE = 300;
export const STUN_ID = FourCC('stun');
export const SLOW_ID = FourCC('slow');

export class InteractionEvent {
    private interactionTrigger: Trigger | undefined;

    private unit: unit;
    private targetUnit: unit;

    private callback: Function;

    private timeRemainingForAction: number;
  
    constructor(unit: unit, targetUnit: unit, interactTime: number, callback: Function) {
        this.unit = unit; 
        this.targetUnit = targetUnit;
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
        // If we've destroyed between ticks cancel and return false
        if (this.interactionTrigger && this.interactionTrigger.isDestroyed) return false;

        const v1 = vectorFromUnit(this.unit);
        const v2 = vectorFromUnit(this.targetUnit);

        // Only if we are at a valid distance do we process the interaction timer
        if (v1.subtract(v2).getLength() <= INTERACT_MAXIMUM_DISTANCE) {

            // alter the delta depending on buffs / debuffs
            if (UnitHasBuffBJ(this.unit, STUN_ID))
                delta = 0;
            // For now halve progress if the unit is slow
            else if (UnitHasBuffBJ(this.unit, SLOW_ID))
                delta = delta / 2;
            
            // Process delta time
            this.timeRemainingForAction -= delta;
            if (this.timeRemainingForAction <= 0) {
                this.onInteractionCompletion();
                return false;
            }
        }
        else {
            // Otherwise should we have interact time increase? Not sure
        }

        return true;
    }
  
    onCancel() {
      if (this.interactionTrigger) {
        this.interactionTrigger.destroy();
      }
    }
  
    onInteractionCompletion() {
      this.interactionTrigger = undefined;  
      this.callback();
    }
  }