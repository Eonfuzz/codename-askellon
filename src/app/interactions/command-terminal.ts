/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { Game } from "app/game";
import { VENDING_MACHINE_TRIFEX, BRIDGE_CAPTAINS_TERMINAL } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_TRIFEX_ID } from "resources/item-ids";
import { Unit } from "w3ts/index";
import { Log } from "lib/serilog/serilog";

const firstTerminalSound = new SoundRef("Sounds\\Captain\\captain_welcome_online.mp3", false, true);
const terminalSounds = [
    new SoundRef("Sounds\\Captain\\captain_welcome.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help_2.mp3", false, true),
];

export function initCommandTerminal(game: Game) {
    let timesUsed = 0;

    const interaction: InteractableData = {
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {

            let sound = (timesUsed++ === 0) 
                ? firstTerminalSound 
                : terminalSounds[GetRandomInt(0, terminalSounds.length - 1)];

            if (GetLocalPlayer() === GetOwningPlayer(source.handle)) {
                sound.playSound();
            }

            // Now get unit to enter the askellon
            iModule.game.spaceModule.mainShip.onEnterShip(iModule.game, source);
        }
    }

    Interactables.set(BRIDGE_CAPTAINS_TERMINAL, interaction);
}