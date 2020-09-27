/** @noSelfInFile **/
import { Game } from "../game";
import { Trigger, Unit } from "w3ts";
import { vectorFromUnit } from "../types/vector2";
import { ProgressBar } from "../types/progress-bar";
import { SMART_ORDER_ID, HOLD_ORDER_ID } from "resources/ability-ids";
import { WORM_ALIEN_FORM } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";
import { InteractableData } from "./interactables/interactable-type";

export const STUN_ID = FourCC('stun');
export const SLOW_ID = FourCC('slow');


export class InteractionEvent {
  public unit: Unit;
  public targetUnit: Unit;

  private interactionTrigger: Trigger | undefined;
  private interactable: InteractableData;

  private timeRequired: number;
  private timeRemaining: number;

  private progressBar: ProgressBar | undefined;

  private interactDistance: number;
  private showProgressBar: boolean = true;

  constructor(
    unit: unit, 
    targetUnit: unit, 
    interactTime: number, 
    interactDistance: number, 
    interactable: InteractableData,
    showProgressBar: boolean
  ) {
    this.unit = Unit.fromHandle(unit);
    this.targetUnit = Unit.fromHandle(targetUnit);
    this.timeRequired = this.timeRemaining = interactTime;

    this.interactable = interactable;
    this.interactDistance = interactDistance;
    this.showProgressBar = showProgressBar;

    if (this.showProgressBar) {
      this.progressBar = new ProgressBar();
    }
  }

  startInteraction() {
    this.interactionTrigger = new Trigger();
    this.interactionTrigger.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
    this.interactionTrigger.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
    this.interactionTrigger.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_ORDER);
    this.interactionTrigger.addAction(() => {
      // Only destroy if it isn't targeting the same unit
      // Stops double click from cancelling the event
      const o = GetIssuedOrderId();
      // Ignore this if trigger unit is ship and stop is issued
      if (o === HOLD_ORDER_ID) return;

      if (o === SMART_ORDER_ID && GetOrderTargetUnit() === this.targetUnit.handle) {
        // if (!this.interactable.condition || this.interactable.condition(this.unit, this.targetUnit))
          this.interactable.onRefocus && this.interactable.onRefocus(this.unit, this.targetUnit);
      }
      else if (o !== SMART_ORDER_ID || GetOrderTargetUnit() !== this.targetUnit.handle) {
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
    if (!this.interactionTrigger || !this.interactionTrigger.enabled) return false;

    const v1 = vectorFromUnit(this.unit.handle);
    const v2 = vectorFromUnit(this.targetUnit.handle);

    // Only if we are at a valid distance do we process the interaction timer
    if (v1.subtract(v2).getLength() <= this.interactDistance) {
      if (this.timeRemaining === this.timeRequired) {
        // if this is the first tick show the progress bar
        if (this.progressBar) {
          this.progressBar.show(this.unit.owner.handle);
          // Set progress bar speed based on anim time
          BlzSetSpecialEffectTimeScale(this.progressBar.bar, 1 / this.timeRequired);
        }
        this.interactable.onStart && this.interactable.onStart(this.unit, this.targetUnit);
        // this.startCallback();
      }

      // alter the delta depending on buffs / debuffs
      if (UnitHasBuffBJ(this.unit.handle, STUN_ID))
        delta = 0;
      // For now halve progress if the unit is slow
      else if (UnitHasBuffBJ(this.unit.handle, SLOW_ID))
        delta = delta / 2;
      else if (this.unit.typeId === WORM_ALIEN_FORM)
        delta = delta * 1.2;

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
      .moveTo(v1.x, v1.y, this.unit.z + 229)
      .setPercentage(1 - this.timeRemaining / this.timeRequired);

    return true;
  }

  onInteractionCompletion() {
    // this.callback();
    this.interactable.action(this.unit, this.targetUnit);
  }

  destroy() {
    this.interactionTrigger && this.interactionTrigger.destroy();
    if (this.progressBar) {
      BlzSetSpecialEffectTimeScale(this.progressBar.bar, 500);
      this.progressBar.destroy();
    }
    this.interactionTrigger = undefined;
    this.interactable.onCancel && this.interactable.onCancel(this.unit, this.targetUnit);
  }
}