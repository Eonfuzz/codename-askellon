import { MapPlayer } from "w3ts/index";
import { SoundWithCooldown } from "app/types/sound-ref";

export interface ChatHook {
    who: MapPlayer, 
    recipients: MapPlayer[], 
    name: string, 
    color: string, 
    message: string,
    sound: SoundWithCooldown | undefined,

    // If false no otehr chat hooks can be processed
    doContinue: boolean
}