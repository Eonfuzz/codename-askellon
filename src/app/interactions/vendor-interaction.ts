/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE } from "resources/strings";
import { Game } from "app/game";
import { VENDING_MACHINE_TRIFEX } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_TRIFEX_ID } from "resources/item-ids";

// const vendingSound = new SoundRef("Sounds\\vendingMachineChunk.mp3", false);

export function initVendingInteraction(game: Game) {
    const interaction: InteractableData = {
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
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