import { InteractableData } from "./interactable-type";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../../lib/translators";
import { Unit } from "w3ts";
import { VENDING_MACHINE_TRIFEX } from "resources/unit-ids";
import { ITEM_TRIFEX_ID } from "resources/item-ids";
import { Interactables } from "./interactables";

// const vendingSound = new SoundRef("Sounds\\vendingMachineChunk.mp3", false);

export function initVendingInteraction() {
    const interaction: InteractableData = {
        action: (source: Unit, interactable: Unit) => {
            const pMoney = source.owner.getState(PLAYER_STATE_RESOURCE_GOLD);
            if (pMoney < 300) {
                PlayNewSoundOnUnit("Sounds\\DeniedBeep.mp3", interactable, 127);
                return false;
            }

            PlayNewSoundOnUnit("Sounds\\vendingMachineChunk.mp3", interactable, 127);
            source.owner.setState(PLAYER_STATE_RESOURCE_GOLD, pMoney-300);
            // vendingSound.playSoundOnUnit(source.handle, 127);

            // Create the item
            CreateItem(ITEM_TRIFEX_ID, interactable.x, interactable.y - 50);
        }
    }

    Interactables.set(VENDING_MACHINE_TRIFEX, interaction);
}