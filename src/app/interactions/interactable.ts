import { InteractionModule } from "./interaction-module";
import { Unit } from "w3ts/handles/unit";

/** @noSelfInFile **/
export interface InteractableData {
  /**
   * Not really used anywhere integeral
   * Totally optional
   */
  unitType?: number;
  
  /**
   * Ran when the unit tries to interact, true allows the interactable effect to exist
   * Leave undefined for default allowed
   */
  condition?: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => boolean;

  onStart?:  (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;
  onCancel?:  (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;

  action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => void;
}