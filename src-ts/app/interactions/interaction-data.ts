/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";

export let Interactables = new Map<number, InteractableData>();


const healingFountainTest: InteractableData = {
    unitType: FourCC('nfoh'),
    action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
        SetUnitX(fromUnit, 0);
        SetUnitY(fromUnit, 0);
    }
}
Interactables.set(healingFountainTest.unitType, healingFountainTest);