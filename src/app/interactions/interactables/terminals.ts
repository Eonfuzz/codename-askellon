
import { TERMINAL_RELIGION, TERMINAL_REACTOR, TERMINAL_WEAPONS, TERMINAL_MEDICAL, TERMINAL_GENE, TERMINAL_VOID, BRIDGE_CAPTAINS_TERMINAL, TERMINAL_PURGE, WORM_ALIEN_FORM, ZERGLING_ALIEN_FORM, ROACH_ALIEN_FORM, TERMINAL_SECURITY } from "resources/unit-ids";

import { Interactables } from "./interactables";
import { GeneEntity } from "app/shops/gene-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerState } from "app/force/player-type";
import { InteractableData } from "./interactable-type";
import { Unit } from "w3ts/index";

export const initInteractionTerminals = () => {
    
    let i = 0;1

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            // Log.Information("Using terminal");
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            EventEntity.send(EVENT_TYPE.INTERACT_TERMINAL, { source: fromUnit, data: { target: targetUnit }});
        }
    }
    Interactables.set(TERMINAL_WEAPONS, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_MEDICAL, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_GENE, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_VOID, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_RELIGION, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_REACTOR, upgradeTerminalProcessing);
    Interactables.set(BRIDGE_CAPTAINS_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_PURGE, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_SECURITY, upgradeTerminalProcessing);
}