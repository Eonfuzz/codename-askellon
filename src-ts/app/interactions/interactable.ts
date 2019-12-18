import { InteractionModule } from "./interaction-module";

/** @noSelfInFile **/
export interface InteractableData {
  unitType: number;
  
  /**
   * Ran when the unit tries to interact, true allows the interactable effect to exist
   * Leave undefined for default allowed
   */
  condition?: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => boolean;

  action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => void;
}