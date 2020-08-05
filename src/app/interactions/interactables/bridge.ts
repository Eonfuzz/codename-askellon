import { InteractableData } from "./interactable-type";
import { BRIDGE_CAPTAINS_TERMINAL } from "resources/unit-ids";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
// import { SpaceEntity } from "app/space/space-module";
import { Interactables } from "./interactables";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";

const firstTerminalSound = new SoundRef("Sounds\\Captain\\captain_welcome_online.mp3", false, true);
const terminalSounds = [
    new SoundRef("Sounds\\Captain\\captain_welcome.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help_2.mp3", false, true),
];

export function initCommandTerminal() {
    let timesUsed = 0;

    const interaction: InteractableData = {
        action: (source: Unit, interactable: Unit) => {

            let sound = (timesUsed++ === 0) 
                ? firstTerminalSound 
                : terminalSounds[GetRandomInt(0, terminalSounds.length - 1)];

            if (GetLocalPlayer() === GetOwningPlayer(source.handle)) {
                sound.playSound();
            }

            // Now get unit to enter the askellon
            // SpaceEntity.getInstance().mainShip.onEnterShip(source);
            EventEntity.send(EVENT_TYPE.INTERACT_BRIDGE_TERMINAL, { source: source });
        }
    }

    Interactables.set(BRIDGE_CAPTAINS_TERMINAL, interaction);
}