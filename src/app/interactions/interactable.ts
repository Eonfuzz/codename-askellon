import { InteractionModule } from "./interaction-module";
import { Unit } from "w3ts/handles/unit";

/** @noSelfInFile **/
export interface InteractableData { 

  hideInteractionBar?: boolean;

  /**
   * Ran when the unit tries to interact, true allows the interactable effect to exist
   * Leave undefined for default allowed
   */
  condition?: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => boolean;

  getInteractionTime?: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => number;
  getInteractionDistance?:  (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => number;

  onStart?:  (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;
  onCancel?:  (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;

  action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;
}