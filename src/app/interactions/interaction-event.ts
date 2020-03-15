/** @noSelfInFile **/
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { vectorFromUnit } from "../types/vector2";
import { ProgressBar } from "../types/progress-bar";
import { Log } from "../../lib/serilog/serilog";
import { SMART_ORDER_ID } from "lib/order-ids";

export const INTERACT_MAXIMUM_DISTANCE = 350;
export const STUN_ID = FourCC('stun');
export const SLOW_ID = FourCC('slow');

export class InteractionEvent {
  public unit: unit;
  public targetUnit: unit;

  private interactionTrigger: Trigger | undefined;
  private callback: Function;
  private startCallback: Function;
  private cancelCallback: Function;

  private timeRequired: number;
  private timeRemaining: number;

  private progressBar: ProgressBar | undefined;

  constructor(unit: unit, targetUnit: unit, interactTime: number, callback: Function, startCallback: Function, cancelCallback: Function) {
    this.unit = unit;
    this.targetUnit = targetUnit;
    this.timeRequired = this.timeRemaining = interactTime;
    this.callback = callback;
    this.startCallback = startCallback;
    this.cancelCallback = cancelCallback;
    this.progressBar = new ProgressBar();
  }

  startInteraction() {
    this.interactionTrigger = new Trigger();
    this.interactionTrigger.RegisterUnitIssuedOrder(this.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
    this.interactionTrigger.RegisterUnitIssuedOrder(this.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
    this.interactionTrigger.RegisterUnitIssuedOrder(this.unit, EVENT_UNIT_ISSUED_ORDER);
    this.interactionTrigger.AddAction(() => {
      // Only destroy if it isn't targeting the same unit
      // Stops double click from cancelling the event
      if (GetIssuedOrderId() != SMART_ORDER_ID && GetOrderTargetUnit() != this.targetUnit) {
        this.destroy();
      }
    });
  }

  /**
   * returns false if this needs to be destroyed
   * @param delta 
   */
  process(delta: number): boolean {
    // If we've destroyed between ticks cancel and return false
    if (!this.interactionTrigger || this.interactionTrigger.isDestroyed) return false;

    const v1 = vectorFromUnit(this.unit);
    const v2 = vectorFromUnit(this.targetUnit);

    // Only if we are at a valid distance do we process the interaction timer
    if (v1.subtract(v2).getLength() <= INTERACT_MAXIMUM_DISTANCE) {
      if (this.timeRemaining === this.timeRequired) {
        // if this is the first tick show the progress bar
        this.progressBar && this.progressBar.show();
        this.startCallback();
      }

      // alter the delta depending on buffs / debuffs
      if (UnitHasBuffBJ(this.unit, STUN_ID))
        delta = 0;
      // For now halve progress if the unit is slow
      else if (UnitHasBuffBJ(this.unit, SLOW_ID))
        delta = delta / 2;

        // Process delta time
      this.timeRemaining -= delta;

      if (this.timeRemaining <= 0) {
        this.onInteractionCompletion();
        return false;
      }
    }
    else {
      // Otherwise should we have interact time increase? Not sure
    }

    // Now update progress bar
    this.progressBar && this.progressBar
      .moveTo(v1.x, v1.y, BlzGetUnitZ(this.unit) + 229)
      .setPercentage(1 - this.timeRemaining / this.timeRequired);

    return true;
  }

  onInteractionCompletion() {
    this.callback();
  }

  destroy() {
    this.interactionTrigger && this.interactionTrigger.destroy();
    this.progressBar && this.progressBar.destroy();
    this.interactionTrigger = undefined;
    this.cancelCallback();
  }
}