import { Unit } from "w3ts/handles/unit";

export interface InteractableData { 

  hideInteractionBar?: boolean;

  /**
   * Ran when the unit tries to interact, true allows the interactable effect to exist
   * Leave undefined for default allowed
   */
  condition?: (fromUnit: Unit, targetUnit: Unit) => boolean;

  getInteractionTime?: (fromUnit: Unit, targetUnit: Unit) => number;
  getInteractionDistance?:  (fromUnit: Unit, targetUnit: Unit) => number;

  onStart?:  (fromUnit: Unit, targetUnit: Unit) => void;
  onCancel?:  (fromUnit: Unit, targetUnit: Unit) => void;

  action: (fromUnit: Unit, targetUnit: Unit) => void;
}